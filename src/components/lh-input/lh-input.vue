<template>
  <view
    class="lh-input"
    :class="inputClass"
    :style="inputStyle"
  >
    <lh-icon
      v-if="props.prefixIcon"
      :name="props.prefixIcon"
      class="lh-input__prefix-icon"
    />

    <textarea
      v-if="isTextarea"
      class="lh-input__inner"
      :value="inputValue"
      :placeholder="props.placeholder"
      :placeholder-style="placeholderStyle"
      :placeholder-class="props.placeholderClass"
      :maxlength="props.maxlength"
      :disabled="props.disabled"
      :readonly="props.readonly"
      :auto-height="props.autosize"
      :name="props.name"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <input
      v-else
      class="lh-input__inner"
      :value="inputValue"
      :type="innerType"
      :password="props.password || props.type === 'password'"
      :placeholder="props.placeholder"
      :placeholder-style="placeholderStyle"
      :placeholder-class="props.placeholderClass"
      :maxlength="props.maxlength"
      :disabled="props.disabled"
      :readonly="props.readonly"
      :name="props.name"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <view
      v-if="props.clearable && inputValue && !props.disabled && !props.readonly"
      class="lh-input__clear"
      @click="handleClear"
    >
      <lh-icon
        name="close"
        :size="14"
      />
    </view>

    <lh-icon
      v-if="props.suffixIcon"
      :name="props.suffixIcon"
      class="lh-input__suffix-icon"
    />

    <text
      v-if="showWordLimit && props.maxlength"
      class="lh-input__count"
    >
      {{ wordCount }}
    </text>
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useLhInput } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhInputProps } from './types'

defineOptions({
  name: 'LhInput',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhInputProps>(), {
  modelValue: '',
  type: 'text',
  size: undefined,
  disabled: false,
  readonly: false,
  placeholder: undefined,
  placeholderStyle: undefined,
  placeholderClass: undefined,
  maxlength: undefined,
  minlength: undefined,
  showWordLimit: false,
  clearable: false,
  prefixIcon: undefined,
  suffixIcon: undefined,
  state: undefined,
  name: undefined,
  password: false,
  autosize: false,
  label: undefined,
  customClass: undefined,
  themeVars: undefined,
  bgPattern: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  input: [value: string]
  blur: [value: string]
  focus: [e: Event]
  clear: []
}>()

const {
  inputValue,
  isTextarea,
  wordCount,
  showWordLimit,
  inputClass,
  inputStyle,
  placeholderStyle,
  handleInput,
  handleBlur,
  handleFocus,
  handleClear,
} = useLhInput(props, emit as LhEmitFn<'update:modelValue' | 'input' | 'blur' | 'focus' | 'clear'>)

/**
 * uni input 的 type 只接受部分值；email/url 等无对应键盘类型时降级为 text，
 * 校验仍由 form 的规则层负责。
 */
const innerType = computed(() => {
  const allowed = ['text', 'number', 'digit', 'idcard', 'tel', 'password', 'nickname', 'safe-password']
  return allowed.includes(props.type as string) ? (props.type as string) : 'text'
})
</script>

<style src="./style.css"></style>
