<template>
  <view
    :class="groupClasses"
    :style="groupStyle"
    role="presentation"
  >
    <view class="lh-menu-item-group__title">
      <slot name="title">{{ props.title }}</slot>
    </view>
    <view
      class="lh-menu-item-group__list"
      role="group"
    >
      <slot />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { getMenuItemGroupClassNames } from '@lh-ui/share/core/menu'
import { sxToStyle } from '@lh-ui/share/core/shared'
import type { LhMenuItemGroupProps } from './types'

defineOptions({
  name: 'LhMenuItemGroup',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhMenuItemGroupProps>(), {
  title: undefined,
  sx: undefined,
})

const groupStyle = computed(() => sxToStyle(props.sx ?? {}))

const groupClasses = computed(() => getMenuItemGroupClassNames())
</script>

<!-- 无独立样式源：share 的 menu scss 同时含容器 / 项 / 子菜单 / 分组规则，
     复用同款净化产物（照 lh-breadcrumb-item / lh-collapse-item 复用父样式的先例） -->
<style src="../lh-menu/style.css"></style>
