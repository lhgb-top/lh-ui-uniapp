import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import LhBadge from '../../src/components/lh-badge/lh-badge.vue'

describe('LhBadge', () => {
  it('renders slot and base class', () => {
    const wrapper = mount(LhBadge, { slots: { default: '水墨' } })
    expect(wrapper.classes()).toContain('lh-badge')
    expect(wrapper.text()).toContain('水墨')
  })

  it('applies type classes to root', () => {
    expect(
      mount(LhBadge, { props: { type: 'primary', value: 1 } }).classes(),
    ).toContain('lh-badge--primary')
    expect(
      mount(LhBadge, { props: { type: 'success', value: 1 } }).classes(),
    ).toContain('lh-badge--success')
  })

  it('renders numeric value', () => {
    const wrapper = mount(LhBadge, { props: { value: 8 } })
    expect(wrapper.find('.lh-badge__content').text()).toBe('8')
  })

  it('clamps value with max to "max+"', () => {
    expect(
      mount(LhBadge, { props: { value: 200, max: 99 } }).find('.lh-badge__content').text(),
    ).toBe('99+')
  })

  it('renders string value verbatim', () => {
    expect(
      mount(LhBadge, { props: { value: '新' } }).find('.lh-badge__content').text(),
    ).toBe('新')
  })

  it('prefers content prop over value', () => {
    expect(
      mount(LhBadge, { props: { value: 8, content: 'Hot' } }).find('.lh-badge__content').text(),
    ).toBe('Hot')
  })

  it('hides content when hidden', () => {
    const wrapper = mount(LhBadge, { props: { value: 8, hidden: true } })
    expect(wrapper.find('.lh-badge__content').exists()).toBe(false)
  })

  it('hides zero unless showZero', () => {
    expect(mount(LhBadge, { props: { value: 0 } }).find('.lh-badge__content').exists()).toBe(false)
    expect(
      mount(LhBadge, { props: { value: 0, showZero: true } }).find('.lh-badge__content').text(),
    ).toBe('0')
  })

  it('renders dot without value text', () => {
    const wrapper = mount(LhBadge, { props: { isDot: true } })
    expect(wrapper.classes()).toContain('lh-badge--dot')
    expect(wrapper.find('.lh-badge__content').exists()).toBe(true)
    expect(wrapper.find('.lh-badge__content').text()).toBe('')
    expect(wrapper.find('.lh-badge__content').attributes('aria-hidden')).toBe('true')
  })

  it('applies size classes', () => {
    expect(mount(LhBadge, { props: { size: 'small', value: 1 } }).classes()).toContain(
      'lh-badge--small',
    )
    expect(mount(LhBadge, { props: { size: 'large', value: 1 } }).classes()).toContain(
      'lh-badge--large',
    )
  })

  it('converts offset to negative margins', () => {
    const style = mount(LhBadge, { props: { value: 1, offset: [6, 10] } })
      .find('.lh-badge__content')
      .attributes('style')
    expect(style).toContain('margin-left: -6px')
    expect(style).toContain('margin-top: -10px')
  })

  it('mounts and unmounts the zoom timer cleanly', async () => {
    const wrapper = mount(LhBadge, { props: { value: 8 } })
    expect(wrapper.find('.lh-badge__content').exists()).toBe(true)
    // hidden -> 进入离开动画，节点仍在；播完才摘除
    await wrapper.setProps({ hidden: true })
    expect(wrapper.find('.lh-badge__content').exists()).toBe(true)
    expect(wrapper.find('.lh-badge__content').classes()).toContain('lh-badge-zoom-leave-active')
    await new Promise((resolve) => setTimeout(resolve, 200))
    expect(wrapper.find('.lh-badge__content').exists()).toBe(false)
  })
})
