import { describe, expect, it, vi, afterEach } from 'vitest'
import { mount } from '../mount'
import { nextTick } from 'vue'
import LhTable from '../../src/components/lh-table/lh-table.vue'
import type { LhTableColumn } from '../../src/components/lh-table/types'

/**
 * Table 表格测试（H5 语义）
 *
 * 排序 / 过滤 / 虚拟区间 / 类名的纯函数边界在 share 仓，这里验证胶水：
 * 渲染、排序联动、筛选面板开确定关、斑马纹 alt 类、虚拟滚动、插槽、空态。
 * 筛选面板定位走 useLhPopper，度量按既有弹层 spec 套路打桩。
 */
const rows = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  name: `用户 ${i + 1}`,
  age: 20 + (i % 30),
  city: ['北京', '上海', '深圳'][i % 3],
}))

const columns: LhTableColumn[] = [
  { prop: 'name', label: '姓名', width: 140 },
  { prop: 'age', label: '年龄', width: 100, align: 'right' },
  { prop: 'city', label: '城市', width: 120 },
]

const sortableColumns: LhTableColumn[] = [
  { prop: 'name', label: '姓名', width: 140, sortable: true },
  { prop: 'age', label: '年龄', width: 100, sortable: true, align: 'right' },
]

const filterableColumns: LhTableColumn[] = [
  { prop: 'name', label: '姓名', width: 140 },
  {
    prop: 'city',
    label: '城市',
    width: 120,
    filters: [
      { text: '北京', value: '北京' },
      { text: '上海', value: '上海' },
    ],
  },
]

// 筛选面板定位的度量打桩（useLhPopper 的两帧时序；本组件其它 H5 度量走
// clientHeight，不经 getRect，故全局打桩无副作用）
vi.mock('@/adapter/getRect', () => ({
  getSingleLhRect: async (selector: string) => {
    if (selector.includes('filter-trigger')) {
      return { top: 200, left: 20, width: 100, height: 32, right: 120, bottom: 232 }
    }
    return { top: 232, left: 20, width: 160, height: 96, right: 180, bottom: 328 }
  },
}))

function setBodyClientHeight(value: number) {
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(value)
}

async function scrollBody(wrapper: ReturnType<typeof mount>, scrollTop: number) {
  const body = wrapper.find('.lh-table__body').element
  vi.spyOn(body, 'scrollTop', 'get').mockReturnValue(scrollTop)
  body.dispatchEvent(new Event('scroll'))
  await nextTick()
}

describe('LhTable', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    // attachTo 挂载的组件留在 body 上，用例间清理掉
    document.body.innerHTML = ''
  })

  it('renders header and body cells from column config', () => {
    const wrapper = mount(LhTable, {
      props: { data: rows, columns },
    })
    const headerCells = wrapper.findAll('.lh-table__header .lh-table__cell')
    expect(headerCells.map((c) => c.text())).toEqual(['姓名', '年龄', '城市'])
    // 对齐修饰类由 share 的 getTableCellClassNames 决定
    expect(headerCells[1].classes()).toContain('lh-table__cell--right')

    const firstRow = wrapper.find('.lh-table__row')
    expect(firstRow.findAll('.lh-table__cell')[0].text()).toBe('用户 1')
    expect(wrapper.findAll('.lh-table__row')).toHaveLength(rows.length)
  })

  it('applies stripe alt class on odd rendered rows', () => {
    const wrapper = mount(LhTable, {
      props: { data: rows, columns, stripe: true },
    })
    const tableRows = wrapper.findAll('.lh-table__row')
    expect(tableRows[0].classes()).not.toContain('lh-table__row--alt')
    expect(tableRows[1].classes()).toContain('lh-table__row--alt')
    // share 的 :nth-child 规则仅 H5（净化期登记），MP 由 --alt 类兜底
  })

  it('toggles sort on header tap and emits sortChange', async () => {
    const wrapper = mount(LhTable, {
      props: { data: rows, columns: sortableColumns },
    })
    const trigger = wrapper.findAll('.lh-table__sort-trigger')[1]
    await trigger.trigger('click')
    // 同列首次点击：无 → asc
    expect(wrapper.emitted('sortChange')?.[0]).toEqual([{ prop: 'age', order: 'asc' }])
    expect(wrapper.find('.lh-table__sort-icon--active').text()).toBe('↑')

    await trigger.trigger('click')
    expect(wrapper.emitted('sortChange')?.[1]).toEqual([{ prop: 'age', order: 'desc' }])
    await trigger.trigger('click')
    expect(wrapper.emitted('sortChange')?.[2]).toEqual([{ prop: 'age', order: undefined }])
  })

  it('sorts rows through the share pure function chain', async () => {
    const wrapper = mount(LhTable, {
      props: { data: rows, columns: sortableColumns },
    })
    await wrapper.findAll('.lh-table__sort-trigger')[1].trigger('click')
    const firstRow = wrapper.find('.lh-table__row')
    // 年龄升序：20 + (i % 30) 最小为 20（i=0），其 name 为「用户 1」
    expect(firstRow.findAll('.lh-table__cell')[0].text()).toBe('用户 1')
    // 降序：24 行数据里年龄最大 43（i % 30 == 23），首个命中 → 用户 24
    await wrapper.findAll('.lh-table__sort-trigger')[1].trigger('click')
    expect(wrapper.find('.lh-table__row').findAll('.lh-table__cell')[0].text()).toBe('用户 24')
  })

  it('opens the filter panel, drafts and confirms, filtering rows', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhTable, {
      props: { data: rows, columns: filterableColumns },
    })
    await wrapper.find('.lh-table__filter-trigger').trigger('click')
    await nextTick()
    await vi.runAllTimersAsync()
    await nextTick()

    const panel = wrapper.find('.lh-table__filter-panel')
    expect(panel.exists()).toBe(true)
    expect(panel.findAll('.lh-table__filter-option')).toHaveLength(2)

    // 勾选「北京」并确定：草稿写回，行被过滤
    await panel.findAll('.lh-table__filter-option')[0].trigger('click')
    await panel.findAll('.lh-table__filter-btn--primary')[0].trigger('click')
    expect(wrapper.emitted('filterChange')?.[0]).toEqual([{ prop: 'city', values: ['北京'] }])
    expect(wrapper.emitted('update:filteredValues')?.[0]).toEqual([{ city: ['北京'] }])
    expect(wrapper.findAll('.lh-table__row')).toHaveLength(8)

    // 筛选激活态标记
    expect(wrapper.find('.lh-table__filter-icon--active').exists()).toBe(true)
    vi.useRealTimers()
  })

  it('closes the filter panel via the transparent mask', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhTable, {
      props: { data: rows, columns: filterableColumns },
    })
    await wrapper.find('.lh-table__filter-trigger').trigger('click')
    await nextTick()
    await vi.runAllTimersAsync()
    await nextTick()

    expect(wrapper.find('.lh-table__filter-panel').exists()).toBe(true)
    await wrapper.find('.lh-table__filter-mask').trigger('click')
    expect(wrapper.find('.lh-table__filter-panel').exists()).toBe(false)
    vi.useRealTimers()
  })

  it('renders only the visible window when height is set (virtual scroll)', async () => {
    setBodyClientHeight(240)
    const wrapper = mount(LhTable, {
      attachTo: document.body,
      props: { data: rows, columns, height: 240, rowHeight: 48 },
    })
    await nextTick()
    await nextTick()
    // 240 / 48 = 5 可见行，虚拟模式下绝不全量渲染
    const rendered = wrapper.findAll('.lh-table__row').length
    expect(rendered).toBeGreaterThanOrEqual(5)
    expect(rendered).toBeLessThan(rows.length)

    await scrollBody(wrapper, 480)
    const firstRow = wrapper.find('.lh-table__row')
    // 滚动 480 / 48 = 10 行，窗口起点按 overscan(3) 回退到下标 7 → 用户 8
    expect(firstRow.findAll('.lh-table__cell')[0].text()).toBe('用户 8')
  })

  it('emits rowClick with row and index on row tap', async () => {
    const wrapper = mount(LhTable, {
      props: { data: rows, columns },
    })
    await wrapper.find('.lh-table__row').trigger('click')
    expect(wrapper.emitted('rowClick')?.[0][1]).toBe(0)
    expect((wrapper.emitted('rowClick')?.[0][0] as { name: string }).name).toBe('用户 1')
  })

  it('renders custom cells via named scoped slots', () => {
    const wrapper = mount(LhTable, {
      props: {
        data: rows,
        columns: [{ prop: 'name', label: '姓名', width: 140, slot: 'name' }],
      },
      slots: {
        name: ({ row }: { row: { name: string } }) => `自定义：${row.name}`,
      },
    })
    expect(wrapper.find('.lh-table__row .lh-table__cell').text()).toBe('自定义：用户 1')
  })

  it('renders the empty slot when data is empty', () => {
    const wrapper = mount(LhTable, {
      props: { data: [], columns },
      slots: { empty: () => '暂无记录' },
    })
    expect(wrapper.find('.lh-table__empty').text()).toBe('暂无记录')
    expect(wrapper.find('.lh-table__row').exists()).toBe(false)
  })

  it('applies border and size classes from share pure function', () => {
    const wrapper = mount(LhTable, {
      props: { data: rows, columns, border: true, size: 'small' },
    })
    expect(wrapper.find('.lh-table').classes()).toContain('lh-table--border')
    expect(wrapper.find('.lh-table').classes()).toContain('lh-table--small')
  })
})
