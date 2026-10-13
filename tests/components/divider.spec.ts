import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import LhDivider from '../../src/components/lh-divider/lh-divider.vue'

describe('LhDivider', () => {
  it('renders as pure decoration without content', () => {
    const wrapper = mount(LhDivider)
    expect(wrapper.classes()).toContain('lh-divider')
    expect(wrapper.classes()).toContain('lh-divider--horizontal')
    expect(wrapper.attributes('role')).toBe('presentation')
    expect(wrapper.find('.lh-divider__label').exists()).toBe(false)
  })

  it('renders label slot and separator role for horizontal with content', () => {
    const wrapper = mount(LhDivider, { slots: { default: '水墨' } })
    expect(wrapper.classes()).toContain('lh-divider--with-text')
    expect(wrapper.classes()).toContain('lh-divider--label-center')
    expect(wrapper.attributes('role')).toBe('separator')
    expect(wrapper.find('.lh-divider__label').text()).toBe('水墨')
  })

  it('renders label slot in vertical direction with separator semantics', () => {
    const wrapper = mount(LhDivider, {
      props: { direction: 'vertical' },
      slots: { default: '水墨' },
    })
    expect(wrapper.classes()).toContain('lh-divider--with-text')
    // labelPosition 是横向语义，竖向文案恒居中，不产出修饰类
    expect(wrapper.classes()).not.toContain('lh-divider--label-center')
    expect(wrapper.attributes('role')).toBe('separator')
    // 水平是 separator 的默认方向，竖向才需要显式声明
    expect(wrapper.attributes('aria-orientation')).toBe('vertical')
    expect(wrapper.find('.lh-divider__label').text()).toBe('水墨')
  })

  it('applies label position classes', () => {
    expect(
      mount(LhDivider, {
        props: { labelPosition: 'left' },
        slots: { default: '左' },
      }).classes(),
    ).toContain('lh-divider--label-left')
    expect(
      mount(LhDivider, {
        props: { labelPosition: 'right' },
        slots: { default: '右' },
      }).classes(),
    ).toContain('lh-divider--label-right')
  })

  it('applies dashed class', () => {
    expect(mount(LhDivider, { props: { dashed: true } }).classes()).toContain('lh-divider--dashed')
    expect(mount(LhDivider, { props: { dashed: false } }).classes()).not.toContain(
      'lh-divider--dashed',
    )
  })

  it('prefers borderStyle over dashed', () => {
    expect(
      mount(LhDivider, { props: { dashed: false, borderStyle: 'dashed' } }).classes(),
    ).toContain('lh-divider--dashed')
    // 非虚线/点线的 borderStyle 不产生变体类
    expect(
      mount(LhDivider, { props: { borderStyle: 'solid' } }).classes(),
    ).not.toContain('lh-divider--dashed')
  })

  it('never declares aria-orientation for horizontal dividers', () => {
    // 水平是 role="separator" 的默认方向，无需声明（竖向带文案才声明，见上一用例）
    expect(mount(LhDivider).attributes('aria-orientation')).toBeUndefined()
    expect(mount(LhDivider, { slots: { default: '水墨' } }).attributes('aria-orientation')).toBeUndefined()
  })

  it('passes customClass through to root', () => {
    expect(mount(LhDivider, { props: { customClass: 'my-divider' } }).classes()).toContain(
      'my-divider',
    )
  })
})
