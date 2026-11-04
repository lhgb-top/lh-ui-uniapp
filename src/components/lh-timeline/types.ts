import type { InjectionKey, Ref } from 'vue'
import type { LhSxProps } from '@lh-ui/share/core/shared'
import type { LhTimelineMode, LhTimelineType } from '@lh-ui/share/core/timeline'

/**
 * Timeline 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - `<ol>/<li>` 全部换成 `<view>`（WXSS 标签选择器禁用，靠类名生效），
 *   容器补 `role="list"` / 项补 `role="listitem"` 保留列表语义
 * - 父子间 provide/inject 与 plus 完全一致（Vue 3 内核，两端可用）
 * - 子项可单独使用（无父上下文时按 left 模式、视为唯一节点渲染）
 */
export interface LhTimelineProps {
  /** 布局模式：'left' 左侧时间线 / 'alternate' 左右交替 */
  mode?: LhTimelineMode
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** 时间线条目 props（Item 组件） */
export interface LhTimelineItemProps {
  /** 时间戳文本 */
  timestamp?: string
  /** 节点语义类型（按令牌着色圆点边框） */
  type?: LhTimelineType
  /** 空心节点（常用于未完成状态） */
  hollow?: boolean
  /** 自定义类名（透传到条目根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** 父级向 Item 下发的上下文（与 plus 的 LhTimelineContext 同构） */
export interface LhTimelineContext {
  /** 布局模式（provide computed 本体，禁止 props 快照） */
  mode: Ref<LhTimelineMode>
  /** 已注册条目的 token 列表（setup 顺序即渲染顺序） */
  itemTokens: Ref<symbol[]>
}

export const LH_TIMELINE_KEY: InjectionKey<LhTimelineContext> = Symbol('LhTimeline')

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhTimelineResolvedProps = LhTimelineProps & {
  mode: LhTimelineMode
}
