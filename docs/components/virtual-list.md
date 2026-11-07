# VirtualList 虚拟列表

万条数据只渲染可视窗口。定高区间（`computeVirtualRange`）与动态高度
（`buildVirtualItems` / `findVirtualRange`）全部来自 `@lh-ui/share`
的 core 纯函数，组件层只负责滚动驱动与视口度量。

## 平台差异

- **H5**：容器渲染为 `view`（`overflow: auto`），视口高度用
  `clientHeight` + `ResizeObserver` 度量。
- **微信小程序**：容器渲染为 `scroll-view`（`scroll-y`），
  滚动事件取 `detail.scrollTop`，视口高度用 `createSelectorQuery`
  度量（MP 无 `ResizeObserver`）。
- **动态高度**：`itemSize` 是声明式函数契约（由调用方返回每项高度），
  两端同效，不依赖 MP 没有的实测 API。

## 基础用法（定高）

```vue
<template>
  <lh-virtual-list :data="items" :height="360" :item-height="48">
    <template #default="{ item, index }">
      <view class="my-item">第 {{ index + 1 }} 行：{{ item.label }}</view>
    </template>
  </lh-virtual-list>
</template>

<script setup lang="ts">
const items = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  label: `列表项 ${i + 1}`,
}))
</script>
```

`height` 设定容器高度，`item-height` 是定高模式的项高（需与实际项高
一致）。可视窗口外只保留 `overscan`（默认 2）屏的缓冲项。

## 动态高度

```vue
<template>
  <lh-virtual-list :data="items" :height="360" :item-size="sizeOf">
    <template #default="{ item, index }">
      <view class="my-item" :style="{ height: `${sizeOf(index)}px` }">
        第 {{ index + 1 }} 行：{{ item.label }}
      </view>
    </template>
  </lh-virtual-list>
</template>

<script setup lang="ts">
// itemSize 为声明式函数：返回每项高度，两端同效
function sizeOf(index: number): number {
  return 48 + (index % 5) * 24
}
</script>
```

`item-height` 与 `item-size` 二选一：提供 `itemSize` 时走动态高度
模式（预计算每项偏移 + 二分查找可视区间）。

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 数据源（项渲染由 default 插槽负责） | `any[]` | `[]` |
| height | 容器高度（数字为 px） | `number \| string` | `300` |
| itemHeight | 定高模式的项高 | `number` | `-` |
| itemSize | 动态高度模式：返回每项高度 | `(index: number) => number` | `-` |
| overscan | 过扫描项数（可视窗口外的缓冲项） | `number` | `2` |
| sx | 快速布局属性 | `LhSxProps` | `-` |

### 插槽

| 插槽 | 说明 | 作用域参数 |
| --- | --- | --- |
| default | 项渲染 | `{ item, index }` |
