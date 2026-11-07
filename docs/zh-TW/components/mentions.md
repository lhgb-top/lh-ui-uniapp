# Mentions 提及

輸入 `@` 觸發的成員提及輸入框，支援過濾、多行與選中回呼。

## 基礎用法

```vue
<script setup>
import { ref } from 'vue'
const value = ref('')
const members = [
  { label: '水墨', value: 'ink' },
  { label: '留白', value: 'blank' },
]
</script>

<template>
  <lh-mentions v-model="value" :options="members" />
</template>
```

輸入 `@` 後建議面板展開，繼續輸入按 label 過濾；選中後寫回的是 `label`（人可讀的 `@水墨 `），機器標識 `value` 經 `select` 事件交業務層。

## 多行

```vue
<template>
  <lh-mentions v-model="value" :options="members" multiline />
</template>
```

`multiline` 把單行 input 換成 textarea。

## 觸發字元

```vue
<template>
  <lh-mentions v-model="value" :options="members" prefix="#" />
</template>
```

`prefix` 預設 `'@'`；緊貼 ASCII 詞字元的偽前綴（如郵箱 `user@`）不觸發。

## Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| modelValue | 文字內容（v-model） | `string` | `''` |
| options | 建議成員 | `LhMentionOption[]` | `[]` |
| prefix | 觸發字元 | `string` | `'@'` |
| placeholder | 佔位提示（預設取語言包 mentions.placeholder） | `string` | — |
| placeholderStyle | 佔位樣式（替代 `::placeholder`） | `string` | — |
| disabled | 停用 | `boolean` | `false` |
| multiline | 多行 textarea | `boolean` | `false` |
| ariaLabel | 無障礙名稱 | `string` | — |
| customClass | 自訂類別名稱 | `string` | — |
| sx | 快速佈局屬性 | `LhSxProps` | — |

## Slots

| 插槽 | 說明 |
| --- | --- |
| empty | 無匹配時的空狀態（預設文案取語言包 mentions.noMatch） |

## Events

| 事件 | 說明 | 回呼參數 |
| --- | --- | --- |
| update:modelValue | 輸入或選中後回寫 | `(value: string)` |
| change | 文字變化 | `(value: string)` |
| select | 選中某個提及項 | `(option: LhMentionOption)` |

## 方法（defineExpose）

| 方法 | 說明 |
| --- | --- |
| updateContext | 手動刷新游標上下文 |
| close | 收起建議面板 |

## 平台差異

| 能力 | H5 | 小程式 |
| --- | --- | --- |
| 下拉定位 | root-portal + 兩幀度量（同 select） | 支付寶按照基礎庫版本走 root-portal / 頁內 fixed；抖音頁內 fixed |
| 游標上下文 | 原生 `selectionStart`（可在文字中間觸發提及） | **拿不到游標位置，以文字末尾近似**——在已輸入文字中間觸發提及的場景失效，降級為末尾插入 |
| 鍵盤導航 / Esc | 方向鍵移動高亮、Enter 選中、Esc 關閉 | 無鍵盤事件，僅點擊選中 |
| 選中後游標落位 | 精確落到提及之後 | 受控回填後游標在末尾 |
