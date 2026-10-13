/**
 * H5 锁定页面滚动（dialog 等弹层使用）
 *
 * 小程序无 document.body，本能力仅 H5 可用。调用点须由条件编译守卫
 * （组件里 `#ifdef H5` 包裹），MP 端不会执行到本模块的函数体；
 * 调用点被 uni 编译链剔除后，未引用的导入会被摇掉，MP 包不含死代码。
 *
 * 【复用 share】滚动条宽度走 share 的 getScrollbarWidth（内部已有
 * typeof window 守卫，MP 端返回 0，双保险）。
 */
import { getScrollbarWidth } from '@lh-ui/share/utils'

/**
 * 锁定 body 滚动并补偿滚动条宽度，返回解除锁定的函数。
 *
 * 弹层打开时调一次拿 restore，关闭与组件卸载时调一次。
 */
export function lockLhBodyScroll(): () => void {
  const scrollbarWidth = getScrollbarWidth()

  const restore = () => {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  }

  document.body.style.overflow = 'hidden'
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`
  }

  return restore
}
