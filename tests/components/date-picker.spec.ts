import { describe, expect, it, vi } from 'vitest'
import { mount } from '../mount'
import { nextTick } from 'vue'
import LhDatePicker from '../../src/components/lh-date-picker/lh-date-picker.vue'

// 弹层度量在 jsdom 里没有真实 SelectorQuery，把 getLhRect / platform 打桩成固定几何体，
// 验证「开 → 选日期 → 确定 → 关」的时序与事件流（computePosition / core 纯函数在 share 仓有单测）
vi.mock('@/adapter/getRect', () => ({
  getSingleLhRect: async (selector: string) => {
    // trigger / popper 的 id 带实例 uid 后缀（组件内做了唯一化），用前缀匹配
    if (selector.startsWith('#lh-date-picker-trigger')) {
      return { top: 200, left: 20, width: 220, height: 32, right: 240, bottom: 232 }
    }
    return { top: 232, left: 20, width: 300, height: 320, right: 320, bottom: 552 }
  },
}))

vi.mock('@/adapter/platform', async (importOriginal) => {
  const original = (await importOriginal()) as Record<string, unknown>
  return {
    ...original,
    getLhWindowInfo: () => ({ top: 0, left: 0, width: 375, height: 667, right: 375, bottom: 667 }),
  }
})

// 本 spec 涉及「今天格 / 当前月网格」等系统日期相关断言，
// 各用例如 time-picker.spec 的先例统一冻结到 2026-11-03（11 月 1 日周日、当月 30 天），
// 避免真实日期漂移导致断言过期（跨日 / 跨月自动失效的时间炸弹）。
const FROZEN_NOW = new Date(2026, 10, 3)

async function openPopper(wrapper: ReturnType<typeof mount>) {
  await wrapper.find('.lh-date-picker').trigger('click')
  await nextTick()
  // useLhPopper 内有一个 setTimeout(0) 等隐藏态 DOM 提交
  await vi.runAllTimersAsync()
  await nextTick()
}

/** 在日历中找指定「日」的单元格（当前月）并点击 */
async function clickDay(wrapper: ReturnType<typeof mount>, day: number) {
  const cells = wrapper.findAll('.lh-date-picker-panel__day')
  const cell = cells.find((el) => el.text() === String(day) && el.classes('lh-date-picker-panel--other') === false)
  expect(cell, `日历中没有当前月的「${day}」日`).toBeTruthy()
  await cell!.trigger('click')
  await nextTick()
}

describe('LhDatePicker', () => {
  it('renders the placeholder and hides the panel by default', () => {
    const wrapper = mount(LhDatePicker, { props: { modelValue: null } })
    // 未传 placeholder 时按 format 生成占位（yyyy→年、MM→月、dd→日）
    expect(wrapper.find('.lh-date-picker__input-inner').text()).toBe('年-月-日')
    expect(wrapper.find('.lh-date-picker-panel').exists()).toBe(false)
    expect(wrapper.find('.lh-date-picker__icon').exists()).toBe(true)
  })

  it('echoes the bound value with format and accepts a custom format', async () => {
    const wrapper = mount(LhDatePicker, { props: { modelValue: new Date(2026, 10, 3) } })
    expect(wrapper.find('.lh-date-picker__value').text()).toBe('2026-11-03')

    await wrapper.setProps({ format: 'MM/dd/yyyy' })
    expect(wrapper.find('.lh-date-picker__value').text()).toBe('11/03/2026')
  })

  it('echoes a range value joined by the separator', () => {
    const wrapper = mount(LhDatePicker, {
      props: {
        modelValue: [new Date(2026, 10, 1), new Date(2026, 10, 7)],
        rangeSeparator: '至',
      },
    })
    expect(wrapper.find('.lh-date-picker__value').text()).toBe('2026-11-01 至 2026-11-07')
  })

  it('opens on click, renders the weekday header and day grid, and positions the panel', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(FROZEN_NOW)
    const wrapper = mount(LhDatePicker, { props: { modelValue: null } })
    await openPopper(wrapper)

    const panel = wrapper.find('.lh-date-picker-panel')
    expect(panel.exists()).toBe(true)
    // 星期表头取语言包 datepicker.weeks（中文「日 一 … 六」）
    expect(wrapper.findAll('.lh-date-picker-panel__weekday').map((el) => el.text())).toEqual([
      '日',
      '一',
      '二',
      '三',
      '四',
      '五',
      '六',
    ])
    // 2026-11-1 是周日，当月 30 天：无前置填充 + 5 天后置填充 = 35 格
    expect(wrapper.findAll('.lh-date-picker-panel__day')).toHaveLength(35)
    // 定位由 useLhPopper 异步两帧度量写入（fixed 定位）
    expect(panel.attributes('style')).toContain('position: fixed')
    expect(panel.attributes('role')).toBe('dialog')
    // 触发器 aria 属性包由 share 纯函数产出，摊开绑定
    expect(wrapper.find('.lh-date-picker').attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('.lh-date-picker').attributes('aria-haspopup')).toBe('dialog')
    expect(wrapper.find('.lh-date-picker').attributes('aria-controls')).toBeTruthy()

    vi.useRealTimers()
  })

  it('tempers a day on click and commits it on confirm (two-step submit)', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(FROZEN_NOW)
    const wrapper = mount(LhDatePicker, { props: { modelValue: null } })
    await openPopper(wrapper)

    // 点击日期只落入面板暂存，不提交
    await clickDay(wrapper, 15)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    const selected = wrapper.findAll('.lh-date-picker-panel__day').find((el) =>
      el.classes('lh-date-picker-panel--selected'),
    )
    expect(selected?.text()).toBe('15')

    // 点「确定」才提交并关闭面板
    const footer = wrapper.findAll('.lh-date-picker-panel__footer .lh-button')
    expect(footer).toHaveLength(2)
    await footer[1].trigger('click')
    await nextTick()
    const value = wrapper.emitted('update:modelValue')?.[0]?.[0] as Date
    expect(value.getFullYear()).toBe(2026)
    expect(value.getMonth()).toBe(10)
    expect(value.getDate()).toBe(15)
    expect((wrapper.emitted('change')?.[0]?.[0] as Date).getDate()).toBe(15)
    expect(wrapper.find('.lh-date-picker-panel').exists()).toBe(false)

    vi.useRealTimers()
  })

  it('anchors the panel to the bound value and selects today via the footer button', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(FROZEN_NOW)
    const wrapper = mount(LhDatePicker, { props: { modelValue: new Date(2024, 0, 15) } })
    await openPopper(wrapper)
    // 打开时锚定到绑定值（2024 年 1 月），标题带年月文案
    expect(wrapper.find('.lh-date-picker-panel__title-text').text()).toContain('2024')

    // 点「今天」跳回本月并暂存今天
    const footer = wrapper.findAll('.lh-date-picker-panel__footer .lh-button')
    await footer[0].trigger('click')
    await nextTick()
    expect(wrapper.find('.lh-date-picker-panel__title-text').text()).toContain('2026')
    const todayCell = wrapper.findAll('.lh-date-picker-panel__day').find((el) =>
      el.classes('lh-date-picker-panel--today'),
    )
    expect(todayCell?.classes()).toContain('lh-date-picker-panel--selected')

    await wrapper.findAll('.lh-date-picker-panel__footer .lh-button')[1].trigger('click')
    await nextTick()
    const value = wrapper.emitted('update:modelValue')?.[0]?.[0] as Date
    expect(value.getFullYear()).toBe(2026)
    expect(value.getMonth()).toBe(10)

    vi.useRealTimers()
  })

  it('switches month via the nav buttons', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(FROZEN_NOW)
    const wrapper = mount(LhDatePicker, { props: { modelValue: new Date(2026, 10, 3) } })
    await openPopper(wrapper)
    expect(wrapper.find('.lh-date-picker-panel__title-text').text()).toContain('2026年 11月')

    await wrapper.find('.lh-date-picker-panel__title').findAll('.lh-date-picker-panel__btn')[1].trigger('click')
    await nextTick()
    expect(wrapper.find('.lh-date-picker-panel__title-text').text()).toContain('2026年 12月')

    await wrapper.find('.lh-date-picker-panel__title').findAll('.lh-date-picker-panel__btn')[0].trigger('click')
    await nextTick()
    expect(wrapper.find('.lh-date-picker-panel__title-text').text()).toContain('2026年 11月')

    vi.useRealTimers()
  })

  it('drills down to the month grid and back via the title', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(FROZEN_NOW)
    const wrapper = mount(LhDatePicker, { props: { modelValue: new Date(2026, 10, 3) } })
    await openPopper(wrapper)

    // 点标题：日期 → 月份
    await wrapper.find('.lh-date-picker-panel__title-text').trigger('click')
    await nextTick()
    expect(wrapper.find('.lh-date-picker-panel__month-grid').exists()).toBe(true)
    expect(wrapper.findAll('.lh-date-picker-panel__month-cell')).toHaveLength(12)
    expect(wrapper.findAll('.lh-date-picker-panel__month-cell')[10].text()).toBe('11月')

    // 日期模式下点月份只切回日历，不提交
    await wrapper.findAll('.lh-date-picker-panel__month-cell')[10].trigger('click')
    await nextTick()
    expect(wrapper.find('.lh-date-picker-panel__days').exists()).toBe(true)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    vi.useRealTimers()
  })

  it('drills down to the year grid', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(FROZEN_NOW)
    const wrapper = mount(LhDatePicker, { props: { modelValue: new Date(2026, 10, 3) } })
    await openPopper(wrapper)

    await wrapper.find('.lh-date-picker-panel__title-text').trigger('click')
    await nextTick()
    await wrapper.find('.lh-date-picker-panel__title-text').trigger('click')
    await nextTick()
    // 年份网格 12 格，标题为十年段（2026 落在 2016 - 2027 段）
    expect(wrapper.find('.lh-date-picker-panel__year-grid').exists()).toBe(true)
    expect(wrapper.findAll('.lh-date-picker-panel__year-cell')).toHaveLength(12)
    expect(wrapper.find('.lh-date-picker-panel__title-text').text()).toContain('2016 - 2027')

    // 非 year 模式点年份只切到月份网格
    await wrapper.findAll('.lh-date-picker-panel__year-cell').find((el) => el.text() === '2027')?.trigger('click')
    await nextTick()
    expect(wrapper.find('.lh-date-picker-panel__month-grid').exists()).toBe(true)

    vi.useRealTimers()
  })

  it('selects and closes immediately in month mode', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(FROZEN_NOW)
    const wrapper = mount(LhDatePicker, { props: { mode: 'month', modelValue: null } })
    await openPopper(wrapper)

    // 月份模式打开即落在月份网格，且无底部按钮
    expect(wrapper.find('.lh-date-picker-panel__month-grid').exists()).toBe(true)
    expect(wrapper.find('.lh-date-picker-panel__footer').exists()).toBe(false)

    await wrapper.findAll('.lh-date-picker-panel__month-cell')[5].trigger('click')
    await nextTick()
    const value = wrapper.emitted('update:modelValue')?.[0]?.[0] as Date
    expect(value.getFullYear()).toBe(2026)
    expect(value.getMonth()).toBe(5)
    expect(value.getDate()).toBe(1)
    // 月份 / 年份模式点击即选中并关闭
    expect(wrapper.find('.lh-date-picker-panel').exists()).toBe(false)

    vi.useRealTimers()
  })

  it('selects and closes immediately in year mode', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(FROZEN_NOW)
    const wrapper = mount(LhDatePicker, { props: { mode: 'year', modelValue: null } })
    await openPopper(wrapper)

    expect(wrapper.find('.lh-date-picker-panel__year-grid').exists()).toBe(true)
    await wrapper.findAll('.lh-date-picker-panel__year-cell').find((el) => el.text() === '2026')?.trigger('click')
    await nextTick()
    const value = wrapper.emitted('update:modelValue')?.[0]?.[0] as Date
    expect(value.getFullYear()).toBe(2026)
    expect(wrapper.find('.lh-date-picker-panel').exists()).toBe(false)

    vi.useRealTimers()
  })

  it('never opens when disabled or readonly', async () => {
    const disabled = mount(LhDatePicker, { props: { modelValue: null, disabled: true } })
    await disabled.find('.lh-date-picker').trigger('click')
    await nextTick()
    expect(disabled.find('.lh-date-picker-panel').exists()).toBe(false)
    expect(disabled.find('.lh-date-picker').classes()).toContain('lh-date-picker--disabled')

    const readonlyPicker = mount(LhDatePicker, { props: { modelValue: null, readonly: true } })
    await readonlyPicker.find('.lh-date-picker').trigger('click')
    await nextTick()
    expect(readonlyPicker.find('.lh-date-picker-panel').exists()).toBe(false)
  })

  it('clears the value when clearable', async () => {
    const wrapper = mount(LhDatePicker, { props: { modelValue: new Date(2026, 10, 3) } })
    expect(wrapper.find('.lh-date-picker__clear').exists()).toBe(true)

    await wrapper.find('.lh-date-picker__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
    expect(wrapper.emitted('change')?.[0]).toEqual([null])
    // 受控模型：组件不持有值，父组件收到 emit 后回写 props 才会更新显示
    await wrapper.setProps({ modelValue: null })
    expect(wrapper.find('.lh-date-picker__value').exists()).toBe(false)
  })

  it('hides the clear button when clearable is false', () => {
    const wrapper = mount(LhDatePicker, {
      props: { modelValue: new Date(2026, 10, 3), clearable: false },
    })
    expect(wrapper.find('.lh-date-picker__clear').exists()).toBe(false)
  })

  it('closes on mask click without emitting change', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(FROZEN_NOW)
    const wrapper = mount(LhDatePicker, { props: { modelValue: null } })
    await openPopper(wrapper)
    expect(wrapper.find('.lh-date-picker-panel').exists()).toBe(true)

    await wrapper.find('.lh-date-picker__mask').trigger('click')
    await nextTick()
    expect(wrapper.find('.lh-date-picker-panel').exists()).toBe(false)
    // 点击遮罩只关闭，不发 change（对齐 plus 的点击外部关闭）
    expect(wrapper.emitted('change')).toBeUndefined()

    vi.useRealTimers()
  })

  it('closes on Escape via the document-level listener (H5 only)', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(FROZEN_NOW)
    const wrapper = mount(LhDatePicker, { props: { modelValue: null } })
    await openPopper(wrapper)
    expect(wrapper.find('.lh-date-picker-panel').exists()).toBe(true)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(wrapper.find('.lh-date-picker-panel').exists()).toBe(false)
    expect(wrapper.emitted('change')).toBeUndefined()

    vi.useRealTimers()
  })

  it('opens via keyboard on the trigger and keeps the roving tabindex (H5 only)', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(FROZEN_NOW)
    const wrapper = mount(LhDatePicker, { props: { modelValue: new Date(2026, 10, 3) } })

    // 触发器 Enter 打开面板
    await wrapper.find('.lh-date-picker').trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(wrapper.find('.lh-date-picker').attributes('aria-expanded')).toBe('true')

    // 网格内只有锚点格（选中日）tabindex=0
    const tabbables = wrapper
      .findAll('.lh-date-picker-panel__day')
      .filter((el) => el.attributes('tabindex') === '0')
    expect(tabbables).toHaveLength(1)
    expect(tabbables[0].text()).toBe('3')

    vi.useRealTimers()
  })

  it('moves the grid focus with arrow keys and commits with Enter (H5 only)', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(FROZEN_NOW)
    const wrapper = mount(LhDatePicker, { props: { modelValue: null } })
    await openPopper(wrapper)

    const cells = wrapper.findAll('.lh-date-picker-panel__day')
    // 今天（2026-11-03）是锚点；按 → 移到次日
    const todayCell = cells.find((el) => el.classes('lh-date-picker-panel--today'))!
    await todayCell.trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    const focused = wrapper
      .findAll('.lh-date-picker-panel__day')
      .filter((el) => el.attributes('tabindex') === '0')
    expect(focused).toHaveLength(1)
    expect(Number(focused[0].text())).toBe(4)
    expect(focused[0].classes()).not.toContain('lh-date-picker-panel--other')

    // Enter 等价点击：落入暂存（暂不提交）
    await focused[0].trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(wrapper.findAll('.lh-date-picker-panel__day').some((el) =>
      el.classes('lh-date-picker-panel--selected'),
    )).toBe(true)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    vi.useRealTimers()
  })

  it('toggles the panel on repeated clicks', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(FROZEN_NOW)
    const wrapper = mount(LhDatePicker, { props: { modelValue: null } })
    await openPopper(wrapper)
    expect(wrapper.find('.lh-date-picker-panel').exists()).toBe(true)

    await wrapper.find('.lh-date-picker').trigger('click')
    expect(wrapper.find('.lh-date-picker-panel').exists()).toBe(false)

    vi.useRealTimers()
  })

  it('forwards cellClassName to day cells', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(FROZEN_NOW)
    const wrapper = mount(LhDatePicker, {
      props: {
        modelValue: null,
        cellClassName: (date: Date) => (date.getDay() === 0 || date.getDay() === 6 ? 'my-weekend' : ''),
      },
    })
    await openPopper(wrapper)

    const cells = wrapper.findAll('.lh-date-picker-panel__day')
    // 2026-11-07 是周六（当前月），应带自定义类
    expect(cells.some((el) => el.text() === '7' && el.classes('my-weekend'))).toBe(true)
    // 周中不带
    expect(cells.some((el) => el.text() === '4' && el.classes('my-weekend'))).toBe(false)

    vi.useRealTimers()
  })

  it('does not overwrite a range value on confirm (datetime / range UI not implemented)', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(FROZEN_NOW)
    const range: [Date, Date] = [new Date(2026, 10, 1), new Date(2026, 10, 7)]
    const wrapper = mount(LhDatePicker, { props: { modelValue: range } })
    await openPopper(wrapper)

    await clickDay(wrapper, 15)
    await wrapper.findAll('.lh-date-picker-panel__footer .lh-button')[1].trigger('click')
    await nextTick()
    // 外部已传入区间值（数组）时确认不提交单个 Date，避免静默丢失区间数据（台账 P-08）
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find('.lh-date-picker-panel').exists()).toBe(false)

    vi.useRealTimers()
  })
})
