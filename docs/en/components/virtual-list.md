# VirtualList Virtual list

Render only the visible window, even with tens of thousands of rows. The fixed-height
range (`computeVirtualRange`) and the dynamic-height logic
(`buildVirtualItems` / `findVirtualRange`) all come from the `@lh-ui/share`
core pure functions; the component layer only handles scroll driving and viewport
measurement.

## Platform differences

- **H5**: the container renders as a `view` (`overflow: auto`); the viewport height is
  measured with `clientHeight` + `ResizeObserver`.
- **WeChat Mini Program**: the container renders as a `scroll-view` (`scroll-y`),
  scroll events read `detail.scrollTop`, and the viewport height is measured with
  `createSelectorQuery` (MP has no `ResizeObserver`).
- **Dynamic height**: `itemSize` is a declarative function contract (the caller returns
  the height of each item). It works identically on both targets and relies on no
  measurement API the MP lacks.

## Basic usage (fixed height)

```vue
<template>
  <lh-virtual-list :data="items" :height="360" :item-height="48">
    <template #default="{ item, index }">
      <view class="my-item">Row {{ index + 1 }}: {{ item.label }}</view>
    </template>
  </lh-virtual-list>
</template>

<script setup lang="ts">
const items = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  label: `Item ${i + 1}`,
}))
</script>
```

`height` sets the container height; `item-height` is the item height in fixed-height
mode (it must match the actual item height). Outside the visible window, only `overscan`
(default 2) screens of buffer items are kept.

## Dynamic height

```vue
<template>
  <lh-virtual-list :data="items" :height="360" :item-size="sizeOf">
    <template #default="{ item, index }">
      <view class="my-item" :style="{ height: `${sizeOf(index)}px` }">
        Row {{ index + 1 }}: {{ item.label }}
      </view>
    </template>
  </lh-virtual-list>
</template>

<script setup lang="ts">
// itemSize is a declarative function: it returns each item's height, identically on
// both targets.
function sizeOf(index: number): number {
  return 48 + (index % 5) * 24
}
</script>
```

Use either `item-height` or `item-size`, not both: providing `itemSize` switches to
dynamic-height mode (per-item offsets are precomputed and the visible range is found by
binary search).

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| data | Data source (items are rendered by the default slot) | `any[]` | `[]` |
| height | Container height (a number is px) | `number \| string` | `300` |
| itemHeight | Item height in fixed-height mode | `number` | `-` |
| itemSize | Dynamic-height mode: returns the height of each item | `(index: number) => number` | `-` |
| overscan | Overscan item count (buffer items outside the visible window) | `number` | `2` |
| sx | sx quick layout props | `LhSxProps` | `-` |

### Slots

| Slot | Description | Scoped parameters |
| --- | --- | --- |
| default | Item rendering | `{ item, index }` |
