# Dropdown

A command menu that pops downward. The trigger can be any element; menu items are identified by `command` and reported via the `command` event when clicked.

## Basic usage

```vue
<template>
  <lh-dropdown @command="onCommand">
    <lh-button>{{ selectedLabel || 'More actions' }} ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="new">New</lh-dropdown-item>
      <lh-dropdown-item command="edit">Edit</lh-dropdown-item>
      <lh-dropdown-item command="delete">Delete</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const lastCommand = ref('')
// The trigger text is maintained by the consumer: the command event only reports the command value,
// deciding what label to display is left to the outside
const labelMap: Record<string, string> = { new: 'New', edit: 'Edit', delete: 'Delete' }
const selectedLabel = ref('')
function onCommand(command: string | number | undefined) {
  lastCommand.value = String(command)
  selectedLabel.value = labelMap[String(command)] ?? String(command)
}
</script>
```

## Trigger methods

Defaults to `click`; hover and long-press are also available.

```vue
<template>
  <!-- Hover trigger (H5 only; degrades to tap toggle on the Mini Program) -->
  <lh-dropdown trigger="hover" @command="onHoverCommand">
    <lh-button>Hover trigger ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="ink">Ink</lh-dropdown-item>
      <lh-dropdown-item command="danqing">Painting</lh-dropdown-item>
    </template>
  </lh-dropdown>

  <!-- Right-click / long-press trigger -->
  <lh-dropdown trigger="contextmenu" @command="onContextCommand">
    <lh-button>Long-press trigger ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="refresh">Refresh</lh-dropdown-item>
      <lh-dropdown-item command="copy">Copy</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>
```

## Disabled and divided items

```vue
<template>
  <!-- Action menu with disabled and divided items -->
  <lh-dropdown @command="onActionCommand">
    <lh-button>Actions ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="export">Export</lh-dropdown-item>
      <lh-dropdown-item command="import">Import</lh-dropdown-item>
      <lh-dropdown-item divided command="audit">Audit log</lh-dropdown-item>
      <lh-dropdown-item disabled command="purge">Purge data</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>
```

> Disabled items carry `aria-disabled="true"` so screen readers can announce them; arrow keys skip them, and clicks or Enter/Space do not fire `command`.

## Placement and max height

```vue
<template>
  <!-- Bottom-right aligned with a limited max height (scrolls when exceeded) -->
  <lh-dropdown placement="bottom-end" :max-height="160" @command="onItemCommand">
    <lh-button>Bottom end ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item v-for="i in 12" :key="i" :command="i">Item {{ i }}</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>
```

## Controlled visibility and click behavior

`v-model:visible` controls visibility manually; `hide-on-click` decides whether the menu closes after a selection; `popper-class` adds a custom class to the overlay.

```vue
<template>
  <!-- Controlled visibility: stays open after a selection -->
  <lh-dropdown v-model:visible="menuVisible" :hide-on-click="false" popper-class="demo-menu">
    <lh-button>{{ menuVisible ? 'Collapse' : 'Expand' }} ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="copy">Copy (does not close)</lh-dropdown-item>
      <lh-dropdown-item command="paste">Paste</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const menuVisible = ref(false)
</script>
```

## Dropdown API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| trigger | Trigger method: `click` (all targets) / `hover` (H5 only, degrades to tap on MP) / `contextmenu` (carried by long-press) | `'hover' \| 'click' \| 'contextmenu'` | `'click'` |
| placement | Overlay position (12 positions) | `LhDropdownPlacement` | `'bottom-start'` |
| visible | Visibility state (v-model:visible) | `boolean` | — |
| disabled | Disable the trigger | `boolean` | `false` |
| hideOnClick | Whether to close after clicking a menu item | `boolean` | `true` |
| popperClass | Custom class name for the overlay | `string` | — |
| maxHeight | Menu max height (numbers are px) | `string \| number` | — |
| themeVars | Component-level theme variables | `Record<string, string>` | — |
| bgPattern | Component-level background pattern, overrides ConfigProvider | `string` | — |
| sx | Quick layout props (applied to the trigger root element) | `LhSxProps` | — |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| command | Fired when a menu item is clicked | `(command: string \| number \| undefined)` |
| visible-change | Visibility changed | `(value: boolean)` |
| update:visible | Visibility changed (v-model) | `(value: boolean)` |

### Slots

| Slot | Description |
| --- | --- |
| default | Trigger content |
| dropdown | Menu content (`LhDropdownItem` list) |

### Methods

| Method | Description |
| --- | --- |
| show | Open programmatically |
| hide | Close programmatically |
| toggle | Toggle programmatically |

## DropdownItem API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| command | Command identifier, reported with the `command` event on click | `string \| number` | — |
| disabled | Disabled | `boolean` | `false` |
| divided | Show a divider above the item | `boolean` | `false` |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| click | Fired when the menu item is clicked (not for disabled items) | `(command: string \| number \| undefined)` |

### Accessibility

- The trigger carries `aria-haspopup="menu"` plus `aria-expanded` / `aria-controls`; the menu is `role="menu"`, items are `role="menuitem"`
- Keyboard follows the APG menu pattern (H5 only): ↑/↓ cycle (skipping disabled items), Home/End jump to the ends, Enter/Space fire `command` and close, Esc closes and restores focus
- Main-axis overflow flips the menu automatically; cross-axis overflow is clamped back into the viewport

::: tip Platform differences (differences from the Vue3 version)
- **Trigger methods**: the Mini Program has no hover semantics, so `trigger="hover"` degrades to tap/touch toggling on MP; there is no right-click, so `trigger="contextmenu"` is carried by long-press (`longpress`) on both targets (H5 included, without preventing the native context menu — plus calls `preventDefault`).
- **Overlay carrier and positioning**: no `teleportTarget` prop — the Mini Program has no DOM teleport, so the overlay is carried by `root-portal` (in-page fixed fallback on older base libraries); positioning uses two-frame asynchronous measurement (render hidden to measure → `computePosition` → show, to avoid flicker). The computation is asynchronous; do not assume a synchronous result.
- **Keyboard navigation is H5-only**: arrow keys / Home / End / Enter / Space / Esc only work on H5 (Esc uses a document-level listener and closes only the topmost overlay when several are stacked); the Mini Program has no keyboard events and the whole block is stripped by conditional compilation.
- **Click-outside closing** is carried by an in-page transparent mask (equivalent to plus's document-level click-outside listener).
- **No enter/leave transition**: plus animates with `Transition`; `Transition` is unreliable on MP, and like tooltip / select no transition is bound.
- **No auto-close when the trigger scrolls out of the viewport**: plus's `useLhPopper` has a scroll-out callback; uni-app has no unified scroll/resize channel, so it is not ported.
:::
