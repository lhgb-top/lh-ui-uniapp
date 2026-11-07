# BackTop Back to top

A back-to-top button that appears once scrolling passes a threshold. The visibility check
(`isBackTopVisible`) and the scroll command (`backToTop`) come from the `@lh-ui/share`
core pure functions.

## Platform differences (important)

- **H5**: the component listens to the `scroll` event of `window` (or of the `target`
  container) itself; clicking the button scrolls the target container directly.
- **WeChat Mini Program**: you must feed the `scroll-view` scroll event
  `detail.scrollTop` into the component through the `scrollTop` prop to drive
  visibility; on click the component emits `update:scrollTop` (value 0), which you bind
  to the `scroll-view`'s `scroll-top` property to scroll back to the top. Without a
  `target`, scrolling is page-level and the component calls `uni.pageScrollTo`
  directly.

```vue
<template>
  <scroll-view
    class="my-scroll"
    :scroll-y="true"
    :scroll-top="scrollTop"
    @scroll="onScroll"
  >
    <!-- long content -->
    <lh-backtop :scroll-top="scrollTop" @update:scroll-top="scrollTop = $event" />
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

## Basic usage

```vue
<template>
  <lh-backtop :visibility-height="200" />
</template>
```

Once the page or container scrolls past `visibility-height` (200px by default), the
button fades in with a transition; clicking scrolls smoothly back to the top.

## Custom content and position

```vue
<template>
  <lh-backtop :right="24" :bottom="80">
    <view class="my-backtop">Top</view>
  </lh-backtop>
</template>
```

By default a circular button is rendered (with a built-in `arrow-up` icon);
`right` / `bottom` control the offset from the bottom-right corner of the viewport;
the default slot customizes the button content.

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| target | H5 scroll container selector (the viewport by default; on MP it only distinguishes page-level vs scroll-view-level back-to-top) | `string` | `-` |
| scrollTop | Scroll position injection (MP: `detail.scrollTop` of the scroll-view) | `number` | `-` |
| visibility-height | Number of pixels scrolled before the button appears | `number` | `200` |
| right | Offset from the right (px) | `number` | `40` |
| bottom | Offset from the bottom (px) | `number` | `40` |
| smooth | Smooth scrolling | `boolean` | `true` |
| sx | sx quick layout props | `LhSxProps` | `-` |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| click | Fired when the button is clicked (before the scroll command) | `(event: Event)` |
| scrollend | Fired after scrolling stops (150ms debounce) | `(scrollTop: number)` |
| update:scrollTop | MP back-to-top contract: the value is 0, bind it to the scroll-view's scroll-top | `(scrollTop: number)` |

### Slots

| Name | Description |
| --- | --- |
| default | Button content (an arrow-up icon by default) |
