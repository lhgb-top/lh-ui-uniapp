import type { LhSxProps } from '@lh-ui/share/core/shared'

export interface LhAffixProps {
  /** 距视口顶部多少像素触发吸顶 */
  offsetTop?: number
  /** 距视口底部多少像素触发吸底（优先于 offsetTop） */
  offsetBottom?: number
  /**
   * H5 滚动监听容器选择器（默认视口）。
   * 小程序端无法自行订阅 scroll-view 滚动，改由 scrollTop prop 注入，
   * 本属性在 MP 端不生效（见组件文档「平台差异」）。
   */
  target?: string
  /**
   * 滚动位置注入（MP 必需）：scroll-view 的 scroll 事件 detail.scrollTop。
   * H5 端不传时自动监听 window / target 的 scroll 事件。
   */
  scrollTop?: number
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** withDefaults 之后的运行时默认值契约 */
export type LhAffixResolvedProps = LhAffixProps & {
  offsetTop: number
  offsetBottom: number
}
