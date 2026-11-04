# Popconfirm

A lightweight inline confirmation bubble anchored to its trigger — no dialog required. The semantics are blocking (`role="alertdialog"`): Escape counts as cancel. The confirm content is passed through the `content` slot or the `title` prop, and the trigger is wrapped in the default slot.

## Basic usage

```vue
<template>
  <lh-popconfirm title="Delete this record?" @confirm="onConfirm" @cancel="onCancel">
    <lh-button type="danger">Delete</lh-button>
  </lh-popconfirm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const action = ref('')
function onConfirm() {
  action.value = 'confirmed'
}
function onCancel() {
  action.value = 'cancelled'
}
</script>
```

::: warning The Mini Program has no hover / focus semantics
`trigger` defaults to `click` (available on all targets). `hover` / `focus` are H5-only — on the Mini Program target they degrade to tap / touch toggling (first tap opens, second tap closes).
:::

## Three tones

`type` picks the tone icon and modifier class: `info` / `warning` (default) / `danger`.

```vue
<template>
  <lh-popconfirm type="info" title="View the access log of this record?">
    <lh-button>Info</lh-button>
  </lh-popconfirm>
  <lh-popconfirm type="warning" title="This action will notify all members.">
    <lh-button type="warning">Warning</lh-button>
  </lh-popconfirm>
  <lh-popconfirm type="danger" title="This cannot be undone.">
    <lh-button type="danger">Danger</lh-button>
  </lh-popconfirm>
</template>
```

## Custom texts and placement

```vue
<template>
  <lh-popconfirm
    title="Archived records can be restored from the recycle bin."
    confirm-text="Archive"
    cancel-text="Let me think"
    placement="right"
  >
    <lh-button>Custom texts</lh-button>
  </lh-popconfirm>

  <!-- Hover trigger (H5 only; degrades to tap toggle on the Mini Program) -->
  <lh-popconfirm title="Hover to confirm." trigger="hover" :show-after="0" placement="bottom">
    <lh-button>Hover trigger</lh-button>
  </lh-popconfirm>
</template>
```

> The button texts default to the locale keys `popconfirm.confirm` / `popconfirm.cancel` and can be overridden with `confirm-text` / `cancel-text`.

## Controlled visibility and icon

```vue
<template>
  <!-- Controlled: visibility is fully driven by the external v-model:visible -->
  <lh-popconfirm v-model:visible="pcVisible" trigger="manual" title="Controlled bubble">
    <lh-button @click="pcVisible = !pcVisible">{{ pcVisible ? 'Collapse' : 'Expand' }}</lh-button>
  </lh-popconfirm>

  <!-- Icon switch and confirm button type -->
  <lh-popconfirm title="Delete this record?" :show-icon="false" confirm-button-type="primary">
    <lh-button type="danger">No icon</lh-button>
  </lh-popconfirm>

  <!-- Disabled -->
  <lh-popconfirm title="This action is unavailable." disabled>
    <lh-button disabled>Disabled</lh-button>
  </lh-popconfirm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const pcVisible = ref(false)
</script>
```

## Popconfirm API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| type | Confirmation tone: `info` / `warning` / `danger` | `'info' \| 'warning' \| 'danger'` | `'warning'` |
| placement | Overlay position (12 positions) | `LhPopconfirmPlacement` | `'top'` |
| trigger | Trigger method: `click` (all targets) / `hover`, `focus` (H5 only, degrades to tap on MP) / `manual` (controlled) | `'click' \| 'hover' \| 'focus' \| 'manual'` | `'click'` |
| title | Confirm content (also available as the content slot) | `string` | — |
| confirmText | Confirm button text (falls back to the locale key popconfirm.confirm) | `string` | — |
| cancelText | Cancel button text (falls back to the locale key popconfirm.cancel) | `string` | — |
| confirmButtonType | Confirm button type | `'default' \| 'primary'` | `'primary'` |
| visible | Manually controlled visibility (v-model:visible) | `boolean` | — |
| disabled | Disabled | `boolean` | `false` |
| showIcon | Whether to show the tone icon | `boolean` | `true` |
| popperClass | Custom class name for the overlay | `string` | — |
| showAfter | Show delay (ms, only for hover / focus on H5) | `number` | — |
| hideAfter | Hide delay (ms, only for hover / focus on H5) | `number` | — |
| themeVars | Component-level theme variables | `Record<string, string>` | — |
| bgPattern | Component-level background pattern, overrides ConfigProvider | `string` | — |
| sx | Quick layout props (applied to the trigger root element) | `LhSxProps` | — |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| confirm | Fired after the confirm button is clicked | — |
| cancel | Fired after the cancel button is clicked or Escape is pressed | — |
| update:visible | Visibility changed (v-model) | `(value: boolean)` |
| show | Fired after shown | — |
| hide | Fired after hidden | — |

### Slots

| Slot | Description |
| --- | --- |
| default | Trigger content |
| content | Custom confirm content |

### Methods

| Method | Description |
| --- | --- |
| show | Show programmatically |
| hide | Hide programmatically |
| toggle | Toggle programmatically |

### Accessibility

- The overlay is `role="alertdialog"` + `aria-modal="true"`; the confirm content is linked via `aria-labelledby`; the trigger carries `aria-haspopup` / `aria-expanded` / `aria-controls` (the attribute pack is produced by share pure functions)
- Escape counts as cancel (aligned with the WAI-ARIA alertdialog pattern: Escape closes and counts as dismissal); when several overlays are stacked Esc closes only the topmost one (H5 only)
- Clicking the cancel button or the transparent mask outside the confirm buttons both dismiss the bubble; the tone icon is decorative (`aria-hidden`)
- The positioning engine is a hand-written pure function (flip / shift overflow protection) with zero third-party runtime dependencies

::: tip Platform differences (differences from the Vue3 version)
- **Trigger methods**: the Mini Program has no hover / focus semantics, so `trigger="hover"` / `trigger="focus"` degrade to tap/touch toggling on MP; the `showAfter` / `hideAfter` delays only apply to the hover / focus modes on H5, while `click` and `manual` respond immediately.
- **Overlay carrier and positioning**: no `teleportTarget` prop — the Mini Program has no DOM teleport, so the popover is carried by `root-portal` (in-page fixed fallback on older base libraries); popper positioning uses two-frame asynchronous measurement (render hidden to measure → `computePosition` → show, to avoid flicker). The computation is asynchronous; do not assume a synchronous result. The arrow offset is written to `--lh-arrow-offset` by the component glue from the positioning result's `arrowOffset`.
- **Keyboard behavior is H5-only**: Esc-as-cancel uses a document-level listener (closing only the topmost overlay when several are stacked); the Mini Program has no keyboard events and the whole block is stripped by conditional compilation.
- **No focus trap**: plus moves focus to the confirm button on open, lets Tab cycle between the two actions inside a focus-trap and restores focus on close; the MP has no keyboard focus semantics, so like this repo's Dialog / Popover it is not ported at all.
- **No enter/leave transition**: plus animates with `Transition` (`lh-popconfirm-fade`); `Transition` is unreliable on MP, and like tooltip / dropdown / popover no transition is bound.
- **No auto-close when the trigger scrolls out of the viewport**: plus's `useLhPopper` has a scroll-out callback; uni-app has no unified scroll/resize channel, so it is not ported.
- **aria-haspopup value**: plus hardcodes `aria-haspopup="dialog"` in its template; this repo produces the trigger attribute pack from share's `getPopconfirmTriggerAria` (value `'true'`), and the contract follows the share pure function.
:::
