# Icon

::: tip Font rendering on the Mini Program
The web builds (plus) use inline `<svg><path>`, but the Mini Program **does not support the `<svg>` tag**. This library converts share's SVG path set into an iconfont font at build time (base64 embedded in `iconfont.css`), and the component renders `<text class="lh-iconfont lh-iconfont--<name>">`. Color is set with CSS `color` (**not `fill` / `stroke`**), fully replacing the `currentColor` semantics of the web builds.
:::

## Basic usage

```vue
<template>
  <lh-icon name="search" />
  <lh-icon name="loading" size="24" color="#1677ff" />
  <lh-icon name="star" size="1.5em" />
</template>
```

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| name | Icon name (a key of share's `LH_ICON_SVGS_CONST`) | `LhIconName` | — |
| size | Size (numbers are treated as px; strings are passed through as-is, such as `'1.5em'`) | `string \| number` | — |
| color | Color (replaces `currentColor` on the web builds) | `string` | — |
| customClass | Custom class name (passed through to the root node) | `string` | — |
| themeVars | Component-level theme variables | `Record<string, string>` | — |
| bgPattern | Component-level background pattern | `string` | — |

## Icon list

37 icons in total (24×24 monochrome, single path), all from `LH_ICON_SVGS_CONST` of `@lh-ui/share`. The build command `pnpm build:iconfont` regenerates the font and the codepoint map (`src/icon/icon-map.ts`).

::: warning Do not forget to import the font styles
Consumers need to import `@lh-ui/uniapp/src/icon/iconfont.css`; otherwise the icons render as blank squares.
:::
