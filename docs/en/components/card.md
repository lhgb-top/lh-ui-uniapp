# Card

An information aggregation container that supports a cover, header, body, footer, and a loading placeholder.

## Basic usage

```vue
<template>
  <lh-card title="水墨">
    <view>Card content</view>
  </lh-card>
</template>
```

## Cover and footer

```vue
<template>
  <lh-card title="Landscape album">
    <template #cover>
      <image class="cover" src="https://placeholder.invalid/cover.png" mode="aspectFill" />
    </template>
    <view>Card content</view>
    <template #footer>
      <view>Footer actions</view>
    </template>
  </lh-card>
</template>
```

::: tip Children inside the cover need an explicit width
The "cover children fill the width" rule from share (`.lh-card__cover > *`) relies on a wildcard selector that WXSS does not support, and the sanitization pipeline drops it. On the Mini Program, give children inside the cover such as `<image>` an explicit width (for example `width: 100%`).
:::

## Header right action area

The `extra` slot is rendered to the right of the title and appears only when a `title` or a `header` slot exists.

```vue
<template>
  <lh-card title="Order">
    <template #extra>
      <lh-button size="small" text>View more</lh-button>
    </template>
    <view>Card content</view>
  </lh-card>
</template>
```

## Shadow and clickable

```vue
<template>
  <lh-card shadow="hover" clickable @click="onClick">
    <view>Raises on hover, emits an event on click</view>
  </lh-card>
</template>

<script setup lang="ts">
const onClick = () => console.log('Card clicked')
</script>
```

## Loading placeholder

```vue
<template>
  <lh-card title="水墨" loading>
    <view>Not rendered while the content is loading</view>
  </lh-card>
</template>
```

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| title | Card title (the header slot can also be used) | `string` | — |
| shadow | When the shadow is shown | `'always' \| 'hover' \| 'never'` | `'always'` |
| clickable | The whole card is clickable (carries the button keyboard semantics) | `boolean` | `false` |
| loading | Loading state: the content area is replaced by a skeleton placeholder | `boolean` | `false` |
| themeVars | Component-level theme variables (the keys get the `--lh-` prefix automatically) | `Record<string, string>` | — |
| bgPattern | Pattern background URL (such as `var(--lh-pattern-willow)`), not restricted by the global allowlist | `string` | — |
| customClass | Custom class name | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## Events

| Event | Description | Callback parameters |
| --- | --- | --- |
| click | Click on the whole card (emitted only when `clickable`) | `(e: Event)` |

## Slots

| Slot | Description |
| --- | --- |
| cover | Cover |
| header | Header (takes precedence over title) |
| extra | Header right action area (requires the header to exist) |
| default | Body content |
| footer | Footer |

::: tip Keyboard activation is H5-only
A `clickable` card supports Enter / Space keyboard activation on H5 (aligned with the APG button pattern); the Mini Program has no keyboard events, so this handling is removed from the MP target by conditional compilation.
:::
