/**
 * H5 锁定页面滚动（dialog 等弹层使用）
 *
 * 小程序无 document.body，本能力仅 H5 可用。调用点须由条件编译守卫
 * （组件里 `#ifdef H5` 包裹），MP 端不会执行到本模块的函数体；
 * 调用点被 uni 编译链剔除后，未引用的导入会被摇掉，MP 包不含死代码。
 *
 * 【复用 share】滚动锁走 share 的引用计数（`lockScrollTarget` /
 * `unlockScrollTarget`）——与 plus / vue2 / react 的弹层族共用同一把锁，
 * 多弹层叠加时先关者不提前解锁、后关者不按过期快照锁死。滚动条宽度走
 * share 的 getScrollbarWidth（内部已有 typeof window 守卫，MP 端返回 0）。
 */
import { getScrollbarWidth } from '@lh-ui/share/utils'
import {
  lockScrollTarget,
  unlockScrollTarget,
  scrollLockCount,
} from '@lh-ui/share/core/shared/scroll-lock'

/**
 * 锁定 body 滚动并补偿滚动条宽度，返回解除锁定的函数。
 *
 * 弹层打开时调一次拿 restore，关闭与组件卸载时调一次。
 * 滚动条宽度补偿只在首个锁（计数 0 → 1）时写入：多弹层叠加时重复补偿
 * 会让 paddingRight 叠加错位；引用计数归零（body 真正解锁）时才清除。
 */
export function lockLhBodyScroll(): () => void {
  const wasLocked = scrollLockCount(document.body) > 0
  const scrollbarWidth = getScrollbarWidth()

  lockScrollTarget(document.body)
  if (!wasLocked && scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`
  }

  const restore = () => {
    unlockScrollTarget(document.body)
    // 计数归零才清补偿；body 已完全解锁时 scrollLockCount 为 0
    if (scrollLockCount(document.body) === 0) {
      document.body.style.paddingRight = ''
    }
  }

  return restore
}
