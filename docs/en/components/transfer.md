# Transfer

Two-panel list with checkbox-driven moves. Partitioning, filtering, check-all and move logic is
consumed entirely from the `@lh-ui/share` core pure functions (`partitionTransferData` /
`filterTransferItems` / `toggleTransferCheckAll` / `moveTransferKeys` and friends); the component
layer only handles rendering, events and keyboard navigation. Both panels are
`role="listbox"` (APG listbox pattern).

## Basic usage

```vue
<template>
  <lh-transfer v-model="source" :data="items" @change="onChange" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhTransferItem } from '@lh-ui/share/core/transfer'

const source = ref<Array<string | number>>(['a'])
const items: LhTransferItem[] = [
  { key: 'a', label: 'A' },
  { key: 'b', label: 'B' },
  { key: 'c', label: 'C', disabled: true },
  { key: 'd', label: 'D' },
]

function onChange(keys: Array<string | number>, direction: 'left-to-right' | 'right-to-left') {
  console.log(keys, direction)
}
</script>
```

`v-model` carries the left (source) key list: keys present in `modelValue` render in the left
column, everything else in the right. Check any item, press the › / ‹ buttons in the middle to
move it, and `update:modelValue` and `change` (with the direction `'left-to-right'` /
`'right-to-left'`) fire afterwards; the checked set is cleared after each move.

Each panel has a search box at the top (always on, matching the Vue3 version) that filters
case-insensitively by label; the panel header shows a "current side count / total count" and a
check-all box (the partial state is carried by `indeterminate`).

`data` is a `LhTransferItem[]`: `key` is unique, `label` the display text (falls back to the key
when missing), and `disabled` disables an item (not checkable, not selectable by check-all, not
movable).

## Disabled

`disabled` disables the whole transfer: checking, check-all, searching and moving are all
suppressed.

```vue
<template>
  <lh-transfer v-model="source" :data="items" disabled />
</template>
```

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| data | Full data set | `LhTransferItem[]` | — |
| modelValue | Left (source) key list (controlled, v-model) | `Array<string \| number>` | `[]` |
| disabled | Disable | `boolean` | `false` |
| sx | sx quick layout props | `LhSxProps` | — |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:modelValue | Left (source) key list changed (for v-model) | `(keys: Array<string \| number>)` |
| change | Fired after a move completes | `(keys: Array<string \| number>, direction: 'left-to-right' \| 'right-to-left')` |

### LhTransferItem

| Field | Description | Type |
| --- | --- | --- |
| key | Unique key | `string \| number` |
| label | Display text (falls back to the key when missing) | `string` |
| disabled | Disabled (not checkable / not selected by check-all / not movable) | `boolean` |

### Accessibility

- Both panels are `role="listbox"` + `aria-multiselectable`; items are `role="option"` with
  `aria-selected` / `aria-disabled`
- Each panel has its own search box with an `aria-label`; the move buttons carry `aria-label`s
  ("Move right" / "Move left")
- The check-all box carries the partial state through `indeterminate`; disabled items are
  suppressed everywhere (checking, check-all, moving)

::: tip Platform differences (differences from the Vue3 version)
- **The API scope stays strictly aligned with the Vue3 source**: only what the Vue3 version
  offers is provided here — `data` / `modelValue` / `disabled` / `sx`. Capabilities that other
  libraries commonly ship but the Vue3 source lacks — `titles` (panel titles), `filterable`
  (a search toggle), `props` (custom field names), `left/right-default-checked` (default
  checked keys) — were deliberately not added; the panel titles come from share locale keys
  `transfer.sourceTitle` / `transfer.targetTitle` (available in ten languages) and the search
  box keeps the Vue3 always-on shape (no toggle).
- **Both lists are carried by scroll-view**: the Vue3 `<ul>` / `<li>` lists become
  `<scroll-view scroll-y>` + `<view>` here (a plain `view` cannot overflow-scroll reliably on
  the Mini Program), behaving identically on H5 and WeChat Mini Program; the list styling still
  comes from share's `.lh-transfer-panel__list`.
- **Button moves work on every target**: the › / ‹ move buttons are the built-in `<button>`,
  clickable on both H5 and the Mini Program — no platform difference there; the disabled state
  is carried by the `disabled` attribute.
- **Keyboard navigation is H5-only**: the APG listbox pattern keys — ↑/↓ within the filtered
  list (skipping disabled items, no looping), Enter / Space to check the focused item,
  ←/→ to move focus between panels, Escape to reset focus — only work on H5; the Mini Program
  has no keyboard events and the whole block is stripped by conditional compilation (no dead
  code in the MP bundle), and roving tabindex is likewise only produced on H5.
- **Check boxes are self-drawn**: the check-all and per-item boxes do not use a native
  `<input type="checkbox">` (its style is uncontrollable on the Mini Program); they use this
  package's `lh-checkbox` (view-drawn + lh-icon) instead. The state is still written by the
  component in a controlled way, so the semantics are unchanged.
:::
