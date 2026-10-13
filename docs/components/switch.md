# Switch 开关

::: tip 小程序端是 view 自绘
原生 switch 组件在小程序里样式不可控，用 view 自绘滑块保证视觉一致。
:::

## 基础用法

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue (v-model) | 是否开启 | `boolean` | `false` |
| disabled | 禁用 | `boolean` | `false` |
| loading | 加载中 | `boolean` | `false` |
| name | 原生 name | `string` | — |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | — |
| activeText | 开启文案 | `string` | — |
| inactiveText | 关闭文案 | `string` | — |
| customClass | 自定义类名 | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 值变化 | `(value: boolean)` |
| change | 值变化 | `(value: boolean)` |
