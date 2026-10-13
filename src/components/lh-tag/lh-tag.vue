<template>
  <view
    class="lh-tag"
    :class="[tagClass, customClass]"
    :style="tagStyle"
    @click="handleClick"
  >
    <view class="lh-tag__text">
      <slot />
    </view>
    <view
      v-if="props.closable"
      class="lh-tag__close"
      :class="{ 'lh-tag__close--disabled': props.disabled }"
      @click.stop="handleClose"
    >
      <lh-icon
        name="close"
        :size="12"
      />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useLhTag } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhTagProps } from './types'

defineOptions({
  name: 'LhTag',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhTagProps>(), {
  type: 'default',
  size: 'medium',
  closable: false,
  disabled: false,
  round: false,
  hit: false,
  customClass: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  click: [e: Event]
  close: [e: Event]
}>()

const { tagClass, tagStyle, clickable, closeLabel, handleClose } = useLhTag(props, emit as LhEmitFn<'click' | 'close'>)

function handleClick(e: Event) {
  if (clickable.value) emit('click', e)
}

// closeLabel 经 a11y 语义透传给关闭按钮（小程序 aria 支持有限，仅 H5 生效）
void closeLabel
</script>

<style src="./style.css"></style>
