# Anchor 錨點導航

錨點導航：點選跳轉到對應區塊，滾動時連動高亮當前區塊。扁平化
（`flattenAnchorItems`）與活動錨點判定（`resolveActiveAnchor`）來自
`@lh-ui/share` 的 core 純函式。

## 平台差異（重要）

- **H5**：元件自行監聽 `window`（或 `target` 容器）滾動，錨點定位走
  原生 `scrollIntoView`。
- **微信小程序**：滾動連動需把 `scroll-view` 的 `detail.scrollTop`
  透過 `scrollTop` prop 注入；點選錨點時元件拋出
  `update:scrollIntoView`（目標區塊 id），綁定到 `scroll-view` 的
  `scroll-into-view` 屬性完成定位。未傳 `target` 時是頁面級定位，
  元件直接調 `uni.pageScrollTo({ selector })`。

```vue
<template>
  <scroll-view
    class="my-scroll"
    :scroll-y="true"
    :scroll-into-view="anchorTarget"
    @scroll="onScroll"
  >
    <view id="section-a" class="my-section">区块 A</view>
    <view id="section-b" class="my-section">区块 B</view>
    <lh-anchor
      :items="items"
      :scroll-top="scrollTop"
      @update:scroll-into-view="anchorTarget = $event"
    />
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const items = [
  { id: 'section-a', title: '区块 A' },
  { id: 'section-b', title: '区块 B' },
]
const scrollTop = ref(0)
const anchorTarget = ref('')
function onScroll(event: { detail?: { scrollTop?: number } }) {
  scrollTop.value = event.detail?.scrollTop ?? 0
}
</script>
```

## 基礎用法

```vue
<template>
  <lh-anchor :items="items" />
</template>

<script setup lang="ts">
const items = [
  { id: 'section-a', title: '区块 A' },
  {
    id: 'group-b',
    title: 'B 组',
    children: [
      { id: 'section-b', title: '区块 B' },
      { id: 'section-c', title: '区块 C' },
    ],
  },
]
</script>
```

`items` 支援子級（`children`），算繪時按深度優先扁平化並自動加上縮排。
活動錨點判定規則：最後一個「區塊頂邊滾動越過 `offset` 閾值線」的
錨點為活動項。

## 橫向排列

```vue
<template>
  <lh-anchor :items="items" direction="horizontal" />
</template>
```

## API

### Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| items | 錨點資料（支援 children 子級） | `LhAnchorItem[]` | `[]` |
| target | H5 滾動容器選擇器（預設 window） | `string` | — |
| scrollTop | 滾動位置注入（MP：scroll-view 的 `detail.scrollTop`） | `number` | — |
| offset | 活動判定的閾值（區塊頂邊距容器頂部的距離） | `number` | `0` |
| direction | 排列方向 | `'vertical' \| 'horizontal'` | `'vertical'` |
| smooth | 平滑滾動 | `boolean` | `true` |
| sx | 快速版面配置屬性 | `LhSxProps` | — |

### Events

| 事件 | 說明 | 回呼參數 |
| --- | --- | --- |
| change | 活動錨點變化時觸發 | `(id: string)` |
| click | 點選錨點項時觸發（先於滾動定位） | `(id: string)` |
| update:scrollIntoView | MP 定位契約：目標區塊 id，綁定到 scroll-into-view | `(id: string)` |
