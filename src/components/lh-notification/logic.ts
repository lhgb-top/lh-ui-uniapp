import { computed } from 'vue'
import {
  getNotificationClassNames,
  getNotificationIconName,
  groupNotificationsByPosition,
  isTopPosition,
} from '@lh-ui/share/core/notification'
import { sxToStyle } from '@lh-ui/share/core/shared'
import { lhlocale } from '@/adapter/locale'
import { lhNotificationConfig, lhNotificationRecords } from '@/notification/store'
import type { LhNotificationPosition, LhNotificationRecord } from '@lh-ui/share/core/notification'

/**
 * Notification 挂载点组件胶水（无 props / emits，数据全部来自单例 store）
 *
 * 渲染决策全部交给 share core 纯函数：position 分组（groupNotificationsByPosition）、
 * 卡片类名（getNotificationClassNames）、图标（getNotificationIconName）、
 * 容器偏移（isTopPosition）。本仓不持有任何分组 / 类名逻辑副本。
 */
export function useLhNotificationView() {
  /**
   * 按 position 分组的四角队列（组内时间正序），模板 v-for 出对应容器。
   * share 的分组函数为契约完整性保留全部 4 个空位，这里滤掉空组——
   * 无记录的方位不渲染 region 容器（无障碍树里也不留空 region）
   */
  const groups = computed(() => {
    const grouped = groupNotificationsByPosition(lhNotificationRecords)
    return (Object.keys(grouped) as LhNotificationPosition[]).reduce(
      (acc, position) => {
        if (grouped[position].length > 0) acc[position] = grouped[position]
        return acc
      },
      {} as Record<LhNotificationPosition, LhNotificationRecord[]>,
    )
  })

  /** 容器偏移：贴顶组走 margin-top、贴底组走 margin-bottom（与 plus host 同构） */
  const getContainerStyle = (position: LhNotificationPosition) => ({
    marginTop: `${isTopPosition(position) ? lhNotificationConfig.offset : 0}px`,
    marginBottom: `${isTopPosition(position) ? 0 : lhNotificationConfig.offset}px`,
  })

  /** 卡片类名：语义修饰 + closable / clickable（share 纯函数产出） */
  const getItemClasses = (record: LhNotificationRecord) =>
    getNotificationClassNames({
      type: record.type,
      showClose: record.showClose,
      clickable: Boolean(record.onClick),
    })

  /** sx 快速布局属性转内联样式（与 alert 等组件同款消费方式） */
  const getItemStyle = (record: LhNotificationRecord) => sxToStyle(record.sx ?? {})

  /** 语义 → 图标名（消费现有 LhIcon 图标集） */
  const getIconName = (record: LhNotificationRecord) => getNotificationIconName(record.type)

  /** 关闭按钮无障碍名称：语言包 notification.close（share zh-CN / en-US 已收录），
   *  响应式取值——void version 建立依赖，切语言自动更新 */
  const closeLabel = computed(() => lhlocale.t('notification.close', '关闭通知'))

  /** 点击卡片：只触发记录上的 onClick，不关闭（与 plus 一致，关闭只走关闭按钮 / 自动计时） */
  const handleClick = (record: LhNotificationRecord) => {
    record.onClick?.()
  }

  return {
    groups,
    getContainerStyle,
    getItemClasses,
    getItemStyle,
    getIconName,
    closeLabel,
    handleClick,
  }
}

export type { LhNotificationPosition, LhNotificationRecord }
