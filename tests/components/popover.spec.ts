import { describe, expect, it, vi } from 'vitest'
import { mount } from '../mount'
import { nextTick } from 'vue'
import LhPopover from '../../src/components/lh-popover/lh-popover.vue'

// 弹层度量在 jsdom 里没有真实 SelectorQuery，把 getLhRect / platform 打桩成固定几何体，
// 验证「开 → 定位 → 关」的时序与事件流（computePosition 本身在 share 仓有单测）
vi.mock('@/adapter/getRect', () => ({
  getSingleLhRect: async (selector: string) => {
    // trigger/popper 的 id 带实例 uid 后缀（组件内做了唯一化），用前缀匹配
    if (selector.startsWith('#lh-popover-trigger')) {
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

const slots = {
  default: () => '触发器',
  content: () => '富内容',
}

async function openPopper(wrapper: ReturnType<typeof mount>) {
  await wrapper.find('.lh-popover').trigger('click')
  await nextTick()
  // useLhPopper 内有一个 setTimeout(0) 等隐藏态 DOM 提交
  await vi.runAllTimersAsync()
  await nextTick()
}

describe('LhPopover', () => {
  it('renders the trigger slot and hides the popper by default', () => {
    const wrapper = mount(LhPopover, {
      props: { title: '标题' },
      slots,
    })
    expect(wrapper.find('.lh-popover').text()).toContain('触发器')
    expect(wrapper.find('.lh-popover__popper').exists()).toBe(false)
  })

  it('opens on click with title, content and arrow, and positions the popper', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhPopover, {
      props: { title: '水墨提示', placement: 'top' },
      slots,
    })
    await openPopper(wrapper)

    const popper = wrapper.find('.lh-popover__popper')
    expect(popper.exists()).toBe(true)
    expect(popper.find('.lh-popover__title').text()).toBe('水墨提示')
    expect(popper.find('.lh-popover__content').text()).toBe('富内容')
    expect(popper.find('.lh-popover__arrow').exists()).toBe(true)
    // 默认方位 top：computePosition 在 375×667 视口内把弹层放到触发器上方
    expect(popper.classes()).toContain('lh-popover__popper--top')
    expect(popper.attributes('style')).toContain('position: fixed')
    expect(popper.attributes('style')).toContain('top: 152px')
    expect(popper.attributes('style')).toContain('left: 10px')
    // 箭头指向触发器交叉轴中心（uniapp 的 useLhPopper 不写该变量，由组件胶水补写）
    expect(popper.attributes('style')).toContain('--lh-arrow-offset')
    // 弹出层为 role=dialog，有标题时关联 aria-labelledby
    expect(popper.attributes('role')).toBe('dialog')
    expect(popper.attributes('aria-labelledby')).toBeTruthy()
    // 触发器 aria 属性包由 share 纯函数产出，摊开绑定
    expect(wrapper.find('.lh-popover').attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('.lh-popover').attributes('aria-haspopup')).toBe('true')
    expect(wrapper.emitted('show')).toHaveLength(1)
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([true])

    vi.useRealTimers()
  })

  it('lets the title slot override the title prop', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhPopover, {
      props: { title: '属性标题' },
      slots: { ...slots, title: () => '插槽标题' },
    })
    await openPopper(wrapper)

    expect(wrapper.find('.lh-popover__title').text()).toBe('插槽标题')

    vi.useRealTimers()
  })

  it('hides the arrow when arrow is false', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhPopover, {
      props: { arrow: false },
      slots,
    })
    await openPopper(wrapper)

    expect(wrapper.find('.lh-popover__arrow').exists()).toBe(false)
    // 无箭头时方位修饰类里不再带 --arrow
    expect(wrapper.find('.lh-popover__popper').classes()).not.toContain('lh-popover__popper--arrow')

    vi.useRealTimers()
  })

  it('applies width and popperClass to the popper', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhPopover, {
      props: { width: 240, popperClass: 'demo-popper' },
      slots,
    })
    await openPopper(wrapper)

    const popper = wrapper.find('.lh-popover__popper')
    expect(popper.classes()).toContain('demo-popper')
    expect(popper.attributes('style')).toContain('width: 240px')

    vi.useRealTimers()
  })

  it('closes on mask click', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhPopover, {
      props: {},
      slots,
    })
    await openPopper(wrapper)
    expect(wrapper.find('.lh-popover__popper').exists()).toBe(true)

    await wrapper.find('.lh-popover__mask').trigger('click')
    expect(wrapper.find('.lh-popover__popper').exists()).toBe(false)
    expect(wrapper.emitted('hide')).toHaveLength(1)
    expect(wrapper.emitted('update:visible')?.[1]).toEqual([false])

    vi.useRealTimers()
  })

  it('toggles on repeated clicks', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhPopover, {
      props: {},
      slots,
    })
    await openPopper(wrapper)
    expect(wrapper.find('.lh-popover__popper').exists()).toBe(true)

    await wrapper.find('.lh-popover').trigger('click')
    expect(wrapper.find('.lh-popover__popper').exists()).toBe(false)

    vi.useRealTimers()
  })

  it('never opens when disabled', async () => {
    const wrapper = mount(LhPopover, {
      props: { disabled: true },
      slots,
    })
    await wrapper.find('.lh-popover').trigger('click')
    await nextTick()
    expect(wrapper.find('.lh-popover__popper').exists()).toBe(false)
    expect(wrapper.emitted('update:visible')).toBeUndefined()
  })

  it('respects controlled visible with the manual trigger', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhPopover, {
      props: { trigger: 'manual', visible: false },
      slots,
    })
    await wrapper.find('.lh-popover').trigger('click')
    await nextTick()
    await vi.runAllTimersAsync()
    // 受控模式：触发器点击不自行开关，也不发事件
    expect(wrapper.find('.lh-popover__popper').exists()).toBe(false)
    expect(wrapper.emitted('update:visible')).toBeUndefined()

    await wrapper.setProps({ visible: true })
    await nextTick()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(wrapper.find('.lh-popover__popper').exists()).toBe(true)

    // 受控模式下遮罩点击同样不自行关闭（显隐由外部接管）
    await wrapper.find('.lh-popover__mask').trigger('click')
    expect(wrapper.find('.lh-popover__popper').exists()).toBe(true)

    vi.useRealTimers()
  })

  it('exposes show / hide / toggle programmatically', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhPopover, {
      props: {},
      slots,
    })
    const vm = wrapper.vm as unknown as {
      show: () => void
      hide: () => void
      toggle: () => void
    }

    vm.show()
    await nextTick()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(wrapper.find('.lh-popover__popper').exists()).toBe(true)

    vm.hide()
    await nextTick()
    expect(wrapper.find('.lh-popover__popper').exists()).toBe(false)

    vm.toggle()
    await nextTick()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(wrapper.find('.lh-popover__popper').exists()).toBe(true)

    vm.toggle()
    await nextTick()
    expect(wrapper.find('.lh-popover__popper').exists()).toBe(false)

    vi.useRealTimers()
  })

  it('shows after hover delay, keeps open over the popper, then hides (H5)', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhPopover, {
      props: { trigger: 'hover' },
      slots,
    })

    await wrapper.find('.lh-popover').trigger('mouseenter')
    // 200ms 显示延迟未到时不出现
    await vi.advanceTimersByTimeAsync(100)
    await nextTick()
    expect(wrapper.find('.lh-popover__popper').exists()).toBe(false)
    await vi.advanceTimersByTimeAsync(100)
    await nextTick()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(wrapper.find('.lh-popover__popper').exists()).toBe(true)

    // 离开触发器进入弹出层：100ms 收起延迟被弹层 mouseenter 取消
    await wrapper.find('.lh-popover').trigger('mouseleave')
    await wrapper.find('.lh-popover__popper').trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(150)
    expect(wrapper.find('.lh-popover__popper').exists()).toBe(true)

    // 离开弹出层后延迟收起
    await wrapper.find('.lh-popover__popper').trigger('mouseleave')
    await vi.advanceTimersByTimeAsync(150)
    await nextTick()
    expect(wrapper.find('.lh-popover__popper').exists()).toBe(false)

    vi.useRealTimers()
  })

  it('opens on focusin for the focus trigger (H5)', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhPopover, {
      props: { trigger: 'focus', showAfter: 0 },
      slots,
    })

    await wrapper.find('.lh-popover').trigger('focusin')
    await nextTick()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(wrapper.find('.lh-popover__popper').exists()).toBe(true)

    // 焦点移出后收起（hideAfter 默认 100ms）
    await wrapper.find('.lh-popover').trigger('focusout')
    await vi.advanceTimersByTimeAsync(150)
    await nextTick()
    expect(wrapper.find('.lh-popover__popper').exists()).toBe(false)

    vi.useRealTimers()
  })

  it('closes on Escape via the document listener, topmost only', async () => {
    vi.useFakeTimers()
    const first = mount(LhPopover, {
      props: {},
      slots: { default: () => '甲', content: () => '甲内容' },
    })
    const second = mount(LhPopover, {
      props: {},
      slots: { default: () => '乙', content: () => '乙内容' },
    })
    await openPopper(first)
    await openPopper(second)

    // 多弹层叠加时 Esc 只关栈顶（与 Dialog / Dropdown 共用顺序栈）
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(second.find('.lh-popover__popper').exists()).toBe(false)
    expect(first.find('.lh-popover__popper').exists()).toBe(true)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(first.find('.lh-popover__popper').exists()).toBe(false)

    vi.useRealTimers()
  })
})
