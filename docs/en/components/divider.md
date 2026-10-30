# Divider

A divider that separates different content, supporting grouping semantics with text.

## Basic usage

```vue
<template>
  <view>Text above</view>
  <lh-divider />
  <view>Text below</view>
</template>
```

## With text

```vue
<template>
  <lh-divider>水墨</lh-divider>
  <lh-divider label-position="left">Left aligned</lh-divider>
  <lh-divider label-position="right">Right aligned</lh-divider>
</template>
```

## Dashed and border styles

```vue
<template>
  <lh-divider dashed />
  <lh-divider border-style="dotted" />
</template>
```

`borderStyle` takes precedence over `dashed`; only `dashed` / `dotted` have corresponding styles, and other values render as the default solid line.

## Vertical direction

```vue
<template>
  <lh-space>
    <span>水墨</span>
    <lh-divider direction="vertical" />
    <span>留白</span>
  </lh-space>
</template>
```

::: tip Height of the vertical direction
A vertical divider is `inline-block`; inside a flex row it fills the parent height via `align-self: stretch`. Placed alone in a block container it is only `1em` tall — it behaves intuitively only when used inside a flex row.
:::

## Vertical with text

The vertical direction also supports text: the line segments are arranged above and below the text, the role is upgraded to `role="separator"`, and `aria-orientation="vertical"` is declared.

```vue
<template>
  <view class="vertical-text-row">
    <text>Top</text>
    <lh-divider direction="vertical">水墨</lh-divider>
    <text>Bottom</text>
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

::: tip The height of vertical text comes from the parent row
A vertical divider with text gets its height from `align-self: stretch` of the parent row, which is what lets the line segments stretch out — the parent container needs to be a flex row with a definite height (such as `height: 120px` in the example above). Inside a block parent the line segments are left with only a 12px minimum length.
:::

::: tip labelPosition has no effect in the vertical direction
`label-position` is a left/right alignment semantics for the horizontal direction; in the vertical direction the text is always centered and no modifier class is produced.
:::

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| direction | Direction | `'horizontal' \| 'vertical'` | `'horizontal'` |
| dashed | Whether it is dashed | `boolean` | `false` |
| labelPosition | Alignment position when text is present (effective in the horizontal direction; always centered in the vertical direction) | `'left' \| 'center' \| 'right'` | `'center'` |
| borderStyle | Border style (takes precedence over dashed) | `string` | — |
| customClass | Custom class name | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## Slots

| Slot | Description |
| --- | --- |
| default | Divider text (arranged left/right in the horizontal direction, top/bottom in the vertical direction) |
