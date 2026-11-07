<template>
  <!-- H5：view 自带 overflow: auto（share CSS 已含），滚动事件走 target.scrollTop -->
  <!-- #ifdef H5 -->
  <view
    :id="rootId"
    :class="listClasses"
    :style="listStyle"
  >
    <view
      class="lh-virtual-list__phantom"
      :style="{ height: `${totalHeight}px` }"
    >
      <view
        class="lh-virtual-list__window"
        :style="windowStyle"
      >
        <view
          v-for="index in visibleIndexes"
          :key="index"
          class="lh-virtual-list__item"
          :style="itemStyle(index)"
        >
          <slot
            :item="props.data[index]"
            :index="index"
          />
        </view>
      </view>
    </view>
  </view>
  <!-- #endif -->

  <!-- MP：容器改 scroll-view（自身即滚动视口），滚动事件取 detail.scrollTop -->
  <!-- #ifndef H5 -->
  <scroll-view
    :id="rootId"
    :class="listClasses"
    :style="listStyle"
    :scroll-y="true"
    @scroll="onScroll"
  >
    <view
      class="lh-virtual-list__phantom"
      :style="{ height: `${totalHeight}px` }"
    >
      <view
        class="lh-virtual-list__window"
        :style="windowStyle"
      >
        <view
          v-for="index in visibleIndexes"
          :key="index"
          class="lh-virtual-list__item"
          :style="itemStyle(index)"
        >
          <slot
            :item="props.data[index]"
            :index="index"
          />
        </view>
      </view>
    </view>
  </scroll-view>
  <!-- #endif -->
</template>

<script lang="ts" setup>
import { LH_VIRTUAL_OVERSCAN } from '@lh-ui/share/core/virtual-list'
import { useLhVirtualList } from './logic'
import type { LhVirtualListProps } from './types'

defineOptions({
  name: 'LhVirtualList',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhVirtualListProps>(), {
  data: () => [],
  height: 300,
  itemHeight: undefined,
  itemSize: undefined,
  overscan: LH_VIRTUAL_OVERSCAN,
  sx: undefined,
})

const {
  rootId,
  totalHeight,
  visibleIndexes,
  listClasses,
  listStyle,
  windowStyle,
  itemStyle,
  onScroll,
} = useLhVirtualList(props)
</script>

<style src="./style.css"></style>

