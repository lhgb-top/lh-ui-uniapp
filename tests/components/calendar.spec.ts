import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import LhCalendar from '../../src/components/lh-calendar/lh-calendar.vue'

/** 当前月（组件初始光标所在月），构造确定性日期用 */
const now = new Date()
const year = now.getFullYear()
const month = now.getMonth()

/** 构造当前月某一天的日期（与组件内部 new Date(y, m, d) 同构） */
function dateOfDay(day: number): Date {
  return new Date(year, month, day)
}

/** 在当前月单元格中找指定日序号（排除上下月填充的 --outside 单元格） */
function currentCell(wrapper: ReturnType<typeof mount>, day: number) {
  return wrapper
    .findAll('.lh-calendar__cell')
    .filter((cell) => !cell.classes('lh-calendar__cell--outside'))
    .find((cell) => cell.text() === String(day))!
}

function mountCalendar(props = {}) {
  return mount(LhCalendar, { props })
}

describe('LhCalendar', () => {
  it('渲染根节点、星期表头与当月网格（grid 语义）', () => {
    const wrapper = mountCalendar()
    const root = wrapper.find('.lh-calendar')
    expect(root.exists()).toBe(true)
    const grid = wrapper.find('.lh-calendar__grid')
    expect(grid.attributes('role')).toBe('grid')
    const weekdays = wrapper.findAll('.lh-calendar__weekday')
    expect(weekdays).toHaveLength(7)
    // 星期文案走 share 语言包 datepicker.weeks.*（默认中文）
    expect(weekdays.map((w) => w.text())).toEqual(['日', '一', '二', '三', '四', '五', '六'])
    // 面板标题格式按语言包：zh「2026年10月」
    expect(wrapper.find('.lh-calendar__title').text()).toContain(`${year}年`)
  })

  it('点击日期触发 select / update:modelValue / change（单选，受控值原样回传）', async () => {
    const wrapper = mountCalendar()
    const cell = currentCell(wrapper, 15)
    await cell.trigger('click')
    expect(wrapper.emitted('select')).toEqual([[dateOfDay(15)]])
    expect(wrapper.emitted('update:modelValue')).toEqual([[dateOfDay(15)]])
    expect(wrapper.emitted('change')).toEqual([[dateOfDay(15)]])
    // 未传 modelValue 为非受控模式：点击后内部选中态立即落下（selectedDates 走 innerDates）
    expect(cell.classes()).toContain('lh-calendar__cell--selected')
    // 受控模式（回写 modelValue）：选中态跟随 props
    await wrapper.setProps({ modelValue: dateOfDay(15) })
    expect(currentCell(wrapper, 15).classes()).toContain('lh-calendar__cell--selected')
  })

  it('v-model 双向绑定更新选中日期', async () => {
    const wrapper = mount(LhCalendar, {
      props: {
        modelValue: dateOfDay(10),
        'onUpdate:modelValue': (value: unknown) => wrapper.setProps({ modelValue: value as Date }),
      },
    })
    expect(currentCell(wrapper, 10).classes()).toContain('lh-calendar__cell--selected')
    await currentCell(wrapper, 20).trigger('click')
    expect(wrapper.props('modelValue')).toEqual(dateOfDay(20))
    expect(currentCell(wrapper, 20).classes()).toContain('lh-calendar__cell--selected')
    expect(currentCell(wrapper, 10).classes()).not.toContain('lh-calendar__cell--selected')
  })

  it('range 模式：两次点击产出归一化起止区间，中段日期落 --in-range', async () => {
    const wrapper = mount(LhCalendar, { props: { selection: 'range' } })
    await currentCell(wrapper, 5).trigger('click')
    // 首击后待完成：值是 [起点, 起点]
    expect(wrapper.emitted('update:modelValue')).toEqual([[[dateOfDay(5), dateOfDay(5)]]])
    await currentCell(wrapper, 20).trigger('click')
    const updates = wrapper.emitted('update:modelValue')!
    expect(updates[1]).toEqual([[dateOfDay(5), dateOfDay(20)]])
    await wrapper.setProps({ modelValue: [dateOfDay(5), dateOfDay(20)] })
    // 起止两端是 --selected，中间日期是 --in-range（不含两端）
    expect(currentCell(wrapper, 5).classes()).toContain('lh-calendar__cell--selected')
    expect(currentCell(wrapper, 20).classes()).toContain('lh-calendar__cell--selected')
    expect(currentCell(wrapper, 12).classes()).toContain('lh-calendar__cell--in-range')
    expect(currentCell(wrapper, 5).classes()).not.toContain('lh-calendar__cell--in-range')
  })

  it('range 模式：反序点击自动归一（compareDate 归一由 share 纯函数负责）', async () => {
    const wrapper = mount(LhCalendar, { props: { selection: 'range' } })
    await currentCell(wrapper, 20).trigger('click')
    await currentCell(wrapper, 5).trigger('click')
    expect(wrapper.emitted('update:modelValue')![1]).toEqual([[dateOfDay(5), dateOfDay(20)]])
  })

  it('multiple 模式：再点一次同一日期即取消，结果按时间排序', async () => {
    const wrapper = mount(LhCalendar, { props: { selection: 'multiple' } })
    await currentCell(wrapper, 20).trigger('click')
    await currentCell(wrapper, 5).trigger('click')
    expect(wrapper.emitted('update:modelValue')![1]).toEqual([[dateOfDay(5), dateOfDay(20)]])
    await wrapper.setProps({ modelValue: [dateOfDay(5), dateOfDay(20)] })
    // 命中已选日期则移除（toggle 由 share 的 toggleCalendarDate 负责）
    await currentCell(wrapper, 20).trigger('click')
    expect(wrapper.emitted('update:modelValue')![2]).toEqual([[dateOfDay(5)]])
  })

  it('range 约束：区间外日期禁用，点击无事件且带 --disabled 类', async () => {
    // 取离今天足够远的一天，保证落在约束区间外
    const farDay = now.getDate() > 13 ? now.getDate() - 12 : now.getDate() + 12
    const span: [Date, Date] = [
      new Date(year, month, now.getDate() - 5),
      new Date(year, month, now.getDate() + 5),
    ]
    const wrapper = mountCalendar({ range: span })
    const cell = currentCell(wrapper, farDay)
    expect(cell.classes()).toContain('lh-calendar__cell--disabled')
    expect(cell.attributes('aria-disabled')).toBe('true')
    await cell.trigger('click')
    expect(wrapper.emitted('select')).toBeUndefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    // 区间内日期（今天）正常可选
    const inside = currentCell(wrapper, now.getDate())
    expect(inside.classes()).not.toContain('lh-calendar__cell--disabled')
    await inside.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeDefined()
  })

  it('翻月按钮移动光标月，面板标题与网格跟随更新', async () => {
    const wrapper = mountCalendar()
    const navs = wrapper.findAll('.lh-calendar__nav')
    expect(navs).toHaveLength(2)
    await navs[1].trigger('click')
    // 下一月：标题变为 (year, month+1)；跨年回绕由 share 的 shiftCalendarMonth 归一
    const next = new Date(year, month + 1, 1)
    const title = wrapper.find('.lh-calendar__title').text()
    expect(title).toContain(String(next.getFullYear()))
    // 回到当前月
    await navs[0].trigger('click')
    expect(wrapper.find('.lh-calendar__title').text()).toContain(`${year}年`)
  })

  it('panels=2 同时渲染两个月面板', () => {
    const wrapper = mountCalendar({ panels: 2 })
    expect(wrapper.findAll('.lh-calendar__panel')).toHaveLength(2)
  })

  it('input 模式：点击触发框展开 / 收起，选中后自动关闭（closeOnSelect 默认开）', async () => {
    const wrapper = mountCalendar({ mode: 'input' })
    const trigger = wrapper.find('.lh-calendar__input')
    expect(trigger.exists()).toBe(true)
    expect(trigger.attributes('role')).toBe('combobox')
    expect(wrapper.find('.lh-calendar__panels').attributes('style')).toContain('display: none')
    await trigger.trigger('click')
    expect(wrapper.find('.lh-calendar--open').exists()).toBe(true)
    expect(wrapper.find('.lh-calendar__panels').attributes('style') ?? '').not.toContain(
      'display: none',
    )
    await currentCell(wrapper, 15).trigger('click')
    // 单选 + input 模式：选中即收起
    expect(wrapper.find('.lh-calendar--open').exists()).toBe(false)
    // 触发框回显选中日期（YYYY-MM-DD）
    expect(wrapper.find('.lh-calendar__input').text()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('input 模式：closeOnSelect=false 时选中后面板保持展开', async () => {
    const wrapper = mountCalendar({ mode: 'input', closeOnSelect: false })
    await wrapper.find('.lh-calendar__input').trigger('click')
    await currentCell(wrapper, 15).trigger('click')
    expect(wrapper.find('.lh-calendar--open').exists()).toBe(true)
  })

  it('header 具名插槽接收 year / month，cell 具名插槽接收 date', () => {
    const wrapper = mount(LhCalendar, {
      props: {},
      slots: {
        header: '<template #header="{ year, month }">' +
          '<view class="slot-header">{{ year }}-{{ month + 1 }}</view></template>',
        cell: '<template #cell="{ date }">' +
          '<view class="slot-cell">{{ date.getDate() }}</view></template>',
      },
    })
    expect(wrapper.find('.slot-header').text()).toBe(`${year}-${month + 1}`)
    expect(wrapper.findAll('.slot-cell').length).toBeGreaterThan(0)
  })

  it('customClass 与 sx 透传到根节点', () => {
    const wrapper = mountCalendar({ customClass: 'my-cal', sx: { mt: 1 } })
    const root = wrapper.find('.lh-calendar')
    expect(root.classes()).toContain('my-cal')
    expect(root.attributes('style')).toContain('margin-top: 8px')
  })

  it('今天单元格落 --today 与 aria-current="date"', () => {
    const wrapper = mountCalendar()
    const cell = currentCell(wrapper, now.getDate())
    expect(cell.classes()).toContain('lh-calendar__cell--today')
    expect(cell.attributes('aria-current')).toBe('date')
  })

  it('aria-selected 与 roving tabindex 跟随选中态', async () => {
    const wrapper = mount(LhCalendar, {
      props: {
        modelValue: dateOfDay(10),
        'onUpdate:modelValue': (value: unknown) => wrapper.setProps({ modelValue: value as Date }),
      },
    })
    const selected = currentCell(wrapper, 10)
    expect(selected.attributes('aria-selected')).toBe('true')
    expect(selected.attributes('tabindex')).toBe('0')
    expect(currentCell(wrapper, 11).attributes('tabindex')).toBe('-1')
    await currentCell(wrapper, 12).trigger('click')
    expect(currentCell(wrapper, 12).attributes('tabindex')).toBe('0')
  })

  it('方向键移动焦点并选中（仅 H5 有效）', async () => {
    const wrapper = mount(LhCalendar, {
      props: {
        modelValue: dateOfDay(10),
        'onUpdate:modelValue': (value: unknown) => wrapper.setProps({ modelValue: value as Date }),
      },
    })
    const grid = wrapper.find('.lh-calendar__grid')
    await grid.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.props('modelValue')).toEqual(dateOfDay(11))
    await grid.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.props('modelValue')).toEqual(dateOfDay(18))
    // 非导航键不响应
    await grid.trigger('keydown', { key: 'Enter' })
    expect(wrapper.props('modelValue')).toEqual(dateOfDay(18))
  })

  it('aria-label 为 YYYY-MM-DD 格式，供读屏识别', () => {
    const wrapper = mountCalendar()
    const cell = currentCell(wrapper, 15)
    const y = String(year)
    const m = String(month + 1).padStart(2, '0')
    const d = String(15).padStart(2, '0')
    expect(cell.attributes('aria-label')).toBe(`${y}-${m}-${d}`)
  })
})
