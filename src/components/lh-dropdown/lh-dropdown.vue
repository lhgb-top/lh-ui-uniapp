<template>
  <view
    :id="triggerId"
    class="lh-dropdown"
    :style="triggerStyle"
    :aria-expanded="ariaExpanded"
    :aria-haspopup="ariaHaspopup"
    :aria-controls="ariaControls"
    @click="onTriggerClick"
    @longpress="onTriggerLongpress"
    @mouseenter="onTriggerMouseenter"
    @mouseleave="onTriggerMouseleave"
  >
    <slot />

    <lh-root-portal v-if="isVisible">
      <view
        :id="popperId"
        :class="menuClass"
        :style="menuStyle"
        :role="menuRole"
        @click.stop
        @mouseenter="onMenuMouseenter"
        @mouseleave="onMenuMouseleave"
        @keydown="onMenuKeydown"
      >
        <slot name="dropdown" />
      </view>
      <view
        class="lh-dropdown__mask"
        @click.stop="onMaskClick"
      />
    </lh-root-portal>
  </view>
</template>

<script lang="ts" setup>
import { provide } from 'vue'
import { useLhDropdown } from './logic'
import { LH_DROPDOWN_KEY } from './types'
import type { LhEmitFn } from '@/types/emit'
import type { LhDropdownProps } from './types'

defineOptions({
  name: 'LhDropdown',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhDropdownProps>(), {
  trigger: 'click',
  placement: 'bottom-start',
  visible: undefined,
  disabled: false,
  hideOnClick: true,
  popperClass: undefined,
  maxHeight: undefined,
  themeVars: undefined,
  bgPattern: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  command: [command: string | number | undefined]
  'visible-change': [value: boolean]
}>()

const {
  triggerId,
  popperId,
  isVisible,
  context,
  menuClass,
  menuStyle,
  triggerStyle,
  ariaExpanded,
  ariaHaspopup,
  ariaControls,
  menuRole,
  show,
  hide,
  toggle,
  onTriggerClick,
  onTriggerLongpress,
  onTriggerMouseenter,
  onTriggerMouseleave,
  onMenuMouseenter,
  onMenuMouseleave,
  onMenuKeydown,
  onMaskClick,
} = useLhDropdown(
  props,
  emit as LhEmitFn<'update:visible' | 'command' | 'visible-change'>,
)

provide(LH_DROPDOWN_KEY, context)

defineExpose({ isVisible, show, hide, toggle })
</script>

<style src="./style.css"></style>

<!-- uni-app 独有适配样式：share 无对应产物（plus 的菜单挂在 body Teleport 下，
     uni-app 走 lh-root-portal 承载 + 页内透明遮罩）。
     lh-root-portal 容器是 pointer-events:none，菜单与遮罩需各自恢复 -->
<style>
.lh-dropdown__menu {
  pointer-events: auto;
}

.lh-dropdown__mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  background-color: transparent;
  z-index: -1;
}
</style>
