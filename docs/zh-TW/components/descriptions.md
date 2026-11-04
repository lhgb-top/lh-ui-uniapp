# Descriptions 描述列表

用於展示物件的屬性列表，支援列數、跨列與邊框模式。條目資料由 `items` 傳入（`LhDescriptionsItem` 為 `@lh-ui/share` core 提供的條目型別），內容可用作用域插槽覆蓋。

## 基礎用法

```vue
<template>
  <lh-descriptions
    title="藏品檔案"
    :column="2"
    :items="[
      { label: '名稱', value: '青花纏枝蓮紋瓶' },
      { label: '年代', value: '明永樂' },
      { label: '類別', value: '瓷器' },
      { label: '級別', value: '一級文物' },
    ]"
  />
</template>
```

## 列數與跨列

`column` 控制每行列數，條目的 `span` 控制跨列。`span` 超出本列剩餘寬度時自動鉗制，最後一列不足時會自動補位（補位單元格標記為 `aria-hidden`，純裝飾）。

```vue
<template>
  <lh-descriptions
    :column="3"
    :items="[
      { label: '名稱', value: '千里江山圖', span: 2 },
      { label: '年代', value: '北宋' },
      { label: '作者', value: '王希孟' },
      { label: '材質', value: '絹本設色' },
      { label: '藏地', value: '北京故宮博物院' },
    ]"
  />
</template>
```

## 邊框模式

`border` 開啟表格邊框（邊框模式下列間距歸零、由單元格邊線拼成表格）。

```vue
<template>
  <lh-descriptions
    :column="2"
    border
    :items="[
      { label: '名稱', value: '蘭亭序' },
      { label: '作者', value: '王羲之' },
      { label: '年代', value: '東晉' },
      { label: '書體', value: '行書' },
    ]"
  />
</template>
```

## 自訂標題與內容

`title` 插槽覆蓋標題區；`item-<index>` 作用域插槽覆蓋對應條目的內容（`index` 為條目所在列內的單元格序號，作用域提供 `{ item }`）。

```vue
<template>
  <lh-descriptions :column="2" :items="items">
    <template #title>
      <text>藏品檔案（插槽標題）</text>
    </template>
    <template #item-1="{ item }">
      <lh-tag type="success">{{ item.value }}</lh-tag>
    </template>
  </lh-descriptions>
</template>

<script setup lang="ts">
const items = [
  { label: '狀態', value: '進行中' },
  { label: '進度', value: '已鑑定' },
]
</script>
```

## Props

| 屬性 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| title | 描述列表標題 | `string` | — |
| column | 每列展示的條目數 | `number` | `3` |
| border | 是否展示邊框 | `boolean` | `false` |
| items | 條目列表；label / value / span 三元組 | `[LhDescriptionsItem](#lhdescriptionsitem-型別)`[] | `() => []` |
| customClass | 自訂類名 | `string` | — |
| sx | 快速布局屬性 | `LhSxProps` | — |

## LhDescriptionsItem（型別）

來自 `@lh-ui/share` core（`LhDescriptionsItem`），本倉不重複定義。

| 屬性 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| label | 條目標籤 | `string` | — |
| value | 條目內容（也可用作用域插槽傳入） | `string \| number` | — |
| span | 佔據的列數，超出會鉗制 | `number` | `1` |

## Slots

| 插槽 | 說明 | 作用域 |
| --- | --- | --- |
| title | 自訂標題 | — |
| item-\<index\> | 覆蓋條目的內容（index 為所在列內的單元格序號） | `{ item }` |

## 平台差異

- 純展示元件，不觸及任何平台 API，H5 與微信小程式表現完全一致；`items` / `column` / `border` / `span` 行為與 Vue3 版對齊。
- Vue3 版用 `<dl>/<dt>/<dd>` 語義標籤，本倉換成 `<view>`（WXSS 標籤選擇器禁用，靠類名生效）；列布局由內聯 `flex` + 百分比 `flex-basis` 承載，寬度計算與 Vue3 版同一套公式。
- 邊框模式的表格線由 `@lh-ui/share` 的 styles 源提供，經 `build-styles` 淨化後在小程式端可用（淨化產物只含類選擇器與屬性，符合 WXSS 白名單）。
- 列結構聚合（span 歸一化、鉗制、換列、補位）全部由 `@lh-ui/share` 的 `buildDescriptionRows` 純函數產出，本倉只寫響應式膠水，不複製 core 實作。
