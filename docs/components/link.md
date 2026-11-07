# Link 链接

文字超链接，支持语义类型、下划线形态与前后缀图标位。

## 基础用法

```vue
<template>
  <lh-link>默认链接</lh-link>
  <lh-link type="primary">主要链接</lh-link>
</template>
```

`type`：`default`（默认）/ `primary` / `success` / `warning` / `danger` / `info`。

## 下划线

```vue
<template>
  <lh-link underline="always">常驻</lh-link>
  <lh-link underline="none">无</lh-link>
</template>
```

`underline`：`always` 常驻 / `hover` 悬停出现（默认）/ `none` 无。

## 禁用与前后缀

```vue
<template>
  <lh-link disabled>禁用链接</lh-link>
  <lh-link>
    <template #prefix><lh-icon name="left" /></template>
    上一页
  </lh-link>
</template>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| href | 链接地址（disabled 时不渲染 href） | `string` | — |
| target | 目标窗口（仅 H5） | `string` | — |
| type | 链接语义类型 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| underline | 下划线形态 | `'always' \| 'hover' \| 'none'` | `'hover'` |
| disabled | 禁用 | `boolean` | `false` |
| current | 当前页标记（输出 `aria-current`） | `'page' \| 'location' \| true` | — |
| customClass | 自定义类名 | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## Slots

| 插槽 | 说明 |
| --- | --- |
| default | 链接文本 |
| prefix | 前缀图标位 |
| suffix | 后缀图标位 |

## Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| click | 点击 | `(event: Event)` |

## 平台差异

| 能力 | H5 | 小程序 |
| --- | --- | --- |
| 载体 | view + `@click` | 同 H5（`href` / `target` 无导航语义，跳转由业务层在 `click` 事件里处理） |
| hover 下划线 | 有 | 无（`underline="always"` / `"none"` 可见；VIEW 的下划线渲染以实际效果为准） |
