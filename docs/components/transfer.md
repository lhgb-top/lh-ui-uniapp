# Transfer 穿梭框

双栏列表 + 勾选移动。数据分区、过滤、全选与移动逻辑全部消费 `@lh-ui/share` 的
core 纯函数（`partitionTransferData` / `filterTransferItems` /
`toggleTransferCheckAll` / `moveTransferKeys` 等），组件层只负责渲染、事件与
键盘导航。双栏均为 `role="listbox"`（APG listbox pattern）。

## 基础用法

```vue
<template>
  <lh-transfer v-model="source" :data="items" @change="onChange" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhTransferItem } from '@lh-ui/share/core/transfer'

const source = ref<Array<string | number>>(['a'])
const items: LhTransferItem[] = [
  { key: 'a', label: '甲' },
  { key: 'b', label: '乙' },
  { key: 'c', label: '丙', disabled: true },
  { key: 'd', label: '丁' },
]

function onChange(keys: Array<string | number>, direction: 'left-to-right' | 'right-to-left') {
  console.log(keys, direction)
}
</script>
```

`v-model` 绑定左侧（源）键列表：键在 `modelValue` 里的项显示在左栏，其余在右栏。
勾选任意项后点击中间的 › / ‹ 按钮即可穿梭，`update:modelValue` 与 `change`
（附带方向 `'left-to-right'` / `'right-to-left'`）随之触发，勾选集合在移动后清空。

每侧面板顶部内置搜索框（与 Vue3 版一致，常驻不可关闭），按文案大小写不敏感过滤；
面板头部显示「当前侧数量 / 全量数量」计数与全选框（半选态由 `indeterminate` 承载）。

`data` 是 `LhTransferItem[]`：`key` 唯一、`label` 显示文本（缺失时回退显示 `key`）、
`disabled` 禁用（不可勾选、不可全选、不可移动）。

## 禁用

`disabled` 禁用整个穿梭框：勾选、全选、搜索、穿梭全链路拦截。

```vue
<template>
  <lh-transfer v-model="source" :data="items" disabled />
</template>
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 全量数据 | `LhTransferItem[]` | — |
| modelValue | 左侧（源）键列表（受控 v-model） | `Array<string \| number>` | `[]` |
| disabled | 禁用 | `boolean` | `false` |
| sx | sx 快速布局属性 | `LhSxProps` | — |

### Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 左侧（源）键列表变化（配合 v-model） | `(keys: Array<string \| number>)` |
| change | 数据移动完成后触发 | `(keys: Array<string \| number>, direction: 'left-to-right' \| 'right-to-left')` |

### LhTransferItem

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| key | 唯一键 | `string \| number` |
| label | 显示文本（缺失时回退显示 key） | `string` |
| disabled | 禁用（不可勾选 / 不可全选 / 不可移动） | `boolean` |

### 无障碍

- 双栏均为 `role="listbox"` + `aria-multiselectable`，项为 `role="option"` +
  `aria-selected` / `aria-disabled`
- 每侧独立的搜索框带 `aria-label`；穿梭按钮带 `aria-label`（移到右侧 / 移到左侧）
- 全选框半选态由 `indeterminate` 承载；禁用项全链路拦截（勾选、全选、移动）

::: tip 平台差异（与 Vue3 版的差异）
- **API 范围与 plus 真源严格对齐**：本端只提供 plus 已有的 `data` / `modelValue` /
  `disabled` / `sx`；社区常见但 plus 真源没有的 `titles`（面板标题）、`filterable`
  （搜索开关）、`props`（自定义字段名）、`left/right-default-checked`
  （默认勾选键）等均未新增——面板标题改走 share locales 的
  `transfer.sourceTitle` / `transfer.targetTitle` 键（十语言齐备），搜索框沿用
  plus 的常驻形态（无开关）。
- **双列表由 scroll-view 承载**：plus 的 `<ul>` / `<li>` 列表在本仓换成
  `<scroll-view scroll-y>` + `<view>`（小程序端 `view` 的溢出滚动不可靠），
  H5 与微信小程序行为一致；列表样式仍取 share 的 `.lh-transfer-panel__list`。
- **按钮穿梭全端可用**：中间的 › / ‹ 穿梭按钮是 uni 内置 `<button>`，
  H5 与小程序都可点击，不存在平台差异；禁用态由 `disabled` 属性承载。
- **键盘导航仅 H5**：上下方向键在过滤后的列表内移动焦点（跳过禁用项，不循环）、
  Enter / Space 勾选当前项、左右方向键跨面板跳焦、Escape 重置焦点的
  APG listbox 模式键盘导航只在 H5 端生效；小程序无键盘事件，整段由条件编译
  裁剪（MP 包内无死代码），roving tabindex 同样只在 H5 落值。
- **勾选框自绘**：全选框与列表项勾选框不用原生 `<input type="checkbox">`
  （小程序样式不可控），改用本仓 `lh-checkbox`（view 自绘 + lh-icon），
  状态仍由组件受控写入，语义不变。
:::
