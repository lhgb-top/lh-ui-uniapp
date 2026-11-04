<template>
  <view
    class="lh-input-number"
    :class="[wrapperModifiers, props.customClass]"
    :style="sxStyle"
  >
    <!-- 加减按钮是 view 自绘点击（MP 的 button 无法 reset 默认样式），全端可用；
         view 无 :disabled 伪类（share 的 `&:disabled` 规则只匹配 button 元素），
         禁用外观由 SFC 内联兜底规则按同一令牌补齐（同 lh-segmented 先例） -->
    <view
      v-if="props.controls"
      class="lh-input-number__decrease"
      :class="{ 'lh-input-number__decrease--disabled': isDecreaseDisabled }"
      role="button"
      :aria-disabled="isDecreaseDisabled ? 'true' : undefined"
      @click="handleDecrement"
    >
      <text class="lh-input-number__icon">-</text>
    </view>

    <input
      class="lh-input-number__input"
      :class="`lh-input-number--${props.size}`"
      :value="displayValue"
      :disabled="props.disabled"
      :placeholder="props.placeholder"
      :placeholder-style="placeholderStyle"
      :name="props.name"
      role="spinbutton"
      :aria-valuemin="ariaValuemin"
      :aria-valuemax="ariaValuemax"
      :aria-valuenow="ariaAttrs.valuenow"
      :aria-disabled="ariaAttrs.disabled"
      @input="handleInput"
      @blur="handleBlur"
      @confirm="handleConfirm"
      @keydown="handleKeydown"
    />

    <view
      v-if="props.controls"
      class="lh-input-number__increase"
      :class="{ 'lh-input-number__increase--disabled': isIncreaseDisabled }"
      role="button"
      :aria-disabled="isIncreaseDisabled ? 'true' : undefined"
      @click="handleIncrement"
    >
      <text class="lh-input-number__icon">+</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useLhInputNumber } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhInputNumberProps } from './types'

defineOptions({
  name: 'LhInputNumber',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhInputNumberProps>(), {
  modelValue: null,
  min: -Infinity,
  max: Infinity,
  step: 1,
  stepStrictly: false,
  precision: undefined,
  disabled: false,
  size: 'medium',
  controls: true,
  placeholder: '',
  name: '',
  customClass: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
  change: [value: number | null]
}>()

const {
  displayValue,
  wrapperModifiers,
  sxStyle,
  placeholderStyle,
  ariaAttrs,
  ariaValuemin,
  ariaValuemax,
  isDecreaseDisabled,
  isIncreaseDisabled,
  handleIncrement,
  handleDecrement,
  handleInput,
  handleBlur,
  handleConfirm,
  onInputKeydown,
} = useLhInputNumber(props, emit as LhEmitFn<'update:modelValue' | 'change'>)

function handleKeydown(event: KeyboardEvent) {
  // 键盘上下键步进仅 H5：小程序无键盘事件，此处由条件编译守卫，MP 端不调用。
  // 回车提交不在这里处理，统一走 @confirm（H5 回车 / MP 键盘「完成」都触发）
  // #ifdef H5
  onInputKeydown(event)
  // #endif
}
</script>

<style src="./style.css"></style>

<!-- view 无 :disabled 伪类（share 的 `&:disabled` 规则只匹配 button 元素），
     加减按钮与输入框的禁用外观在两端都拿不到 share 的禁用规则，
     这里按同一令牌补类名兜底；不进 build-styles 产物，仅本组件内联生效
     （同 lh-segmented / lh-spinner / lh-empty 先例）。 -->
<style>
.lh-input-number__decrease--disabled,
.lh-input-number__increase--disabled {
  color: var(--lh-disabled-text-color, #bfb8af);
}
.lh-input-number--disabled .lh-input-number__input {
  background-color: var(--lh-disabled-bg-color, #f5f7fa);
}
</style>
