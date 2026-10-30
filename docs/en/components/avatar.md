# Avatar

Displays an avatar of a user or an entity, supporting three forms: image, icon, and text.

## Basic usage

```vue
<template>
  <lh-avatar src="https://placeholder.invalid/avatar.png" />
  <lh-avatar icon="user" />
  <lh-avatar text="水墨" />
</template>
```

## Shape and size

```vue
<template>
  <lh-avatar text="水" shape="circle" />
  <lh-avatar text="墨" shape="square" />
  <lh-avatar text="小" size="small" />
  <lh-avatar text="大" size="large" />
</template>
```

## Crop mode

`fit` maps to the `mode` of the uni `<image>`: `fill` → `scaleToFill`, `contain` → `aspectFit`, `cover` → `aspectFill`, `none` → `center`.

```vue
<template>
  <lh-avatar src="https://placeholder.invalid/avatar.png" fit="cover" />
  <lh-avatar src="https://placeholder.invalid/avatar.png" fit="contain" />
</template>
```

::: tip scale-down is approximate
uni has no `mode` equivalent to `scale-down`; the semantically closest `aspectFit` is used (preserves the aspect ratio and shows the whole image without enlarging it).
:::

## Load failure fallback

When the image fails to load, the component falls back in the order "icon → text → empty" and emits the `error` event.

```vue
<template>
  <lh-avatar
    src="https://placeholder.invalid/broken.png"
    icon="user"
    alt="Avatar"
    @error="onError"
  />
</template>

<script setup lang="ts">
const onError = () => console.log('Image failed to load')
</script>
```

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| src | Image URL; when empty it falls back to icon, then text | `string` | — |
| alt | Alternative text when the image fails to load; also serves as the accessibility name | `string` | — |
| icon | Icon name (shown when src is empty or failed to load) | `LhIconName` | — |
| text | Text avatar content (when both src and icon are absent, the first character is shown) | `string` | — |
| shape | Shape | `'circle' \| 'square'` | `'circle'` |
| size | Size | `'small' \| 'medium' \| 'large'` | `'medium'` |
| fit | Image crop mode (maps to the mode of the uni image) | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'cover'` |
| customClass | Custom class name | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## Events

| Event | Description | Callback parameters |
| --- | --- | --- |
| error | The image failed to load | `(e: Event)` |
