<template>
  <view
    class="lh-space"
    :class="[spaceClass, customClass]"
    :style="spaceStyle"
    role="presentation"
  >
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { useLhSpace } from './logic'
import type { LhSpaceProps } from './types'

defineOptions({
  name: 'LhSpace',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhSpaceProps>(), {
  direction: 'horizontal',
  size: 'medium',
  wrap: true,
  alignment: 'start',
  customClass: undefined,
  sx: undefined,
})

const { spaceClass, spaceStyle } = useLhSpace(props)
</script>

<style src="./style.css"></style>
