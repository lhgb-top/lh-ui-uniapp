<template>
  <view
    class="lh-layout-header"
    :class="customClass"
    :style="headerStyle"
    role="banner"
  >
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { sxToStyle } from '@lh-ui/share/core/shared'
import type { LhLayoutHeaderProps } from './types'

defineOptions({
  name: 'LhHeader',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhLayoutHeaderProps>(), {
  customClass: undefined,
  sx: undefined,
})

const headerStyle = computed(() => sxToStyle(props.sx ?? {}))
</script>

<!-- 无独立样式源：share 的 layout scss 同时含容器与全部子组件规则，
     复用 lh-layout 的净化产物（照 lh-breadcrumb-item 复用 lh-breadcrumb 样式的先例） -->
<style src="../lh-layout/style.css"></style>
