import type { InjectionKey, Ref } from 'vue'
import type { LhSxProps } from '@lh-ui/share/core/shared'
import type { LhCollapseKey } from '@lh-ui/share/core/collapse'

/**
 * Collapse 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - `<div>` / `<h3>` / `<button>` 全部换成 `<view>` / `<text>`（WXSS 标签选择器禁用，靠类名生效）
 * - plus 用原生 `<button disabled>` 移出交互；MP 无可用的原生按钮语义，
 *   禁用改由点击守卫 + `--disabled` 类名 + `aria-disabled` 表达
 * - 增加 `customClass` 透传字段（本仓全组件统一约定，仅类名透传、非功能 prop）
 */
export interface LhCollapseProps {
  /** 当前激活的面板（受控 v-model：单值或数组，手风琴模式下常传单值） */
  modelValue?: LhCollapseKey | LhCollapseKey[]
  /** 手风琴模式：同时只展开一个 */
  accordion?: boolean
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** 面板项 props */
export interface LhCollapseItemProps {
  /** 面板唯一标识（必填） */
  name: LhCollapseKey
  /** 标题（也可用 title 插槽） */
  title?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 自定义类名（透传到项根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** 折叠面板父子组件上下文（与 plus 的 LhCollapseContext 同构） */
export interface LhCollapseContext {
  /** 当前展开面板名集合（受控时由 props 同步，非受控时为内部状态） */
  activeKeys: Ref<LhCollapseKey[]>
  /** 手风琴模式 */
  accordion: Ref<boolean>
  /** 切换指定面板的展开态 */
  toggle: (key: LhCollapseKey) => void
}

export const LH_COLLAPSE_CONTEXT_KEY: InjectionKey<LhCollapseContext> = Symbol('LhCollapseContext')

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhCollapseResolvedProps = LhCollapseProps & {
  accordion: boolean
}
