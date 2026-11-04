<template>
  <view
    class="lh-slider"
    :class="[wrapperModifiers, props.customClass]"
    :style="sxStyle"
  >
    <view
      v-if="marksList.length"
      class="lh-slider__marks"
    >
      <view
        v-for="mark in marksList"
        :key="mark.value"
        class="lh-slider__mark"
        :style="{ left: getMarkPosition(mark.value) + '%' }"
      >{{ mark.label }}</view>
    </view>
    <view class="lh-slider__track">
      <view
        class="lh-slider__bar"
        :style="barStyle"
      />
      <!-- 拖动载体：touch 事件直接挂在 thumb wrapper 上（MP 沿 touchstart 目标派发
           touchmove / touchend，无需 document 监听）；H5 另走 document 级鼠标监听
           （startMouseDrag 内条件编译）。键盘步进仅 H5（handleKeydown 内守卫） -->
      <view
        class="lh-slider__button-wrapper"
        role="slider"
        :tabindex="thumbTabindex"
        aria-orientation="horizontal"
        :aria-label="thumbAriaList[0].label"
        :aria-valuemin="thumbAriaList[0].valuemin"
        :aria-valuemax="thumbAriaList[0].valuemax"
        :aria-valuenow="thumbAriaList[0].valuenow"
        :aria-valuetext="thumbAriaList[0].valuetext"
        :aria-disabled="thumbAriaList[0].disabled"
        :style="button1Style"
        @touchstart="handleTouchStart(0)"
        @touchmove="handleTouchMove($event)"
        @touchend="handleTouchEnd"
        @mousedown="handleMouseDown(0, $event)"
        @keydown="handleKeydown($event, 0)"
      >
        <view class="lh-slider__button" />
      </view>
      <view
        v-if="props.range"
        class="lh-slider__button-wrapper"
        role="slider"
        :tabindex="thumbTabindex"
        aria-orientation="horizontal"
        :aria-label="thumbAriaList[1].label"
        :aria-valuemin="thumbAriaList[1].valuemin"
        :aria-valuemax="thumbAriaList[1].valuemax"
        :aria-valuenow="thumbAriaList[1].valuenow"
        :aria-valuetext="thumbAriaList[1].valuetext"
        :aria-disabled="thumbAriaList[1].disabled"
        :style="button2Style"
        @touchstart="handleTouchStart(1)"
        @touchmove="handleTouchMove($event)"
        @touchend="handleTouchEnd"
        @mousedown="handleMouseDown(1, $event)"
        @keydown="handleKeydown($event, 1)"
      >
        <view class="lh-slider__button" />
      </view>
    </view>
    <view
      v-if="props.showInput"
      class="lh-slider__input"
    >
      <text class="lh-slider__input-text">{{ displayValue }}</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useLhSlider } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhSliderProps } from './types'

defineOptions({
  name: 'LhSlider',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhSliderProps>(), {
  modelValue: null,
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  range: false,
  showInput: false,
  size: 'medium',
  marks: undefined,
  customClass: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: number | [number, number]]
  change: [value: number | [number, number]]
}>()

const {
  wrapperModifiers,
  sxStyle,
  marksList,
  getMarkPosition,
  barStyle,
  button1Style,
  button2Style,
  displayValue,
  thumbAriaList,
  thumbTabindex,
  onDragStart,
  onTouchMove,
  onTouchEnd,
  startMouseDrag,
  onThumbKeydown,
} = useLhSlider(props, emit as LhEmitFn<'update:modelValue' | 'change'>)

/** touchstart：H5 与 MP 同路径（已在拖拽中则忽略，防 H5 触屏 touch + mouse 双触发） */
function handleTouchStart(index: number) {
  onDragStart(index)
}

/** touchmove / touchend：挂在 thumb wrapper 上，MP 沿 touchstart 目标派发 */
function handleTouchMove(event: Event) {
  onTouchMove(event)
}

function handleTouchEnd() {
  onTouchEnd()
}

/** mousedown：H5 走 document 级鼠标拖动（startMouseDrag 内条件编译守卫，MP 不调用） */
function handleMouseDown(index: number, event: Event) {
  startMouseDrag(index, event)
}

/** 键盘步进仅 H5：小程序无键盘事件，此处由条件编译守卫，MP 端不调用 */
function handleKeydown(event: KeyboardEvent, index: number) {
  // #ifdef H5
  onThumbKeydown(event, index)
  // #endif
}
</script>

<style src="./style.css"></style>
