# Segmented 分段器

互斥選項切換，常用於視圖切換場景。資料驅動：選項由 `options` 陣列直接給出，不需手動組子元件。

## 基礎用法

`options` 支援字串快捷寫法，`modelValue`（`v-model`）為目前選中值。

```vue
<template>
  <lh-segmented v-model="view" :options="['列表', '卡片', '表格']" />
</template>

<script setup>
import { ref } from 'vue'
const view = ref('列表')
</script>
```

## 物件選項

物件寫法提供 `label` / `value`，適合「顯示文案與值不同」的場景。

```vue
<template>
  <lh-segmented
    v-model="mode"
    :options="[
      { label: '日', value: 'day' },
      { label: '週', value: 'week' },
      { label: '月', value: 'month' },
    ]"
  />
</template>

<script setup>
import { ref } from 'vue'
const mode = ref('day')
</script>
```

## 禁用項與整組禁用

選項物件帶 `disabled: true` 時該項不可選；元件級 `disabled` 禁用整個分段器。

```vue
<template>
  <lh-segmented
    v-model="seg"
    :options="[
      { label: '立春', value: 'lichun' },
      { label: '雨水', value: 'yushui' },
      { label: '驚蟄', value: 'jingzhe', disabled: true },
    ]"
  />
  <lh-segmented v-model="all" disabled :options="['甲', '乙', '丙']" />
</template>

<script setup>
import { ref } from 'vue'
const seg = ref('lichun')
const all = ref('甲')
</script>
```

## 區塊寬度

`block` 讓分段器撐滿容器，選項平分寬度（視圖切換欄常用）。

```vue
<template>
  <lh-segmented v-model="block" block :options="['詩', '詞', '曲', '賦']" />
</template>

<script setup>
import { ref } from 'vue'
const block = ref('詩')
</script>
```

## Props

| 屬性 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| modelValue (v-model) | 目前值（受控 v-model，搭配 `update:modelValue` 事件） | `string \| number` | — |
| options | 選項（字串快捷寫法或 `{ label, value, disabled }` 物件） | `[LhSegmentedInput](#型別說明)[]` | — |
| disabled | 整組禁用 | `boolean` | `false` |
| block | 撐滿容器（選項平分寬度） | `boolean` | `false` |
| customClass | 自訂類名（透傳到根節點） | `string` | — |
| sx | 快速佈局屬性 | `LhSxProps` | — |

### 型別說明

```ts
/** 選項值型別 */
type LhSegmentedValue = string | number

/** 選項物件形態 */
interface LhSegmentedOption {
  label: string
  value: LhSegmentedValue
  disabled?: boolean
}

/** 輸入選項（字串快捷寫法或物件） */
type LhSegmentedInput = LhSegmentedValue | LhSegmentedOption
```

## Events

| 事件名 | 說明 | 回呼參數 |
| --- | --- | --- |
| update:modelValue | 選中項變化時觸發，搭配 v-model 使用 | `(value: string \| number)` |
| change | 選中項變化時觸發（點擊與方向鍵均會觸發） | `(value: string \| number)` |

## 平台差異

- **view 自繪觸控互動，全端可用**：plus 的 `<div>` + `<button>` 在本庫換成 `<view>`（WXSS 禁標籤選擇器，靠類名生效）；選中切換透過 `@click` 觸發，H5 與微信小程式表現一致，無任何平台 API 依賴。
- **選中滑塊是純 CSS 轉場**：選中項的背景色 / 陰影由類名切換驅動，WXSS 支援 `transition` 簡單轉場，兩端都有漸變效果；**不依賴 `transitionend`**（小程式端該事件不可靠，本倉 message / loading 等動效元件一律改用 setTimeout 對齊，分段器則連 JS 編排都不需要——純 CSS 即可，無時序對齊負擔）。
- **鍵盤方向鍵導覽僅 H5**：roving tabindex（方向鍵移動選中項、首尾循環、跳過禁用項，複用 `@lh-ui/share` core 的 `getNextListIndex` / `getRovingTabIndex`）在小程式端沒有鍵盤事件，SFC 的 `@keydown` 處理由條件編譯守護、MP 包內不呼叫；小程式端只能點選。
- **禁用項外觀走類名兜底**：share 樣式源的禁用樣式寫在 `&:disabled` 偽類上（只匹配 button 元素），view 沒有該偽類，本元件在 SFC 內聯按同一權杖（`--lh-disabled-text-color`）補了 `lh-segmented__option--disabled` 類規則（同 lh-spinner / lh-empty 的內聯兜底先例，不進淨化產物）。
- **無障礙屬性攤開綁定**：`role="radiogroup"` / `role="radio"` + `aria-checked` / `aria-disabled` 的契約仍由 share 的 `getSegmentedAria` / `getSegmentedItemAria` 決定，因小程式模板編譯器不支援 `v-bind` 物件，膠水層把屬性包攤成逐項顯式綁定。
- **移植結論**：segmented 是無度量 / 無彈層 / 無 document 依賴的純切換元件，選項規範化、類名與無障礙屬性全部由 `@lh-ui/share` core 純函數產出，倉內只寫響應式膠水；與 Vue3 版 API 完全一致（`modelValue` / `options` / `disabled` / `block` / `sx`）。
