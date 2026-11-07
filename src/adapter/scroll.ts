/**
 * 滚动适配 —— 滚动词（订阅 / 滚动命令）的统一收口
 *
 * 【为什么需要】affix / backtop / anchor 依赖页面滚动语义：
 * H5 有 document 滚动根、scrollIntoView、元素 scroll 监听；小程序都没有——
 * scroll 事件只能绑在 scroll-view 标签上，组件自身无法订阅。
 * 组件层只调本模块，不直接调 uni API（红线 4）。
 *
 * 【平台差异分工】
 * - H5：组件自行订阅 window / 目标容器的 scroll 事件（subscribeLhScroll），
 *   回顶 / 滚到锚点直接操作 DOM（复用 share 的 backToTop 纯函数）。
 * - MP：滚动位置改由使用者把 scroll-view 的 scroll 事件 detail.scrollTop
 *   经 props 注入组件（这也是为什么这三个组件都有 scrollTop prop）；
 *   滚动命令本模块提供 uni.pageScrollTo（页面级滚动），
 *   scroll-view 内滚动由组件 emit 事件契约（update:scrollTop /
 *   update:scroll-into-view），使用者绑到 scroll-view 的对应属性。
 *
 * 注意：本文件里的条件编译指令必须独占一行；注释正文不要出现指令字面量。
 */
import { backToTop, resolveScrollTarget } from '@lh-ui/share/core/backtop'

/** 滚动容器目标：选择器或直接元素（H5 语义；MP 由 props 注入不经过本类型） */
export type LhScrollTarget = string | HTMLElement

/** scroll 订阅的默认目标（不传 target 时）由调用方决定，这里只关心 H5 分支 */
const NOOP_UNSUBSCRIBE = () => {}

/**
 * 订阅滚动位置变化（仅 H5 有意义）。
 *
 * MP 端组件无法自行订阅 scroll-view 的 scroll 事件：scroll-view 是使用者的
 * 节点，事件只能绑在它的标签上。MP 产物里本函数为 no-op——组件层应另用
 * LH_IS_H5 编译期守卫直接不调用（守卫原则：MP 包里不该有死代码），
 * 此处的 no-op 分支只是防御误调，不构成运行时降级。
 *
 * @param target 滚动容器选择器（不传监听 window）
 * @param handler 滚动回调（立即以当前 scrollTop 触发一次）
 * @returns 取消订阅函数
 */
export function subscribeLhScroll(
  target: LhScrollTarget | undefined,
  handler: (scrollTop: number) => void,
): () => void {
  // #ifdef H5
  {
    const listenerTarget = resolveScrollTarget(target)
    const listener = () => handler(listenerTarget instanceof HTMLElement ? listenerTarget.scrollTop : (window.scrollY ?? document.documentElement.scrollTop ?? 0))
    listenerTarget.addEventListener('scroll', listener, { passive: true })
    window.addEventListener('resize', listener)
    listener()
    return () => {
      listenerTarget.removeEventListener('scroll', listener)
      window.removeEventListener('resize', listener)
    }
  }
  // #endif

  // #ifndef H5
  return NOOP_UNSUBSCRIBE
  // #endif
}

/**
 * 滚到顶部。
 * H5：走 share 的 backToTop（原生平滑滚动 + reduced-motion 降级）。
 * MP：页面级滚动用 uni.pageScrollTo；scroll-view 内的回顶走组件的
 * 事件契约（emit update:scrollTop(0) 由使用者绑定），调用方自行判断。
 *
 * @param options target H5 滚动容器选择器；smooth 是否平滑
 */
export function scrollToLhTop(options: { target?: LhScrollTarget; smooth?: boolean }): void {
  const { target, smooth = true } = options

  // #ifdef H5
  {
    backToTop(resolveScrollTarget(target), smooth)
    return
  }
  // #endif

  // #ifndef H5
  {
    // duration 单位 ms（uni 契约）；0 为无动画。reduced-motion 在小程序端
    // 无对应媒体查询，直接按 smooth 走
    uni.pageScrollTo({ scrollTop: 0, duration: smooth ? 300 : 0 })
  }
  // #endif
}

/**
 * 滚到选择器命中的节点（锚点定位）。
 * H5：scrollIntoView（平滑走 behavior: 'smooth' + reduced-motion 降级由浏览器处理）。
 * MP：页面级用 uni.pageScrollTo 的 selector；scroll-view 内同样走组件的
 * 事件契约（emit update:scroll-into-view(id)）。
 */
export function scrollToLhSelector(selector: string, smooth = true): void {
  // #ifdef H5
  {
    const el = document.querySelector<HTMLElement>(selector)
    if (!el) return
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
    return
  }
  // #endif

  // #ifndef H5
  {
    uni.pageScrollTo({ selector, duration: smooth ? 300 : 0 })
  }
  // #endif
}
