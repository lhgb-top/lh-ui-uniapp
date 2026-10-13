import type { LhTagType } from '@lh-ui/share/core/tag'
import type { LhComponentSize, LhSxProps } from '@lh-ui/share/core/shared'

/**
 * Tag 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】关闭按钮内的内联 svg 换成 lh-icon（iconfont）。
 */
export interface LhTagProps {
  type?: LhTagType
  size?: LhTagSize
  closable?: boolean
  disabled?: boolean
  round?: boolean
  hit?: boolean
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export type LhTagSize = LhComponentSize

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhTagResolvedProps = LhTagProps & {
  type: LhTagType
  size: LhComponentSize
  closable: boolean
  disabled: boolean
  round: boolean
  hit: boolean
}
