import type { LhInputTagTrigger } from '@lh-ui/share/core/input-tag'
import type { LhSxProps } from '@lh-ui/share/core/shared'

/**
 * InputTag 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - 键盘事件：MP 端 input 无 keydown，Backspace 删尾与触发键语义守为
 *   H5-only（模板 @keydown 绑定留在两端，MP 端无键盘事件永不触发——与
 *   cascader / date-picker 的既有约定一致）；MP 端提交走 @confirm
 *   （confirm-type="done" 的完成键），trigger 的 space / comma 语义仅 H5。
 * - 删除主路径：每标签自带 × 关闭按钮，点删双端可用。
 * - 聚焦：以 :focus prop 驱动（替代 inputRef.focus()），点容器置位。
 * - aria-invalid 未接 form 错误态（本仓 form 上下文暂无控件消费先例）。
 */
export interface LhInputTagProps {
  /** 标签列表（受控 v-model） */
  modelValue?: string[]
  /** 提交标签的触发键（默认 enter；MP 端一律走完成键提交） */
  trigger?: LhInputTagTrigger
  /** 占位提示 */
  placeholder?: string
  /** 占位样式（MP 端替代 ::placeholder） */
  placeholderStyle?: string
  /** 标签上限（非正数表示不限） */
  max?: number
  /** 允许重复标签 */
  allowDuplicate?: boolean
  /** 只读：不生成标签、不响应删除键 */
  readonly?: boolean
  /** 禁用 */
  disabled?: boolean
  /** 无障碍名称（未传时取语言包 inputTag.label） */
  ariaLabel?: string
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** withDefaults 之后的 props 类型（SFC 里这些字段有默认值） */
export type LhInputTagResolvedProps = LhInputTagProps & {
  modelValue: string[]
  trigger: LhInputTagTrigger
  placeholder: string
  max: number
  allowDuplicate: boolean
  readonly: boolean
  disabled: boolean
}
