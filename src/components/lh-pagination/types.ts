import type { LhSxProps } from '@lh-ui/share/core/shared'

/**
 * Pagination 分页 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - `<nav>` / `<button>` / `<ul>` / `<span>` 全部换成 `<view>` / `<text>`
 *   （WXSS 禁标签选择器，靠类名生效）
 * - 条数切换的 `<select>` 换成 uni 内置 `<picker>`（selector 模式），
 *   change 取值走 event.detail.value（下标）
 * - 跳页输入的提交时机：uni input 无原生 change，改为「编辑草稿 + 失焦 /
 *   确认（confirm）时一次性提交」（同 lh-input-number 先例）；
 *   原生 min / max 属性不透传，页码一律由 core 的 clampPage 钳制
 */
export interface LhPaginationProps {
  /** 数据总数（必填） */
  total: number
  /** 每页条数 */
  pageSize?: number
  /** 当前页（v-model:current） */
  current?: number
  /** 每页条数选项 */
  pageSizes?: number[]
  /** 是否显示总条数 */
  showTotal?: boolean
  /** 是否显示每页条数切换 */
  showSizeChanger?: boolean
  /** 是否显示跳页输入 */
  showJumper?: boolean
  /** 紧凑模式 */
  simple?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhPaginationResolvedProps = LhPaginationProps & {
  pageSize: number
  pageSizes: number[]
  showTotal: boolean
  showSizeChanger: boolean
  showJumper: boolean
  simple: boolean
  disabled: boolean
}
