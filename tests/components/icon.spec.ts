import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import LhIcon from '../../src/components/lh-icon/lh-icon.vue'

describe('LhIcon', () => {
  it('renders font class for the given name', () => {
    const wrapper = mount(LhIcon, { props: { name: 'search' } })
    expect(wrapper.classes()).toContain('lh-icon')
    const font = wrapper.find('.lh-iconfont')
    expect(font.classes()).toContain('lh-iconfont')
    expect(font.classes()).toContain('lh-iconfont--search')
  })

  it('adds the name modifier class', () => {
    const wrapper = mount(LhIcon, { props: { name: 'star' } })
    expect(wrapper.classes()).toContain('lh-icon--star')
  })

  it('adds spin class for the loading icon', () => {
    const wrapper = mount(LhIcon, { props: { name: 'loading' } })
    expect(wrapper.classes()).toContain('lh-icon--loading')
  })

  it('maps numeric size to px style', () => {
    const wrapper = mount(LhIcon, { props: { name: 'search', size: 24 } })
    expect(wrapper.find('.lh-iconfont').attributes('style')).toContain('font-size: 24px')
  })

  it('passes string size through', () => {
    const wrapper = mount(LhIcon, { props: { name: 'search', size: '1.5em' } })
    expect(wrapper.find('.lh-iconfont').attributes('style')).toContain('font-size: 1.5em')
  })

  it('maps color to style', () => {
    const wrapper = mount(LhIcon, { props: { name: 'search', color: '#c8a45c' } })
    expect(wrapper.find('.lh-iconfont').attributes('style')).toContain('color: rgb(200, 164, 92)')
  })

  it('renders the default slot when no name is given', () => {
    const wrapper = mount(LhIcon, { slots: { default: '字' } })
    expect(wrapper.text()).toBe('字')
    expect(wrapper.classes()).not.toContain('lh-iconfont--search')
    expect(wrapper.find('.lh-iconfont').exists()).toBe(false)
  })
})
