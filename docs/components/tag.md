# Tag 标签

## 基础用法

```vue
<template>
  <lh-tag>默认</lh-tag>
  <lh-tag type="primary">主要</lh-tag>
  <lh-tag type="success">成功</lh-tag>
  <lh-tag type="warning">警告</lh-tag>
  <lh-tag type="danger">危险</lh-tag>
</template>
```

## 样式与关闭

```vue
<template>
  <lh-tag round>圆角</lh-tag>
  <lh-tag hit>描边</lh-tag>
  <lh-tag closable @close="onClose">可关闭</lh-tag>
</template>

<script setup lang="ts">
const onClose = () => console.log('关闭了')
</script>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 类型 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | — |
| closable | 可关闭 | `boolean` | `false` |
| disabled | 禁用 | `boolean` | `false` |
| round | 圆角 | `boolean` | `false` |
| hit | 描边（无填充） | `boolean` | `false` |
| customClass | 自定义类名 | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| close | 点击关闭按钮 | — |

::: tip 与 Vue3 版的差异
关闭按钮里的内联 SVG 在本库换成 lh-icon（iconfont 方案）。
:::
