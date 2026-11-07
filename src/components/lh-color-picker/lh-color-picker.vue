<template>
  <view
    :id="triggerId"
    class="lh-color-picker"
    :class="[triggerClasses, !displayValue && 'lh-color-picker--empty', props.customClass]"
    :style="[triggerStyle, sxStyle]"
    role="button"
    tabindex="0"
    :aria-expanded="isOpen"
    :aria-label="ariaLabelText"
    :aria-disabled="props.disabled || undefined"
    @click="toggle"
    @keydown="handleTriggerKeydown"
  >
    <view
      class="lh-color-picker__swatch"
      :style="{ backgroundColor: displayValue || 'transparent' }"
    />
    <text class="lh-color-picker__value">{{ displayValue || placeholderText }}</text>
    <view
      v-if="props.clearable && displayValue && !props.disabled"
      class="lh-color-picker__clear"
      @click.stop="clear"
    >
      <lh-icon
        name="close"
        :size="12"
      />
    </view>
  </view>

  <lh-root-portal v-if="isOpen">
    <view
      class="lh-color-picker__mask"
      @click="close"
    />
    <view
      :id="popperId"
      class="lh-color-picker__panel"
      :style="popperStyle"
      @click.stop
    >
      <!-- 饱和度 / 明度板：touch 挂元素本身（MP 沿 touchstart 目标派发 move/end）；
           H5 另走 document 级鼠标监听（startMouseDrag 条件编译，MP 不调用） -->
      <view
        class="lh-color-picker__saturation"
        :style="saturationStyle"
        role="slider"
        :aria-label="inputLabel"
        :aria-valuenow="Math.round(hsv.s * 100)"
        @touchstart="onDragStart('saturation')"
        @touchmove="onDragMove($event)"
        @touchend="onDragEnd"
        @mousedown="startMouseDrag('saturation', $event)"
      >
        <view
          class="lh-color-picker__saturation-pointer"
          :style="saturationPointerStyle"
        />
      </view>
      <!-- 色相滑杆：方向键微调仅 H5（onSliderKeydown 由条件编译守卫，MP 不调用） -->
      <view
        class="lh-color-picker__slider lh-color-picker__hue"
        role="slider"
        :aria-label="hueLabel"
        aria-valuemin="0"
        aria-valuemax="360"
        :aria-valuenow="Math.round(hsv.h)"
        tabindex="0"
        @touchstart="onDragStart('hue')"
        @touchmove="onDragMove($event)"
        @touchend="onDragEnd"
        @mousedown="startMouseDrag('hue', $event)"
        @keydown="handleHueKeydown"
      >
        <view
          class="lh-color-picker__slider-thumb"
          :style="hueThumbStyle"
        />
      </view>
      <!-- 透明度滑杆（showAlpha 开启才渲染） -->
      <view
        v-if="props.showAlpha"
        class="lh-color-picker__slider lh-color-picker__alpha"
        role="slider"
        :aria-label="alphaLabel"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="Math.round(hsv.a * 100)"
        tabindex="0"
        @touchstart="onDragStart('alpha')"
        @touchmove="onDragMove($event)"
        @touchend="onDragEnd"
        @mousedown="startMouseDrag('alpha', $event)"
        @keydown="handleAlphaKeydown"
      >
        <view
          class="lh-color-picker__slider-thumb"
          :style="alphaThumbStyle"
        />
      </view>
      <!-- hex / rgb 输入：@confirm（键盘完成）/ @blur 提交（MP 无 keydown.enter） -->
      <input
        class="lh-color-picker__input"
        type="text"
        :value="inputValue"
        :aria-label="inputLabel"
        @input="onPanelInput"
        @confirm="commitInput($event.detail.value)"
        @blur="onPanelBlur"
      />
      <!-- 预设色板 -->
      <view
        v-if="props.predefine && props.predefine.length"
        class="lh-color-picker__predefine"
      >
        <view
          v-for="(color, index) in props.predefine"
          :key="index"
          class="lh-color-picker__predefine-item"
          :style="{ backgroundColor: color }"
          @click="selectPredefine(color)"
        />
      </view>
    </view>
  </lh-root-portal>
</template>

<script lang="ts" setup>
import { useLhColorPicker } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhColorPickerProps } from './types'

defineOptions({
  name: 'LhColorPicker',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhColorPickerProps>(), {
  modelValue: '',
  format: 'hex',
  showAlpha: false,
  predefine: () => [],
  size: 'medium',
  disabled: false,
  clearable: false,
  placeholder: '',
  ariaLabel: undefined,
  customClass: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  clear: []
}>()

const {
  isOpen,
  triggerId,
  popperId,
  hsv,
  inputValue,
  triggerClasses,
  triggerStyle,
  sxStyle,
  placeholderText,
  ariaLabelText,
  inputLabel,
  saturationStyle,
  saturationPointerStyle,
  hueThumbStyle,
  alphaThumbStyle,
  popperStyle,
  displayValue,
  open,
  close,
  toggle,
  clear,
  selectPredefine,
  commitInput,
  onDragStart,
  onDragMove,
  onDragEnd,
  startMouseDrag,
  onSliderKeydown,
  onTriggerKeydown,
} = useLhColorPicker(props, emit as LhEmitFn<'update:modelValue' | 'change' | 'clear'>)

/**
 * 面板输入受控：uni 的 input 事件载荷在 event.detail.value；
 * H5 原生 InputEvent 无 detail，回退读 target.value（uni-h5 事件 target 为原生控件）。
 */
function onPanelInput(event: Event) {
  const detail = (event as unknown as { detail?: { value?: string } }).detail
  const target = (event as unknown as { target?: HTMLInputElement }).target
  inputValue.value = detail?.value ?? target?.value ?? ''
}

/**
 * 失焦提交：MP 的 blur 事件 detail 是光标数值（无 value），H5 原生 FocusEvent 无 detail
 * —— 内联 $event.detail.value 过不了模板类型检查，同样双端兼容取值后提交。
 */
function onPanelBlur(event: Event) {
  const detail = (event as unknown as { detail?: { value?: string } }).detail
  const target = (event as unknown as { target?: HTMLInputElement }).target
  commitInput(detail?.value ?? target?.value ?? '')
}

/** 滑杆可达名称（色相 / 透明度无独立 locale 词条，UI 层定名） */
const hueLabel = '色相'
const alphaLabel = '透明度'

/** 键盘步进仅 H5：小程序无键盘事件，此处由条件编译守卫，MP 端不调用（同 lh-slider） */
function handleTriggerKeydown(event: KeyboardEvent) {
  // #ifdef H5
  onTriggerKeydown(event)
  // #endif
}

function handleHueKeydown(event: KeyboardEvent) {
  // #ifdef H5
  onSliderKeydown('hue', event)
  // #endif
}

function handleAlphaKeydown(event: KeyboardEvent) {
  // #ifdef H5
  onSliderKeydown('alpha', event)
  // #endif
}

defineExpose({ open, close, isOpen })
</script>

<style src="./style.css"></style>

<style>
/* 遮罩为组件自有基建样式（不进 build-styles 管线，同 lh-root-portal 先例）：
   透明全屏 + pointer-events:auto，承接「点击面板外部关闭」 */
.lh-color-picker__mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  background: transparent;
}
</style>
