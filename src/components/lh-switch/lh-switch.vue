<template>
  <view
    class="lh-switch"
    :class="[switchClass, customClass]"
    :style="switchStyle"
    role="switch"
    :aria-checked="props.modelValue"
    :aria-disabled="props.disabled"
    @click="toggle"
  >
    <view class="lh-switch__core">
      <lh-icon
        v-if="props.loading"
        name="loading"
        class="lh-switch__loading"
        :size="12"
      />
    </view>
    <text
      v-if="props.activeText || props.inactiveText"
      class="lh-switch__label"
    >
      {{ switchLabel }}
    </text>
  </view>
</template>

<script lang="ts" setup>
import { useLhSwitch } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhSwitchProps } from './types'

defineOptions({
  name: 'LhSwitch',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhSwitchProps>(), {
  modelValue: false,
  disabled: false,
  loading: false,
  name: '',
  size: 'medium',
  activeText: '',
  inactiveText: '',
  customClass: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean]
}>()

const { switchClass, switchLabel, switchStyle, toggle } = useLhSwitch(props, emit as LhEmitFn<'update:modelValue' | 'change'>)
</script>

<style src="./style.css"></style>
