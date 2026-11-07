import type { LhSxProps } from '@lh-ui/share/core/shared'

export interface LhBacktopProps {
  /**
   * H5 滚动容器选择器（默认视口）。
   * 小程序端无法自行订阅 scroll-view 滚动，改由 scrollTop prop 注入，
   * 本属性在 MP 端仅用作「锚定 scroll-view」的标记（决定回顶走事件契约还是页面级滚动）。
   */
  target?: string
  /**
   * 滚动位置注入（MP 必需）：scroll-view 的 scroll 事件 detail.scrollTop。
   * H5 端不传时自动监听 window / target 的 scroll 事件。
   */
  scrollTop?: number
  /** 滚动多少像素后出现 */
  visibilityHeight?: number
  /** 距右侧偏移 px */
  right?: number
  /** 距底部偏移 px */
  bottom?: number
  /** 是否平滑滚动 */
  smooth?: boolean
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** withDefaults 之后的运行时默认值契约 */
export type LhBacktopResolvedProps = LhBacktopProps & {
  visibilityHeight: number
  right: number
  bottom: number
  smooth: boolean
}
