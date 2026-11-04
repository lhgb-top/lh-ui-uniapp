# Popover

A rich-content popover: carries more than a Tooltip (title, body, interactive nodes). The trigger is wrapped in the default slot and the popover content is passed through the `content` slot; the overlay is `role="dialog"` with an arrow always pointing at the trigger.

## Basic usage

```vue
<template>
  <lh-popover title="Ink tip" placement="top">
    <lh-button>Click to pop up</lh-button>
    <template #content>
      <text>This is rich content; any node can be placed here.</text>
    </template>
  </lh-popover>
</template>
```

::: warning The Mini Program has no hover / focus semantics
`trigger` defaults to `click` (available on all targets). `hover` / `focus` are H5-only — on the Mini Program target they degrade to tap / touch toggling (first tap opens, second tap closes).
:::

## Trigger methods

```vue
<template>
  <!-- Hover trigger (H5 only; degrades to tap toggle on the Mini Program) -->
  <lh-popover trigger="hover" title="Hover trigger">
    <lh-button>Hover me</lh-button>
    <template #content><text>Moving the pointer into the popover does not close it.</text></template>
  </lh-popover>

  <!-- Focus trigger (H5 only) -->
  <lh-popover trigger="focus" title="Focus trigger">
    <lh-input placeholder="Focus the input" />
    <template #content><text>Shows when the input gains focus.</text></template>
  </lh-popover>

  <!-- Manual: visibility is fully controlled by the external v-model:visible -->
  <lh-popover v-model:visible="manualVisible" trigger="manual" title="Manual control">
    <lh-button @click="manualVisible = !manualVisible">External switch</lh-button>
    <template #content><text>Visibility is fully controlled by the external state.</text></template>
  </lh-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const manualVisible = ref(false)
</script>
```

> The `showAfter` / `hideAfter` delays only apply to hover / focus (H5); `click` and `manual` respond immediately.

## Twelve placements

```vue
<template>
  <lh-popover
    v-for="p in placements"
    :key="p"
    :placement="p"
    :title="p"
  >
    <lh-button size="small">{{ p }}</lh-button>
    <template #content><text>Placement: {{ p }}</text></template>
  </lh-popover>
</template>

<script setup lang="ts">
const placements = [
  'top', 'top-start', 'top-end',
  'bottom', 'bottom-start', 'bottom-end',
  'left', 'left-start', 'left-end',
  'right', 'right-start', 'right-end',
] as const
</script>
```

> When the viewport lacks space the popover flips automatically (flip) and is clamped back on the cross axis (shift); the arrow position switches accordingly.

## Width, arrow and disabled

```vue
<template>
  <!-- Fixed width -->
  <lh-popover title="Fixed width" width="240">
    <lh-button>Fixed width</lh-button>
    <template #content><text>The popover width is set via width.</text></template>
  </lh-popover>

  <!-- No arrow -->
  <lh-popover title="No arrow" :arrow="false">
    <lh-button>No arrow</lh-button>
    <template #content><text>When arrow is false no pointing arrow is rendered.</text></template>
  </lh-popover>

  <!-- Disabled -->
  <lh-popover title="Disabled" disabled>
    <lh-button disabled>Disabled trigger</lh-button>
    <template #content><text>When disabled neither the trigger nor the popover responds.</text></template>
  </lh-popover>
</template>
```

## Popover API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| placement | Overlay position (12 positions) | `LhPopoverPlacement` | `'top'` |
| trigger | Trigger method: `click` (all targets) / `hover`, `focus` (H5 only, degrades to tap on MP) / `manual` (controlled) | `'click' \| 'hover' \| 'focus' \| 'manual'` | `'click'` |
| title | Title (also available as the title slot) | `string` | — |
| visible | Manually controlled visibility (v-model:visible) | `boolean` | — |
| disabled | Disabled | `boolean` | `false` |
| arrow | Whether to show the arrow | `boolean` | `true` |
| width | Popover width (numbers are px) | `string \| number` | — |
| popperClass | Custom class name for the overlay | `string` | — |
| showAfter | Show delay (ms, only for hover / focus on H5) | `number` | — |
| hideAfter | Hide delay (ms, only for hover / focus on H5) | `number` | — |
| themeVars | Component-level theme variables | `Record<string, string>` | — |
| bgPattern | Component-level background pattern, overrides ConfigProvider | `string` | — |
| sx | Quick layout props (applied to the trigger root element) | `LhSxProps` | — |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:visible | Visibility changed (v-model) | `(value: boolean)` |
| show | Fired after shown | — |
| hide | Fired after hidden | — |

### Slots

| Slot | Description |
| --- | --- |
| default | Trigger content |
| title | Custom title |
| content | Popover content |

### Methods

| Method | Description |
| --- | --- |
| show | Show programmatically |
| hide | Hide programmatically |
| toggle | Toggle programmatically |

### Accessibility

- The trigger carries `aria-haspopup="true"` plus `aria-expanded` / `aria-controls`; the popover is `role="dialog"` and, when titled, linked via `aria-labelledby`
- Esc closes, clicking outside the popover (in-page transparent mask) closes; when several overlays are stacked Esc closes only the topmost one (all H5 only)
- The positioning engine is a hand-written pure function (flip / shift overflow protection) with zero third-party runtime dependencies

::: tip Platform differences (differences from the Vue3 version)
- **Trigger methods**: the Mini Program has no hover / focus semantics, so `trigger="hover"` / `trigger="focus"` degrade to tap/touch toggling on MP; the `showAfter` / `hideAfter` delays only apply to the hover / focus modes on H5, while `click` and `manual` respond immediately.
- **Overlay carrier and positioning**: no `teleportTarget` prop — the Mini Program has no DOM teleport, so the popover is carried by `root-portal` (in-page fixed fallback on older base libraries); popper positioning uses two-frame asynchronous measurement (render hidden to measure → `computePosition` → show, to avoid flicker). The computation is asynchronous; do not assume a synchronous result. The arrow offset is written to `--lh-arrow-offset` by the component glue from the positioning result's `arrowOffset`.
- **Keyboard behavior is H5-only**: Esc closing uses a document-level listener (closing only the topmost overlay when several are stacked); the Mini Program has no keyboard events and the whole block is stripped by conditional compilation.
- **No focus trap**: plus's click trigger traps focus inside the popover (focus-trap) and restores it on close; the MP has no keyboard focus semantics, so like this repo's Dialog it is not ported at all.
- **No enter/leave transition**: plus animates with `Transition`; `Transition` is unreliable on MP, and like tooltip / dropdown no transition is bound.
- **No auto-close when the trigger scrolls out of the viewport**: plus's `useLhPopper` has a scroll-out callback; uni-app has no unified scroll/resize channel, so it is not ported.
:::
