<template>
  <view class="lh-checkbox-group">
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { useLhCheckboxGroup } from '../lh-checkbox/logic'
import type { LhCheckboxGroupProps } from '../lh-checkbox/types'
import type { LhEmitFn } from '@/types/emit'

defineOptions({
  name: 'LhCheckboxGroup',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhCheckboxGroupProps>(), {
  modelValue: () => [],
  disabled: false,
  name: undefined,
  size: 'medium',
})

const emit = defineEmits<{
  'update:modelValue': [value: unknown[]]
  change: [value: unknown[]]
}>()

useLhCheckboxGroup(props, emit as LhEmitFn<'update:modelValue' | 'change'>)
</script>

<style src="../lh-checkbox/style.css"></style>
