import type { LhCardShadow } from '@lh-ui/share/core/card'
import type { LhSxProps } from '@lh-ui/share/core/shared'

/**
 * Card 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】`<div>`/`<span>` 换成 `<view>`/`<text>`；
 * 键盘激活（@keydown）由条件编译守卫，MP 端不调用（无键盘事件）。
 */
export interface LhCardProps {
  /** 卡片标题（也可用 header 插槽） */
  title?: string
  /** 阴影显示时机 */
  shadow?: LhCardShadow
  /** 整卡可点击（承担 button 键盘语义） */
  clickable?: boolean
  /** 加载态：内容区以骨架占位 */
  loading?: boolean
  /** 组件级主题变量（键自动加 --lh- 前缀） */
  themeVars?: Record<string, string>
  /** 花纹背景 URL（如 var(--lh-pattern-willow)），不受全局白名单限制 */
  bgPattern?: string
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhCardResolvedProps = LhCardProps & {
  shadow: LhCardShadow
  clickable: boolean
  loading: boolean
}

export type { LhCardShadow }
