import { describe, expect, it, vi } from 'vitest'
import { mount } from '../mount'
import { nextTick } from 'vue'
import LhPopconfirm from '../../src/components/lh-popconfirm/lh-popconfirm.vue'

// 弹层度量在 jsdom 里没有真实 SelectorQuery，把 getLhRect / platform 打桩成固定几何体，
// 验证「开 → 定位 → 关」的时序与事件流（computePosition 本身在 share 仓有单测）
vi.mock('@/adapter/getRect', () => ({
  getSingleLhRect: async (selector: string) => {
    // trigger/popper 的 id 带实例 uid 后缀（组件内做了唯一化），用前缀匹配
    if (selector.startsWith('#lh-popconfirm-trigger')) {
      return { top: 200, left: 20, width: 100, height: 32, right: 120, bottom: 232 }
    }
    return { top: 0, left: 0, width: 160, height: 96, right: 160, bottom: 96 }
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
  default: () => '删除',
}

async function openPopper(wrapper: ReturnType<typeof mount>) {
  await wrapper.find('.lh-popconfirm').trigger('click')
  await nextTick()
  // useLhPopper 内有一个 setTimeout(0) 等隐藏态 DOM 提交
  await vi.runAllTimersAsync()
  await nextTick()
}

describe('LhPopconfirm', () => {
  it('renders the trigger slot and hides the popper by default', () => {
    const wrapper = mount(LhPopconfirm, {
      props: { title: '确定删除这条记录吗？' },
      slots,
    })
    expect(wrapper.find('.lh-popconfirm').text()).toContain('删除')
    expect(wrapper.find('.lh-popconfirm__popper').exists()).toBe(false)
  })

  it('opens on click with title, icon, actions and arrow, and positions the popper', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhPopconfirm, {
      props: { title: '确定删除这条记录吗？' },
      slots,
    })
    await openPopper(wrapper)

    const popper = wrapper.find('.lh-popconfirm__popper')
    expect(popper.exists()).toBe(true)
    // 默认语气 warning：语气图标由 share 纯函数 getPopconfirmIconName 决定
    expect(popper.find('.lh-popconfirm__icon.lh-icon--warning').exists()).toBe(true)
    expect(popper.find('.lh-popconfirm__title').text()).toBe('确定删除这条记录吗？')
    // 按钮文案默认取语言包 popconfirm.confirm / popconfirm.cancel
    const buttons = popper.findAll('.lh-popconfirm__actions .lh-button')
    expect(buttons).toHaveLength(2)
    expect(buttons[0].text()).toBe('取消')
    expect(buttons[1].text()).toBe('确定')
    // 确认按钮默认主类型（confirmButtonType 默认 primary）
    expect(buttons[1].classes()).toContain('lh-button--primary')
    expect(popper.find('.lh-popconfirm__arrow').exists()).toBe(true)
    // 默认方位 top：computePosition 在 375×667 视口内把弹层放到触发器上方
    expect(popper.classes()).toContain('lh-popconfirm__popper--top')
    expect(popper.attributes('style')).toContain('position: fixed')
    // 箭头指向触发器交叉轴中心（uniapp 的 useLhPopper 不写该变量，由组件胶水补写）
    expect(popper.attributes('style')).toContain('--lh-arrow-offset')
    // 弹出层为 role=alertdialog（阻断式确认语义），确认内容经 aria-labelledby 关联
    expect(popper.attributes('role')).toBe('alertdialog')
    expect(popper.attributes('aria-modal')).toBe('true')
    expect(popper.attributes('aria-labelledby')).toBeTruthy()
    // 触发器 aria 属性包由 share 纯函数产出，摊开绑定
    expect(wrapper.find('.lh-popconfirm').attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('.lh-popconfirm').attributes('aria-haspopup')).toBe('true')
    expect(wrapper.emitted('show')).toHaveLength(1)
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([true])

    vi.useRealTimers()
  })

  it('lets the content slot override the title prop', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhPopconfirm, {
      props: { title: '属性标题' },
      slots: { ...slots, content: () => '插槽确认内容' },
    })
    await openPopper(wrapper)

    expect(wrapper.find('.lh-popconfirm__title').text()).toBe('插槽确认内容')

    vi.useRealTimers()
  })

  it('applies the type modifier class and icon (danger)', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhPopconfirm, {
      props: { type: 'danger', title: '删除后不可恢复。' },
      slots,
    })
    await openPopper(wrapper)

    const popper = wrapper.find('.lh-popconfirm__popper')
    expect(popper.classes()).toContain('lh-popconfirm__popper--danger')
    // danger 语气对应 error 图标
    expect(popper.find('.lh-icon--error').exists()).toBe(true)

    vi.useRealTimers()
  })

  it('hides the icon when showIcon is false', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhPopconfirm, {
      props: { showIcon: false, title: '不展示语气图标。' },
      slots,
    })
    await openPopper(wrapper)

    expect(wrapper.find('.lh-popconfirm__icon').exists()).toBe(false)

    vi.useRealTimers()
  })

  it('supports custom confirm / cancel texts and button type', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhPopconfirm, {
      props: { title: '归档后可在回收站恢复。', confirmText: '归档', cancelText: '再想想', confirmButtonType: 'default' },
      slots,
    })
    await openPopper(wrapper)

    const buttons = wrapper.findAll('.lh-popconfirm__actions .lh-button')
    expect(buttons[0].text()).toBe('再想想')
    expect(buttons[1].text()).toBe('归档')
    // confirmButtonType='default' 时确认按钮不再带主类型修饰类
    expect(buttons[1].classes()).not.toContain('lh-button--primary')

    vi.useRealTimers()
  })

  it('applies popperClass to the popper', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhPopconfirm, {
      props: { popperClass: 'demo-popper', title: '自定义类名' },
      slots,
    })
    await openPopper(wrapper)

    expect(wrapper.find('.lh-popconfirm__popper').classes()).toContain('demo-popper')

    vi.useRealTimers()
  })

  it('emits confirm and closes on the confirm button', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhPopconfirm, {
      props: { title: '确定删除这条记录吗？' },
      slots,
    })
    await openPopper(wrapper)

    const buttons = wrapper.findAll('.lh-popconfirm__actions .lh-button')
    await buttons[1].trigger('click')
    await nextTick()
    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(wrapper.emitted('hide')).toHaveLength(1)
    expect(wrapper.emitted('update:visible')?.[1]).toEqual([false])
    expect(wrapper.find('.lh-popconfirm__popper').exists()).toBe(false)

    vi.useRealTimers()
  })

  it('emits cancel and closes on the cancel button', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhPopconfirm, {
      props: { title: '确定删除这条记录吗？' },
      slots,
    })
    await openPopper(wrapper)

    const buttons = wrapper.findAll('.lh-popconfirm__actions .lh-button')
    await buttons[0].trigger('click')
    await nextTick()
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('hide')).toHaveLength(1)
    expect(wrapper.find('.lh-popconfirm__popper').exists()).toBe(false)

    vi.useRealTimers()
  })

  it('closes on mask click without emitting cancel', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhPopconfirm, {
      props: { title: '确定删除这条记录吗？' },
      slots,
    })
    await openPopper(wrapper)
    expect(wrapper.find('.lh-popconfirm__popper').exists()).toBe(true)

    await wrapper.find('.lh-popconfirm__mask').trigger('click')
    await nextTick()
    expect(wrapper.find('.lh-popconfirm__popper').exists()).toBe(false)
    // 点击外部只关闭（对齐 plus 的 useLhClickOutside），不发 cancel
    expect(wrapper.emitted('cancel')).toBeUndefined()
    expect(wrapper.emitted('hide')).toHaveLength(1)
    expect(wrapper.emitted('update:visible')?.[1]).toEqual([false])

    vi.useRealTimers()
  })

  it('toggles on repeated clicks', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhPopconfirm, {
      props: { title: '确定删除这条记录吗？' },
      slots,
    })
    await openPopper(wrapper)
    expect(wrapper.find('.lh-popconfirm__popper').exists()).toBe(true)

    await wrapper.find('.lh-popconfirm').trigger('click')
    expect(wrapper.find('.lh-popconfirm__popper').exists()).toBe(false)

    vi.useRealTimers()
  })

  it('never opens when disabled', async () => {
    const wrapper = mount(LhPopconfirm, {
      props: { disabled: true, title: '该操作不可用。' },
      slots,
    })
    await wrapper.find('.lh-popconfirm').trigger('click')
    await nextTick()
    expect(wrapper.find('.lh-popconfirm__popper').exists()).toBe(false)
    expect(wrapper.emitted('update:visible')).toBeUndefined()
  })

  it('respects controlled visible with the manual trigger', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhPopconfirm, {
      props: { trigger: 'manual', visible: false, title: '受控气泡' },
      slots,
    })
    await wrapper.find('.lh-popconfirm').trigger('click')
    await nextTick()
    await vi.runAllTimersAsync()
    // 受控模式：触发器点击不自行开关，也不发事件
    expect(wrapper.find('.lh-popconfirm__popper').exists()).toBe(false)
    expect(wrapper.emitted('update:visible')).toBeUndefined()

    await wrapper.setProps({ visible: true })
    await nextTick()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(wrapper.find('.lh-popconfirm__popper').exists()).toBe(true)

    // 受控模式下遮罩点击同样不自行关闭（显隐由外部接管）
    await wrapper.find('.lh-popconfirm__mask').trigger('click')
    expect(wrapper.find('.lh-popconfirm__popper').exists()).toBe(true)

    vi.useRealTimers()
  })

  it('exposes show / hide / toggle programmatically', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhPopconfirm, {
      props: { title: '编程式显隐' },
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
    expect(wrapper.find('.lh-popconfirm__popper').exists()).toBe(true)

    vm.hide()
    await nextTick()
    expect(wrapper.find('.lh-popconfirm__popper').exists()).toBe(false)

    vm.toggle()
    await nextTick()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(wrapper.find('.lh-popconfirm__popper').exists()).toBe(true)

    vm.toggle()
    await nextTick()
    expect(wrapper.find('.lh-popconfirm__popper').exists()).toBe(false)

    vi.useRealTimers()
  })

  it('opens after hover delay, keeps open over the popper, then hides (H5)', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhPopconfirm, {
      props: { trigger: 'hover', title: '悬停确认' },
      slots,
    })

    await wrapper.find('.lh-popconfirm').trigger('mouseenter')
    // 200ms 显示延迟未到时不出现
    await vi.advanceTimersByTimeAsync(100)
    await nextTick()
    expect(wrapper.find('.lh-popconfirm__popper').exists()).toBe(false)
    await vi.advanceTimersByTimeAsync(100)
    await nextTick()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(wrapper.find('.lh-popconfirm__popper').exists()).toBe(true)

    // 离开触发器进入弹出层：100ms 收起延迟被弹层 mouseenter 取消
    await wrapper.find('.lh-popconfirm').trigger('mouseleave')
    await wrapper.find('.lh-popconfirm__popper').trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(150)
    expect(wrapper.find('.lh-popconfirm__popper').exists()).toBe(true)

    // 离开弹出层后延迟收起
    await wrapper.find('.lh-popconfirm__popper').trigger('mouseleave')
    await vi.advanceTimersByTimeAsync(150)
    await nextTick()
    expect(wrapper.find('.lh-popconfirm__popper').exists()).toBe(false)

    vi.useRealTimers()
  })

  it('closes on Escape as a cancel, topmost only', async () => {
    vi.useFakeTimers()
    const first = mount(LhPopconfirm, {
      props: { title: '甲气泡' },
      slots: { default: () => '甲' },
    })
    const second = mount(LhPopconfirm, {
      props: { title: '乙气泡' },
      slots: { default: () => '乙' },
    })
    await openPopper(first)
    await openPopper(second)

    // 多弹层叠加时 Esc 只关栈顶；Esc 视为取消（对齐 APG alertdialog）
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(second.find('.lh-popconfirm__popper').exists()).toBe(false)
    expect(second.emitted('cancel')).toHaveLength(1)
    expect(first.find('.lh-popconfirm__popper').exists()).toBe(true)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(first.find('.lh-popconfirm__popper').exists()).toBe(false)
    expect(first.emitted('cancel')).toHaveLength(1)

    vi.useRealTimers()
  })
})
