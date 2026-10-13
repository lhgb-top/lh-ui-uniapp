import type { LhMessageRecord, LhMessageType } from '@lh-ui/share/core/message'

/**
 * Message 服务配置（与 plus 仓同构，去掉 appendTo——MP 无 DOM 挂载点概念）
 */
export interface LhMessageConfig {
  /** 默认显示时长（毫秒），0 为不自动关闭 */
  duration?: number
  /** 同屏最大条数 */
  max?: number
  /** 距顶偏移（px） */
  offset?: number
}

/**
 * Message 单条选项（与 plus 仓同构）
 */
export interface LhMessageOptions {
  content: string
  type?: LhMessageType
  duration?: number
  showClose?: boolean
  offset?: number
  onClose?: () => void
}

export interface LhMessageHandle {
  close: () => void
}

export type { LhMessageRecord, LhMessageType }
