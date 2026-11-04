import type { LhAlertType } from '@lh-ui/share/core/alert'
import type { LhSxProps } from '@lh-ui/share/core/shared'

/**
 * Alert 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - 根元素 `<div>` 换 `<view>`，标题/描述用 `<view>`（WXSS 禁标签选择器，靠类名生效）
 * - 语义图标与关闭按钮内的 svg 换 `lh-icon` 图表节点（小程序不支持 svg）
 * - 关闭交互无 `<button type="button">`，用 `view` + `role="button"` 承载
 */
export interface LhAlertProps {
  /** 语义类型 */
  type?: LhAlertType
  /** 标题（也可用 title 插槽） */
  title?: string
  /** 是否可关闭 */
  closable?: boolean
  /** 是否显示语义图标 */
  showIcon?: boolean
  /** 是否浅色朴素样式 */
  plain?: boolean
  /** 关闭按钮的无障碍名称（未传时取语言包 alert.close） */
  closeLabel?: string
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export type { LhAlertType }

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhAlertResolvedProps = LhAlertProps & {
  type: LhAlertType
  closable: boolean
  showIcon: boolean
  plain: boolean
}
