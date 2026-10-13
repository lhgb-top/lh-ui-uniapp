import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import LhCard from '../../src/components/lh-card/lh-card.vue'

describe('LhCard', () => {
  it('renders base class and body slot', () => {
    const wrapper = mount(LhCard, { slots: { default: '内容' } })
    expect(wrapper.classes()).toContain('lh-card')
    expect(wrapper.classes()).toContain('lh-card--shadow-always')
    expect(wrapper.find('.lh-card__body').text()).toBe('内容')
  })

  it('renders title prop in header', () => {
    const wrapper = mount(LhCard, { props: { title: '水墨' } })
    expect(wrapper.find('.lh-card__header').exists()).toBe(true)
    expect(wrapper.find('.lh-card__title').text()).toBe('水墨')
  })

  it('prefers header slot over title prop', () => {
    const wrapper = mount(LhCard, {
      props: { title: 'prop 标题' },
      slots: { header: '插槽标题' },
    })
    expect(wrapper.find('.lh-card__title').exists()).toBe(false)
    expect(wrapper.find('.lh-card__header').text()).toBe('插槽标题')
  })

  it('renders cover / footer slots', () => {
    const wrapper = mount(LhCard, {
      slots: {
        cover: '<view class="my-cover">封面</view>',
        footer: '<view class="my-footer">底部</view>',
      },
    })
    expect(wrapper.find('.lh-card__cover .my-cover').exists()).toBe(true)
    expect(wrapper.find('.lh-card__footer .my-footer').exists()).toBe(true)
  })

  it('renders extra in the header next to the title', () => {
    const wrapper = mount(LhCard, {
      props: { title: '水墨' },
      slots: { extra: '<view class="my-extra">更多</view>' },
    })
    expect(wrapper.find('.lh-card__header .lh-card__extra .my-extra').exists()).toBe(true)
  })

  it('does not render the extra slot without a header', () => {
    // extra 是头部右侧操作区（与 plus 同构），头部不渲染时它无处安放
    const wrapper = mount(LhCard, { slots: { extra: '<view class="my-extra">更多</view>' } })
    expect(wrapper.find('.lh-card__extra').exists()).toBe(false)
  })

  it('applies shadow variants', () => {
    expect(mount(LhCard, { props: { shadow: 'hover' } }).classes()).toContain('lh-card--shadow-hover')
    expect(mount(LhCard, { props: { shadow: 'never' } }).classes()).toContain('lh-card--shadow-never')
  })

  it('renders loading placeholder instead of content', () => {
    const wrapper = mount(LhCard, {
      props: { loading: true },
      slots: { default: '内容' },
    })
    expect(wrapper.classes()).toContain('lh-card--loading')
    expect(wrapper.find('.lh-card__loading').exists()).toBe(true)
    expect(wrapper.findAll('.lh-card__loading-line')).toHaveLength(3)
    expect(wrapper.find('.lh-card__body').text()).not.toContain('内容')
  })

  it('is static and not clickable by default', () => {
    const wrapper = mount(LhCard)
    expect(wrapper.classes()).not.toContain('lh-card--clickable')
    expect(wrapper.attributes('role')).toBeUndefined()
    expect(wrapper.attributes('tabindex')).toBeUndefined()
    expect(wrapper.attributes('aria-busy')).toBeUndefined()
  })

  it('gains button semantics when clickable and emits click', async () => {
    const onClick = vi.fn()
    const wrapper = mount(LhCard, { props: { clickable: true, onClick } })
    expect(wrapper.classes()).toContain('lh-card--clickable')
    expect(wrapper.attributes('role')).toBe('button')
    expect(wrapper.attributes('tabindex')).toBe('0')

    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click when not clickable', async () => {
    const wrapper = mount(LhCard)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('activates via keyboard only when interactive (H5)', async () => {
    const wrapper = mount(LhCard, { props: { clickable: true } })
    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('click')).toHaveLength(1)

    // loading 态不可交互
    const loading = mount(LhCard, { props: { clickable: true, loading: true } })
    await loading.trigger('keydown', { key: 'Enter' })
    expect(loading.emitted('click')).toBeUndefined()
  })

  it('applies component themeVars as css vars on root', () => {
    const wrapper = mount(LhCard, {
      props: { themeVars: { 'card-bg': '#2B4C7C' } },
    })
    expect(wrapper.attributes('style')).toContain('--lh-card-bg: #2B4C7C')
  })

  it('passes customClass through to root', () => {
    expect(mount(LhCard, { props: { customClass: 'my-card' } }).classes()).toContain('my-card')
  })
})
