import type { LhSxProps, LhComponentSize } from '@lh-ui/share/core/shared'

/**
 * TimePicker 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - 弹层走 lh-root-portal + useLhPopper（两帧异步度量），面板列由 scroll-view 承载
 *   （MP 的 view 无可靠溢出滚动），不再是 plus 的滚轮 + overflow 容器
 * - 键盘导航（↑↓ 列内步进 / ←→ 跨列 / Enter 确认 / Escape 关闭）仅 H5 生效；
 *   小程序无键盘事件
 * - 滚轮步进未移植：列内滚动交给 scroll-view 原生滚动（含 H5 端的滚轮），
 *   点击列项即选中，不再拦截 wheel 做步进
 * - arrowControl 箭头按钮仅 H5 渲染（依赖键盘事件语义，MP 端不输出死代码）
 */
export interface LhTimePickerProps {
  /** 绑定值（Date 对象，时刻由面板选择；null 表示未选择） */
  modelValue?: Date | null
  /** 尺寸 */
  size?: LhTimePickerSize
  /** 是否禁用整个选择器 */
  disabled?: boolean
  /** 是否可清除 */
  clearable?: boolean
  /** 占位符（未传时按 format 生成，取语言包 timepicker.hour/minute/second） */
  placeholder?: string
  /** 时间格式（含 ss 才显示秒列） */
  format?: string
  /** 是否只读（不弹层） */
  readonly?: boolean
  /** 是否显示箭头按钮（仅 H5 有键盘步进语义） */
  arrowControl?: boolean
  /** 开始小时（小时列可选范围起点，与 0~23 求交集） */
  start?: number
  /** 结束小时（小时列可选范围终点，与 0~23 求交集） */
  end?: number
  /** 小时列步进 */
  stepHour?: number
  /** 分钟列步进 */
  stepMinute?: number
  /** 秒列步进 */
  stepSecond?: number
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** 组件级主题变量，覆盖 ConfigProvider 配置 */
  themeVars?: Record<string, string>
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export type LhTimePickerSize = LhComponentSize

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhTimePickerResolvedProps = LhTimePickerProps & {
  modelValue: Date | null
  disabled: boolean
  clearable: boolean
  placeholder: string
  format: string
  readonly: boolean
  arrowControl: boolean
  start: number
  end: number
  stepHour: number
  stepMinute: number
  stepSecond: number
}
