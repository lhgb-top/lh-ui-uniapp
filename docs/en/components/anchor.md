# Anchor

Anchor navigation: click to jump to the corresponding section, and the current section is
highlighted as you scroll. Flattening (`flattenAnchorItems`) and active anchor resolution
(`resolveActiveAnchor`) come from the `@lh-ui/share` core pure functions.

## Platform differences (important)

- **H5**: the component listens to `window` (or the `target` container) scrolling itself,
  and anchor positioning uses the native `scrollIntoView`.
- **WeChat Mini Program**: scroll syncing requires injecting the `scroll-view`'s
  `detail.scrollTop` through the `scrollTop` prop; when an anchor is clicked, the
  component emits `update:scrollIntoView` (the target section id), which you bind to the
  `scroll-view`'s `scroll-into-view` attribute to complete positioning. When `target` is
  not passed, positioning is page-level and the component calls
  `uni.pageScrollTo({ selector })` directly.

```vue
<template>
  <scroll-view
    class="my-scroll"
    :scroll-y="true"
    :scroll-into-view="anchorTarget"
    @scroll="onScroll"
  >
    <view id="section-a" class="my-section">区块 A</view>
    <view id="section-b" class="my-section">区块 B</view>
    <lh-anchor
      :items="items"
      :scroll-top="scrollTop"
      @update:scroll-into-view="anchorTarget = $event"
    />
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const items = [
  { id: 'section-a', title: '区块 A' },
  { id: 'section-b', title: '区块 B' },
]
const scrollTop = ref(0)
const anchorTarget = ref('')
function onScroll(event: { detail?: { scrollTop?: number } }) {
  scrollTop.value = event.detail?.scrollTop ?? 0
}
</script>
```

## Basic usage

```vue
<template>
  <lh-anchor :items="items" />
</template>

<script setup lang="ts">
const items = [
  { id: 'section-a', title: '区块 A' },
  {
    id: 'group-b',
    title: 'B 组',
    children: [
      { id: 'section-b', title: '区块 B' },
      { id: 'section-c', title: '区块 C' },
    ],
  },
]
</script>
```

`items` supports children (`children`); they are flattened depth-first at render time and
indented automatically. Active anchor resolution rule: the active item is the last anchor
whose section top edge has scrolled past the `offset` threshold line.

## Horizontal layout

```vue
<template>
  <lh-anchor :items="items" direction="horizontal" />
</template>
```

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| items | Anchor data (supports children) | `LhAnchorItem[]` | `[]` |
| target | H5 scroll container selector (window by default) | `string` | — |
| scrollTop | Scroll position injection (MP: `detail.scrollTop` of the scroll-view) | `number` | — |
| offset | Threshold for active resolution (distance from the section top edge to the container top) | `number` | `0` |
| direction | Layout direction | `'vertical' \| 'horizontal'` | `'vertical'` |
| smooth | Smooth scrolling | `boolean` | `true` |
| sx | sx quick layout props | `LhSxProps` | — |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| change | Emitted when the active anchor changes | `(id: string)` |
| click | Emitted when an anchor item is clicked (before scroll positioning) | `(id: string)` |
| update:scrollIntoView | MP positioning contract: target section id, bind to scroll-into-view | `(id: string)` |
