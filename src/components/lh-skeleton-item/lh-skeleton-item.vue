<template>
  <view
    class="lh-skeleton-item"
    :class="[itemClass, customClass]"
    :style="itemStyle"
    :aria-hidden="ariaHidden"
  />
</template>

<script lang="ts" setup>
import { useLhSkeletonItem } from './logic'
import type { LhSkeletonItemProps } from '../lh-skeleton/types'

defineOptions({
  name: 'LhSkeletonItem',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhSkeletonItemProps>(), {
  variant: 'text',
  animated: true,
  customClass: undefined,
  sx: undefined,
})

const { itemClass, itemStyle, ariaHidden } = useLhSkeletonItem(props)
</script>

<!-- 无独立样式源：share 的 skeleton scss 同时含容器与占位项规则，复用同款净化产物
     （照 lh-checkbox-group 复用 lh-checkbox 样式的先例） -->
<style src="../lh-skeleton/style.css"></style>
