import type { LhLinkType, LhLinkUnderline } from '@lh-ui/share/core/link'
import type { LhSxProps } from '@lh-ui/share/core/shared'

/**
 * Link 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - H5 分支保留 `<a>` 真链（href / target 语义与 plus 一致，含 disabled 渲染 span）；
 *   MP 端无 a 标签，统一渲染 view，点击语义经 click 事件交业务层自行导航。
 * - aria 属性包按本仓坑 16 摊开绑定（不使用 v-bind="attrs"）。
 */
export interface LhLinkProps {
  /** 链接地址（disabled 时不渲染 href；MP 端无导航语义，仅保留 prop 契约） */
  href?: string
  /** 目标窗口（仅 H5 的 a 标签语义） */
  target?: string
  /** 链接语义类型 */
  type?: LhLinkType
  /** 下划线形态：always 常驻 / hover 悬停（默认）/ none 无（hover 态仅 H5） */
  underline?: LhLinkUnderline
  /** 禁用：灰化、不跳转、读屏播报不可用 */
  disabled?: boolean
  /** 当前页 / 当前位置标记（面包屑等场景，输出 aria-current） */
  current?: 'page' | 'location' | true
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** withDefaults 之后的 props 类型（SFC 里这些字段有默认值） */
export type LhLinkResolvedProps = LhLinkProps & {
  href: string | undefined
  target: string | undefined
  type: LhLinkType | undefined
  underline: LhLinkUnderline
  disabled: boolean
  current: 'page' | 'location' | true | undefined
}
