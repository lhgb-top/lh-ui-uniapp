import type { LhProgressStatus, LhProgressType } from '@lh-ui/share/core/progress'
import type { LhSxProps } from '@lh-ui/share/core/shared'

/**
 * Progress 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】首版仅实现 line 型：types 保留 'circle' 取值保 API 对齐，
 * 但传 circle 时按 line 渲染并开发期告警一次（见 logic）。
 * circle 的 svg 环留二期（WXSS 对 svg 支持有限，需另做条件编译方案）。
 */
export interface LhProgressProps {
  /** 进度百分比 0-100（超出会自动钳制） */
  percentage: number
  type?: LhProgressType
  status?: LhProgressStatus
  /** 进度条颜色：字符串或按百分比返回颜色的函数 */
  color?: string | ((percentage: number) => string)
  /** 线条宽度 px（line 为高度，circle 为描边宽度） */
  strokeWidth?: number
  /** 圆形模式画布宽度 px */
  width?: number
  showText?: boolean
  /** 自定义文字格式化 */
  format?: (percentage: number) => string
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export type { LhProgressStatus, LhProgressType }

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhProgressResolvedProps = LhProgressProps & {
  type: LhProgressType
  status: LhProgressStatus
  strokeWidth: number
  width: number
  showText: boolean
}
