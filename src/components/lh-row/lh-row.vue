<template>
  <view
    :class="rowClasses"
    :style="rowStyle"
  >
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { useLhRow } from './logic'
import type { LhRowProps } from './types'

defineOptions({
  name: 'LhRow',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhRowProps>(), {
  justify: 'start',
  align: 'top',
  gutter: 0,
  wrap: true,
  customClass: undefined,
  sx: undefined,
})

const { rowClasses, rowStyle } = useLhRow(props)
</script>

<style src="./style.css"></style>
