# Icon 圖示

::: tip 小程序端是字型渲染
web 端（plus）用內聯 `<svg><path>`，小程序**不支援 `<svg>` 標籤**。
本庫在構建期把 share 的 SVG path 集合轉成 iconfont 字型（base64 內嵌在
`iconfont.css`），元件渲染 `<text class="lh-iconfont lh-iconfont--<name>">`。
顏色用 CSS `color`（**不能用 `fill` / `stroke`**），完整替代 web 端的 `currentColor` 語義。
:::

## 基礎用法

```vue
<template>
  <lh-icon name="search" />
  <lh-icon name="loading" size="24" color="#1677ff" />
  <lh-icon name="star" size="1.5em" />
</template>
```

## Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| name | 圖示名稱（share 的 `LH_ICON_SVGS_CONST` 鍵） | `LhIconName` | — |
| size | 尺寸（數字按 px；字串原樣透傳，如 `'1.5em'`） | `string \| number` | — |
| color | 顏色（替代 web 端 `currentColor`） | `string` | — |
| customClass | 自訂類別名（透傳到根節點） | `string` | — |
| themeVars | 元件級主題變數 | `Record<string, string>` | — |
| bgPattern | 元件級背景花紋 | `string` | — |

## 圖示清單

共 37 個圖示（24×24 單色、單 path），全部來自 `@lh-ui/share` 的 `LH_ICON_SVGS_CONST`。
構建命令 `pnpm build:iconfont` 會重新產生字型與碼點映射（`src/icon/icon-map.ts`）。

::: warning 別忘了引字型樣式
使用方需要引入 `@lh-ui/uniapp/src/icon/iconfont.css`，否則圖示顯示為空白方塊。
:::
