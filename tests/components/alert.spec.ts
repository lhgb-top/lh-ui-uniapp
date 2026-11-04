import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import LhAlert from '../../src/components/lh-alert/lh-alert.vue'

describe('LhAlert', () => {
  it('渲染根容器、标题与描述', () => {
    const wrapper = mount(LhAlert, {
      props: { title: '提示' },
      slots: { default: '描述内容' },
    })
    expect(wrapper.classes()).toContain('lh-alert')
    expect(wrapper.find('.lh-alert__title').text()).toBe('提示')
    expect(wrapper.find('.lh-alert__description').text()).toBe('描述内容')
  })

  it('无标题时不渲染标题节点（with-title 修饰类同步关闭）', () => {
    const wrapper = mount(LhAlert, { slots: { default: '仅描述' } })
    expect(wrapper.find('.lh-alert__title').exists()).toBe(false)
    expect(wrapper.classes()).not.toContain('lh-alert--with-title')
  })

  it('四种语义类型挂修饰类', () => {
    for (const type of ['info', 'success', 'warning', 'danger'] as const) {
      expect(mount(LhAlert, { props: { type } }).classes()).toContain(`lh-alert--${type}`)
    }
  })

  it('warning / danger 取 role=alert，info / success 取 role=status（APG 语义）', () => {
    expect(mount(LhAlert, { props: { type: 'warning' } }).attributes('role')).toBe('alert')
    expect(mount(LhAlert, { props: { type: 'danger' } }).attributes('role')).toBe('alert')
    expect(mount(LhAlert, { props: { type: 'info' } }).attributes('role')).toBe('status')
    expect(mount(LhAlert, { props: { type: 'success' } }).attributes('role')).toBe('status')
  })

  it('show-icon 渲染语义图标节点', () => {
    const wrapper = mount(LhAlert, { props: { showIcon: true, type: 'success' } })
    expect(wrapper.classes()).toContain('lh-alert--show-icon')
    expect(wrapper.find('.lh-alert__icon').exists()).toBe(true)
  })

  it('默认不渲染图标、不加修饰类', () => {
    const wrapper = mount(LhAlert)
    expect(wrapper.find('.lh-alert__icon').exists()).toBe(false)
    expect(wrapper.classes()).not.toContain('lh-alert--show-icon')
  })

  it('closable 渲染关闭按钮并暴露无障碍名称（语言包 alert.close）', () => {
    const wrapper = mount(LhAlert, { props: { closable: true } })
    expect(wrapper.classes()).toContain('lh-alert--closable')
    const close = wrapper.find('.lh-alert__close')
    expect(close.exists()).toBe(true)
    expect(close.attributes('role')).toBe('button')
    expect(close.attributes('aria-label')).toBe('关闭警告')
  })

  it('closeLabel 覆盖默认无障碍名称', () => {
    const wrapper = mount(LhAlert, { props: { closable: true, closeLabel: 'Dismiss' } })
    expect(wrapper.find('.lh-alert__close').attributes('aria-label')).toBe('Dismiss')
  })

  it('不可关闭时不渲染关闭按钮', () => {
    expect(mount(LhAlert).find('.lh-alert__close').exists()).toBe(false)
  })

  it('点击关闭按钮后隐藏根节点并触发 close 事件', async () => {
    const wrapper = mount(LhAlert, { props: { closable: true } })
    await wrapper.find('.lh-alert__close').trigger('click')
    expect(wrapper.find('.lh-alert').exists()).toBe(false)
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('plain 挂朴素修饰类', () => {
    expect(mount(LhAlert, { props: { plain: true } }).classes()).toContain('lh-alert--plain')
  })

  it('sx 转内联样式，customClass 透传根节点', () => {
    const wrapper = mount(LhAlert, {
      props: { sx: { w: '100%', mt: 2 }, customClass: 'my-alert' },
    })
    expect(wrapper.classes()).toContain('my-alert')
    expect(wrapper.attributes('style')).toContain('width: 100%')
    expect(wrapper.attributes('style')).toContain('margin-top: 16px')
  })

  it('title 插槽优先于 title prop', () => {
    const wrapper = mount(LhAlert, {
      props: { title: 'prop 标题' },
      slots: { title: '插槽标题' },
    })
    expect(wrapper.find('.lh-alert__title').text()).toBe('插槽标题')
    expect(wrapper.classes()).toContain('lh-alert--with-title')
  })
})
