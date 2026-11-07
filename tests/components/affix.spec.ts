import { describe, expect, it, vi, afterEach } from 'vitest'
import { mount } from '../mount'
import { nextTick } from 'vue'
import LhAffix from '../../src/components/lh-affix/lh-affix.vue'

/**
 * Affix 固定测试（H5 语义）
 *
 * 占位度量走 getSingleLhRect（同线上路径），照仓内弹层 spec 的套路打桩成
 * 受控矩形；MP 分支（scrollTop prop 注入 + createSelectorQuery）被 vitest
 * 条件编译插件裁掉，MP 产物由 build:mp-weixin 验证。
 */
const { rectState } = vi.hoisted(() => ({
  rectState: {
    top: 100,
    bottom: 140,
    width: 200,
    height: 40,
  },
}))

vi.mock('@/adapter/getRect', () => ({
  getSingleLhRect: async () => ({ ...rectState }),
}))

const slots = {
  default: () => '吸顶内容',
}

function setPlaceholderRect(rect: { top: number; bottom: number; width: number; height: number }) {
  Object.assign(rectState, rect)
}

async function dispatchScroll() {
  window.dispatchEvent(new Event('scroll'))
  await nextTick()
  await nextTick()
}

describe('LhAffix', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders slot content in placeholder structure', () => {
    const wrapper = mount(LhAffix, { slots })
    expect(wrapper.find('.lh-affix-placeholder').exists()).toBe(true)
    expect(wrapper.find('.lh-affix').text()).toContain('吸顶内容')
    // 初始未固定：无 --fixed 修饰类、无占位高度
    expect(wrapper.find('.lh-affix').classes()).not.toContain('lh-affix--fixed')
    expect(wrapper.find('.lh-affix-placeholder').attributes('style')).toBeUndefined()
  })

  it('turns fixed when placeholder scrolls past offsetTop', async () => {
    const wrapper = mount(LhAffix, {
      props: { offsetTop: 80 },
      slots,
    })
    // 占位顶部越过 80px 阈值 → 固定
    setPlaceholderRect({ top: 40, bottom: 80, width: 320, height: 60 })
    await dispatchScroll()

    expect(wrapper.find('.lh-affix').classes()).toContain('lh-affix--fixed')
    // 固定后占位用自然高度撑住原位置
    expect(wrapper.find('.lh-affix-placeholder').attributes('style')).toContain('height: 60px')
    // 固定样式来自 share 的 getAffixFixedStyle
    const style = wrapper.find('.lh-affix').attributes('style') ?? ''
    expect(style).toContain('position: fixed')
    expect(style).toContain('top: 80px')
    expect(style).toContain('width: 320px')
  })

  it('emits change with the fixed state', async () => {
    // 挂载前先装好 stub（mount 时就会首测一次）：占位在 50px 阈值线下方 → 未固定
    setPlaceholderRect({ top: 100, bottom: 140, width: 200, height: 40 })
    const wrapper = mount(LhAffix, {
      props: { offsetTop: 50 },
      slots,
    })
    await dispatchScroll()
    expect(wrapper.find('.lh-affix').classes()).not.toContain('lh-affix--fixed')
    expect(wrapper.emitted('change')).toBeUndefined()

    // 滚到阈值线上方 → 固定，抛出 change(true)
    setPlaceholderRect({ top: -10, bottom: 30, width: 200, height: 40 })
    await dispatchScroll()
    expect(wrapper.emitted('change')?.[0]).toEqual([true])

    // 滚回下方 → 解除固定，抛出 change(false)
    setPlaceholderRect({ top: 100, bottom: 140, width: 200, height: 40 })
    await dispatchScroll()
    expect(wrapper.emitted('change')?.[1]).toEqual([false])
  })

  it('offsetBottom mode judges against viewport bottom', async () => {
    const wrapper = mount(LhAffix, {
      props: { offsetBottom: 100 },
      slots,
    })
    // 底部越过（视口高 768 - 100 = 668）→ 固定，样式走 bottom
    setPlaceholderRect({ top: 700, bottom: 740, width: 200, height: 40 })
    await dispatchScroll()

    expect(wrapper.find('.lh-affix').classes()).toContain('lh-affix--fixed')
    const style = wrapper.find('.lh-affix').attributes('style') ?? ''
    expect(style).toContain('bottom: 100px')
    expect(style).toContain('top: auto')
  })

  it('unsubscribes scroll listener on unmount', async () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const wrapper = mount(LhAffix, {
      props: { offsetTop: 0 },
      slots,
    })
    setPlaceholderRect({ top: 0, bottom: 40, width: 200, height: 40 })
    wrapper.unmount()
    expect(removeSpy).toHaveBeenCalled()
  })
})
