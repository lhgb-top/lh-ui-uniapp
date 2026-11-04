<template>
  <view
    :class="layoutClasses"
    :style="sxStyle"
  >
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { useLhLayout } from './logic'
import type { LhLayoutProps } from './types'

defineOptions({
  name: 'LhLayout',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhLayoutProps>(), {
  direction: 'horizontal',
  customClass: undefined,
  sx: undefined,
})

const { layoutClasses, sxStyle } = useLhLayout(props)
</script>

<style src="./style.css"></style>
