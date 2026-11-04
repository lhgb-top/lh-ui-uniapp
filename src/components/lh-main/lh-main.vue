<template>
  <view
    class="lh-layout-main"
    :class="customClass"
    :style="mainStyle"
    role="main"
  >
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { sxToStyle } from '@lh-ui/share/core/shared'
import type { LhLayoutMainProps } from './types'

defineOptions({
  name: 'LhMain',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhLayoutMainProps>(), {
  customClass: undefined,
  sx: undefined,
})

const mainStyle = computed(() => sxToStyle(props.sx ?? {}))
</script>

<!-- 无独立样式源：复用 lh-layout 的净化产物（share 的 layout scss 含全部子组件规则） -->
<style src="../lh-layout/style.css"></style>
