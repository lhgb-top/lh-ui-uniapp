# Empty 空状态

空数据时的占位提示，自带水墨插画。

## 基础用法

```vue
<template>
  <lh-empty />
</template>
```

`description` 未传时取语言包的 `empty.description`（中文「暂无数据」），切换 ConfigProvider 语言自动跟随。

## 自定义文案

```vue
<template>
  <lh-empty description="墨痕未干，暂无可览之物" />
</template>
```

## 自定义图片

```vue
<template>
  <lh-empty image="https://placeholder.invalid/empty.png" description="空空如也" />
</template>
```

## 插槽自绘

默认插槽可完全替代默认插画（传入 `image` 时默认插画也不渲染）。

```vue
<template>
  <lh-empty description="暂无收藏">
    <view class="my-illustration">🎨</view>
  </lh-empty>
</template>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| description | 空状态描述文案（未传时取语言包 empty.description） | `string` | — |
| image | 自定义图片 URL（替代默认插画） | `string` | — |
| customClass | 自定义类名 | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## Slots

| 插槽 | 说明 |
| --- | --- |
| default | 自绘插画（传入后替代默认插画） |

::: tip 小程序端的默认插画
H5 保留内联 `<svg>` 插画（主题着色完整保真）；小程序不支持 svg，默认插画改用 CSS 绘制简化版，颜色取主题变量，明暗模式自动适配。
:::
