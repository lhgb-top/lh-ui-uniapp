import type { LhSxProps } from '@lh-ui/share/core/shared'

/**
 * SubMenu 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - `<li>` 换成 `<view>`（WXSS 标签选择器禁用，靠类名生效）
 * - 飞出面板由 body Teleport 换成 lh-root-portal 承载；hover 打开仅 H5 生效，
 *   小程序端由标题点击切换（与 Dropdown 的 hover 降级同款）
 */
export interface LhSubMenuProps {
  /** 唯一标识（必填） */
  index: string
  /** 标题（也可用 title 插槽） */
  title?: string
  /** 是否禁用 */
  disabled?: boolean
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** withDefaults 之后的 props 类型 */
export type LhSubMenuResolvedProps = LhSubMenuProps & {
  disabled: boolean
}
