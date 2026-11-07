# InputTag 標籤輸入

輸入即提交的標籤組，支援觸發鍵、上限、去重與點刪。

## 基礎用法

```vue
<script setup>
import { ref } from 'vue'
const tags = ref(['水墨', '留白'])
</script>

<template>
  <lh-input-tag v-model="tags" placeholder="輸入後按 Enter 鍵提交" />
</template>
```

## 觸發鍵

`trigger` 支援 `enter`（預設）/ `space` / `comma`。`space` / `comma` 觸發時空白不進入輸入框。

```vue
<template>
  <lh-input-tag v-model="tags" trigger="comma" placeholder="輸入逗號提交" />
</template>
```

## 上限與去重

```vue
<template>
  <lh-input-tag v-model="tags" :max="3" allow-duplicate />
</template>
```

`max` 為正數時限上限（超限不提交，輸入被清空）；預設不允許重複（重複不提交）。

## 唯讀與禁用

```vue
<template>
  <lh-input-tag v-model="tags" readonly />
  <lh-input-tag v-model="tags" disabled />
</template>
```

## Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| modelValue | 標籤列表（v-model） | `string[]` | `[]` |
| trigger | 提交觸發鍵（小程式端一律走完成鍵） | `'enter' \| 'space' \| 'comma'` | `'enter'` |
| placeholder | 占位提示（僅無標籤時顯示） | `string` | `''` |
| placeholderStyle | 占位樣式（替代 `::placeholder`） | `string` | — |
| max | 標籤上限（非正數不限） | `number` | `0` |
| allowDuplicate | 允許重複標籤 | `boolean` | `false` |
| readonly | 唯讀 | `boolean` | `false` |
| disabled | 禁用 | `boolean` | `false` |
| ariaLabel | 無障礙名稱 | `string` | — |
| customClass | 自訂類別名 | `string` | — |
| sx | 快速版面配置屬性 | `LhSxProps` | — |

## Events

| 事件 | 說明 | 回呼參數 |
| --- | --- | --- |
| update:modelValue | 標籤列表變化 | `(value: string[])` |
| change | 標籤列表變化（同 modelValue） | `(value: string[])` |
| add | 提交單個標籤 | `(tag: string)` |
| remove | 移除單個標籤 | `(tag: string)` |

## 方法（defineExpose）

| 方法 | 說明 |
| --- | --- |
| focus | 聚焦輸入框 |
| commit | 提交當前輸入 |

## 平台差異

| 能力 | H5 | 小程式 |
| --- | --- | --- |
| 提交觸發鍵 | `trigger` 全支援（Enter / Space / Comma 鍵盤事件） | 一律走**完成鍵**（`@confirm`）；`space` / `comma` 觸發鍵語義僅 H5 |
| Backspace 刪尾 | 輸入為空時按 Backspace 刪最後一個標籤 | 無鍵盤事件，刪除走標籤的 **× 按鈕**（雙端可用） |
| 失焦提交 | 有 | 有 |
| 聚焦邊框 | `:has()` 聚焦樣式生效 | 聚焦邊框不可用（WXSS 不支援 `:has()`），輸入正常 |
