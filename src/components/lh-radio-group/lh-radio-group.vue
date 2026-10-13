<template>
  <view class="lh-radio-group">
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { useLhRadioGroup } from '../lh-radio/logic'
import type { LhRadioGroupProps } from '../lh-radio/types'
import type { LhEmitFn } from '@/types/emit'

defineOptions({
  name: 'LhRadioGroup',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhRadioGroupProps>(), {
  modelValue: undefined,
  disabled: false,
  name: undefined,
  size: 'medium',
})

const emit = defineEmits<{
  'update:modelValue': [value: unknown]
  change: [value: unknown]
}>()

useLhRadioGroup(props, emit as LhEmitFn<'update:modelValue' | 'change'>)
</script>

<style src="../lh-radio/style.css"></style>
