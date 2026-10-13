import type { LhDividerDirection, LhDividerLabelPosition } from '@lh-ui/share/core/divider'
import type { LhSxProps } from '@lh-ui/share/core/shared'

/**
 * Divider 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】无：伪元素分割线两端均支持，文案由 `<text>` 承载。
 */
export interface LhDividerProps {
  /** 分割线方向 */
  direction?: LhDividerDirection
  /** 是否虚线 */
  dashed?: boolean
  /** 带文案时的对齐位置 */
  labelPosition?: LhDividerLabelPosition
  /** 边框样式（如 'solid' / 'dashed' / 'dotted'），优先于 dashed */
  borderStyle?: string
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhDividerResolvedProps = LhDividerProps & {
  direction: LhDividerDirection
  dashed: boolean
  labelPosition: LhDividerLabelPosition
}
