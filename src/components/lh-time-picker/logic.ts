import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import {
  clampTimeValue,
  createDateTime,
  extractTime,
  filterTimeColumnByRange,
  formatTime,
  generateTimeColumn,
  getHourRange,
  getTimePickerTriggerAria,
  isValidTime,
  wrapTimeValueInRange,
} from '@lh-ui/share/core/time-picker'
import { getSize } from '@lh-ui/share/core/button'
import { isActivationKey, isEscapeKey, LH_KEYS } from '@lh-ui/share/core/shared'
import { useLhComponent, useLhOverlayStack, useLhPopperIds, useLhZIndex } from '@/composables'
import { useLhPopper } from '@/adapter/popper'
import { lhlocale } from '@/adapter/locale'
import type { LhEmitFn } from '@/types/emit'
import type { LhTimePickerResolvedProps } from './types'

type TimeColumnType = 'hour' | 'minute' | 'second'

/**
 * TimePicker 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】
 * - 弹层定位用 useLhPopper（getLhRect 异步度量 → computePosition → 显示，两帧防闪烁），
 *   面板由 lh-root-portal 承载
 * - MP 端滚轮改为 scroll-view 列面板：每列（时/分/秒）一个 scroll-view 纵向滚动，
 *   选中项由 scroll-into-view 自动滚入视口（MP 无 scrollIntoView API）；
 *   点击列项即选中，底部「此刻 / 确定」与 plus 同款
 * - 键盘导航（↑↓ 列内步进 / ←→ 跨列跳焦 / Enter 确认 / Escape 关闭）仅 H5：
 *   处理函数体由条件编译裁剪，函数本身双端存在（模板 @keydown 绑定留在两端，
 *   MP 端无键盘事件不会触发）
 * - plus 的滚轮步进（@wheel.prevent 拦截后按 step 步进）未移植：列内滚动交给
 *   scroll-view 原生滚动（H5 端滚轮自然滚动列表），步进改由点击选项或 H5 键盘完成
 * - arrowControl 的箭头按钮仅渲染在 H5（MP 无键盘步进语义，不输出死代码）
 * - 点击外部关闭由页内透明遮罩承载（等价 plus 的文档级点击监听）
 */
export function useLhTimePicker(
  props: LhTimePickerResolvedProps,
  emit: LhEmitFn<'update:modelValue' | 'change'>,
) {
  const { componentStyle, configContext } = useLhComponent('time-picker', props)

  const instance = getCurrentInstance()
  const scope = (instance?.proxy as ComponentPublicInstance) ?? null

  const { triggerId, popperId } = useLhPopperIds('time-picker')

  const { nextZIndex } = useLhZIndex()
  // 弹层打开顺序栈：多弹层叠加时 Esc 只关栈顶（与 Dialog / Popover / Cascader 共用）
  const overlay = useLhOverlayStack()
  const zIndex = ref(nextZIndex())

  const visible = ref(false)
  const hour = ref(0)
  const minute = ref(0)
  const second = ref(0)
  const selecting = ref<TimeColumnType | null>(null)

  const effectiveSize = computed(() => getSize(props.size, configContext?.value.size))

  // format 含 ss 才渲染秒列（与 plus 同源）
  const showSecond = computed(() => props.format.includes('ss'))

  // 小时列有效范围：start/end 与 0~23 求交集（默认 0~24 为全量程，行为不变）
  const hourRange = computed(() => getHourRange(props.start, props.end))

  const hoursOption = computed(() =>
    filterTimeColumnByRange(
      generateTimeColumn('hour', props.stepHour),
      hourRange.value.start,
      hourRange.value.end,
    ).map((c) => ({
      ...c,
      isSelected: c.value === hour.value,
    })),
  )

  const minutesOption = computed(() =>
    generateTimeColumn('minute', props.stepMinute).map((c) => ({
      ...c,
      isSelected: c.value === minute.value,
    })),
  )

  const secondsOption = computed(() =>
    generateTimeColumn('second', props.stepSecond).map((c) => ({
      ...c,
      isSelected: c.value === second.value,
    })),
  )

  // 各列当前选中项的节点 id：scroll-view 的 scroll-into-view 滚动目标
  const hourScrollTarget = computed(() => `${popperId}-hour-${hour.value}`)
  const minuteScrollTarget = computed(() => `${popperId}-minute-${minute.value}`)
  const secondScrollTarget = computed(() => `${popperId}-second-${second.value}`)

  const formatDisplay = computed(() =>
    formatTime(hour.value, minute.value, second.value, props.format),
  )

  /** 占位符：优先 props.placeholder，否则按 format 把 HH/mm/ss 转成语言包的时/分/秒 */
  const placeholderText = computed(() => {
    if (props.placeholder) return props.placeholder
    return props.format
      .replace('HH', lhlocale.t('timepicker.hour', '时'))
      .replace('mm', lhlocale.t('timepicker.minute', '分'))
      .replace('ss', lhlocale.t('timepicker.second', '秒'))
  })

  const panelLabel = computed(() => lhlocale.t('timepicker.panelLabel', '选择时间'))
  const hourLabel = computed(() => lhlocale.t('timepicker.hourLabel', '小时'))
  const minuteLabel = computed(() => lhlocale.t('timepicker.minuteLabel', '分钟'))
  const secondLabel = computed(() => lhlocale.t('timepicker.secondLabel', '秒'))
  const hourTitle = computed(() => lhlocale.t('timepicker.hour', '时'))
  const minuteTitle = computed(() => lhlocale.t('timepicker.minute', '分'))
  const secondTitle = computed(() => lhlocale.t('timepicker.second', '秒'))
  const nowText = computed(() => lhlocale.t('timepicker.now', '此刻'))
  const confirmText = computed(() => lhlocale.t('timepicker.confirm', '确定'))

  const pickerClass = computed(() => {
    const list = ['lh-time-picker', `lh-time-picker--${effectiveSize.value}`]
    if (visible.value) list.push('lh-time-picker--visible')
    if (props.disabled) list.push('lh-time-picker--disabled')
    if (props.readonly) list.push('lh-time-picker--readonly')
    if (props.customClass) list.push(props.customClass)
    return list
  })

  const pickerStyle = computed(() => componentStyle.value)

  const mergedPopperStyle = computed(() => ({
    ...popperStyle.value,
    zIndex: String(zIndex.value),
  }))

  // —— 弹层定位（两帧度量：面板先隐藏渲染 → 量尺寸 → 定位 → 显示）——
  const { popperStyle, update: updatePopper } = useLhPopper(
    `#${triggerId}`,
    `#${popperId}`,
    scope,
    { placement: 'bottom' },
  )

  function open() {
    if (props.disabled || visible.value) return
    visible.value = true
  }

  function close() {
    if (!visible.value) return
    visible.value = false
    selecting.value = null
  }

  function toggleOpen() {
    if (visible.value) close()
    else open()
  }

  /** 点击列项：直接落位（面板不关，确认走底部按钮，与 plus 同款） */
  function handleSelect(type: TimeColumnType, value: number): void {
    if (type === 'hour') hour.value = value
    else if (type === 'minute') minute.value = value
    else second.value = value
  }

  /** 此刻：收敛到 start/end 范围内（默认全量程时保持原值） */
  function selectNow(): void {
    const now = new Date()
    hour.value = clampTimeValue(now.getHours(), hourRange.value.start, hourRange.value.end)
    minute.value = now.getMinutes()
    second.value = now.getSeconds()
  }

  function confirmSelection(): void {
    if (!isValidTime(hour.value, minute.value, second.value)) return
    const newDate = createDateTime(props.modelValue, hour.value, minute.value, second.value)
    emit('update:modelValue', newDate)
    emit('change', newDate)
    closePanel()
  }

  function handleClear() {
    if (props.disabled) return
    emit('update:modelValue', null)
    emit('change', null)
    close()
  }

  /** 点击遮罩关闭（等价 plus 的点击外部关闭） */
  function handleMaskClick() {
    close()
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
    // 初始 visible=true：watch 不会触发，补上顺序栈注册与两帧度量（对齐 Cascader 的处理）
    if (!visible.value) return
    zIndex.value = nextZIndex()
    overlay.register()
    nextTick(() => updatePopper())
  })

  // modelValue → 内部时分秒（超范围的小时收敛回可选区间；默认全量程时保持原值）
  watch(
    () => props.modelValue,
    (val) => {
      if (val instanceof Date && !isNaN(val.getTime())) {
        const time = extractTime(val)
        hour.value = clampTimeValue(time.hours, hourRange.value.start, hourRange.value.end)
        minute.value = time.minutes
        second.value = time.seconds
      }
    },
    { immediate: true },
  )

  // —— 步进（H5 键盘与 arrowControl 按钮共用；hour 回绕后再收拢回 start/end 范围）——
  function stepValue(type: TimeColumnType, direction: number): void {
    if (type === 'hour') {
      hour.value = wrapTimeValueInRange(
        (hour.value + direction * props.stepHour + 24) % 24,
        hourRange.value.start,
        hourRange.value.end,
      )
    } else if (type === 'minute') {
      minute.value = (minute.value + direction * props.stepMinute + 60) % 60
    } else {
      second.value = (second.value + direction * props.stepSecond + 60) % 60
    }
  }

  // —— 无障碍（share 纯函数产出的属性包，逐键摊开绑定——MP 模板不支持 v-bind 对象）—— //
  const triggerAria = computed(() => getTimePickerTriggerAria(visible.value, popperId))
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

  /** 键盘可达的列顺序：不含秒时只有时分两列（与模板 v-if 同源） */
  const columnOrder = computed<TimeColumnType[]>(() =>
    showSecond.value ? ['hour', 'minute', 'second'] : ['hour', 'minute'],
  )

  function focusColumn(type: TimeColumnType): void {
    // #ifdef H5
    nextTick(() => {
      const panel = document.getElementById(popperId)
      const body = panel?.querySelector<HTMLElement>(
        `.lh-time-picker-panel__column-body--${type}`,
      )
      body?.focus()
    })
    // #endif
  }

  function returnFocusToTrigger(): void {
    // #ifdef H5
    const trigger = document.getElementById(triggerId)
    trigger?.querySelector<HTMLElement>('.lh-time-picker__input')?.focus()
    // #endif
  }

  function closePanel(): void {
    close()
    returnFocusToTrigger()
  }

  /**
   * 列键盘：复用 stepValue 步进
   * - 上/下：按 step 增减时刻（内含回绕与范围收敛）
   * - 左/右：在时分秒列之间跳焦
   * - Enter/Space：确认当前时刻并关闭（键盘用户无需再点底部按钮）
   * - Escape：关闭并把焦点还给触发器
   */
  function onColumnKeydown(event: KeyboardEvent, type: TimeColumnType): void {
    // #ifdef H5
    if (event.key === LH_KEYS.ArrowUp) {
      event.preventDefault()
      stepValue(type, -1)
    } else if (event.key === LH_KEYS.ArrowDown) {
      event.preventDefault()
      stepValue(type, 1)
    } else if (event.key === LH_KEYS.ArrowRight || event.key === LH_KEYS.ArrowLeft) {
      const order = columnOrder.value
      const idx = order.indexOf(type)
      const nextIdx = event.key === LH_KEYS.ArrowRight ? idx + 1 : idx - 1
      if (nextIdx >= 0 && nextIdx < order.length) {
        event.preventDefault()
        focusColumn(order[nextIdx]!)
      }
    } else if (isActivationKey(event)) {
      event.preventDefault()
      confirmSelection()
    } else if (isEscapeKey(event)) {
      event.preventDefault()
      closePanel()
    }
    // #endif
  }

  /**
   * 触发器键盘：Enter/Space/ArrowDown 开面板并把焦点放进第一列，
   * Escape 关面板（点击遮罩之外的纯键盘关闭路径）
   */
  function onTriggerKeydown(event: KeyboardEvent): void {
    // #ifdef H5
    if (props.disabled) return
    if (isEscapeKey(event)) {
      if (visible.value) {
        event.preventDefault()
        closePanel()
      }
    } else if (isActivationKey(event) || event.key === LH_KEYS.ArrowDown) {
      if (!visible.value) {
        event.preventDefault()
        open()
        nextTick(() => {
          updatePopper()
          focusColumn('hour')
        })
      }
    }
    // #endif
  }

  /** arrowControl 箭头按钮（H5 渲染，MP 端不渲染该按钮） */
  function scrollColumn(type: TimeColumnType, direction: number): void {
    stepValue(type, direction)
  }

  // #ifdef H5
  /**
   * Esc 关闭（面板自身可能没有焦点，补一层文档监听）。
   * 整段只在 H5 保留：小程序无 document，也无键盘事件。
   */
  function onDocumentKeydown(event: KeyboardEvent) {
    if (!isEscapeKey(event) || !visible.value) return
    // 多弹层叠加时只有栈顶响应（与 Dialog / Popover / Cascader 共用顺序栈）
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
    showSecond,
    hoursOption,
    minutesOption,
    secondsOption,
    hourScrollTarget,
    minuteScrollTarget,
    secondScrollTarget,
    selecting,
    formatDisplay,
    placeholderText,
    panelLabel,
    hourLabel,
    minuteLabel,
    secondLabel,
    hourTitle,
    minuteTitle,
    secondTitle,
    nowText,
    confirmText,
    pickerClass,
    pickerStyle,
    ariaExpanded,
    ariaHaspopup,
    ariaControls,
    handleSelect,
    selectNow,
    confirmSelection,
    handleClear,
    handleMaskClick,
    toggleOpen,
    open,
    close,
    onColumnKeydown,
    onTriggerKeydown,
    scrollColumn,
  }
}
