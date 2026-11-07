<template>
  <view
    v-if="phase !== 'hidden'"
    :class="buttonClasses"
    :style="backTopStyle"
    role="button"
    :aria-label="label"
    @click="handleClick"
  >
    <slot>
      <lh-icon
        name="arrow-up"
        :size="16"
        aria-hidden="true"
      />
    </slot>
  </view>
</template>

<script lang="ts" setup>
import { useLhBacktop } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhBacktopProps } from './types'

defineOptions({
  name: 'LhBacktop',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhBacktopProps>(), {
  target: undefined,
  scrollTop: undefined,
  visibilityHeight: 200,
  right: 40,
  bottom: 40,
  smooth: true,
  sx: undefined,
})

const emit = defineEmits<{
  click: [event: Event]
  scrollend: [scrollTop: number]
  'update:scrollTop': [scrollTop: number]
}>()

const { phase, buttonClasses, backTopStyle, label, handleClick } = useLhBacktop(
  props,
  emit as LhEmitFn<'click' | 'scrollend' | 'update:scrollTop'>,
)
</script>

<style src="./style.css"></style>
