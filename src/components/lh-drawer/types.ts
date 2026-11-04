import type { LhSxProps } from '@lh-ui/share/core/shared'
import type { LhDrawerDirection } from '@lh-ui/share/core/drawer'

export type { LhDrawerDirection }

/**
 * Drawer 抽屉 Props（与 plus 仓真源同构）
 *
 * 【uni-app 差异】
 * - 无 `teleportTarget` prop：小程序无 DOM teleport，弹层统一由 lh-root-portal 承载
 *   （H5 是 teleport，MP 是 root-portal 或页内 fixed 降级），对齐 select / tooltip / dropdown 先例
 * - 焦点圈（focus-trap）不接入：MP 无键盘焦点语义（对齐 dialog 先例，share 的
 *   shouldDrawerTrapFocus 在本端不调用）
 * - lockScroll 仅 H5 有效：小程序无 body 滚动锁定，由遮罩拦截点击兜底
 * - closeOnEsc 仅 H5 有效：小程序无键盘事件
 * - 增加 `customClass`：uni-app 端自定义类名无法穿透 styleIsolation，统一走 prop 透传
 */
export interface LhDrawerProps {
  /** 是否显示（v-model） */
  modelValue?: boolean
  /** 标题（也可用 header 插槽） */
  title?: string
  /** 方向 */
  direction?: LhDrawerDirection
  /** 尺寸：数字为 px，字符串支持百分比（左右方向作用于宽度，上下方向作用于高度） */
  size?: string | number
  /** 点击遮罩是否关闭 */
  maskClosable?: boolean
  /** 是否显示关闭按钮 */
  showClose?: boolean
  /** 是否锁定页面滚动（仅 H5 有效） */
  lockScroll?: boolean
  /** 是否响应 Esc 关闭（仅 H5 有效） */
  closeOnEsc?: boolean
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** 组件级主题变量，覆盖 ConfigProvider 配置 */
  themeVars?: Record<string, string>
  /** 组件级背景花纹，覆盖 ConfigProvider 配置 */
  bgPattern?: string
  /** sx 快速布局属性（作用于面板） */
  sx?: LhSxProps
}

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhDrawerResolvedProps = LhDrawerProps & {
  modelValue: boolean
  direction: LhDrawerDirection
  size: string | number
  maskClosable: boolean
  showClose: boolean
  lockScroll: boolean
  closeOnEsc: boolean
}
