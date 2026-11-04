import type {
  LhNotificationPosition,
  LhNotificationRecord,
  LhNotificationType,
} from '@lh-ui/share/core/notification'
import type { LhSxProps } from '@lh-ui/share/core/shared'

/**
 * Notification 服务配置（与 plus 仓同构，去掉 appendTo——MP 无 DOM 挂载点概念，
 * 弹出位置由挂载点组件按 position 四角渲染）
 */
export interface LhNotificationConfig {
  /** 默认自动关闭毫秒数，0 表示不自动关闭 */
  duration?: number
  /** 距视口边缘偏移（px） */
  offset?: number
}

/**
 * Notification 单条选项（与 plus 仓同构）
 */
export interface LhNotificationOptions {
  /** 标题（必填） */
  title: string
  /** 正文内容 */
  content?: string
  /** 语义类型，默认 info */
  type?: LhNotificationType
  /** 自动关闭毫秒数，0 表示不自动关闭（默认 4500） */
  duration?: number
  /** 弹出位置（默认 top-right） */
  position?: LhNotificationPosition
  /** 是否显示关闭按钮（默认 true） */
  showClose?: boolean
  /** sx 快速布局属性 */
  sx?: LhSxProps
  /** 点击卡片回调（传入后卡片以 button 语义呈现） */
  onClick?: () => void
  /** 关闭（含自动与手动）后的回调 */
  onClose?: () => void
}

export interface LhNotificationHandle {
  close: () => void
}

export type { LhNotificationPosition, LhNotificationRecord, LhNotificationType }
