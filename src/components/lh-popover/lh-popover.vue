<template>
  <view
    :id="triggerId"
    class="lh-popover"
    :style="triggerStyle"
    :aria-expanded="ariaExpanded"
    :aria-haspopup="ariaHaspopup"
    :aria-controls="ariaControls"
    @click="onTriggerClick"
    @mouseenter="onTriggerMouseenter"
    @mouseleave="onTriggerMouseleave"
    @focusin="onTriggerFocusin"
    @focusout="onTriggerFocusout"
  >
    <slot />

    <lh-root-portal v-if="isVisible">
      <view
        :id="popperId"
        :class="popperClass"
        :style="mergedPopperStyle"
        :role="popperRole"
        :aria-labelledby="ariaLabelledby"
        @click.stop
        @mouseenter="onPopperMouseenter"
        @mouseleave="onPopperMouseleave"
      >
        <view
          v-if="hasTitle"
          :id="titleId"
          class="lh-popover__title"
        >
          <slot name="title">{{ props.title }}</slot>
        </view>
        <view class="lh-popover__content">
          <slot name="content" />
        </view>
        <view
          v-if="props.arrow !== false"
          class="lh-popover__arrow"
        />
      </view>
      <view
        class="lh-popover__mask"
        @click.stop="onMaskClick"
      />
    </lh-root-portal>
  </view>
</template>

<script lang="ts" setup>
import { useLhPopover } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhPopoverProps } from './types'

defineOptions({
  name: 'LhPopover',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhPopoverProps>(), {
  placement: 'top',
  trigger: 'click',
  title: undefined,
  visible: undefined,
  disabled: false,
  arrow: true,
  width: undefined,
  popperClass: undefined,
  showAfter: undefined,
  hideAfter: undefined,
  themeVars: undefined,
  bgPattern: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  show: []
  hide: []
}>()

const {
  triggerId,
  popperId,
  titleId,
  isVisible,
  hasTitle,
  popperClass,
  mergedPopperStyle,
  triggerStyle,
  ariaExpanded,
  ariaHaspopup,
  ariaControls,
  popperRole,
  ariaLabelledby,
  show,
  hide,
  toggle,
  onTriggerClick,
  onTriggerMouseenter,
  onTriggerMouseleave,
  onTriggerFocusin,
  onTriggerFocusout,
  onPopperMouseenter,
  onPopperMouseleave,
  onMaskClick,
} = useLhPopover(
  props,
  emit as LhEmitFn<'update:visible' | 'show' | 'hide'>,
)

defineExpose({ isVisible, show, hide, toggle })
</script>

<style src="./style.css"></style>

<!-- uni-app 独有适配样式：share 无对应产物（plus 的弹出层挂在 body Teleport 下，
     uni-app 走 lh-root-portal 承载 + 页内透明遮罩）。
     lh-root-portal 容器是 pointer-events:none，弹层与遮罩需各自恢复 -->
<style>
.lh-popover__popper {
  pointer-events: auto;
}

.lh-popover__mask {
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
