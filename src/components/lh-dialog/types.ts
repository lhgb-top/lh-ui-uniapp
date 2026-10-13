import type { LhSxProps } from '@lh-ui/share/core/shared'

/**
 * Dialog 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - 弹层走 lh-root-portal（H5 teleport / MP root-portal 或页内 fixed）
 * - 焦点圈（focus-trap）在 MP 端不可用：shouldTrapFocus 由 LH_IS_H5 守卫直接返回 false，
 *   不调用 share 的 focus-trap（计划 §四约定）
 * - lockScroll：MP 无 body 滚动锁定，改由页面级处理或守卫掉
 * - 底部弹层需 env(safe-area-inset-bottom) 适配全面屏
 */
export interface LhDialogProps {
  modelValue?: boolean
  title?: string
  width?: string | number
  top?: string | number
  /** 是否全屏 */
  fullscreen?: boolean
  /** 定位：center（默认）/ top / bottom */
  position?: 'center' | 'top' | 'bottom'
  /** 点击遮罩关闭 */
  closeOnClickModal?: boolean
  /** H5 端按 Esc 关闭（MP 无键盘事件，无效） */
  closeOnPressEscape?: boolean
  /** 锁定滚动（H5 有效） */
  lockScroll?: boolean
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** 层级；不传时由 useLhZIndex 自增分配 */
  zIndex?: number
  /** 组件级主题变量，覆盖 ConfigProvider 配置 */
  themeVars?: Record<string, string>
  /** sx 快速布局属性 */
  sx?: LhSxProps
}
