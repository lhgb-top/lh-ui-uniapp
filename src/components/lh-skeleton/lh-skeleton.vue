<template>
  <view
    v-if="props.loading"
    class="lh-skeleton"
    :class="[skeletonClass, customClass]"
    :style="skeletonStyle"
    :aria-busy="true"
    aria-live="polite"
  >
    <lh-skeleton-item
      v-if="props.avatar"
      variant="circle"
      :animated="props.animated"
      class="lh-skeleton__avatar"
    />
    <view class="lh-skeleton__content">
      <lh-skeleton-item
        v-for="(width, i) in rowWidths"
        :key="i"
        variant="text"
        :animated="props.animated"
        :style="{ width }"
      />
    </view>
  </view>
  <slot v-else />
</template>

<script lang="ts" setup>
import { useLhSkeleton } from './logic'
import type { LhSkeletonProps } from './types'

defineOptions({
  name: 'LhSkeleton',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhSkeletonProps>(), {
  loading: true,
  rows: 3,
  avatar: false,
  animated: true,
  customClass: undefined,
  sx: undefined,
})

const { skeletonClass, rowWidths, skeletonStyle } = useLhSkeleton(props)
</script>

<style src="./style.css"></style>
