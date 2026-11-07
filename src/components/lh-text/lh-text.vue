<template>
  <view
    :class="['lh-text', textClass, customClass]"
    :style="[ellipsisStyle, sxStyle]"
    :aria-labelledby="ariaLabelledby"
  >
    <text
      ref="contentRef"
      class="lh-text__content"
    ><slot /></text>
    <view
      v-if="props.copyable && !props.disabled"
      :id="copyButtonId"
      class="lh-text__copy"
      :class="{ 'lh-text__copy--copied': copied }"
      role="button"
      :aria-label="copyButtonLabel"
      @click="handleCopy"
    >
      <text>{{ copyButtonLabel }}</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useLhText } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhTextProps } from './types'

defineOptions({
  name: 'LhText',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhTextProps>(), {
  level: undefined,
  type: undefined,
  strong: false,
  italic: false,
  underline: false,
  mark: false,
  code: false,
  ellipsis: false,
  copyable: false,
  copyLabel: undefined,
  copyText: undefined,
  disabled: false,
  customClass: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  /** 复制按钮点击，参数为实际写入的文本（copyText 或插槽文本） */
  copy: [text: string]
}>()

const {
  contentRef,
  copyButtonId,
  textClass,
  ellipsisStyle,
  sxStyle,
  ariaLabelledby,
  copyButtonLabel,
  copied,
  handleCopy,
} = useLhText(props, emit as LhEmitFn<'copy'>)
</script>

<style src="./style.css"></style>
