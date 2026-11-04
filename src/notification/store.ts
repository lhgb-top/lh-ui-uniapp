import { reactive } from 'vue'
import { LH_NOTIFICATION_DURATION_DEFAULT } from '@lh-ui/share/core/notification'
import type { LhNotificationRecord } from '@lh-ui/share/core/notification'
import type { LhNotificationConfig, LhNotificationOptions } from './types'

/**
 * Notification 单例 store（模块级 reactive 队列）
 *
 * 【与 plus 的根本差异】plus 用 createApp + mount 到 document.body 创建 host 节点，
 * 小程序无法 JS 创建 DOM，改为「模块级单例 store + 页面放 <lh-notification /> 挂载点组件」：
 * 本 store 只管队列状态，挂载点组件订阅 lhNotificationRecords 按 position 分组渲染四角。
 *
 * 记录形态（LhNotificationRecord）真源在 share core notification/types；
 * plus 仓无 max 裁剪逻辑，此处对齐不加。自动关闭用 setTimeout
 * （MP 的 transitionend 不可靠，见计划 §十一）。
 */
export const lhNotificationConfig = reactive<Required<LhNotificationConfig>>({
  duration: LH_NOTIFICATION_DURATION_DEFAULT,
  offset: 20,
})

/** 服务队列（挂载点组件直接消费的响应式数组，时间正序） */
export const lhNotificationRecords = reactive<LhNotificationRecord[]>([])

/** 每条记录的自动关闭 timer（id -> timer），close 时清理 */
const timers = new Map<number, ReturnType<typeof setTimeout>>()

let seq = 0

/** 配置默认值（useLhNotification().config 调用） */
export function setLhNotificationConfig(config: LhNotificationConfig) {
  if (config.duration !== undefined) lhNotificationConfig.duration = config.duration
  if (config.offset !== undefined) lhNotificationConfig.offset = config.offset
}

/**
 * 打开一条通知。
 * 返回 id，供 closeLhNotification 定向关闭。
 */
export function openLhNotification(options: LhNotificationOptions): number {
  seq += 1
  const record: LhNotificationRecord = {
    id: seq,
    // useLhNotification().info 等方法已带类型，直接调 openLhNotification 时兜底为 info
    type: options.type ?? 'info',
    title: options.title,
    content: options.content ?? '',
    // 未传时回落全局配置（初始值即 share 的 LH_NOTIFICATION_DURATION_DEFAULT）
    duration: options.duration ?? lhNotificationConfig.duration,
    position: options.position ?? 'top-right',
    // 与 plus 同构：showClose 默认开，显式传 false 才关
    showClose: options.showClose !== false,
    sx: options.sx,
    onClick: options.onClick,
    onClose: options.onClose,
  }

  lhNotificationRecords.push(record)

  // 自动关闭（duration=0 表示不自动关）
  if (record.duration > 0) {
    const timer = setTimeout(() => {
      closeLhNotification(record.id)
    }, record.duration)
    timers.set(record.id, timer)
  }

  return record.id
}

/** 关闭指定 id 的通知 */
export function closeLhNotification(id: number) {
  const index = lhNotificationRecords.findIndex((record) => record.id === id)
  if (index === -1) return
  const [record] = lhNotificationRecords.splice(index, 1)
  clearTimer(id)
  record?.onClose?.()
}

/** 关闭全部（单次遍历，避免逐条 findIndex 的 O(n²)） */
export function closeAllLhNotifications() {
  const records = [...lhNotificationRecords]
  lhNotificationRecords.splice(0, lhNotificationRecords.length)
  for (const record of records) {
    clearTimer(record.id)
    record.onClose?.()
  }
}

function clearTimer(id: number) {
  const timer = timers.get(id)
  if (timer) {
    clearTimeout(timer)
    timers.delete(id)
  }
}
