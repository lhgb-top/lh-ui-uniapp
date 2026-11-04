import type { LhDescriptionsItem } from '@lh-ui/share/core/descriptions'
import type { LhSxProps } from '@lh-ui/share/core/shared'

/**
 * Descriptions 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - plus 用 `<dl>/<dt>/<dd>` 语义标签，本仓换成 `<view>`（WXSS 标签选择器禁用，靠类名生效）
 * - 行布局由内联 flex + 百分比 basis 承载（与 plus 同一套计算），不依赖额外样式
 * - 行结构聚合逻辑与 plus 完全一致（复用 share core 纯函数 buildDescriptionRows）
 */
export interface LhDescriptionsProps {
  /** 描述列表标题 */
  title?: string
  /** 每行展示的条目列数 */
  column?: number
  /** 是否展示边框（带边框的表格布局） */
  border?: boolean
  /** 条目列表；label/value/span 三元组 */
  items: LhDescriptionsItem[]
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export type { LhDescriptionsItem }

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhDescriptionsResolvedProps = LhDescriptionsProps & {
  column: number
  border: boolean
  items: LhDescriptionsItem[]
}
