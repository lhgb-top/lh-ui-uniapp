import { computed, getCurrentInstance, ref, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import {
  findTreeNode,
  flattenTree,
  getNodeCheckState,
  getTreeClassNames,
  getTreeNodeClassNames,
  isNodeLoadable,
  mergeLoadedChildren,
  moveTreeFocus,
  toggleCheckKeys,
} from '@lh-ui/share/core/tree'
import type { LhFlatTreeNode, LhTreeCheckState, LhTreeNode } from '@lh-ui/share/core/tree'
import { LH_KEYS, sxToStyle } from '@lh-ui/share/core/shared'
import { lhlocale } from '@/adapter/locale'
import type { LhEmitFn } from '@/types/emit'
import type { LhTreeResolvedProps } from './types'

/** 扁平节点 + 勾选态（渲染用的完整行数据） */
export type LhTreeFlatItem = LhFlatTreeNode & { checkState: LhTreeCheckState }

/**
 * 虚拟化行高：与 share 令牌 --lh-tree-node-height 的默认值 34px 对齐。
 * 开窗渲染按固定行高计算，要求节点内容单行不换行（share scss 的
 * .lh-tree-node__label 已带 nowrap + 省略号）。
 */
const LH_TREE_NODE_HEIGHT = 34
/** 上下额外渲染的缓冲行数，避免快速滚动瞬间出现空白 */
const LH_TREE_BUFFER = 4

/**
 * Tree 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】
 * - 展开 / 收起、复选框级联、懒加载合并等纯逻辑全部消费 share core 纯函数，零拷贝
 * - 键盘导航（↑↓←→ / Home / End / Enter / Space，APG tree 模式）仅 H5：
 *   处理函数体由条件编译裁剪，函数本身双端存在（模板 @keydown 绑定留在两端，
 *   MP 端无键盘事件不会触发）；roving tabindex 同样只在 H5 落值
 * - 大数据量场景提供虚拟化（uni-app 独有，plus 无此能力）：节点列表改由
 *   scroll-view 承载，按固定行高开窗渲染（可见区 + 上下缓冲），骨架占位
 *   用等高容器 + padding-top 偏移，H5 与 MP 行为一致
 */
export function useLhTree(
  props: LhTreeResolvedProps,
  emit: LhEmitFn<
    'update:expandedKeys' | 'update:selectedKeys' | 'update:checkedKeys' | 'select' | 'check' | 'expand' | 'nodeLoad'
  >,
) {
  const instance = getCurrentInstance()
  const scope = (instance?.proxy as ComponentPublicInstance | null) ?? null

  /** 展开态（受控 / 内部双模） */
  const innerExpanded = ref<string[]>([...props.defaultExpandedKeys])
  const expanded = computed(() => props.expandedKeys ?? innerExpanded.value)

  /** 选中态 */
  const innerSelected = ref<string[]>([...props.defaultSelectedKeys])
  const selected = computed(() => props.selectedKeys ?? innerSelected.value)

  /** 勾选态 */
  const innerChecked = ref<string[]>([...props.defaultCheckedKeys])
  const checked = computed(() => props.checkedKeys ?? innerChecked.value)

  /** ============ 懒加载 ============ */
  const loadedMap = ref<Record<string, LhTreeNode[]>>({})
  const loadingKeys = ref<string[]>([])

  const mergedData = computed(() => mergeLoadedChildren(props.data, loadedMap.value))

  /** 懒加载模式下展示树需要把已加载节点视为非叶子（子树已挂载则自然展开） */
  const flatNodes = computed<LhTreeFlatItem[]>(() =>
    flattenTree(mergedData.value, expanded.value).map((item) => ({
      ...item,
      checkState: getNodeCheckState(item.node, checked.value, props.checkStrictly),
    })),
  )

  /**
   * 发起懒加载：置 loading → 调 load 回调；resolve 写入 loadedMap 并展开，
   * reject / 同步异常取消 loading 且不展开。
   */
  function requestLoad(node: LhTreeNode): void {
    if (!props.load || loadingKeys.value.includes(node.key)) return
    loadingKeys.value = [...loadingKeys.value, node.key]
    const settle = (): void => {
      loadingKeys.value = loadingKeys.value.filter((k) => k !== node.key)
    }
    const resolve = (children: LhTreeNode[]): void => {
      settle()
      loadedMap.value = { ...loadedMap.value, [node.key]: children }
      if (!expanded.value.includes(node.key)) toggleExpand(node.key)
      emit('nodeLoad', node, children)
    }
    const reject = (): void => settle()
    try {
      props.load(node, resolve, reject)
    } catch {
      settle()
    }
  }

  // ============ 键盘焦点（roving tabindex，仅 H5 消费） ============

  const focusedKey = ref<string | null>(null)
  const tabbableKey = computed(() => {
    if (focusedKey.value && flatNodes.value.some((n) => n.key === focusedKey.value && !n.node.disabled)) {
      return focusedKey.value
    }
    const first = flatNodes.value.find((n) => !n.node.disabled)
    return first?.key ?? null
  })

  function toggleExpand(key: string): void {
    if (props.disabled) return
    // 懒加载：未加载的可加载节点先请求，加载成功后在 resolve 里展开
    const target = findTreeNode(mergedData.value, key)
    if (target && isNodeLoadable(target, !!props.lazy, Object.keys(loadedMap.value))) {
      requestLoad(target)
      return
    }
    const next = expanded.value.includes(key)
      ? expanded.value.filter((k) => k !== key)
      : [...expanded.value, key]
    innerExpanded.value = next
    emit('update:expandedKeys', next)
    emit('expand', key, next.includes(key))
  }

  function toggleSelect(key: string, node: LhTreeNode): void {
    if (props.disabled || node.disabled) return
    const next = props.multiple
      ? selected.value.includes(key)
        ? selected.value.filter((k) => k !== key)
        : [...selected.value, key]
      : [key]
    innerSelected.value = next
    emit('update:selectedKeys', next)
    emit('select', key, node)
  }

  function toggleCheck(key: string): void {
    if (props.disabled) return
    const next = toggleCheckKeys(mergedData.value, checked.value, key, {
      checkStrictly: props.checkStrictly,
    })
    innerChecked.value = next
    emit('update:checkedKeys', next)
    const node = flatNodes.value.find((n) => n.key === key)?.node
    if (node) emit('check', next, node)
  }

  function handleNodeClick(item: LhTreeFlatItem): void {
    if (props.disabled || item.node.disabled) return
    focusedKey.value = item.key
    if (!item.isLeaf && props.expandOnClickNode !== false) {
      toggleExpand(item.key)
    }
    toggleSelect(item.key, item.node)
  }

  /** 节点 tabindex（roving tabindex，仅 H5 落值；MP 端函数体由条件编译裁剪） */
  function nodeTabIndex(key: string, disabled: boolean): number {
    // #ifdef H5
    if (props.disabled || disabled) return -1
    return key === tabbableKey.value ? 0 : -1
    // #endif
    // MP 端无键盘焦点语义：函数体由条件编译裁剪为空，tabindex 绑定不落值
  }

  /** 勾选框的 aria-checked：半选输出 mixed */
  function checkedAria(state: LhTreeCheckState): 'true' | 'false' | 'mixed' {
    if (state === 'checked') return 'true'
    if (state === 'indeterminate') return 'mixed'
    return 'false'
  }

  /** 树容器类名 */
  const treeClasses = computed(() => getTreeClassNames({ showCheckbox: !!props.showCheckbox }))

  /** 树容器样式（sx 摊开 + aria-multiselectable 仅在 showCheckbox 时输出） */
  const treeStyle = computed(() => sxToStyle(props.sx ?? {}))
  const ariaMultiselectable = computed(() => props.showCheckbox || undefined)

  function nodeClasses(item: LhTreeFlatItem): string[] {
    return getTreeNodeClassNames({
      expanded: expanded.value.includes(item.key),
      selected: selected.value.includes(item.key),
      disabled: !!item.node.disabled,
      leaf: item.isLeaf,
    })
  }

  /** 焦点查询限定在组件根内：document 级查询在同页多棵树
   *  （key 相同很常见，如两棵部门树）时会把焦点落到别的实例 */
  function focusNode(key: string | null): void {
    if (!key) return
    focusedKey.value = key
    // #ifdef H5
    const el = scope?.$el as HTMLElement | null
    el?.querySelector<HTMLElement>(`[data-tree-key="${key}"]`)?.focus()
    // #endif
    // 虚拟化模式下把目标节点滚进可视区（scroll-top 由使用方滚轮双向更新，此处只锚定）
    if (props.virtual) scrollNodeIntoView(key)
  }

  /**
   * 树的键盘导航（APG tree pattern，仅 H5）
   *
   * 函数体由条件编译裁剪：MP 端无键盘事件，模板上的 @keydown 绑定留在两端，
   * MP 包内无死代码。
   */
  function onKeydown(event: KeyboardEvent): void {
    // #ifdef H5
    if (props.disabled) return
    const visible = flatNodes.value
    const current = focusedKey.value ?? tabbableKey.value

    const actions: Record<string, () => void> = {
      [LH_KEYS.ArrowDown]: () => focusNode(moveTreeFocus(visible, current, 1)),
      [LH_KEYS.ArrowUp]: () => focusNode(moveTreeFocus(visible, current, -1)),
      [LH_KEYS.Home]: () => focusNode(visible.find((n) => !n.node.disabled)?.key ?? null),
      [LH_KEYS.End]: () => focusNode([...visible].reverse().find((n) => !n.node.disabled)?.key ?? null),
      [LH_KEYS.ArrowRight]: () => {
        const item = visible.find((n) => n.key === current)
        if (!item) return
        if (!item.isLeaf && !expanded.value.includes(item.key)) toggleExpand(item.key)
        else if (!item.isLeaf) focusNode(moveTreeFocus(visible, current, 1))
      },
      [LH_KEYS.ArrowLeft]: () => {
        const item = visible.find((n) => n.key === current)
        if (!item) return
        if (!item.isLeaf && expanded.value.includes(item.key)) toggleExpand(item.key)
        else if (item.parentKey) focusNode(item.parentKey)
      },
      [LH_KEYS.Enter]: () => {
        const item = visible.find((n) => n.key === current)
        if (item) handleNodeClick(item)
      },
      [LH_KEYS.Space]: () => {
        const item = visible.find((n) => n.key === current)
        if (!item) return
        if (props.showCheckbox) toggleCheck(item.key)
        else handleNodeClick(item)
      },
    }

    const action = actions[event.key]
    if (!action) return
    event.preventDefault()
    action()
    // #endif
  }

  // ============ 虚拟化（uni-app 独有：大数据量开窗渲染） ============

  const scrollTop = ref(0)
  // scroll-view 的 scroll-top 锚点：仅在键盘导航需要把焦点节点滚进可视区时写入
  const anchorScrollTop = ref(0)

  const scrollHeight = computed(() => {
    const h = props.virtualHeight
    return typeof h === 'number' ? `${h}px` : h ?? '300px'
  })

  const totalCount = computed(() => flatNodes.value.length)

  const visibleStart = computed(() =>
    Math.max(0, Math.floor(scrollTop.value / LH_TREE_NODE_HEIGHT) - LH_TREE_BUFFER),
  )

  const visibleCount = computed(() => {
    const px = parseFloat(scrollHeight.value) || 300
    return Math.ceil(px / LH_TREE_NODE_HEIGHT) + LH_TREE_BUFFER * 2
  })

  const visibleEnd = computed(() => Math.min(totalCount.value, visibleStart.value + visibleCount.value))

  /** 实际渲染的行（非虚拟化模式为全量列表） */
  const renderNodes = computed(() =>
    props.virtual ? flatNodes.value.slice(visibleStart.value, visibleEnd.value) : flatNodes.value,
  )

  /** 等高骨架：总高度撑开滚动条，padding-top 把开窗切片平移到正确位置 */
  const phantomStyle = computed(() => ({
    height: `${totalCount.value * LH_TREE_NODE_HEIGHT}px`,
    paddingTop: `${visibleStart.value * LH_TREE_NODE_HEIGHT}px`,
  }))

  function onScroll(event: { detail: { scrollTop: number } }): void {
    scrollTop.value = event.detail.scrollTop
  }

  /** 把目标键所在行滚进可视区（仅在虚拟化模式生效） */
  function scrollNodeIntoView(key: string): void {
    const index = flatNodes.value.findIndex((n) => n.key === key)
    if (index < 0) return
    const top = index * LH_TREE_NODE_HEIGHT
    const viewport = (parseFloat(scrollHeight.value) || 300) - LH_TREE_NODE_HEIGHT
    if (top >= scrollTop.value && top <= scrollTop.value + viewport) return
    anchorScrollTop.value = Math.max(0, top - LH_TREE_NODE_HEIGHT * 2)
  }

  // 数据变化时清掉已不存在的焦点键与懒加载缓存
  watch(
    () => props.data,
    () => {
      if (focusedKey.value && !flatNodes.value.some((n) => n.key === focusedKey.value)) {
        focusedKey.value = null
      }
      loadedMap.value = {}
      loadingKeys.value = []
    },
  )

  const emptyText = computed(() => {
    void lhlocale.version.value
    return lhlocale.t('tree.empty', '暂无数据')
  })

  return {
    flatNodes,
    loadingKeys,
    treeClasses,
    treeStyle,
    ariaMultiselectable,
    renderNodes,
    phantomStyle,
    scrollHeight,
    anchorScrollTop,
    emptyText,
    expanded,
    selected,
    checked,
    nodeClasses,
    nodeTabIndex,
    checkedAria,
    toggleExpand,
    toggleCheck,
    handleNodeClick,
    onKeydown,
    onScroll,
  }
}
