import type { LhSxProps } from '@lh-ui/share/core/shared'
import type { LhPlacement, LhPopoverTrigger } from '@lh-ui/share/core/popover'

export type { LhPlacement as LhPopoverPlacement, LhPopoverTrigger }

/**
 * Popover 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - 无 teleportTarget：小程序无 DOM teleport，弹层统一由 lh-root-portal 承载
 * - 弹层定位走 useLhPopper 两帧异步度量（先隐藏渲染量尺寸 → 定位 → 显示）
 */
export interface LhPopoverProps {
  /** 展示位置 */
  placement?: LhPlacement
  /** 触发方式 */
  trigger?: LhPopoverTrigger
  /** 标题 */
  title?: string
  /** 手动控制的显示状态（v-model:visible） */
  visible?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示箭头 */
  arrow?: boolean
  /** 弹出层宽度 */
  width?: string | number
  /** 弹出层自定义类名 */
  popperClass?: string
  /** 延迟显示时间(ms) */
  showAfter?: number
  /** 延迟隐藏时间(ms) */
  hideAfter?: number
  /** 组件级主题变量，覆盖 ConfigProvider 配置 */
  themeVars?: Record<string, string>
  /** 组件级背景花纹，覆盖 ConfigProvider 配置 */
  bgPattern?: string
  /** sx 快速布局属性（作用于触发器根元素） */
  sx?: LhSxProps
}
