# Select 选择器

## 基础用法

```vue
<template>
  <lh-select v-model="value" :options="options" placeholder="请选择" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref()
const options = [
  { label: '选项一', value: 'a' },
  { label: '选项二', value: 'b' },
  { label: '禁用项', value: 'c', disabled: true },
]
</script>
```

## 可清空 / 可过滤

```vue
<template>
  <lh-select v-model="value" :options="options" clearable />
  <lh-select v-model="value" :options="options" filterable placement="bottom" />
</template>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue (v-model) | 绑定值 | `unknown` | — |
| options | 选项列表 | `LhSelectOption[]` | — |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | — |
| disabled | 禁用 | `boolean` | `false` |
| clearable | 可清空 | `boolean` | `false` |
| placeholder | 占位文本 | `string` | — |
| filterable | 可过滤（MP 端在弹层内提供输入框） | `boolean` | `false` |
| placement | 弹层位置（12 种方位） | `LhPlacement` | `'bottom'` |
| customClass | 自定义类名 | `string` | — |
| themeVars | 组件级主题变量 | `Record<string, string>` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

### LhSelectOption

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| label | 显示文案 | `string` |
| value | 值 | `unknown` |
| disabled | 禁用 | `boolean` |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 值变化 | `(value)` |
| change | 值变化（含清空时 `undefined`） | `(value)` |
| visible-change | 弹层显隐 | `(visible: boolean)` |

::: tip 与 Vue3 版的差异
- 弹层走 `root-portal` + 两帧异步度量定位（不是 absolute 定位）。
- **键盘导航（↑↓ / Home / End）仅 H5**，小程序无键盘事件，编译期移除——MP 端只能点击选项。
- `filterable` 的过滤输入框在 MP 端渲染在弹层内部。
:::
