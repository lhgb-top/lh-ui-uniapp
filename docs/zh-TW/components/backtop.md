# BackTop 返回頂部

滾動超過閾值後出現的返回頂部按鈕。可見性判定（`isBackTopVisible`）
與滾動命令（`backToTop`）來自 `@lh-ui/share` 的 core 純函式。

## 平台差異（重要）

- **H5**：元件自行監聽 `window`（或 `target` 容器）的 `scroll` 事件；
  點擊回頂直接捲動目標容器。
- **微信小程式**：需把 `scroll-view` 的捲動事件 `detail.scrollTop`
  透過 `scrollTop` prop 注入驅動顯隱；點擊回頂時元件拋出
  `update:scrollTop`（值為 0），綁定到 `scroll-view` 的 `scroll-top`
  屬性即可回頂。未傳 `target` 時是頁面級捲動，元件直接呼叫
  `uni.pageScrollTo`。

```vue
<template>
  <scroll-view
    class="my-scroll"
    :scroll-y="true"
    :scroll-top="scrollTop"
    @scroll="onScroll"
  >
    <!-- 長內容 -->
    <lh-backtop :scroll-top="scrollTop" @update:scroll-top="scrollTop = $event" />
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const scrollTop = ref(0)
function onScroll(event: { detail?: { scrollTop?: number } }) {
  scrollTop.value = event.detail?.scrollTop ?? 0
}
</script>
```

## 基礎用法

```vue
<template>
  <lh-backtop :visibility-height="200" />
</template>
```

頁面或容器捲動超過 `visibility-height`（預設 200px）後按鈕以淡入轉場
出現；點擊平滑回頂。

## 自訂內容與位置

```vue
<template>
  <lh-backtop :right="24" :bottom="80">
    <view class="my-backtop">頂部</view>
  </lh-backtop>
</template>
```

預設渲染一個圓形按鈕（內建 `arrow-up` 圖示）；`right` / `bottom`
控制距視窗右下角的偏移；預設插槽自訂按鈕內容。

## API

### Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| target | H5 捲動容器選擇器（預設視窗；MP 端僅用於區分頁面級 / scroll-view 級回頂） | `string` | `-` |
| scrollTop | 捲動位置注入（MP：scroll-view 的 `detail.scrollTop`） | `number` | `-` |
| visibility-height | 捲動多少像素後出現 | `number` | `200` |
| right | 距右側偏移（px） | `number` | `40` |
| bottom | 距底部偏移（px） | `number` | `40` |
| smooth | 平滑捲動 | `boolean` | `true` |
| sx | 快速版面配置屬性 | `LhSxProps` | `-` |

### Events

| 事件 | 說明 | 回呼參數 |
| --- | --- | --- |
| click | 點擊按鈕時觸發（先於捲動命令） | `(event: Event)` |
| scrollend | 捲動停止後觸發（防抖 150ms） | `(scrollTop: number)` |
| update:scrollTop | MP 回頂契約：值為 0，綁定到 scroll-view 的 scroll-top | `(scrollTop: number)` |

### 插槽

| 插槽 | 說明 |
| --- | --- |
| default | 按鈕內容（預設 arrow-up 圖示） |
