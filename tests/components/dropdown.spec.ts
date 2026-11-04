import { describe, expect, it, vi } from 'vitest'
import { mount } from '../mount'
import { h, nextTick } from 'vue'
import LhDropdown from '../../src/components/lh-dropdown/lh-dropdown.vue'
import LhDropdownItem from '../../src/components/lh-dropdown-item/lh-dropdown-item.vue'

// 弹层度量在 jsdom 里没有真实 SelectorQuery，把 getLhRect / platform 打桩成固定几何体，
// 验证「开 → 定位 → 选项 → 关」的时序与事件流（computePosition 本身在 share 仓有单测）
vi.mock('@/adapter/getRect', () => ({
  getSingleLhRect: async (selector: string) => {
    // trigger/popper 的 id 带实例 uid 后缀（组件内做了唯一化），用前缀匹配
    if (selector.startsWith('#lh-dropdown-trigger')) {
      return { top: 100, left: 10, width: 200, height: 40, right: 210, bottom: 140 }
    }
    return { top: 0, left: 0, width: 200, height: 160, right: 200, bottom: 160 }
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
  dropdown: () => [
    h(LhDropdownItem, { command: 'new' }, () => '新建'),
    h(LhDropdownItem, { command: 'edit' }, () => '编辑'),
    h(LhDropdownItem, { command: 'delete', divided: true }, () => '删除'),
    h(LhDropdownItem, { command: 'purge', disabled: true }, () => '清空数据'),
  ],
}

async function openPopper(wrapper: ReturnType<typeof mount>) {
  await wrapper.find('.lh-dropdown').trigger('click')
  await nextTick()
  // useLhPopper 内有一个 setTimeout(0) 等隐藏态 DOM 提交
  await vi.runAllTimersAsync()
  await nextTick()
}

describe('LhDropdown', () => {
  it('renders the trigger slot and hides the menu by default', () => {
    const wrapper = mount(LhDropdown, { props: {}, slots })
    expect(wrapper.find('.lh-dropdown').text()).toContain('触发器')
    expect(wrapper.find('.lh-dropdown__menu').exists()).toBe(false)
  })

  it('opens on click, positions the menu, and emits visible-change', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhDropdown, { props: {}, slots })
    await openPopper(wrapper)

    const menu = wrapper.find('.lh-dropdown__menu')
    expect(menu.exists()).toBe(true)
    // 默认方位 bottom-start：computePosition 在 375×667 视口内把菜单放到触发器下方左侧
    expect(menu.classes()).toContain('lh-dropdown__menu--bottom-start')
    expect(menu.attributes('style')).toContain('position: fixed')
    expect(menu.attributes('style')).toContain('top: 148px')
    expect(menu.attributes('style')).toContain('left: 10px')
    expect(wrapper.emitted('visible-change')?.[0]).toEqual([true])
    // aria 属性包由 share 纯函数产出，摊开绑定
    expect(wrapper.find('.lh-dropdown').attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('.lh-dropdown').attributes('aria-haspopup')).toBe('menu')

    vi.useRealTimers()
  })

  it('emits command on item click and closes (hideOnClick defaults to true)', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhDropdown, { props: {}, slots })
    await openPopper(wrapper)

    const items = wrapper.findAll('.lh-dropdown__item')
    expect(items).toHaveLength(4)
    await items[1].trigger('click')
    expect(wrapper.emitted('command')?.[0]).toEqual(['edit'])
    expect(wrapper.emitted('visible-change')?.[1]).toEqual([false])
    expect(wrapper.find('.lh-dropdown__menu').exists()).toBe(false)

    vi.useRealTimers()
  })

  it('keeps the menu open after item click when hideOnClick is false', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhDropdown, { props: { hideOnClick: false }, slots })
    await openPopper(wrapper)

    await wrapper.findAll('.lh-dropdown__item')[0].trigger('click')
    expect(wrapper.emitted('command')?.[0]).toEqual(['new'])
    expect(wrapper.find('.lh-dropdown__menu').exists()).toBe(true)

    vi.useRealTimers()
  })

  it('marks disabled items and does not emit command for them', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhDropdown, { props: {}, slots })
    await openPopper(wrapper)

    const items = wrapper.findAll('.lh-dropdown__item')
    expect(items[3].classes()).toContain('lh-dropdown__item--disabled')
    expect(items[3].attributes('aria-disabled')).toBe('true')
    await items[3].trigger('click')
    expect(wrapper.emitted('command')).toBeUndefined()
    // 禁用项点击不触发指令，菜单保持打开
    expect(wrapper.find('.lh-dropdown__menu').exists()).toBe(true)

    vi.useRealTimers()
  })

  it('marks divided items with the modifier class', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhDropdown, { props: {}, slots })
    await openPopper(wrapper)

    expect(wrapper.findAll('.lh-dropdown__item')[2].classes()).toContain(
      'lh-dropdown__item--divided',
    )

    vi.useRealTimers()
  })

  it('closes on mask click', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhDropdown, { props: {}, slots })
    await openPopper(wrapper)

    await wrapper.find('.lh-dropdown__mask').trigger('click')
    expect(wrapper.find('.lh-dropdown__menu').exists()).toBe(false)
    expect(wrapper.emitted('visible-change')?.[1]).toEqual([false])

    vi.useRealTimers()
  })

  it('never opens when disabled', async () => {
    const wrapper = mount(LhDropdown, { props: { disabled: true }, slots })
    await wrapper.find('.lh-dropdown').trigger('click')
    await nextTick()
    expect(wrapper.find('.lh-dropdown__menu').exists()).toBe(false)
    expect(wrapper.emitted('visible-change')).toBeUndefined()
  })

  it('applies popperClass and maxHeight to the menu', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhDropdown, {
      props: { popperClass: 'demo-menu', maxHeight: 160 },
      slots,
    })
    await openPopper(wrapper)

    const menu = wrapper.find('.lh-dropdown__menu')
    expect(menu.classes()).toContain('demo-menu')
    expect(menu.attributes('style')).toContain('max-height: 160px')
    expect(menu.attributes('style')).toContain('overflow: auto')

    vi.useRealTimers()
  })

  it('follows the requested placement with the menu modifier class', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhDropdown, { props: { placement: 'bottom-end' }, slots })
    await openPopper(wrapper)

    expect(wrapper.find('.lh-dropdown__menu').classes()).toContain('lh-dropdown__menu--bottom-end')

    vi.useRealTimers()
  })

  it('respects controlled visible (v-model:visible)', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhDropdown, { props: { visible: false }, slots })
    await wrapper.find('.lh-dropdown').trigger('click')
    await nextTick()
    await vi.runAllTimersAsync()
    // 受控模式：触发器点击不自行开关，也不发事件
    expect(wrapper.find('.lh-dropdown__menu').exists()).toBe(false)
    expect(wrapper.emitted('visible-change')).toBeUndefined()

    await wrapper.setProps({ visible: true })
    await nextTick()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(wrapper.find('.lh-dropdown__menu').exists()).toBe(true)

    // 受控模式下遮罩点击同样不自行关闭（显隐由外部接管）
    await wrapper.find('.lh-dropdown__mask').trigger('click')
    expect(wrapper.find('.lh-dropdown__menu').exists()).toBe(true)

    vi.useRealTimers()
  })

  it('opens on longpress for the contextmenu trigger', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhDropdown, { props: { trigger: 'contextmenu' }, slots })
    await wrapper.find('.lh-dropdown').trigger('longpress')
    await nextTick()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(wrapper.find('.lh-dropdown__menu').exists()).toBe(true)

    vi.useRealTimers()
  })

  it('shows after hover delay, keeps open over the menu, then hides (H5)', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhDropdown, { props: { trigger: 'hover' }, slots })

    await wrapper.find('.lh-dropdown').trigger('mouseenter')
    // 200ms 显示延迟未到时不出现
    await vi.advanceTimersByTimeAsync(100)
    await nextTick()
    expect(wrapper.find('.lh-dropdown__menu').exists()).toBe(false)
    await vi.advanceTimersByTimeAsync(100)
    await nextTick()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(wrapper.find('.lh-dropdown__menu').exists()).toBe(true)

    // 离开触发器进入菜单：100ms 收起延迟被菜单 mouseenter 取消
    await wrapper.find('.lh-dropdown').trigger('mouseleave')
    await wrapper.find('.lh-dropdown__menu').trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(150)
    expect(wrapper.find('.lh-dropdown__menu').exists()).toBe(true)

    // 离开菜单后延迟收起
    await wrapper.find('.lh-dropdown__menu').trigger('mouseleave')
    await vi.advanceTimersByTimeAsync(150)
    await nextTick()
    expect(wrapper.find('.lh-dropdown__menu').exists()).toBe(false)

    vi.useRealTimers()
  })

  it('navigates items and triggers command with the keyboard (H5)', async () => {
    vi.useFakeTimers()
    // VTU 默认渲染在脱离文档的 DOM 上，focus() 对未连接元素无效，需挂到 document
    const wrapper = mount(LhDropdown, { props: {}, slots, attachTo: document.body })
    await openPopper(wrapper)
    const menu = wrapper.find('.lh-dropdown__menu')

    // 方向键循环聚焦可用项（jsdom 对带 tabindex 的元素支持程序化 focus）
    await menu.trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement?.textContent).toContain('新建')
    await menu.trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement?.textContent).toContain('编辑')

    // Enter 触发 command 并关闭（hideOnClick 默认 true）
    await menu.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('command')?.[0]).toEqual(['edit'])
    expect(wrapper.find('.lh-dropdown__menu').exists()).toBe(false)
    wrapper.unmount()

    vi.useRealTimers()
  })

  it('closes on Escape via the document listener, topmost only', async () => {
    vi.useFakeTimers()
    const first = mount(LhDropdown, {
      props: {},
      slots: {
        default: () => '甲',
        dropdown: () => h(LhDropdownItem, { command: 'a' }, () => '甲项'),
      },
    })
    const second = mount(LhDropdown, {
      props: {},
      slots: {
        default: () => '乙',
        dropdown: () => h(LhDropdownItem, { command: 'b' }, () => '乙项'),
      },
    })
    await openPopper(first)
    await openPopper(second)

    // 多弹层叠加时 Esc 只关栈顶（与 Dialog / Tooltip 共用顺序栈）
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(second.find('.lh-dropdown__menu').exists()).toBe(false)
    expect(first.find('.lh-dropdown__menu').exists()).toBe(true)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(first.find('.lh-dropdown__menu').exists()).toBe(false)

    vi.useRealTimers()
  })

  it('exposes show / hide / toggle programmatically', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhDropdown, { props: {}, slots })
    const vm = wrapper.vm as unknown as {
      show: () => void
      hide: () => void
      toggle: () => void
    }

    vm.show()
    await nextTick()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(wrapper.find('.lh-dropdown__menu').exists()).toBe(true)

    vm.hide()
    await nextTick()
    expect(wrapper.find('.lh-dropdown__menu').exists()).toBe(false)

    vm.toggle()
    await nextTick()
    expect(wrapper.find('.lh-dropdown__menu').exists()).toBe(true)

    vm.toggle()
    await nextTick()
    expect(wrapper.find('.lh-dropdown__menu').exists()).toBe(false)

    vi.useRealTimers()
  })
})
