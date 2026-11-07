import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import LhResult from '../../src/components/lh-result/lh-result.vue'
import LhIcon from '../../src/components/lh-icon/lh-icon.vue'

describe('LhResult', () => {
  it('renders the status modifier and role="status"', () => {
    const wrapper = mount(LhResult, { props: { status: 'success' } })
    expect(wrapper.classes()).toContain('lh-result--success')
    expect(wrapper.attributes('role')).toBe('status')
  })

  it('falls back to info for an invalid status', () => {
    expect(mount(LhResult, { props: { status: 'fatal' } }).classes()).toContain('lh-result--info')
  })

  it('renders the default status icon', () => {
    const wrapper = mount(LhResult, { props: { status: 'warning' } })
    expect(wrapper.find('.lh-result__icon').exists()).toBe(true)
    // lh-icon 是组件不是 DOM 标签：渲染后 <lh-icon> 不落图，按组件实例断言 props
    const icon = wrapper.find('.lh-result__icon').findComponent(LhIcon)
    expect(icon.exists()).toBe(true)
    expect(icon.props('name')).toBe('warning')
  })

  it('honors a custom icon and size', () => {
    const wrapper = mount(LhResult, { props: { icon: 'like', iconSize: 48 } })
    const icon = wrapper.find('.lh-result__icon').findComponent(LhIcon)
    expect(icon.props('name')).toBe('like')
    expect(icon.props('size')).toBe(48)
  })

  it('hides the icon when icon is an empty string', () => {
    const wrapper = mount(LhResult, { props: { icon: '' } })
    expect(wrapper.find('.lh-result__icon').exists()).toBe(false)
  })

  it('renders title / subTitle props', () => {
    const wrapper = mount(LhResult, {
      props: { title: '提交成功', subTitle: '工单已归档' },
    })
    expect(wrapper.find('.lh-result__title').text()).toContain('提交成功')
    expect(wrapper.find('.lh-result__subtitle').text()).toContain('工单已归档')
  })

  it('omits the subtitle area when neither prop nor slot is provided', () => {
    expect(mount(LhResult).find('.lh-result__subtitle').exists()).toBe(false)
  })

  it('renders title / subTitle / extra slots', () => {
    const wrapper = mount(LhResult, {
      slots: {
        title: '插槽标题',
        subTitle: '插槽副标题',
        extra: '<view class="my-extra">操作</view>',
      },
    })
    expect(wrapper.find('.lh-result__title').text()).toBe('插槽标题')
    expect(wrapper.find('.lh-result__subtitle').text()).toBe('插槽副标题')
    expect(wrapper.find('.lh-result__extra .my-extra').exists()).toBe(true)
  })

  it('passes customClass through to root', () => {
    expect(mount(LhResult, { props: { customClass: 'my-result' } }).classes()).toContain(
      'my-result',
    )
  })
})
