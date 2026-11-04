# Drawer

A panel that slides in from the edge of the screen, suited for edge-hugging temporary tasks that need more room than a Dialog (details, filters, wizard steps). Like Dialog it uses `role="dialog"` + `aria-modal="true"`; mask clicks and Esc (H5) both close it.

## Basic usage

```vue
<template>
  <lh-button @click="visible = true">Open drawer</lh-button>

  <lh-drawer v-model="visible" title="Order details">
    <view>Put the drawer body content here.</view>
    <view>The panel width is controlled by size, 30% of the viewport by default.</view>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
</script>
```

## Four directions

`direction` accepts `right` (default) / `left` / `top` / `bottom`; the panel slides in from the matching edge.

```vue
<template>
  <!-- Open the right drawer -->
  <lh-button @click="openDir('right')">right</lh-button>
  <!-- Open the left drawer -->
  <lh-button @click="openDir('left')">left</lh-button>
  <!-- Open the top drawer -->
  <lh-button @click="openDir('top')">top</lh-button>
  <!-- Open the bottom drawer -->
  <lh-button @click="openDir('bottom')">bottom</lh-button>

  <!-- Slide out in the given direction -->
  <lh-drawer v-model="dirVisible" :title="`${direction} drawer`" :direction="direction" size="40%">
    <view>Current direction: {{ direction }}</view>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhDrawerDirection } from '@lh-ui/uniapp'

const dirVisible = ref(false)
const direction = ref<LhDrawerDirection>('right')
function openDir(d: LhDrawerDirection) {
  direction.value = d
  dirVisible.value = true
}
</script>
```

## Custom size

A numeric `size` is px; strings support percentages (e.g. `'40%'`). Horizontal directions apply it to width, vertical ones to height.

```vue
<template>
  <!-- Open a 480px-wide drawer -->
  <lh-button @click="sized = true">480px drawer</lh-button>

  <!-- Fixed-size drawer with a footer action bar -->
  <lh-drawer v-model="sized" title="Filters" :size="480">
    <view>Filter data by name or tag.</view>
    <template #footer>
      <lh-button @click="sized = false">Cancel</lh-button>
      <lh-button type="primary" @click="sized = false">Apply filters</lh-button>
    </template>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const sized = ref(false)
</script>
```

## Behavior switches

`mask-closable` controls mask-click closing, `show-close` the top-right close button, `close-on-esc` Esc closing (H5 only) and `lock-scroll` body scroll locking while open (H5 only).

```vue
<template>
  <!-- Open the "close by button only" drawer -->
  <lh-button @click="locked = true">Close by button only</lh-button>

  <!-- Mask clicks and Esc both do nothing; only the button closes -->
  <lh-drawer
    v-model="locked"
    title="Close by button only"
    :mask-closable="false"
    :show-close="false"
    :close-on-esc="false"
  >
    <view>Neither mask clicks nor Esc (H5) close it.</view>
    <template #footer>
      <lh-button type="primary" @click="locked = false">Close</lh-button>
    </template>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const locked = ref(false)
</script>
```

## Drawer API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue (v-model) | Whether shown | `boolean` | `false` |
| title | Title (or use the header slot) | `string` | — |
| direction | Direction | `'right' \| 'left' \| 'top' \| 'bottom'` | `'right'` |
| size | Size: numbers are px, strings support percentages | `string \| number` | `'30%'` |
| maskClosable | Close on mask click | `boolean` | `true` |
| showClose | Show the close button | `boolean` | `true` |
| lockScroll | Lock page scroll while open (**H5 only**) | `boolean` | `true` |
| closeOnEsc | Respond to Esc (**H5 only**) | `boolean` | `true` |
| customClass | Custom class name (passed to the root node) | `string` | — |
| themeVars | Component-level theme variables | `Record<string, string>` | — |
| bgPattern | Component-level background pattern, overrides ConfigProvider | `string` | — |
| sx | Quick layout props (applied to the panel) | `LhSxProps` | — |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:modelValue | Visibility changed (after the animation) | `(visible: boolean)` |
| open | Opened | — |
| close | Closed (after the animation) | — |

### Slots

| Slot | Description |
| --- | --- |
| default | Body content |
| header | Custom header title area (replaces the title text) |
| footer | Footer action bar |

### Methods

| Method | Description |
| --- | --- |
| open | Open programmatically |
| close | Close programmatically |

### Accessibility

- The root node is `role="dialog"` + `aria-modal="true"`; with a title it is linked via `aria-labelledby`, without one the locale `drawer.title` is used as the `aria-label` fallback
- The mask is decorative (`aria-hidden="true"`)
- The close button carries `role="button"` and an `aria-label` from the locale `drawer.close`
- Esc closes (disable with `close-on-esc`, H5 only)

::: tip Platform differences (differences from the Vue3 version)
- **Overlay carrier**: no `teleportTarget` prop — the Mini Program has no DOM teleport, so the overlay is carried by `root-portal` (H5 uses teleport). **On WeChat, `root-portal` requires base library ≥ 2.25.2**; older versions fall back to in-page `fixed` automatically (it stays inside the page node tree, but layering is still guaranteed by the auto-incrementing z-index, so behavior is unaffected).
- **Enter/leave transition**: plus drives the slide animation with `<Transition name="lh-drawer-fade">`; the Mini Program has no `<Transition>` component and its `transitionend` event is unreliable, so this port replays the Vue Transition class sequence manually (start state removed a frame later → active state → unmounted at the end) and aligns the 300ms share SCSS transition duration with `setTimeout` — the mask fades while the panel slides per direction, consistent on both targets.
- **No focus trap (keyboard-focus semantics are H5-only)**: plus traps the Tab sequence inside the panel while open; the Mini Program has no keyboard focus semantics (share's `shouldDrawerTrapFocus` is short-circuited by the `LH_IS_H5` compile-time guard), and like Dialog this port does not call share's focus-trap — only Esc closing is kept.
- **lockScroll is H5-only**: the Mini Program cannot lock body scroll; the fullscreen mask blocking clicks is the fallback.
- **closeOnEsc is H5-only**: Esc uses a document-level keyboard listener and only the topmost overlay responds when several are stacked; the Mini Program has no keyboard events and the whole block is stripped by conditional compilation.
- **teleportTarget is not implemented**: follows the select / tooltip / dropdown precedent (no DOM teleport on Mini Programs).
- **Bottom safe area**: with `direction="bottom"` the panel automatically gains an `env(safe-area-inset-bottom)` padding for full-screen devices (a uni-app-specific adaptation; the share style source has no such platform specialization).
:::
