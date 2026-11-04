import type { LhSegmentedInput, LhSegmentedValue } from '@lh-ui/share/core/segmented'
import type { LhSxProps } from '@lh-ui/share/core/shared'

/**
 * Segmented 分段器 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - `<div>` / `<button>` 全部换成 `<view>`（WXSS 禁标签选择器，靠类名生效）
 * - 键盘方向键导航（roving tabindex）仅 H5：小程序无键盘事件，
 *   SFC 的 @keydown 处理由条件编译守卫，MP 端不调用
 * - 选中滑块是纯 CSS 过渡（背景色 + 阴影），不依赖 transitionend，全端可用
 */
export interface LhSegmentedProps {
  /** 当前值（受控 v-model） */
  modelValue?: LhSegmentedValue
  /** 选项（字符串快捷写法或 { label, value, disabled } 对象） */
  options: LhSegmentedInput[]
  /** 整组禁用 */
  disabled?: boolean
  /** 撑满容器（选项平分宽度） */
  block?: boolean
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export type { LhSegmentedInput, LhSegmentedValue }

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhSegmentedResolvedProps = LhSegmentedProps & {
  disabled: boolean
  block: boolean
}
