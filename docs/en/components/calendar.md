# Calendar

A monthly date grid supporting three selection modes — single, range (start & end) and multiple — plus an optional `range` constraint. All copy (weekday headers, month names, panel title) comes from the locale keys `datepicker.weeks.*` / `datepicker.month1~12` / `datepicker.panelTitle`. The calendar is a self-drawn `view` grid with no native date controls, so it is naturally mobile-friendly and works identically on every target.

## Basic usage

```vue
<template>
  <lh-calendar v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date>()
</script>
```

Without `modelValue` the component keeps its own selection state; passing it makes the component controlled (same as every form component).

## Range selection

With `selection="range"`, the first click sets the start point (the value becomes `[start, start]`) and the second click sets the end point, normalized automatically (clicking in reverse still yields `[earlier, later]`):

```vue
<template>
  <lh-calendar v-model="span" selection="range" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const span = ref<Date[]>([])
</script>
```

Both ends get the `--selected` style; the days in between get the `--in-range` background (excluding the two ends).

## Constraining the selectable range

`range` takes a `[start, end]` tuple; days outside the span are disabled (the disabled check is a share pure function and reversed spans are normalized automatically):

```vue
<template>
  <lh-calendar v-model="value" :range="[start, end]" />
</template>

<script setup lang="ts">
const start = new Date(2026, 10, 1)
const end = new Date(2026, 10, 30)
</script>
```

## Multiple selection

With `selection="multiple"`, clicking an already-selected day deselects it, and the result stays sorted by time:

```vue
<template>
  <lh-calendar v-model="dates" selection="multiple" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const dates = ref<Date[]>([])
</script>
```

## Input trigger mode

With `mode="input"` only a trigger box is rendered; tap it to expand or collapse the panel, and the panel collapses automatically after a selection (`close-on-select` defaults to `true`; a range needs two clicks):

```vue
<template>
  <lh-calendar v-model="value" mode="input" placeholder="Pick a date" />

  <!-- Range + keep the panel open -->
  <lh-calendar v-model="span" mode="input" selection="range" :close-on-select="false" />
</template>
```

The trigger box text defaults to `YYYY-MM-DD` (`start ~ end` for a range); the placeholder comes from the locale key `select.placeholder`.

## Multiple panels and custom content

`panels` controls how many monthly panels are shown at once (laid out in a wrapping flex row); the `header` and `cell` named slots customize the panel title and the day cells:

```vue
<template>
  <lh-calendar v-model="value" :panels="2">
    <template #header="{ year, month }">
      <view class="my-title">{{ year }} / {{ month + 1 }}</view>
    </template>
    <template #cell="{ date }">
      <view class="my-cell">{{ date.getDate() }}</view>
    </template>
  </lh-calendar>
</template>
```

::: tip Mobile friendly
The calendar panel is a pure `view` grid (7 equal-width columns): no native picker, no DOM measurement — H5 and the WeChat Mini Program render it identically, and the panel adapts to the container width on small screens.
:::

## Calendar API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue | Current selection (controlled v-model; internal state when omitted) | `Date \| Date[]` | — |
| selection | Selection mode: single / range / multiple | `'single' \| 'range' \| 'multiple'` | `'single'` |
| range | Selectable date span (outside days are disabled, reversed spans are normalized) | `[Date, Date]` | — |
| mode | Display style: always-visible panel / expandable trigger box | `'panel' \| 'input'` | `'panel'` |
| panels | Number of monthly panels shown at once | `number` | `1` |
| placeholder | Trigger-box placeholder (defaults to the locale key select.placeholder) | `string` | — |
| closeOnSelect | Whether the panel collapses after a selection in input mode | `boolean` | `true` |
| customClass | Custom class name forwarded to the root node | `string` | — |
| sx | Quick layout props (applied to the root node) | `LhSxProps` | — |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:modelValue | Selection changed (v-model) | `(value: Date \| Date[])` |
| change | Selection changed (same payload as update:modelValue) | `(value: Date \| Date[])` |
| select | Fired when a day is clicked (disabled clicks are ignored) | `(date: Date)` |

### Slots

| Slot | Description | Scoped params |
| --- | --- | --- |
| header | Custom panel title | `{ year: number, month: number }` (month is 0-based) |
| cell | Custom day cell | `{ date: Date }` |

### Accessibility

- The grid is `role="grid"` with `role="row"` rows, `role="gridcell"` day cells, `role="columnheader"` headers, plus `aria-selected` / `aria-current="date"` (today) / `aria-disabled` (disabled)
- Each cell's `aria-label` is a `YYYY-MM-DD` string for screen readers
- The nav buttons are `role="button"` + `aria-label` (locale keys `datepicker.prevMonth` / `datepicker.nextMonth`)
- Keyboard grid navigation (arrows, Home / End, PageUp / PageDown) is H5-only — see the platform differences below

::: tip Platform differences (differences from the Vue3 version)
- **Grid carrier**: the calendar is a self-drawn 7-column `view` grid (WXSS `grid-template-columns: repeat(7, 1fr)`) with no native date controls; H5 and the WeChat Mini Program render and behave identically, and it is naturally mobile-friendly.
- **Element mapping**: the `<div>` / `<button>` / `<input>` from plus are all replaced with `<view>`; the trigger box in input mode is a `<view>` that renders the placeholder and the selected value itself (MP does not support `::placeholder`, and a native `<input>` would need extra `placeholder-style`). Disabled cells carry the `--disabled` class (a `view` has no `:disabled` pseudo-class; the SFC adds an inline fallback with the same token).
- **Keyboard grid navigation is H5-only**: arrow / Home / End / PageUp / PageDown navigation and the roving tabindex have no keyboard events on MP, so the guarded code is not called at all — the MP bundle contains no dead code.
- **Click-outside collapsing is H5-only**: plus listens to a document-level mousedown to collapse the panel; MP has no document, so the panel is toggled by tapping the trigger box.
- **aria attributes are bound one by one**: the share `LhAriaAttrs` pack cannot be spread with `v-bind` (the MP template compiler does not support it), so the glue layer expands the `aria-*` keys into explicit bindings; the contract is still decided by share pure functions.
:::
