# Checkbox 复选框

::: tip 小程序端是 view 自绘
不用原生 checkbox 组件（MP 样式不可控），改用 view 自绘勾选框 + lh-icon 图标，
保证与家族其他端视觉一致。
:::

## 基础用法

```vue
<template>
  <lh-checkbox v-model="checked" label="同意协议" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const checked = ref(false)
</script>
```

## 复选框组

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

## 半选状态

```vue
<lh-checkbox v-model="checked" indeterminate label="全选（部分选中）" />
```

## Checkbox Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue (v-model) | 是否选中 | `boolean` | `false` |
| value | 在 group 中的标识值 | `unknown` | — |
| label | 文案 | `string` | — |
| disabled | 禁用 | `boolean` | `false` |
| indeterminate | 半选状态 | `boolean` | `false` |
| name | 原生 name | `string` | — |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | — |
| customClass | 自定义类名 | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## CheckboxGroup Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue (v-model) | 选中值数组 | `unknown[]` | `[]` |
| disabled | 禁用全部子项 | `boolean` | `false` |
| name | 原生 name | `string` | — |
| size | 尺寸（传导到子项） | `'small' \| 'medium' \| 'large'` | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 值变化 | `(value)` |
| change | 值变化 | `(value)` |
