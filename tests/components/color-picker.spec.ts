import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '../mount'
import { nextTick } from 'vue'
import LhColorPicker from '../../src/components/lh-color-picker/lh-color-picker.vue'

/**
 * uni 事件载荷形态：input / blur / confirm 的值在 event.detail.value
 * （与浏览器的 InputEvent 不重叠）。jsdom 的 blur / confirm 带 detail 只能直接在
 * DOM 上派发 CustomEvent（VTU trigger 不接受 Event 实例、detail 只读）。
 */
function dispatchUniEvent(element: Element, type: string, value: string) {
  element.dispatchEvent(new CustomEvent(type, { detail: { value } }))
}

function mountColorPicker(props = {}) {
  // popper 经 getLhRect 走 document.querySelectorAll 度量（H5 分支），
  // 不挂 document 拿不到节点，弹层会停在 visibility:hidden
  return mount(LhColorPicker, { props, attachTo: document.body })
}

afterEach(() => {
  document.body.innerHTML = ''
})

async function openPanel() {
  // 不在此点击触发器：useLhPopper 的两帧度量需要隐藏态 DOM 先提交，
  // 调用方自行打开（点击 / vm.open()）后调本函数推进计时即可
  await nextTick()
  await vi.runAllTimersAsync()
  await nextTick()
}

describe('LhColorPicker', () => {
  it('renders the swatch and the normalized value text', () => {
    const wrapper = mountColorPicker({ modelValue: '#2B4C7C' })
    expect(wrapper.find('.lh-color-picker').classes()).toContain('lh-color-picker--medium')
    expect(wrapper.find('.lh-color-picker__swatch').exists()).toBe(true)
    expect(wrapper.find('.lh-color-picker__value').text()).toBe('#2b4c7c')
  })

  it('outputs an rgb() string with format="rgb"', () => {
    const wrapper = mountColorPicker({ modelValue: '#2B4C7C', format: 'rgb' })
    expect(wrapper.find('.lh-color-picker__value').text()).toBe('rgb(43, 76, 124)')
  })

  it('shows the placeholder and --empty class for a blank value', () => {
    const wrapper = mountColorPicker({ modelValue: '', placeholder: '自定义占位' })
    expect(wrapper.find('.lh-color-picker__value').text()).toBe('自定义占位')
    expect(wrapper.find('.lh-color-picker').classes()).toContain('lh-color-picker--empty')
  })

  it('treats an unparseable modelValue as blank', () => {
    const wrapper = mountColorPicker({ modelValue: 'not-a-color', placeholder: '选择颜色' })
    expect(wrapper.find('.lh-color-picker').classes()).toContain('lh-color-picker--empty')
    expect(wrapper.find('.lh-color-picker__value').text()).toBe('选择颜色')
  })

  it('opens and closes the panel on trigger clicks', async () => {
    vi.useFakeTimers()
    const wrapper = mountColorPicker({})
    expect(wrapper.find('.lh-color-picker__panel').exists()).toBe(false)
    await wrapper.find('.lh-color-picker').trigger('click')
    await openPanel()
    expect(wrapper.find('.lh-color-picker__panel').exists()).toBe(true)
    expect(wrapper.find('.lh-color-picker').classes()).toContain('lh-color-picker--open')
    await wrapper.find('.lh-color-picker').trigger('click')
    expect(wrapper.find('.lh-color-picker__panel').exists()).toBe(false)
    vi.useRealTimers()
  })

  it('does not open the panel when disabled', async () => {
    vi.useFakeTimers()
    const wrapper = mountColorPicker({ disabled: true })
    await wrapper.find('.lh-color-picker').trigger('click')
    await openPanel()
    expect(wrapper.find('.lh-color-picker__panel').exists()).toBe(false)
    expect(wrapper.find('.lh-color-picker').classes()).toContain('lh-color-picker--disabled')
    vi.useRealTimers()
  })

  it('clears the value and emits clear from the clear button', async () => {
    const wrapper = mountColorPicker({ modelValue: '#2B4C7C', clearable: true })
    expect(wrapper.find('.lh-color-picker__clear').exists()).toBe(true)
    await wrapper.find('.lh-color-picker__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['']])
    expect(wrapper.emitted('change')).toEqual([['']])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('hides the clear button when blank or disabled', () => {
    expect(mountColorPicker({ clearable: true }).find('.lh-color-picker__clear').exists()).toBe(
      false,
    )
    expect(
      mountColorPicker({ modelValue: '#2B4C7C', clearable: true, disabled: true }).find(
        '.lh-color-picker__clear',
      ).exists(),
    ).toBe(false)
  })

  it('commits a predefined swatch on click', async () => {
    vi.useFakeTimers()
    const wrapper = mountColorPicker({ predefine: ['#FF0000', '#00FF00'] })
    await wrapper.find('.lh-color-picker').trigger('click')
    await openPanel()
    const items = wrapper.findAll('.lh-color-picker__predefine-item')
    expect(items).toHaveLength(2)
    await items[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['#FF0000']])
    expect(wrapper.emitted('change')).toEqual([['#FF0000']])
    vi.useRealTimers()
  })

  it('renders the alpha slider only when showAlpha is on', async () => {
    vi.useFakeTimers()
    const withoutAlpha = mountColorPicker({})
    await withoutAlpha.find('.lh-color-picker').trigger('click')
    await openPanel()
    expect(withoutAlpha.find('.lh-color-picker__alpha').exists()).toBe(false)

    const withAlpha = mountColorPicker({ showAlpha: true })
    await withAlpha.find('.lh-color-picker').trigger('click')
    await openPanel()
    expect(withAlpha.find('.lh-color-picker__alpha').exists()).toBe(true)
    vi.useRealTimers()
  })

  it('commits a valid hex from the panel input on blur', async () => {
    vi.useFakeTimers()
    const wrapper = mountColorPicker({ modelValue: '', format: 'hex' })
    await wrapper.find('.lh-color-picker').trigger('click')
    await openPanel()
    const input = wrapper.find('.lh-color-picker__input')
    expect(input.exists()).toBe(true)
    dispatchUniEvent(input.element, 'blur', '#2B4C7C')
    expect(wrapper.emitted('update:modelValue')).toEqual([['#2b4c7c']])
    expect(wrapper.emitted('change')).toEqual([['#2b4c7c']])
    vi.useRealTimers()
  })

  it('ignores an invalid panel input without emitting', async () => {
    vi.useFakeTimers()
    const wrapper = mountColorPicker({ modelValue: '#2B4C7C' })
    await wrapper.find('.lh-color-picker').trigger('click')
    await openPanel()
    const input = wrapper.find('.lh-color-picker__input')
    dispatchUniEvent(input.element, 'blur', 'not-a-color')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('change')).toBeUndefined()
    vi.useRealTimers()
  })

  it('exposes open / close / isOpen on the instance', async () => {
    vi.useFakeTimers()
    const wrapper = mountColorPicker({})
    const vm = wrapper.vm as { open: () => void; close: () => void; isOpen: boolean }
    expect(typeof vm.open).toBe('function')
    expect(typeof vm.close).toBe('function')
    vm.open()
    await openPanel()
    expect(wrapper.find('.lh-color-picker__panel').exists()).toBe(true)
    vm.close()
    await nextTick()
    expect(wrapper.find('.lh-color-picker__panel').exists()).toBe(false)
    vi.useRealTimers()
  })
})
