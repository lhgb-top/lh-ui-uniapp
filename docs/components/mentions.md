# Mentions 提及

输入 `@` 触发的成员提及输入框，支持过滤、多行与选中回调。

## 基础用法

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

输入 `@` 后建议面板展开，继续输入按 label 过滤；选中后写回的是 `label`（人可读的 `@水墨 `），机器标识 `value` 经 `select` 事件交业务层。

## 多行

```vue
<template>
  <lh-mentions v-model="value" :options="members" multiline />
</template>
```

`multiline` 把单行 input 换成 textarea。

## 触发字符

```vue
<template>
  <lh-mentions v-model="value" :options="members" prefix="#" />
</template>
```

`prefix` 默认 `'@'`；紧贴 ASCII 词字符的伪前缀（如邮箱 `user@`）不触发。

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 文本内容（v-model） | `string` | `''` |
| options | 建议成员 | `LhMentionOption[]` | `[]` |
| prefix | 触发字符 | `string` | `'@'` |
| placeholder | 占位提示（默认取语言包 mentions.placeholder） | `string` | — |
| placeholderStyle | 占位样式（替代 `::placeholder`） | `string` | — |
| disabled | 禁用 | `boolean` | `false` |
| multiline | 多行 textarea | `boolean` | `false` |
| ariaLabel | 无障碍名称 | `string` | — |
| customClass | 自定义类名 | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## Slots

| 插槽 | 说明 |
| --- | --- |
| empty | 无匹配时的空态（默认文案取语言包 mentions.noMatch） |

## Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 输入或选中后回写 | `(value: string)` |
| change | 文本变化 | `(value: string)` |
| select | 选中某个提及项 | `(option: LhMentionOption)` |

## 方法（defineExpose）

| 方法 | 说明 |
| --- | --- |
| updateContext | 手动刷新光标上下文 |
| close | 收起建议面板 |

## 平台差异

| 能力 | H5 | 小程序 |
| --- | --- | --- |
| 下拉定位 | root-portal + 两帧度量（同 select） | 支付宝按基础库版本走 root-portal / 页内 fixed；抖音页内 fixed |
| 光标上下文 | 原生 `selectionStart`（可在文本中间触发提及） | **拿不到光标位置，以文本末尾近似**——在已输入文本中间触发提及的场景失效，降级为末尾插入 |
| 键盘导航 / Esc | 方向键移动高亮、Enter 选中、Esc 关闭 | 无键盘事件，仅点击选中 |
| 选中后光标落位 | 精确落到提及之后 | 受控回填后光标在末尾 |
