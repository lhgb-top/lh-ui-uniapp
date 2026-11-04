import { describe, expect, it, vi } from 'vitest'
import { mount } from '../mount'
import { nextTick } from 'vue'
import LhTimePicker from '../../src/components/lh-time-picker/lh-time-picker.vue'

// 弹层度量在 jsdom 里没有真实 SelectorQuery，把 getLhRect / platform 打桩成固定几何体，
// 验证「开 → 选列项 → 确定 → 关」的时序与事件流（core 纯函数在 share 仓有单测）
vi.mock('@/adapter/getRect', () => ({
  getSingleLhRect: async (selector: string) => {
    // trigger / popper 的 id 带实例 uid 后缀（useLhPopperIds 唯一化），用前缀匹配
    if (selector.startsWith('#lh-time-picker-trigger')) {
      return { top: 200, left: 20, width: 220, height: 32, right: 240, bottom: 232 }
    }
    return { top: 232, left: 20, width: 280, height: 240, right: 300, bottom: 472 }
  },
}))

vi.mock('@/adapter/platform', async (importOriginal) => {
  const original = (await importOriginal()) as Record<string, unknown>
  return {
    ...original,
    getLhWindowInfo: () => ({ top: 0, left: 0, width: 375, height: 667, right: 375, bottom: 667 }),
  }
})

async function openPopper(wrapper: ReturnType<typeof mount>) {
  await wrapper.find('.lh-time-picker').trigger('click')
  await nextTick()
  // useLhPopper 内有一个 setTimeout(0) 等隐藏态 DOM 提交
  await vi.runAllTimersAsync()
  await nextTick()
}

/** 在 type（hour/minute/second）列中找 text 对应的列项并点击 */
async function clickItem(
  wrapper: ReturnType<typeof mount>,
  type: 'hour' | 'minute' | 'second',
  text: string,
) {
  const items = wrapper
    .find(`.lh-time-picker-panel__column-body--${type}`)
    .findAll('.lh-time-picker-panel__column-item')
  const item = items.find((el) => el.text().includes(text))
  expect(item, `${type} 列没有「${text}」项`).toBeTruthy()
  await item!.trigger('click')
  await nextTick()
}

/** 点击底部按钮（此刻 / 确定） */
async function clickFooterButton(wrapper: ReturnType<typeof mount>, text: string) {
  const buttons = wrapper.findAll('.lh-time-picker-panel__footer button')
  const button = buttons.find((el) => el.text().includes(text))
  expect(button, `底部没有「${text}」按钮`).toBeTruthy()
  await button!.trigger('click')
  await nextTick()
}

function columnItemCount(
  wrapper: ReturnType<typeof mount>,
  type: 'hour' | 'minute' | 'second',
): number {
  return wrapper
    .find(`.lh-time-picker-panel__column-body--${type}`)
    .findAll('.lh-time-picker-panel__column-item').length
}

describe('LhTimePicker', () => {
  it('renders the format-derived placeholder and hides the panel by default', () => {
    const wrapper = mount(LhTimePicker)
    expect(wrapper.find('.lh-time-picker__input-inner').text()).toBe('时:分:秒')
    expect(wrapper.find('.lh-time-picker__input-inner--placeholder').exists()).toBe(true)
    expect(wrapper.find('.lh-time-picker-panel').exists()).toBe(false)
  })

  it('honors a custom placeholder', () => {
    const wrapper = mount(LhTimePicker, { props: { placeholder: '选择提醒时间' } })
    expect(wrapper.find('.lh-time-picker__input-inner').text()).toBe('选择提醒时间')
  })

  it('echoes the modelValue formatted by format', async () => {
    const wrapper = mount(LhTimePicker, {
      props: { modelValue: new Date(2026, 10, 3, 9, 30, 15) },
    })
    expect(wrapper.find('.lh-time-picker__input-inner').text()).toBe('09:30:15')
    expect(wrapper.find('.lh-time-picker__input-inner--placeholder').exists()).toBe(false)

    await wrapper.setProps({ format: 'HH:mm' })
    expect(wrapper.find('.lh-time-picker__input-inner').text()).toBe('09:30')
  })

  it('opens on click and renders the three columns with aria contract', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhTimePicker)
    await openPopper(wrapper)

    const panel = wrapper.find('.lh-time-picker-panel')
    expect(panel.exists()).toBe(true)
    expect(panel.attributes('role')).toBe('dialog')
    expect(panel.attributes('style')).toContain('position: fixed')
    // 默认 format 含 ss：时 24 项 / 分 60 项 / 秒 60 项
    expect(columnItemCount(wrapper, 'hour')).toBe(24)
    expect(columnItemCount(wrapper, 'minute')).toBe(60)
    expect(columnItemCount(wrapper, 'second')).toBe(60)
    // 列为 listbox、列项为 option
    expect(wrapper.find('.lh-time-picker-panel__column-body--hour').attributes('role')).toBe(
      'listbox',
    )
    expect(wrapper.find('.lh-time-picker-panel__column-item').attributes('role')).toBe('option')

    // 触发器 aria 属性包由 share 纯函数产出，摊开绑定
    expect(wrapper.find('.lh-time-picker').attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('.lh-time-picker').attributes('aria-haspopup')).toBe('dialog')
    expect(wrapper.find('.lh-time-picker').attributes('aria-controls')).toBeTruthy()

    // 各列 scroll-into-view 指向当前选中项（MP 端的滚入视口机制）
    expect(wrapper.find('.lh-time-picker-panel__column-body--hour').attributes('scroll-into-view')).toContain('-hour-0')

    vi.useRealTimers()
  })

  it('renders only hour and minute columns when format has no ss', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhTimePicker, { props: { format: 'HH:mm' } })
    await openPopper(wrapper)

    expect(wrapper.find('.lh-time-picker-panel__column-body--hour').exists()).toBe(true)
    expect(wrapper.find('.lh-time-picker-panel__column-body--minute').exists()).toBe(true)
    expect(wrapper.find('.lh-time-picker-panel__column-body--second').exists()).toBe(false)

    vi.useRealTimers()
  })

  it('selects items, marks them active and confirms, emitting the Date', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhTimePicker)
    await openPopper(wrapper)

    await clickItem(wrapper, 'hour', '09')
    await clickItem(wrapper, 'minute', '30')
    await clickItem(wrapper, 'second', '15')

    // 选中项立即落激活态（不必等确认）
    const hourItems = wrapper
      .find('.lh-time-picker-panel__column-body--hour')
      .findAll('.lh-time-picker-panel__column-item')
    expect(hourItems[9].classes()).toContain('lh-time-picker-panel__column-item--active')
    expect(hourItems[9].attributes('aria-selected')).toBe('true')
    // scroll-into-view 目标随选中项更新
    expect(wrapper.find('.lh-time-picker-panel__column-body--hour').attributes('scroll-into-view')).toContain('-hour-9')

    await clickFooterButton(wrapper, '确定')

    const emitted = wrapper.emitted('update:modelValue')?.[0] as [Date]
    expect(emitted[0]).toBeInstanceOf(Date)
    expect(emitted[0].getHours()).toBe(9)
    expect(emitted[0].getMinutes()).toBe(30)
    expect(emitted[0].getSeconds()).toBe(15)
    const change = wrapper.emitted('change')?.[0] as [Date]
    expect(change[0].getHours()).toBe(9)
    // 确认后面板关闭
    expect(wrapper.find('.lh-time-picker-panel').exists()).toBe(false)

    vi.useRealTimers()
  })

  it('does not emit before confirm and closes on mask click without change', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhTimePicker)
    await openPopper(wrapper)

    await clickItem(wrapper, 'hour', '08')
    // 仅点击列项：不提交，面板保持打开
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find('.lh-time-picker-panel').exists()).toBe(true)

    await wrapper.find('.lh-time-picker__mask').trigger('click')
    await nextTick()
    expect(wrapper.find('.lh-time-picker-panel').exists()).toBe(false)
    expect(wrapper.emitted('change')).toBeUndefined()

    vi.useRealTimers()
  })

  it('sets now and clamps it into the start/end range', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 10, 3, 14, 25, 40))
    const wrapper = mount(LhTimePicker, { props: { start: 8, end: 20 } })
    await openPopper(wrapper)

    await clickFooterButton(wrapper, '此刻')
    // 「此刻」的小时收敛到 8~20（14 在范围内，保持原值）
    const hourItems = wrapper
      .find('.lh-time-picker-panel__column-body--hour')
      .findAll('.lh-time-picker-panel__column-item')
    const activeHour = hourItems.find((el) =>
      el.classes().includes('lh-time-picker-panel__column-item--active'),
    )
    expect(activeHour, '小时列应有激活项').toBeTruthy()
    expect(activeHour!.text()).toBe('14')

    await clickFooterButton(wrapper, '确定')
    const emitted = wrapper.emitted('update:modelValue')?.[0] as [Date]
    expect(emitted[0].getHours()).toBe(14)
    expect(emitted[0].getMinutes()).toBe(25)
    expect(emitted[0].getSeconds()).toBe(40)

    vi.useRealTimers()
  })

  it('clamps an out-of-range modelValue hour back into the range', () => {
    const wrapper = mount(LhTimePicker, {
      props: { start: 8, end: 20, modelValue: new Date(2026, 10, 3, 3, 30, 0) },
    })
    // 范围外的已有选中小时收敛回可选区间下界
    expect(wrapper.find('.lh-time-picker__input-inner').text()).toBe('08:30:00')
  })

  it('limits the hour column to start/end and filters options', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhTimePicker, { props: { start: 8, end: 20 } })
    await openPopper(wrapper)

    // 8~20 含端点共 13 项
    expect(columnItemCount(wrapper, 'hour')).toBe(13)
    const hourItems = wrapper
      .find('.lh-time-picker-panel__column-body--hour')
      .findAll('.lh-time-picker-panel__column-item')
    expect(hourItems[0].text()).toBe('08')
    expect(hourItems[12].text()).toBe('20')

    vi.useRealTimers()
  })

  it('generates columns by step', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhTimePicker, {
      props: { stepHour: 2, stepMinute: 5, stepSecond: 10 },
    })
    await openPopper(wrapper)

    expect(columnItemCount(wrapper, 'hour')).toBe(12)
    expect(columnItemCount(wrapper, 'minute')).toBe(12)
    expect(columnItemCount(wrapper, 'second')).toBe(6)

    vi.useRealTimers()
  })

  it('clears the value when clearable', async () => {
    const wrapper = mount(LhTimePicker, {
      props: { modelValue: new Date(2026, 10, 3, 9, 30, 0) },
    })
    expect(wrapper.find('.lh-time-picker__clear').exists()).toBe(true)

    await wrapper.find('.lh-time-picker__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
    expect((wrapper.emitted('change')?.[0] as unknown[])[0]).toBeNull()
    // 纯受控：显示文本跟随 props，父组件回写后才回到占位态
    await wrapper.setProps({ modelValue: null })
    expect(wrapper.find('.lh-time-picker__input-inner').text()).toBe('时:分:秒')
  })

  it('never opens when disabled', async () => {
    const wrapper = mount(LhTimePicker, {
      props: { disabled: true, modelValue: new Date(2026, 10, 3, 9, 30, 0) },
    })
    await wrapper.find('.lh-time-picker').trigger('click')
    await nextTick()
    expect(wrapper.find('.lh-time-picker-panel').exists()).toBe(false)
    expect(wrapper.find('.lh-time-picker').classes()).toContain('lh-time-picker--disabled')
    // 禁用时清除按钮不显示（对齐 plus）
    expect(wrapper.find('.lh-time-picker__clear').exists()).toBe(false)
  })

  it('closes on Escape via the document-level listener (H5 only)', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhTimePicker)
    await openPopper(wrapper)
    expect(wrapper.find('.lh-time-picker-panel').exists()).toBe(true)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(wrapper.find('.lh-time-picker-panel').exists()).toBe(false)
    expect(wrapper.emitted('change')).toBeUndefined()

    vi.useRealTimers()
  })

  it('toggles on repeated clicks', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhTimePicker)
    await openPopper(wrapper)
    expect(wrapper.find('.lh-time-picker-panel').exists()).toBe(true)

    await wrapper.find('.lh-time-picker').trigger('click')
    expect(wrapper.find('.lh-time-picker-panel').exists()).toBe(false)

    vi.useRealTimers()
  })
})
