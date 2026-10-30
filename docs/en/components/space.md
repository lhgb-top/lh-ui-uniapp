# Space

Used to lay out the spacing between adjacent elements, replacing hand-written margin. The spacing relies entirely on CSS `gap`, which both targets support natively.

## Basic usage

```vue
<template>
  <lh-space>
    <lh-tag>水墨</lh-tag>
    <lh-tag>留白</lh-tag>
    <lh-tag>国风</lh-tag>
  </lh-space>
</template>
```

## Direction

```vue
<template>
  <lh-space direction="vertical">
    <lh-tag>水墨</lh-tag>
    <lh-tag>留白</lh-tag>
  </lh-space>
</template>
```

## Spacing steps

The preset steps reference spacing tokens (customizable via `--lh-spacing-*`); numbers are treated as px; an array controls the horizontal and vertical spacing separately.

```vue
<template>
  <lh-space size="small">
    <lh-tag>Small</lh-tag>
    <lh-tag>Small</lh-tag>
  </lh-space>
  <lh-space size="medium">
    <lh-tag>Medium</lh-tag>
    <lh-tag>Medium</lh-tag>
  </lh-space>
  <lh-space size="large">
    <lh-tag>Large</lh-tag>
    <lh-tag>Large</lh-tag>
  </lh-space>
  <lh-space :size="24">
    <lh-tag>24px</lh-tag>
    <lh-tag>24px</lh-tag>
  </lh-space>
  <lh-space :size="[8, 16]">
    <lh-tag>Horizontal 8</lh-tag>
    <lh-tag>Vertical 16</lh-tag>
  </lh-space>
</template>
```

## Alignment and wrapping

```vue
<template>
  <lh-space alignment="center">
    <lh-tag>Centered</lh-tag>
    <lh-button type="primary" size="small">Button</lh-button>
  </lh-space>
  <lh-space :wrap="true">
    <lh-tag v-for="i in 20" :key="i">Tag {{ i }}</lh-tag>
  </lh-space>
</template>
```

::: tip Wrapping only takes effect in the horizontal direction
`wrap` is only meaningful for `direction="horizontal"`; passing it in the vertical direction is ignored.
:::

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| direction | Arrangement direction | `'horizontal' \| 'vertical'` | `'horizontal'` |
| size | Spacing: a preset step / a pixel number / [horizontal, vertical] | `'small' \| 'medium' \| 'large' \| number \| [number, number]` | `'medium'` |
| wrap | Whether wrapping is allowed (horizontal direction only) | `boolean` | `true` |
| alignment | Alignment | `'start' \| 'center' \| 'end' \| 'baseline'` | `'start'` |
| customClass | Custom class name | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## Slots

| Slot | Description |
| --- | --- |
| default | The children whose spacing is being arranged |
