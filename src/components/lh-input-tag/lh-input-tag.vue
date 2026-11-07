<template>
  <view
    :class="['lh-input-tag', inputTagClass, customClass]"
    :style="sxStyle"
    @click="focusInput"
  >
    <view
      v-for="(tag, index) in tags"
      :key="`${tag}-${index}`"
      class="lh-input-tag__tag"
    >
      <text class="lh-input-tag__tag-text">{{ tag }}</text>
      <view
        v-if="!props.readonly && !props.disabled"
        class="lh-input-tag__tag-close"
        role="button"
        :aria-label="removeTagLabel"
        @click.stop="removeTag(index)"
      >
        <text>×</text>
      </view>
    </view>
    <input
      class="lh-input-tag__input"
      :value="inputValue"
      :focus="focused"
      :placeholder="placeholderText"
      :placeholder-style="props.placeholderStyle"
      :disabled="props.disabled"
      confirm-type="done"
      :aria-label="ariaLabelText"
      @input="onInput"
      @blur="onBlur"
      @focus="onFocus"
      @confirm="onConfirm"
      @keydown="onKeydown"
    >
  </view>
</template>

<script lang="ts" setup>
import { useLhInputTag } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhInputTagProps } from './types'

defineOptions({
  name: 'LhInputTag',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhInputTagProps>(), {
  modelValue: () => [],
  trigger: 'enter',
  placeholder: '',
  placeholderStyle: undefined,
  max: 0,
  allowDuplicate: false,
  readonly: false,
  disabled: false,
  ariaLabel: undefined,
  customClass: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  change: [value: string[]]
  /** 提交单个标签 */
  add: [tag: string]
  /** 移除单个标签 */
  remove: [tag: string]
}>()

const {
  inputValue,
  focused,
  tags,
  inputTagClass,
  sxStyle,
  ariaLabelText,
  removeTagLabel,
  placeholderText,
  onInput,
  onBlur,
  onFocus,
  onConfirm,
  onKeydown,
  commit,
  removeTag,
  focusInput,
} = useLhInputTag(
  props,
  emit as LhEmitFn<'update:modelValue' | 'change' | 'add' | 'remove'>,
)

defineExpose({ focus: focusInput, commit })
</script>

<style src="./style.css"></style>
