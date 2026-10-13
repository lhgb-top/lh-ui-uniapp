import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import LhSkeleton from '../../src/components/lh-skeleton/lh-skeleton.vue'
import LhSkeletonItem from '../../src/components/lh-skeleton-item/lh-skeleton-item.vue'

describe('LhSkeleton', () => {
  it('renders placeholder rows while loading', () => {
    const wrapper = mount(LhSkeleton)
    expect(wrapper.classes()).toContain('lh-skeleton')
    expect(wrapper.classes()).toContain('lh-skeleton--animated')
    expect(wrapper.findAll('.lh-skeleton-item--text')).toHaveLength(3)
  })

  it('renders default slot when not loading', () => {
    const wrapper = mount(LhSkeleton, {
      props: { loading: false },
      slots: { default: '真实内容' },
    })
    expect(wrapper.find('.lh-skeleton').exists()).toBe(false)
    expect(wrapper.text()).toBe('真实内容')
  })

  it('honors rows count with last row shortened', () => {
    const wrapper = mount(LhSkeleton, { props: { rows: 4 } })
    const items = wrapper.findAll('.lh-skeleton-item--text')
    expect(items).toHaveLength(4)
    expect(items[3].attributes('style')).toContain('width: 60%')
    expect(items[0].attributes('style')).toContain('width: 100%')
  })

  it('renders avatar placeholder and container class', () => {
    const wrapper = mount(LhSkeleton, { props: { avatar: true } })
    expect(wrapper.classes()).toContain('lh-skeleton--with-avatar')
    expect(wrapper.find('.lh-skeleton__avatar').classes()).toContain('lh-skeleton-item--circle')
  })

  it('toggles animated class', () => {
    expect(mount(LhSkeleton, { props: { animated: false } }).classes()).not.toContain(
      'lh-skeleton--animated',
    )
  })

  it('marks the busy region with aria-busy', () => {
    expect(mount(LhSkeleton).attributes('aria-busy')).toBe('true')
  })
})

describe('LhSkeletonItem', () => {
  it('renders variant and animated classes', () => {
    const wrapper = mount(LhSkeletonItem, { props: { variant: 'rect' } })
    expect(wrapper.classes()).toContain('lh-skeleton-item')
    expect(wrapper.classes()).toContain('lh-skeleton-item--rect')
    expect(wrapper.classes()).toContain('lh-skeleton-item--animated')
  })

  it('hides from assistive tech', () => {
    expect(mount(LhSkeletonItem).attributes('aria-hidden')).toBe('true')
  })

  it('passes customClass through to root', () => {
    expect(mount(LhSkeletonItem, { props: { customClass: 'my-item' } }).classes()).toContain(
      'my-item',
    )
  })
})
