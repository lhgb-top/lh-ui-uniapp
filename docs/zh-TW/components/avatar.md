# Avatar 頭像

展示使用者或事物的頭像，支援圖片、圖示、文字三種形態。

## 基礎用法

```vue
<template>
  <lh-avatar src="https://placeholder.invalid/avatar.png" />
  <lh-avatar icon="user" />
  <lh-avatar text="水墨" />
</template>
```

## 形狀與尺寸

```vue
<template>
  <lh-avatar text="水" shape="circle" />
  <lh-avatar text="墨" shape="square" />
  <lh-avatar text="小" size="small" />
  <lh-avatar text="大" size="large" />
</template>
```

## 裁剪模式

`fit` 映射 uni `<image>` 的 `mode`：`fill` → `scaleToFill`、`contain` → `aspectFit`、`cover` → `aspectFill`、`none` → `center`。

```vue
<template>
  <lh-avatar src="https://placeholder.invalid/avatar.png" fit="cover" />
  <lh-avatar src="https://placeholder.invalid/avatar.png" fit="contain" />
</template>
```

::: tip scale-down 是近似
uni 沒有 `scale-down` 的等價 mode，取語義最接近的 `aspectFit`（保持比例完整展示，不放大）。
:::

## 載入失敗回退

圖片載入失敗時按「圖示 → 文字 → 空」順序回退，並觸發 `error` 事件。

```vue
<template>
  <lh-avatar
    src="https://placeholder.invalid/broken.png"
    icon="user"
    alt="头像"
    @error="onError"
  />
</template>

<script setup lang="ts">
const onError = () => console.log('图片加载失败')
</script>
```

## Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| src | 圖片位址；為空時依次回退到圖示、文字 | `string` | — |
| alt | 圖片載入失敗的替代文字，同時作為無障礙名稱 | `string` | — |
| icon | 圖示名（src 為空或載入失敗時展示） | `LhIconName` | — |
| text | 文字頭像內容（src 與 icon 都缺省時取首字展示） | `string` | — |
| shape | 形狀 | `'circle' \| 'square'` | `'circle'` |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| fit | 圖片裁剪模式（映射 uni image 的 mode） | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'cover'` |
| customClass | 自訂類別名 | `string` | — |
| sx | 快速版面配置屬性 | `LhSxProps` | — |

## Events

| 事件 | 說明 | 回呼參數 |
| --- | --- | --- |
| error | 圖片載入失敗 | `(e: Event)` |
