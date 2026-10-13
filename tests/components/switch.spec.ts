import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import LhSwitch from '../../src/components/lh-switch/lh-switch.vue'

describe('LhSwitch', () => {
  it('renders the core and exposes aria-checked', () => {
    const wrapper = mount(LhSwitch)
    expect(wrapper.classes()).toContain('lh-switch')
    expect(wrapper.find('.lh-switch__core').exists()).toBe(true)
    expect(wrapper.attributes('aria-checked')).toBe('false')
  })

  it('toggles and emits update:modelValue / change on click', async () => {
    const wrapper = mount(LhSwitch, { props: { modelValue: false } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(wrapper.emitted('change')?.[0]).toEqual([true])
  })

  it('does not toggle when disabled', async () => {
    const wrapper = mount(LhSwitch, { props: { modelValue: false, disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })

  it('does not toggle when loading', async () => {
    const wrapper = mount(LhSwitch, { props: { loading: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find('.lh-switch__loading').exists()).toBe(true)
  })

  it('shows the active text when on', () => {
    const on = mount(LhSwitch, {
      props: { modelValue: true, activeText: '开', inactiveText: '关' },
    })
    expect(on.find('.lh-switch__label').text()).toBe('开')

    const off = mount(LhSwitch, {
      props: { modelValue: false, activeText: '开', inactiveText: '关' },
    })
    expect(off.find('.lh-switch__label').text()).toBe('关')
  })
})
