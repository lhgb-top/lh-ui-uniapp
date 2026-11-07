<template>
  <view
    :id="triggerId"
    class="lh-mentions"
    :class="[mentionsClass, customClass]"
    :style="[componentStyle, sxStyle]"
  >
    <textarea
      v-if="props.multiline"
      ref="controlRef"
      class="lh-mentions__inner"
      :value="innerText"
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
      @click="handleSyncContext"
      @keyup="handleSyncContext"
      @keydown="handleKeydown"
    />
    <input
      v-else
      ref="controlRef"
      class="lh-mentions__inner"
      :value="innerText"
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
      @click="handleSyncContext"
      @keyup="handleSyncContext"
      @keydown="handleKeydown"
    >

    <lh-root-portal v-if="visible">
      <view
        class="lh-mentions__mask"
        @click="handleMaskClick"
      />
      <scroll-view
        :id="popperId"
        class="lh-mentions__dropdown lh-mentions__dropdown--teleported"
        scroll-y
        :show-scrollbar="false"
        role="listbox"
        :style="popperStyle"
        @click.stop
      >
        <view
          v-for="(option, index) in filteredOptions"
          :id="getOptionId(index)"
          :key="index"
          class="lh-mentions__option"
          :class="{
            'lh-mentions__option--highlighted': highlightedIndex === index,
            'lh-mentions__option--disabled': option.disabled,
          }"
          role="option"
          :aria-selected="highlightedIndex === index"
          :aria-disabled="option.disabled || undefined"
          @click="selectOption(option)"
        >
          <text>{{ option.label }}</text>
        </view>
        <view
          v-if="filteredOptions.length === 0"
          class="lh-mentions__empty"
        >
          <slot name="empty">{{ emptyText }}</slot>
        </view>
      </scroll-view>
    </lh-root-portal>
  </view>
</template>

<script lang="ts" setup>
import { useLhMentions } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhMentionsProps, LhMentionOption } from './types'

defineOptions({
  name: 'LhMentions',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhMentionsProps>(), {
  modelValue: '',
  options: () => [],
  prefix: '@',
  placeholder: undefined,
  placeholderStyle: undefined,
  disabled: false,
  multiline: false,
  ariaLabel: undefined,
  customClass: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  /** 选中某个提及项 */
  select: [option: LhMentionOption]
}>()

const {
  controlRef,
  triggerId,
  popperId,
  visible,
  innerText,
  filteredOptions,
  highlightedIndex,
  highlightedId,
  getOptionId,
  ariaExpanded,
  ariaHaspopup,
  ariaLabelText,
  placeholderText,
  emptyText,
  sxStyle,
  componentStyle,
  mentionsClass,
  popperStyle,
  close,
  selectOption,
  handleInput,
  handleSyncContext,
  handleKeydown,
  handleMaskClick,
  updateContext,
} = useLhMentions(props, emit as LhEmitFn<'update:modelValue' | 'change' | 'select'>)

defineExpose({ updateContext, close })
</script>

<style src="./style.css"></style>

<!-- uni-app 独有适配样式：share 无对应产物（plus 用 body 级遮罩 + 手写 fixed，
     MP 用页内遮罩 + 两帧度量定位）。同 lh-select / lh-autocomplete 的先例 -->
<style>
.lh-mentions__dropdown {
  pointer-events: auto;
}

.lh-mentions__mask {
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
