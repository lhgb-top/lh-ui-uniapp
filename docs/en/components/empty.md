# Empty

A placeholder prompt for empty data, shipping with an ink painting (水墨) style illustration.

## Basic usage

```vue
<template>
  <lh-empty />
</template>
```

When `description` is not passed, `empty.description` from the locale package is used ("No data yet" in Chinese); it follows the ConfigProvider locale automatically when it is switched.

## Custom text

```vue
<template>
  <lh-empty description="The ink is still wet — nothing to view yet" />
</template>
```

## Custom image

```vue
<template>
  <lh-empty image="https://placeholder.invalid/empty.png" description="Completely empty" />
</template>
```

## Draw it yourself with a slot

The default slot can fully replace the default illustration (when `image` is passed, the default illustration is not rendered either).

```vue
<template>
  <lh-empty description="No favorites yet">
    <view class="my-illustration">🎨</view>
  </lh-empty>
</template>
```

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| description | Empty state description text (falls back to empty.description from the locale package when not passed) | `string` | — |
| image | Custom image URL (replaces the default illustration) | `string` | — |
| customClass | Custom class name | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## Slots

| Slot | Description |
| --- | --- |
| default | A custom illustration (replaces the default illustration when passed) |

::: tip The default illustration on the Mini Program
H5 keeps the inline `<svg>` illustration (with full theme color fidelity); the Mini Program does not support svg, so the default illustration is replaced by a simplified CSS-drawn version whose colors come from the theme variables, adapting to light and dark modes automatically.
:::
