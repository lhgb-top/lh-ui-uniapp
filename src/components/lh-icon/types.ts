import type { LhIconName } from '@lh-ui/share/core/icon'

/**
 * Icon 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】小程序不支持 <svg> 标签，本组件改用 iconfont 字体渲染：
 * `<text class="lh-icon"><text class="lh-iconfont lh-iconfont--<name>"/></text>`，
 * 内层对齐 share 的 `.lh-icon svg` 后代选择器（净化后为 `.lh-icon .lh-iconfont`），
 * 颜色由 color prop 经 style 下发，完整替代 web 端的 currentColor 语义。
 */
export interface LhIconProps {
  /** 图标名称（share 的 LH_ICON_SVGS_CONST 键，如 'search' / 'loading'） */
  name?: LhIconName
  /** 图标尺寸（数字按 px；字符串原样透传，如 '1.5em'） */
  size?: string | number
  /** 图标颜色（替代 web 端 currentColor） */
  color?: string
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** 组件级主题变量，覆盖 ConfigProvider 配置 */
  themeVars?: Record<string, string>
  /** 组件级背景花纹，覆盖 ConfigProvider 配置 */
  bgPattern?: string
}

export type LhIconSize = string | number
