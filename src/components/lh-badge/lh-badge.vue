<template>
  <view
    class="lh-badge"
    :class="[badgeClass, customClass]"
    :style="sxStyle"
  >
    <slot />
    <view
      v-if="contentVisible"
      class="lh-badge__content"
      :class="zoomClass"
      :style="badgeStyle"
      :aria-hidden="props.isDot"
    >
      <text v-if="!props.isDot">{{ displayValue }}</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useLhBadge } from './logic'
import type { LhBadgeProps } from './types'

defineOptions({
  name: 'LhBadge',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhBadgeProps>(), {
  type: 'danger',
  value: undefined,
  size: 'medium',
  max: 99,
  isDot: false,
  hidden: false,
  offset: undefined,
  showZero: false,
  content: undefined,
  customClass: undefined,
  sx: undefined,
})

const {
  displayValue,
  badgeClass,
  badgeStyle,
  contentVisible,
  zoomClass,
  sxStyle,
} = useLhBadge(props)
</script>

<style src="./style.css"></style>
