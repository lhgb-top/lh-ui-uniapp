<template>
  <demo-page title="VirtualList 虚拟列表">
    <demo-block title="定高模式（万条数据）">
      <lh-virtual-list
        :data="items"
        :height="360"
        :item-height="48"
      >
        <template #default="{ item, index }">
          <view class="demo-vl-item">
            <text class="demo-vl-label">第 {{ index + 1 }} 行</text>
            <text class="demo-vl-value">{{ item.label }}</text>
          </view>
        </template>
      </lh-virtual-list>
      <text class="demo-value">共 {{ items.length }} 条，仅渲染可视窗口 + 过扫描</text>
    </demo-block>

    <demo-block title="动态高度模式（itemSize 声明式）">
      <lh-virtual-list
        :data="items"
        :height="360"
        :item-size="sizeOf"
      >
        <template #default="{ item, index }">
          <view
            class="demo-vl-item"
            :style="{ height: `${sizeOf(index)}px` }"
          >
            <text class="demo-vl-label">第 {{ index + 1 }} 行（高 {{ sizeOf(index) }}px）</text>
            <text class="demo-vl-value">{{ item.label }}</text>
          </view>
        </template>
      </lh-virtual-list>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

/** 万条数据源：验证只有可视区间进入渲染 */
const items = ref(
  Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    label: `虚拟列表项 ${i + 1}`,
  })),
)

/** 声明式动态高度：与 plus 同款的 itemSize 函数契约，两端同效 */
function sizeOf(index: number): number {
  return 48 + (index % 5) * 24
}
</script>

<style>
.demo-vl-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 16px;
  border-block-end: 1px solid var(--lh-border-color-lighter, #eee9e2);
}

.demo-vl-label {
  color: var(--lh-text-primary, #2c2c2c);
  font-size: 14px;
}

.demo-vl-value {
  color: var(--lh-text-secondary, #8a8a8a);
  font-size: 13px;
}
</style>
