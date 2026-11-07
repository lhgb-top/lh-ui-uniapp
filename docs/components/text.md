# Text 排版文本

标题 / 正文 / 省略 / 复制的一站式排版组件，语义修饰全部落在 BEM 修饰类上。

## 级别

```vue
<template>
  <lh-text level="h1">一级标题</lh-text>
  <lh-text level="p">正文段落</lh-text>
  <lh-text level="caption">辅助说明</lh-text>
</template>
```

`level` 支持 `h1` ~ `h6` / `p`（默认）/ `caption`。非法值降级为 `p`。

## 语义与修饰

```vue
<template>
  <lh-text type="success" strong>成功且加粗</lh-text>
  <lh-text mark>标记高亮</lh-text>
  <lh-text code>代码风格</lh-text>
</template>
```

`type`：`default`（默认）/ `secondary` / `success` / `warning` / `danger`；修饰属性：`strong` / `italic` / `underline` / `mark` / `code` / `disabled`。

## 省略

```vue
<template>
  <lh-text :ellipsis="true">单行省略</lh-text>
  <lh-text :ellipsis="2">两行省略</lh-text>
</template>
```

`ellipsis` 传 `true` 单行省略，传数字按行数截断（上限 10，多行省略走内联 `-webkit-line-clamp`）。

## 复制

```vue
<template>
  <lh-text copyable copy-text="固定文本">点后面的按钮复制</lh-text>
</template>
```

`copyable` 追加复制按钮，点击写入剪贴板并短暂切换为「已复制」，同时触发 `copy` 事件（参数为实际写入的文本）。

::: tip 小程序端复制
H5 端不传 `copy-text` 时会自动取插槽文本；**小程序端组件读不到插槽文本，必须传 `copy-text`**，否则按钮不会写入（点击仍会触发 `copy` 事件）。文案走语言包 `text.copy` / `text.copied`，可用 `copy-label` 覆盖。
:::

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| level | 标题级别与段落形态 | `'h1' \| ... \| 'h6' \| 'p' \| 'caption'` | `'p'` |
| type | 语义色 | `'default' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | `'default'` |
| strong / italic / underline / mark / code / disabled | 布尔修饰 | `boolean` | `false` |
| ellipsis | 省略：`true` 单行，数字按行数 | `boolean \| number` | `false` |
| copyable | 追加复制按钮 | `boolean` | `false` |
| copyLabel | 复制按钮无障碍名称 | `string` | — |
| copyText | 要复制的文本（小程序端必需） | `string` | — |
| customClass | 自定义类名 | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| copy | 复制按钮点击 | `(text: string)` |

## 平台差异

| 能力 | H5 | 小程序 |
| --- | --- | --- |
| 渲染载体 | view（排版由 `lh-text--<level>` 类承载） | 同 H5 |
| 复制 | 不传 `copy-text` 时自动取插槽文本（`navigator.clipboard`） | 必须传 `copy-text`，走 `uni.setClipboardData`（有系统提示） |
