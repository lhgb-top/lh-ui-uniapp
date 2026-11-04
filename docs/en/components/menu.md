# Menu

Navigation menu for pages and features. Supports vertical (default) and horizontal layouts with recursive sub-menus; the active item is carried by `v-model`, and the expanded set can be controlled (`openeds`) or left internal (`default-openeds`).

## Basic usage

```vue
<template>
  <lh-menu v-model="active">
    <lh-menu-item index="1">Home</lh-menu-item>
    <lh-menu-item index="2">Works</lh-menu-item>
    <lh-menu-item index="3">About</lh-menu-item>
  </lh-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('1')
</script>
```

`index` is the unique identifier of an item; it is reported with the `select` event when a leaf item is clicked (`update:modelValue` fires in sync, so `v-model` can receive it).

## Sub-menus and default expanded

```vue
<template>
  <lh-menu v-model="active" :default-openeds="['2']" @select="onSelect">
    <lh-menu-item index="1">Home</lh-menu-item>
    <lh-sub-menu index="2" title="My works">
      <lh-menu-item index="2-1">Ink painting</lh-menu-item>
      <lh-menu-item index="2-2">Gongbi painting</lh-menu-item>
    </lh-sub-menu>
  </lh-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('')
function onSelect(index: string, indexPath: string[]) {
  console.log(index, indexPath)
}
</script>
```

Sub-menus can nest recursively: the `select` event's `indexPath` is the full path from the outermost sub-menu down to the chosen item (e.g. `['2', '2-1', '2-1-1']`).

## Accordion

`unique-opened` keeps at most one sub-menu expanded at a time (clicking the open title again closes it; all-collapsed is allowed).

```vue
<template>
  <lh-menu v-model="active" unique-opened>
    <lh-sub-menu index="1" title="Group one">
      <lh-menu-item index="1-1">Option 1-1</lh-menu-item>
    </lh-sub-menu>
    <lh-sub-menu index="2" title="Group two">
      <lh-menu-item index="2-1">Option 2-1</lh-menu-item>
    </lh-sub-menu>
  </lh-menu>
</template>
```

## Controlled expansion

Passing `openeds` switches to controlled mode: the component no longer maintains the expanded set internally; it is driven by the `update:openeds` callback.

```vue
<template>
  <lh-menu v-model="active" :openeds="openeds" @update:openeds="openeds = $event">
    <lh-sub-menu index="1" title="Controlled sub-menu">
      <lh-menu-item index="1-1">Option 1-1</lh-menu-item>
    </lh-sub-menu>
  </lh-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('')
const openeds = ref<string[]>(['1'])
</script>
```

## Groups

`lh-menu-item-group` clusters related items (visual grouping only; it takes no part in expansion logic).

```vue
<template>
  <lh-menu v-model="active">
    <lh-menu-item-group title="Basic content">
      <lh-menu-item index="1">Articles</lh-menu-item>
      <lh-menu-item index="2">Images</lh-menu-item>
    </lh-menu-item-group>
    <lh-menu-item-group title="Advanced features">
      <lh-menu-item index="3">Analytics</lh-menu-item>
    </lh-menu-item-group>
  </lh-menu>
</template>
```

## Horizontal mode

```vue
<template>
  <lh-menu v-model="active" mode="horizontal">
    <lh-menu-item index="1">Home</lh-menu-item>
    <lh-sub-menu index="2" title="Portfolio">
      <lh-menu-item index="2-1">Ink painting</lh-menu-item>
      <lh-menu-item index="2-2">Gongbi painting</lh-menu-item>
    </lh-sub-menu>
    <lh-menu-item index="3">About</lh-menu-item>
  </lh-menu>
</template>
```

In horizontal mode sub-menus fly out below their title (`bottom-start`); nested levels fly out to the right (`right-start`).

## Collapse mode

Vertical mode combined with `collapse` shrinks the menu to a narrow strip; sub-menus then become fly-out panels on the right.

```vue
<template>
  <lh-menu v-model="active" collapse>
    <lh-sub-menu index="1" title="Mail">
      <lh-menu-item index="1-1">Inbox</lh-menu-item>
      <lh-menu-item index="1-2">Sent</lh-menu-item>
    </lh-sub-menu>
    <lh-menu-item index="2">Drafts</lh-menu-item>
  </lh-menu>
</template>
```

## Menu API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue | Active item (v-model; maintained internally when omitted) | `string` | — |
| mode | Layout mode | `'horizontal' \| 'vertical'` | `'vertical'` |
| collapse | Collapse vertical menu to an icon strip (sub-menus become fly-out panels) | `boolean` | `false` |
| defaultOpeneds | Sub-menu keys expanded by default (uncontrolled) | `string[]` | `[]` |
| openeds | Controlled expanded sub-menu keys | `string[]` | — |
| uniqueOpened | Accordion: keep at most one sub-menu expanded | `boolean` | `false` |
| sx | sx quick layout props | `LhSxProps` | — |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| select | Fired when a leaf item is selected | `(index: string, indexPath: string[])` |
| open | Fired when a sub-menu expands | `(index: string, indexPath: string[])` |
| close | Fired when a sub-menu collapses | `(index: string, indexPath: string[])` |
| update:modelValue | Active item change (v-model) | `(value: string)` |
| update:openeds | Expanded set change | `(value: string[])` |

### Slots

| Slot | Description |
| --- | --- |
| default | Menu content (composed of `LhMenuItem` / `LhSubMenu` / `LhMenuItemGroup`) |

## MenuItem API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| index | Unique identifier (required) | `string` | — |
| disabled | Disabled (keeps aria-disabled semantics; click and keyboard activation are both suppressed) | `boolean` | `false` |
| sx | sx quick layout props | `LhSxProps` | — |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| click | Fired when the leaf item is clicked (not fired for disabled items) | `(index: string)` |

## SubMenu API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| index | Unique identifier (required) | `string` | — |
| title | Title (a `title` slot is also available) | `string` | — |
| disabled | Disabled | `boolean` | `false` |
| sx | sx quick layout props | `LhSxProps` | — |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| select | Fired when a descendant leaf item is selected (path includes this sub-menu's index) | `(index: string, indexPath: string[])` |

### Slots

| Slot | Description |
| --- | --- |
| default | Sub-menu content (may nest further `LhMenuItem` / `LhSubMenu`) |
| title | Custom title content |

## MenuItemGroup API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| title | Group title (a `title` slot is also available) | `string` | — |
| sx | sx quick layout props | `LhSxProps` | — |

### Slots

| Slot | Description |
| --- | --- |
| default | Group content |
| title | Custom group title |

### Accessibility

- The container is `role="menu"` (`role="menubar"` in horizontal mode); leaf items and sub-menu titles are `role="menuitem"`, disabled items carry `aria-disabled`, and sub-menu titles additionally carry `aria-expanded` / `aria-haspopup` / `aria-controls`
- The keyboard follows the APG menu pattern (H5 only): in vertical mode ↑/↓ cycle through visible items (skipping disabled items and items inside collapsed panels), Home/End jump to the ends; Enter/Space activates a leaf item; on a sub-menu title Enter/Space/→ expands it and moves focus into the panel, ←/Esc collapses it
- In horizontal mode the ←/→ semantics are left to each title itself; the root container does not intercept arrow keys

::: tip Platform differences (differences from the Vue3 version)
- **Vertical mode and accordion work on all targets**: vertical mode (inline sub-menu expansion, accordion, controlled v-model / openeds) is implemented with pure CSS plus provide/inject, and behaves identically on H5 and the WeChat Mini Program.
- **Horizontal scrolling**: when the total item width exceeds the container in horizontal mode, scrolling is carried by the container's own `overflow-x` (views support overflow scrolling under WXSS) rather than wrapping content in a `scroll-view` — the latter wraps the slot into an inner `uni-scroll-view-content` layer on H5, which breaks the share scss flex structure on direct children (unlike the lh-tabs horizontal header, menu items are block-level flex and cannot fall back to inline-flex the way tabs do).
- **Fly-out sub-menus ride root-portal**: the fly-out panels of horizontal / collapse mode replace plus's `<teleport to="body">` with `lh-root-portal` (in-page fixed fallback on older base libraries); positioning uses two-frame asynchronous measurement (render hidden to measure → `computePosition` → show, to avoid flicker) — the computation is asynchronous, do not assume a synchronous result; nested levels fly out to the right (`right-start`).
- **Hover is H5-only**: expanding a title on hover only works on H5; the Mini Program has no hover semantics, so fly-out panels are opened / closed by tapping the title, and tapping outside is captured by an in-page transparent mask (equivalent to plus's mouseleave collapse).
- **Keyboard navigation is H5-only**: ↑/↓ / Home / End / Enter / Space / ←/→ / Esc only work on H5; the Mini Program has no keyboard events and the whole block is stripped by conditional compilation (no dead code in the MP bundle).
- **No enter/leave transition**: plus animates with `Transition`; `Transition` is unreliable on MP, so — as with tooltip / select — no transition is bound. Inline panel expansion animation is pure CSS (grid-template-rows 0fr/1fr) and does not listen to transitionend (unreliable on MP); even when the MP transition is unsupported, the final state is still correct.
:::
