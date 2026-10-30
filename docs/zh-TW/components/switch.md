# Switch 開關

::: tip 小程序端是 view 自繪
原生 switch 元件在小程序裡樣式不可控，用 view 自繪滑桿保證視覺一致。
:::

## 基礎用法

```vue
<template>
  <lh-switch v-model="on" />
  <lh-switch v-model="on" active-text="开" inactive-text="关" />
  <lh-switch v-model="on" loading />
  <lh-switch v-model="on" disabled />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const on = ref(true)
</script>
```

## Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| modelValue (v-model) | 是否開啟 | `boolean` | `false` |
| disabled | 停用 | `boolean` | `false` |
| loading | 載入中 | `boolean` | `false` |
| name | 原生 name | `string` | — |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | — |
| activeText | 開啟文案 | `string` | — |
| inactiveText | 關閉文案 | `string` | — |
| customClass | 自訂類別名 | `string` | — |
| sx | 快速版面配置屬性 | `LhSxProps` | — |

## Events

| 事件 | 說明 | 回呼參數 |
| --- | --- | --- |
| update:modelValue | 值變化 | `(value: boolean)` |
| change | 值變化 | `(value: boolean)` |
