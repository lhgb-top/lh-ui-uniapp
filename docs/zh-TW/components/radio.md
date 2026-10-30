# Radio 單選鈕

::: tip 小程序端是 view 自繪
不用原生 radio 元件（MP 樣式不可控），改用 view 自繪圓點。
:::

## 基礎用法

```vue
<template>
  <lh-radio-group v-model="value">
    <lh-radio value="a" label="选项一" />
    <lh-radio value="b" label="选项二" />
    <lh-radio value="c" label="选项三" disabled />
  </lh-radio-group>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref('a')
</script>
```

## Radio Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| modelValue (v-model) | 是否選取 | `unknown` | — |
| value | 該項的值 | `unknown` | — |
| label | 文案 | `string` | — |
| disabled | 停用 | `boolean` | `false` |
| name | 原生 name | `string` | — |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | — |
| customClass | 自訂類別名 | `string` | — |
| sx | 快速版面配置屬性 | `LhSxProps` | — |

## RadioGroup Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| modelValue (v-model) | 選取值 | `unknown` | — |
| disabled | 停用全部子項 | `boolean` | `false` |
| name | 原生 name | `string` | — |
| size | 尺寸（傳導到子項） | `'small' \| 'medium' \| 'large'` | — |

## Events

| 事件 | 說明 | 回呼參數 |
| --- | --- | --- |
| update:modelValue | 值變化 | `(value)` |
| change | 值變化 | `(value)` |
