import type { InjectionKey, Ref } from 'vue'
import type { LH_SIZE_CONST } from '@lh-ui/share/constants'
import type { LhSxProps } from '@lh-ui/share/core/shared'

export type LhRadioSize = (typeof LH_SIZE_CONST)[keyof typeof LH_SIZE_CONST]

/**
 * Radio 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】不用原生 input radio（MP 样式不可控），改用 view 自绘圆点。
 */
export interface LhRadioProps {
  modelValue?: unknown
  value?: unknown
  label?: string
  disabled?: boolean
  name?: string
  size?: LhRadioSize
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export interface LhRadioGroupProps {
  modelValue?: unknown
  disabled?: boolean
  name?: string
  size?: LhRadioSize
}

export interface LhRadioGroupContext {
  modelValue: Ref<unknown>
  /** 红线 #6：provide 的是 computed ref 本体，禁止 props 快照 */
  disabled: Ref<boolean>
  name: Ref<string | undefined>
  size: Ref<LhRadioSize>
  onChange: (value: unknown) => void
}

export const LH_RADIO_GROUP_KEY: InjectionKey<LhRadioGroupContext> = Symbol('LhRadioGroup')
