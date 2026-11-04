<template>
  <view
    :class="itemClasses"
    :style="sxStyle"
    role="listitem"
  >
    <view class="lh-timeline__dot-wrap">
      <view
        class="lh-timeline__dot"
        aria-hidden="true"
      >
        <slot name="dot" />
      </view>
    </view>
    <view class="lh-timeline__body">
      <view
        v-if="props.timestamp || hasTimestampSlot"
        class="lh-timeline__timestamp"
      >
        <slot name="timestamp">{{ props.timestamp }}</slot>
      </view>
      <view class="lh-timeline__content">
        <slot />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, inject, onUnmounted, useSlots } from 'vue'
import { getTimelineItemClassNames, getTimelineSide } from '@lh-ui/share/core/timeline'
import { sxToStyle } from '@lh-ui/share/core/shared'
import { LH_TIMELINE_KEY } from '../lh-timeline/types'
import type { LhTimelineItemProps } from './types'

defineOptions({
  name: 'LhTimelineItem',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhTimelineItemProps>(), {
  timestamp: undefined,
  type: undefined,
  hollow: false,
  customClass: undefined,
  sx: undefined,
})

const slots = useSlots()
const context = inject(LH_TIMELINE_KEY, null)

// setup 阶段注册 token，顺序即渲染顺序；卸载时注销
const token = Symbol('timeline-item')
if (context) {
  context.itemTokens.value.push(token)
  onUnmounted(() => {
    context.itemTokens.value = context.itemTokens.value.filter((item) => item !== token)
  })
}

// 脱离 LhTimeline 单用兜底：按 left 模式、视为唯一节点渲染
const ownIndex = computed(() => (context ? context.itemTokens.value.indexOf(token) : 0))
const isLast = computed(() =>
  context ? ownIndex.value === context.itemTokens.value.length - 1 : true,
)
const side = computed(() =>
  context?.mode.value === 'alternate' ? getTimelineSide(ownIndex.value) : 'left',
)

const itemClasses = computed(() => [
  ...getTimelineItemClassNames({
    type: props.type,
    hollow: !!props.hollow,
    side: side.value,
    isLast: isLast.value,
  }),
  props.customClass,
])

const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

const hasTimestampSlot = computed(() => Boolean(slots.timestamp))
</script>

<!-- 无独立样式源：share 的 timeline scss 同时含容器与条目规则，复用同款净化产物
     （照 lh-breadcrumb-item 复用 lh-breadcrumb 样式的先例） -->
<style src="../lh-timeline/style.css"></style>
