import type { InjectionKey } from 'vue'
import type { LhFormRule } from '@lh-ui/share/core/form'
import type { LhSxProps } from '@lh-ui/share/core/shared'

export type LhFormLabelPosition = 'left' | 'right' | 'top'

/**
 * Form 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - 校验触发：MP 无 change 语义，表单控件的 blur/input 事件由各组件自行映射
 * - 表单提交：小程序表单语义不同，validate 方法返回 Promise<boolean> 供手动提交
 */
export interface LhFormProps {
  model: Record<string, unknown>
  rules?: Record<string, LhFormRule[]>
  labelPosition?: LhFormLabelPosition
  labelWidth?: string | number
  inline?: boolean
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export interface LhFormItemProps {
  prop?: string
  label?: string
  required?: boolean
  rules?: LhFormRule[]
  /** 自定义类名（透传到根节点） */
  customClass?: string
}

export interface LhFormContext {
  model: Record<string, unknown>
  rules?: Record<string, LhFormRule[]>
  labelPosition: LhFormLabelPosition
  labelWidth: string | number | undefined
  registerField: (
    prop: string,
    validate: () => Promise<boolean>,
    reset: () => void,
  ) => () => void
  validateField: (prop: string) => Promise<boolean>
  resetField: (prop: string) => void
}

export interface LhFormItemContext {
  /** 校验错误文案，非空即该校验失败（reactive 代理已解包 ref，直接读字符串） */
  errorMessage: string
}

export const LH_FORM_CONTEXT_KEY: InjectionKey<LhFormContext> = Symbol('LhFormContext')
export const LH_FORM_ITEM_CONTEXT_KEY: InjectionKey<LhFormItemContext> = Symbol('LhFormItemContext')

export type { LhFormRule }
