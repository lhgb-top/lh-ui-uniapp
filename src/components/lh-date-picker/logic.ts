import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import {
  generateCalendarDays,
  generateMonths,
  generateYears,
  getDatePickerTriggerAria,
  isDateDisabled,
  isSameDay,
  formatDate,
} from '@lh-ui/share/core/date-picker'
import { getSize } from '@lh-ui/share/core/button'
import {
  getNextGridCell,
  isActivationKey,
  isArrowKey,
  isEscapeKey,
  isHomeOrEndKey,
  LH_KEYS,
} from '@lh-ui/share/core/shared'
import { useLhComponent, useLhOverlayStack, useLhPopperIds, useLhZIndex } from '@/composables'
import { useLhPopper } from '@/adapter/popper'
import { lhlocale } from '@/adapter/locale'
import type { LhEmitFn } from '@/types/emit'
import type { LhDatePickerResolvedProps } from './types'

/**
 * DatePicker 日期选择器胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】
 * - 浮层由 plus 的 `Teleport to="body"` + getBoundingClientRect 改为
 *   `lh-root-portal` 承载 + useLhPopper 两帧异步度量（先隐藏渲染量尺寸 →
 *   computePosition 定位 → 显示，防闪烁），进出过渡未绑定
 * - 点击外部关闭由页内透明遮罩承载（等价 plus 的文档级 click 监听）
 * - 键盘导航（触发器 Enter/Space 开合、网格方向键 / Home / End /
 *   PageUp / PageDown、Escape 关栈顶）仅 H5：处理函数体由条件编译裁剪，
 *   函数本身双端存在（模板 @keydown 绑定留在两端，MP 端无键盘事件不会触发）
 * - `datetime` / 区间选择与 plus 一致仅类型预留（家族台账 P-08），不私自新增
 *   时间列或区间面板 UI
 */
export function useLhDatePicker(
  props: LhDatePickerResolvedProps,
  emit: LhEmitFn<'update:modelValue' | 'change'>,
) {
  const { componentStyle, configContext } = useLhComponent('date-picker', props)

  const instance = getCurrentInstance()
  const scope = (instance?.proxy as ComponentPublicInstance) ?? null

  const { triggerId, popperId } = useLhPopperIds('date-picker')

  const { nextZIndex } = useLhZIndex()
  // 弹层打开顺序栈：多弹层叠加时 Esc 只关栈顶（与 Dialog / Popover / Dropdown 共用）
  const overlay = useLhOverlayStack()
  const zIndex = ref(nextZIndex())

  const visible = ref(false)

  // 面板游标：打开时锚定到选中值（无值则今天），避免停留在上次浏览的月份
  const currentYear = ref(new Date().getFullYear())
  const currentMonth = ref(new Date().getMonth())
  const today = new Date()

  // 面板内暂存选中（点「确定」才提交到 v-model，与 plus 同款两步提交）
  const tempSelection = ref<Date | null>(null)

  // 面板视图：日期日历 ⇄ 月份网格 ⇄ 年份网格（点标题逐级下钻）
  type PanelView = 'date' | 'month' | 'year'
  const viewMode = ref<PanelView>('date')

  const effectiveSize = computed(() => getSize(props.size, configContext?.value.size))

  // —— 弹层定位（两帧度量：面板先隐藏渲染 → 量尺寸 → 定位 → 显示）——
  const { popperStyle, update: updatePopper } = useLhPopper(
    `#${triggerId}`,
    `#${popperId}`,
    scope,
    { placement: 'bottom' },
  )

  /** 文案：lhlocale.t 内部已订阅版本号，切换语言自动重算；
   *  动态路径（month1~12）走 LhTranslate 的宽松重载 */
  const t = (path: string, fallback?: string) => lhlocale.t(path, fallback)

  // 表头星期文案来自语言包 datepicker.weeks（sun→sat），切换语言即时生效
  const weekDays = computed(() => [
    t('datepicker.weeks.sun', '日'),
    t('datepicker.weeks.mon', '一'),
    t('datepicker.weeks.tue', '二'),
    t('datepicker.weeks.wed', '三'),
    t('datepicker.weeks.thu', '四'),
    t('datepicker.weeks.fri', '五'),
    t('datepicker.weeks.sat', '六'),
  ])

  const yearLabel = computed(() => t('datepicker.year', '年'))
  const monthLabel = computed(() => t('datepicker.month', '月'))

  // 月份格文案消费 datepicker.month1~12 死键（en: Jan…Dec）
  const monthName = (month: number) => t(`datepicker.month${month + 1}`, `${month + 1}月`)

  // 年份网格以 12 年为一个十年段（generateYears 固定产出 12 项）
  const decadeStart = computed(() => Math.floor(currentYear.value / 12) * 12)
  const decadeLabel = computed(() => `${decadeStart.value} - ${decadeStart.value + 11}`)

  const calendarDays = computed(() =>
    generateCalendarDays(
      currentYear.value,
      currentMonth.value,
      tempSelection.value,
      null,
      null,
      today,
    ),
  )

  const monthCells = computed(() =>
    generateMonths(currentYear.value, props.mode === 'month' ? tempSelection.value : null),
  )

  const yearCells = computed(() =>
    generateYears(decadeStart.value, props.mode === 'year' ? tempSelection.value : null),
  )

  const panelTitle = computed(() => {
    if (viewMode.value === 'date') {
      return `${currentYear.value}${yearLabel.value} ${currentMonth.value + 1}${monthLabel.value}`
    }
    if (viewMode.value === 'month') return `${currentYear.value}${yearLabel.value}`
    return decadeLabel.value
  })

  // 日期 / 日期时间模式显示底部「今天 / 确定」；月份 / 年份模式点击即选中
  const showFooter = computed(() => props.mode === 'date' || props.mode === 'datetime')

  const displayPlaceholder = computed(() => {
    if (props.placeholder) return props.placeholder
    // 格式转义在组件层做（core 不放用户文案）：yyyy→年、MM→月、dd→日
    return props.format
      .replace('yyyy', t('datepicker.year', '年'))
      .replace('MM', t('datepicker.month', '月'))
      .replace('dd', '日')
  })

  /** 单值的展示格式：月份 / 年份模式不走 format，直接用语言包的年 / 月文案 */
  function formatDisplay(date: Date): string {
    if (props.mode === 'month') {
      return `${date.getFullYear()}${yearLabel.value} ${date.getMonth() + 1}${monthLabel.value}`
    }
    if (props.mode === 'year') return `${date.getFullYear()}${yearLabel.value}`
    return formatDate(date, props.format)
  }

  /** 触发器回显：区间值（数组）两端拼接 rangeSeparator，单值走 formatDisplay */
  const displayValue = computed(() => {
    const value = props.modelValue
    if (!value) return ''
    if (Array.isArray(value)) {
      return `${formatDisplay(value[0])} ${props.rangeSeparator} ${formatDisplay(value[1])}`
    }
    return formatDisplay(value)
  })

  const hasValue = computed(() => props.modelValue !== null && props.modelValue !== undefined)

  const showClear = computed(
    () => props.clearable && !props.disabled && !props.readonly && hasValue.value,
  )

  const rootClass = computed(() => {
    const list = ['lh-date-picker', `lh-date-picker--${effectiveSize.value}`]
    if (visible.value) list.push('lh-date-picker--visible')
    if (props.disabled) list.push('lh-date-picker--disabled')
    if (props.readonly) list.push('lh-date-picker--readonly')
    if (props.customClass) list.push(props.customClass)
    return list
  })

  const rootStyle = computed(() => componentStyle.value)

  const mergedPopperStyle = computed(() => ({
    ...popperStyle.value,
    zIndex: String(zIndex.value),
  }))

  /** 面板根类名：popperClass 透传到弹层（与 plus 的 panelClasses 同语义） */
  const panelClass = computed(() => {
    const list = ['lh-date-picker__panel', 'lh-date-picker-panel']
    if (props.popperClass) list.push(props.popperClass)
    return list
  })

  // —— 无障碍（share 纯函数产出的属性包，逐键摊开绑定——MP 模板不支持 v-bind 对象）—— //
  const triggerAria = computed(() => getDatePickerTriggerAria(visible.value, popperId))
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

  const panelLabel = computed(() => t('datepicker.panelLabel', '选择日期'))
  const prevUnitLabel = computed(() => t('datepicker.prevMonth', '上一月'))
  const nextUnitLabel = computed(() => t('datepicker.nextMonth', '下一月'))
  const todayText = computed(() => t('datepicker.today', '今天'))
  const confirmText = computed(() => t('datepicker.confirm', '确定'))

  /** 日期格是否选中（面板暂存值） */
  function isSelected(date: Date): boolean {
    if (!tempSelection.value) return false
    return isSameDay(date, tempSelection.value)
  }

  /** 日期格是否禁用（min / max / disabledDate 均未透传——与 plus 一致，预留参数位） */
  function isDayDisabled(date: Date): boolean {
    return isDateDisabled(date, null, null, null)
  }

  /** cellClassName：给日期单元格追加自定义类，回调返回空值时安全跳过 */
  function dayCustomClass(date: Date): string | undefined {
    return props.cellClassName?.(date) || undefined
  }

  /** 日期格的语义文案：读屏播报完整日期（含星期），表头另有列头 */
  function dayAriaLabel(day: { date: Date; day: number }): string {
    const date = day.date
    const week = t(
      `datepicker.weeks.${['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][date.getDay()]}`,
      '',
    )
    const y = date.getFullYear()
    const m = date.getMonth() + 1
    return `${y}年${m}月${day.day}日${week ? ` ${week}` : ''}`
  }

  // —— 翻月 / 视图切换 —— //

  function prevUnit(): void {
    if (viewMode.value === 'year') {
      currentYear.value -= 12
    } else if (viewMode.value === 'month') {
      currentYear.value--
    } else {
      currentMonth.value--
      if (currentMonth.value < 0) {
        currentMonth.value = 11
        currentYear.value--
      }
    }
  }

  function nextUnit(): void {
    if (viewMode.value === 'year') {
      currentYear.value += 12
    } else if (viewMode.value === 'month') {
      currentYear.value++
    } else {
      currentMonth.value++
      if (currentMonth.value > 11) {
        currentMonth.value = 0
        currentYear.value++
      }
    }
  }

  /** 逐级下钻：日期 → 月份 → 年份；年份视图点标题回月份 */
  function toggleView(): void {
    if (viewMode.value === 'date') viewMode.value = 'month'
    else if (viewMode.value === 'month') viewMode.value = 'year'
    else viewMode.value = 'month'
  }

  // —— 开合 —— //

  function open(): void {
    if (props.disabled || props.readonly || visible.value) return
    visible.value = true
    const hasSingleValue = props.modelValue instanceof Date
    tempSelection.value = hasSingleValue ? (props.modelValue as Date) : null
    // 每次打开都锚定到选中值（无值则今天），避免停留在上次浏览的月份
    const anchor: Date = hasSingleValue ? (props.modelValue as Date) : new Date()
    currentYear.value = anchor.getFullYear()
    currentMonth.value = anchor.getMonth()
    // 月份 / 年份模式打开时直接落在对应网格
    viewMode.value =
      props.mode === 'month' ? 'month' : props.mode === 'year' ? 'year' : 'date'
    // 打开时重置显式聚焦，让落点回退到锚点（选中日 / 今天）
    focusDayIndex.value = -1
    focusMonthIndex.value = -1
    focusYearIndex.value = -1
  }

  function close(): void {
    if (!visible.value) return
    visible.value = false
  }

  function toggleOpen(): void {
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

  // 受控 modelValue 同步面板游标（外部改值后打开面板仍锚定到新值）
  watch(
    () => props.modelValue,
    (val) => {
      if (val instanceof Date) {
        currentYear.value = val.getFullYear()
        currentMonth.value = val.getMonth()
      }
    },
    { immediate: true },
  )

  // —— 选中逻辑（与 plus 同构）—— //

  function handleDayClick(day: { date: Date; isCurrentMonth?: boolean }): void {
    if (props.disabled || isDayDisabled(day.date)) return
    tempSelection.value = day.date
    // 点击相邻月份的填充格时，面板跟随跳到该月
    if (!day.isCurrentMonth) {
      currentYear.value = day.date.getFullYear()
      currentMonth.value = day.date.getMonth()
    }
  }

  function handleMonthClick(m: { month: number }): void {
    if (props.disabled) return
    // 月份模式：点击即选中并关闭；日期模式：仅切换到该月的日历
    if (props.mode === 'month') {
      const val = new Date(currentYear.value, m.month, 1)
      tempSelection.value = val
      emit('update:modelValue', val)
      emit('change', val)
      close()
      return
    }
    currentMonth.value = m.month
    viewMode.value = 'date'
    focusDayIndex.value = -1
    focusGridCell()
  }

  function handleYearClick(y: { year: number }): void {
    if (props.disabled) return
    // 年份模式：点击即选中并关闭；其余：仅切换到该年的月份网格
    if (props.mode === 'year') {
      const val = new Date(y.year, 0, 1)
      tempSelection.value = val
      emit('update:modelValue', val)
      emit('change', val)
      close()
      return
    }
    currentYear.value = y.year
    viewMode.value = 'month'
    focusMonthIndex.value = -1
    focusGridCell()
  }

  function selectToday(): void {
    const now = new Date()
    tempSelection.value = now
    // 面板跟随跳到今天所在的年月，并从月份 / 年份视图回到日历视图
    currentYear.value = now.getFullYear()
    currentMonth.value = now.getMonth()
    viewMode.value = 'date'
    // 重置显式聚焦，让锚点重新落在今天
    focusDayIndex.value = -1
    focusGridCell()
  }

  function confirmSelection(): void {
    // datetime / range 模式尚未实现时间选择与区间选择 UI（产品决策项，见台账 P-08）：
    // 外部已传入区间值（数组）时不得用单个 Date 覆盖——此前会静默丢失区间数据
    if (Array.isArray(props.modelValue)) {
      close()
      return
    }
    const val = tempSelection.value
    emit('update:modelValue', val)
    emit('change', val)
    close()
  }

  function handleClear(): void {
    if (props.disabled || props.readonly) return
    emit('update:modelValue', null)
    emit('change', null)
    tempSelection.value = null
    close()
  }

  /** 点击遮罩关闭（等价 plus 的点击外部关闭，不发 change） */
  function handleMaskClick(): void {
    close()
  }

  // —— 键盘导航（仅 H5：函数体由条件编译裁剪，函数本身双端存在）—— //

  /** 网格焦点锚点：选中日优先，否则今天，否则首格（均跳过禁用） */
  const anchorDayIndex = computed(() => {
    const days = calendarDays.value
    const selected = days.findIndex((d) => d.isSelected && !isDayDisabled(d.date))
    if (selected >= 0) return selected
    const todayIdx = days.findIndex((d) => d.isToday && !isDayDisabled(d.date))
    if (todayIdx >= 0) return todayIdx
    return 0
  })

  /** roving tabindex 的当前聚焦格下标（-1 时回退到锚点） */
  const focusDayIndex = ref(-1)
  const focusMonthIndex = ref(-1)
  const focusYearIndex = ref(-1)

  /** 翻月后由 watcher 兑现的「进入侧落点」描述（读新网格的 total） */
  let pendingGridFocus: null | ((total: number) => number) = null

  /** 网格实际落点：显式聚焦优先，否则回退锚点 */
  const gridFocusIndex = computed(() =>
    focusDayIndex.value === -1 ? anchorDayIndex.value : focusDayIndex.value,
  )

  /** 月份网格落点：选中月优先，否则首格 */
  const monthFocusIndex = computed(() => {
    if (focusMonthIndex.value !== -1) return focusMonthIndex.value
    const idx = monthCells.value.findIndex((m) => m.isSelected)
    return idx >= 0 ? idx : 0
  })

  /** 年份网格落点：选中年优先，否则首格 */
  const yearFocusIndex = computed(() => {
    if (focusYearIndex.value !== -1) return focusYearIndex.value
    const idx = yearCells.value.findIndex((y) => y.isSelected)
    return idx >= 0 ? idx : 0
  })

  /** 日期格的 tabindex：仅聚焦格为 0，其余 -1（roving tabindex） */
  function dayTabIndex(index: number): number {
    // #ifdef H5
    return index === gridFocusIndex.value ? 0 : -1
    // #endif
    // MP 端无键盘焦点语义：函数体由条件编译裁剪为空，tabindex 绑定不落值
  }

  function monthTabIndex(index: number): number {
    // #ifdef H5
    return index === monthFocusIndex.value ? 0 : -1
    // #endif
  }

  function yearTabIndex(index: number): number {
    // #ifdef H5
    return index === yearFocusIndex.value ? 0 : -1
    // #endif
  }

  /** 把焦点移到当前视图的 tabindex=0 格（翻月 / 移动 / 切视图后调用） */
  function focusGridCell(): void {
    // #ifdef H5
    nextTick(() => {
      const panel = document.getElementById(popperId)
      panel?.querySelector<HTMLElement>('[role="grid"] [tabindex="0"]')?.focus()
    })
    // #endif
  }

  /** 焦点落点不可达（被禁用）时向下一格找最近的可聚焦格 */
  function resolveGridFocus(total: number): number {
    const raw = pendingGridFocus ? pendingGridFocus(total) : gridFocusIndex.value
    pendingGridFocus = null
    if (raw < 0 || raw >= total) return 0
    if (!isDayDisabled(calendarDays.value[raw].date)) return raw
    const next = calendarDays.value.findIndex((d, i) => i >= raw && !isDayDisabled(d.date))
    return next >= 0 ? next : 0
  }

  /** 翻月后兑现「进入侧落点」并聚焦 */
  watch(calendarDays, () => {
    // #ifdef H5
    if (pendingGridFocus) {
      focusDayIndex.value = resolveGridFocus(calendarDays.value.length)
      pendingGridFocus = null
      focusGridCell()
    }
    // #endif
  })

  /** 日期格键盘：方向键移动（含翻月）/ Enter / Space 选中 / Escape 关闭 */
  function onDayKeydown(event: KeyboardEvent, index: number): void {
    // #ifdef H5
    if (props.disabled) return
    const key = event.key
    const days = calendarDays.value

    if (isEscapeKey(event)) {
      event.preventDefault()
      close()
      return
    }
    if (isActivationKey(event)) {
      event.preventDefault()
      handleDayClick(days[index])
      return
    }
    if (key === LH_KEYS.PageUp || key === LH_KEYS.PageDown) {
      event.preventDefault()
      // 翻月后保持列位置（落在同列的某一行）
      pendingGridFocus = () => Math.min(index % 7, days.length - 1)
      if (key === LH_KEYS.PageUp) prevUnit()
      else nextUnit()
      return
    }
    if (!isArrowKey(event) && !isHomeOrEndKey(event)) return

    const total = days.length
    const next = getNextGridCell(index, key, { cols: 7, total })
    if (next !== null) {
      event.preventDefault()
      focusDayIndex.value = next
      focusGridCell()
      return
    }
    // 只处理横向溢出翻月（纵向越过最后一行时，聚焦锚点会自然落到末行）
    if (key === LH_KEYS.ArrowRight) {
      event.preventDefault()
      pendingGridFocus = () => 0
      nextUnit()
    } else if (key === LH_KEYS.ArrowLeft) {
      event.preventDefault()
      pendingGridFocus = (t2) => t2 - 1
      prevUnit()
    }
    focusGridCell()
    // #endif
  }

  /** 月份 / 年份网格键盘：方向键移动 + Enter / Space 选中 + Escape 关闭 */
  function onCellKeydown(
    event: KeyboardEvent,
    index: number,
    total: number,
    cols: number,
    onActivate: () => void,
  ): void {
    // #ifdef H5
    if (props.disabled) return
    const key = event.key

    if (isEscapeKey(event)) {
      event.preventDefault()
      close()
      return
    }
    if (isActivationKey(event)) {
      event.preventDefault()
      onActivate()
      return
    }
    if (!isArrowKey(event) && !isHomeOrEndKey(event)) return

    const next = getNextGridCell(index, key, { cols, total, loop: true })
    if (next !== null) {
      event.preventDefault()
      if (viewMode.value === 'month') focusMonthIndex.value = next
      else focusYearIndex.value = next
    }
    // #endif
  }

  function onMonthKeydown(event: KeyboardEvent, index: number): void {
    // #ifdef H5
    onCellKeydown(
      event,
      index,
      monthCells.value.length,
      3,
      () => handleMonthClick(monthCells.value[index]),
    )
    // #endif
  }

  function onYearKeydown(event: KeyboardEvent, index: number): void {
    // #ifdef H5
    onCellKeydown(
      event,
      index,
      yearCells.value.length,
      4,
      () => handleYearClick(yearCells.value[index]),
    )
    // #endif
  }

  /** 触发器键盘：Enter / Space / 方向键打开面板，Escape 关闭 */
  function onTriggerKeydown(event: KeyboardEvent): void {
    // #ifdef H5
    if (props.disabled || props.readonly) return
    if (isEscapeKey(event)) {
      if (visible.value) event.preventDefault()
      close()
      return
    }
    if (isActivationKey(event) || isArrowKey(event) || isHomeOrEndKey(event)) {
      event.preventDefault()
      open()
    }
    // #endif
  }

  // #ifdef H5
  /**
   * Esc 关闭（面板自身可能没有焦点，补一层文档监听）。
   * 整段只在 H5 保留：小程序无 document，也无键盘事件。
   */
  function onDocumentKeydown(event: KeyboardEvent): void {
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
    viewMode,
    weekDays,
    calendarDays,
    monthCells,
    yearCells,
    panelTitle,
    decadeLabel,
    monthName,
    showFooter,
    panelLabel,
    prevUnitLabel,
    nextUnitLabel,
    todayText,
    confirmText,
    displayPlaceholder,
    displayValue,
    hasValue,
    showClear,
    rootClass,
    rootStyle,
    panelClass,
    ariaExpanded,
    ariaHaspopup,
    ariaControls,
    isSelected,
    isDayDisabled,
    dayCustomClass,
    dayAriaLabel,
    dayTabIndex,
    monthTabIndex,
    yearTabIndex,
    toggleOpen,
    prevUnit,
    nextUnit,
    toggleView,
    handleDayClick,
    handleMonthClick,
    handleYearClick,
    selectToday,
    confirmSelection,
    handleClear,
    handleMaskClick,
    onDayKeydown,
    onMonthKeydown,
    onYearKeydown,
    onTriggerKeydown,
    open,
    close,
  }
}
