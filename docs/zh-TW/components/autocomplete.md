# Autocomplete 自動補全

輸入即過濾的建議輸入框，輸入框（combobox）+ 下拉建議列表（listbox）。

## 基礎用法

```vue
<script setup>
import { ref } from 'vue'
const value = ref('')
const options = [
  { label: '水墨' },
  { label: '留白' },
  { label: '印章', value: 'seal' },
]
</script>

<template>
  <lh-autocomplete v-model="value" :options="options" />
</template>
```

選項只寫 `label` 時提交值即 label；需要機器標識時寫 `value`。停用項保留在列表中置灰展示，不可選中。

## 篩選

預設按 `label` 包含查詢字串過濾（忽略大小寫，首尾空白不參與匹配）：

```vue
<template>
  <lh-autocomplete v-model="value" :options="options" case-sensitive />
</template>
```

`case-sensitive` 開啟大小寫敏感；`trim` 傳 `false` 保留空白匹配。

## 選中回呼

```vue
<template>
  <lh-autocomplete v-model="value" :options="options" @select="onSelect" />
</template>
```

`select` 事件參數為提交值與原選項物件。

## Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| modelValue | 輸入值（v-model） | `string` | `''` |
| options | 建議選項 | `LhAutocompleteOption[]` | `[]` |
| caseSensitive | 大小寫敏感匹配 | `boolean` | `false` |
| trim | 去除查詢字串首尾空白後再匹配 | `boolean` | `true` |
| placeholder | 佔位提示 | `string` | — |
| placeholderStyle | 佔位樣式（替代 `::placeholder`） | `string` | — |
| disabled | 停用 | `boolean` | `false` |
| openOnFocus | 聚焦時展開建議面板 | `boolean` | `true` |
| ariaLabel | 無障礙名稱 | `string` | — |
| customClass | 自訂類別名稱 | `string` | — |
| sx | 快速佈局屬性 | `LhSxProps` | — |

## Slots

| 插槽 | 說明 |
| --- | --- |
| empty | 無匹配時的空狀態（預設文案取語言包 autocomplete.noMatch） |

## Events

| 事件 | 說明 | 回呼參數 |
| --- | --- | --- |
| update:modelValue | 輸入或選中後回寫 | `(value: string)` |
| change | 輸入值變化 | `(value: string)` |
| select | 選中某個建議項 | `(value: string \| number, option: LhAutocompleteOption)` |

## 方法（defineExpose）

| 方法 | 說明 |
| --- | --- |
| open / close | 手動展開 / 收起面板 |
| isOpen | 當前展閉狀態（唯讀） |

## 平台差異

| 能力 | H5 | 小程式 |
| --- | --- | --- |
| 下拉定位 | root-portal + 兩幀度量（同 select） | 支付寶按照基礎庫版本走 root-portal / 頁內 fixed；抖音頁內 fixed |
| 鍵盤導航 / Esc | 方向鍵移動高亮、Enter 選中、Esc 關閉 | 無鍵盤事件，僅點擊選中 |
| hover 高亮 | 有 | 無（點擊即選中） |
| openOnFocus | 聚焦展開 | 聚焦展開 |
