import type { LhSxProps } from '@lh-ui/share/core/shared'

/**
 * Row 栅格容器 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - `<div>` 换成 `<view>`（WXSS 标签选择器禁用，样式靠 `lh-row*` 类名生效）
 * - 增加 `customClass`：uni-app 端自定义类名无法穿透 styleIsolation，统一走 prop 透传
 * - gutter 的负外边距、justify / align 类名映射与 plus 完全一致（复用 share core 纯函数）
 */
export interface LhRowProps {
  /** 主轴上排列 */
  justify?: LhRowJustify
  /** 交叉轴上对齐 */
  align?: LhRowAlign
  /** 列间距（px 或 [横向, 纵向]） */
  gutter?: number | [number, number]
  /** 是否换行 */
  wrap?: boolean
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** 子元素主轴上排列 */
export type LhRowJustify = 'start' | 'center' | 'end' | 'space-between' | 'space-around'

/** 子元素交叉轴上对齐 */
export type LhRowAlign = 'top' | 'middle' | 'bottom'

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhRowResolvedProps = LhRowProps & {
  justify: LhRowJustify
  align: LhRowAlign
  gutter: number | [number, number]
  wrap: boolean
}
