import type {
  LhCalendarRange,
  LhCalendarSelection,
} from '@lh-ui/share/core/calendar'
import type { LhSxProps } from '@lh-ui/share/core/shared'

/**
 * Calendar 日历 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - `<div>` / `<button>` / `<input>` 全部换成 `<view>`（WXSS 禁标签选择器，靠类名生效）；
 *   单元格与导航按钮的禁用态由类名承载（view 无 `:disabled` 伪类，见 SFC 注释）
 * - input 模式的触发框用 `<view>` 自绘（占位文案直接渲染）：MP 不支持 `::placeholder`，
 *   走原生 `<input>` 还得额外配 placeholder-style，自绘更稳
 * - 键盘网格导航（方向键 / Home / End / PageUp / PageDown）仅 H5：小程序无键盘事件，
 *   SFC 的 @keydown 处理由条件编译守卫，MP 端不调用
 */
export interface LhCalendarProps {
  /** 当前选中（受控 v-model；未传时组件内部维护选中态） */
  modelValue?: LhCalendarValue
  /** 选择模式：单选（默认）/ 一段时间（起止日期）/ 多选 */
  selection?: LhCalendarSelection
  /** 可选日期范围约束（区间外日期禁用） */
  range?: LhCalendarRange
  /** 展示形态：panel 常驻面板（默认）/ input 点击触发框展开的折叠面板 */
  mode?: LhCalendarMode
  /** 同时展示的月面板数（flex 换行排列） */
  panels?: number
  /** input 模式的占位文本 */
  placeholder?: string
  /** input 模式选中后是否自动收起面板 */
  closeOnSelect?: boolean
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** 展示形态：panel 常驻面板（默认）/ input 点击触发框展开的折叠面板 */
export type LhCalendarMode = 'panel' | 'input'

/** 受控值的形态随 selection 变化：单选 Date / 一段时间 Date[]（长度 2 的起止）/ 多选 Date[]。
 *  不用 [Date, Date] 元组：SFC 编译器无法从元组推断运行时类型，会导致 prop 校验告警 */
export type LhCalendarValue = Date | Date[]

export type { LhCalendarRange, LhCalendarSelection }

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhCalendarResolvedProps = LhCalendarProps & {
  selection: LhCalendarSelection
  mode: LhCalendarMode
  closeOnSelect: boolean
}
