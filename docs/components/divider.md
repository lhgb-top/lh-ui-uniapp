# Divider 分割线

区分不同内容的分隔线，支持带文案的分组语义。

## 基础用法

```vue
<template>
  <view>上文</view>
  <lh-divider />
  <view>下文</view>
</template>
```

## 带文案

```vue
<template>
  <lh-divider>水墨</lh-divider>
  <lh-divider label-position="left">左对齐</lh-divider>
  <lh-divider label-position="right">右对齐</lh-divider>
</template>
```

## 虚线与边框样式

```vue
<template>
  <lh-divider dashed />
  <lh-divider border-style="dotted" />
</template>
```

`borderStyle` 优先于 `dashed`；仅 `dashed` / `dotted` 有对应样式，其余值按默认实线渲染。

## 垂直方向

```vue
<template>
  <lh-space>
    <span>水墨</span>
    <lh-divider direction="vertical" />
    <span>留白</span>
  </lh-space>
</template>
```

::: tip 垂直方向的高度
垂直分割线是 `inline-block`，在 flex 行内靠 `align-self: stretch` 撑满父级高度；单独放在块级
容器里只有 `1em` 高，放在 flex 行里使用才符合直觉。
:::

## 垂直带文案

垂直方向同样支持文案：线段排在文案上下，角色升级为 `role="separator"` 并声明
`aria-orientation="vertical"`。

```vue
<template>
  <view class="vertical-text-row">
    <text>上</text>
    <lh-divider direction="vertical">水墨</lh-divider>
    <text>下</text>
  </view>
</template>

<style>
.vertical-text-row {
  display: flex;
  align-items: center;
  height: 120px;
}
</style>
```

::: tip 垂直文案的高度来自父级行
垂直带文案的分割线靠父级行的 `align-self: stretch` 获得高度，线段才能撑开——父容器需要是
有确定高度的 flex 行（如上例的 `height: 120px`）。块级父容器里线段只剩 12px 的最小长度。
:::

::: tip labelPosition 在垂直方向不生效
`label-position` 是水平方向的左右对齐语义；垂直方向的文案恒居中，不产出修饰类。
:::

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| direction | 方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| dashed | 是否虚线 | `boolean` | `false` |
| labelPosition | 带文案时的对齐位置（水平方向生效，垂直恒居中） | `'left' \| 'center' \| 'right'` | `'center'` |
| borderStyle | 边框样式（优先于 dashed） | `string` | — |
| customClass | 自定义类名 | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## Slots

| 插槽 | 说明 |
| --- | --- |
| default | 分割线文案（水平方向排在左右，垂直方向排在上下） |
