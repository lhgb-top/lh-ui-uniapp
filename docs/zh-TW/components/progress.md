# Progress 進度條

展示任務進度，支援狀態色、自訂顏色與文字格式化。

## 基礎用法

```vue
<template>
  <lh-progress :percentage="42" />
</template>
```

## 狀態

```vue
<template>
  <lh-progress :percentage="70" status="success" />
  <lh-progress :percentage="70" status="warning" />
  <lh-progress :percentage="70" status="exception" />
  <lh-progress :percentage="100" />
</template>
```

`status` 為 `normal` 且達到 100 時自動視為 `success`。

## 線寬與隱藏文字

```vue
<template>
  <lh-progress :percentage="60" :stroke-width="12" />
  <lh-progress :percentage="60" :show-text="false" />
</template>
```

## 自訂顏色

字串直接作為條色，函式則按百分比傳回顏色。

```vue
<template>
  <lh-progress :percentage="60" color="#C4A35A" />
  <lh-progress :percentage="60" :color="gradient" />
</template>

<script setup lang="ts">
const gradient = (p: number) => `rgb(${p}, 0, 0)`
</script>
```

## 自訂格式化與文字插槽

```vue
<template>
  <lh-progress :percentage="42" :format="format" />
  <lh-progress :percentage="42">
    <template #text="{ percentage }">
      <text>{{ percentage }} / 100</text>
    </template>
  </lh-progress>
</template>

<script setup lang="ts">
const format = (p: number) => `进度 ${p}`
</script>
```

## Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| percentage | 進度百分比 0-100（超出會自動鉗制） | `number` | `0` |
| type | 類型 | `'line' \| 'circle'` | `'line'` |
| status | 狀態 | `'normal' \| 'success' \| 'warning' \| 'exception'` | `'normal'` |
| color | 進度條顏色：字串或按百分比傳回顏色的函式 | `string \| ((percentage: number) => string)` | — |
| strokeWidth | 線條寬度 px | `number` | `6` |
| width | 圓形模式畫布寬度 px | `number` | `126` |
| showText | 是否顯示文字 | `boolean` | `true` |
| format | 自訂文字格式化 | `(percentage: number) => string` | — |
| customClass | 自訂類別名 | `string` | — |
| sx | 快速版面配置屬性 | `LhSxProps` | — |

## Slots

| 插槽 | 說明 | 作用域參數 |
| --- | --- | --- |
| text | 自訂進度文字 | `{ percentage: number }` |

::: tip circle 型暫未實作
小程序對 svg 支援有限，首版只實作 line 型。傳入 `type="circle"` 會按 line 渲染並在開發期告警一次（不靜默降級），circle 留待二期。
:::
