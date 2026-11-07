import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  buildHeaderCells,
  clampColumnWidth,
  computeVisibleRange,
  cycleSortOrder,
  filterTableRows,
  flattenLeafColumns,
  getCellValue,
  getGridTemplate,
  getHeaderStickyOffsets,
  getStickyOffsets,
  getTableCellClassNames,
  getTableClassNames,
  getTableSortAria,
  sortTableRows,
} from '@lh-ui/share/core/table'
import { LH_KEYS, sxToStyle } from '@lh-ui/share/core/shared'
import { getSingleLhRect } from '@/adapter/getRect'
import { LH_IS_H5 } from '@/adapter/platform'
import { useLhPopper } from '@/adapter/popper'
import { useLhZIndex } from '@/composables'
import { lhlocale } from '@/adapter/locale'
import type { LhEmitFn } from '@/types/emit'
import type {
  LhTableColumn,
  LhTableHeaderCell,
  LhTableRow,
  LhTableSortOrder,
} from '@lh-ui/share/core/table'
import type { LhTableResolvedProps } from './types'

/** MP 端筛选面板遮罩与过渡的类名契约（遮罩点按关闭，代替 H5 的 document 级 click-outside） */
type LhUniScrollEvent = { detail?: { scrollTop?: unknown } }

/**
 * Table 表格胶水（逻辑对齐 plus 仓，MP 端改 scroll-view 变体）
 *
 * 表头构建 / 排序 / 过滤 / 虚拟区间 / 类名 / sticky 偏移全部走 share core
 * 纯函数，本仓不复制任何 core 实现。
 *
 * 【uni-app 差异】
 * - 结构：H5 照 plus（表头 + 表体两个独立横向滚动容器，scrollLeft 双向同步）；
 *   MP 端外层 scroll-view（scroll-x）整表横向滚动，表体内部再套 scroll-view
 *   （scroll-y）承载纵向滚动与虚拟切片——单根横向滚动轴天然同步表头表体，
 *   无需双向同步机制。
 * - 斑马纹：share 的 `:nth-child(even)` 规则净化期登记为 H5-only（WXSS 不支持
 *   nth 伪类），MP 端模板按行索引补 `lh-table__row--alt` 类（SFC 内联兜底样式，
 *   同 lh-pagination 的禁用兜底先例）。
 * - 固定列：share 的 `position: sticky` 规则净化期登记为 H5-only（WXSS 对表格
 *   单元格的 sticky 支持不可靠），MP 端固定列退化为普通横向滚动列。
 * - 列宽拖拽：mousedown / 键盘语义在 MP 不存在，模板内条件编译只在 H5 渲染
 *   拖拽手柄（MP 包里无死代码，守卫原则）。
 * - 视口度量：H5 用 clientHeight + ResizeObserver（plus 同款）；MP 无
 *   ResizeObserver，改 createSelectorQuery 量表体高度（getSingleLhRect）。
 * - 筛选面板：plus 用 teleport + useLhClickOutside；uniapp 改 lh-root-portal
 *   承载 + 页内透明遮罩点按关闭（同 lh-popover 先例），面板定位复用
 *   useLhPopper（触发器为当前打开列手柄，用 `--open` 修饰类作为选择器）。
 * - 排序触发器 / 筛选触发器 / 按钮：MP 的 button 无法 reset 默认样式，
 *   改 view 自绘 + role=button（同 lh-pagination 先例）。
 */
export function useLhTable(
  props: LhTableResolvedProps,
  emit: LhEmitFn<
    | 'sortChange'
    | 'rowClick'
    | 'filterChange'
    | 'update:filteredValues'
    | 'columnResize'
  >,
) {
  const instance = getCurrentInstance()
  const uid = instance?.uid ?? Math.random().toString(36).slice(2)
  /** 表体 id（MP 端 createSelectorQuery / H5 端 DOM 订阅的选择器） */
  const bodyId = `lh-table-body-${uid}`
  /** 表头 id（H5 端横向滚动同步的选择器） */
  const headerId = `lh-table-header-${uid}`

  /**
   * H5 端按 id 取 DOM（不用模板 ref：uni-h5 的 view 是 Vue 组件，
   * ref 拿到的是组件实例代理而非 DOM 节点，clientHeight / scrollLeft 都不存在）
   */
  function bodyElement(): HTMLElement | null {
    return document.getElementById(bodyId)
  }
  function headerElement(): HTMLElement | null {
    return document.getElementById(headerId)
  }
  /** 筛选面板 id（useLhPopper 的气泡选择器） */
  const filterPanelId = `lh-table-filter-panel-${uid}`

  const t = (path: string, fallback?: string) => {
    void lhlocale.version.value
    return lhlocale.t(path, fallback)
  }

  /** ============ 列结构（多级表头） ============ */
  const headerCells = computed(() => buildHeaderCells(props.columns))
  const leafColumns = computed(() => flattenLeafColumns(props.columns))

  /** 表头按层级分行渲染（平铺配置只有一行） */
  const headerRows = computed(() => {
    const rows: LhTableHeaderCell[][] = []
    for (const cell of headerCells.value) {
      ;(rows[cell.level] ??= []).push(cell)
    }
    return rows
  })

  const headerDepth = computed(() => headerRows.value.length)

  /** ============ 排序 ============ */
  const sortProp = ref<string | undefined>(props.defaultSortProp)
  const sortOrder = ref<LhTableSortOrder | undefined>(props.defaultSortOrder)

  function toggleSort(column: LhTableColumn): void {
    if (!column.sortable) return
    // 切换排序列时从无到有；同列按 asc → desc → 无循环
    const nextOrder = sortProp.value === column.prop ? cycleSortOrder(sortOrder.value) : 'asc'
    sortProp.value = nextOrder ? column.prop : undefined
    sortOrder.value = nextOrder
    emit('sortChange', { prop: column.prop, order: nextOrder })
  }

  /** aria-sort 值（契约由 share 的 getTableSortAria 决定，这里摊成模板可直接绑定的字符串） */
  function ariaSort(column: LhTableColumn): 'ascending' | 'descending' | 'none' | undefined {
    const attrs = getTableSortAria({
      sortOrder: sortProp.value === column.prop ? sortOrder.value : undefined,
      sortable: column.sortable,
    })
    const value = attrs['aria-sort']
    return typeof value === 'string'
      ? (value as 'ascending' | 'descending' | 'none')
      : undefined
  }

  function sortIcon(column: LhTableColumn): string {
    if (sortProp.value !== column.prop || !sortOrder.value) return '↕'
    return sortOrder.value === 'asc' ? '↑' : '↓'
  }

  /** ============ 筛选 ============ */
  const innerFiltered = ref<Record<string, (string | number)[]>>({
    ...props.defaultFilteredValues,
  })
  const filteredValues = computed(() => props.filteredValues ?? innerFiltered.value)

  function isColumnFiltered(prop: string): boolean {
    return (filteredValues.value[prop] ?? []).length > 0
  }

  /** 参与过滤的列与其选中值 */
  const activeFilters = computed(() =>
    leafColumns.value
      .filter((column) => column.filters?.length)
      .map((column) => ({ column, values: filteredValues.value[column.prop] ?? [] })),
  )

  const openFilterProp = ref<string | null>(null)
  const draftValues = ref<(string | number)[]>([])
  const { nextZIndex } = useLhZIndex()

  const filterPanelColumn = computed(() =>
    openFilterProp.value
      ? leafColumns.value.find((c) => c.prop === openFilterProp.value) ?? null
      : null,
  )

  function toggleDraftValue(value: string | number): void {
    const i = draftValues.value.indexOf(value)
    if (i === -1) draftValues.value = [...draftValues.value, value]
    else draftValues.value = draftValues.value.filter((v) => v !== value)
  }

  function setDraftValue(value: string | number): void {
    draftValues.value = [value]
  }

  function closeFilter(): void {
    openFilterProp.value = null
    draftValues.value = []
  }

  function commitFilter(prop: string, values: (string | number)[]): void {
    innerFiltered.value = { ...filteredValues.value, [prop]: values }
    emit('update:filteredValues', innerFiltered.value)
    emit('filterChange', { prop, values })
  }

  function confirmFilter(): void {
    const prop = openFilterProp.value
    if (!prop) return
    commitFilter(prop, [...draftValues.value])
    closeFilter()
  }

  function resetFilter(): void {
    const prop = openFilterProp.value
    if (!prop) return
    draftValues.value = []
    commitFilter(prop, [])
    closeFilter()
  }

  /** 面板定位：触发器用「当前打开列手柄的 --open 修饰类」作为选择器，
   *  useLhPopper 每次打开时重新度量（popperStyle 含 fixed 定位） */
  const { popperStyle: filterPanelPosition, visible: filterPanelPositioned, update: updateFilterPanelPosition } = useLhPopper(
    `.lh-table__filter-trigger--open`,
    `#${filterPanelId}`,
    instance?.proxy ?? null,
    { placement: 'bottom-start' },
  )

  const filterPanelStyle = computed(() => ({
    ...filterPanelPosition.value,
    zIndex: String(nextZIndex()),
  }))

  /** 打开某列的筛选面板（克隆当前选中态为草稿，确定才写回） */
  function toggleFilter(column: LhTableColumn): void {
    if (openFilterProp.value === column.prop) {
      closeFilter()
      return
    }
    openFilterProp.value = column.prop
    draftValues.value = [...(filteredValues.value[column.prop] ?? [])]
    void updateFilterPanelPosition()
  }

  /** ============ 列宽拖拽（H5 专属） ============ */
  /** 列宽覆盖（拖拽/键盘调整后按 prop 记录，不改动使用方传入的 columns） */
  const widthOverrides = ref<Record<string, number>>({})

  function isResizable(column: LhTableColumn): boolean {
    return LH_IS_H5 && !!props.resizable && column.resizable !== false && typeof column.width === 'number'
  }

  /** 合并覆盖宽度后的叶子列（供网格模板与 sticky 偏移消费） */
  const resolvedLeafColumns = computed(() =>
    leafColumns.value.map((column) => {
      const override = widthOverrides.value[column.prop]
      return override != null ? { ...column, width: override } : column
    }),
  )

  const stickyOffsets = computed(() => getStickyOffsets(resolvedLeafColumns.value))
  const headerStickyOffsets = computed(() =>
    getHeaderStickyOffsets(resolvedLeafColumns.value, headerCells.value),
  )
  const gridTemplate = computed(() => getGridTemplate(resolvedLeafColumns.value))

  let resizingProp: string | null = null
  let resizeStartX = 0
  let resizeStartWidth = 0

  function onResizeStart(event: MouseEvent, column: LhTableColumn): void {
    if (!isResizable(column)) return
    event.preventDefault()
    resizingProp = column.prop
    resizeStartX = event.clientX
    resizeStartWidth = widthOverrides.value[column.prop] ?? (column.width as number)
    document.addEventListener('mousemove', onResizeMove)
    document.addEventListener('mouseup', onResizeEnd)
  }

  function onResizeMove(event: MouseEvent): void {
    if (!resizingProp) return
    const next = clampColumnWidth(resizeStartWidth + (event.clientX - resizeStartX))
    widthOverrides.value = { ...widthOverrides.value, [resizingProp]: next }
  }

  function onResizeEnd(): void {
    document.removeEventListener('mousemove', onResizeMove)
    document.removeEventListener('mouseup', onResizeEnd)
    if (resizingProp) {
      const prop = resizingProp
      resizingProp = null
      emit('columnResize', { prop, width: widthOverrides.value[prop] as number })
    }
  }

  function onResizeKeydown(event: KeyboardEvent, column: LhTableColumn): void {
    if (!isResizable(column)) return
    if (event.key !== LH_KEYS.ArrowLeft && event.key !== LH_KEYS.ArrowRight) return
    event.preventDefault()
    const step = (event.key === LH_KEYS.ArrowRight ? 1 : -1) * 10
    const current = widthOverrides.value[column.prop] ?? (column.width as number)
    widthOverrides.value = {
      ...widthOverrides.value,
      [column.prop]: clampColumnWidth(current + step),
    }
    emit('columnResize', { prop: column.prop, width: widthOverrides.value[column.prop] as number })
  }

  /** ============ 数据链：过滤 → 排序 → 虚拟切片 ============ */
  const filteredRows = computed(() => filterTableRows(props.data, activeFilters.value))
  const sortedRows = computed(() =>
    sortTableRows(filteredRows.value, sortProp.value ?? '', sortOrder.value, props.sorter),
  )

  /** ============ 虚拟滚动 ============ */
  const isVirtual = computed(() => props.height != null)
  const scrollTop = ref(0)
  const viewportHeight = ref(0)
  const range = computed(() =>
    computeVisibleRange(
      scrollTop.value,
      viewportHeight.value,
      props.rowHeight,
      sortedRows.value.length,
    ),
  )
  const totalHeight = computed(() => range.value.totalHeight)
  const visibleRows = computed(() =>
    isVirtual.value ? sortedRows.value.slice(range.value.start, range.value.end) : sortedRows.value,
  )
  const windowStyle = computed(() =>
    isVirtual.value ? { transform: `translateY(${range.value.offsetY}px)` } : undefined,
  )
  const rowStyle = computed(() =>
    isVirtual.value ? { height: `${props.rowHeight}px` } : undefined,
  )

  function onScroll(event: Event): void {
    const detail = (event as unknown as LhUniScrollEvent).detail
    if (typeof detail?.scrollTop === 'number') {
      // MP：scroll-view 的滚动载荷
      if (isVirtual.value) scrollTop.value = detail.scrollTop
      return
    }
    const target = event.target as HTMLElement
    if (isVirtual.value) scrollTop.value = target.scrollTop
    // 横向滚动同步表头（H5 独有：表头/表体是两个独立的宽度体系）
    if (LH_IS_H5) syncScrollLeft(target, headerElement())
  }

  /**
   * 表头↔表体横向滚动双向同步（H5 独有；MP 端表头表体在同一根横向滚动轴内，
   * 不需要此机制）。同步标记防止两个 scroll 事件互相触发形成回环。
   */
  let isSyncingScroll = false
  function syncScrollLeft(source: HTMLElement | null, target: HTMLElement | null): void {
    if (!source || !target || isSyncingScroll) return
    isSyncingScroll = true
    target.scrollLeft = source.scrollLeft
    isSyncingScroll = false
  }

  function onHeaderScroll(event: Event): void {
    if (!LH_IS_H5) return
    syncScrollLeft(event.target as HTMLElement, bodyElement())
  }

  let resizeObserver: ResizeObserver | null = null

  /** 量表体视口高度：H5 同步 clientHeight；MP 异步 createSelectorQuery */
  async function measure(): Promise<void> {
    if (LH_IS_H5) {
      const el = bodyElement()
      if (el) viewportHeight.value = el.clientHeight
      return
    }
    try {
      const rect = await getSingleLhRect(`#${bodyId}`, instance?.proxy ?? null)
      viewportHeight.value = rect.height
    } catch {
      // 容器未渲染时忽略，下一次 scroll / prop 变化补量
    }
  }

  /**
   * 表体的竖向滚动条会吃掉一段宽度（平台相关，Chrome 桌面约 15px）。表头与表体
   * 共用同一份 gridTemplate，但两端网格区域不同宽时 fr 列解析结果不同，列边界
   * 错位。给表头右侧补等宽内边距，让表头网格与表体内容区同宽（表头背景色自然
   * 铺满这段槽位）。
   */
  function syncHeaderGutter(): void {
    if (!LH_IS_H5) return
    const body = bodyElement()
    const header = headerElement()
    if (!body || !header) return
    const gutter = body.offsetWidth - body.clientWidth
    header.style.paddingRight = gutter > 0 ? `${gutter}px` : ''
  }

  onMounted(() => {
    void measure()
    syncHeaderGutter()
    if (LH_IS_H5) {
      // H5 端原生挂监听：模板 @scroll 在 uni-h5 的 view 上不触发
      // （View 组件不转发原生 scroll 事件），直接 addEventListener 到
      // 表头 / 表体的真实 DOM
      bodyElement()?.addEventListener('scroll', onScroll, { passive: true })
      headerElement()?.addEventListener('scroll', onHeaderScroll, { passive: true })
      const body = bodyElement()
      if (typeof ResizeObserver !== 'undefined' && body) {
        resizeObserver = new ResizeObserver(() => {
          void measure()
          // 容器缩放 / max-height 切换与数据增减（幻影高度变化导致竖向滚动条
          // 出现或消失）都要重算表头槽位
          syncHeaderGutter()
        })
        resizeObserver.observe(body)
      }
      window.addEventListener('resize', measure)
    }
  })

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
    resizeObserver = null
    if (LH_IS_H5) {
      bodyElement()?.removeEventListener('scroll', onScroll)
      headerElement()?.removeEventListener('scroll', onHeaderScroll)
      window.removeEventListener('resize', measure)
      document.removeEventListener('mousemove', onResizeMove)
      document.removeEventListener('mouseup', onResizeEnd)
    }
  })

  /** ============ 样式与类名 ============ */
  function rowKeyOf(row: LhTableRow, index: number): string | number {
    const key = row[props.rowKey]
    return key == null ? index : (key as string | number)
  }

  /** 表体单元格样式（含 sticky 偏移；MP 端 sticky 规则已按 H5-only 剔除，left/right 内联值不生效） */
  function cellStyle(colIndex: number): Record<string, string> {
    const sticky = stickyOffsets.value[colIndex]
    const style: Record<string, string> = {}
    if (sticky.left != null) style.left = `${sticky.left}px`
    if (sticky.right != null) style.right = `${sticky.right}px`
    const align = resolvedLeafColumns.value[colIndex].align
    if (align) style.textAlign = align
    return style
  }

  /** 表头单元格样式：网格定位 + sticky 偏移 */
  function headerCellStyle(cell: (typeof headerCells.value)[number]): Record<string, string> {
    const style: Record<string, string> = {
      gridColumn: `${cell.leafStart + 1} / span ${cell.colspan}`,
      gridRow: `${cell.level + 1} / span ${cell.rowspan}`,
    }
    const sticky = headerStickyOffsets.value[headerCells.value.indexOf(cell)]
    if (sticky?.left != null) style.left = `${sticky.left}px`
    if (sticky?.right != null) style.right = `${sticky.right}px`
    const align = cell.column.align
    if (align) style.textAlign = align
    return style
  }

  /** 行网格模板（表头与表体共用，保证列对齐） */
  const gridRowStyle = computed(() => ({ gridTemplateColumns: gridTemplate.value }))

  /** 表头容器同时定义列模板与行模板 */
  const headerStyle = computed(() => ({
    gridTemplateColumns: gridTemplate.value,
    gridTemplateRows: `repeat(${headerDepth.value}, auto)`,
  }))

  function headerCellClasses(cell: (typeof headerCells.value)[number]): string[] {
    return getTableCellClassNames({
      align: cell.column.align ?? 'left',
      fixed: cell.column.fixed,
      lastFixedLeft: cell.isLeaf && isLastFixedLeft(cell.leafStart),
      firstFixedRight: cell.isLeaf && isFirstFixedRight(cell.leafStart),
      resizable: cell.isLeaf && isResizable(cell.column),
    })
  }

  function bodyCellClasses(colIndex: number): string[] {
    const column = resolvedLeafColumns.value[colIndex]
    return getTableCellClassNames({
      align: column.align ?? 'left',
      fixed: column.fixed,
      lastFixedLeft: isLastFixedLeft(colIndex),
      firstFixedRight: isFirstFixedRight(colIndex),
    })
  }

  function isLastFixedLeft(leafIndex: number): boolean {
    return resolvedLeafColumns.value[leafIndex + 1]?.fixed !== 'left'
  }

  function isFirstFixedRight(leafIndex: number): boolean {
    return resolvedLeafColumns.value[leafIndex - 1]?.fixed !== 'right'
  }

  const tableClasses = computed(() =>
    getTableClassNames({
      stripe: props.stripe,
      border: props.border,
      size: props.size,
      virtual: isVirtual.value,
    }),
  )

  const rootStyle = computed(() => sxToStyle(props.sx ?? {}))

  /**
   * 尺寸归一化：纯数字（number 或 "200" 这类无单位数字串）补 px。
   * CSSOM 会静默丢弃无单位长度，官方 demo 的 max-height="200" 曾因此完全失效。
   */
  function normalizeSize(value: string | number | undefined): string | undefined {
    if (value == null) return undefined
    if (typeof value === 'number') return `${value}px`
    const trimmed = value.trim()
    return /^\d+(\.\d+)?$/.test(trimmed) ? `${trimmed}px` : value
  }

  const bodyStyle = computed(() => {
    if (props.height == null) {
      return props.maxHeight == null ? undefined : { maxHeight: normalizeSize(props.maxHeight) }
    }
    return { height: normalizeSize(props.height) }
  })

  /**
   * MP 端横向滚动内层宽度：叶子列全部可换算为 px 时取总和，横向滚动生效；
   * 任意一列无法换算（无宽 / 百分比）则不设宽度（横向滚动可能不生效，
   * 属已登记的平台限制）。
   */
  const mpContentWidth = computed(() => {
    const cols = resolvedLeafColumns.value
    if (cols.length === 0) return undefined
    let total = 0
    for (const column of cols) {
      if (typeof column.width === 'number') {
        total += column.width
        continue
      }
      if (typeof column.width === 'string') {
        const px = /^(\d+(?:\.\d+)?)px$/.exec(column.width.trim())
        if (px) {
          total += parseFloat(px[1])
          continue
        }
      }
      return undefined
    }
    return `${total}px`
  })

  const mpInnerStyle = computed(() => (mpContentWidth.value ? { width: mpContentWidth.value } : undefined))

  return {
    bodyId,
    headerId,
    filterPanelId,
    t,
    // 列结构
    headerCells,
    leafColumns,
    headerRows,
    // 排序
    sortProp,
    sortOrder,
    toggleSort,
    ariaSort,
    sortIcon,
    // 筛选
    openFilterProp,
    filterPanelColumn,
    draftValues,
    filterPanelStyle,
    filterPanelPositioned,
    toggleFilter,
    closeFilter,
    toggleDraftValue,
    setDraftValue,
    confirmFilter,
    resetFilter,
    isColumnFiltered,
    // 拖拽
    isResizable,
    onResizeStart,
    onResizeKeydown,
    // 数据渲染
    getCellValue,
    sortedRows,
    // 虚拟滚动
    isVirtual,
    range,
    scrollTop,
    totalHeight,
    visibleRows,
    windowStyle,
    rowStyle,
    onScroll,
    onHeaderScroll,
    // 样式
    rootStyle,
    headerStyle,
    bodyStyle,
    gridRowStyle,
    headerCellStyle,
    headerCellClasses,
    bodyCellClasses,
    cellStyle,
    tableClasses,
    rowKeyOf,
    mpInnerStyle,
  }
}
