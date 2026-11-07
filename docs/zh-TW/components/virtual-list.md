# VirtualList 虛擬列表

萬條資料只渲染可視視窗。定高區間（`computeVirtualRange`）與動態高度
（`buildVirtualItems` / `findVirtualRange`）全部來自 `@lh-ui/share`
的 core 純函式，元件層只負責滾動驅動與視口度量。

## 平台差異

- **H5**：容器渲染為 `view`（`overflow: auto`），視口高度用
  `clientHeight` + `ResizeObserver` 度量。
- **微信小程式**：容器渲染為 `scroll-view`（`scroll-y`），
  滾動事件取 `detail.scrollTop`，視口高度用 `createSelectorQuery`
  度量（MP 無 `ResizeObserver`）。
- **動態高度**：`itemSize` 是宣告式函式契約（由呼叫方回傳每項高度），
  兩端同效，不依賴 MP 沒有的實測 API。

## 基礎用法（定高）

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
  label: `列表項 ${i + 1}`,
}))
</script>
```

`height` 設定容器高度，`item-height` 是定高模式的項高（需與實際項高
一致）。可視視窗外只保留 `overscan`（預設 2）屏的緩衝項。

## 動態高度

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
// itemSize 為宣告式函式：回傳每項高度，兩端同效
function sizeOf(index: number): number {
  return 48 + (index % 5) * 24
}
</script>
```

`item-height` 與 `item-size` 二選一：提供 `itemSize` 時走動態高度
模式（預先計算每項偏移 + 二分搜尋可視區間）。

## API

### Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| data | 資料來源（項渲染由 default 插槽負責） | `any[]` | `[]` |
| height | 容器高度（數字為 px） | `number \| string` | `300` |
| itemHeight | 定高模式的項高 | `number` | `-` |
| itemSize | 動態高度模式：回傳每項高度 | `(index: number) => number` | `-` |
| overscan | 過掃描項數（可視視窗外的緩衝項） | `number` | `2` |
| sx | 快速佈局屬性 | `LhSxProps` | `-` |

### Slots

| 插槽 | 說明 | 作用域參數 |
| --- | --- | --- |
| default | 項渲染 | `{ item, index }` |
