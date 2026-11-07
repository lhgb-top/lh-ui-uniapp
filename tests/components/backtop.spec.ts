import { describe, expect, it, vi, afterEach } from 'vitest'
import { mount } from '../mount'
import { nextTick } from 'vue'
import LhBacktop from '../../src/components/lh-backtop/lh-backtop.vue'

/**
 * BackTop 返回顶部测试（H5 语义）
 *
 * H5 滚动订阅走 adapter/scroll 的 window scroll 监听（vitest 条件编译保留的
 * 分支）；MP 的 scrollTop prop 注入路径由 build:mp-weixin 验证。
 * 滚动位置通过 spy window.scrollY 模拟，回顶命令 spy window.scrollTo。
 */
function setScrollY(value: number) {
  vi.spyOn(window, 'scrollY', 'get').mockReturnValue(value)
}

async function dispatchScroll() {
  window.dispatchEvent(new Event('scroll'))
  await nextTick()
}

describe('LhBacktop', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('is hidden below visibilityHeight', async () => {
    const wrapper = mount(LhBacktop, { props: { visibilityHeight: 200 } })
    setScrollY(0)
    await dispatchScroll()
    expect(wrapper.find('.lh-backtop').exists()).toBe(false)

    setScrollY(100)
    await dispatchScroll()
    expect(wrapper.find('.lh-backtop').exists()).toBe(false)
  })

  it('appears when scrolled past visibilityHeight with enter transition classes', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhBacktop, { props: { visibilityHeight: 200 } })
    setScrollY(250)
    await dispatchScroll()

    // enter 阶段先挂起始态类，下帧切 visible
    expect(wrapper.find('.lh-backtop').exists()).toBe(true)
    expect(wrapper.find('.lh-backtop').classes()).toContain('lh-backtop-fade-enter-from')

    await nextTick()
    expect(wrapper.find('.lh-backtop').classes()).not.toContain('lh-backtop-fade-enter-from')
    expect(wrapper.find('.lh-backtop').classes()).toContain('lh-backtop--visible')
    vi.useRealTimers()
  })

  it('leaves with transition classes and removes node after duration', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhBacktop, { props: { visibilityHeight: 200 } })
    setScrollY(250)
    await dispatchScroll()
    await nextTick()

    setScrollY(0)
    await dispatchScroll()
    expect(wrapper.find('.lh-backtop').classes()).toContain('lh-backtop-fade-leave-to')

    await vi.advanceTimersByTimeAsync(260)
    expect(wrapper.find('.lh-backtop').exists()).toBe(false)
    vi.useRealTimers()
  })

  it('emits click and scrolls to top on tap', async () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const wrapper = mount(LhBacktop, { props: { visibilityHeight: 200 } })
    setScrollY(300)
    await dispatchScroll()
    await nextTick()

    await wrapper.find('.lh-backtop').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
    // 回顶命令走 share 的 backToTop → window.scrollTo（H5 分支）
    expect(scrollToSpy).toHaveBeenCalled()
  })

  it('hides deterministically after smooth scroll back (target container final-event fallback)', async () => {
    vi.useFakeTimers()
    // 场景：容器当前 500，点击回顶后容器真实到顶，
    // 但个别 webview 的收尾 scroll 事件丢失——平滑动画后按真实位置兜底校正显隐
    const target = document.createElement('div')
    target.id = 'backtop-target'
    document.body.appendChild(target)
    let scrollTopValue = 500
    vi.spyOn(target, 'scrollTop', 'get').mockImplementation(() => scrollTopValue)
    // jsdom 的普通 div 无 scrollTo，直接桩上（模拟回顶把真实位置归零）
    target.scrollTo = () => {
      scrollTopValue = 0
    }

    const wrapper = mount(LhBacktop, {
      props: { visibilityHeight: 200, target: '#backtop-target' },
    })
    await nextTick()
    expect(wrapper.find('.lh-backtop').exists()).toBe(true)

    await wrapper.find('.lh-backtop').trigger('click')
    // 平滑滚动完成后兜底校正（350ms）→ 离开过渡（250ms）→ 摘除节点
    await vi.advanceTimersByTimeAsync(360)
    await nextTick()
    await vi.advanceTimersByTimeAsync(260)
    expect(wrapper.find('.lh-backtop').exists()).toBe(false)

    document.body.innerHTML = ''
    vi.useRealTimers()
  })

  it('renders default arrow-up icon and custom slot content', async () => {
    const wrapper = mount(LhBacktop, { props: { visibilityHeight: 200 } })
    setScrollY(300)
    await dispatchScroll()
    await nextTick()
    expect(wrapper.find('.lh-backtop .lh-icon').exists()).toBe(true)

    const custom = mount(LhBacktop, {
      props: { visibilityHeight: 200 },
      slots: { default: () => '自定义回顶' },
    })
    setScrollY(300)
    await dispatchScroll()
    await nextTick()
    expect(custom.find('.lh-backtop').text()).toContain('自定义回顶')
  })

  it('emits scrollend after scroll settles (debounced)', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LhBacktop, { props: { visibilityHeight: 200 } })
    setScrollY(300)
    await dispatchScroll()

    // 防抖窗口内不抛
    await vi.advanceTimersByTimeAsync(100)
    expect(wrapper.emitted('scrollend')).toBeUndefined()
    // 超过 LH_BACKTOP_SCROLLEND_DELAY（150ms）后抛出，携带滚动距离
    await vi.advanceTimersByTimeAsync(60)
    expect(wrapper.emitted('scrollend')?.[0]).toEqual([300])
    vi.useRealTimers()
  })

  it('applies right / bottom offsets to style', async () => {
    const wrapper = mount(LhBacktop, {
      props: { visibilityHeight: 200, right: 24, bottom: 32 },
    })
    setScrollY(300)
    await dispatchScroll()
    await nextTick()
    const style = wrapper.find('.lh-backtop').attributes('style') ?? ''
    expect(style).toContain('right: 24px')
    expect(style).toContain('bottom: 32px')
  })
})
