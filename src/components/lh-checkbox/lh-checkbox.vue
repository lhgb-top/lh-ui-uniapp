<template>
  <view
    class="lh-checkbox"
    :class="[checkboxClass, customClass]"
    :style="componentStyle"
    @click="toggle"
  >
    <view
      class="lh-checkbox__box"
      :class="{
        'lh-checkbox__box--checked': isChecked,
        'lh-checkbox__box--indeterminate': props.indeterminate,
      }"
    >
      <lh-icon
        v-if="isChecked && !props.indeterminate"
        name="check"
        :size="12"
        class="lh-checkbox__icon"
      />
      <view
        v-else-if="props.indeterminate"
        class="lh-checkbox__indeterminate"
      />
    </view>
    <view
      v-if="props.label || $slots.default"
      class="lh-checkbox__label"
    >
      <slot>{{ props.label }}</slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useLhCheckbox } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhCheckboxProps } from './types'

defineOptions({
  name: 'LhCheckbox',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhCheckboxProps>(), {
  modelValue: false,
  value: undefined,
  label: undefined,
  disabled: false,
  indeterminate: false,
  name: undefined,
  size: 'medium',
  customClass: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean]
}>()

const { isChecked, checkboxClass, componentStyle, toggle } = useLhCheckbox(props, emit as LhEmitFn<'update:modelValue' | 'change'>)
</script>

<style src="./style.css"></style>
