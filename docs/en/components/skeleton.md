# Skeleton

A placeholder for when the data is not loaded yet; the real content is rendered when `loading` is false.

## Basic usage

```vue
<template>
  <lh-skeleton :loading="loading">
    <view>Real content</view>
  </lh-skeleton>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const loading = ref(true)
</script>
```

## Rows and avatar

```vue
<template>
  <lh-skeleton :loading="true" :rows="4" avatar />
</template>
```

## Disabling the animation

```vue
<template>
  <lh-skeleton :loading="true" :animated="false" :rows="3" />
</template>
```

## Standalone placeholder blocks

`lh-skeleton-item` can be used on its own to assemble a custom placeholder layout; `variant` takes `text` / `rect` / `circle`.

```vue
<template>
  <view class="custom-skeleton">
    <lh-skeleton-item variant="circle" class="avatar" />
    <lh-skeleton-item variant="text" class="line" />
  </view>
</template>
```

## Props (lh-skeleton)

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| loading | Whether it is in the loading state (when false, the real content of the default slot is rendered) | `boolean` | `true` |
| rows | Number of text rows | `number` | `3` |
| avatar | Whether to include a circular avatar placeholder | `boolean` | `false` |
| animated | Whether the animation is enabled | `boolean` | `true` |
| customClass | Custom class name | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## Props (lh-skeleton-item)

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| variant | Placeholder block shape | `'text' \| 'rect' \| 'circle'` | `'text'` |
| animated | Whether the animation is enabled | `boolean` | `true` |
| customClass | Custom class name | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## Slots (lh-skeleton)

| Slot | Description |
| --- | --- |
| default | The real content rendered when `loading` is false |

::: tip Accessibility
The container is labeled with `aria-busy="true"` and `aria-live="polite"`, and the placeholder blocks themselves are hidden from assistive technologies; once the data is ready, screen readers announce the real content automatically.
:::
