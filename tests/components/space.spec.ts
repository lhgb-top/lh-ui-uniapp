import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import LhSpace from '../../src/components/lh-space/lh-space.vue'

describe('LhSpace', () => {
  it('renders slot and base class', () => {
    const wrapper = mount(LhSpace, { slots: { default: '水墨' } })
    expect(wrapper.classes()).toContain('lh-space')
    expect(wrapper.classes()).toContain('lh-space--horizontal')
    expect(wrapper.text()).toBe('水墨')
  })

  it('applies direction and wrap classes', () => {
    const wrapper = mount(LhSpace, {
      props: { direction: 'vertical', wrap: false },
    })
    expect(wrapper.classes()).toContain('lh-space--vertical')
    // wrap 仅水平方向生效
    expect(wrapper.classes()).not.toContain('lh-space--wrap')
  })

  it('emits wrap class only when horizontal', () => {
    expect(
      mount(LhSpace, { props: { wrap: true } }).classes(),
    ).toContain('lh-space--wrap')
    expect(
      mount(LhSpace, { props: { direction: 'vertical', wrap: true } }).classes(),
    ).not.toContain('lh-space--wrap')
  })

  it('maps preset sizes to token classes', () => {
    expect(mount(LhSpace, { props: { size: 'small' } }).classes()).toContain('lh-space--small')
    expect(mount(LhSpace, { props: { size: 'medium' } }).classes()).toContain('lh-space--medium')
    expect(mount(LhSpace, { props: { size: 'large' } }).classes()).toContain('lh-space--large')
  })

  it('writes numeric and tuple sizes as inline gap without size class', () => {
    const numeric = mount(LhSpace, { props: { size: 20 } })
    expect(numeric.classes()).not.toContain('lh-space--medium')
    expect(numeric.attributes('style')).toContain('column-gap: 20px')
    expect(numeric.attributes('style')).toContain('row-gap: 20px')

    const tuple = mount(LhSpace, { props: { size: [8, 16] } })
    expect(tuple.attributes('style')).toContain('column-gap: 8px')
    expect(tuple.attributes('style')).toContain('row-gap: 16px')
  })

  it('applies alignment as inline style', () => {
    expect(mount(LhSpace, { props: { alignment: 'center' } }).attributes('style')).toContain(
      'align-items: center',
    )
  })

  it('passes customClass through to root', () => {
    expect(
      mount(LhSpace, { props: { customClass: 'my-space' } }).classes(),
    ).toContain('my-space')
  })
})
