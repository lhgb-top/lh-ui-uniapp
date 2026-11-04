# TimePicker

A time picker for hours, minutes and seconds. Clicking the trigger opens a panel: each column (hour / minute / second) is an independently scrolling list, clicking an item moves the selection, and the footer "Now / OK" buttons submit it.

## Basic usage

```vue
<template>
  <lh-time-picker v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

The default `format` is `HH:mm:ss`, so the panel renders three columns (hour / minute / second). Clicking a column item moves the selection immediately (the panel stays open); "OK" commits a `Date` and closes the panel; "Now" fills the columns with the current time.

## Hour and minute format

When `format` has no `ss`, the panel renders only the hour and minute columns, and the placeholder is generated from `format` as well:

```vue
<template>
  <lh-time-picker v-model="value" format="HH:mm" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## Time range

`start` / `end` limit the selectable range of the hour column (intersected with 0~23). An out-of-range stored hour is clamped back into the range, and "Now" is clamped too:

```vue
<template>
  <lh-time-picker v-model="value" :start="8" :end="20" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## Steps

`step-hour` / `step-minute` / `step-second` customize the option step of each column:

```vue
<template>
  <lh-time-picker v-model="value" :step-hour="2" :step-minute="5" :step-second="10" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## Disabled

`disabled` disables the whole picker (the panel does not open and the clear icon is hidden):

```vue
<template>
  <lh-time-picker v-model="value" disabled />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## Placeholder and clearable

`placeholder` overrides the placeholder text (by default it is generated from `format` using the locale keys `timepicker.hour/minute/second`). When a value is set, a clear icon appears on the right of the trigger; clicking it empties the value (`clearable` defaults to `true`):

```vue
<template>
  <lh-time-picker v-model="value" placeholder="Pick a reminder time" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(null)
</script>
```

## TimePicker API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue | Bound time | `Date \| null` | `null` |
| size | Size | `LhTimePickerSize` | `'medium'` |
| disabled | Disable the whole picker | `boolean` | `false` |
| clearable | Show the clear button | `boolean` | `true` |
| placeholder | Placeholder (falls back to a format-derived text using the locale keys `timepicker.hour/minute/second`) | `string` | — |
| format | Time format (the second column appears only when `ss` is present) | `string` | `'HH:mm:ss'` |
| readonly | Read-only flag (the trigger is a self-drawn view with no editable state, so it is effectively always read-only) | `boolean` | `false` |
| arrowControl | Show arrow buttons (rendered on H5 only, for keyboard stepping) | `boolean` | `false` |
| start | Start hour (intersected with 0~23) | `number` | `0` |
| end | End hour (intersected with 0~23) | `number` | `24` |
| stepHour | Hour column step | `number` | `1` |
| stepMinute | Minute column step | `number` | `1` |
| stepSecond | Second column step | `number` | `1` |
| customClass | Custom class name (forwarded to the root node) | `string` | — |
| themeVars | Component-level theme variables | `Record<string, string>` | — |
| sx | Quick layout props (applied to the trigger root; the overlay panel is unaffected) | `LhSxProps` | — |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:modelValue | Fired when the bound value changes | `(value: Date \| null)` |
| change | Fired when "OK" or the clear icon is clicked | `(value: Date \| null)` |

### Accessibility

- The trigger carries `aria-haspopup="dialog"` / `aria-expanded` / `aria-controls` (produced by share's `getTimePickerTriggerAria`, bound key by key)
- The panel is `role="dialog"`; each column is `role="listbox"` (its `aria-label` comes from the locale keys `timepicker.hourLabel/minuteLabel/secondLabel`), and each item is `role="option"` with `aria-selected` / `aria-disabled`
- The positioning engine is a hand-written pure function (flip / shift overflow protection) with zero third-party runtime dependencies

::: tip Platform differences (differences from the Vue3 version)
- **Spinner columns become scroll-view panels**: plus uses `overflow-y: auto` `div` containers, intercepts the wheel with `@wheel.prevent` for stepping, and scrolls the selected item into view with `scrollIntoView`; on uni-app each column is an independent vertical `scroll-view` (`scroll-y`) — the MP `view` has no reliable overflow scrolling — and the selected item is brought into view by `scroll-into-view` (the MP has no `scrollIntoView` API). The selection interaction is unchanged: click an item to move the selection, commit with the footer "Now / OK" buttons.
- **Wheel stepping is not ported**: in-column scrolling is delegated to the native scrolling of `scroll-view` (the wheel naturally scrolls the long list on H5); the wheel event is no longer intercepted to jump by the step. Option generation for steps (`step-hour` and friends) matches plus.
- **Keyboard navigation is H5-only**: the trigger opens the panel with Enter/Space/ArrowDown and moves focus into the first column; inside the panel ↑↓ step by the configured step (the hour wraps and is then clamped back into the start/end range), ←→ move focus across the columns, Enter/Space confirm and close, and Escape closes via a document-level listener (closing only the topmost overlay when several are stacked). The whole block is stripped by conditional compilation, with no dead code in the MP bundle.
- **arrowControl is H5-only**: the arrow buttons depend on keyboard stepping semantics and are not rendered on MP (the template `v-if` is guarded by the compile-time `LH_IS_H5`).
- **Outside-click closing**: plus listens to document clicks; uni-app uses an in-page transparent mask (clicking the mask closes without emitting change).
- **Self-drawn trigger**: the plus trigger is an editable `<input>`; on uni-app the trigger is self-drawn with `<view>` + `<text>` (the MP has no focus semantics inside the trigger, the placeholder color comes from a modifier class, and `readonly` is therefore effectively always on).
- **Trigger icon**: plus uses the `date` icon; this library uses the more fitting `clock` icon.
- **No enter/leave transition**: `Transition` is unreliable on MP — the panel simply shows and hides, consistent with tooltip / dropdown / popover / cascader.
:::
