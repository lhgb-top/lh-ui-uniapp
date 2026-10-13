import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import { nextTick } from 'vue'
import LhInput from '../../src/components/lh-input/lh-input.vue'

describe('LhInput', () => {
  it('renders an input with placeholder', () => {
    const wrapper = mount(LhInput, { props: { placeholder: '请输入' } })
    const inner = wrapper.find('.lh-input__inner')
    expect(inner.exists()).toBe(true)
    expect(inner.attributes('placeholder')).toBe('请输入')
  })

  it('uses placeholder-style instead of ::placeholder (MP adaptation)', () => {
    const wrapper = mount(LhInput, {
      props: { placeholder: '请输入', placeholderStyle: 'color: red' },
    })
    expect(wrapper.find('.lh-input__inner').attributes('placeholder-style')).toBe('color: red')
  })

  it('renders textarea when type is textarea', () => {
    const wrapper = mount(LhInput, { props: { type: 'textarea', rows: 3 } })
    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(false)
  })

  it('emits update:modelValue and input on input event', async () => {
    const wrapper = mount(LhInput)
    // uni 的 input 事件载荷在 event.detail.value（H5 原生 input 事件没有 detail）
    await wrapper.find('.lh-input__inner').trigger('input', { detail: { value: '水墨' } })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['水墨'])
    expect(wrapper.emitted('input')?.[0]).toEqual(['水墨'])
  })

  it('emits focus and blur events', async () => {
    const wrapper = mount(LhInput)
    const inner = wrapper.find('.lh-input__inner')
    await inner.trigger('focus')
    expect(wrapper.emitted('focus')).toHaveLength(1)
    // jsdom 的 blur 是 FocusEvent，detail 只读且 VTU trigger 不接受 Event 实例；
    // uni 的载荷在 detail，直接在 DOM 上派发 CustomEvent
    inner.element.dispatchEvent(new CustomEvent('blur', { detail: { value: '' } }))
    await nextTick()
    expect(wrapper.emitted('blur')?.[0]).toEqual([''])
  })

  it('shows word count when showWordLimit and maxlength are set', () => {
    const wrapper = mount(LhInput, {
      props: { modelValue: '水墨', maxlength: 10, showWordLimit: true },
    })
    const count = wrapper.find('.lh-input__count')
    expect(count.exists()).toBe(true)
    expect(count.text()).toContain('2')
    expect(count.text()).toContain('10')
  })

  it('shows the clear button when clearable and has value', () => {
    const wrapper = mount(LhInput, { props: { modelValue: '水墨', clearable: true } })
    expect(wrapper.find('.lh-input__clear').exists()).toBe(true)

    const empty = mount(LhInput, { props: { modelValue: '', clearable: true } })
    expect(empty.find('.lh-input__clear').exists()).toBe(false)
  })

  it('emits clear when the clear button is clicked', async () => {
    const wrapper = mount(LhInput, { props: { modelValue: '水墨', clearable: true } })
    await wrapper.find('.lh-input__clear').trigger('click')
    expect(wrapper.emitted('clear')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
  })

  it('renders prefix and suffix icons', () => {
    const wrapper = mount(LhInput, {
      props: { prefixIcon: 'search', suffixIcon: 'eye' },
    })
    expect(wrapper.find('.lh-input__prefix-icon').exists()).toBe(true)
    expect(wrapper.find('.lh-input__suffix-icon').exists()).toBe(true)
  })

  it('applies state class', () => {
    const wrapper = mount(LhInput, { props: { state: 'error' } })
    expect(wrapper.classes()).toContain('lh-input--error')
  })
})
