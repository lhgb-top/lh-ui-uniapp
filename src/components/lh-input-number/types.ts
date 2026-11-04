import type { LhComponentSize, LhSxProps } from '@lh-ui/share/core/shared'

/**
 * InputNumber 计数器 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - 加减按钮载体 `<button>` 换 `<view>`（MP 的 button 无法 reset 默认样式），
 *   禁用由点击守卫 + `--disabled` 修饰类表达，全端可用
 * - 提交时机：uni 的 input 组件没有原生 change 事件（小程序端只有
 *   input / blur / confirm），改为「编辑草稿 + 失焦 / 确认时一次性提交」，
 *   等价 plus 原生 change 只在提交时机触发的语义（react 仓同款方案）
 * - 键盘上下键步进仅 H5（小程序无键盘事件），SFC 的 keydown 处理由条件编译守卫
 * - customClass：uni-app 端自定义类名无法穿透 styleIsolation，统一走 prop 透传
 */
export interface LhInputNumberProps {
  /** 当前值（受控 v-model，null 表示空值） */
  modelValue?: number | null
  /** 最小值 */
  min?: number
  /** 最大值 */
  max?: number
  /** 步长 */
  step?: number
  /** 是否只能输入 step 的倍数 */
  stepStrictly?: boolean
  /** 数值精度（小数位数） */
  precision?: number
  /** 整体禁用 */
  disabled?: boolean
  /** 尺寸 */
  size?: LhInputNumberSize
  /** 是否显示加减控制按钮 */
  controls?: boolean
  /** 占位文本 */
  placeholder?: string
  /** 原生表单名称 */
  name?: string
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export type LhInputNumberSize = LhComponentSize

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhInputNumberResolvedProps = LhInputNumberProps & {
  modelValue: number | null
  min: number
  max: number
  step: number
  stepStrictly: boolean
  disabled: boolean
  size: LhInputNumberSize
  controls: boolean
  placeholder: string
  name: string
}
