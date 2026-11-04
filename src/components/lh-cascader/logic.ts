import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import {
  findNode,
  findPathByValues,
  getPanelItems,
  expandLastValue,
  normalizeCascaderNodes,
  searchNodes,
  getCascaderTriggerAria,
} from '@lh-ui/share/core/cascader'
import type {
  LhCascaderNode,
  LhCascaderPanelItem,
  LhCascaderSearchResult,
} from '@lh-ui/share/core/cascader'
import { getSize } from '@lh-ui/share/core/button'
import {
  getNextListIndex,
  isActivationKey,
  isArrowKey,
  isEscapeKey,
  LH_KEYS,
} from '@lh-ui/share/core/shared'
import { useLhComponent, useLhOverlayStack, useLhPopperIds, useLhZIndex } from '@/composables'
import { useLhPopper } from '@/adapter/popper'
import { lhlocale } from '@/adapter/locale'
import type { LhEmitFn } from '@/types/emit'
import type { LhCascaderProps } from './types'

/**
 * Cascader 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】
 * - 弹层定位用 useLhPopper（getLhRect 异步度量 → computePosition → 显示，两帧防闪烁），
 *   面板由 lh-root-portal 承载；多列改用 scroll-view 纵向滚动（MP 的 view 无可靠溢出滚动）
 * - 键盘导航（↑↓ 列内 / ←→ 跨列 / Enter / Escape）仅 H5：处理函数体由条件编译裁剪，
 *   函数本身双端存在（模板 @keydown 绑定留在两端，MP 端无键盘事件不会触发）
 * - cascading 悬停展开仅 H5 有效：MP 端无 hover 语义，子级展开走点击
 * - filterable 的过滤输入框放在弹层内（与 select 同款），搜索结果走 share 的 searchNodes
 * - 点击外部关闭由页内透明遮罩承载（等价 plus 的 useLhClickOutside）
 */
export function useLhCascader(
  props: LhCascaderProps,
  emit: LhEmitFn<'update:modelValue' | 'change'>,
) {
  const { componentStyle, configContext } = useLhComponent('cascader', props)

  const instance = getCurrentInstance()
  const scope = (instance?.proxy as ComponentPublicInstance) ?? null

  const { triggerId, popperId } = useLhPopperIds('cascader')

  const { nextZIndex } = useLhZIndex()
  // 弹层打开顺序栈：多弹层叠加时 Esc 只关栈顶（与 Dialog / Popover / Dropdown 共用）
  const overlay = useLhOverlayStack()
  const zIndex = ref(nextZIndex())

  const visible = ref(false)
  const filterText = ref('')

  // expandedValues[i + 1] 是第 i 列被展开节点的完整值路径，其末位即第 i + 1 列的数据源
  const expandedValues = ref<(string | number)[][]>([[]])

  // 多选内部态：每条选中项的完整值路径
  const multiSelected = ref<(string | number)[][]>([])

  // 每列的键盘焦点锚点（roving tabindex，仅 H5 消费）
  const columnFocusIndex = ref<Record<number, number>>({})

  const effectiveSize = computed(() => getSize(props.size, configContext?.value.size))

  // itemConfig 字段别名归一化：后续逻辑统一消费标准结构（与 plus 同款）
  const resolvedOptions = computed(() =>
    normalizeCascaderNodes(props.options ?? [], props.itemConfig ?? {}),
  )

  // —— 弹层定位（两帧度量：面板先隐藏渲染 → 量尺寸 → 定位 → 显示）——
  const { popperStyle, update: updatePopper } = useLhPopper(
    `#${triggerId}`,
    `#${popperId}`,
    scope,
    { placement: 'bottom' },
  )

  /**
   * 级联面板列（与 plus 的 panels 计算同构）
   *
   * expandedValues[i + 1] 的末位节点决定第 i + 1 列的数据源；
   * 长度不足或数据耗尽时停止追加列
   */
  const panels = computed(() => {
    const result: { items: LhCascaderPanelItem[] }[] = []
    let currentNodes = resolvedOptions.value

    for (let i = 0; i < expandedValues.value.length && currentNodes.length; i++) {
      const items = getPanelItems(currentNodes, new Set(expandedValues.value[i + 1] || []))
      result.push({ items })

      const nextPath = expandedValues.value[i + 1] || []
      if (nextPath.length) {
        const node = findNode(currentNodes, nextPath[nextPath.length - 1])
        currentNodes = node?.node.children ?? []
      } else {
        break
      }
    }

    return result
  })

  /** 搜索结果（share 的 searchNodes：大小写不敏感、默认上限 50 条） */
  const searchResults = computed(() => {
    if (!props.filterable || !filterText.value) return []
    return searchNodes(resolvedOptions.value, filterText.value.trim())
  })

  const isFiltering = computed(() => props.filterable && filterText.value.trim().length > 0)

  /** 文案国际化（lhlocale.t 内部已订阅版本号，切换语言自动重算） */
  const placeholderText = computed(() =>
    props.placeholder || lhlocale.t('cascader.placeholder', '请选择'),
  )
  const filterPlaceholder = computed(() => lhlocale.t('cascader.filter', '搜索'))
  const noMatchText = computed(() => lhlocale.t('cascader.noMatch', '无匹配数据'))
  const panelLabel = computed(() => lhlocale.t('cascader.panelLabel', '请选择级联选项'))
  /** 各列 listbox 的 aria-label（第 N 级，走 locale 插值） */
  function columnLabel(panelIndex: number): string {
    return lhlocale.t('cascader.columnLabel', { n: panelIndex + 1 })
  }

  function open() {
    if (props.disabled || props.readonly || visible.value) return
    visible.value = true
  }

  function close() {
    if (!visible.value) return
    visible.value = false
    filterText.value = ''
    columnFocusIndex.value = {}
  }

  function toggleOpen() {
    if (visible.value) close()
    else open()
  }

  // 弹层打开时取新 z-index、注册顺序栈并两帧度量定位；关闭时出栈
  watch(visible, (val) => {
    if (val) {
      zIndex.value = nextZIndex()
      overlay.register()
      nextTick(() => updatePopper())
    } else {
      overlay.unregister()
    }
  })

  onMounted(() => {
    // 初始 visible=true：watch 不会触发，补上顺序栈注册与两帧度量（对齐 Popover 的初始值处理）
    if (!visible.value) return
    zIndex.value = nextZIndex()
    overlay.register()
    nextTick(() => updatePopper())
  })

  // —— 选中逻辑（与 plus 同构）——

  /** 点击列项：有子级且未展开时先展开（checkStrictly 下直接选中） */
  function onItemClick(panelIndex: number, item: LhCascaderPanelItem) {
    if (item.isDisabled) return

    const currentPath = expandedValues.value[panelIndex] || []
    const shouldExpand = item.hasChildren && !item.isExpanded && !props.checkStrictly

    if (shouldExpand) {
      // 替换该列的展开路径，收起更深的列
      expandedValues.value = [
        ...expandedValues.value.slice(0, panelIndex + 1),
        [...currentPath, item.value],
      ]
      return
    }

    selectNode([...currentPath, item.value])
  }

  /** 悬停展开（cascading 模式，仅 H5 有 hover 语义） */
  function onItemHover(panelIndex: number, item: LhCascaderPanelItem) {
    // #ifdef H5
    if (!props.cascading) return
    const currentPath = expandedValues.value[panelIndex] || []
    expandedValues.value = [
      ...expandedValues.value.slice(0, panelIndex + 1),
      [...currentPath, item.value],
    ]
    // #endif
  }

  function selectNode(fullPath: (string | number)[]) {
    if (props.multiple) {
      const exists = multiSelected.value.some((v) => v.join(',') === fullPath.join(','))
      if (exists) return
      multiSelected.value.push(fullPath)
      const values = multiSelected.value.map((v) => v[v.length - 1])
      emit('update:modelValue', values)
      emit('change', values, null)
      return
    }

    const value = props.emitPath ? fullPath : [fullPath[fullPath.length - 1]]
    emit('update:modelValue', value)
    const pathResult = findPathByValues(resolvedOptions.value, fullPath)
    emit('change', value, pathResult?.nodes ?? null)
    close()
  }

  function selectSearchResult(result: LhCascaderSearchResult) {
    selectNode(result.path)
    filterText.value = ''
  }

  function handleClear() {
    if (props.disabled || props.readonly) return
    emit('update:modelValue', [])
    emit('change', [], null)
    multiSelected.value = []
    filterText.value = ''
    expandedValues.value = [[]]
    close()
  }

  /** 点击遮罩关闭（等价 plus 的点击外部关闭） */
  function handleMaskClick() {
    close()
  }

  /** 第 panelIndex 列中处于展开链上的项（记录在 expandedValues[panelIndex + 1] 的末位） */
  function isPanelActive(panelIndex: number, value: string | number): boolean {
    const nextPath = expandedValues.value[panelIndex + 1] || []
    return nextPath.length > 0 && nextPath[nextPath.length - 1] === value
  }

  function isSelected(pathValues: (string | number)[]): boolean {
    if (props.multiple) {
      return multiSelected.value.some((v) => v.join(',') === pathValues.join(','))
    }
    if (!props.modelValue?.length) return false
    // emitPath=false 时绑定的是末级值，还原成完整路径再比较
    const current = props.emitPath
      ? props.modelValue
      : (expandLastValue(resolvedOptions.value, props.modelValue[0]) ?? props.modelValue)
    return JSON.stringify(current) === JSON.stringify(pathValues)
  }

  // —— 回显 —— //

  /** 按值解析节点路径；emitPath=false 时从叶值还原完整路径 */
  function resolvePathNodes(values: (string | number)[]): LhCascaderNode[] | null {
    const direct = findPathByValues(resolvedOptions.value, values)
    if (direct) return direct.nodes
    if (values.length === 1) {
      const expanded = expandLastValue(resolvedOptions.value, values[0])
      if (expanded) return findPathByValues(resolvedOptions.value, expanded)?.nodes ?? null
    }
    return null
  }

  const displayValue = computed(() => {
    // 过滤态显示用户输入；多选用标签展示，触发器正文留空
    if (isFiltering.value) return filterText.value
    if (props.multiple) return ''
    if (props.modelValue?.length) {
      const nodes = resolvePathNodes(props.modelValue)
      if (nodes) {
        return props.showAllLevels
          ? nodes.map((n) => n.label).join(props.separator)
          : nodes[nodes.length - 1].label
      }
    }
    return ''
  })

  const showTags = computed(() => props.multiple && multiSelected.value.length > 0)

  const visibleTags = computed(() => {
    const tags = multiSelected.value.map((path) => {
      const result = findPathByValues(resolvedOptions.value, path)
      return result?.nodes.map((n) => n.label).join(props.separator) || String(path[path.length - 1])
    })
    if (props.collapseTags) return tags.slice(0, 1)
    return tags
  })

  const showTagMore = computed(
    () => props.collapseTags && multiSelected.value.length > visibleTags.value.length,
  )

  // 折叠标签的「+N」计数用：模板里显示 multiSelected.length - visibleTags.length
  const multiSelectedCount = computed(() => multiSelected.value.length)

  const showClear = computed(() => {
    return (
      props.clearable &&
      !props.disabled &&
      !props.readonly &&
      ((props.multiple && multiSelected.value.length > 0) ||
        (!props.multiple && (props.modelValue?.length ?? 0) > 0))
    )
  })

  // 受控 modelValue 同步多选内部态（受控清空也要落到内部态，否则已选标签残留）
  watch(
    () => props.modelValue,
    (newVal) => {
      if (!props.multiple) return
      if (!newVal || newVal.length === 0) {
        multiSelected.value = []
        return
      }
      multiSelected.value = newVal.map((v) => {
        const expanded = expandLastValue(resolvedOptions.value, v)
        return expanded || [v]
      })
    },
    { immediate: true },
  )

  // —— 类名与样式 —— //

  const cascaderClass = computed(() => {
    const list = ['lh-cascader', `lh-cascader--${effectiveSize.value}`]
    if (visible.value) list.push('lh-cascader--visible')
    if (props.disabled) list.push('lh-cascader--disabled')
    if (props.readonly) list.push('lh-cascader--readonly')
    if (props.filterable) list.push('lh-cascader--filterable')
    if (props.multiple) list.push('lh-cascader--multiple')
    if (props.customClass) list.push(props.customClass)
    return list
  })

  const cascaderStyle = computed(() => componentStyle.value)

  const mergedPopperStyle = computed(() => ({
    ...popperStyle.value,
    zIndex: String(zIndex.value),
  }))

  // —— 无障碍（share 纯函数产出的属性包，逐键摊开绑定——MP 模板不支持 v-bind 对象）—— //
  const triggerAria = computed(() => getCascaderTriggerAria(visible.value, popperId))
  const ariaExpanded = computed(() => {
    const value = triggerAria.value['aria-expanded']
    return value === true || value === 'true'
  })
  const ariaHaspopup = computed(() => {
    const value = triggerAria.value['aria-haspopup']
    // Vue 的 aria-haspopup 类型是字面量联合，share 包的宽值域在此收窄
    return typeof value === 'string'
      ? (value as 'dialog' | 'menu' | 'tree' | 'listbox' | 'grid' | 'true' | 'false')
      : undefined
  })
  const ariaControls = computed(() => {
    const value = triggerAria.value['aria-controls']
    return typeof value === 'string' ? value : undefined
  })

  // —— 键盘导航（仅 H5：函数体由条件编译裁剪，函数本身双端存在）—— //

  /** 每列的可 Tab 焦点锚点：展开链上的项，无展开时取首项 */
  function resolveColumnFocus(panelIndex: number): number {
    const items = panels.value[panelIndex]?.items ?? []
    const explicit = columnFocusIndex.value[panelIndex]
    if (explicit !== undefined && explicit >= 0 && explicit < items.length) return explicit
    const expandedIdx = items.findIndex((it) => isPanelActive(panelIndex, it.value))
    return expandedIdx >= 0 ? expandedIdx : 0
  }

  function itemTabIndex(panelIndex: number, index: number): number {
    // #ifdef H5
    return index === resolveColumnFocus(panelIndex) ? 0 : -1
    // #endif
    // MP 端无键盘焦点语义：函数体由条件编译裁剪为空，tabindex 绑定不落值
  }

  function focusColumnItem(panelIndex: number): void {
    // #ifdef H5
    nextTick(() => {
      const popover = document.getElementById(popperId)
      const columns = popover?.querySelectorAll<HTMLElement>('.lh-cascader-panel__column')
      const items = columns?.[panelIndex]?.querySelectorAll<HTMLElement>('.lh-cascader-panel__item')
      items?.[resolveColumnFocus(panelIndex)]?.focus()
    })
    // #endif
  }

  /** 列项键盘：↑↓ 列内移动（跳过禁用项）、←→ 跨列、Enter/Space 等价点击、Escape 关闭 */
  function onItemKeydown(event: KeyboardEvent, panelIndex: number, index: number): void {
    // #ifdef H5
    if (props.disabled) return
    if (isEscapeKey(event)) {
      event.preventDefault()
      close()
      return
    }
    if (isActivationKey(event)) {
      event.preventDefault()
      const item = panels.value[panelIndex]?.items[index]
      if (item) onItemClick(panelIndex, item)
      return
    }
    if (!isArrowKey(event)) return
    event.preventDefault()

    if (event.key === LH_KEYS.ArrowRight || event.key === LH_KEYS.ArrowLeft) {
      const next = event.key === LH_KEYS.ArrowRight ? panelIndex + 1 : panelIndex - 1
      if (next >= 0 && next < panels.value.length) focusColumnItem(next)
      return
    }

    const items = panels.value[panelIndex]?.items ?? []
    const next = getNextListIndex(items, index, event.key === LH_KEYS.ArrowDown ? 1 : -1, {
      loop: false,
      isDisabled: (item) => !!item.isDisabled,
    })
    if (next !== index) {
      columnFocusIndex.value = { ...columnFocusIndex.value, [panelIndex]: next }
      focusColumnItem(panelIndex)
    }
    // #endif
  }

  /** 触发器键盘：Enter/Space 开合、方向键打开并把焦点送进面板、Escape 关闭 */
  function onTriggerKeydown(event: KeyboardEvent): void {
    // #ifdef H5
    if (props.disabled || props.readonly) return
    if (isEscapeKey(event)) {
      if (visible.value) {
        event.preventDefault()
        close()
      }
      return
    }
    if (isActivationKey(event)) {
      event.preventDefault()
      toggleOpen()
      return
    }
    if (!isArrowKey(event)) return
    event.preventDefault()
    // 过滤态无级联列，不抢焦
    if (isFiltering.value) return
    if (!visible.value) open()
    const last = panels.value.length - 1
    if (event.key === LH_KEYS.ArrowDown || event.key === LH_KEYS.ArrowRight) {
      focusColumnItem(0)
    } else {
      focusColumnItem(last)
    }
    // #endif
  }

  // #ifdef H5
  /**
   * Esc 关闭（面板自身可能没有焦点，补一层文档监听）。
   * 整段只在 H5 保留：小程序无 document，也无键盘事件。
   */
  function onDocumentKeydown(event: KeyboardEvent) {
    if (!isEscapeKey(event) || !visible.value) return
    // 多弹层叠加时只有栈顶响应（与 Dialog / Popover / Dropdown 共用顺序栈）
    if (!overlay.isTopmost()) return
    close()
  }

  onMounted(() => {
    document.addEventListener('keydown', onDocumentKeydown)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onDocumentKeydown)
  })
  // #endif

  return {
    triggerId,
    popperId,
    visible,
    popperStyle: mergedPopperStyle,
    filterText,
    panels,
    searchResults,
    isFiltering,
    placeholderText,
    filterPlaceholder,
    noMatchText,
    panelLabel,
    columnLabel,
    displayValue,
    showTags,
    visibleTags,
    showTagMore,
    multiSelectedCount,
    showClear,
    cascaderClass,
    cascaderStyle,
    ariaExpanded,
    ariaHaspopup,
    ariaControls,
    isPanelActive,
    isSelected,
    itemTabIndex,
    toggleOpen,
    onItemClick,
    onItemHover,
    onItemKeydown,
    onTriggerKeydown,
    selectSearchResult,
    handleClear,
    handleMaskClick,
    open,
    close,
  }
}
