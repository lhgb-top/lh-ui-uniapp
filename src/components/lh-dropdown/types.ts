import type { InjectionKey, Ref } from 'vue'
import type { LhSxProps } from '@lh-ui/share/core/shared'
import type { LhDropdownPlacement, LhDropdownTrigger } from '@lh-ui/share/core/dropdown'

export type { LhDropdownPlacement, LhDropdownTrigger }

/**
 * Dropdown 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - 无 teleportTarget：小程序无 DOM teleport，弹层统一由 lh-root-portal 承载
 * - 弹层定位走 useLhPopper 两帧异步度量（先隐藏渲染量尺寸 → 定位 → 显示）
 */
export interface LhDropdownProps {
  /** 触发方式 */
  trigger?: LhDropdownTrigger
  /** 展示位置 */
  placement?: LhDropdownPlacement
  /** 手动控制的显示状态（v-model:visible） */
  visible?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 点击菜单项后是否自动关闭 */
  hideOnClick?: boolean
  /** 弹出层自定义类名 */
  popperClass?: string
  /** 菜单最大高度 */
  maxHeight?: string | number
  /** 组件级主题变量，覆盖 ConfigProvider 配置 */
  themeVars?: Record<string, string>
  /** 组件级背景花纹，覆盖 ConfigProvider 配置 */
  bgPattern?: string
  /** sx 快速布局属性（作用于触发器根元素） */
  sx?: LhSxProps
}

/** 注册给子项的菜单上下文（与 plus 仓同构） */
export interface LhDropdownContext {
  items: Ref<LhDropdownItemRecord[]>
  activeIndex: Ref<number>
  registerItem(item: LhDropdownItemRecord): void
  unregisterItem(item: LhDropdownItemRecord): void
  onItemClick(command: string | number | undefined): void
}

/**
 * 运行期菜单项记录
 *
 * 【uni-app 差异】el 仅 H5 有值（键盘导航的聚焦目标）；小程序无 DOM，
 * 注册时保持 undefined，键盘导航整段由条件编译裁剪。
 */
export interface LhDropdownItemRecord {
  el?: HTMLElement | undefined
  command?: string | number
  disabled?: boolean
  divided?: boolean
}

export const LH_DROPDOWN_KEY: InjectionKey<LhDropdownContext> = Symbol('LhDropdownKey')
