import { computed, inject, provide, ref, watch } from 'vue'
import { isCheckboxChecked, toggleCheckboxValue } from '@lh-ui/share/core/checkbox'
import { useLhComponent } from '@/composables'
import { LH_CHECKBOX_GROUP_KEY } from './types'
import type { LhEmitFn } from '@/types/emit'
import type { LhCheckboxProps, LhCheckboxGroupProps, LhCheckboxGroupContext } from './types'

/**
 * Checkbox 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】勾选态由 view 自绘 + lh-icon 渲染，点击直接切换
 * （plus 的原生 input change 事件在 MP 不存在）。
 */
export function useLhCheckbox(
  props: LhCheckboxProps,
  emit: LhEmitFn<'update:modelValue' | 'change'>,
) {
  const { componentStyle } = useLhComponent('checkbox', props)

  const group = inject(LH_CHECKBOX_GROUP_KEY, null)
  const isInGroup = Boolean(group && props.value !== undefined)

  const effectiveSize = computed(() => group?.size.value ?? props.size)
  const isDisabled = computed(() => Boolean(props.disabled || group?.disabled.value))

  const isChecked = computed(() => {
    if (isInGroup && group) return isCheckboxChecked(group.values.value, props.value)
    return Boolean(props.modelValue)
  })

  const checkboxClass = computed(() => {
    const list = [`lh-checkbox--${effectiveSize.value}`]
    if (isChecked.value) list.push('lh-checkbox--checked')
    if (isDisabled.value) list.push('lh-checkbox--disabled')
    if (props.indeterminate) list.push('lh-checkbox--indeterminate')
    return list
  })

  function toggle() {
    if (isDisabled.value) return
    if (isInGroup && group) {
      group.toggle(props.value, !isChecked.value)
      return
    }
    const newValue = !isChecked.value
    emit('update:modelValue', newValue)
    emit('change', newValue)
  }

  return {
    isChecked,
    isDisabled,
    effectiveSize,
    checkboxClass,
    componentStyle,
    toggle,
  }
}

/**
 * CheckboxGroup 胶水：维护选中值数组，provide 给子 Checkbox。
 * 选中值变更走 toggleCheckboxValue（share 纯函数，Object.is 判定 + 不可变更新）。
 */
export function useLhCheckboxGroup(
  props: LhCheckboxGroupProps,
  emit: LhEmitFn<'update:modelValue' | 'change'>,
) {
  // 红线 #6：provide 的是 computed ref 本体，禁止 props 快照——
  // 动态改 disabled / size / name 必须实时传导给子 Checkbox。
  const values = ref<unknown[]>(props.modelValue ?? [])
  const disabled = computed(() => props.disabled ?? false)
  const name = computed(() => props.name)
  const size = computed(() => props.size ?? 'medium')

  // 外部改 modelValue（如「全选/反选」由父组件整体赋值）时同步进内部数组。
  // toggle 内部先改 values 再 emit，父组件 v-model 回写的是同一个数组引用，
  // watch 触发时为同值赋值，不会引发额外渲染。
  watch(
    () => props.modelValue,
    (next) => {
      values.value = next ?? []
    },
  )

  function toggle(value: unknown, checked: boolean) {
    const next = toggleCheckboxValue(values.value, value, checked)
    values.value = next
    emit('update:modelValue', next)
    emit('change', next)
  }

  const context: LhCheckboxGroupContext = {
    values,
    disabled,
    name,
    size,
    toggle,
  }

  provide(LH_CHECKBOX_GROUP_KEY, context)

  return {
    values,
    context,
  }
}
