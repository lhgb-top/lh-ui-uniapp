# Grid

A 24-column grid layout: `lh-row` paired with `lh-col` (easycom lets you use the tags directly; when importing on demand the component names are `LhRow` / `LhCol`). It is built on CSS Grid: `span` / `offset` / `push` / `pull` map directly to `grid-column` placement, and the class names and placement math all come from `@lh-ui/share` core pure functions.

## Basic layout

```vue
<template>
  <lh-row>
    <lh-col :span="12"><view class="cell">12</view></lh-col>
    <lh-col :span="12"><view class="cell">12</view></lh-col>
  </lh-row>
</template>
```

## Gutter

`gutter` accepts a `number` (horizontal only) or a `[horizontal, vertical]` array; Row uses a negative margin to cancel the column padding.

```vue
<template>
  <lh-row :gutter="16">
    <lh-col :span="8"><view class="cell">8</view></lh-col>
    <lh-col :span="8"><view class="cell">8</view></lh-col>
    <lh-col :span="8"><view class="cell">8</view></lh-col>
  </lh-row>
  <lh-row :gutter="[16, 24]">
    <lh-col :span="12"><view class="cell">12</view></lh-col>
    <lh-col :span="12"><view class="cell">12</view></lh-col>
  </lh-row>
</template>
```

## Justify / align

`justify`'s `center` and `align`'s `middle` each map to their own modifier class (the two axes never collide); `align='center'` is a compatibility alias for `middle`.

```vue
<template>
  <lh-row justify="center" align="middle">
    <lh-col :span="6"><view class="cell">6</view></lh-col>
    <lh-col :span="6"><view class="cell">6</view></lh-col>
  </lh-row>
</template>
```

## Offset and shift

- `offset`: shifts the start N columns to the right (explicit start `offset + 1`)
- `push` / `pull`: shifts the start right / left on top of offset

```vue
<template>
  <lh-row>
    <lh-col :span="6" :offset="6"><view class="cell">6 / offset 6</view></lh-col>
    <lh-col :span="9" :push="6"><view class="cell">9 / push 6</view></lh-col>
  </lh-row>
</template>
```

## Responsive breakpoints

`xs` / `sm` / `md` / `lg` / `xl` take effect at `<640 / ≥640 / ≥768 / ≥1024 / ≥1280px` respectively, falling back down to the nearest defined breakpoint (`xs` always last). You can also declare them in bulk with `sizes`.

```vue
<template>
  <lh-row>
    <lh-col :xs="24" :sm="12" :md="8" :lg="6">
      <view class="cell">xs=24 sm=12 md=8 lg=6</view>
    </lh-col>
  </lh-row>
</template>
```

## Row Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| gutter | Column gap (px, or `[horizontal, vertical]`) | `number \| [number, number]` | `0` |
| justify | Main-axis arrangement | `'start' \| 'center' \| 'end' \| 'space-between' \| 'space-around'` | `'start'` |
| align | Cross-axis alignment | `'top' \| 'middle' \| 'bottom'` | `'top'` |
| wrap | Whether to wrap | `boolean` | `true` |
| customClass | Custom class name (forwarded to the root node) | `string` | — |
| sx | sx shorthand layout properties | `LhSxProps` | — |

## Col Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| span | Number of columns occupied (24-column grid) | `number` | — |
| offset | Number of leading offset columns | `number` | — |
| push | Number of columns to shift right | `number` | — |
| pull | Number of columns to shift left | `number` | — |
| xs / sm / md / lg / xl | Size per breakpoint (`number` or `{ span, offset }`) | `LhColSize` | — |
| sizes | Bulk declaration per breakpoint (equivalent to xs–xl, pick either) | `LhBreakpointSizes` | — |
| customClass | Custom class name (forwarded to the root node) | `string` | — |
| sx | sx shorthand layout properties | `LhSxProps` | — |

## Slots

| Slot | Description |
| --- | --- |
| default | Grid content (both Row and Col expose the default slot) |

## Platform differences

- **Pure layout component**: no overlays, no measuring, no document dependencies — behaves identically on H5 and WeChat Mini Program.
- **Breakpoint source**: H5 listens to `matchMedia`; **the Mini Program has no matchMedia**, so it always degrades to the `xs` breakpoint (the fallback rules still come from share core's `resolveResponsiveSize`; only the current breakpoint is fixed to `xs`). If you need width-based tiers on the Mini Program, feed `uni.getSystemInfoSync().windowWidth` into the injection interface provided by `useLhBreakpoint`, or simply fix one layout for the Mini Program.
- **Tag replacement**: plus's `<div>` becomes `<view>` (WXSS forbids tag selectors; styles apply via the `lh-row*` / `lh-col*` classes).
- **`grid-column` placement**: a plain `span` uses auto-placement (`span N`); when `offset` / `push` / `pull` are present the start is placed explicitly and clamped inside the 24-column coordinate system so out-of-range combinations cannot break the container.

::: tip Differences from the Vue 3 version
- Component structure, prop surface, class names and placement math match plus exactly (same share core).
- Subcomponent tags follow the easycom convention `lh-row` / `lh-col` (`LhRow` / `LhCol` when importing on demand).
- A `customClass` prop is added: custom classes cannot penetrate `styleIsolation` in uni-app, so they are forwarded via a prop (plus passes classes directly).
:::
