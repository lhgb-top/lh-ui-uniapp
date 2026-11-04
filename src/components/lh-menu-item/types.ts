import type { LhSxProps } from '@lh-ui/share/core/shared'

/**
 * MenuItem 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】`<li>` 换成 `<view>`（WXSS 标签选择器禁用，靠类名生效）
 */
export interface LhMenuItemProps {
  /** 唯一标识（必填） */
  index: string
  /** 是否禁用（保留 aria-disabled 语义，点击与键盘激活均不触发） */
  disabled?: boolean
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** withDefaults 之后的 props 类型 */
export type LhMenuItemResolvedProps = LhMenuItemProps & {
  disabled: boolean
}
