/**
 * Notification 挂载点组件类型
 *
 * <lh-notification /> 是命令式服务的渲染载体，与 message / loading 同款：
 * 无 props / emits，数据全部来自 src/notification 的模块级单例 store。
 * plus 仓的 LhNotificationProps（声明式单用条目 props）不移植——
 * MP 端没有「随用随 mount」，声明式单用没有承载点。
 *
 * 服务选项 / 配置 / 句柄类型真源在 src/notification/types.ts，
 * 记录 / 位置 / 语义类型真源在 share core notification。
 */
export type {
  LhNotificationConfig,
  LhNotificationHandle,
  LhNotificationOptions,
} from '@/notification/types'
export type {
  LhNotificationPosition,
  LhNotificationRecord,
  LhNotificationType,
} from '@lh-ui/share/core/notification'
