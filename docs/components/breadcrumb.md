# Breadcrumb 面包屑

显示当前页面的路径，快速返回之前的任意页面。

## 基础用法

```vue
<template>
  <lh-breadcrumb separator="/">
    <lh-breadcrumb-item>首页</lh-breadcrumb-item>
    <lh-breadcrumb-item>组件</lh-breadcrumb-item>
    <lh-breadcrumb-item>面包屑</lh-breadcrumb-item>
  </lh-breadcrumb>
</template>
```

## 可点击的跳转项

非末项传 `to` 后渲染为链接样式，点击调用 `uni.navigateTo` 跳转（url 需为以 `/` 开头的页面路径）。

```vue
<template>
  <lh-breadcrumb>
    <lh-breadcrumb-item to="/pages/index/index">首页</lh-breadcrumb-item>
    <lh-breadcrumb-item to="/pages/component/index">组件</lh-breadcrumb-item>
    <lh-breadcrumb-item>面包屑</lh-breadcrumb-item>
  </lh-breadcrumb>
</template>
```

## 折叠

`maxItems` 控制最大可见项数（含省略号）：超出时保留首项 + 省略号 + 末尾若干项，点击省略号展开全部。

```vue
<template>
  <lh-breadcrumb :max-items="3">
    <lh-breadcrumb-item>首页</lh-breadcrumb-item>
    <lh-breadcrumb-item>活动</lh-breadcrumb-item>
    <lh-breadcrumb-item>列表</lh-breadcrumb-item>
    <lh-breadcrumb-item>详情</lh-breadcrumb-item>
    <lh-breadcrumb-item>评价</lh-breadcrumb-item>
  </lh-breadcrumb>
</template>
```

## Breadcrumb Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| separator | 分隔符字符 | `string` | `'/'` |
| maxItems | 最大可见项数（首项 + 省略号 + 末尾若干项），超出折叠；`0` 表示不折叠 | `number` | `0` |
| customClass | 自定义类名 | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## BreadcrumbItem Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| to | 跳转地址；存在且非末项时渲染为链接样式，点击走 `uni.navigateTo` | `string` | — |
| customClass | 自定义类名 | `string` | — |

## Slots

| 插槽 | 说明 |
| --- | --- |
| default | 面包屑项的文字内容 |

::: tip 与 Vue3 版的差异
- `to` 不走路由（uni-app 工程≠vue-router）：统一 `uni.navigateTo`；H5 端按 uni 的 H5 路由策略跳转。
- `<nav>/<ol>/<li>` 换成 `<view>`（WXSS 标签选择器禁用），无障碍 `aria-current="page"`、`aria-label` 保留。
- 折叠/省略号逻辑复用同一套 share core 纯函数，与 plus 行为一致。
:::
