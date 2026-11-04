<template>
  <view
    class="lh-pagination"
    :class="[
      `lh-pagination--${props.simple ? 'simple' : 'full'}`,
      { 'lh-pagination--disabled': props.disabled },
    ]"
    :style="sxStyle"
    role="navigation"
    aria-label="pagination"
  >
    <text
      v-if="props.showTotal"
      class="lh-pagination__total"
    >{{ totalText }}</text>

    <!-- 前后翻页与页码是 view 自绘点击（MP 的 button 无法 reset 默认样式），全端可用；
         view 无 :disabled 伪类（share 的 `&:disabled` 规则只匹配 button 元素），
         禁用外观由 SFC 内联兜底规则按同一令牌补齐（同 lh-segmented 先例） -->
    <view
      class="lh-pagination__btn lh-pagination__btn--prev"
      :class="{ 'lh-pagination__btn--disabled': isPrevDisabled }"
      role="button"
      :aria-label="prevLabel"
      :aria-disabled="isPrevDisabled"
      @click="go(innerCurrent - 1)"
    >
      <text aria-hidden="true">‹</text>
    </view>

    <view
      v-if="!props.simple"
      class="lh-pagination__pages"
    >
      <view
        v-for="(item, index) in range"
        :key="index"
        class="lh-pagination__cell"
      >
        <view
          v-if="item.type === 'page'"
          class="lh-pagination__btn lh-pagination__page"
          :class="{ 'lh-pagination__page--active': item.page === innerCurrent }"
          role="button"
          :aria-label="itemAriaList[index].label"
          :aria-current="itemAriaList[index].current"
          :aria-disabled="props.disabled"
          @click="go(item.page)"
        >{{ item.page }}</view>
        <text
          v-else
          class="lh-pagination__ellipsis"
          aria-hidden="true"
        >•••</text>
      </view>
    </view>

    <text
      v-else
      class="lh-pagination__simple-text"
    >{{ innerCurrent }} / {{ pageCount }}</text>

    <view
      class="lh-pagination__btn lh-pagination__btn--next"
      :class="{ 'lh-pagination__btn--disabled': isNextDisabled }"
      role="button"
      :aria-label="nextLabel"
      :aria-disabled="isNextDisabled"
      @click="go(innerCurrent + 1)"
    >
      <text aria-hidden="true">›</text>
    </view>

    <!-- 条数切换：uni 无 select，用内置 picker（selector 模式）承载，
         change 取值走 event.detail.value（选项下标） -->
    <picker
      v-if="props.showSizeChanger"
      class="lh-pagination__size"
      mode="selector"
      :range="props.pageSizes"
      :value="sizeIndex"
      :disabled="props.disabled"
      :aria-label="sizeChangerLabel"
      @change="handleSizeChange"
    >
      <text class="lh-pagination__size-label">{{ sizeChangerLabel }}</text>
      <text class="lh-pagination__size-select">{{ sizeText(innerPageSize) }}</text>
    </picker>

    <!-- 跳页输入：uni input 无原生 change，提交统一走 confirm / 失焦 blur
         （H5 回车会同时触发 confirm，同 input-number 先例），输入事件取值走
         event.detail.value -->
    <view
      v-if="props.showJumper"
      class="lh-pagination__jumper"
    >
      <label
        class="lh-pagination__jumper-label"
        :for="jumperId"
      >{{ gotoLabel }}</label>
      <input
        :id="jumperId"
        class="lh-pagination__jumper-input"
        type="number"
        :value="jumpDisplay"
        :disabled="props.disabled"
        @input="handleJumpInput"
        @confirm="handleJump"
        @blur="handleJump"
      >
      <text
        v-if="pageSuffixText"
        class="lh-pagination__jumper-suffix"
      >{{ pageSuffixText }}</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useLhPagination } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhPaginationProps } from './types'

defineOptions({
  name: 'LhPagination',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhPaginationProps>(), {
  pageSize: 10,
  current: undefined,
  pageSizes: () => [10, 20, 30, 40],
  showTotal: false,
  showSizeChanger: false,
  showJumper: false,
  simple: false,
  disabled: false,
  sx: undefined,
})

const emit = defineEmits<{
  'update:current': [page: number]
  'update:pageSize': [size: number]
  change: [page: number]
  'size-change': [size: number]
}>()

const {
  innerCurrent,
  innerPageSize,
  pageCount,
  range,
  sizeIndex,
  jumpDisplay,
  jumperId,
  totalText,
  prevLabel,
  nextLabel,
  gotoLabel,
  pageSuffixText,
  sizeChangerLabel,
  isPrevDisabled,
  isNextDisabled,
  itemAriaList,
  sxStyle,
  sizeText,
  go,
  handleSizeChange,
  handleJumpInput,
  handleJump,
} = useLhPagination(
  props,
  emit as LhEmitFn<'update:current' | 'update:pageSize' | 'change' | 'size-change'>,
)
</script>

<style src="./style.css"></style>

<!-- view 无 :disabled 伪类（share 的 `&:disabled` 规则只匹配 button 元素），
     前后翻页与页码的禁用外观在两端都拿不到 share 的禁用规则，
     这里按同一令牌补类名兜底；不进 build-styles 产物，仅本组件内联生效
     （同 lh-segmented / lh-input-number 先例）。 -->
<style>
.lh-pagination__btn--disabled {
  color: var(--lh-disabled-text-color, #c8c8c8);
}
</style>
