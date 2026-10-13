import { computed } from 'vue'
import { sxToStyle } from '@lh-ui/share/core/shared'
import { getSwitchClassNames, getSwitchLabel } from '@lh-ui/share/core/switch'
import { useLhComponent } from '@/composables'
import type { LhEmitFn } from '@/types/emit'
import type { LhSwitchResolvedProps } from './types'

/**
 * Switch 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】键盘激活（@keyup）在小程序不存在，仅保留点击切换。
 */
export function useLhSwitch(
  props: LhSwitchResolvedProps,
  emit: LhEmitFn<'update:modelValue' | 'change'>,
) {
  const { componentStyle } = useLhComponent('switch', props)

  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  /** share 纯函数的完整入参（getClassNames / getLabel 共用一份） */
  const switchState = computed(() => ({
    checked: props.modelValue,
    disabled: props.disabled,
    loading: props.loading,
    name: props.name,
    size: props.size,
    activeText: props.activeText,
    inactiveText: props.inactiveText,
  }))

  const switchClass = computed(() => getSwitchClassNames(switchState.value))

  const switchLabel = computed(() => getSwitchLabel(switchState.value))

  const switchStyle = computed(() => ({
    ...componentStyle.value,
    ...sxStyle.value,
  }))

  function toggle() {
    if (props.disabled || props.loading) return
    const newValue = !props.modelValue
    emit('update:modelValue', newValue)
    emit('change', newValue)
  }

  return {
    switchClass,
    switchLabel,
    switchStyle,
    toggle,
  }
}
