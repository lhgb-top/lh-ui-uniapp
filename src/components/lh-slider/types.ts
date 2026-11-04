import type { LhComponentSize, LhSxProps } from '@lh-ui/share/core/shared'

/**
 * Slider 滑块 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - `<div>` / `<span>` 全部换成 `<view>` / `<text>`（WXSS 禁标签选择器，靠类名生效）
 * - 拖动载体：plus 在 thumb 上挂 mousedown / touchstart 后把监听接到 document；
 *   MP 没有 document，touch 事件改为直接挂在 thumb wrapper 上（touchmove /
 *   touchend 沿 touchstart 的目标节点派发，无需全局监听），H5 保留 document 级
 *   鼠标监听走条件编译
 * - 轨道位移计算：plus 用同步 getBoundingClientRect；MP 只有异步 SelectorQuery，
 *   改走 adapter 的 getSingleLhRect（异步语义，见 logic 注释）
 * - 键盘步进（方向键 / Home / End / PageUp / PageDown）仅 H5，SFC 的 keydown
 *   处理由条件编译守卫，MP 端不调用
 * - customClass：uni-app 端自定义类名无法穿透 styleIsolation，统一走 prop 透传
 */
export interface LhSliderProps {
  /** 当前值（受控 v-model；单滑块传 number，范围模式传二元组） */
  modelValue?: number | [number, number] | null
  /** 最小值 */
  min?: number
  /** 最大值 */
  max?: number
  /** 步长（每次吸附的最小单位） */
  step?: number
  /** 整体禁用 */
  disabled?: boolean
  /** 是否为范围模式（双滑块） */
  range?: boolean
  /** 是否在轨道右侧显示当前数值 */
  showInput?: boolean
  /** 尺寸 */
  size?: LhSliderSize
  /** 刻度标记（键为数值、值为文案，按数值排序展示） */
  marks?: Record<number, string>
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export type LhSliderSize = LhComponentSize

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhSliderResolvedProps = LhSliderProps & {
  min: number
  max: number
  step: number
  disabled: boolean
  range: boolean
  showInput: boolean
  size: LhSliderSize
}
