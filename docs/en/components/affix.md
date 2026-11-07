# Affix

Pins content to the top or bottom of the viewport. The fixed-state decision
(`isAffixFixed`) and the fixed style (`getAffixFixedStyle`) come from `@lh-ui/share`
core pure functions; the component layer only handles scroll subscription,
placeholder measuring and the reactive glue.

## Platform differences (important)

Scrolling semantics differ between H5 and the WeChat Mini Program, so this
component uses a dual-target approach:

- **H5**: the component listens to the `scroll` event of `window` (or of the
  container the `target` selector points to) itself, and uses the placeholder
  node's `getBoundingClientRect` to decide the fixed state.
- **WeChat Mini Program**: the `scroll` event can only be bound on the
  `scroll-view` tag, so the component cannot subscribe on its own. Place the
  component inside a `scroll-view` and inject the scroll event's
  `detail.scrollTop` through the `scrollTop` prop:

```vue
<template>
  <scroll-view
    class="my-scroll"
    :scroll-y="true"
    :scroll-top="scrollTop"
    @scroll="onScroll"
  >
    <lh-affix :scroll-top="scrollTop" :offset-top="20">
      <view class="my-bar">Sticky bar</view>
    </lh-affix>
    <!-- long content -->
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const scrollTop = ref(0)
function onScroll(event: { detail?: { scrollTop?: number } }) {
  scrollTop.value = event.detail?.scrollTop ?? 0
}
</script>
```

On H5, when `scrollTop` is not passed the component listens to `window`
automatically; when a `target` selector is passed it listens to that container
instead.

## Basic usage

```vue
<template>
  <lh-affix :offset-top="20">
    <lh-button type="primary">Sticky button</lh-button>
  </lh-affix>
</template>
```

Once the content scrolls past `offset-top` it is pinned to the top of the
viewport; while pinned, the placeholder holds the document position at the
original height so the following content does not jump.

## Bottom mode

```vue
<template>
  <lh-affix :offset-bottom="24">
    <view class="my-bar">Bottom bar</view>
  </lh-affix>
</template>
```

`offset-bottom` takes precedence over `offset-top`: the placeholder's bottom
edge is pinned to the bottom once it crosses "viewport height - offset-bottom".

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| offset-top | Pixels from the top of the viewport that trigger pinning to the top | `number` | `0` |
| offset-bottom | Pixels from the bottom of the viewport that trigger pinning to the bottom (takes precedence over offset-top) | `number` | `0` |
| target | H5 scroll container selector (the viewport by default; no effect on MP) | `string` | `-` |
| scrollTop | Scroll position injection (MP: `detail.scrollTop` of scroll-view) | `number` | `-` |
| sx | Quick layout props (spacing / size / flex) | `LhSxProps` | `-` |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| change | Fired when the fixed state changes | `(fixed: boolean)` |

### Slots

| Name | Description |
| --- | --- |
| default | The content to pin |
