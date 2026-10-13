# Skeleton 骨架屏

数据加载未就绪时的占位，`loading` 为 false 时渲染真实内容。

## 基础用法

```vue
<template>
  <lh-skeleton :loading="loading">
    <view>真实内容</view>
  </lh-skeleton>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const loading = ref(true)
</script>
```

## 行数与头像

```vue
<template>
  <lh-skeleton :loading="true" :rows="4" avatar />
</template>
```

## 关闭动画

```vue
<template>
  <lh-skeleton :loading="true" :animated="false" :rows="3" />
</template>
```

## 独立占位块

`lh-skeleton-item` 可单独使用拼装自定义占位布局，`variant` 取 `text` / `rect` / `circle`。

```vue
<template>
  <view class="custom-skeleton">
    <lh-skeleton-item variant="circle" class="avatar" />
    <lh-skeleton-item variant="text" class="line" />
  </view>
</template>
```

## Props（lh-skeleton）

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| loading | 是否处于加载态（false 时渲染 default 插槽的真实内容） | `boolean` | `true` |
| rows | 文本行数 | `number` | `3` |
| avatar | 是否包含圆形头像占位 | `boolean` | `false` |
| animated | 是否开启动画 | `boolean` | `true` |
| customClass | 自定义类名 | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## Props（lh-skeleton-item）

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| variant | 占位块形状 | `'text' \| 'rect' \| 'circle'` | `'text'` |
| animated | 是否开启动画 | `boolean` | `true` |
| customClass | 自定义类名 | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## Slots（lh-skeleton）

| 插槽 | 说明 |
| --- | --- |
| default | `loading` 为 false 时渲染的真实内容 |

::: tip 无障碍
容器标记 `aria-busy="true"` 与 `aria-live="polite"`，占位块自身对辅助技术隐藏；数据就绪后读屏会自动播报真实内容。
:::
