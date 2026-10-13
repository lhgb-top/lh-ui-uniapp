import type { LhSkeletonVariant } from '@lh-ui/share/core/skeleton'
import type { LhSxProps } from '@lh-ui/share/core/shared'

/**
 * Skeleton 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】无：@keyframes 流光 WXSS 支持，`<div>` → `<view>`。
 */
export interface LhSkeletonProps {
  /** 是否处于加载态（false 时渲染 default 插槽的真实内容） */
  loading?: boolean
  /** 文本行数 */
  rows?: number
  /** 是否包含圆形头像占位 */
  avatar?: boolean
  /** 是否开启动画 */
  animated?: boolean
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/**
 * SkeletonItem 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】无。无独立样式源，产物复用 lh-skeleton 的 style.css。
 */
export interface LhSkeletonItemProps {
  /** 占位块形状 */
  variant?: LhSkeletonVariant
  /** 是否开启动画 */
  animated?: boolean
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhSkeletonResolvedProps = LhSkeletonProps & {
  loading: boolean
  rows: number
  avatar: boolean
  animated: boolean
}

export type LhSkeletonItemResolvedProps = LhSkeletonItemProps & {
  variant: LhSkeletonVariant
  animated: boolean
}

export type { LhSkeletonVariant }
