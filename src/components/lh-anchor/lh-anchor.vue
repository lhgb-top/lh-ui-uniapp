<template>
  <view
    :class="anchorClasses"
    :style="anchorStyle"
    role="navigation"
    :aria-label="label"
  >
    <view class="lh-anchor__list">
      <view
        v-for="item in flatItems"
        :key="item.id"
        class="lh-anchor__item"
      >
        <view
          :class="linkClasses(item.id, item.level)"
          :aria-current="activeId === item.id ? 'location' : undefined"
          @click="handleLinkClick(item.id)"
        ><text>{{ item.title }}</text></view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useLhAnchor } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhAnchorProps } from './types'

defineOptions({
  name: 'LhAnchor',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhAnchorProps>(), {
  items: () => [],
  target: undefined,
  scrollTop: undefined,
  offset: 0,
  direction: 'vertical',
  smooth: true,
  sx: undefined,
})

const emit = defineEmits<{
  change: [id: string]
  click: [id: string]
  'update:scrollIntoView': [id: string]
}>()

const {
  flatItems,
  activeId,
  anchorClasses,
  anchorStyle,
  label,
  linkClasses,
  handleLinkClick,
} = useLhAnchor(
  props,
  emit as LhEmitFn<'change' | 'click' | 'update:scrollIntoView'>,
)
</script>

<style src="./style.css"></style>
