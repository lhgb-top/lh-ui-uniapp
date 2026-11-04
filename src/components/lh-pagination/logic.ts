import { computed, ref, watch } from 'vue'
import {
  clampPage,
  formatMessage,
  getPaginationItemAria,
  getPaginationRange,
  getPageCount,
} from '@lh-ui/share/core/pagination'
import { sxToStyle } from '@lh-ui/share/core/shared'
import { generateId } from '@lh-ui/share/utils'
import { lhlocale } from '@/adapter/locale'
import type { LhEmitFn } from '@/types/emit'
import type { LhPaginationResolvedProps } from './types'

/**
 * uni 事件载荷形态：input / picker change 的值在 event.detail.value
 * （与浏览器事件不重叠，需要先转 unknown 再断言；blur 兜底走 target.value）
 */
type LhUniDetailEvent = { detail?: { value?: unknown } }

/**
 * Pagination 分页胶水（逻辑对齐 plus 仓）
 *
 * 受控 / 非受控双模式与 plus 一致：传入 current / pageSize 即受控同步（watch），
 * 内部值驱动渲染；页码钳制与页码区间（含省略号）全部走 share core 纯函数
 * （clampPage / getPageCount / getPaginationRange），本仓不复制任何 core 实现。
 *
 * 【uni-app 差异】
 * - 跳页输入提交时机：uni 的 input 没有原生 change 事件（小程序端只有 input /
 *   blur / confirm），改为「编辑草稿 + 失焦 / 确认时一次性提交」，等价 plus 的
 *   keydown.enter + blur 双提交（H5 回车会同时触发 confirm，统一走 confirm 避免
 *   同键双跳）；空串 / 非法数字不跳页（plus 对清空后的 blur 会 go('') 落回第 1 页，
 *   这里收紧为无操作，避免误跳）
 * - 条数切换：uni 无 select，用内置 picker（selector 模式）承载，change 的
 *   event.detail.value 是选项下标；禁用由点击守卫 + aria-disabled 表达
 * - 页码按钮由 view 自绘点击（MP 的 button 无法 reset 默认样式），view 无
 *   :disabled 伪类，禁用外观由 SFC 内联兜底规则按同一令牌补齐（同 lh-segmented 先例）
 * - 无障碍属性包由 share 的 getPaginationItemAria 产出契约（aria-current /
 *   aria-label），因 MP 模板编译器不支持 v-bind 对象，这里摊成具体值逐项绑定
 */
export function useLhPagination(
  props: LhPaginationResolvedProps,
  emit: LhEmitFn<'update:current' | 'update:pageSize' | 'change' | 'size-change'>,
) {
  // 受控/非受控双模式：传入 current/pageSize 即受控同步，内部值驱动渲染
  const innerCurrent = ref(
    clampPage(props.current ?? 1, getPageCount(props.total, props.pageSize)),
  )
  const innerPageSize = ref(props.pageSize)

  const pageCount = computed(() => getPageCount(props.total, innerPageSize.value))

  watch(
    () => props.current,
    (val) => {
      if (val !== undefined) innerCurrent.value = clampPage(val, pageCount.value)
    },
  )
  watch(
    () => props.pageSize,
    (val) => {
      if (val !== undefined) innerPageSize.value = val
    },
  )
  watch(pageCount, (count) => {
    if (innerCurrent.value > count) go(count)
  })

  /** 页码区间（含省略号），窗口收缩算法在 core（首末常驻 + 当前页两侧吸附） */
  const range = computed(() =>
    getPaginationRange({ current: innerCurrent.value, pageCount: pageCount.value }),
  )

  function go(page: number): void {
    const target = clampPage(page, pageCount.value)
    if (props.disabled || target === innerCurrent.value) return
    innerCurrent.value = target
    emit('update:current', target)
    emit('change', target)
  }

  /** 条数切换（picker change 取选项下标）：同值忽略；条数变化后当前页可能越界，钳制并通知 */
  function handleSizeChange(event: Event): void {
    if (props.disabled) return
    const detail = (event as unknown as LhUniDetailEvent).detail
    const index = Number(detail?.value)
    const size = props.pageSizes[index]
    if (!Number.isInteger(size) || size === innerPageSize.value) return
    innerPageSize.value = size
    emit('update:pageSize', size)
    emit('size-change', size)
    const target = clampPage(innerCurrent.value, pageCount.value)
    if (target !== innerCurrent.value) go(target)
  }

  /** picker 的选中下标（当前条数不在选项里时为 -1，picker 不高亮任何项） */
  const sizeIndex = computed(() => props.pageSizes.indexOf(innerPageSize.value))

  // 跳页：编辑草稿 + 失焦 / 确认一次性提交（同 lh-input-number 先例）
  const jumpDraft = ref<string | null>(null)
  const jumperId = generateId('lh-pagination-jumper')

  /** 输入框显示值：编辑中显示草稿原文，提交后清空（等价 plus 的 jumpPage 复位） */
  const jumpDisplay = computed(() => jumpDraft.value ?? '')

  /** 事件取值：uni 载荷在 detail.value；blur 无 string detail 时回退读原生 target.value */
  function resolveUniValue(event: Event): string {
    const detail = (event as unknown as LhUniDetailEvent).detail
    if (detail && typeof detail.value === 'string') return detail.value
    const target = event.target as { value?: unknown } | null
    return typeof target?.value === 'string' ? target.value : ''
  }

  /** 输入中：仅同步草稿不提交 */
  function handleJumpInput(event: Event): void {
    jumpDraft.value = resolveUniValue(event)
  }

  /**
   * 提交跳页（confirm / blur 统一入口）：空串或非法数字不跳页、不发出事件
   * （plus 对清空后的 blur 会钳回第 1 页，这里收紧为无操作）；提交后清空草稿，
   * 输入框回到占位空态，与 plus 的 jumpPage = null 复位一致
   */
  function handleJump(event: Event): void {
    const raw = jumpDraft.value ?? resolveUniValue(event)
    jumpDraft.value = null
    const text = raw.trim()
    if (text === '') return
    const page = Number(text)
    if (Number.isNaN(page)) return
    go(page)
  }

  // 文案随语言切换重算（lhlocale.t 内部订阅版本号）
  const totalText = computed(() =>
    formatMessage(lhlocale.t('pagination.total', '共 {total} 条'), { total: props.total }),
  )
  const prevLabel = computed(() => lhlocale.t('pagination.prev', '上一页'))
  const nextLabel = computed(() => lhlocale.t('pagination.next', '下一页'))
  const gotoLabel = computed(() => lhlocale.t('pagination.goto', '前往'))
  const pageSuffixText = computed(() => lhlocale.t('pagination.pageSuffix', ''))
  const sizeChangerLabel = computed(() => lhlocale.t('pagination.sizeChangerLabel', '每页条数'))

  function sizeText(size: number): string {
    return formatMessage(lhlocale.t('pagination.sizeChanger', '{size} 条/页'), { size })
  }

  /** 前后翻页禁用态（根 disabled 一并禁住），模板据此落 --disabled 修饰类与 aria */
  const isPrevDisabled = computed(() => props.disabled || innerCurrent.value <= 1)
  const isNextDisabled = computed(() => props.disabled || innerCurrent.value >= pageCount.value)

  /**
   * 页码按钮的无障碍属性摊开（MP 模板编译器不支持 v-bind 对象）：
   * 契约由 share 的 getPaginationItemAria 决定（当前页 aria-current="page"，
   * 各页码带 aria-label），胶水层摊成模板可直接绑定的具体值；
   * ellipsis 项为纯展示，无属性
   */
  const itemAriaList = computed(() =>
    range.value.map((item) => {
      if (item.type !== 'page') {
        return { label: undefined, current: undefined }
      }
      const attrs = getPaginationItemAria({
        page: item.page,
        current: innerCurrent.value,
        labelTemplate: lhlocale.t('pagination.page', '第 {page} 页'),
      })
      return {
        label: typeof attrs['aria-label'] === 'string' ? attrs['aria-label'] : undefined,
        current: attrs['aria-current'] === 'page' ? ('page' as const) : undefined,
      }
    }),
  )

  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  return {
    innerCurrent,
    innerPageSize,
    pageCount,
    range,
    sizeIndex,
    jumpDisplay,
    jumperId,
    totalText,
    prevLabel,
    nextLabel,
    gotoLabel,
    pageSuffixText,
    sizeChangerLabel,
    isPrevDisabled,
    isNextDisabled,
    itemAriaList,
    sxStyle,
    sizeText,
    go,
    handleSizeChange,
    handleJumpInput,
    handleJump,
  }
}
