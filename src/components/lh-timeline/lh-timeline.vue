<template>
  <view
    :class="rootClasses"
    :style="sxStyle"
    role="list"
  >
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { useLhTimeline } from './logic'
import type { LhTimelineProps } from './types'

defineOptions({
  name: 'LhTimeline',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhTimelineProps>(), {
  mode: 'left',
  customClass: undefined,
  sx: undefined,
})

const { sxStyle, rootClasses } = useLhTimeline(props)
</script>

<!-- 无独立样式产物：share 的 timeline scss 同时含容器与条目规则，
     style.css 由 scripts/build-styles.mjs 净化生成（构建产物，禁止手改） -->
<style src="./style.css"></style>
