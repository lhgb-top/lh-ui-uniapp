import { reactive } from 'vue'
import {
  createMessageRecord,
  clampMessageQueue,
} from '@lh-ui/share/core/message'
import type { LhMessageRecord } from '@lh-ui/share/core/message'
import type { LhMessageConfig, LhMessageOptions } from './types'

/**
 * Message 单例 store（模块级 reactive 队列）
 *
 * 【与 plus 的根本差异】plus 用 createApp + mount 到 document.body 创建消息节点，
 * 小程序无法 JS 创建 DOM，改为「模块级单例 store + 页面放 <lh-message /> 挂载点组件」：
 * 本 store 只管队列状态，挂载点组件订阅 lhMessageRecords 渲染。
 *
 * 队列操作全部复用 share 的纯函数（createMessageRecord / clampMessageQueue），
 * 与各端语义一致；自动关闭用 setTimeout（MP 的 transitionend 不可靠，见计划 §十一）。
 */
export const lhMessageConfig = reactive<Required<LhMessageConfig>>({
  duration: 3000,
  max: 5,
  offset: 20,
})

export const lhMessageRecords = reactive<LhMessageRecord[]>([])

/** 每条记录的自动关闭 timer（id -> timer），close 时清理 */
const timers = new Map<number, ReturnType<typeof setTimeout>>()

let seq = 0

/** 配置默认值（LhMessage.config 调用） */
export function setLhMessageConfig(config: LhMessageConfig) {
  if (config.duration !== undefined) lhMessageConfig.duration = config.duration
  if (config.max !== undefined) lhMessageConfig.max = config.max
  if (config.offset !== undefined) lhMessageConfig.offset = config.offset
}

/**
 * 打开一条消息。
 * 返回 id，供 closeLhMessage 定向关闭。
 */
export function openLhMessage(options: LhMessageOptions): number {
  seq += 1
  const record = createMessageRecord(
    {
      // useLhMessage().info 等方法已带类型，直接调 openLhMessage 时兜底为 info
      type: options.type ?? 'info',
      content: options.content,
      showClose: options.showClose ?? false,
      onClose: options.onClose,
      // 单条时长：未传时回落全局配置（resolveMessageDuration 会按语义兜底，loading 型为 0）
      duration: options.duration ?? lhMessageConfig.duration,
    },
    seq,
  )

  lhMessageRecords.push(record)

  // 超限裁剪（保留最新 max 条，被移除项触发 onClose）
  const { kept, removed } = clampMessageQueue(lhMessageRecords, lhMessageConfig.max)
  removed.forEach((item) => {
    clearTimer(item.id)
    item.onClose?.()
  })
  // clampMessageQueue 是纯函数，裁剪结果必须写回响应式队列，挂载点视图才会更新
  lhMessageRecords.splice(0, lhMessageRecords.length, ...kept)

  // 自动关闭（duration=0 表示不自动关，如 loading 型）
  if (record.duration > 0) {
    const timer = setTimeout(() => {
      closeLhMessage(record.id)
    }, record.duration)
    timers.set(record.id, timer)
  }

  return record.id
}

/** 关闭指定 id 的消息 */
export function closeLhMessage(id: number) {
  const index = lhMessageRecords.findIndex((record) => record.id === id)
  if (index === -1) return
  const [record] = lhMessageRecords.splice(index, 1)
  clearTimer(id)
  record?.onClose?.()
}

/** 关闭全部（单次遍历，避免逐条 findIndex 的 O(n²)） */
export function closeAllLhMessages() {
  const records = [...lhMessageRecords]
  lhMessageRecords.splice(0, lhMessageRecords.length)
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
