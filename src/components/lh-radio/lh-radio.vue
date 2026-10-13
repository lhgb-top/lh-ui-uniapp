<template>
  <view
    class="lh-radio"
    :class="[radioClass, customClass]"
    :style="componentStyle"
    @click="toggle"
  >
    <view
      class="lh-radio__box"
      :class="{ 'lh-radio__box--checked': isChecked }"
    >
      <view
        v-if="isChecked"
        class="lh-radio__dot"
      />
    </view>
    <view
      v-if="props.label || $slots.default"
      class="lh-radio__label"
    >
      <slot>{{ props.label }}</slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useLhRadio } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhRadioProps } from './types'

defineOptions({
  name: 'LhRadio',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhRadioProps>(), {
  modelValue: undefined,
  value: undefined,
  label: undefined,
  disabled: false,
  name: undefined,
  size: 'medium',
  customClass: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: unknown]
  change: [value: unknown]
}>()

const { isChecked, radioClass, componentStyle, toggle } = useLhRadio(props, emit as LhEmitFn<'update:modelValue' | 'change'>)
</script>

<style src="./style.css"></style>
