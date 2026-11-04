import type { LhSxProps } from '@lh-ui/share/core/shared'

/**
 * Rate 评分 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - 增加 `customClass`：uni-app 端自定义类名无法穿透 styleIsolation，统一走 prop 透传
 * - 半星命中依赖 offsetX，仅 H5 生效（MP 无该字段，点击退化整星，见 logic.ts）
 */
export interface LhRateProps {
  /** 当前评分（受控 v-model） */
  modelValue?: number
  /** 星数上限 */
  max?: number
  /** 允许半星 */
  allowHalf?: boolean
  /** 只读（输出星级文本供屏读） */
  readonly?: boolean
  disabled?: boolean
  /** 自定义字符（默认 ★） */
  character?: string
  /** 显示分数文本 */
  showScore?: boolean
  /** 分数模板（{n} 占位） */
  scoreTemplate?: string
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhRateResolvedProps = LhRateProps & {
  modelValue: number
  max: number
  allowHalf: boolean
  readonly: boolean
  disabled: boolean
  showScore: boolean
}
