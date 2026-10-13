# Space 间距

用于布局相邻元素的间距，替代手写 margin。间距完全依赖 CSS `gap`，两端均原生支持。

## 基础用法

```vue
<template>
  <lh-space>
    <lh-tag>水墨</lh-tag>
    <lh-tag>留白</lh-tag>
    <lh-tag>国风</lh-tag>
  </lh-space>
</template>
```

## 方向

```vue
<template>
  <lh-space direction="vertical">
    <lh-tag>水墨</lh-tag>
    <lh-tag>留白</lh-tag>
  </lh-space>
</template>
```

## 间距档位

预设档位引用 spacing token（可通过 `--lh-spacing-*` 定制）；数字视为 px；数组分别控制水平与垂直间距。

```vue
<template>
  <lh-space size="small">
    <lh-tag>小</lh-tag>
    <lh-tag>小</lh-tag>
  </lh-space>
  <lh-space size="medium">
    <lh-tag>中</lh-tag>
    <lh-tag>中</lh-tag>
  </lh-space>
  <lh-space size="large">
    <lh-tag>大</lh-tag>
    <lh-tag>大</lh-tag>
  </lh-space>
  <lh-space :size="24">
    <lh-tag>24px</lh-tag>
    <lh-tag>24px</lh-tag>
  </lh-space>
  <lh-space :size="[8, 16]">
    <lh-tag>水平 8</lh-tag>
    <lh-tag>垂直 16</lh-tag>
  </lh-space>
</template>
```

## 对齐与换行

```vue
<template>
  <lh-space alignment="center">
    <lh-tag>居中</lh-tag>
    <lh-button type="primary" size="small">按钮</lh-button>
  </lh-space>
  <lh-space :wrap="true">
    <lh-tag v-for="i in 20" :key="i">标签{{ i }}</lh-tag>
  </lh-space>
</template>
```

::: tip 换行仅在水平方向生效
`wrap` 只对 `direction="horizontal"` 有意义，垂直方向传入会被忽略。
:::

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| direction | 排列方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| size | 间距：预设档位 / 像素数字 / [水平, 垂直] | `'small' \| 'medium' \| 'large' \| number \| [number, number]` | `'medium'` |
| wrap | 是否允许换行（仅水平方向） | `boolean` | `true` |
| alignment | 对齐方式 | `'start' \| 'center' \| 'end' \| 'baseline'` | `'start'` |
| customClass | 自定义类名 | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## Slots

| 插槽 | 说明 |
| --- | --- |
| default | 需要排布间距的子元素 |
