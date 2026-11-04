<template>
  <view
    :class="itemClasses"
    :style="sxStyle"
  >
    <view class="lh-collapse__header-wrap">
      <view
        :id="headerId"
        class="lh-collapse__header"
        role="button"
        :aria-expanded="expanded"
        :aria-controls="contentId"
        :aria-disabled="props.disabled"
        @click="handleToggle"
      >
        <slot name="title">{{ props.title }}</slot>
        <text
          class="lh-collapse__arrow"
          aria-hidden="true"
        >▾</text>
      </view>
    </view>
    <view
      :id="contentId"
      class="lh-collapse__wrap"
      role="region"
      :aria-labelledby="headerId"
      :aria-hidden="!expanded"
    >
      <view class="lh-collapse__content">
        <slot />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useLhCollapseItem } from './logic'
import type { LhCollapseItemProps } from './types'

defineOptions({
  name: 'LhCollapseItem',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhCollapseItemProps>(), {
  title: undefined,
  disabled: false,
  customClass: undefined,
  sx: undefined,
})

const { expanded, headerId, contentId, itemClasses, sxStyle, handleToggle } =
  useLhCollapseItem(props)
</script>

<!-- 无独立样式源：share 的 collapse scss 同时含容器与项规则，复用同款净化产物
     （照 lh-breadcrumb-item 复用 lh-breadcrumb 样式的先例） -->
<style src="../lh-collapse/style.css"></style>
