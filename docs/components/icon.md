# Icon 图标

::: tip 小程序端是字体渲染
web 端（plus）用内联 `<svg><path>`，小程序**不支持 `<svg>` 标签**。
本库在构建期把 share 的 SVG path 集合转成 iconfont 字体（base64 内嵌在
`iconfont.css`），组件渲染 `<text class="lh-iconfont lh-iconfont--<name>">`。
颜色用 CSS `color`（**不能用 `fill` / `stroke`**），完整替代 web 端的 `currentColor` 语义。
:::

## 基础用法

```vue
<template>
  <lh-icon name="search" />
  <lh-icon name="loading" size="24" color="#1677ff" />
  <lh-icon name="star" size="1.5em" />
</template>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 图标名称（share 的 `LH_ICON_SVGS_CONST` 键） | `LhIconName` | — |
| size | 尺寸（数字按 px；字符串原样透传，如 `'1.5em'`） | `string \| number` | — |
| color | 颜色（替代 web 端 `currentColor`） | `string` | — |
| customClass | 自定义类名（透传到根节点） | `string` | — |
| themeVars | 组件级主题变量 | `Record<string, string>` | — |
| bgPattern | 组件级背景花纹 | `string` | — |

## 图标清单

共 37 个图标（24×24 单色、单 path），全部来自 `@lh-ui/share` 的 `LH_ICON_SVGS_CONST`。
构建命令 `pnpm build:iconfont` 会重新生成字体与码点映射（`src/icon/icon-map.ts`）。

::: warning 别忘了引字体样式
使用方需要引入 `@lh-ui/uniapp/src/icon/iconfont.css`，否则图标显示为空白方块。
:::
