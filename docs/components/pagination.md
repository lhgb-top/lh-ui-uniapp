# Pagination 分页

页码导航：上一页 / 页码 / 省略 / 下一页 / 总条数 / 条数切换 / 跳页。页码窗口收缩算法（首末页常驻、
当前页两侧吸附、仅在真正产生间隙时输出省略号）在 `@lh-ui/share` core 层纯函数实现。

## 基础用法

`total` 为数据总数（必填），默认每页 10 条。

```vue
<template>
  <lh-pagination :total="120" />
</template>
```

## 总数与条数切换

`show-total` 显示总条数；`show-size-changer` 显示每页条数切换（uni 端由内置 picker 承载）。

```vue
<template>
  <lh-pagination :total="480" show-total show-size-changer />
</template>
```

## 跳页

`show-jumper` 显示跳页输入，输入页码后回车（confirm）或失焦提交，越界自动钳制。

```vue
<template>
  <lh-pagination :total="480" show-total show-jumper />
</template>
```

## 简洁模式

`simple` 收起页码区，只显示「当前页 / 总页数」。

```vue
<template>
  <lh-pagination :total="480" simple show-jumper />
</template>
```

## 受控用法

当前页用 `v-model:current` 受控。

```vue
<template>
  <lh-pagination v-model:current="page" :total="95" />
  <text>当前页：{{ page }}</text>
</template>

<script setup>
import { ref } from 'vue'
const page = ref(2)
</script>
```

## 每页条数与禁用

`v-model:page-size` 受控每页条数，`page-sizes` 自定义条数选项；条数变化后当前页越界会自动钳制；
`disabled` 禁用整个分页。

```vue
<template>
  <lh-pagination
    v-model:page-size="pageSize"
    :total="480"
    show-size-changer
    :page-sizes="[10, 20, 50, 100]"
  />
  <text>每页条数：{{ pageSize }}</text>
  <lh-pagination :total="480" disabled />
</template>

<script setup>
import { ref } from 'vue'
const pageSize = ref(20)
</script>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| total | 数据总数（必填） | `number` | — |
| pageSize | 每页条数（配合 `update:pageSize` 事件受控） | `number` | `10` |
| current | 当前页（`v-model:current`） | `number` | — |
| pageSizes | 每页条数选项 | `number[]` | `[10, 20, 30, 40]` |
| showTotal | 是否显示总条数 | `boolean` | `false` |
| showSizeChanger | 是否显示每页条数切换 | `boolean` | `false` |
| showJumper | 是否显示跳页输入 | `boolean` | `false` |
| simple | 紧凑模式 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| sx | 快速布局属性 | `LhSxProps` | — |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:current | 当前页变化时触发，配合 `v-model:current` 使用 | `(page: number)` |
| update:pageSize | 每页条数变化时触发，配合 `v-model:page-size` 使用 | `(size: number)` |
| change | 当前页变化时触发（页码 / 前后翻页 / 跳页均触发） | `(page: number)` |
| size-change | 每页条数变化时触发 | `(size: number)` |

## 无障碍

- 根节点 `role="navigation"` + `aria-label="pagination"`
- 当前页按钮自动设置 `aria-current="page"`，每个页码按钮、上一页 / 下一页按钮都有独立的
  `aria-label`（取语言包 `pagination.page` / `prev` / `next`），纯符号「‹」「›」由 `aria-hidden` 隐藏
- 页码按钮、前后翻页为 `role="button"`，禁用时输出 `aria-disabled`
- 省略号为纯展示 `aria-hidden` 元素，不干扰阅读

## 平台差异

- **view 自绘触摸交互，全端可用**：plus 的 `<nav>` / `<button>` / `<ul>` / `<span>` 在本库换成
  `<view>` / `<text>`（WXSS 禁标签选择器，靠类名生效）；页码与前后翻页通过 `@click` 触发，
  H5 与微信小程序表现一致，无任何平台 API 依赖。
- **页码溢出省略逻辑走 core**：窗口收缩算法（首末页常驻、当前页两侧各显示 1 个页码、不足时向
  边缘吸附、仅在真正产生间隙时输出省略号）是 `@lh-ui/share` core 的纯函数
  `getPaginationRange`，页码钳制 `clampPage` 与总页数 `getPageCount` 同样出自 core，
  仓内只写响应式胶水。
- **条数切换用内置 picker 承载**：uni 没有 `<select>`，`show-size-changer` 用 uni 内置
  `<picker mode="selector">` 承载，选项即 `page-sizes`，change 事件的取值在
  `event.detail.value`（选项下标）；H5 端唤起 uni 的选择器面板，小程序端唤起原生滚轮选择器。
- **跳页输入提交时机不同**：uni 的 input 没有原生 change 事件，提交统一在回车（confirm，
  H5 回车与小程序键盘「完成」都触发）或失焦（blur）时进行，输入事件取值走
  `event.detail.value`（同 lh-input-number 先例）；原生 `min` / `max` 属性不透传，
  页码一律由 core 的 `clampPage` 钳制。plus 对「输入后清空再失焦」会钳回第 1 页，
  本库收紧为不跳页（空串与非法数字都不发事件）。
- **禁用外观走类名兜底**：share 样式源的禁用样式写在 `&:disabled` 伪类上（只匹配 button 元素），
  view 没有该伪类，本组件在 SFC 内联按同一令牌（`--lh-disabled-text-color`）补了
  `lh-pagination__btn--disabled` 类规则（同 lh-segmented / lh-input-number 的内联兜底先例，
  不进净化产物）。
- **无障碍属性摊开绑定**：页码按钮的 `aria-current` / `aria-label` 契约由 share 的
  `getPaginationItemAria` 决定，因小程序模板编译器不支持 `v-bind` 对象，胶水层把属性包
  摊成逐项显式绑定。
- **移植结论**：pagination 是无度量 / 无弹层 / 无 document 依赖的纯切换组件，页码区间、
  钳制与无障碍属性全部由 `@lh-ui/share` core 纯函数产出，仓内只写响应式胶水；
  API 与 Vue3 版完全一致（`total` / `pageSize` / `current` / `pageSizes` / `showTotal` /
  `showSizeChanger` / `showJumper` / `simple` / `disabled` / `sx`）。
