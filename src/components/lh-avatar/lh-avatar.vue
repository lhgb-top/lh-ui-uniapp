<template>
  <view
    class="lh-avatar"
    :class="[avatarClass, customClass]"
    :style="avatarStyle"
    :role="avatarRole"
    :aria-label="avatarRole ? props.alt : undefined"
  >
    <image
      v-if="showImage"
      class="lh-avatar__img"
      :src="props.src"
      :mode="imageMode"
      :alt="props.alt || props.text || 'avatar'"
      @error="handleError"
    />
    <lh-icon
      v-else-if="props.icon"
      :name="props.icon"
      class="lh-avatar__icon"
    />
    <text
      v-else-if="avatarText"
      class="lh-avatar__text"
    >
      {{ avatarText }}
    </text>
    <slot v-else />
  </view>
</template>

<script lang="ts" setup>
import { useLhAvatar } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhAvatarProps } from './types'

defineOptions({
  name: 'LhAvatar',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhAvatarProps>(), {
  src: undefined,
  alt: undefined,
  icon: undefined,
  text: undefined,
  shape: 'circle',
  size: 'medium',
  fit: 'cover',
  customClass: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  error: [e: Event]
}>()

const {
  showImage,
  imageMode,
  avatarClass,
  avatarText,
  avatarStyle,
  avatarRole,
  handleError,
} = useLhAvatar(props, emit as LhEmitFn<'error'>)
</script>

<style src="./style.css"></style>
