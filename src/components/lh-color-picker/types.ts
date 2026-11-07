import type { LhColorFormat } from '@lh-ui/share/core/color-picker'
import type { LhComponentSize, LhSxProps } from '@lh-ui/share/core/shared'

/**
 * ColorPicker 颜色选择器 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - `<div>` / `<span>` / `<ul>` / `<li>` 全部换成 `<view>` / `<text>`
 * （WXSS 禁标签选择器，靠类名生效）
 * - 面板内的 hex / rgb 输入用 uni 内置 `<input>`：事件载荷在
 * `event.detail.value`（不能照搬 plus 的 v-model + keydown.enter），
 * MP 端回车提交走 `@confirm`（键盘「完成」），失焦提交走 `@blur`
 * - customClass：uni-app 端自定义类名无法穿透 styleIsolation，统一走 prop 透传
 */
export interface LhColorPickerProps {
  /** 颜色值（受控 v-model，hex 或 rgb() 字符串，按 format 输出） */
  modelValue?: string
  /** 输出格式（默认 hex；非法值回退 hex，由 share 的 isValidColorFormat 守卫） */
  format?: LhColorFormat
  /** 透明度通道（开启后输出 8 位 hex / rgba()） */
  showAlpha?: boolean
  /** 预设色板 */
  predefine?: string[]
  /** 尺寸 */
  size?: LhComponentSize
  /** 禁用 */
  disabled?: boolean
  /** 清除（置空）按钮 */
  clearable?: boolean
  /** 占位提示（空值时；未传取语言包 colorPicker.placeholder） */
  placeholder?: string
  /** 无障碍名称（未传时取语言包 colorPicker.label） */
  ariaLabel?: string
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhColorPickerResolvedProps = LhColorPickerProps & {
  modelValue: string
  format: LhColorFormat
  showAlpha: boolean
  predefine: string[]
  size: LhComponentSize
  disabled: boolean
  clearable: boolean
  placeholder: string
}
