import type { InjectionKey, Ref } from 'vue'
import type { LhSxProps } from '@lh-ui/share/core/shared'
import type { LhTabsPosition, LhTabsType } from '@lh-ui/share/core/tabs'

/**
 * Tabs 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - 页签头用 `scroll-view` 承载（横向滚动导航栏，H5 / 微信小程序一致的滚动语义）
 * - `<button>` 换成 `<view>`（MP button 自带原生样式无法 reset，靠类名生效）
 * - 键盘导航（方向键 / Home / End / Delete）仅 H5 启用，由 LH_IS_H5 编译期守卫
 */
export interface LhTabsProps {
  /** 当前激活页签的 name（v-model） */
  modelValue?: string
  /** 外观：line 线条 / card 卡片 */
  type?: LhTabsType
  /** 页签是否可关闭 */
  closable?: boolean
  /** 是否显示新增按钮 */
  addable?: boolean
  /** 页签位置：top / bottom */
  tabPosition?: LhTabsPosition
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export interface LhTabPaneProps {
  /** 页签唯一标识（作为稳定键，不建议动态修改） */
  name: string
  /** 页签标题 */
  label?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 自定义类名（透传到面板根节点） */
  customClass?: string
}

/** Tabs 父子组件上下文（与 plus 的 LhTabsContext 同构） */
export interface LhTabsContext {
  /** 当前激活页签名 */
  activeName: Ref<string | null>
  /** 激活指定页签 */
  setActive: (name: string) => void
  /** 关闭页签（emit tab-remove 并联动激活态） */
  removePane: (name: string) => void
  /** 是否可关闭 */
  closable: Ref<boolean>
  /** aria 关联 id 前缀 */
  idPrefix: string
}

export const LH_TABS_KEY: InjectionKey<LhTabsContext> = Symbol('LhTabs')

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhTabsResolvedProps = LhTabsProps & {
  type: LhTabsType
  tabPosition: LhTabsPosition
  closable: boolean
  addable: boolean
}
