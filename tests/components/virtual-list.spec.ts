import { describe, expect, it, vi, afterEach } from 'vitest'
import { mount } from '../mount'
import { nextTick } from 'vue'
import LhVirtualList from '../../src/components/lh-virtual-list/lh-virtual-list.vue'

/**
 * VirtualList 虚拟列表测试（H5 语义）
 *
 * 区间算法（computeRange / buildVirtualItems / findVirtualRange）的边界
 * 用例在 share 仓，这里验证「容器渲染 + 滚动驱动窗口 + 项高」的胶水行为。
 * H5 分支用模板 ref 的 clientHeight 量视口（jsdom 无真实布局，
 * 通过 spy getBoundingClientRect 提供容器高度）。
 */
const data = Array.from({ length: 1000 }, (_, i) => ({ id: i, label: `项 ${i}` }))

function setRootRect(rect: { height: number; width?: number }) {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(rect as DOMRect)
}

function setClientHeight(value: number) {
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(value)
}

/** 触发容器的 scroll 事件（H5 分支取 target.scrollTop） */
async function scrollTo(wrapper: ReturnType<typeof mount>, scrollTop: number) {
  const root = wrapper.find('.lh-virtual-list').element
  vi.spyOn(root, 'scrollTop', 'get').mockReturnValue(scrollTop)
  root.dispatchEvent(new Event('scroll', { bubbles: false }))
  await nextTick()
}

describe('LhVirtualList', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    // attachTo 挂载的组件留在 body 上，用例间清理掉
    document.body.innerHTML = ''
  })

  it('renders only the visible window plus overscan for fixed heights', async () => {
    setRootRect({ height: 300 })
    setClientHeight(300)
    const wrapper = mount(LhVirtualList, {
      attachTo: document.body,
      props: { data, height: 300, itemHeight: 50 },
      slots: {
        default: ({ index }: { item: { label: string }; index: number }) => `行 ${index}`,
      },
    })
    await nextTick()
    await nextTick()

    const items = wrapper.findAll('.lh-virtual-list__item')
    // 视口 300 / 项高 50 = 6 可见 + 两侧 overscan(2) = 最多 10 项，
    // 千条数据下绝不能全量渲染
    expect(items.length).toBeLessThanOrEqual(10)
    expect(items.length).toBeGreaterThanOrEqual(6)
    // 幻影总高 = 全量高度
    expect(wrapper.find('.lh-virtual-list__phantom').attributes('style')).toContain('height: 50000px')
  })

  it('moves the window offset when scrolling', async () => {
    setRootRect({ height: 300 })
    setClientHeight(300)
    const wrapper = mount(LhVirtualList, {
      attachTo: document.body,
      props: { data, height: 300, itemHeight: 50 },
      slots: {
        default: ({ index }: { index: number }) => `行 ${index}`,
      },
    })
    await nextTick()

    await scrollTo(wrapper, 1000)
    const items = wrapper.findAll('.lh-virtual-list__item')
    expect(items.length).toBeGreaterThan(0)
    // 窗口 translateY 跟随：滚动 1000 时窗口起点约在 20 项（overscan 回退）
    const windowStyle = wrapper.find('.lh-virtual-list__window').attributes('style') ?? ''
    expect(windowStyle).toContain('translateY')
    // 首屏渲染的下标区间在 1000/50=20 附近
    const firstText = items[0].text()
    expect(Number.parseInt(firstText.replace('行 ', ''), 10)).toBeGreaterThanOrEqual(18)
    expect(Number.parseInt(firstText.replace('行 ', ''), 10)).toBeLessThanOrEqual(20)
  })

  it('applies itemHeight to each item element', async () => {
    setRootRect({ height: 200 })
    setClientHeight(200)
    const wrapper = mount(LhVirtualList, {
      attachTo: document.body,
      props: { data, height: 200, itemHeight: 40 },
      slots: { default: ({ index }: { index: number }) => `行 ${index}` },
    })
    await nextTick()
    const style = wrapper.find('.lh-virtual-list__item').attributes('style') ?? ''
    expect(style).toContain('height: 40px')
  })

  it('supports dynamic heights via declarative itemSize', async () => {
    setRootRect({ height: 200 })
    setClientHeight(200)
    const wrapper = mount(LhVirtualList, {
      attachTo: document.body,
      props: {
        data,
        height: 200,
        itemSize: (index: number) => 40 + (index % 3) * 20,
      },
      slots: { default: ({ index }: { index: number }) => `行 ${index}` },
    })
    await nextTick()
    // 动态高度走的 buildVirtualItems + findVirtualRange，首项高度按 sizes[0] = 40
    const style = wrapper.find('.lh-virtual-list__item').attributes('style') ?? ''
    expect(style).toContain('height: 40px')
    // 第二项 60px
    const items = wrapper.findAll('.lh-virtual-list__item')
    if (items[1]) {
      expect(items[1].attributes('style')).toContain('height: 60px')
    }
  })

  it('applies container height and sx to root style', () => {
    const wrapper = mount(LhVirtualList, {
      attachTo: document.body,
      props: { data, height: 240, sx: { mt: '10px' } },
      slots: { default: ({ index }: { index: number }) => `行 ${index}` },
    })
    const style = wrapper.find('.lh-virtual-list').attributes('style') ?? ''
    expect(style).toContain('height: 240px')
    expect(style).toContain('margin-top: 10px')
  })
})
