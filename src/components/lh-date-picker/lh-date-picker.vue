<template>
  <view
    :id="triggerId"
    :class="rootClass"
    :style="rootStyle"
    :aria-expanded="ariaExpanded"
    :aria-haspopup="ariaHaspopup"
    :aria-controls="ariaControls"
    @click="toggleOpen"
    @keydown="onTriggerKeydown"
  >
    <!-- 触发器（自绘 view：MP 不支持 ::placeholder，回显与占位都由 text 节点渲染） -->
    <view class="lh-date-picker__input">
      <text
        v-if="hasValue"
        class="lh-date-picker__value"
      >{{ displayValue }}</text>
      <text
        v-else
        class="lh-date-picker__input-inner lh-date-picker__input-inner--placeholder"
      >{{ displayPlaceholder }}</text>

      <!-- 清除按钮 -->
      <view
        v-if="showClear"
        class="lh-date-picker__clear"
        @click.stop="handleClear"
      >
        <lh-icon
          name="close"
          :size="12"
        />
      </view>

      <!-- 日期图标 -->
      <lh-icon
        name="date"
        :size="12"
        class="lh-date-picker__icon"
      />
    </view>

    <lh-root-portal v-if="visible">
      <view
        class="lh-date-picker__mask"
        @click.stop="handleMaskClick"
      ></view>
      <view
        :id="popperId"
        :class="panelClass"
        :style="popperStyle"
        role="dialog"
        aria-modal="false"
        :aria-label="panelLabel"
        @click.stop
      >
        <!-- 工具栏：翻月按钮 + 可下钻标题 -->
        <view class="lh-date-picker-panel__header">
          <view class="lh-date-picker-panel__title">
            <view
              class="lh-date-picker-panel__btn"
              role="button"
              :aria-label="prevUnitLabel"
              @click="prevUnit"
            >
              <lh-icon
                name="arrow-left"
                :size="12"
              />
            </view>
            <view
              class="lh-date-picker-panel__title-text"
              role="button"
              @click="toggleView"
            >{{ panelTitle }}</view>
            <view
              class="lh-date-picker-panel__btn"
              role="button"
              :aria-label="nextUnitLabel"
              @click="nextUnit"
            >
              <lh-icon
                name="arrow-right"
                :size="12"
              />
            </view>
          </view>
        </view>

        <!-- 日期视图（表头 + 7 列网格，网格自动 7 等分换行，与 share scss 的 grid 布局一致） -->
        <template v-if="viewMode === 'date'">
          <view class="lh-date-picker-panel__weekdays">
            <text
              v-for="day in weekDays"
              :key="day"
              class="lh-date-picker-panel__weekday"
            >{{ day }}</text>
          </view>
          <view class="lh-date-picker-panel__body">
            <view
              class="lh-date-picker-panel__days"
              role="grid"
            >
              <view
                v-for="(day, index) in calendarDays"
                :key="day.date.getTime()"
                class="lh-date-picker-panel__day"
                role="gridcell"
                :tabindex="dayTabIndex(index)"
                :aria-label="dayAriaLabel(day)"
                :aria-selected="isSelected(day.date) ? 'true' : 'false'"
                :aria-current="day.isToday ? 'date' : undefined"
                :aria-disabled="isDayDisabled(day.date) ? 'true' : 'false'"
                :class="[
                  {
                    'lh-date-picker-panel--disabled': isDayDisabled(day.date),
                    'lh-date-picker-panel--other': !day.isCurrentMonth,
                    'lh-date-picker-panel--today': day.isToday,
                    'lh-date-picker-panel--selected': isSelected(day.date),
                  },
                  dayCustomClass(day.date),
                ]"
                @click="handleDayClick(day)"
                @keydown="onDayKeydown($event, index)"
              >{{ day.day }}</view>
            </view>
          </view>
        </template>

        <!-- 月份视图（3 列网格，viewMode 或 mode 为月份时渲染） -->
        <view
          v-else-if="viewMode === 'month'"
          class="lh-date-picker-panel__body"
        >
          <view
            class="lh-date-picker-panel__month-grid"
            role="grid"
          >
            <view
              v-for="(m, index) in monthCells"
              :key="m.month"
              class="lh-date-picker-panel__month-cell"
              role="gridcell"
              :tabindex="monthTabIndex(index)"
              :aria-selected="m.isSelected ? 'true' : 'false'"
              :class="{ 'lh-date-picker-panel--selected': m.isSelected }"
              @click="handleMonthClick(m)"
              @keydown="onMonthKeydown($event, index)"
            >{{ monthName(m.month) }}</view>
          </view>
        </view>

        <!-- 年份视图（4 列网格） -->
        <view
          v-else
          class="lh-date-picker-panel__body"
        >
          <view
            class="lh-date-picker-panel__year-grid"
            role="grid"
          >
            <view
              v-for="(y, index) in yearCells"
              :key="y.year"
              class="lh-date-picker-panel__year-cell"
              role="gridcell"
              :tabindex="yearTabIndex(index)"
              :aria-selected="y.isSelected ? 'true' : 'false'"
              :class="{ 'lh-date-picker-panel--selected': y.isSelected }"
              @click="handleYearClick(y)"
              @keydown="onYearKeydown($event, index)"
            >{{ y.year }}</view>
          </view>
        </view>

        <!-- 底部快捷操作（仅日期 / 日期时间模式：月份 / 年份模式下点击即选中） -->
        <view
          v-if="showFooter"
          class="lh-date-picker-panel__footer"
        >
          <lh-button
            size="small"
            @click="selectToday"
          >{{ todayText }}</lh-button>
          <lh-button
            size="small"
            type="primary"
            @click="confirmSelection"
          >{{ confirmText }}</lh-button>
        </view>
      </view>
    </lh-root-portal>
  </view>
</template>

<script lang="ts" setup>
import { useLhDatePicker } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhDatePickerProps } from './types'

defineOptions({
  name: 'LhDatePicker',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhDatePickerProps>(), {
  modelValue: null,
  mode: 'date',
  size: undefined,
  disabled: false,
  clearable: true,
  placeholder: '',
  format: 'yyyy-MM-dd',
  readonly: false,
  rangeSeparator: '~',
  cellClassName: undefined,
  popperClass: undefined,
  customClass: undefined,
  themeVars: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: Date | [Date, Date] | null]
  change: [value: Date | [Date, Date] | null]
}>()

const {
  triggerId,
  popperId,
  visible,
  popperStyle,
  viewMode,
  weekDays,
  calendarDays,
  monthCells,
  yearCells,
  panelTitle,
  monthName,
  showFooter,
  panelLabel,
  prevUnitLabel,
  nextUnitLabel,
  todayText,
  confirmText,
  displayPlaceholder,
  displayValue,
  hasValue,
  showClear,
  rootClass,
  rootStyle,
  panelClass,
  ariaExpanded,
  ariaHaspopup,
  ariaControls,
  isSelected,
  isDayDisabled,
  dayCustomClass,
  dayAriaLabel,
  dayTabIndex,
  monthTabIndex,
  yearTabIndex,
  toggleOpen,
  prevUnit,
  nextUnit,
  toggleView,
  handleDayClick,
  handleMonthClick,
  handleYearClick,
  selectToday,
  confirmSelection,
  handleClear,
  handleMaskClick,
  onDayKeydown,
  onMonthKeydown,
  onYearKeydown,
  onTriggerKeydown,
} = useLhDatePicker(props, emit as LhEmitFn<'update:modelValue' | 'change'>)
</script>

<style src="./style.css"></style>

<!-- uni-app 独有适配样式：share 无对应产物（plus 的弹层挂 body Teleport 下，
     uni-app 走 lh-root-portal 承载 + 页内透明遮罩）。
     lh-root-portal 容器是 pointer-events:none，弹层与遮罩需各自恢复 -->
<style>
.lh-date-picker__panel {
  pointer-events: auto;
}

.lh-date-picker__mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  background-color: transparent;
  z-index: -1;
}

/* share 的占位符色只写在原生 input 的伪类（MP 不支持），text 节点占位用修饰类补色 */
.lh-date-picker__input-inner--placeholder {
  color: var(--lh-text-placeholder, #b0b0b0);
}
</style>
