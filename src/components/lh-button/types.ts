import type { LhSxProps } from '@lh-ui/share/core/shared'
import type { LhIconName } from '@lh-ui/share/core/icon'
import { LH_SIZE_CONST, LH_TYPES_CONST } from '@lh-ui/share/constants'

/**
 * Button 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - nativeType / href / target：小程序 button 无这些语义，忽略不实现
 * - 渲染载体用 uni 内置 <button>（编译为各端原生按钮），@click 由 uni 编译为 bindtap
 */
export interface LhButtonProps {
  type?: LhButtonType
  /** 尺寸，可选。若不传则从 ConfigProvider 继承 */
  size?: LhButtonSize
  loading?: boolean
  disabled?: boolean
  plain?: boolean
  block?: boolean
  round?: boolean
  circle?: boolean
  /** 图标名称（内置 LhIcon 图标，如 'search'） */
  icon?: LhIconName
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** 组件级主题变量，覆盖 ConfigProvider 的全局 themeVars 和 componentTheme */
  themeVars?: Record<string, string>
  /** 组件级背景花纹，覆盖 ConfigProvider 配置 */
  bgPattern?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export const LH_BUTTON_TYPE_CONST = {
  ...LH_TYPES_CONST,
  /** @alias 默认 */
  default: 'default',
  /** @alias 主要 */
  primary: 'primary',
} as const

export const LH_BUTTON_SIZE_CONST = {
  ...LH_SIZE_CONST,
} as const

export type LhButtonType = (typeof LH_BUTTON_TYPE_CONST)[keyof typeof LH_BUTTON_TYPE_CONST]
export type LhButtonSize = (typeof LH_BUTTON_SIZE_CONST)[keyof typeof LH_BUTTON_SIZE_CONST]

/**
 * withDefaults 之后的 props 类型。
 *
 * logic 调 share 的 getClassNames 时需要非空字段，但 LhButtonProps 里它们都是
 * 可选的；SFC 的 withDefaults 已保证这些字段运行时非空，用交叉类型把这份契约
 * 记到类型上（size 等无默认值的字段保持可选）。
 */
export type LhButtonResolvedProps = LhButtonProps & {
  type: LhButtonType
  loading: boolean
  disabled: boolean
  plain: boolean
  block: boolean
  round: boolean
  circle: boolean
}
