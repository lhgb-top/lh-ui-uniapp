import { describe, expect, it, vi, afterEach } from 'vitest'
import { mount } from '../mount'
import { nextTick } from 'vue'
import LhAnchor from '../../src/components/lh-anchor/lh-anchor.vue'

/**
 * Anchor 锚点导航测试（H5 语义）
 *
 * H5 锚点度量走 document.getElementById + getBoundingClientRect，模板点击
 * 走 scrollIntoView；MP 的 scrollTop 注入 / scroll-into-view 事件契约由
 * build:mp-weixin 验证。
 */

const items = [
  { id: 'a', title: '区块 A' },
  { id: 'b', title: '区块 B' },
  { id: 'c', title: '区块 C' },
]

const nestedItems = [
  { id: 'a', title: '区块 A' },
  {
    id: 'group',
    title: 'B 组',
    children: [
      { id: 'b', title: '区块 B' },
      { id: 'c', title: '区块 C' },
    ],
  },
]

/** 注册锚点节点：挂到 body 并桩好 rect / scrollIntoView（H5 度量走 getElementById，定位走 querySelector，两者都要命中） */
function stubAnchors(rects: Record<string, { top: number }>) {
  const elements: Record<string, HTMLElement> = {}
  const scrollIntoViews: Record<string, ReturnType<typeof vi.fn>> = {}
  for (const [id, rect] of Object.entries(rects)) {
    const el = document.createElement('div')
    el.id = id
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue(rect as DOMRect)
    // jsdom 未实现 scrollIntoView，直接桩到元素上（H5 定位契约的断言点）
    const fn = vi.fn()
    el.scrollIntoView = fn as unknown as (options?: boolean | ScrollIntoViewOptions) => void
    document.body.appendChild(el)
    elements[id] = el
    scrollIntoViews[id] = fn
  }
  return { elements, scrollIntoViews }
}

function cleanupAnchors() {
  document.body.innerHTML = ''
}

async function dispatchScroll() {
  window.dispatchEvent(new Event('scroll'))
  await nextTick()
}

describe('LhAnchor', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    cleanupAnchors()
  })

  it('flattens nested items into links with level classes', () => {
    const wrapper = mount(LhAnchor, { props: { items: nestedItems } })
    const links = wrapper.findAll('.lh-anchor__link')
    expect(links.map((l) => l.text())).toEqual(['区块 A', 'B 组', '区块 B', '区块 C'])
    // 深度：A → 0 级，group → 0 级，其子级 → 1 级（flattenAnchorItems 深度优先）
    expect(links[1].classes()).toContain('lh-anchor__link--level-0')
    expect(links[2].classes()).toContain('lh-anchor__link--level-1')
  })

  it('marks the first anchor active by default', () => {
    const wrapper = mount(LhAnchor, { props: { items } })
    expect(wrapper.find('.lh-anchor__link--active').text()).toBe('区块 A')
  })

  it('resolves active anchor on scroll via viewport offsets', async () => {
    // a 已完全滚出视口、b 占据视口顶部、c 尚在下方 → 活动项为 b
    stubAnchors({ a: { top: -400 }, b: { top: -100 }, c: { top: 300 } })
    const wrapper = mount(LhAnchor, { props: { items } })
    await dispatchScroll()
    expect(wrapper.emitted('change')?.[0]).toEqual(['b'])
    expect(wrapper.find('.lh-anchor__link--active').text()).toBe('区块 B')
  })

  it('honors offset threshold when resolving active anchor', async () => {
    // offset=350：c（top=300）也越过阈值线 → 活动项为 c
    stubAnchors({ a: { top: -400 }, b: { top: -100 }, c: { top: 300 } })
    const wrapper = mount(LhAnchor, { props: { items, offset: 350 } })
    await dispatchScroll()
    expect(wrapper.find('.lh-anchor__link--active').text()).toBe('区块 C')
  })

  it('emits click and scrolls the target into view on link tap', async () => {
    const { scrollIntoViews } = stubAnchors({ a: { top: 0 }, b: { top: 100 }, c: { top: 200 } })
    const wrapper = mount(LhAnchor, { props: { items } })

    await wrapper.findAll('.lh-anchor__link')[1].trigger('click')
    expect(wrapper.emitted('click')?.[0]).toEqual(['b'])
    expect(wrapper.emitted('change')).toContainEqual(['b'])
    // 锚点定位由 H5 分支驱动：scrollIntoView 打在目标锚点节点上
    expect(scrollIntoViews.a).not.toHaveBeenCalled()
    expect(scrollIntoViews.b).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
  })

  it('applies horizontal direction class', () => {
    const wrapper = mount(LhAnchor, {
      props: { items, direction: 'horizontal' },
    })
    expect(wrapper.find('.lh-anchor').classes()).toContain('lh-anchor--horizontal')
  })

  it('does not change active anchor when no anchor elements exist', async () => {
    // 无节点命中：updateActive 直接返回，活动项保持首个
    vi.spyOn(document, 'getElementById').mockReturnValue(null)
    const wrapper = mount(LhAnchor, { props: { items } })
    await dispatchScroll()
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(wrapper.find('.lh-anchor__link--active').text()).toBe('区块 A')
  })
})
