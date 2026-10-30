# Checkbox 核取方塊

::: tip 小程序端是 view 自繪
不用原生 checkbox 元件（MP 樣式不可控），改用 view 自繪勾選框 + lh-icon 圖示，
保證與家族其他端視覺一致。
:::

## 基礎用法

```vue
<template>
  <lh-checkbox v-model="checked" label="同意协议" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const checked = ref(false)
</script>
```

## 核取方塊群組

```vue
<template>
  <lh-checkbox-group v-model="values">
    <lh-checkbox value="a" label="选项一" />
    <lh-checkbox value="b" label="选项二" />
    <lh-checkbox value="c" label="选项三" disabled />
  </lh-checkbox-group>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const values = ref(['a'])
</script>
```

## 半選狀態

```vue
<lh-checkbox v-model="checked" indeterminate label="全选（部分选中）" />
```

## Checkbox Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| modelValue (v-model) | 是否選取 | `boolean` | `false` |
| value | 在 group 中的識別值 | `unknown` | — |
| label | 文案 | `string` | — |
| disabled | 停用 | `boolean` | `false` |
| indeterminate | 半選狀態 | `boolean` | `false` |
| name | 原生 name | `string` | — |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | — |
| customClass | 自訂類別名 | `string` | — |
| sx | 快速版面配置屬性 | `LhSxProps` | — |

## CheckboxGroup Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| modelValue (v-model) | 選取值陣列 | `unknown[]` | `[]` |
| disabled | 停用全部子項 | `boolean` | `false` |
| name | 原生 name | `string` | — |
| size | 尺寸（傳導到子項） | `'small' \| 'medium' \| 'large'` | — |

## Events

| 事件 | 說明 | 回呼參數 |
| --- | --- | --- |
| update:modelValue | 值變化 | `(value)` |
| change | 值變化 | `(value)` |
