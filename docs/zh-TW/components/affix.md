# Affix 固定

將內容固定在視埠頂部或底部。固定判定（`isAffixFixed`）與固定樣式
（`getAffixFixedStyle`）來自 `@lh-ui/share` 的 core 純函式，元件層
只負責捲動訂閱、佔位度量與響應式膠水。

## 平台差異（重要）

H5 與微信小程式的捲動語意不同，本元件採用雙端方案：

- **H5**：元件自行監聽 `window`（或 `target` 選擇器指向的容器）的
  `scroll` 事件，用佔位節點的 `getBoundingClientRect` 判定固定態。
- **微信小程式**：`scroll` 事件只能綁在 `scroll-view` 標籤上，元件
  無法自行訂閱。需將元件置於 `scroll-view` 內，把捲動事件
  `detail.scrollTop` 透過 `scrollTop` prop 注入：

```vue
<template>
  <scroll-view
    class="my-scroll"
    :scroll-y="true"
    :scroll-top="scrollTop"
    @scroll="onScroll"
  >
    <lh-affix :scroll-top="scrollTop" :offset-top="20">
      <view class="my-bar">吸頂欄</view>
    </lh-affix>
    <!-- 長內容 -->
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

H5 端若不傳 `scrollTop`，元件會自動監聽 `window`；傳了 `target`
選擇器時監聽對應容器。

## 基礎用法

```vue
<template>
  <lh-affix :offset-top="20">
    <lh-button type="primary">吸頂按鈕</lh-button>
  </lh-affix>
</template>
```

內容捲動越過 `offset-top` 後固定在視埠頂部；固定後佔位元素以原高度
撐住文件位置，後文內容不跳變。

## 吸底模式

```vue
<template>
  <lh-affix :offset-bottom="24">
    <view class="my-bar">吸底欄</view>
  </lh-affix>
</template>
```

`offset-bottom` 優先於 `offset-top`：佔位底邊越過「視埠高 - offset-bottom」
時固定到底部。

## API

### Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| offset-top | 距視埠頂部多少像素觸發吸頂 | `number` | `0` |
| offset-bottom | 距視埠底部多少像素觸發吸底（優先於 offset-top） | `number` | `0` |
| target | H5 捲動容器選擇器（預設視埠；MP 端不生效） | `string` | `-` |
| scrollTop | 捲動位置注入（MP：scroll-view 的 `detail.scrollTop`） | `number` | `-` |
| sx | 快速佈局屬性（間距 / 尺寸 / flex） | `LhSxProps` | `-` |

### Events

| 事件 | 說明 | 回呼參數 |
| --- | --- | --- |
| change | 固定態變化時觸發 | `(fixed: boolean)` |

### 插槽

| 插槽 | 說明 |
| --- | --- |
| default | 需要固定的內容 |
