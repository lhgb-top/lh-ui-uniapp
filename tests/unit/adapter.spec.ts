import { describe, expect, it, vi, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { getLhRect, getSingleLhRect } from '../../src/adapter/getRect'
import { LH_IS_H5, getLhWindowInfo, compareLhVersion } from '../../src/adapter/platform'
import { lockLhBodyScroll } from '../../src/adapter/lock-scroll'
import {
  subscribeLhScroll,
  scrollToLhTop,
  scrollToLhSelector,
} from '../../src/adapter/scroll'

/**
 * adapter 层直测（H5 语义）
 *
 * 组件 spec 多以 vi.mock 替身跳过 adapter 实现，行覆盖空档在此补齐。
 * MP 分支（createSelectorQuery / pageScrollTo / no-op 订阅）由条件编译
 * 插件裁掉，属 build:mp-weixin 的验证范围。
 */

describe('adapter/platform', () => {
  it('exposes compile-time platform constants', () => {
    // vitest 按 H5 目标编译：H5 常量为 true，MP 常量为 false
    expect(LH_IS_H5).toBe(true)
  })

  it('getLhWindowInfo reads window dimensions', () => {
    const viewport = getLhWindowInfo()
    expect(viewport.width).toBe(window.innerWidth)
    expect(viewport.height).toBe(window.innerHeight)
    expect(viewport.right).toBe(viewport.width)
    expect(viewport.bottom).toBe(viewport.height)
  })

  it('compareLhVersion compares dotted numeric versions', () => {
    expect(compareLhVersion('2.25.2', '2.25.2')).toBe(0)
    expect(compareLhVersion('2.25.10', '2.25.2')).toBe(1)
    expect(compareLhVersion('2.24.0', '2.25.2')).toBe(-1)
    // 缺段按 0 补齐
    expect(compareLhVersion('3', '2.9.9')).toBe(1)
  })
})

describe('adapter/getRect', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('measures a node via the H5 DOM path', async () => {
    const el = document.createElement('div')
    el.id = 'measure-target'
    el.style.width = '100px'
    el.style.height = '50px'
    document.body.appendChild(el)
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      top: 10,
      left: 20,
      width: 100,
      height: 50,
      right: 120,
      bottom: 60,
    } as DOMRect)

    const rect = await getSingleLhRect('#measure-target')
    expect(rect).toEqual({ top: 10, left: 20, width: 100, height: 50, right: 120, bottom: 60 })
  })

  it('normalizes rects missing right / bottom (SelectorQuery 形态)', async () => {
    const el = document.createElement('div')
    el.className = 'rect-nodes'
    document.body.appendChild(el)
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      top: 5,
      left: 8,
      width: 40,
      height: 20,
    } as DOMRect)

    const rect = await getSingleLhRect('.rect-nodes')
    // 缺 right / bottom 时由 left/width、top/height 补齐
    expect(rect.right).toBe(48)
    expect(rect.bottom).toBe(25)
  })

  it('rejects when no node matches (all mode)', async () => {
    await expect(getLhRect('.missing-node', { all: true })).rejects.toThrow('未找到节点')
  })

  it('rejects when no node matches (single mode)', async () => {
    await expect(getSingleLhRect('#missing-single')).rejects.toThrow('未找到节点')
  })

  it('measures all matching nodes in all mode', async () => {
    for (let i = 0; i < 3; i += 1) {
      const el = document.createElement('div')
      el.className = 'rect-all'
      document.body.appendChild(el)
      vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
        top: i,
        left: 0,
        width: 10,
        height: 10,
        right: 10,
        bottom: i + 10,
      } as DOMRect)
    }
    const rects = await getLhRect('.rect-all', { all: true })
    expect(Array.isArray(rects)).toBe(true)
    expect((rects as { top: number }[]).map((r) => r.top)).toEqual([0, 1, 2])
  })
})

describe('adapter/scroll', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('subscribes to window scroll and fires handler immediately', async () => {
    const handler = vi.fn()
    const unsubscribe = subscribeLhScroll(undefined, handler)
    // 订阅时先以当前 scrollY 触发一次（保证首测与 H5 首屏一致）
    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(window.scrollY)

    window.dispatchEvent(new Event('scroll'))
    expect(handler).toHaveBeenCalledTimes(2)

    unsubscribe()
    window.dispatchEvent(new Event('scroll'))
    expect(handler).toHaveBeenCalledTimes(2)
  })

  it('subscribes to a selector target and unsubscribes cleanly', async () => {
    const el = document.createElement('div')
    el.id = 'scroll-target'
    document.body.appendChild(el)
    const addSpy = vi.spyOn(el, 'addEventListener')
    const removeSpy = vi.spyOn(el, 'removeEventListener')

    const handler = vi.fn()
    const unsubscribe = subscribeLhScroll('#scroll-target', handler)
    // 被动监听（passive: true），订阅时先以当前 scrollTop 触发一次
    expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true })
    expect(handler).toHaveBeenCalledTimes(1)
    expect(removeSpy).not.toHaveBeenCalled()

    el.dispatchEvent(new Event('scroll'))
    expect(handler).toHaveBeenCalled()

    unsubscribe()
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
    document.body.innerHTML = ''
  })

  it('scrollToLhTop scrolls the window via share backToTop', async () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    scrollToLhTop({ smooth: true })
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    scrollToLhTop({ smooth: false })
    expect(scrollToSpy).toHaveBeenLastCalledWith({ top: 0, behavior: 'auto' })
  })

  it('scrollToLhTop is a no-op for a missing target element', () => {
    // resolveScrollTarget 对未命中的选择器回退 window，不抛错
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    expect(() => scrollToLhTop({ target: '#no-such-target', smooth: false })).not.toThrow()
    expect(scrollToSpy).toHaveBeenCalled()
  })

  it('scrollToLhSelector scrolls the matching element into view', async () => {
    const el = document.createElement('div')
    el.id = 'anchor-target'
    // jsdom 未实现 scrollIntoView，直接桩到元素上
    el.scrollIntoView = vi.fn()
    document.body.appendChild(el)

    scrollToLhSelector('#anchor-target', true)
    await nextTick()
    expect(el.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })

    scrollToLhSelector('#anchor-target', false)
    expect(el.scrollIntoView).toHaveBeenLastCalledWith({ behavior: 'auto', block: 'start' })
    document.body.innerHTML = ''
  })

  it('scrollToLhSelector tolerates a missing selector', () => {
    expect(() => scrollToLhSelector('#no-such-anchor', true)).not.toThrow()
  })
})

describe('adapter/lock-scroll', () => {
  afterEach(() => {
    document.body.style.paddingRight = ''
    document.body.style.overflow = ''
    vi.restoreAllMocks()
  })

  it('locks body scroll and restores on unlock (reference counting)', () => {
    const restore1 = lockLhBodyScroll()
    expect(document.body.style.overflow).not.toBe('')
    const lockedOverflow = document.body.style.overflow

    // 第二把锁叠加：不重复补偿 paddingRight，计数仍持锁
    const restore2 = lockLhBodyScroll()
    expect(document.body.style.overflow).toBe(lockedOverflow)

    // 先解锁一把：计数未归零，body 仍锁定
    restore1()
    expect(document.body.style.overflow).not.toBe('')

    // 最后一锁解除：body 真正解锁
    restore2()
    expect(document.body.style.overflow).toBe('')
  })
})
