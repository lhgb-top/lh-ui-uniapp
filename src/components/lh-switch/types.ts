import type { LhComponentSize, LhSxProps } from '@lh-ui/share/core/shared'

/**
 * Switch 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】MP 无原生 switch 样式定制能力，用 view 自绘滑块以保证视觉一致。
 */
export interface LhSwitchProps {
  modelValue?: boolean
  disabled?: boolean
  loading?: boolean
  name?: string
  size?: LhSwitchSize
  activeText?: string
  inactiveText?: string
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export type LhSwitchSize = LhComponentSize

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhSwitchResolvedProps = LhSwitchProps & {
  modelValue: boolean
  disabled: boolean
  loading: boolean
  name: string
  size: LhComponentSize
  activeText: string
  inactiveText: string
}
