<template>
  <view
    :id="triggerId"
    class="lh-popconfirm"
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
        aria-modal="true"
        :aria-labelledby="titleId"
        @click.stop
        @mouseenter="onPopperMouseenter"
        @mouseleave="onPopperMouseleave"
      >
        <view class="lh-popconfirm__main">
          <lh-icon
            v-if="props.showIcon"
            :name="iconName"
            class="lh-popconfirm__icon"
            aria-hidden="true"
          />
          <view
            :id="titleId"
            class="lh-popconfirm__title"
          >
            <slot name="content">{{ props.title }}</slot>
          </view>
        </view>
        <view class="lh-popconfirm__actions">
          <lh-button
            size="small"
            @click="handleCancel"
          >
            {{ cancelLabel }}
          </lh-button>
          <lh-button
            size="small"
            :type="props.confirmButtonType"
            @click="handleConfirm"
          >
            {{ confirmLabel }}
          </lh-button>
        </view>
        <view class="lh-popconfirm__arrow" />
      </view>
      <view
        class="lh-popconfirm__mask"
        @click.stop="onMaskClick"
      />
    </lh-root-portal>
  </view>
</template>

<script lang="ts" setup>
import { useLhPopconfirm } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhPopconfirmProps } from './types'

defineOptions({
  name: 'LhPopconfirm',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhPopconfirmProps>(), {
  type: 'warning',
  placement: 'top',
  trigger: 'click',
  title: undefined,
  confirmText: undefined,
  cancelText: undefined,
  confirmButtonType: 'primary',
  visible: undefined,
  disabled: false,
  showIcon: true,
  popperClass: undefined,
  showAfter: undefined,
  hideAfter: undefined,
  themeVars: undefined,
  bgPattern: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  confirm: []
  cancel: []
  show: []
  hide: []
}>()

const {
  triggerId,
  popperId,
  titleId,
  isVisible,
  iconName,
  confirmLabel,
  cancelLabel,
  popperClass,
  mergedPopperStyle,
  triggerStyle,
  ariaExpanded,
  ariaHaspopup,
  ariaControls,
  popperRole,
  show,
  hide,
  toggle,
  handleConfirm,
  handleCancel,
  onTriggerClick,
  onTriggerMouseenter,
  onTriggerMouseleave,
  onTriggerFocusin,
  onTriggerFocusout,
  onPopperMouseenter,
  onPopperMouseleave,
  onMaskClick,
} = useLhPopconfirm(
  props,
  emit as LhEmitFn<'update:visible' | 'confirm' | 'cancel' | 'show' | 'hide'>,
)

defineExpose({ isVisible, show, hide, toggle })
</script>

<style src="./style.css"></style>

<!-- uni-app 独有适配样式：share 无对应产物（plus 的弹出层挂在 body Teleport 下，
     uni-app 走 lh-root-portal 承载 + 页内透明遮罩）。
     lh-root-portal 容器是 pointer-events:none，弹层与遮罩需各自恢复 -->
<style>
.lh-popconfirm__popper {
  pointer-events: auto;
}

.lh-popconfirm__mask {
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
