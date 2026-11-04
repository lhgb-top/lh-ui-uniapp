<template>
  <view
    :class="collapseClasses"
    :style="sxStyle"
  >
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { useLhCollapse } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhCollapseProps } from './types'

defineOptions({
  name: 'LhCollapse',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhCollapseProps>(), {
  modelValue: undefined,
  accordion: false,
  customClass: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: LhCollapseProps['modelValue']]
  change: [value: LhCollapseProps['modelValue']]
}>()

const { collapseClasses, sxStyle } = useLhCollapse(
  props,
  emit as LhEmitFn<'update:modelValue' | 'change'>,
)
</script>

<style src="./style.css"></style>
