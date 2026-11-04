import type { LhSxProps } from '@lh-ui/share/core/shared'
import type {
  LhPlacement,
  LhPopconfirmType,
  LhPopconfirmTrigger,
} from '@lh-ui/share/core/popconfirm'

export type { LhPlacement as LhPopconfirmPlacement, LhPopconfirmType, LhPopconfirmTrigger }

/**
 * Popconfirm 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - 无 teleportTarget：小程序无 DOM teleport，弹层统一由 lh-root-portal 承载
 * - 弹层定位走 useLhPopper 两帧异步度量（先隐藏渲染量尺寸 → 定位 → 显示）
 */
export interface LhPopconfirmProps {
  /** 确认语气 */
  type?: LhPopconfirmType
  /** 展示位置 */
  placement?: LhPlacement
  /** 触发方式 */
  trigger?: LhPopconfirmTrigger
  /** 确认内容（也可用 content 插槽） */
  title?: string
  /** 确认按钮文案（未传时取语言包 popconfirm.confirm） */
  confirmText?: string
  /** 取消按钮文案（未传时取语言包 popconfirm.cancel） */
  cancelText?: string
  /** 确认按钮类型 */
  confirmButtonType?: 'default' | 'primary'
  /** 手动控制的显示状态（v-model:visible） */
  visible?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示语气图标 */
  showIcon?: boolean
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
