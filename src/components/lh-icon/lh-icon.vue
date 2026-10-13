<template>
  <text :class="iconClass" :style="componentStyle">
    <text v-if="hasIcon" :class="iconfontClass" :style="iconStyle" />
    <slot v-else />
  </text>
</template>

<script lang="ts" setup>
import { useLhIcon } from './logic'
import type { LhIconProps } from './types'

defineOptions({
  name: 'LhIcon',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhIconProps>(), {
  name: undefined,
  size: undefined,
  color: undefined,
  customClass: undefined,
  themeVars: undefined,
  bgPattern: undefined,
})

const { hasIcon, iconClass, iconfontClass, iconStyle, componentStyle } = useLhIcon(props)
</script>

<style src="./style.css"></style>
