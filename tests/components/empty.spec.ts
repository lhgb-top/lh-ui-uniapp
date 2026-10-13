import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import LhEmpty from '../../src/components/lh-empty/lh-empty.vue'

describe('LhEmpty', () => {
  it('renders default illustration and locale description', () => {
    const wrapper = mount(LhEmpty)
    expect(wrapper.classes()).toContain('lh-empty')
    expect(wrapper.find('.lh-empty__image').exists()).toBe(true)
    expect(wrapper.find('.lh-empty__description').text()).toBe('暂无数据')
  })

  it('uses description prop over locale', () => {
    expect(
      mount(LhEmpty, { props: { description: '墨还未干' } }).find('.lh-empty__description').text(),
    ).toBe('墨还未干')
  })

  it('renders custom image branch with --custom-image class', () => {
    const wrapper = mount(LhEmpty, { props: { image: 'https://example.com/a.png' } })
    expect(wrapper.classes()).toContain('lh-empty--custom-image')
    const img = wrapper.find('.lh-empty__image--custom .lh-img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/a.png')
    expect(img.attributes('mode')).toBe('aspectFit')
  })

  it('renders default slot as custom image', () => {
    const wrapper = mount(LhEmpty, { slots: { default: '插画' } })
    expect(wrapper.classes()).toContain('lh-empty--custom-image')
    expect(wrapper.find('.lh-empty__image--custom').text()).toBe('插画')
  })

  it('renders description and actions slots', () => {
    const wrapper = mount(LhEmpty, {
      slots: {
        description: '描述插槽',
        actions: '<view class="my-action">刷新</view>',
      },
    })
    expect(wrapper.find('.lh-empty__description').text()).toBe('描述插槽')
    expect(wrapper.find('.lh-empty__actions .my-action').exists()).toBe(true)
  })

  it('omits the actions area when the slot is unused', () => {
    expect(mount(LhEmpty).find('.lh-empty__actions').exists()).toBe(false)
  })

  it('declares role="status"', () => {
    expect(mount(LhEmpty).attributes('role')).toBe('status')
  })

  it('passes customClass through to root', () => {
    expect(mount(LhEmpty, { props: { customClass: 'my-empty' } }).classes()).toContain('my-empty')
  })
})
