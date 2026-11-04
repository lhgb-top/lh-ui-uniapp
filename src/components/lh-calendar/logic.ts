import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  clampDateToRange,
  generateCalendarDays,
  getCalendarClassNames,
  isCalendarDateDisabled,
  isCalendarInSpan,
  isSameDay,
  normalizeCalendarSpan,
  shiftCalendarDate,
  shiftCalendarMonth,
  toggleCalendarDate,
} from '@lh-ui/share/core/calendar'
import { LH_KEYS, formatMessage, sxToStyle } from '@lh-ui/share/core/shared'
import { LH_IS_H5 } from '@/adapter/platform'
import { lhlocale } from '@/adapter/locale'
import type { LhEmitFn } from '@/types/emit'
import type { LhCalendarResolvedProps, LhCalendarValue } from './types'
import type { LhDatePickerDayData } from '@lh-ui/share/core/date-picker'

/**
 * Calendar 日历胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】
 * - 日期网格算法完全消费 share 的 generateCalendarDays / normalizeCalendarSpan /
 *   toggleCalendarDate 等纯函数，零拷贝；同日判定直接用 share 的 isSameDay
 *   （plus 的 isSameDate 本地实现不再重写）
 * - 键盘网格导航（方向键翻日 / Home / End / PageUp / PageDown 翻月）仅 H5：
 *   MP 无键盘事件，onKeydown 由 SFC 侧条件编译守卫不调用
 * - input 模式的「点击组件外部收起」仅 H5 挂文档级 mousedown 监听
 *   （MP 无 document，面板由触发框点击切换开合）
 */
/** 双月面板数据（年份 / 月份 / 6×7 日网格），供 useLhCalendar 返回类型引用 */
export interface LhCalendarPanel {
  year: number
  month: number
  rows: LhDatePickerDayData[][]
}

export function useLhCalendar(
  props: LhCalendarResolvedProps,
  emit: LhEmitFn<'update:modelValue' | 'change' | 'select'>,
) {
  /** 文案：读 t() 前先 void version.value 建立响应式依赖，切语言后自动重算。
   *  path 取 string 走 LhTranslate 的宽松重载：月份键（month1~12）是动态拼接路径 */
  const t = (path: string, fallback?: string) => {
    void lhlocale.version.value
    return lhlocale.t(path, fallback)
  }

  const rootRef = ref<HTMLElement | null>(null)
  const panelOpen = ref(false)
  const isInputMode = computed(() => props.mode === 'input')

  const today = new Date()
  const cursor = ref({
    year: today.getFullYear(),
    month: today.getMonth(),
  })

  // ---------- 选中态（受控 / 内部双模） ----------

  const innerDates = ref<Date[]>([])
  /** range 模式的待完成起点（第一次点击后第二次前） */
  const rangeAnchor = ref<Date | null>(null)

  const controlled = computed(() => props.modelValue !== undefined)

  function toDates(value: LhCalendarValue | undefined): Date[] {
    if (value === undefined) return []
    if (Array.isArray(value)) return [...value]
    return [value]
  }

  const selectedDates = computed<Date[]>(() => {
    if (controlled.value) return toDates(props.modelValue)
    return innerDates.value
  })

  const isSelected = (date: Date) => selectedDates.value.some((d) => isSameDay(d, date))

  /** 一段时间模式下完整起止之间的日期（不含两端，两端走 --selected） */
  const isWithinSpan = (date: Date): boolean => {
    if (props.selection !== 'range' || selectedDates.value.length !== 2) return false
    const [start, end] = selectedDates.value
    return isCalendarInSpan(date, start, end) && !isSameDay(date, start) && !isSameDay(date, end)
  }

  function isDisabled(date: Date): boolean {
    return isCalendarDateDisabled(date, props.range)
  }

  // ---------- 交互 ----------

  function select(date: Date): void {
    if (isDisabled(date)) return
    focusDate.value = date
    let value: LhCalendarValue

    if (props.selection === 'range') {
      if (!rangeAnchor.value) {
        rangeAnchor.value = date
        innerDates.value = [date]
        value = [date, date]
      } else {
        const span = normalizeCalendarSpan(rangeAnchor.value, date)
        rangeAnchor.value = null
        innerDates.value = [...span]
        value = span
      }
    } else if (props.selection === 'multiple') {
      innerDates.value = toggleCalendarDate(innerDates.value, date)
      value = [...innerDates.value]
    } else {
      innerDates.value = [date]
      value = date
    }

    emit('select', date)
    emit('update:modelValue', value)
    emit('change', value)
    if (shouldCloseOnSelect()) panelOpen.value = false
  }

  function shouldCloseOnSelect(): boolean {
    if (!isInputMode.value || props.closeOnSelect === false) return false
    if (props.selection === 'range') return rangeAnchor.value === null
    return props.selection === 'single'
  }

  /** 切换 input 模式的面板开合（触发框点击） */
  function togglePanel(): void {
    if (!isInputMode.value) return
    panelOpen.value = !panelOpen.value
  }

  // ---------- 面板 ----------

  /** 星期表头：按语言包走（zh「日 一 …」/ en「Sun Mon …」），切语言时响应式重算 */
  const weekLabels = computed(() => [
    { key: 'sun', label: t('datepicker.weeks.sun', '日') },
    { key: 'mon', label: t('datepicker.weeks.mon', '一') },
    { key: 'tue', label: t('datepicker.weeks.tue', '二') },
    { key: 'wed', label: t('datepicker.weeks.wed', '三') },
    { key: 'thu', label: t('datepicker.weeks.thu', '四') },
    { key: 'fri', label: t('datepicker.weeks.fri', '五') },
    { key: 'sat', label: t('datepicker.weeks.sat', '六') },
  ])

  const panelCount = computed(() => Math.max(1, Math.floor(props.panels ?? 1)))

  const panelMonths = computed<LhCalendarPanel[]>(() =>
    Array.from({ length: panelCount.value }, (_, i) => {
      const shifted = shiftCalendarMonth(cursor.value.year, cursor.value.month, i)
      const days = generateCalendarDays(
        shifted.year, shifted.month, selectedDates.value[0] ?? null, null, null, today,
      )
      const rows: LhDatePickerDayData[][] = []
      for (let r = 0; r < days.length; r += 7) rows.push(days.slice(r, r + 7))
      return { ...shifted, rows }
    }),
  )

  /** 标题格式按语言包走（zh「2026年10月」/ en「October 2026」）：
   *  月名复用 month1~12，顺序与连接符由 panelTitle 模板决定 */
  const panelTitle = (panel: { year: number; month: number }) =>
    formatMessage(t('datepicker.panelTitle', '{year}年{month}'), {
      year: panel.year,
      month: t(`datepicker.month${panel.month + 1}`, String(panel.month + 1)),
    })

  const prevMonthLabel = computed(() => t('datepicker.prevMonth', '上一月'))
  const nextMonthLabel = computed(() => t('datepicker.nextMonth', '下一月'))

  /** 焦点目标：受控的单个日期（未传或数组形态时以今天兜底）；键盘导航以此为基准移动 */
  const focusDate = ref<Date>(props.modelValue instanceof Date ? props.modelValue : today)
  const isFocusTarget = (date: Date) => isSameDay(date, focusDate.value)

  function shiftMonth(delta: number): void {
    cursor.value = shiftCalendarMonth(cursor.value.year, cursor.value.month, delta)
  }

  function moveFocus(days: number): void {
    const next = clampDateToRange(shiftCalendarDate(focusDate.value, days), props.range)
    focusDate.value = next
    const inPanels = panelMonths.value.some(
      (p) => p.year === next.getFullYear() && p.month === next.getMonth(),
    )
    if (!inPanels) cursor.value = { year: next.getFullYear(), month: next.getMonth() }
  }

  /** 键盘网格导航（仅 H5 调用，MP 端无键盘事件） */
  function onKeydown(event: KeyboardEvent): void {
    const moves: Record<string, () => void> = {
      [LH_KEYS.ArrowRight]: () => moveFocus(1),
      [LH_KEYS.ArrowLeft]: () => moveFocus(-1),
      [LH_KEYS.ArrowDown]: () => moveFocus(7),
      [LH_KEYS.ArrowUp]: () => moveFocus(-7),
      [LH_KEYS.Home]: () => moveFocus(-6),
      [LH_KEYS.End]: () => moveFocus(6),
      [LH_KEYS.PageUp]: () => shiftMonth(-1),
      [LH_KEYS.PageDown]: () => shiftMonth(1),
    }
    const move = moves[event.key]
    if (!move) return
    event.preventDefault()
    move()
    const target = clampDateToRange(focusDate.value, props.range)
    if (!isDisabled(target)) select(target)
  }

  /** 日期格式化：YYYY-MM-DD（aria-label 与 input 模式回显共用） */
  const formatCalendarDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${date.getFullYear()}-${month}-${day}`
  }

  /** 单元格无障碍标签（供读屏识别） */
  const cellAria = (date: Date) => formatCalendarDate(date)

  const inputText = computed(() => {
    const dates = selectedDates.value
    if (dates.length === 0) return ''
    if (props.selection === 'range' && dates.length === 2) {
      return `${formatCalendarDate(dates[0])} ~ ${formatCalendarDate(dates[1])}`
    }
    return formatCalendarDate(dates[0])
  })

  const placeholderText = computed(
    () => props.placeholder || t('select.placeholder', '请选择'),
  )

  const rootClasses = computed(() => {
    const classes = getCalendarClassNames()
    if (isInputMode.value) classes.push('lh-calendar--input')
    if (panelOpen.value) classes.push('lh-calendar--open')
    if (props.customClass) classes.push(props.customClass)
    return classes
  })

  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  // input 模式：点击组件外部收起面板（仅 H5——MP 无 document，面板由触发框点击切换）
  function onDocMousedown(event: MouseEvent): void {
    if (!panelOpen.value) return
    if (rootRef.value && !rootRef.value.contains(event.target as Node)) panelOpen.value = false
  }

  onMounted(() => {
    if (isInputMode.value && LH_IS_H5) document.addEventListener('mousedown', onDocMousedown)
  })

  onBeforeUnmount(() => {
    if (LH_IS_H5) document.removeEventListener('mousedown', onDocMousedown)
  })

  return {
    rootRef,
    panelOpen,
    isInputMode,
    weekLabels,
    panelMonths,
    panelTitle,
    prevMonthLabel,
    nextMonthLabel,
    placeholderText,
    inputText,
    rootClasses,
    sxStyle,
    isSelected,
    isWithinSpan,
    isDisabled,
    isFocusTarget,
    cellAria,
    select,
    togglePanel,
    shiftMonth,
    onKeydown,
  }
}
