<template>
  <view
    :class="colClasses"
    :style="colStyle"
  >
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { useLhCol } from './logic'
import type { LhColProps } from './types'

defineOptions({
  name: 'LhCol',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhColProps>(), {
  span: undefined,
  offset: undefined,
  push: undefined,
  pull: undefined,
  xs: undefined,
  sm: undefined,
  md: undefined,
  lg: undefined,
  xl: undefined,
  sizes: undefined,
  customClass: undefined,
  sx: undefined,
})

const { colClasses, colStyle } = useLhCol(props)
</script>

<!-- 无独立样式源：share 的 grid scss 同时含 lh-row 与 lh-col 规则，
     复用 lh-row 的净化产物（照 lh-breadcrumb-item 复用 lh-breadcrumb 样式的先例） -->
<style src="../lh-row/style.css"></style>
