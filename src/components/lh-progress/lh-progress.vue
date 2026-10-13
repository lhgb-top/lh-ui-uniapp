<template>
  <view
    class="lh-progress"
    :class="[progressClass, customClass]"
    :style="progressStyle"
    role="progressbar"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="clamped"
    :aria-valuetext="text"
  >
    <view
      class="lh-progress__bar"
      :style="{ height: `${props.strokeWidth}px` }"
    >
      <view
        class="lh-progress__bar-inner"
        :style="barStyle"
      />
    </view>
    <view
      v-if="props.showText"
      class="lh-progress__text"
    >
      <slot
        name="text"
        :percentage="clamped"
      >
        {{ text }}
      </slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useLhProgress } from './logic'
import type { LhProgressProps } from './types'

defineOptions({
  name: 'LhProgress',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhProgressProps>(), {
  percentage: 0,
  type: 'line',
  status: 'normal',
  color: undefined,
  strokeWidth: 6,
  width: 126,
  showText: true,
  format: undefined,
  customClass: undefined,
  sx: undefined,
})

const { clamped, progressClass, progressStyle, barStyle, text } = useLhProgress(props)
</script>

<style src="./style.css"></style>
