# DatePicker

A date picker: tap the trigger box to open a calendar panel supporting date / month / year selection modes, a custom display format, and range-value echoing. The calendar grid, date formatting and disabled checks are all share pure functions, and the panel is a self-drawn `view` grid — H5 and the WeChat Mini Program render it identically.

## Value type contract

The bound value is **always a `Date` object** (a range is a `[Date, Date]` tuple); the component accepts neither ISO date strings nor emits them:

```vue
<template>
  <lh-date-picker v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
// ✅ Correct: a Date object
const value = ref<Date | null>(new Date(2026, 10, 3))
// ❌ Wrong: '2026-11-03' is neither echoed nor parsed
</script>
```

The `format` prop only affects **display in the trigger and the panel** (fixed-width tokens `yyyy` / `MM` / `dd` / `HH` / `mm` / `ss`); it never changes the bound value. You receive a `Date` — call `formatDate` or `toISOString()` yourself when you need an ISO string for storage.

## Basic usage

```vue
<template>
  <lh-date-picker v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3))
</script>
```

In date mode tapping a day only **stages** it; tap “OK” in the footer to commit (two-step submit, same as the Vue3 version). The “Today” button jumps the panel back to the current month and stages today.

## Month and year modes

With `mode="month"` / `mode="year"` the panel opens directly on the matching grid, and tapping a cell selects and closes immediately (no footer buttons). In date mode tapping the panel title drills down level by level: date → month → year, and tapping the title in the year view goes back to months.

```vue
<template>
  <lh-date-picker v-model="month" mode="month" />
  <lh-date-picker v-model="year" mode="year" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const month = ref<Date | null>(new Date(2026, 5, 1))
const year = ref<Date | null>(new Date(2024, 0, 1))
</script>
```

## Date formatting

```vue
<template>
  <lh-date-picker v-model="value" format="MM/dd/yyyy" />
  <lh-date-picker v-model="value" format="yyyy/MM/dd" />
</template>
```

Without `placeholder`, the placeholder is derived from `format` (`yyyy` → locale “year”, `MM` → “month”, `dd` → “day”).

## Disabled and readonly

```vue
<template>
  <lh-date-picker v-model="value" disabled />
  <lh-date-picker :model-value="value" readonly />
</template>
```

`disabled` disables the whole picker (no panel on tap); `readonly` allows programmatic values but never opens the panel.

## Sizes and clearing

```vue
<template>
  <lh-date-picker v-model="value" size="small" />
  <lh-date-picker v-model="value" size="medium" />
  <lh-date-picker v-model="value" size="large" />
  <lh-date-picker v-model="value" :clearable="false" />
</template>
```

`size` falls back to the ConfigProvider global size, then to `medium`. `clearable` defaults to on and shows a clear icon on the right of the trigger.

## Range value echoing

When the bound value is `[Date, Date]`, the trigger echoes both ends joined by `range-separator` (default `~`):

```vue
<template>
  <lh-date-picker v-model="span" range-separator=" to " />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const span = ref<[Date, Date]>([new Date(2026, 10, 1), new Date(2026, 10, 7)])
</script>
```

::: warning Range / datetime selection UI is not implemented yet
Like the Vue3 version, `mode="datetime"` and range selection are **type reservations only — no selection UI exists** (time columns and the range panel are not implemented, family backlog P-08). A range value is echoed, but tapping “OK” inside the panel never overwrites an already-bound range with a single `Date`.
:::

## Cell and panel customization

```vue
<template>
  <lh-date-picker v-model="value" :cell-class-name="cellClassName" popper-class="my-popper" />
</template>

<script setup lang="ts">
const cellClassName = (date: Date) => (date.getDay() === 0 || date.getDay() === 6 ? 'my-weekend' : '')
</script>
```

`cell-class-name` appends a custom class per day (empty return values are skipped); `popper-class` is forwarded to the panel root for panel-level styling.

## DatePicker API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue | Bound value (Date / range tuple / null; **no ISO strings**) | `Date \| [Date, Date] \| null` | `null` |
| mode | Selection mode | `'date' \| 'month' \| 'year' \| 'datetime' \| 'range'` | `'date'` |
| size | Size (falls back to the ConfigProvider global size, then medium) | `'small' \| 'medium' \| 'large' \| 'mini' \| 'x-large'` | `'medium'` |
| disabled | Disable the whole picker | `boolean` | `false` |
| clearable | Show the clear button | `boolean` | `true` |
| placeholder | Placeholder (derived from format when omitted) | `string` | `''` |
| format | Display format (fixed-width tokens, display only) | `string` | `'yyyy-MM-dd'` |
| readonly | Readonly (never opens the panel) | `boolean` | `true` |
| rangeSeparator | Range separator (joins range echo) | `string` | `'~'` |
| cellClassName | Day-cell custom class callback | `(date: Date) => string` | — |
| popperClass | Panel custom class | `string` | — |
| customClass | Root node custom class | `string` | — |
| themeVars | Component-level theme variables, overriding ConfigProvider | `Record<string, string>` | — |
| sx | Quick layout props (root node; the floating panel is unaffected) | `LhSxProps` | — |

::: tip mode values
`'datetime'` and `'range'` are **type reservations**: `LhDatePickerMode` (share core) includes them, but the time columns and the range panel are not implemented (backlog P-08) — please only use `'date'` / `'month'` / `'year'` for now.
:::

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:modelValue | Value changed (v-model) | `(value: Date \| [Date, Date] \| null)` |
| change | Value confirmed (same payload as update:modelValue) | `(value: Date \| [Date, Date] \| null)` |

### Accessibility

- The trigger is `role="combobox"` (`aria-expanded` / `aria-haspopup="dialog"` / `aria-controls` pointing at the panel); the attribute pack comes from share’s `getDatePickerTriggerAria`
- The panel is `role="dialog"`; the calendar is `role="grid"` with `role="gridcell"` day cells carrying `aria-selected` / `aria-current="date"` (today) / `aria-disabled`
- Each day cell’s `aria-label` is a full “YYYY, month M, day D, weekday X” string for screen readers
- The nav buttons are `role="button"` + `aria-label` (locale keys `datepicker.prevMonth` / `datepicker.nextMonth`)
- Keyboard grid navigation and trigger keyboard behavior are H5-only — see the platform differences below

::: tip Platform differences (differences from the Vue3 version)
- **Panel-based selection**: the Vue3 calendar panel is already panel-based (not a scroll-wheel picker) and this port keeps that interaction; the floating layer is carried by `lh-root-portal` instead of `Teleport to="body"` (with an in-page fixed fallback for older versions), positioned via two-frame asynchronous measurement (render hidden → measure → `computePosition` → show, no flicker), and enter/leave transitions are not wired.
- **Element mapping**: the `<div>` / `<button>` / `<input>` from plus are all replaced with `<view>`; the trigger echo and placeholder are self-drawn `<text>` nodes (MP does not support `::placeholder`; the placeholder color is supplied by an inline modifier class with the same token), and disabled states for nav / today / OK buttons are carried by classes (a `view` has no `:disabled` pseudo-class).
- **Click-outside closing**: plus listens to a document-level click; this port closes on a transparent in-page mask instead (equivalent semantics — MP has no document), and a mask tap only closes, it never emits change.
- **Keyboard navigation is H5-only**: trigger Enter / Space, grid arrow moves (including month flips) / Home / End / PageUp / PageDown, the roving tabindex and Escape closing the topmost overlay have no keyboard events on MP, so the guarded code is never called — the MP bundle contains no dead code.
- **aria attributes are bound one by one**: the share `LhAriaAttrs` pack cannot be spread with `v-bind` (the MP template compiler does not support it), so the glue layer expands the `aria-*` keys into explicit bindings; the contract is still decided by share pure functions.
- **Value type contract**: identical to plus — the bound value is `Date` / `[Date, Date]`, never an ISO date string in either direction; `format` only affects the display layer.
:::
