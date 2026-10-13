import type { LhSxProps } from '@lh-ui/share/core/shared'
import type { LhTooltipPlacementCore } from '@lh-ui/share/core/tooltip'

/**
 * Tooltip 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - 小程序无 hover 语义：触发方式改为 click / touchstart（由 trigger 控制）
 * - 弹层走 lh-root-portal + useLhPopper（两帧异步度量）
 * - 延迟显示/隐藏：MP 无事件冒泡的进出语义，仅保留 click 模式的立即行为
 */
export interface LhTooltipProps {
  /** 提示文案 */
  content?: string
  /** 弹层位置（12 种方位，默认 top） */
  placement?: LhTooltipPlacementCore
  /** 触发方式：click（默认，全端可用）/ hover（仅 H5 有效） */
  trigger?: 'click' | 'hover'
  /** 显示延迟（毫秒） */
  showDelay?: number
  /** 隐藏延迟（毫秒） */
  hideDelay?: number
  /** 最大宽度（内容自动换行） */
  maxWidth?: string | number
  /** 是否禁用 */
  disabled?: boolean
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** 组件级主题变量，覆盖 ConfigProvider 配置 */
  themeVars?: Record<string, string>
  /** sx 快速布局属性 */
  sx?: LhSxProps
}
