# Spinner

Basic spinning figure that indicates an in-progress state. The loading overlay (the LhLoading service) also renders it internally.

## Basic usage

Five sizes: `mini` / `small` / `medium` / `large` / `x-large`. Diameters come from a single mapping constant (`LH_SPINNER_SIZE_PX`) of the `@lh-ui/share` core (12 / 16 / 24 / 32 / 40 px).

```vue
<template>
  <lh-spinner />
  <lh-spinner size="mini" />
  <lh-spinner size="small" />
  <lh-spinner size="medium" />
  <lh-spinner size="large" />
  <lh-spinner size="x-large" />
</template>
```

## Custom color

`color` accepts any CSS color value; when omitted, the figure inherits the current text color (`currentColor`).

```vue
<template>
  <lh-spinner color="#C4A35A" />
  <lh-spinner color="#5B8C5A" />
  <lh-spinner color="#B5462F" />
</template>
```

## Inheriting the text color

Without `color`, the figure follows the text color of its container, which suits mixed text layouts.

```vue
<template>
  <view class="row">
    <text>Loading…</text>
    <lh-spinner size="small" />
  </view>
</template>
```

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| size | Size | `'mini' \| 'small' \| 'medium' \| 'large' \| 'x-large'` | `'medium'` |
| color | Spin color (any CSS color value; falls back to currentColor) | `string` | — |
| customClass | Custom class name | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## Platform differences

- **The spin animation is a pure CSS animation**: it uses no platform API, works on every platform, and behaves identically on H5 and the WeChat Mini Program.
- **The figure is rendered per platform**: on H5 it is an svg stroke ring (a dual `stroke-dasharray` animation, pixel-for-pixel identical to the Vue 3 version); the Mini Program does not support svg template tags, so it uses a `view` + `border` ring instead — three colored borders form an arc of about three quarters of the circle (visually isomorphic to the 72% arc of the Vue 3 version), and the stroke width is set inline at 10% of the diameter (with a 1px minimum). Both platforms drive the rotation with a CSS animation, so no Mini Program-unreliable capability such as `transitionend` is involved.
- **Color flows through currentColor**: the `color` prop is written to the inline `color` style of the root node and the figure inherits it, exactly as in the Vue 3 version.
- **Accessibility**: the figure is purely decorative and is removed from the accessibility tree with `aria-hidden="true"`; the in-progress semantics should be carried by an ancestor container (for example `role="status"`).
- **Reduced motion**: the `prefers-reduced-motion` fallback to a static half ring is provided by the scss source of `@lh-ui/share`; that media query block is stripped entirely during the Mini Program build (WXSS does not support it), so the fallback only applies on H5.
- **Porting conclusion**: Spinner is a pure presentational component (no measuring, no overlays, no document dependency); the size mapping and class names are produced by the pure functions of the `@lh-ui/share` core (`getSpinnerClassNames` / `LH_SPINNER_SIZE_PX`), and this repo only adds reactive glue.
