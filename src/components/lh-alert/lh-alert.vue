<template>
  <view
    v-if="visible"
    class="lh-alert"
    :class="[alertClass, customClass]"
    :style="sxStyle"
    :role="alertRole"
  >
    <lh-icon
      v-if="props.showIcon"
      :name="iconName"
      class="lh-alert__icon"
    />
    <view class="lh-alert__content">
      <view
        v-if="hasTitle"
        class="lh-alert__title"
      >
        <slot name="title">{{ props.title }}</slot>
      </view>
      <view class="lh-alert__description">
        <slot />
      </view>
    </view>
    <view
      v-if="props.closable"
      class="lh-alert__close"
      role="button"
      :aria-label="closeAriaLabel"
      @click="handleClose"
    >
      <lh-icon
        name="close"
        :size="12"
      />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useLhAlert } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhAlertProps } from './types'

defineOptions({
  name: 'LhAlert',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhAlertProps>(), {
  type: 'info',
  title: undefined,
  closable: false,
  showIcon: false,
  plain: false,
  closeLabel: undefined,
  customClass: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  close: []
}>()

const {
  visible,
  hasTitle,
  alertClass,
  alertRole,
  iconName,
  sxStyle,
  closeAriaLabel,
  handleClose,
} = useLhAlert(props, emit as LhEmitFn<'close'>)
</script>

<style src="./style.css"></style>
