import type { LhSxProps, LhComponentSize } from '@lh-ui/share/core/shared'
import type { LhPlacement } from '@lh-ui/share/core/shared/popper'

/**
 * Select 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - 弹层走 lh-root-portal + useLhPopper（两帧异步度量），不是 absolute 定位
 * - 键盘导航（↑↓/Home/End）在小程序无键盘事件，MP 端不启用；
 *   选项点击直接选中关闭
 * - filterable：MP 无 input 聚焦语义，过滤输入框用 lh-input 承载
 */
export interface LhSelectOption {
  label: string
  value: unknown
  disabled?: boolean
}

export interface LhSelectProps {
  modelValue?: unknown
  options?: LhSelectOption[]
  size?: LhSelectSize
  disabled?: boolean
  clearable?: boolean
  placeholder?: string
  /** 可过滤（MP 端在弹层内提供输入框） */
  filterable?: boolean
  /** 弹层位置（12 种方位，默认 bottom） */
  placement?: LhPlacement
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** 组件级主题变量，覆盖 ConfigProvider 配置 */
  themeVars?: Record<string, string>
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export type LhSelectSize = LhComponentSize
