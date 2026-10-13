import type { InjectionKey, Ref } from 'vue'
import type { LhSxProps } from '@lh-ui/share/core/shared'

export type LhCheckboxSize = 'small' | 'medium' | 'large'

/**
 * Checkbox 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】不用原生 input checkbox（MP 样式不可控），改用 view 自绘勾选框 + lh-icon。
 */
export interface LhCheckboxProps {
  modelValue?: boolean
  value?: unknown
  label?: string
  disabled?: boolean
  indeterminate?: boolean
  name?: string
  size?: LhCheckboxSize
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export interface LhCheckboxGroupProps {
  modelValue?: unknown[]
  disabled?: boolean
  name?: string
  size?: LhCheckboxSize
}

export interface LhCheckboxGroupContext {
  values: Ref<unknown[]>
  /** 红线 #6：provide 的是 computed ref 本体，禁止 props 快照（动态禁用/改尺寸需传导） */
  disabled: Ref<boolean>
  name: Ref<string | undefined>
  size: Ref<LhCheckboxSize>
  toggle: (value: unknown, checked: boolean) => void
}

export const LH_CHECKBOX_GROUP_KEY: InjectionKey<LhCheckboxGroupContext> = Symbol('LhCheckboxGroup')
