<template>
  <view
    :id="triggerId"
    class="lh-select"
    :class="selectClass"
    :style="selectStyle"
  >
    <view
      class="lh-select__trigger"
      @click="toggleOpen"
    >
      <text class="lh-select__label">
        {{ displayLabel || placeholderText }}
      </text>
      <view
        v-if="props.clearable && displayLabel && !props.disabled"
        class="lh-select__clear"
        @click.stop="handleClear"
      >
        <lh-icon
          name="close"
          :size="12"
        />
      </view>
      <lh-icon
        name="arrow-down"
        :size="12"
        class="lh-select__arrow"
        :class="{ 'lh-select__arrow--up': visible }"
      />
    </view>

    <lh-root-portal v-if="visible">
      <view
        class="lh-select__mask"
        @click="handleMaskClick"
      />
      <view
        :id="popperId"
        class="lh-select__dropdown lh-select__dropdown--teleported"
        :style="popperStyle"
        @click.stop
      >
        <lh-input
          v-if="props.filterable"
          v-model="filterText"
          class="lh-select__filter"
          :placeholder="filterPlaceholder"
          size="small"
        />
        <scroll-view
          class="lh-select__options"
          scroll-y
          :show-scrollbar="false"
        >
          <view
            v-for="(option, index) in filteredOptions"
            :key="index"
            class="lh-select__option"
            :class="{
              'lh-select__option--selected': option.value === props.modelValue,
              'lh-select__option--disabled': option.disabled,
            }"
            @click="selectOption(option)"
          >
            <text class="lh-select__option-label">{{ option.label }}</text>
            <lh-icon
              v-if="option.value === props.modelValue"
              name="check"
              :size="14"
              class="lh-select__option-icon"
            />
          </view>
          <view
            v-if="filteredOptions.length === 0"
            class="lh-select__empty"
          >
            <text>{{ emptyText }}</text>
          </view>
        </scroll-view>
      </view>
    </lh-root-portal>
  </view>
</template>

<script lang="ts" setup>
import { useLhSelect } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhSelectProps } from './types'

defineOptions({
  name: 'LhSelect',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhSelectProps>(), {
  modelValue: undefined,
  options: () => [],
  size: undefined,
  disabled: false,
  clearable: false,
  placeholder: undefined,
  filterable: false,
  placement: 'bottom',
  customClass: undefined,
  themeVars: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: unknown]
  change: [value: unknown]
  'visible-change': [visible: boolean]
}>()

const {
  visible,
  popperStyle,
  filterText,
  filterPlaceholder,
  emptyText,
  displayLabel,
  filteredOptions,
  selectClass,
  selectStyle,
  placeholderText,
  triggerId,
  popperId,
  toggleOpen,
  selectOption,
  handleClear,
  handleMaskClick,
} = useLhSelect(props, emit as LhEmitFn<'update:modelValue' | 'change' | 'visible-change'>)
</script>

<style src="./style.css"></style>

<!-- uni-app 独有适配样式：share 无对应产物（plus 用 body 级遮罩，MP 用页内遮罩）。
     lh-root-portal 容器是 pointer-events:none，弹层与遮罩需各自恢复 -->
<style>
.lh-select__dropdown {
  pointer-events: auto;
}

.lh-select__mask {
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
