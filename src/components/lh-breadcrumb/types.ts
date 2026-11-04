import type { InjectionKey, Ref } from 'vue'
import type { LhSxProps } from '@lh-ui/share/core/shared'

/**
 * Breadcrumb 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - 无 vue-router：`to` 统一走 `uni.navigateTo`（H5 端即普通页面跳转）
 * - `<nav>/<ol>/<li>` 全部换成 `<view>`（WXSS 标签选择器禁用，靠类名生效）
 * - 分隔符与省略号折叠逻辑与 plus 完全一致（复用 share core 纯函数）
 */
export interface LhBreadcrumbProps {
  /** 分隔符字符 */
  separator?: string
  /** 最大可见项数（首项 + 省略号 + 末尾若干项），超出折叠；0 或不传表示不折叠 */
  maxItems?: number
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export interface LhBreadcrumbItemProps {
  /** 跳转地址；存在且非末项时渲染为链接样式，点击走 uni.navigateTo */
  to?: string
  /** 自定义类名（透传到项根节点） */
  customClass?: string
}

/** 面包屑父子组件上下文（与 plus 的 LhBreadcrumbContext 同构） */
export interface LhBreadcrumbContext {
  /** 已注册项的 token 列表（setup 顺序即渲染顺序） */
  itemTokens: Ref<symbol[]>
  /** 折叠时需要隐藏的项索引集合 */
  hiddenIndexes: Ref<number[]>
  /** 省略号应插在该索引的项之前（-1 表示不显示） */
  ellipsisBeforeIndex: Ref<number>
  /** 展开全部（清除折叠） */
  expand: () => void
  /** 分隔符字符 */
  separator: Ref<string>
}

export const LH_BREADCRUMB_KEY: InjectionKey<LhBreadcrumbContext> = Symbol('LhBreadcrumb')

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhBreadcrumbResolvedProps = LhBreadcrumbProps & {
  separator: string
  maxItems: number
}
