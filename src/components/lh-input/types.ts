import type { LhSxProps } from '@lh-ui/share/core/shared'
import type { LhIconName } from '@lh-ui/share/core/icon'
import type { LH_SIZE_CONST } from '@lh-ui/share/constants'

/**
 * Input 类型（与 plus 仓同构）
 */
export const LH_INPUT_TYPE_CONST = {
  text: 'text',
  textarea: 'textarea',
  password: 'password',
  number: 'number',
  email: 'email',
  url: 'url',
  tel: 'tel',
  date: 'date',
  time: 'time',
} as const

export type LhInputType = (typeof LH_INPUT_TYPE_CONST)[keyof typeof LH_INPUT_TYPE_CONST]

export type LhInputSize = (typeof LH_SIZE_CONST)[keyof typeof LH_SIZE_CONST]

export const LH_INPUT_STATE_CONST = {
  error: 'error',
  success: 'success',
  warning: 'warning',
} as const

export type LhInputStateType = (typeof LH_INPUT_STATE_CONST)[keyof typeof LH_INPUT_STATE_CONST]

/**
 * Input Props 接口
 *
 * 【uni-app 差异】
 * - placeholder 样式：MP 不支持 ::placeholder 伪元素，改走 placeholder-style / placeholder-class prop
 * - autocomplete / autofocus / resize / form / tabindex / nativeType / inputStyle：
 *   小程序 input 无对应能力，忽略不实现
 * - autosize：textarea 的自适应高度走 auto-height 属性
 */
export interface LhInputProps {
  modelValue?: string
  type?: LhInputType
  size?: LhInputSize
  disabled?: boolean
  /**
   * 只读（与 plus 同名 prop 语义一致：可聚焦、可选中复制、参与表单，但不可改值）
   *
   * 【uni-app 平台局限】uni 的 input / textarea 组件不支持 readonly（H5 端 uni-input
   * 只在 disabled 分支内部绑原生 readonly，微信小程序 input 更是只有 disabled），
   * 无法像 web 端那样在 DOM 层禁止输入。本仓在 logic 层拦截 input / blur，
   * 保证 modelValue 不被修改；用户敲入的瞬态字符会在下次渲染时回弹。
   */
  readonly?: boolean
  placeholder?: string
  /** placeholder 样式（替代 web 端 ::placeholder，MP 端必需） */
  placeholderStyle?: string
  /**
   * placeholder 样式类名（与 placeholderStyle 二选一，由使用者在页面样式中定义该类）
   */
  placeholderClass?: string
  maxlength?: number
  minlength?: number
  showWordLimit?: boolean
  clearable?: boolean
  /** 前缀图标名称 */
  prefixIcon?: LhIconName
  /** 后缀图标名称 */
  suffixIcon?: LhIconName
  /** 校验状态 */
  state?: LhInputStateType
  name?: string
  password?: boolean
  /**
   * textarea 自适应高度（对应 uni textarea 的 auto-height 属性）
   *
   * 【uni-app 差异】plus 的 rows prop 未实现：uni 的 textarea 无 rows 属性，
   * 多行高度由 autosize 或 CSS 控制，故本仓不保留该 prop。
   */
  autosize?: boolean
  label?: string
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** 组件级主题变量，覆盖 ConfigProvider 配置 */
  themeVars?: Record<string, string>
  /** 组件级背景花纹，覆盖 ConfigProvider 配置 */
  bgPattern?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}
