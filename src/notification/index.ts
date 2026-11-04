import { openLhNotification, closeLhNotification, closeAllLhNotifications, setLhNotificationConfig } from './store'
import type {
  LhNotificationConfig,
  LhNotificationHandle,
  LhNotificationOptions,
  LhNotificationType,
} from './types'

/**
 * 挂载点组件是否已放置（页面/根里放了一个 <lh-notification />）
 *
 * 【R7 对策】与 message / loading 同款：小程序无法 JS 创建 DOM，通知必须由
 * 挂载点组件渲染。若使用方未放挂载点，调用看似成功但界面无任何反馈，
 * 因此开发期明确 console.error 告警，绝不静默降级。
 */
let mounted = false

export function setLhNotificationMounted(value: boolean) {
  mounted = value
}

function ensureMounted() {
  if (!mounted) {
    // 开发期告警（生产环境 console.error 通常被移除或无害）
    console.error(
      '[lh-ui] useLhNotification 调用时页面未放置 <lh-notification /> 挂载点组件，通知不会显示。\n' +
        '请在页面或根组件中放置 <lh-notification />，且在 onReady 之后调用（onLoad 阶段组件尚未挂载完毕）。',
    )
  }
}

function open(options: LhNotificationOptions): LhNotificationHandle {
  ensureMounted()
  const id = openLhNotification(options)
  return {
    close: () => closeLhNotification(id),
  }
}

function openTyped(
  type: LhNotificationType,
  options: LhNotificationOptions,
): LhNotificationHandle {
  return open({ ...options, type })
}

/**
 * Notification 命令式服务（API 与 plus 仓同构：success / info / warning / danger
 * 四个语义方法，error 与 plus 一致不单独暴露，需要时直接调用本服务传 type: 'error'）
 *
 * 【时序约束】所有调用须在页面 onReady 之后（onLoad 阶段挂载点组件尚未创建完毕）。
 *
 * @example
 * const notification = useLhNotification()
 * notification.success({ title: '已保存', content: '文档已写入云端' })
 */
export function useLhNotification() {
  return Object.assign(
    (options: LhNotificationOptions) => open(options),
    {
      success: (options: LhNotificationOptions) => openTyped('success' as LhNotificationType, options),
      info: (options: LhNotificationOptions) => openTyped('info' as LhNotificationType, options),
      warning: (options: LhNotificationOptions) => openTyped('warning' as LhNotificationType, options),
      danger: (options: LhNotificationOptions) => openTyped('danger' as LhNotificationType, options),
      close: (id: number) => closeLhNotification(id),
      closeAll: () => closeAllLhNotifications(),
      config: (config: LhNotificationConfig) => setLhNotificationConfig(config),
    },
  )
}

export type LhNotification = ReturnType<typeof useLhNotification>
