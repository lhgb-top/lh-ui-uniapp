<template>
  <view
    :id="uid"
    ref="rootRef"
    :class="rootClasses"
    :style="sxStyle"
    role="list"
  >
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { useLhSteps } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhStepsProps } from './types'

defineOptions({
  name: 'LhSteps',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhStepsProps>(), {
  current: 0,
  direction: 'horizontal',
  clickable: false,
  status: undefined,
  customClass: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  'update:current': [index: number]
  change: [index: number]
}>()

const { uid, rootRef, rootClasses, sxStyle } = useLhSteps(
  props,
  emit as LhEmitFn<'update:current' | 'change'>,
)
</script>

<style src="./style.css"></style>
