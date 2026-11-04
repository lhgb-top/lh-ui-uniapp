import type { InjectionKey, Ref } from 'vue'
import type { LhSxProps } from '@lh-ui/share/core/shared'
import type { LhMenuMode } from '@lh-ui/share/core/menu'

export type { LhMenuMode }

/**
 * Menu 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - 容器由 `<ul>` / `<li>` 换成 `<view>`（WXSS 标签选择器禁用，靠类名生效）
 * - 弹层子菜单（水平 / 折叠模式）由 body Teleport 换成 lh-root-portal 承载
 */
export interface LhMenuProps {
  /** 当前激活项（受控 v-model；未传时组件内部维护） */
  modelValue?: string
  /** 布局模式 */
  mode?: LhMenuMode
  /** 垂直模式折叠为图标条（子菜单改为飞出面板） */
  collapse?: boolean
  /** 默认展开的子菜单键（非受控） */
  defaultOpeneds?: string[]
  /** 受控展开的子菜单键 */
  openeds?: string[]
  /** 手风琴：同时只展开一个子菜单 */
  uniqueOpened?: boolean
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** 叶子项 props */
export interface LhMenuItemProps {
  /** 唯一标识（必填） */
  index: string
  /** 是否禁用 */
  disabled?: boolean
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** 子菜单 props（可递归嵌套） */
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

/** 分组 props */
export interface LhMenuItemGroupProps {
  /** 分组标题（也可用 title 插槽） */
  title?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** 父级向 Item / SubMenu / Group 下发的上下文（与 plus 仓同构） */
export interface LhMenuContext {
  /** 红线：provide 的是 computed ref 本体，禁止 props 快照 */
  mode: Ref<LhMenuMode>
  collapse: Ref<boolean>
  /** 当前激活项键（受控或内部兜底） */
  activeKey: Ref<string>
  /** 已展开的子菜单键 */
  openeds: Ref<string[]>
  /** 该 SubMenu 是否需要飞出面板（水平 或 折叠态） */
  isPopperMode: () => boolean
  /** 激活某项（内部 + 抛 update:modelValue + select） */
  handleSelect: (key: string, indexPath: string[]) => void
  /** 切换子菜单展开（处理 uniqueOpened + 抛 open/close） */
  handleToggleOpen: (key: string) => void
  /** 该子菜单是否展开 */
  isOpen: (key: string) => boolean
  /** 该键是否激活 */
  isActive: (key: string) => boolean
  /** 深度（顶层为 0，嵌套子菜单递增；用于飞出方向判定） */
  depth: () => number
}

export const LH_MENU_KEY: InjectionKey<LhMenuContext> = Symbol('LhMenuContext')

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhMenuResolvedProps = LhMenuProps & {
  mode: LhMenuMode
  collapse: boolean
  defaultOpeneds: string[]
  uniqueOpened: boolean
}
