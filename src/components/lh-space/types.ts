import type { LhSpaceAlignment, LhSpaceSizeInput } from '@lh-ui/share/core/space'
import type { LhSxProps } from '@lh-ui/share/core/shared'

/**
 * Space 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】无：零 DOM 适配，间距完全依赖 CSS gap（两端 flex 均支持）。
 */
export interface LhSpaceProps {
  /** 排列方向 */
  direction?: 'horizontal' | 'vertical'
  /** 间距：预设档位 / 像素数字 / [水平, 垂直] */
  size?: LhSpaceSizeInput
  /** 是否允许换行（仅水平方向） */
  wrap?: boolean
  /** 对齐方式 */
  alignment?: LhSpaceAlignment
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhSpaceResolvedProps = LhSpaceProps & {
  direction: 'horizontal' | 'vertical'
  size: LhSpaceSizeInput
  wrap: boolean
  alignment: LhSpaceAlignment
}
