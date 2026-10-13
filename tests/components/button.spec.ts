import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import LhButton from '../../src/components/lh-button/lh-button.vue'

describe('LhButton', () => {
  it('renders default type and text slot', () => {
    const wrapper = mount(LhButton, { slots: { default: '水墨' } })
    expect(wrapper.classes()).toContain('lh-button')
    expect(wrapper.text()).toBe('水墨')
  })

  it('applies type / size / variant classes', () => {
    const wrapper = mount(LhButton, {
      props: { type: 'primary', size: 'large', round: true, plain: true },
    })
    expect(wrapper.classes()).toContain('lh-button--primary')
    expect(wrapper.classes()).toContain('lh-button--large')
    expect(wrapper.classes()).toContain('lh-button--round')
    expect(wrapper.classes()).toContain('lh-button--plain')
  })

  it('emits click when clickable', async () => {
    const wrapper = mount(LhButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(LhButton, { props: { disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('does not emit click when loading and renders loading icon', async () => {
    const wrapper = mount(LhButton, { props: { loading: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
    expect(wrapper.find('.lh-button__icon').exists()).toBe(true)
  })

  it('renders named icon', () => {
    const wrapper = mount(LhButton, { props: { icon: 'search' } })
    const icon = wrapper.find('.lh-button__icon')
    expect(icon.exists()).toBe(true)
    expect(icon.find('.lh-iconfont').classes()).toContain('lh-iconfont--search')
  })
})
