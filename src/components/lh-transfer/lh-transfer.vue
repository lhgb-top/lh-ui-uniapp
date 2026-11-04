<template>
  <view
    :class="transferClasses"
    :style="transferStyle"
  >
    <!-- 左面板（源） -->
    <view :class="panelClasses('left')">
      <view class="lh-transfer-panel__header">
        <view
          class="lh-transfer-panel__check-all"
          @click="checkAll('left')"
        >
          <lh-checkbox
            class="lh-transfer-panel__checkbox"
            :model-value="leftAllState === 'all'"
            :indeterminate="leftAllState === 'some'"
            :disabled="props.disabled"
            @change="checkAll('left')"
            @click.stop
          />
          <text class="lh-transfer-panel__title">{{ sourceTitleText }}</text>
        </view>
        <text class="lh-transfer-panel__count">{{ leftItems.length }} / {{ props.data.length }}</text>
      </view>

      <view class="lh-transfer-panel__body">
        <input
          class="lh-transfer-panel__search"
          :value="leftQuery"
          type="text"
          :placeholder="searchPlaceholderText"
          :disabled="props.disabled"
          :aria-label="searchPlaceholderText"
          @input="onQueryInput('left', $event)"
        >
        <scroll-view
          scroll-y
          :show-scrollbar="false"
          class="lh-transfer-panel__list"
          role="listbox"
          :aria-multiselectable="true"
          :aria-label="sourceTitleText"
        >
          <view
            v-for="(item, index) in filteredLeft"
            :key="item.key"
            class="lh-transfer-panel__item"
            :class="{ 'lh-transfer-panel__item--disabled': item.disabled }"
            role="option"
            :tabindex="itemTabIndex('left', index, !!item.disabled)"
            :aria-selected="checkedKeys.includes(item.key)"
            :aria-disabled="item.disabled || undefined"
            :data-transfer-key="item.key"
            @click="toggleItem(item)"
            @keydown="onItemKeydown($event, 'left', index)"
          >
            <lh-checkbox
              class="lh-transfer-panel__checkbox"
              :model-value="checkedKeys.includes(item.key)"
              :disabled="props.disabled || item.disabled"
              @change="toggleItem(item)"
              @click.stop
            />
            <text class="lh-transfer-panel__item-label">{{ item.label ?? item.key }}</text>
          </view>
          <view
            v-if="filteredLeft.length === 0"
            class="lh-transfer-panel__empty"
          >{{ emptyText }}</view>
        </scroll-view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="lh-transfer__actions">
      <button
        class="lh-transfer__button"
        :disabled="leftCheckedCount === 0 || props.disabled"
        :aria-label="moveRightText"
        @click="move('left-to-right')"
      >
        <text>›</text>
      </button>
      <button
        class="lh-transfer__button"
        :disabled="rightCheckedCount === 0 || props.disabled"
        :aria-label="moveLeftText"
        @click="move('right-to-left')"
      >
        <text>‹</text>
      </button>
    </view>

    <!-- 右面板（目标） -->
    <view :class="panelClasses('right')">
      <view class="lh-transfer-panel__header">
        <view
          class="lh-transfer-panel__check-all"
          @click="checkAll('right')"
        >
          <lh-checkbox
            class="lh-transfer-panel__checkbox"
            :model-value="rightAllState === 'all'"
            :indeterminate="rightAllState === 'some'"
            :disabled="props.disabled"
            @change="checkAll('right')"
            @click.stop
          />
          <text class="lh-transfer-panel__title">{{ targetTitleText }}</text>
        </view>
        <text class="lh-transfer-panel__count">{{ rightItems.length }} / {{ props.data.length }}</text>
      </view>

      <view class="lh-transfer-panel__body">
        <input
          class="lh-transfer-panel__search"
          :value="rightQuery"
          type="text"
          :placeholder="searchPlaceholderText"
          :disabled="props.disabled"
          :aria-label="searchPlaceholderText"
          @input="onQueryInput('right', $event)"
        >
        <scroll-view
          scroll-y
          :show-scrollbar="false"
          class="lh-transfer-panel__list"
          role="listbox"
          :aria-multiselectable="true"
          :aria-label="targetTitleText"
        >
          <view
            v-for="(item, index) in filteredRight"
            :key="item.key"
            class="lh-transfer-panel__item"
            :class="{ 'lh-transfer-panel__item--disabled': item.disabled }"
            role="option"
            :tabindex="itemTabIndex('right', index, !!item.disabled)"
            :aria-selected="checkedKeys.includes(item.key)"
            :aria-disabled="item.disabled || undefined"
            :data-transfer-key="item.key"
            @click="toggleItem(item)"
            @keydown="onItemKeydown($event, 'right', index)"
          >
            <lh-checkbox
              class="lh-transfer-panel__checkbox"
              :model-value="checkedKeys.includes(item.key)"
              :disabled="props.disabled || item.disabled"
              @change="toggleItem(item)"
              @click.stop
            />
            <text class="lh-transfer-panel__item-label">{{ item.label ?? item.key }}</text>
          </view>
          <view
            v-if="filteredRight.length === 0"
            class="lh-transfer-panel__empty"
          >{{ emptyText }}</view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useLhTransfer } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhTransferProps } from './types'

defineOptions({
  name: 'LhTransfer',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhTransferProps>(), {
  modelValue: () => [],
  disabled: false,
  sx: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [keys: Array<string | number>]
  change: [keys: Array<string | number>, direction: 'left-to-right' | 'right-to-left']
}>()

const {
  leftQuery,
  rightQuery,
  checkedKeys,
  leftItems,
  rightItems,
  filteredLeft,
  filteredRight,
  leftAllState,
  rightAllState,
  leftCheckedCount,
  rightCheckedCount,
  sourceTitleText,
  targetTitleText,
  moveRightText,
  moveLeftText,
  searchPlaceholderText,
  emptyText,
  transferClasses,
  transferStyle,
  panelClasses,
  onQueryInput,
  toggleItem,
  checkAll,
  move,
  itemTabIndex,
  onItemKeydown,
} = useLhTransfer(props, emit as LhEmitFn<'update:modelValue' | 'change'>)
</script>

<style src="./style.css"></style>
