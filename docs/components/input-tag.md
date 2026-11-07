# InputTag 标签输入

输入即提交的标签组，支持触发键、上限、去重与点删。

## 基础用法

```vue
<script setup>
import { ref } from 'vue'
const tags = ref(['水墨', '留白'])
</script>

<template>
  <lh-input-tag v-model="tags" placeholder="输入后按回车提交" />
</template>
```

## 触发键

`trigger` 支持 `enter`（默认）/ `space` / `comma`。`space` / `comma` 触发时空白不进入输入框。

```vue
<template>
  <lh-input-tag v-model="tags" trigger="comma" placeholder="输入逗号提交" />
</template>
```

## 上限与去重

```vue
<template>
  <lh-input-tag v-model="tags" :max="3" allow-duplicate />
</template>
```

`max` 为正数时限上限（超限不提交，输入被清空）；默认不允许重复（重复不提交）。

## 只读与禁用

```vue
<template>
  <lh-input-tag v-model="tags" readonly />
  <lh-input-tag v-model="tags" disabled />
</template>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 标签列表（v-model） | `string[]` | `[]` |
| trigger | 提交触发键（小程序端一律走完成键） | `'enter' \| 'space' \| 'comma'` | `'enter'` |
| placeholder | 占位提示（仅无标签时显示） | `string` | `''` |
| placeholderStyle | 占位样式（替代 `::placeholder`） | `string` | — |
| max | 标签上限（非正数不限） | `number` | `0` |
| allowDuplicate | 允许重复标签 | `boolean` | `false` |
| readonly | 只读 | `boolean` | `false` |
| disabled | 禁用 | `boolean` | `false` |
| ariaLabel | 无障碍名称 | `string` | — |
| customClass | 自定义类名 | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 标签列表变化 | `(value: string[])` |
| change | 标签列表变化（同 modelValue） | `(value: string[])` |
| add | 提交单个标签 | `(tag: string)` |
| remove | 移除单个标签 | `(tag: string)` |

## 方法（defineExpose）

| 方法 | 说明 |
| --- | --- |
| focus | 聚焦输入框 |
| commit | 提交当前输入 |

## 平台差异

| 能力 | H5 | 小程序 |
| --- | --- | --- |
| 提交触发键 | `trigger` 全支持（Enter / Space / Comma 键盘事件） | 一律走**完成键**（`@confirm`）；`space` / `comma` 触发键语义仅 H5 |
| Backspace 删尾 | 输入为空时按 Backspace 删最后一个标签 | 无键盘事件，删除走标签的 **× 按钮**（双端可用） |
| 失焦提交 | 有 | 有 |
| 聚焦边框 | `:has()` 聚焦样式生效 | 聚焦边框不可用（WXSS 不支持 `:has()`），输入正常 |
