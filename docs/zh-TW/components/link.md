# Link 連結

文字超連結，支援語義類型、底線形態與前後綴圖示位。

## 基礎用法

```vue
<template>
  <lh-link>預設連結</lh-link>
  <lh-link type="primary">主要連結</lh-link>
</template>
```

`type`：`default`（預設）/ `primary` / `success` / `warning` / `danger` / `info`。

## 底線

```vue
<template>
  <lh-link underline="always">常駐</lh-link>
  <lh-link underline="none">無</lh-link>
</template>
```

`underline`：`always` 常駐 / `hover` 滑鼠懸停時出現（預設）/ `none` 無。

## 禁用與前後綴

```vue
<template>
  <lh-link disabled>禁用連結</lh-link>
  <lh-link>
    <template #prefix><lh-icon name="left" /></template>
    上一頁
  </lh-link>
</template>
```

## Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| href | 連結地址（disabled 時不渲染 href） | `string` | — |
| target | 目標視窗（僅 H5） | `string` | — |
| type | 連結語義類型 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| underline | 底線形態 | `'always' \| 'hover' \| 'none'` | `'hover'` |
| disabled | 禁用 | `boolean` | `false` |
| current | 當前頁標記（輸出 `aria-current`） | `'page' \| 'location' \| true` | — |
| customClass | 自訂類別名 | `string` | — |
| sx | 快速版面配置屬性 | `LhSxProps` | — |

## Slots

| 插槽 | 說明 |
| --- | --- |
| default | 連結文字 |
| prefix | 前綴圖示位 |
| suffix | 後綴圖示位 |

## Events

| 事件 | 說明 | 回呼參數 |
| --- | --- | --- |
| click | 點擊 | `(event: Event)` |

## 平台差異

| 能力 | H5 | 小程式 |
| --- | --- | --- |
| 載體 | view + `@click` | 同 H5（`href` / `target` 無導航語義，跳轉由業務層在 `click` 事件裡處理） |
| 懸停底線 | 有 | 無（`underline="always"` / `"none"` 可見；VIEW 的底線渲染以實際效果為準） |
