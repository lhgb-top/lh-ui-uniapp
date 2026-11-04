<template>
  <view
    class="lh-layout-footer"
    :class="customClass"
    :style="footerStyle"
    role="contentinfo"
  >
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { sxToStyle } from '@lh-ui/share/core/shared'
import type { LhLayoutFooterProps } from './types'

defineOptions({
  name: 'LhFooter',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhLayoutFooterProps>(), {
  customClass: undefined,
  sx: undefined,
})

const footerStyle = computed(() => sxToStyle(props.sx ?? {}))
</script>

<!-- 无独立样式源：复用 lh-layout 的净化产物（share 的 layout scss 含全部子组件规则） -->
<style src="../lh-layout/style.css"></style>
