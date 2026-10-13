import type { LhBadgeType } from '@lh-ui/share/core/badge'
import type { LhComponentSize, LhSxProps } from '@lh-ui/share/core/shared'

/**
 * Badge 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - `<sup>` 换成 `<view>`，内部文字用 `<text>`（WXSS 标签选择器禁用，靠类名生效）
 * - 进出动画不依赖 Vue 内置 `<transition>`（小程序 transitionend / 过渡不可靠），
 *   改 class 切换 + setTimeout 对齐 scss 里 lh-badge-zoom 的 0.15s 时长
 */
export interface LhBadgeProps {
  type?: LhBadgeType
  value?: string | number
  size?: LhBadgeSize
  max?: number
  isDot?: boolean
  hidden?: boolean
  offset?: [number, number]
  showZero?: boolean
  content?: string
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export type LhBadgeSize = LhComponentSize

export type { LhBadgeType }

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhBadgeResolvedProps = LhBadgeProps & {
  type: LhBadgeType
  size: LhBadgeSize
  max: number
  isDot: boolean
  hidden: boolean
  showZero: boolean
}
