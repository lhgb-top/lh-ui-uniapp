<template>
  <view
    :id="triggerId"
    class="lh-time-picker"
    :class="pickerClass"
    :style="pickerStyle"
    :aria-expanded="ariaExpanded"
    :aria-haspopup="ariaHaspopup"
    :aria-controls="ariaControls"
    @click="toggleOpen"
    @keydown="onTriggerKeydown"
  >
    <!-- 触发器：view 自绘（MP 无触发器内 input 聚焦语义，占位/回显都走 text 节点） -->
    <view class="lh-time-picker__input">
      <text
        class="lh-time-picker__input-inner"
        :class="{ 'lh-time-picker__input-inner--placeholder': !props.modelValue }"
      >{{ props.modelValue ? formatDisplay : placeholderText }}</text>
      <view
        v-if="showClear"
        class="lh-time-picker__clear"
        @click.stop="handleClear"
      >
        <lh-icon
          name="close"
          :size="12"
        />
      </view>
      <lh-icon
        name="clock"
        :size="12"
        class="lh-time-picker__icon"
      />
    </view>

    <lh-root-portal v-if="visible">
      <!-- .stop 阻止冒泡到根节点的 toggleOpen（遮罩点击会先 close 再被冒泡重新打开） -->
      <view
        class="lh-time-picker__mask"
        @click.stop="handleMaskClick"
      />
      <view
        :id="popperId"
        class="lh-time-picker__panel lh-time-picker-panel"
        :style="popperStyle"
        role="dialog"
        aria-modal="false"
        :aria-label="panelLabel"
        @click.stop
      >
        <view class="lh-time-picker-panel__columns">
          <!-- 小时列 -->
          <view
            :class="[
              'lh-time-picker-panel__column',
              { 'lh-time-picker-panel__column--selecting': selecting === 'hour' },
            ]"
            @mouseenter="selecting = 'hour'"
            @mouseleave="selecting = null"
          >
            <view class="lh-time-picker-panel__column-header">
              <text class="lh-time-picker-panel__column-title">{{ hourTitle }}</text>
              <template v-if="showArrows">
                <view
                  class="lh-time-picker-panel__arrow lh-time-picker-panel__arrow--up"
                  @click="scrollColumn('hour', -1)"
                >
                  <lh-icon
                    name="arrow-up"
                    :size="12"
                  />
                </view>
                <view
                  class="lh-time-picker-panel__arrow lh-time-picker-panel__arrow--down"
                  @click="scrollColumn('hour', 1)"
                >
                  <lh-icon
                    name="arrow-down"
                    :size="12"
                  />
                </view>
              </template>
            </view>
            <scroll-view
              scroll-y
              :show-scrollbar="false"
              :scroll-into-view="hourScrollTarget"
              class="lh-time-picker-panel__column-body lh-time-picker-panel__column-body--hour"
              role="listbox"
              :aria-label="hourLabel"
              @keydown="onColumnKeydown($event, 'hour')"
            >
              <view
                v-for="opt in hoursOption"
                :id="`${popperId}-hour-${opt.value}`"
                :key="opt.value"
                class="lh-time-picker-panel__column-item"
                :class="{
                  'lh-time-picker-panel__column-item--active': opt.isSelected,
                  'lh-time-picker-panel__column-item--disabled': opt.isDisabled,
                }"
                role="option"
                :aria-selected="opt.isSelected"
                :aria-disabled="opt.isDisabled"
                @click="handleSelect('hour', opt.value)"
              >
                <text class="lh-time-picker-panel__column-item-text">{{ opt.text }}</text>
              </view>
            </scroll-view>
          </view>

          <!-- 分钟列 -->
          <view
            :class="[
              'lh-time-picker-panel__column',
              { 'lh-time-picker-panel__column--selecting': selecting === 'minute' },
            ]"
            @mouseenter="selecting = 'minute'"
            @mouseleave="selecting = null"
          >
            <view class="lh-time-picker-panel__column-header">
              <text class="lh-time-picker-panel__column-title">{{ minuteTitle }}</text>
              <template v-if="showArrows">
                <view
                  class="lh-time-picker-panel__arrow lh-time-picker-panel__arrow--up"
                  @click="scrollColumn('minute', -1)"
                >
                  <lh-icon
                    name="arrow-up"
                    :size="12"
                  />
                </view>
                <view
                  class="lh-time-picker-panel__arrow lh-time-picker-panel__arrow--down"
                  @click="scrollColumn('minute', 1)"
                >
                  <lh-icon
                    name="arrow-down"
                    :size="12"
                  />
                </view>
              </template>
            </view>
            <scroll-view
              scroll-y
              :show-scrollbar="false"
              :scroll-into-view="minuteScrollTarget"
              class="lh-time-picker-panel__column-body lh-time-picker-panel__column-body--minute"
              role="listbox"
              :aria-label="minuteLabel"
              @keydown="onColumnKeydown($event, 'minute')"
            >
              <view
                v-for="opt in minutesOption"
                :id="`${popperId}-minute-${opt.value}`"
                :key="opt.value"
                class="lh-time-picker-panel__column-item"
                :class="{
                  'lh-time-picker-panel__column-item--active': opt.isSelected,
                  'lh-time-picker-panel__column-item--disabled': opt.isDisabled,
                }"
                role="option"
                :aria-selected="opt.isSelected"
                :aria-disabled="opt.isDisabled"
                @click="handleSelect('minute', opt.value)"
              >
                <text class="lh-time-picker-panel__column-item-text">{{ opt.text }}</text>
              </view>
            </scroll-view>
          </view>

          <!-- 秒列（format 含 ss 才渲染） -->
          <view
            v-if="showSecond"
            :class="[
              'lh-time-picker-panel__column',
              { 'lh-time-picker-panel__column--selecting': selecting === 'second' },
            ]"
            @mouseenter="selecting = 'second'"
            @mouseleave="selecting = null"
          >
            <view class="lh-time-picker-panel__column-header">
              <text class="lh-time-picker-panel__column-title">{{ secondTitle }}</text>
              <template v-if="showArrows">
                <view
                  class="lh-time-picker-panel__arrow lh-time-picker-panel__arrow--up"
                  @click="scrollColumn('second', -1)"
                >
                  <lh-icon
                    name="arrow-up"
                    :size="12"
                  />
                </view>
                <view
                  class="lh-time-picker-panel__arrow lh-time-picker-panel__arrow--down"
                  @click="scrollColumn('second', 1)"
                >
                  <lh-icon
                    name="arrow-down"
                    :size="12"
                  />
                </view>
              </template>
            </view>
            <scroll-view
              scroll-y
              :show-scrollbar="false"
              :scroll-into-view="secondScrollTarget"
              class="lh-time-picker-panel__column-body lh-time-picker-panel__column-body--second"
              role="listbox"
              :aria-label="secondLabel"
              @keydown="onColumnKeydown($event, 'second')"
            >
              <view
                v-for="opt in secondsOption"
                :id="`${popperId}-second-${opt.value}`"
                :key="opt.value"
                class="lh-time-picker-panel__column-item"
                :class="{
                  'lh-time-picker-panel__column-item--active': opt.isSelected,
                  'lh-time-picker-panel__column-item--disabled': opt.isDisabled,
                }"
                role="option"
                :aria-selected="opt.isSelected"
                :aria-disabled="opt.isDisabled"
                @click="handleSelect('second', opt.value)"
              >
                <text class="lh-time-picker-panel__column-item-text">{{ opt.text }}</text>
              </view>
            </scroll-view>
          </view>
        </view>

        <!-- 底部快捷操作 -->
        <view class="lh-time-picker-panel__footer">
          <lh-button
            size="small"
            @click="selectNow"
          >
            {{ nowText }}
          </lh-button>
          <lh-button
            size="small"
            type="primary"
            @click="confirmSelection"
          >
            {{ confirmText }}
          </lh-button>
        </view>
      </view>
    </lh-root-portal>
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { LH_IS_H5 } from '@/adapter/platform'
import { useLhTimePicker } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhTimePickerProps } from './types'

defineOptions({
  name: 'LhTimePicker',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhTimePickerProps>(), {
  modelValue: null,
  size: undefined,
  disabled: false,
  clearable: true,
  placeholder: '',
  format: 'HH:mm:ss',
  readonly: false,
  arrowControl: false,
  start: 0,
  end: 24,
  stepHour: 1,
  stepMinute: 1,
  stepSecond: 1,
  customClass: undefined,
  themeVars: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: Date | null]
  change: [value: Date | null]
}>()

const {
  triggerId,
  popperId,
  visible,
  popperStyle,
  showSecond,
  hoursOption,
  minutesOption,
  secondsOption,
  hourScrollTarget,
  minuteScrollTarget,
  secondScrollTarget,
  selecting,
  formatDisplay,
  placeholderText,
  panelLabel,
  hourLabel,
  minuteLabel,
  secondLabel,
  hourTitle,
  minuteTitle,
  secondTitle,
  nowText,
  confirmText,
  pickerClass,
  pickerStyle,
  ariaExpanded,
  ariaHaspopup,
  ariaControls,
  handleSelect,
  selectNow,
  confirmSelection,
  handleClear,
  handleMaskClick,
  toggleOpen,
  onColumnKeydown,
  onTriggerKeydown,
  scrollColumn,
} = useLhTimePicker(props, emit as LhEmitFn<'update:modelValue' | 'change'>)

// 清除按钮：clearable 且有值且未禁用时显示（对齐 plus 的显示条件）
const showClear = computed(
  () => props.clearable && !!props.modelValue && !props.disabled,
)

// arrowControl 箭头按钮仅 H5 渲染（MP 无键盘步进语义，且按钮依赖 H5 键盘导航）
const showArrows = computed(() => props.arrowControl && LH_IS_H5)
</script>

<style src="./style.css"></style>

<!-- uni-app 独有适配样式：share 无对应产物（plus 的弹层挂 body Teleport 下，
     uni-app 走 lh-root-portal 承载 + 页内透明遮罩）。
     lh-root-portal 容器是 pointer-events:none，弹层与遮罩需各自恢复 -->
<style>
.lh-time-picker__panel {
  pointer-events: auto;
}

.lh-time-picker__mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  background-color: transparent;
  z-index: -1;
}

/* share 的占位符色只写在 ::placeholder（MP 不支持），text 节点占位用修饰类补色 */
.lh-time-picker__input-inner--placeholder {
  color: var(--lh-text-placeholder, #B0B0B0);
}
</style>
