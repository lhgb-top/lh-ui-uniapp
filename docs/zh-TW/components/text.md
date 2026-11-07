# Text 排版文本

標題 / 正文 / 省略 / 複製的一站式排版組件，語義修飾全部落在 BEM 修飾類上。

## 級別

```vue
<template>
  <lh-text level="h1">一級標題</lh-text>
  <lh-text level="p">正文段落</lh-text>
  <lh-text level="caption">輔助說明</lh-text>
</template>
```

`level` 支援 `h1` ~ `h6` / `p`（預設）/ `caption`。非法值降級為 `p`。

## 語義與修飾

```vue
<template>
  <lh-text type="success" strong>成功且加粗</lh-text>
  <lh-text mark>標記高亮</lh-text>
  <lh-text code>程式碼風格</lh-text>
</template>
```

`type`：`default`（預設）/ `secondary` / `success` / `warning` / `danger`；修飾屬性：`strong` / `italic` / `underline` / `mark` / `code` / `disabled`。

## 省略

```vue
<template>
  <lh-text :ellipsis="true">單行省略</lh-text>
  <lh-text :ellipsis="2">兩行省略</lh-text>
</template>
```

`ellipsis` 傳 `true` 單行省略，傳數字按行數截斷（上限 10，多行省略走內聯 `-webkit-line-clamp`）。

## 複製

```vue
<template>
  <lh-text copyable copy-text="固定文案">點後面的按鈕複製</lh-text>
</template>
```

`copyable` 追加複製按鈕，點擊寫入剪貼簿並短暫切換為「已複製」，同時觸發 `copy` 事件（參數為實際寫入的文字）。

::: tip 小程式端複製
H5 端不傳 `copy-text` 時會自動取插槽文字；**小程式端組件讀不到插槽文字，必須傳 `copy-text`**，否則按鈕不會寫入（點擊仍會觸發 `copy` 事件）。文案走語言包 `text.copy` / `text.copied`，可用 `copy-label` 覆蓋。
:::

## Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| level | 標題級別與段落形態 | `'h1' \| ... \| 'h6' \| 'p' \| 'caption'` | `'p'` |
| type | 語義色 | `'default' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | `'default'` |
| strong / italic / underline / mark / code / disabled | 布林修飾 | `boolean` | `false` |
| ellipsis | 省略：`true` 單行，數字按行數 | `boolean \| number` | `false` |
| copyable | 追加複製按鈕 | `boolean` | `false` |
| copyLabel | 複製按鈕無障礙名稱 | `string` | — |
| copyText | 要複製的文字（小程式端必需） | `string` | — |
| customClass | 自訂類別名 | `string` | — |
| sx | 快速版面配置屬性 | `LhSxProps` | — |

## Events

| 事件 | 說明 | 回呼參數 |
| --- | --- | --- |
| copy | 複製按鈕點擊 | `(text: string)` |

## 平台差異

| 能力 | H5 | 小程式 |
| --- | --- | --- |
| 渲染載體 | view（排版由 `lh-text--<level>` 類承載） | 同 H5 |
| 複製 | 不傳 `copy-text` 時自動取插槽文字（`navigator.clipboard`） | 必須傳 `copy-text`，走 `uni.setClipboardData`（有系統提示） |
