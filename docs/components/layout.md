# Layout 布局容器

页面级骨架：`lh-layout` 搭配 `lh-header` / `lh-aside` / `lh-main` / `lh-footer` 四个子组件（easycom 可直接写标签；按需引入时组件名为 `LhLayout` / `LhHeader` / `LhAside` / `LhMain` / `LhFooter`）。

## 基础用法（上中下）

容器需要显式高度：`lh-layout` 自身是 `flex: 1` 的伸缩容器，放在普通流式父级里需要通过 `sx` 或外层样式给定高度，子项才能按 header / main / footer 比例铺开。

```vue
<template>
  <lh-layout direction="vertical" :sx="{ h: '240px' }">
    <lh-header>页头</lh-header>
    <lh-main>内容区</lh-main>
    <lh-footer>页脚</lh-footer>
  </lh-layout>
</template>
```

## 排列方向

`direction` 显式控制子项排列方向：默认 `horizontal`（并排），含 `lh-aside` 时自动切换为 `vertical`，也可手动指定。

```vue
<template>
  <lh-layout direction="horizontal" :sx="{ h: '80px' }">
    <lh-main>水平并排</lh-main>
    <lh-main>水平并排</lh-main>
  </lh-layout>
  <lh-layout direction="vertical" :sx="{ h: '140px', mt: '12px' }">
    <lh-main>垂直堆叠</lh-main>
    <lh-main>垂直堆叠</lh-main>
  </lh-layout>
</template>
```

## 带侧栏布局

含 `lh-aside` 时父级自动切换为垂直方向（header 在上、aside 与 main 并排）。

```vue
<template>
  <lh-layout direction="vertical" :sx="{ h: '240px' }">
    <lh-header>页头</lh-header>
    <lh-layout :sx="{ flex: '1', minHeight: '0px' }">
      <lh-aside :width="140" aria-label="侧边导航">侧栏</lh-aside>
      <lh-main>内容区</lh-main>
    </lh-layout>
    <lh-footer>页脚</lh-footer>
  </lh-layout>
</template>
```

`width` 支持 `number`（按 px）与带单位的 `string`（如 `'30%'`）；不传时取 `--lh-layout-aside-width`（默认 220px）。

## Layout Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| direction | 排列方向（含 Aside 时自动为 vertical） | `'horizontal' \| 'vertical'` | `'horizontal'` |
| customClass | 自定义类名（透传到根节点） | `string` | — |
| sx | sx 快速布局属性 | `LhSxProps` | — |

## Header / Main / Footer Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| customClass | 自定义类名（透传到根节点） | `string` | — |
| sx | sx 快速布局属性 | `LhSxProps` | — |

## Aside Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| width | 侧栏宽度 | `number \| string` | — |
| ariaLabel | 无障碍名称（landmark 命名） | `string` | — |
| customClass | 自定义类名（透传到根节点） | `string` | — |
| sx | sx 快速布局属性 | `LhSxProps` | — |

## Slots

| 插槽 | 说明 |
| --- | --- |
| default | 布局内容（五个组件均为默认插槽） |

## 平台差异

- **纯 CSS 布局组件**：share core 无 layout 模块，逻辑层只有 provide/inject 上下文（Aside 登记后父级切换为垂直方向），无度量、无弹层、无 document 依赖，H5 与微信小程序表现一致。
- **标签替换**：plus 的 `<section>` / `<header>` / `<aside>` / `<main>` / `<footer>` 全部换成 `<view>`（WXSS 禁标签选择器，样式靠 `lh-layout*` 类名生效）。
- **landmark 语义**：语义标签天然映射的 landmark role 改由 `role` 属性补回——header 为 `banner`、aside 为 `complementary`、main 为 `main`、footer 为 `contentinfo`；多个 `aside` 时建议用 `ariaLabel` 区分（如「侧边导航」「相关链接」）。
- **滚动容器**：`lh-main` 与 `lh-aside` 的 `overflow: auto` 在 H5 端即元素自身滚动；**小程序页面本身没有可滚动的 body 容器**（页面滚动由 `page` 根节点承担），若在小程序里把整页内容直接放进 `lh-main`，元素内滚动与页面滚动可能叠加出现双滚动条。带侧栏的整页布局建议外层给定 `h: '100vh'` 让 `lh-main` 自己滚动；或按需改用 `scroll-view` 包裹内容。
- **移植结论**：全端可用，行为与 plus 一致；唯一需要在意的差异是小程序端「页面级滚动 vs 元素级滚动」的容器语义。

::: tip 与 Vue3 版的差异
- 语义标签换成 `view` + `role` 属性（WXSS 标签选择器禁用），无障碍语义保留。
- 子组件标签按 easycom 约定为 `lh-header` / `lh-aside` / `lh-main` / `lh-footer`（按需引入对应组件名 `LhHeader` 等）。
- 增加了 `customClass` prop：uni-app 端自定义类名无法穿透 `styleIsolation`，统一走 prop 透传（plus 端靠 class 直传）。
- 排列方向、Aside 自动垂直的 provide/inject 机制与 plus 完全一致。
:::
