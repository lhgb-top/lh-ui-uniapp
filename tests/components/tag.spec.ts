import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import LhTag from '../../src/components/lh-tag/lh-tag.vue'

describe('LhTag', () => {
  it('renders text slot and base class', () => {
    const wrapper = mount(LhTag, { slots: { default: '水墨' } })
    expect(wrapper.classes()).toContain('lh-tag')
    expect(wrapper.find('.lh-tag__text').text()).toBe('水墨')
  })

  it('applies type and size classes', () => {
    const wrapper = mount(LhTag, { props: { type: 'success', size: 'small' } })
    expect(wrapper.classes()).toContain('lh-tag--success')
    expect(wrapper.classes()).toContain('lh-tag--small')
  })

  it('emits close and hides the close button when disabled', async () => {
    const wrapper = mount(LhTag, { props: { closable: true, disabled: true } })
    const close = wrapper.find('.lh-tag__close')
    expect(close.exists()).toBe(true)
    expect(close.classes()).toContain('lh-tag__close--disabled')

    await close.trigger('click')
    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('emits close when not disabled', async () => {
    const wrapper = mount(LhTag, { props: { closable: true } })
    await wrapper.find('.lh-tag__close').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('emits click when a click listener is bound (a11y: 仅在有监听时才声明可点击)', async () => {
    const onClick = vi.fn()
    const wrapper = mount(LhTag, { props: { onClick } })
    await wrapper.find('.lh-tag').trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click without a bound listener', async () => {
    const wrapper = mount(LhTag)
    await wrapper.find('.lh-tag').trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })
})
