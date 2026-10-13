# Avatar 头像

展示用户或事物的头像，支持图片、图标、文字三种形态。

## 基础用法

```vue
<template>
  <lh-avatar src="https://placeholder.invalid/avatar.png" />
  <lh-avatar icon="user" />
  <lh-avatar text="水墨" />
</template>
```

## 形状与尺寸

```vue
<template>
  <lh-avatar text="水" shape="circle" />
  <lh-avatar text="墨" shape="square" />
  <lh-avatar text="小" size="small" />
  <lh-avatar text="大" size="large" />
</template>
```

## 裁剪模式

`fit` 映射 uni `<image>` 的 `mode`：`fill` → `scaleToFill`、`contain` → `aspectFit`、`cover` → `aspectFill`、`none` → `center`。

```vue
<template>
  <lh-avatar src="https://placeholder.invalid/avatar.png" fit="cover" />
  <lh-avatar src="https://placeholder.invalid/avatar.png" fit="contain" />
</template>
```

::: tip scale-down 是近似
uni 没有 `scale-down` 的等价 mode，取语义最接近的 `aspectFit`（保持比例完整展示，不放大）。
:::

## 加载失败回退

图片加载失败时按「图标 → 文字 → 空」顺序回退，并触发 `error` 事件。

```vue
<template>
  <lh-avatar
    src="https://placeholder.invalid/broken.png"
    icon="user"
    alt="头像"
    @error="onError"
  />
</template>

<script setup lang="ts">
const onError = () => console.log('图片加载失败')
</script>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| src | 图片地址；为空时依次回退到图标、文字 | `string` | — |
| alt | 图片加载失败的替代文本，同时作为无障碍名称 | `string` | — |
| icon | 图标名（src 为空或加载失败时展示） | `LhIconName` | — |
| text | 文字头像内容（src 与 icon 都缺省时取首字展示） | `string` | — |
| shape | 形状 | `'circle' \| 'square'` | `'circle'` |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| fit | 图片裁剪模式（映射 uni image 的 mode） | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'cover'` |
| customClass | 自定义类名 | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| error | 图片加载失败 | `(e: Event)` |
