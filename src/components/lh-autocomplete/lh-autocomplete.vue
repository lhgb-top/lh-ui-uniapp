<template>
  <view
    :id="triggerId"
    class="lh-autocomplete"
    :class="[autocompleteClass, customClass]"
    :style="[componentStyle, sxStyle]"
  >
    <input
      class="lh-autocomplete__inner"
      :value="innerValue"
      :placeholder="placeholderText"
      :placeholder-style="props.placeholderStyle"
      :disabled="props.disabled"
      role="combobox"
      :aria-expanded="ariaExpanded"
      :aria-controls="popperId"
      :aria-activedescendant="highlightedId"
      :aria-haspopup="ariaHaspopup"
      :aria-label="ariaLabelText"
      @input="handleInput"
      @focus="handleFocus"
      @keydown="handleKeydown"
    >

    <lh-root-portal v-if="isOpen">
      <view
        class="lh-autocomplete__mask"
        @click="handleMaskClick"
      />
      <scroll-view
        :id="popperId"
        class="lh-autocomplete__dropdown lh-autocomplete__dropdown--teleported"
        scroll-y
        :show-scrollbar="false"
        role="listbox"
        :style="popperStyle"
        @click.stop
      >
        <view
          v-for="(option, index) in suggestions"
          :id="getOptionId(index)"
          :key="index"
          class="lh-autocomplete__option"
          :class="{
            'lh-autocomplete__option--highlighted': highlightedIndex === index,
            'lh-autocomplete__option--disabled': option.disabled,
          }"
          role="option"
          :aria-selected="highlightedIndex === index"
          :aria-disabled="option.disabled || undefined"
          @click="selectOption(option)"
        >
          <text>{{ option.label }}</text>
        </view>
        <view
          v-if="suggestions.length === 0"
          class="lh-autocomplete__empty"
        >
          <slot name="empty">{{ emptyText }}</slot>
        </view>
      </scroll-view>
    </lh-root-portal>
  </view>
</template>

<script lang="ts" setup>
import { useLhAutocomplete } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhAutocompleteProps, LhAutocompleteOption } from './types'

defineOptions({
  name: 'LhAutocomplete',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhAutocompleteProps>(), {
  modelValue: '',
  options: () => [],
  caseSensitive: false,
  trim: true,
  placeholder: '',
  placeholderStyle: undefined,
  disabled: false,
  openOnFocus: true,
  ariaLabel: undefined,
  customClass: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  /** 选中某个建议项，参数为提交值与原选项 */
  select: [value: string | number, option: LhAutocompleteOption]
}>()

const {
  triggerId,
  popperId,
  isOpen,
  innerValue,
  suggestions,
  highlightedIndex,
  highlightedId,
  getOptionId,
  ariaExpanded,
  ariaHaspopup,
  ariaLabelText,
  emptyText,
  placeholderText,
  sxStyle,
  componentStyle,
  autocompleteClass,
  popperStyle,
  open,
  close,
  selectOption,
  handleInput,
  handleFocus,
  handleKeydown,
  handleMaskClick,
} = useLhAutocomplete(props, emit as LhEmitFn<'update:modelValue' | 'change' | 'select'>)

defineExpose({ open, close, isOpen })
</script>

<style src="./style.css"></style>

<!-- uni-app 独有适配样式：share 无对应产物（plus 用 body 级遮罩 + 手写 fixed，
     MP 用页内遮罩 + 两帧度量定位）。同 lh-select 的先例 -->
<style>
.lh-autocomplete__dropdown {
  pointer-events: auto;
}

.lh-autocomplete__mask {
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
