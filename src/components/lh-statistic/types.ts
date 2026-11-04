import type { LhSxProps } from '@lh-ui/share/core/shared'

/**
 * Statistic 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】纯展示组件，全端可用，无平台 API 依赖：
 * - `<div>/<span>` 全部换成 `<view>`（WXSS 标签选择器禁用，靠类名生效）
 * - 精度 / 千位分隔 / 超大数字符串路径完全复用 share core 纯函数（formatStatisticValue）
 */
export interface LhStatisticProps {
  /** 数值标题（展示在数值上方） */
  title?: string
  /** 统计数值；字符串形式可承载超大数或带符号文本 */
  value: number | string
  /** 小数精度 */
  precision?: number
  /** 千位分隔符；空串关闭分组 */
  separator?: string
  /** 数值前缀，如货币符号 */
  prefix?: string
  /** 数值后缀，如单位 */
  suffix?: string
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhStatisticResolvedProps = LhStatisticProps & {
  value: number | string
  precision: number
  separator: string
}
