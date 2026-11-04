<template>
  <view
    class="lh-descriptions"
    :class="descriptionsClasses"
    :style="sxStyle"
  >
    <view
      v-if="props.title || hasTitleSlot"
      class="lh-descriptions__header"
    >
      <slot name="title">{{ props.title }}</slot>
    </view>
    <view class="lh-descriptions__body">
      <view
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
        class="lh-descriptions__row"
        :style="{ display: 'flex' }"
      >
        <template
          v-for="(cell, cellIndex) in row.cells"
          :key="`${rowIndex}-${cellIndex}`"
        >
          <view
            class="lh-descriptions__label"
            :style="{ flex: `0 0 ${labelBasis()}%` }"
          >
            {{ cell.item.label }}
          </view>
          <view
            class="lh-descriptions__content"
            :style="{ flex: `0 0 ${contentBasis(cell.span)}%` }"
          >
            <slot
              :item="cell.item"
              :name="`item-${cellIndex}`"
            >
              {{ cell.item.value }}
            </slot>
          </view>
        </template>
        <view
          v-if="row.filler > 0"
          class="lh-descriptions__filler"
          :style="{ flex: `0 0 ${contentBasis(row.filler)}%` }"
          aria-hidden="true"
        />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, useSlots } from 'vue'
import { useLhDescriptions } from './logic'
import type { LhDescriptionsProps } from './types'

defineOptions({
  name: 'LhDescriptions',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhDescriptionsProps>(), {
  title: undefined,
  column: 3,
  border: false,
  items: () => [],
  customClass: undefined,
  sx: undefined,
})

const slots = useSlots()

// 标题区仅在传入 title 或占位 title 插槽时渲染（与 plus 一致）
const hasTitleSlot = computed(() => !!slots.title)

const {
  sxStyle,
  rows,
  descriptionsClasses,
  labelBasis,
  contentBasis,
} = useLhDescriptions(props)
</script>

<!-- 样式为构建产物：share 的 descriptions scss 经 build-styles 净化生成（禁止手改） -->
<style src="./style.css"></style>
