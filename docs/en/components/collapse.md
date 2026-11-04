# Collapse

Collapse / expand content blocks. Panels can coexist, or run in accordion mode (only one open at a time).

## Basic usage

Without `v-model` the component is uncontrolled: it manages the expanded state itself. Click the header bar to toggle; the `change` event carries the latest expanded panels.

```vue
<template>
  <lh-collapse>
    <lh-collapse-item
      name="a"
      title="Consistency"
    >
      Keep the visual and interaction consistent with the rest of the page.
    </lh-collapse-item>
    <lh-collapse-item
      name="b"
      title="Feedback"
    >
      Give clear and timely feedback after every action.
    </lh-collapse-item>
  </lh-collapse>
</template>
```

## Accordion

In `accordion` mode at most one panel is open at a time; clicking an open panel collapses everything.

```vue
<template>
  <lh-collapse accordion>
    <lh-collapse-item
      name="a"
      title="Only one open"
    >
      At most one panel is open at a time.
    </lh-collapse-item>
    <lh-collapse-item
      name="b"
      title="Click again to collapse"
    >
      All panels can be collapsed.
    </lh-collapse-item>
  </lh-collapse>
</template>
```

## Controlled v-model and disabled panels

Bind the expanded panels with `v-model` (a single value or an array; in accordion mode usually a single value); `disabled` disables a single panel.

```vue
<template>
  <lh-collapse v-model="activeNames">
    <lh-collapse-item
      name="a"
      title="Panel A"
    >
      Controlled content A
    </lh-collapse-item>
    <lh-collapse-item
      name="b"
      title="Panel B (disabled)"
      disabled
    >
      Disabled content
    </lh-collapse-item>
    <lh-collapse-item
      name="c"
      title="Panel C"
    >
      Controlled content C
    </lh-collapse-item>
  </lh-collapse>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const activeNames = ref(['a'])
</script>
```

## Collapse Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue | Active panels (controlled v-model, single value or array) | `LhCollapseKey \| LhCollapseKey[]` | — |
| accordion | Accordion mode: only one panel open at a time | `boolean` | `false` |
| customClass | Custom class name (forwarded to the root node) | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## CollapseItem Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| name | Unique panel identifier (required) | `string \| number` | — |
| title | Panel title (a `title` slot is also available) | `string` | — |
| disabled | Whether the panel is disabled | `boolean` | `false` |
| customClass | Custom class name (forwarded to the item root node) | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| update:modelValue | Expanded panels changed (controlled v-model; the component keeps no internal state) | `(value: LhCollapseKey \| LhCollapseKey[])` |
| change | Expanded panels changed (uncontrolled; a single value in accordion mode, `undefined` when all collapsed) | `(value: LhCollapseKey \| LhCollapseKey[])` |

## Slots

| Slot | Description |
| --- | --- |
| Collapse default | Panel item nodes (`lh-collapse-item`) |
| CollapseItem default | Panel content |
| CollapseItem title | Panel title (overrides the `title` prop) |

## Platform differences

- **The expand / collapse animation is pure CSS**: `grid-template-rows` transitions between `0fr / 1fr` and the arrow rotates via `transform`. Nothing listens to `transitionend` (it is unreliable on WeChat Mini Program, so this library never depends on it). The class switch lands immediately: even if a Mini Program rendering engine does not support grid transitions, the final expanded state is still correct — only the transition is missing.
- **The content is always rendered** (no `v-if` shortcut): `lh-collapse__wrap` is shown by the `--active` class. If you need content rendered only when expanded, control it yourself with `v-if` on the content side.
- `<h3>` / `<button>` are replaced with `<view>` / `<text>` (WXSS forbids tag selectors); disabled state no longer relies on a native `<button disabled>` — it is expressed by a click guard + the `--disabled` class + `aria-disabled`.
- Accessibility semantics are output on both platforms: the header has `role="button"` + `aria-expanded` / `aria-controls`, the content region has `role="region"` + `aria-labelledby`. Mini Program screen-reader support depends on the platform. On H5, Enter / Space naturally activate the focused header.
- The header / content `id`s are locally unique via `generateId` (not Vue 3.5's `useId`, for compatibility with uni-app's Vue kernels), so multiple collapse groups on one page never clash.
- **Porting decision (aligned with the Vue 3 version, no invented APIs)**: the port strictly follows the plus source of truth and provides only `v-model` (single value / array), `accordion`, panel `name` / `title` / `disabled` and the `title` slot. Nested collapses, icon slots, lazy rendering and the like do not exist in the source of truth and were deliberately not added; they will follow once the source of truth provides them.
- One controlled-state fix lives in this repo's glue layer (recorded in the changeset): when controlled, the expanded state is a computed over `props.modelValue`, so panels follow an asynchronously updated v-model immediately. The core pure functions and the props contract are identical to plus.
