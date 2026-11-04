# Transfer 穿梭框

雙欄列表 + 勾選移動。資料分區、過濾、全選與移動邏輯全部消費 `@lh-ui/share` 的
core 純函式（`partitionTransferData` / `filterTransferItems` /
`toggleTransferCheckAll` / `moveTransferKeys` 等），元件層只負責渲染、事件與
鍵盤導覽。雙欄均為 `role="listbox"`（APG listbox pattern）。

## 基礎用法

```vue
<template>
  <lh-transfer v-model="source" :data="items" @change="onChange" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhTransferItem } from '@lh-ui/share/core/transfer'

const source = ref<Array<string | number>>(['a'])
const items: LhTransferItem[] = [
  { key: 'a', label: '甲' },
  { key: 'b', label: '乙' },
  { key: 'c', label: '丙', disabled: true },
  { key: 'd', label: '丁' },
]

function onChange(keys: Array<string | number>, direction: 'left-to-right' | 'right-to-left') {
  console.log(keys, direction)
}
</script>
```

`v-model` 綁定左側（來源）鍵列表：鍵在 `modelValue` 裡的項目顯示在左欄，其餘在右欄。
勾選任意項目後點擊中間的 › / ‹ 按鈕即可穿梭，`update:modelValue` 與 `change`
（附帶方向 `'left-to-right'` / `'right-to-left'`）隨之觸發，勾選集合在移動後清空。

每側面板頂部內建搜尋框（與 Vue3 版一致，常駐不可關閉），依文案大小寫不敏感過濾；
面板標頭顯示「當前側數量 / 全量數量」計數與全選框（半選態由 `indeterminate` 承載）。

`data` 是 `LhTransferItem[]`：`key` 唯一、`label` 顯示文字（缺失時回退顯示 `key`）、
`disabled` 停用（不可勾選、不可全選、不可移動）。

## 停用

`disabled` 停用整個穿梭框：勾選、全選、搜尋、穿梭全鏈路攔截。

```vue
<template>
  <lh-transfer v-model="source" :data="items" disabled />
</template>
```

## API

### Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| data | 全量資料 | `LhTransferItem[]` | — |
| modelValue | 左側（來源）鍵列表（受控 v-model） | `Array<string \| number>` | `[]` |
| disabled | 停用 | `boolean` | `false` |
| sx | sx 快速佈局屬性 | `LhSxProps` | — |

### Events

| 事件 | 說明 | 參數 |
| --- | --- | --- |
| update:modelValue | 左側（來源）鍵列表變化（搭配 v-model） | `(keys: Array<string \| number>)` |
| change | 資料移動完成後觸發 | `(keys: Array<string \| number>, direction: 'left-to-right' \| 'right-to-left')` |

### LhTransferItem

| 欄位 | 說明 | 類型 |
| --- | --- | --- |
| key | 唯一鍵 | `string \| number` |
| label | 顯示文字（缺失時回退顯示 key） | `string` |
| disabled | 停用（不可勾選 / 不可全選 / 不可移動） | `boolean` |

### 無障礙

- 雙欄均為 `role="listbox"` + `aria-multiselectable`，項目為 `role="option"` +
  `aria-selected` / `aria-disabled`
- 每側獨立的搜尋框帶 `aria-label`；穿梭按鈕帶 `aria-label`（移到右側 / 移到左側）
- 全選框半選態由 `indeterminate` 承載；停用項目全鏈路攔截（勾選、全選、移動）

::: tip 平台差異（與 Vue3 版的差異）
- **API 範圍與 plus 真源嚴格對齊**：本端只提供 plus 已有的 `data` / `modelValue` /
  `disabled` / `sx`；社群常見但 plus 真源沒有的 `titles`（面板標題）、`filterable`
  （搜尋開關）、`props`（自訂欄位名）、`left/right-default-checked`
  （預設勾選鍵）等均未新增——面板標題改走 share locales 的
  `transfer.sourceTitle` / `transfer.targetTitle` 鍵（十語言齊備），搜尋框沿用
  plus 的常駐形態（無開關）。
- **雙列表由 scroll-view 承載**：plus 的 `<ul>` / `<li>` 列表在本倉換成
  `<scroll-view scroll-y>` + `<view>`（小程式端 `view` 的溢出捲動不可靠），
  H5 與微信小程式行為一致；列表樣式仍取 share 的 `.lh-transfer-panel__list`。
- **按鈕穿梭全端可用**：中間的 › / ‹ 穿梭按鈕是 uni 內建 `<button>`，
  H5 與小程式都可點擊，不存在平台差異；停用態由 `disabled` 屬性承載。
- **鍵盤導覽僅 H5**：上下方向鍵在過濾後的列表內移動焦點（跳過停用項，不循環）、
  Enter / Space 勾選當前項、左右方向鍵跨面板跳焦、Escape 重置焦點的
  APG listbox 模式鍵盤導覽只在 H5 端生效；小程式無鍵盤事件，整段由條件編譯
  裁剪（MP 包內無死程式碼），roving tabindex 同樣只在 H5 落值。
- **勾選框自繪**：全選框與列表項勾選框不用原生 `<input type="checkbox">`
  （小程式樣式不可控），改用本倉 `lh-checkbox`（view 自繪 + lh-icon），
  狀態仍由元件受控寫入，語意不變。
:::
