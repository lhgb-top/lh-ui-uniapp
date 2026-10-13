import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import LhAvatar from '../../src/components/lh-avatar/lh-avatar.vue'

describe('LhAvatar', () => {
  it('renders text avatar taking the first code point', () => {
    const wrapper = mount(LhAvatar, { props: { text: '水墨' } })
    expect(wrapper.classes()).toContain('lh-avatar')
    expect(wrapper.find('.lh-avatar__text').text()).toBe('水')
    expect(wrapper.find('.lh-avatar__img').exists()).toBe(false)
  })

  it('renders image when src is a usable source', () => {
    const wrapper = mount(LhAvatar, { props: { src: 'https://example.com/a.png' } })
    const img = wrapper.find('.lh-avatar__img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('mode')).toBe('aspectFill')
    expect(wrapper.attributes('role')).toBeUndefined()
  })

  it('maps fit to uni image mode', () => {
    const cases: Record<string, string> = {
      fill: 'scaleToFill',
      contain: 'aspectFit',
      cover: 'aspectFill',
      none: 'center',
      'scale-down': 'aspectFit',
    }
    for (const [fit, mode] of Object.entries(cases)) {
      expect(
        mount(LhAvatar, { props: { src: 'https://example.com/a.png', fit } })
          .find('.lh-avatar__img')
          .attributes('mode'),
      ).toBe(mode)
    }
  })

  it('falls back to icon when image fails to load', async () => {
    const wrapper = mount(LhAvatar, {
      props: { src: 'https://example.com/a.png', icon: 'user' },
    })
    expect(wrapper.find('.lh-avatar__img').exists()).toBe(true)
    await wrapper.find('.lh-avatar__img').trigger('error')
    expect(wrapper.find('.lh-avatar__img').exists()).toBe(false)
    expect(wrapper.find('.lh-avatar__icon').exists()).toBe(true)
    expect(wrapper.emitted('error')).toHaveLength(1)
  })

  it('falls back to text when src is not a usable source', () => {
    const wrapper = mount(LhAvatar, { props: { text: '墨' } })
    expect(wrapper.find('.lh-avatar__text').text()).toBe('墨')
    expect(wrapper.attributes('role')).toBe('img')
  })

  it('renders default slot when nothing else is available', () => {
    const wrapper = mount(LhAvatar, { slots: { default: '自定义' } })
    expect(wrapper.text()).toBe('自定义')
  })

  it('applies shape and size classes', () => {
    expect(mount(LhAvatar, { props: { shape: 'square' } }).classes()).toContain('lh-avatar--square')
    expect(mount(LhAvatar, { props: { size: 'large' } }).classes()).toContain('lh-avatar--large')
  })

  it('uses alt as accessible name for non-image branches', () => {
    const wrapper = mount(LhAvatar, { props: { text: '墨', alt: '水墨头像' } })
    expect(wrapper.attributes('aria-label')).toBe('水墨头像')
  })
})
