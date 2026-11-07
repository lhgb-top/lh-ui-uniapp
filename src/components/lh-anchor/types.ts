import type { LhSxProps } from '@lh-ui/share/core/shared'
import type { LhAnchorItem } from '@lh-ui/share/core/anchor'

export interface LhAnchorProps {
  /** 锚点数据（支持子级） */
  items: LhAnchorItem[]
  /**
   * H5 滚动容器选择器（默认 window）。
   * 小程序端无法自行订阅 scroll-view 滚动，改由 scrollTop prop 注入；
   * 本属性在 MP 端仅用作「锚定 scroll-view」的标记（决定锚点定位走
   * 事件契约还是页面级 pageScrollTo）。
   */
  target?: string
  /**
   * 滚动位置注入（MP 必需）：scroll-view 的 scroll 事件 detail.scrollTop。
   * H5 端不传时自动监听 window / target 的 scroll 事件。
   */
  scrollTop?: number
  /** 锚点区域相对滚动容器顶部的偏移（用于联动判定） */
  offset?: number
  /** 排列方向 */
  direction?: 'vertical' | 'horizontal'
  /** 平滑滚动 */
  smooth?: boolean
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** withDefaults 之后的运行时默认值契约 */
export type LhAnchorResolvedProps = LhAnchorProps & {
  direction: 'vertical' | 'horizontal'
  smooth: boolean
  offset: number
}

export type { LhAnchorItem, LhFlatAnchorItem } from '@lh-ui/share/core/anchor'
