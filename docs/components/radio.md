# Radio 单选框

::: tip 小程序端是 view 自绘
不用原生 radio 组件（MP 样式不可控），改用 view 自绘圆点。
:::

## 基础用法

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue (v-model) | 是否选中 | `unknown` | — |
| value | 该项的值 | `unknown` | — |
| label | 文案 | `string` | — |
| disabled | 禁用 | `boolean` | `false` |
| name | 原生 name | `string` | — |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | — |
| customClass | 自定义类名 | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## RadioGroup Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue (v-model) | 选中值 | `unknown` | — |
| disabled | 禁用全部子项 | `boolean` | `false` |
| name | 原生 name | `string` | — |
| size | 尺寸（传导到子项） | `'small' \| 'medium' \| 'large'` | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 值变化 | `(value)` |
| change | 值变化 | `(value)` |
