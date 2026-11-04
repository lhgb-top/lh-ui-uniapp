<template>
  <view
    ref="rootRef"
    :class="rootClasses"
    :style="sxStyle"
  >
    <!-- input 模式：点击触发框展开 / 收起面板（view 自绘：MP 不支持 ::placeholder，
         原生 <input> 还得额外配 placeholder-style，自绘触发框更稳） -->
    <view
      v-if="isInputMode"
      class="lh-calendar__input"
      role="combobox"
      :aria-expanded="panelOpen"
      aria-haspopup="grid"
      @click="togglePanel"
    >{{ inputText || placeholderText }}</view>

    <view
      v-show="!isInputMode || panelOpen"
      class="lh-calendar__panels"
    >
      <view class="lh-calendar__nav-row">
        <view
          class="lh-calendar__nav"
          role="button"
          :aria-label="prevMonthLabel"
          @click="shiftMonth(-1)"
        >‹</view>
        <view
          class="lh-calendar__nav"
          role="button"
          :aria-label="nextMonthLabel"
          @click="shiftMonth(1)"
        >›</view>
      </view>

      <view
        v-for="panel in panelMonths"
        :key="`${panel.year}-${panel.month}`"
        class="lh-calendar__panel"
      >
        <view class="lh-calendar__header">
          <slot
            name="header"
            :year="panel.year"
            :month="panel.month"
          >
            <view class="lh-calendar__title">{{ panelTitle(panel) }}</view>
          </slot>
        </view>
        <view
          class="lh-calendar__grid"
          role="grid"
          @keydown="handleKeydown"
        >
          <view
            class="lh-calendar__row"
            role="row"
          >
            <view
              v-for="week in weekLabels"
              :key="week.key"
              role="columnheader"
              class="lh-calendar__weekday"
            >{{ week.label }}</view>
          </view>
          <view
            v-for="(row, rowIndex) in panel.rows"
            :key="rowIndex"
            class="lh-calendar__row"
            role="row"
          >
            <view
              v-for="day in row"
              :key="day.date.getTime()"
              class="lh-calendar__cell"
              :class="{
                'lh-calendar__cell--outside': !day.isCurrentMonth,
                'lh-calendar__cell--today': day.isToday,
                'lh-calendar__cell--selected': isSelected(day.date),
                'lh-calendar__cell--in-range': isWithinSpan(day.date),
                'lh-calendar__cell--disabled': isDisabled(day.date),
              }"
              role="gridcell"
              :aria-current="day.isToday ? 'date' : undefined"
              :aria-selected="isSelected(day.date)"
              :aria-label="cellAria(day.date)"
              :aria-disabled="isDisabled(day.date) || undefined"
              :tabindex="isFocusTarget(day.date) ? 0 : -1"
              @click="select(day.date)"
            >
              <slot
                name="cell"
                :date="day.date"
              >{{ day.day }}</slot>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useLhCalendar } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhCalendarProps } from './types'

defineOptions({
  name: 'LhCalendar',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhCalendarProps>(), {
  modelValue: undefined,
  selection: 'single',
  range: undefined,
  mode: 'panel',
  panels: 1,
  placeholder: undefined,
  closeOnSelect: true,
  customClass: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: LhCalendarProps['modelValue']]
  change: [value: LhCalendarProps['modelValue']]
  select: [value: Date]
}>()

const {
  rootRef,
  panelOpen,
  isInputMode,
  weekLabels,
  panelMonths,
  panelTitle,
  prevMonthLabel,
  nextMonthLabel,
  placeholderText,
  inputText,
  rootClasses,
  sxStyle,
  isSelected,
  isWithinSpan,
  isDisabled,
  isFocusTarget,
  cellAria,
  select,
  togglePanel,
  shiftMonth,
  onKeydown,
} = useLhCalendar(
  props,
  emit as LhEmitFn<'update:modelValue' | 'change' | 'select'>,
)

// 根节点 ref：input 模式下「点击组件外部收起」需要 contains 判定（仅 H5）
function handleKeydown(event: KeyboardEvent) {
  // 键盘网格导航仅 H5：小程序无键盘事件，此处由条件编译守卫，MP 端不调用
  // #ifdef H5
  onKeydown(event)
  // #endif
}
</script>

<style src="./style.css"></style>

<!-- view 无 :disabled 伪类（share 的 `&:disabled` 规则只匹配 button 元素），
     禁用单元格在两端都拿不到 share 的禁用外观，这里按同一令牌补一个类名兜底；
     不进 build-styles 产物，仅本组件内联生效（同 lh-segmented 先例）。 -->
<style>
.lh-calendar__cell--disabled {
  color: var(--lh-disabled-text-color, #bfb8af);
}
</style>
