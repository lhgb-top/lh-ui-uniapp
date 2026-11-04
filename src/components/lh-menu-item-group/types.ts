import type { LhSxProps } from '@lh-ui/share/core/shared'

/**
 * MenuItemGroup 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】`<li>` / `<ul>` 换成 `<view>`（WXSS 标签选择器禁用，靠类名生效）
 */
export interface LhMenuItemGroupProps {
  /** 分组标题（也可用 title 插槽） */
  title?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}
