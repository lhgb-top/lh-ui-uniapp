import type { InjectionKey } from 'vue'
import type { LhSxProps } from '@lh-ui/share/core/shared'

/**
 * Layout 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - share core 无 layout 模块：布局是纯 CSS 组件，逻辑层只有 provide/inject 上下文
 * - `<section>/<header>/<aside>/<main>/<footer>` 全部换成 `<view>`（WXSS 标签选择器禁用，
 *   样式靠 `lh-layout*` 类名生效）；landmark 语义改由 role 属性补回
 * - 子组件（header / aside / main / footer）无独立 logic，样式复用 lh-layout 的净化产物
 */
export interface LhLayoutProps {
  /** 排列方向（含 Aside 时自动为 vertical） */
  direction?: 'horizontal' | 'vertical'
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** Header / Main / Footer 共用 props */
export interface LhLayoutSectionProps {
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export interface LhLayoutAsideProps extends LhLayoutSectionProps {
  /** 侧栏宽度 */
  width?: number | string
  /** 无障碍名称（landmark 命名） */
  ariaLabel?: string
}

/** Header Props（与共用契约同名导出，便于按需引入） */
export type LhLayoutHeaderProps = LhLayoutSectionProps

/** Main Props（与共用契约同名导出，便于按需引入） */
export type LhLayoutMainProps = LhLayoutSectionProps

/** Footer Props（与共用契约同名导出，便于按需引入） */
export type LhLayoutFooterProps = LhLayoutSectionProps

/** Layout 父子组件上下文（与 plus 的 LhLayoutContext 同构） */
export interface LhLayoutContext {
  /** Aside 挂载时登记，父级切换为垂直布局 */
  registerAside: () => void
  /** Aside 卸载时注销 */
  unregisterAside: () => void
}

export const LH_LAYOUT_KEY: InjectionKey<LhLayoutContext> = Symbol('LhLayout')

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhLayoutResolvedProps = LhLayoutProps & {
  direction: 'horizontal' | 'vertical'
}
