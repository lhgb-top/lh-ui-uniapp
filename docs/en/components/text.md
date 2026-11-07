# Text

A one-stop typography component for headings, body text, ellipsis and copying; all semantic modifiers land on BEM modifier classes.

## Level

```vue
<template>
  <lh-text level="h1">Heading 1</lh-text>
  <lh-text level="p">Body paragraph</lh-text>
  <lh-text level="caption">Auxiliary note</lh-text>
</template>
```

`level` accepts `h1` ~ `h6` / `p` (default) / `caption`. An invalid value degrades to `p`.

## Semantics and modifiers

```vue
<template>
  <lh-text type="success" strong>Success and bold</lh-text>
  <lh-text mark>Highlighted mark</lh-text>
  <lh-text code>Code style</lh-text>
</template>
```

`type`: `default` (default) / `secondary` / `success` / `warning` / `danger`; modifier props: `strong` / `italic` / `underline` / `mark` / `code` / `disabled`.

## Ellipsis

```vue
<template>
  <lh-text :ellipsis="true">Single-line ellipsis</lh-text>
  <lh-text :ellipsis="2">Two-line ellipsis</lh-text>
</template>
```

`ellipsis` set to `true` truncates to one line; a number truncates by line count (max 10; multi-line ellipsis uses inline `-webkit-line-clamp`).

## Copy

```vue
<template>
  <lh-text copyable copy-text="Fixed text">Copy via the button on the right</lh-text>
</template>
```

`copyable` appends a copy button: clicking it writes to the clipboard, briefly switches to "Copied", and fires the `copy` event at the same time (the argument is the text actually written).

::: tip Copying on the Mini Program
On H5, when `copy-text` is not passed the slot text is used automatically; **the Mini Program cannot read the slot text, so `copy-text` must be passed**, otherwise the button writes nothing (clicking still fires the `copy` event). The labels come from the locale package `text.copy` / `text.copied` and can be overridden with `copy-label`.
:::

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| level | Heading level and paragraph form | `'h1' \| ... \| 'h6' \| 'p' \| 'caption'` | `'p'` |
| type | Semantic color | `'default' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | `'default'` |
| strong / italic / underline / mark / code / disabled | Boolean modifiers | `boolean` | `false` |
| ellipsis | Ellipsis: `true` for one line, a number for line count | `boolean \| number` | `false` |
| copyable | Appends a copy button | `boolean` | `false` |
| copyLabel | Accessibility name of the copy button | `string` | — |
| copyText | Text to copy (required on the Mini Program) | `string` | — |
| customClass | Custom class name | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| copy | Copy button clicked | `(text: string)` |

## Platform differences

| Capability | H5 | Mini Program |
| --- | --- | --- |
| Rendering element | view (typography carried by the `lh-text--<level>` classes) | Same as H5 |
| Copy | Takes the slot text automatically when `copy-text` is not passed (`navigator.clipboard`) | `copy-text` must be passed; goes through `uni.setClipboardData` (with a system toast) |
