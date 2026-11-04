# Segmented 分段器

互斥选项切换，常用于视图切换场景。数据驱动：选项由 `options` 数组直接给出，无需手工拼子组件。

## 基础用法

`options` 支持字符串快捷写法，`modelValue`（`v-model`）为当前选中值。

```vue
<template>
  <lh-segmented v-model="view" :options="['列表', '卡片', '表格']" />
</template>

<script setup>
import { ref } from 'vue'
const view = ref('列表')
</script>
```

## 对象选项

对象写法提供 `label` / `value`，适合「显示文案与值不同」的场景。

```vue
<template>
  <lh-segmented
    v-model="mode"
    :options="[
      { label: '日', value: 'day' },
      { label: '周', value: 'week' },
      { label: '月', value: 'month' },
    ]"
  />
</template>

<script setup>
import { ref } from 'vue'
const mode = ref('day')
</script>
```

## 禁用项与整组禁用

选项对象带 `disabled: true` 时该项不可选；组件级 `disabled` 禁用整个分段器。

```vue
<template>
  <lh-segmented
    v-model="seg"
    :options="[
      { label: '立春', value: 'lichun' },
      { label: '雨水', value: 'yushui' },
      { label: '惊蛰', value: 'jingzhe', disabled: true },
    ]"
  />
  <lh-segmented v-model="all" disabled :options="['甲', '乙', '丙']" />
</template>

<script setup>
import { ref } from 'vue'
const seg = ref('lichun')
const all = ref('甲')
</script>
```

## 块级宽度

`block` 让分段器撑满容器，选项平分宽度（视图切换栏常用）。

```vue
<template>
  <lh-segmented v-model="block" block :options="['诗', '词', '曲', '赋']" />
</template>

<script setup>
import { ref } from 'vue'
const block = ref('诗')
</script>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 当前值（受控 v-model，配合 `update:modelValue` 事件） | `string \| number` | — |
| options | 选项（字符串快捷写法或 `{ label, value, disabled }` 对象） | `[LhSegmentedInput](#类型说明)[]` | — |
| disabled | 整组禁用 | `boolean` | `false` |
| block | 撑满容器（选项平分宽度） | `boolean` | `false` |
| customClass | 自定义类名（透传到根节点） | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

### 类型说明

```ts
/** 选项值类型 */
type LhSegmentedValue = string | number

/** 选项对象形态 */
interface LhSegmentedOption {
  label: string
  value: LhSegmentedValue
  disabled?: boolean
}

/** 输入选项（字符串快捷写法或对象） */
type LhSegmentedInput = LhSegmentedValue | LhSegmentedOption
```

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 选中项变化时触发，配合 v-model 使用 | `(value: string \| number)` |
| change | 选中项变化时触发（点击与方向键均会触发） | `(value: string \| number)` |

## 平台差异

- **view 自绘触摸交互，全端可用**：plus 的 `<div>` + `<button>` 在本库换成 `<view>`（WXSS 禁标签选择器，靠类名生效）；选中切换通过 `@click` 触发，H5 与微信小程序表现一致，无任何平台 API 依赖。
- **选中滑块是纯 CSS 过渡**：选中项的背景色 / 阴影由类名切换驱动，WXSS 支持 `transition` 简单过渡，两端都有渐变效果；**不依赖 `transitionend`**（小程序端该事件不可靠，本仓 message / loading 等动效组件一律改用 setTimeout 对齐，分段器则连 JS 编排都不需要——纯 CSS 即可，无时序对齐负担）。
- **键盘方向键导航仅 H5**：roving tabindex（方向键移动选中项、首尾循环、跳过禁用项，复用 `@lh-ui/share` core 的 `getNextListIndex` / `getRovingTabIndex`）在小程序端没有键盘事件，SFC 的 `@keydown` 处理由条件编译守卫、MP 包内不调用；MP 端只能点选。
- **禁用项外观走类名兜底**：share 样式源的禁用样式写在 `&:disabled` 伪类上（只匹配 button 元素），view 没有该伪类，本组件在 SFC 内联按同一令牌（`--lh-disabled-text-color`）补了 `lh-segmented__option--disabled` 类规则（同 lh-spinner / lh-empty 的内联兜底先例，不进净化产物）。
- **无障碍属性摊开绑定**：`role="radiogroup"` / `role="radio"` + `aria-checked` / `aria-disabled` 的契约仍由 share 的 `getSegmentedAria` / `getSegmentedItemAria` 决定，因小程序模板编译器不支持 `v-bind` 对象，胶水层把属性包摊成逐项显式绑定。
- **移植结论**：segmented 是无度量 / 无弹层 / 无 document 依赖的纯切换组件，选项规范化、类名与无障碍属性全部由 `@lh-ui/share` core 纯函数产出，仓内只写响应式胶水；与 Vue3 版 API 完全一致（`modelValue` / `options` / `disabled` / `block` / `sx`）。
