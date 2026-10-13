import { computed, inject, provide, ref, watch } from 'vue'
import { isRadioChecked } from '@lh-ui/share/core/radio'
import { useLhComponent } from '@/composables'
import { LH_RADIO_GROUP_KEY } from './types'
import type { LhEmitFn } from '@/types/emit'
import type { LhRadioProps, LhRadioGroupProps, LhRadioGroupContext } from './types'

/**
 * Radio 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】选中态由 view 自绘圆点，点击直接切换
 * （plus 的原生 input change 事件在 MP 不存在）。
 */
export function useLhRadio(
  props: LhRadioProps,
  emit: LhEmitFn<'update:modelValue' | 'change'>,
) {
  const { componentStyle } = useLhComponent('radio', props)

  const group = inject(LH_RADIO_GROUP_KEY, null)

  const effectiveSize = computed(() => group?.size.value ?? props.size)
  const isDisabled = computed(() => Boolean(props.disabled || group?.disabled.value))

  const isChecked = computed(() => {
    const model = group?.modelValue.value ?? props.modelValue
    // share 的 isRadioChecked 只读 modelValue/value；LhRadioState 里的 checked 是
    // 给 getRadioClassNames 用的，这里用断言补齐类型，不造假值
    return isRadioChecked({ modelValue: model, value: props.value } as never)
  })

  const radioClass = computed(() => {
    const list = [`lh-radio--${effectiveSize.value}`]
    if (isChecked.value) list.push('lh-radio--checked')
    if (isDisabled.value) list.push('lh-radio--disabled')
    return list
  })

  function toggle() {
    if (isDisabled.value || isChecked.value) return
    if (group) {
      group.onChange(props.value)
      return
    }
    emit('update:modelValue', props.value)
    emit('change', props.value)
  }

  return {
    isChecked,
    isDisabled,
    effectiveSize,
    radioClass,
    componentStyle,
    toggle,
  }
}

/**
 * RadioGroup 胶水：维护选中值，provide 给子 Radio。
 */
export function useLhRadioGroup(
  props: LhRadioGroupProps,
  emit: LhEmitFn<'update:modelValue' | 'change'>,
) {
  // 红线 #6：provide 的是 computed ref 本体，禁止 props 快照——
  // 动态改 disabled / size / name 必须实时传导给子 Radio。
  const modelValue = ref(props.modelValue)
  const disabled = computed(() => props.disabled ?? false)
  const name = computed(() => props.name)
  const size = computed(() => props.size ?? 'medium')

  // 外部整体改 modelValue（如「上一步/下一步」重置选项）时同步进内部值。
  // onChange 内部先改 modelValue 再 emit，父组件 v-model 回写的是同一个原始值，
  // watch 触发时为同值赋值，不会引发额外渲染。
  watch(
    () => props.modelValue,
    (next) => {
      modelValue.value = next
    },
  )

  function onChange(value: unknown) {
    modelValue.value = value
    emit('update:modelValue', value)
    emit('change', value)
  }

  const context: LhRadioGroupContext = {
    modelValue,
    disabled,
    name,
    size,
    onChange,
  }

  provide(LH_RADIO_GROUP_KEY, context)

  return {
    modelValue,
    context,
  }
}
