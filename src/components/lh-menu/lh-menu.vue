<template>
  <view
    :class="menuClasses"
    :style="menuStyle"
    :role="menuRole"
    @keydown="onKeydown"
  >
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { useLhMenu } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhMenuProps } from './types'

defineOptions({
  name: 'LhMenu',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhMenuProps>(), {
  modelValue: undefined,
  mode: 'vertical',
  collapse: false,
  defaultOpeneds: () => [],
  openeds: undefined,
  uniqueOpened: false,
  sx: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:openeds': [value: string[]]
  select: [index: string, indexPath: string[]]
  open: [index: string, indexPath: string[]]
  close: [index: string, indexPath: string[]]
}>()

const { menuClasses, menuStyle, menuRole, onKeydown } = useLhMenu(
  props,
  emit as LhEmitFn<'update:modelValue' | 'update:openeds' | 'select' | 'open' | 'close'>,
)
</script>

<style src="./style.css"></style>

<!-- uni-app 独有适配样式：share 无对应产物（plus 的横向菜单依赖浏览器默认溢出）。
     横向模式项目总和超出容器宽度时全端可横向滚动：容器 overflow-x: auto，
     子项 flex-shrink: 0 防止被挤压（MP 端 view 支持 overflow 滚动；
     不套 scroll-view——其 H5 端的内层包裹会破坏 share scss 的 flex 直系子结构，
     与 lh-tabs 的横向头同款问题只能靠容器溢出规避） -->
<style>
.lh-menu--horizontal {
  overflow-x: auto;
}

.lh-menu--horizontal .lh-menu-item,
.lh-menu--horizontal .lh-sub-menu,
.lh-menu--horizontal .lh-menu-item-group {
  flex-shrink: 0;
}
</style>
