# Skeleton 骨架屏

資料載入未就緒時的佔位，`loading` 為 false 時渲染真實內容。

## 基礎用法

```vue
<template>
  <lh-skeleton :loading="loading">
    <view>真实内容</view>
  </lh-skeleton>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const loading = ref(true)
</script>
```

## 行數與頭像

```vue
<template>
  <lh-skeleton :loading="true" :rows="4" avatar />
</template>
```

## 關閉動畫

```vue
<template>
  <lh-skeleton :loading="true" :animated="false" :rows="3" />
</template>
```

## 獨立佔位塊

`lh-skeleton-item` 可單獨使用拼裝自訂佔位版面配置，`variant` 取 `text` / `rect` / `circle`。

```vue
<template>
  <view class="custom-skeleton">
    <lh-skeleton-item variant="circle" class="avatar" />
    <lh-skeleton-item variant="text" class="line" />
  </view>
</template>
```

## Props（lh-skeleton）

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| loading | 是否處於載入態（false 時渲染 default 插槽的真實內容） | `boolean` | `true` |
| rows | 文字行數 | `number` | `3` |
| avatar | 是否包含圓形頭像佔位 | `boolean` | `false` |
| animated | 是否開啟動畫 | `boolean` | `true` |
| customClass | 自訂類別名 | `string` | — |
| sx | 快速版面配置屬性 | `LhSxProps` | — |

## Props（lh-skeleton-item）

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| variant | 佔位塊形狀 | `'text' \| 'rect' \| 'circle'` | `'text'` |
| animated | 是否開啟動畫 | `boolean` | `true` |
| customClass | 自訂類別名 | `string` | — |
| sx | 快速版面配置屬性 | `LhSxProps` | — |

## Slots（lh-skeleton）

| 插槽 | 說明 |
| --- | --- |
| default | `loading` 為 false 時渲染的真實內容 |

::: tip 無障礙
容器標記 `aria-busy="true"` 與 `aria-live="polite"`，佔位塊自身對輔助技術隱藏；資料就緒後讀屏會自動播報真實內容。
:::
