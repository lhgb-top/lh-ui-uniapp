import { computed, getCurrentInstance, nextTick, ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import {
  filterTransferItems,
  getTransferCheckAllState,
  getTransferClassNames,
  getTransferPanelClassNames,
  moveTransferKeys,
  partitionTransferData,
  toggleTransferChecked,
  toggleTransferCheckAll,
} from '@lh-ui/share/core/transfer'
import type { LhTransferItem, LhTransferSide } from '@lh-ui/share/core/transfer'
import {
  sxToStyle,
  LH_KEYS,
  getNextListIndex,
  isActivationKey,
  isArrowKey,
  isEscapeKey,
} from '@lh-ui/share/core/shared'
import { lhlocale } from '@/adapter/locale'
import type { LhEmitFn } from '@/types/emit'
import type { LhTransferResolvedProps } from './types'

/** uni 的 input 事件载荷在 event.detail.value（H5 原生 input 事件没有 detail） */
type LhUniInputEvent = { detail: { value: string } }

/**
 * Transfer 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】
 * - 分区 / 过滤 / 全选 / 移动等纯逻辑全部消费 share core 纯函数（partitionTransferData /
 *   filterTransferItems / toggleTransferCheckAll / moveTransferKeys 等），零拷贝
 * - 双列列表改由 scroll-view 承载（MP 端 view 无可靠溢出滚动），列表项换成 view
 * - 勾选框换成 lh-checkbox（view 自绘，受控写入）；plus 的原生 checkbox 在 MP 样式不可控
 * - 键盘导航（listbox 模式：上下方向键列表内移动、左右方向键跨面板跳焦、
 *   Enter / Space 勾选、Escape 重置焦点）仅 H5：处理函数体由条件编译裁剪，
 *   函数本身双端存在（模板 @keydown 绑定留在两端，MP 端无键盘事件不会触发）；
 *   roving tabindex 同样只在 H5 落值
 */
export function useLhTransfer(
  props: LhTransferResolvedProps,
  emit: LhEmitFn<'update:modelValue' | 'change'>,
) {
  const instance = getCurrentInstance()
  const scope = (instance?.proxy as ComponentPublicInstance | null) ?? null

  /** 左侧（源）键即受控值；未传时内部兜底为全量在右 */
  const innerSourceKeys = ref<Array<string | number>>([])
  const sourceKeys = computed(() =>
    props.modelValue !== undefined && Array.isArray(props.modelValue)
      ? props.modelValue
      : props.modelValue == null
        ? innerSourceKeys.value
        : [],
  )

  const checkedKeys = ref<Array<string | number>>([])
  const leftQuery = ref('')
  const rightQuery = ref('')

  const partitioned = computed(() => partitionTransferData(props.data, sourceKeys.value))
  const leftItems = computed(() => partitioned.value.left)
  const rightItems = computed(() => partitioned.value.right)
  const filteredLeft = computed(() => filterTransferItems(leftItems.value, leftQuery.value))
  const filteredRight = computed(() => filterTransferItems(rightItems.value, rightQuery.value))

  const leftAllState = computed(() => getTransferCheckAllState(checkedKeys.value, leftItems.value))
  const rightAllState = computed(() => getTransferCheckAllState(checkedKeys.value, rightItems.value))

  const leftCheckedCount = computed(() =>
    leftItems.value.filter((item) => checkedKeys.value.includes(item.key) && !item.disabled).length,
  )
  const rightCheckedCount = computed(() =>
    rightItems.value.filter((item) => checkedKeys.value.includes(item.key) && !item.disabled).length,
  )

  /** uni 的 input 事件载荷取 detail.value（H5 端 uni-input 同样走该通道） */
  function onQueryInput(side: LhTransferSide, e: Event): void {
    const value = (e as unknown as LhUniInputEvent).detail.value
    if (side === 'left') leftQuery.value = value
    else rightQuery.value = value
  }

  function toggleItem(item: LhTransferItem): void {
    if (props.disabled || item.disabled) return
    checkedKeys.value = toggleTransferChecked(checkedKeys.value, item.key)
  }

  function checkAll(side: LhTransferSide): void {
    if (props.disabled) return
    const items = side === 'left' ? leftItems.value : rightItems.value
    checkedKeys.value = toggleTransferCheckAll(checkedKeys.value, items)
  }

  function move(direction: 'left-to-right' | 'right-to-left'): void {
    if (props.disabled) return
    const next = moveTransferKeys(sourceKeys.value, props.data, checkedKeys.value, direction)
    innerSourceKeys.value = next
    emit('update:modelValue', next)
    emit('change', next, direction)
    checkedKeys.value = []
  }

  // ============ 键盘焦点（roving tabindex，仅 H5 消费） ============
  //
  // roving tabindex：每个面板只有一个 option 可 Tab 进入，其余 -1。
  // 焦点跟着「最近勾选项」走：勾选后焦点停在被勾项，符合「空格勾选 → 继续移动」的
  // 键盘操作心智；无勾选时落在首项。

  const leftFocusIndex = ref(-1)
  const rightFocusIndex = ref(-1)

  function focusIndex(side: LhTransferSide) {
    return side === 'left' ? leftFocusIndex : rightFocusIndex
  }

  function listItems(side: LhTransferSide): LhTransferItem[] {
    return side === 'left' ? filteredLeft.value : filteredRight.value
  }

  /** 最近勾选项位置，没有则首项 */
  function anchorIndex(side: LhTransferSide): number {
    const items = listItems(side)
    const lastChecked = items.findIndex((item) => checkedKeys.value.includes(item.key))
    return lastChecked >= 0 ? lastChecked : 0
  }

  function resolveFocus(side: LhTransferSide): number {
    const items = listItems(side)
    const idx = focusIndex(side).value
    if (idx >= 0 && idx < items.length) return idx
    // 锚点项被禁用时（如 disabled 项排在最前）回落到首个可用项，保证每列总有 tab 落点
    if (items[anchorIndex(side)]?.disabled) {
      return getNextListIndex(items, -1, 'first', {
        loop: false,
        isDisabled: (item) => !!item.disabled,
      })
    }
    return anchorIndex(side)
  }

  /** 列表项 tabindex（roving tabindex，仅 H5 落值；MP 端函数体由条件编译裁剪） */
  function itemTabIndex(side: LhTransferSide, index: number, itemDisabled: boolean): number {
    // #ifdef H5
    if (props.disabled || itemDisabled) return -1
    return index === resolveFocus(side) ? 0 : -1
    // #endif
    // MP 端无键盘焦点语义：函数体由条件编译裁剪为空，tabindex 绑定不落值
  }

  function resetFocus(side: LhTransferSide): void {
    focusIndex(side).value = -1
  }

  /**
   * 列表项键盘导航（listbox 模式，仅 H5）
   *
   * 函数体由条件编译裁剪：MP 端无键盘事件，模板上的 @keydown 绑定留在两端，
   * MP 包内无死代码。
   *
   * - 上下方向键在过滤后的列表内移动焦点（跳过禁用项，不循环）
   * - Enter / Space 勾选当前项（与点击等价）
   * - 左右方向键在两面板间跳焦：左列表右移到右列表，右列表左移回左列表
   * - Escape 重置焦点（回到锚点）
   */
  function onItemKeydown(e: KeyboardEvent, side: LhTransferSide, index: number): void {
    // #ifdef H5
    if (props.disabled) return
    if (isEscapeKey(e)) {
      e.preventDefault()
      resetFocus(side)
      return
    }
    if (isActivationKey(e)) {
      e.preventDefault()
      const item = listItems(side)[index]
      if (item) toggleItem(item)
      return
    }
    if (!isArrowKey(e)) return
    e.preventDefault()

    // 左右方向键跨面板跳焦
    if (e.key === LH_KEYS.ArrowRight && side === 'left') {
      resetFocus('left')
      focusPanel('right')
      return
    }
    if (e.key === LH_KEYS.ArrowLeft && side === 'right') {
      resetFocus('right')
      focusPanel('left')
      return
    }

    // 上下方向键：列表内移动（纵向）
    const isDown = e.key === LH_KEYS.ArrowDown
    const next = getNextListIndex(listItems(side), index, isDown ? 1 : -1, {
      loop: false,
      isDisabled: (item) => !!item.disabled,
    })
    if (next !== index) focusIndex(side).value = next
    // #endif
  }

  /**
   * 把焦点移到目标面板的可 Tab 项
   *
   * 焦点查询限定在组件根内：document 级查询在同页多个穿梭框
   * （key 相同很常见）时会把焦点落到别的实例
   */
  function focusPanel(side: LhTransferSide): void {
    nextTick(() => {
      // #ifdef H5
      const el = scope?.$el as HTMLElement | null
      el?.querySelector<HTMLElement>(
        `.lh-transfer-panel--${side} .lh-transfer-panel__item[tabindex="0"]`,
      )?.focus()
      // #endif
      void side
    })
  }

  // ============ 文案（订阅 share locale 响应式版本号） ============

  const sourceTitleText = computed(() => {
    void lhlocale.version.value
    return lhlocale.t('transfer.sourceTitle', '列表一')
  })
  const targetTitleText = computed(() => {
    void lhlocale.version.value
    return lhlocale.t('transfer.targetTitle', '列表二')
  })
  const moveRightText = computed(() => {
    void lhlocale.version.value
    return lhlocale.t('transfer.moveRight', '移到右侧')
  })
  const moveLeftText = computed(() => {
    void lhlocale.version.value
    return lhlocale.t('transfer.moveLeft', '移到左侧')
  })
  const searchPlaceholderText = computed(() => {
    void lhlocale.version.value
    return lhlocale.t('transfer.searchPlaceholder', '请输入搜索内容')
  })
  const emptyText = computed(() => {
    void lhlocale.version.value
    return lhlocale.t('transfer.empty', '暂无数据')
  })

  const transferClasses = computed(() => getTransferClassNames({ disabled: !!props.disabled }))

  const transferStyle = computed(() => sxToStyle(props.sx ?? {}))

  const panelClasses = (side: LhTransferSide) => getTransferPanelClassNames(side)

  return {
    leftQuery,
    rightQuery,
    checkedKeys,
    leftItems,
    rightItems,
    filteredLeft,
    filteredRight,
    leftAllState,
    rightAllState,
    leftCheckedCount,
    rightCheckedCount,
    sourceTitleText,
    targetTitleText,
    moveRightText,
    moveLeftText,
    searchPlaceholderText,
    emptyText,
    transferClasses,
    transferStyle,
    panelClasses,
    onQueryInput,
    toggleItem,
    checkAll,
    move,
    itemTabIndex,
    onItemKeydown,
  }
}
