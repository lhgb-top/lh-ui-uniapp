import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import LhRootPortal from '../../src/components/lh-root-portal/lh-root-portal.vue'

/**
 * root-portal 行为 spec（测试目标平台固定 H5：走 teleport 分支，
 * mount.ts 把 teleport stub 成原位渲染，内容可直接断言）
 */
describe('LhRootPortal', () => {
  it('renders its slot inside the fixed container', () => {
    const wrapper = mount(LhRootPortal, { slots: { default: '弹层内容' } })
    expect(wrapper.find('.lh-root-portal').exists()).toBe(true)
    expect(wrapper.find('.lh-root-portal').text()).toBe('弹层内容')
  })

  it('applies the fixed positioning style', () => {
    const style = mount(LhRootPortal).find('.lh-root-portal').attributes('style') ?? ''
    expect(style).toContain('position: fixed')
    expect(style).toContain('width: 100%')
    expect(style).toContain('height: 100%')
    expect(style).toContain('pointer-events: none')
  })

  it('uses the given zIndex', () => {
    expect(
      mount(LhRootPortal, { props: { zIndex: 3000 } })
        .find('.lh-root-portal')
        .attributes('style'),
    ).toContain('z-index: 3000')
  })

  it('auto-assigns an increasing zIndex when omitted', () => {
    const first = mount(LhRootPortal).find('.lh-root-portal').attributes('style') ?? ''
    const second = mount(LhRootPortal).find('.lh-root-portal').attributes('style') ?? ''
    const a = Number(/z-index: (\d+)/.exec(first)?.[1])
    const b = Number(/z-index: (\d+)/.exec(second)?.[1])
    expect(a).toBeGreaterThanOrEqual(2000)
    expect(b).toBeGreaterThan(a)
  })
})
