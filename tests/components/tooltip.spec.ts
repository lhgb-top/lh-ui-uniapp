import { describe, expect, it, vi } from 'vitest'
import { mount } from '../mount'
import { nextTick } from 'vue'
import LhTooltip from '../../src/components/lh-tooltip/lh-tooltip.vue'

vi.mock('@/adapter/getRect', () => ({
  getSingleLhRect: async (selector: string) => {
    // trigger/popper 的 id 带实例 uid 后缀（组件内做了唯一化），用前缀匹配
    if (selector.startsWith('#lh-tooltip-trigger')) {
      return { top: 200, left: 20, width: 100, height: 32, right: 120, bottom: 232 }
    }
    return { top: 0, left: 0, width: 120, height: 40, right: 120, bottom: 40 }
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
  await wrapper.find('.lh-tooltip__trigger').trigger('click')
  await nextTick()
  await vi.runAllTimersAsync()
  await nextTick()
}

describe('LhTooltip', () => {
  it('renders the trigger slot and hides content by default', () => {
    const wrapper = mount(LhTooltip, {
      props: { content: '提示文案' },
      slots: { default: () => '触发器' },
    })
    expect(wrapper.find('.lh-tooltip__trigger').text()).toContain('触发器')
    expect(wrapper.find('.lh-tooltip__popper').exists()).toBe(false)
  })

  it('shows and positions the popper on click', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhTooltip, {
      props: { content: '提示文案', placement: 'top' },
      slots: { default: () => '触发器' },
    })
    await openPopper(wrapper)

    const popper = wrapper.find('.lh-tooltip__popper')
    expect(popper.exists()).toBe(true)
    expect(popper.find('.lh-tooltip__content').text()).toBe('提示文案')
    expect(popper.attributes('style')).toContain('position: fixed')
    // placement=top：气泡在 trigger 上方
    expect(popper.attributes('style')).toContain('top: 152px')
    expect(wrapper.emitted('visible-change')?.[0]).toEqual([true])

    vi.useRealTimers()
  })

  it('hides on mask click', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhTooltip, {
      props: { content: '提示文案' },
      slots: { default: () => '触发器' },
    })
    await openPopper(wrapper)
    expect(wrapper.find('.lh-tooltip__popper').exists()).toBe(true)

    await wrapper.find('.lh-tooltip__mask').trigger('click')
    expect(wrapper.find('.lh-tooltip__popper').exists()).toBe(false)
    expect(wrapper.emitted('visible-change')?.[1]).toEqual([false])

    vi.useRealTimers()
  })

  it('toggles on repeated clicks', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhTooltip, {
      props: { content: '提示文案' },
      slots: { default: () => '触发器' },
    })
    await openPopper(wrapper)
    expect(wrapper.find('.lh-tooltip__popper').exists()).toBe(true)

    await wrapper.find('.lh-tooltip__trigger').trigger('click')
    expect(wrapper.find('.lh-tooltip__popper').exists()).toBe(false)

    vi.useRealTimers()
  })

  it('never opens when disabled', async () => {
    const wrapper = mount(LhTooltip, {
      props: { content: '提示文案', disabled: true },
      slots: { default: () => '触发器' },
    })
    await wrapper.find('.lh-tooltip__trigger').trigger('click')
    await nextTick()
    expect(wrapper.find('.lh-tooltip__popper').exists()).toBe(false)
    expect(wrapper.emitted('visible-change')).toBeUndefined()
  })

  it('shows immediately for click trigger (delays only apply to hover, H5 only)', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhTooltip, {
      props: { content: '提示文案', showDelay: 300 },
      slots: { default: () => '触发器' },
    })

    await wrapper.find('.lh-tooltip__trigger').trigger('click')
    await nextTick()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(wrapper.find('.lh-tooltip__popper').exists()).toBe(true)

    vi.useRealTimers()
  })
})
