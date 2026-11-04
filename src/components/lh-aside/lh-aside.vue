<template>
  <view
    class="lh-layout-aside"
    :class="customClass"
    :style="asideStyle"
    role="complementary"
    :aria-label="ariaLabel"
  >
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { computed, inject, onMounted, onUnmounted } from 'vue'
import { sxToStyle } from '@lh-ui/share/core/shared'
import { LH_LAYOUT_KEY } from '../lh-layout/types'
import type { LhLayoutAsideProps } from './types'

defineOptions({
  name: 'LhAside',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhLayoutAsideProps>(), {
  width: undefined,
  ariaLabel: undefined,
  customClass: undefined,
  sx: undefined,
})

// 极简 inject：挂载时登记、卸载时注销，父级 Layout 据此切换为垂直方向（与 plus 同构）
const context = inject(LH_LAYOUT_KEY, null)
onMounted(() => context?.registerAside())
onUnmounted(() => context?.unregisterAside())

const asideStyle = computed(() => {
  const style: Record<string, string> = { ...sxToStyle(props.sx ?? {}) }
  if (props.width != null) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  return style
})
</script>

<!-- 无独立样式源：复用 lh-layout 的净化产物（share 的 layout scss 含全部子组件规则） -->
<style src="../lh-layout/style.css"></style>
