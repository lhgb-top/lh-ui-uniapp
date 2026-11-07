import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import LhLink from '../../src/components/lh-link/lh-link.vue'

describe('LhLink', () => {
  it('renders the base class and role="link"', () => {
    const wrapper = mount(LhLink, { slots: { default: '一个链接' } })
    expect(wrapper.classes()).toContain('lh-link')
    expect(wrapper.attributes('role')).toBe('link')
  })

  it('emits type and underline modifiers', () => {
    const wrapper = mount(LhLink, {
      props: { type: 'primary', underline: 'always' },
    })
    expect(wrapper.classes()).toContain('lh-link--primary')
    expect(wrapper.classes()).toContain('lh-link--underline-always')
  })

  it('omits the underline modifier for the hover default', () => {
    const wrapper = mount(LhLink)
    expect(wrapper.classes()).not.toContain('lh-link--underline-always')
    expect(wrapper.classes()).not.toContain('lh-link--underline-none')
  })

  it('exposes the disabled state via aria-disabled', () => {
    const wrapper = mount(LhLink, { props: { disabled: true } })
    expect(wrapper.classes()).toContain('lh-link--disabled')
    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })

  it('exposes aria-current for the current-page marker', () => {
    const wrapper = mount(LhLink, { props: { current: 'page' } })
    expect(wrapper.attributes('aria-current')).toBe('page')
  })

  it('renders prefix / suffix slots around the text', () => {
    const wrapper = mount(LhLink, {
      slots: {
        default: '正文',
        prefix: '<view class="my-prefix">前</view>',
        suffix: '<view class="my-suffix">后</view>',
      },
    })
    expect(wrapper.find('.lh-link__text').text()).toBe('正文')
    expect(wrapper.find('.my-prefix').exists()).toBe(true)
    expect(wrapper.find('.my-suffix').exists()).toBe(true)
  })

  it('emits click when tapped', async () => {
    const wrapper = mount(LhLink, { slots: { default: '点我' } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('passes customClass through to root', () => {
    expect(mount(LhLink, { props: { customClass: 'my-link' } }).classes()).toContain('my-link')
  })
})
