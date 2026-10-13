import { inject, onBeforeUnmount, onMounted, provide, reactive, ref } from 'vue'
import {
  getFormFieldValue,
  validateFormField,
} from '@lh-ui/share/core/form'
import { LH_FORM_CONTEXT_KEY, LH_FORM_ITEM_CONTEXT_KEY } from './types'
import type {
  LhFormProps,
  LhFormItemProps,
  LhFormContext,
  LhFormItemContext,
} from './types'

/**
 * Form 组件胶水（逻辑对齐 plus 仓）
 *
 * 字段注册表：form-item 挂载时把自己的 validate 方法注册进来，
 * form.validate() 遍历全部字段；校验逻辑全部调 share 的纯函数。
 */
export function useLhForm(props: LhFormProps) {
  /** 字段注册表：prop -> { validate, reset }（reset 清错误文案，不重新校验） */
  const fields = new Map<string, { validate: () => Promise<boolean>; reset: () => void }>()

  /** 初始值快照：form-item 挂载注册时拍下，resetField 恢复到这里（对齐 plus 仓） */
  const initialValues = new Map<string, unknown>()

  async function validateField(prop: string): Promise<boolean> {
    const field = fields.get(prop)
    if (!field) return true
    return field.validate()
  }

  async function validate(): Promise<boolean> {
    const results = await Promise.all(
      [...fields.keys()].map((prop) => validateField(prop)),
    )
    return results.every(Boolean)
  }

  function resetField(prop?: string) {
    // 空参守卫：resetField() 不传字段名时直接返回，避免 prop.split 抛 TypeError
    if (!prop) return
    const segments = prop.split('.')
    const lastKey = segments.pop()
    if (!lastKey) return
    const model = props.model
    let target: Record<string, unknown> = model
    for (const key of segments) {
      target = target[key] as Record<string, unknown>
    }
    // 恢复到挂载时的初始值（无快照时保持空串语义），并清除该字段的错误文案
    const initial = initialValues.get(prop)
    target[lastKey] = initial === undefined ? '' : initial
    fields.get(prop)?.reset()
  }

  /**
   * 重置全部已注册字段（对齐 plus 仓的 resetFields）。
   * 遍历字段注册表而非 props.rules，确保只重置实际渲染的 form-item。
   */
  function resetFields() {
    ;[...fields.keys()].forEach(resetField)
  }

  function registerField(prop: string, validate: () => Promise<boolean>, reset: () => void) {
    fields.set(prop, { validate, reset })
    // 首次注册时拍初始值快照（重复注册不覆盖，保留最早状态）
    if (!initialValues.has(prop)) {
      initialValues.set(prop, getFormFieldValue(props.model, prop))
    }
    return () => {
      fields.delete(prop)
    }
  }

  const context: LhFormContext = {
    model: props.model,
    rules: props.rules,
    labelPosition: props.labelPosition ?? 'right',
    labelWidth: props.labelWidth,
    registerField,
    validateField,
    resetField,
  }

  provide(LH_FORM_CONTEXT_KEY, context)

  return {
    validate,
    validateField,
    resetField,
    resetFields,
  }
}

/**
 * FormItem 组件胶水（逻辑对齐 plus 仓）
 *
 * 校验调用 share 的 validateFormField（支持 required/类型/pattern/min/max/len/异步 validator，
 * 不短路，返回首个错误文案）；错误态经 LH_FORM_ITEM_CONTEXT_KEY 注入给子控件。
 *
 * 【uni-app 差异】校验触发时机由各控件的 blur/input 事件驱动
 * （plus 的 change 语义在 MP 不存在），form-item 暴露 validate 供父组件手动调用。
 */
export function useLhFormItem(props: LhFormItemProps) {
  const errorMessage = ref('')

  const itemContext: LhFormItemContext = reactive({
    errorMessage,
  })
  provide(LH_FORM_ITEM_CONTEXT_KEY, itemContext)

  const formContext = inject(LH_FORM_CONTEXT_KEY, null)

  async function validate(): Promise<boolean> {
    if (!props.prop || !formContext) {
      errorMessage.value = ''
      return true
    }

    const value = getFormFieldValue(formContext.model, props.prop)
    const rules = props.rules ?? formContext.rules?.[props.prop] ?? []

    if (rules.length === 0) {
      errorMessage.value = ''
      return true
    }

    try {
      const message = await validateFormField(
        value,
        rules,
        formContext.model,
        `${props.label ?? props.prop}不能为空`,
      )
      errorMessage.value = message ?? ''
      return !message
    } catch {
      errorMessage.value = '校验异常'
      return false
    }
  }

  function reset() {
    errorMessage.value = ''
  }

  // 挂载时向 form 注册自己，卸载时注销（由 register 返回的清理函数兜底）
  let unregister: (() => void) | undefined
  onMounted(() => {
    if (props.prop && formContext) {
      unregister = formContext.registerField(props.prop, validate, reset)
    }
  })
  onBeforeUnmount(() => {
    unregister?.()
  })

  return {
    errorMessage,
    validate,
    reset,
  }
}
