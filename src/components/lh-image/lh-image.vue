<template>
  <view
    class="lh-image"
    :class="[imageModifiers, props.customClass]"
    :style="imageStyle"
  >
    <!-- 图片分支：加载失败后整棵卸载，换失败占位（与 plus 的 v-if=!error 同口径） -->
    <image
      v-if="!error"
      class="lh-image__inner"
      :class="innerClass"
      :src="props.src"
      :alt="props.alt"
      :mode="imageMode"
      :lazy-load="props.lazy"
      @load="handleLoad"
      @error="handleError"
      @click="openPreview"
    />
    <view
      v-else
      class="lh-image__error"
    >
      <slot name="error">{{ errorText }}</slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useLhImage } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhImageProps } from './types'

defineOptions({
  name: 'LhImage',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhImageProps>(), {
  fit: 'cover',
  preview: false,
  previewSrcList: undefined,
  lazy: false,
  customClass: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  load: [event: Event]
  error: [event: Event]
}>()

const {
  error,
  imageMode,
  innerClass,
  imageModifiers,
  imageStyle,
  errorText,
  handleLoad,
  handleError,
  openPreview,
} = useLhImage(props, emit as LhEmitFn<'load' | 'error'>)
</script>

<style src="./style.css"></style>
