# Autocomplete 自动补全

输入即过滤的建议输入框，输入框（combobox）+ 下拉建议列表（listbox）。

## 基础用法

```vue
<script setup>
import { ref } from 'vue'
const value = ref('')
const options = [
  { label: '水墨' },
  { label: '留白' },
  { label: '印章', value: 'seal' },
]
</script>

<template>
  <lh-autocomplete v-model="value" :options="options" />
</template>
```

选项只写 `label` 时提交值即 label；需要机器标识时写 `value`。禁用项保留在列表中置灰展示，不可选中。

## 过滤

默认按 `label` 包含查询串过滤（忽略大小写，首尾空白不参与匹配）：

```vue
<template>
  <lh-autocomplete v-model="value" :options="options" case-sensitive />
</template>
```

`case-sensitive` 开启大小写敏感；`trim` 传 `false` 保留空白匹配。

## 选中回调

```vue
<template>
  <lh-autocomplete v-model="value" :options="options" @select="onSelect" />
</template>
```

`select` 事件参数为提交值与原选项对象。

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 输入值（v-model） | `string` | `''` |
| options | 建议选项 | `LhAutocompleteOption[]` | `[]` |
| caseSensitive | 大小写敏感匹配 | `boolean` | `false` |
| trim | 去除查询串首尾空白后再匹配 | `boolean` | `true` |
| placeholder | 占位提示 | `string` | — |
| placeholderStyle | 占位样式（替代 `::placeholder`） | `string` | — |
| disabled | 禁用 | `boolean` | `false` |
| openOnFocus | 聚焦时展开建议面板 | `boolean` | `true` |
| ariaLabel | 无障碍名称 | `string` | — |
| customClass | 自定义类名 | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## Slots

| 插槽 | 说明 |
| --- | --- |
| empty | 无匹配时的空态（默认文案取语言包 autocomplete.noMatch） |

## Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 输入或选中后回写 | `(value: string)` |
| change | 输入值变化 | `(value: string)` |
| select | 选中某个建议项 | `(value: string \| number, option: LhAutocompleteOption)` |

## 方法（defineExpose）

| 方法 | 说明 |
| --- | --- |
| open / close | 手动展开 / 收起面板 |
| isOpen | 当前展闭状态（只读） |

## 平台差异

| 能力 | H5 | 小程序 |
| --- | --- | --- |
| 下拉定位 | root-portal + 两帧度量（同 select） | 支付宝按基础库版本走 root-portal / 页内 fixed；抖音页内 fixed |
| 键盘导航 / Esc | 方向键移动高亮、Enter 选中、Esc 关闭 | 无键盘事件，仅点击选中 |
| hover 高亮 | 有 | 无（点击即选中） |
| openOnFocus | 聚焦展开 | 聚焦展开 |
