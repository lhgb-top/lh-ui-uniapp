import type { LhComponentSize, LhSxProps } from '@lh-ui/share/core/shared'
import type { LhDatePickerMode } from '@lh-ui/share/core/date-picker'

/**
 * DatePicker 日期选择器 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - 浮层走 lh-root-portal + useLhPopper（两帧异步度量），面板为 `view` 自绘网格
 * - 键盘导航（方向键 / Home / End / PageUp / PageDown / Enter / Escape）仅 H5 生效；
 *   小程序无键盘事件
 * - `datetime` / 区间选择与 plus 一致：只有类型预留，面板内没有时间列与区间选择 UI
 *   （家族台账 P-08）；外部传入 `[Date, Date]` 时触发器正常回显，确认不会覆盖区间值
 */
export interface LhDatePickerProps {
  /** 绑定值（Date / 区间二元组 / null） */
  modelValue?: Date | [Date, Date] | null
  /** 选择模式：日期（默认）/ 月份 / 年份 / datetime（仅类型预留）/ range（仅类型预留） */
  mode?: LhDatePickerMode
  /** 尺寸（未传时取 ConfigProvider 全局尺寸，最终回退 medium） */
  size?: LhDatePickerSize
  /** 是否禁用整个选择器 */
  disabled?: boolean
  /** 是否显示清除按钮 */
  clearable?: boolean
  /** 占位文本（未传时按 format 生成，取语言包 datepicker.year/month） */
  placeholder?: string
  /** 显示格式（定宽 token yyyy / MM / dd / HH / mm / ss，由 share 纯函数解析） */
  format?: string
  /** 只读（触发器不弹层，与 plus 一致） */
  readonly?: boolean
  /** 区间分隔符（区间值回显时拼接两端） */
  rangeSeparator?: string
  /** 给日期单元格追加自定义类（回调返回空值时跳过） */
  cellClassName?: (date: Date) => string
  /** 面板自定义类名（透传到弹层根节点） */
  popperClass?: string
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** 组件级主题变量，覆盖 ConfigProvider 配置 */
  themeVars?: Record<string, string>
  /** sx 快速布局属性（作用于根元素，浮层面板不受影响） */
  sx?: LhSxProps
}

export type LhDatePickerSize = LhComponentSize

// share 类型同名再导出：供 src/index.ts 类型导出块与使用方引用（真源仍在 share core）
export type { LhDatePickerMode }

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhDatePickerResolvedProps = LhDatePickerProps & {
  mode: LhDatePickerMode
  disabled: boolean
  clearable: boolean
  placeholder: string
  format: string
  readonly: boolean
  rangeSeparator: string
}
