# InputNumber

Numeric input box: change the value by typing or via the increment/decrement buttons, with range clamping, step, precision and strict steps. Parameter normalization, stepping and commit clamping all come from `@lh-ui/share` core pure functions.

## Basic usage

```vue
<template>
  <lh-input-number v-model="value" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const value = ref<number | null>(1)
</script>
```

## Range limits

`min` / `max` constrain both button stepping and typed input (out-of-range values are clamped back).

```vue
<template>
  <lh-input-number v-model="level" :min="1" :max="10" />
</template>
```

## Step and precision

`step` adjusts the step; `precision` fixes the decimal places (applied before clamping); `step-strictly` snaps typed values onto the step grid (rounded).

```vue
<template>
  <lh-input-number v-model="value" :step="2" />
  <lh-input-number v-model="value" :precision="2" placeholder="2 decimals" />
  <lh-input-number v-model="value" :step="10" step-strictly placeholder="multiples of 10 only" />
</template>
```

## Sizes and control buttons

`size` switches between small / medium / large; `controls` hides the increment/decrement buttons (input only).

```vue
<template>
  <lh-input-number v-model="value" size="small" />
  <lh-input-number v-model="value" size="large" />
  <lh-input-number v-model="value" :controls="false" placeholder="no controls" />
</template>
```

## Disabled and form name

`disabled` disables everything (buttons unclickable, input not editable); `name` is the native form name.

```vue
<template>
  <lh-input-number :model-value="5" disabled />
  <lh-input-number v-model="value" name="quantity" />
</template>
```

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue / v-model | Current value (null for empty) | `number \| null` | `null` |
| min | Minimum | `number` | `-Infinity` |
| max | Maximum | `number` | `Infinity` |
| step | Step | `number` | `1` |
| step-strictly | Only multiples of step accepted | `boolean` | `false` |
| precision | Numeric precision (decimal places) | `number` | — |
| disabled | Disabled | `boolean` | `false` |
| size | Size | `"small" \| "medium" \| "large" \| "mini" \| "x-large"` | `'medium'` |
| controls | Show control buttons | `boolean` | `true` |
| placeholder | Placeholder text | `string` | `''` |
| name | Native form name | `string` | `''` |
| customClass | Custom class name (forwarded to the root node) | `string` | — |
| sx | sx shorthand layout properties | `LhSxProps` | — |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:modelValue / change | Value committed (buttons commit immediately; typed values commit on blur / confirm, matching plus's native change timing) | `(value: number \| null)` |

## Platform differences

- **Commit timing (draft model)**: uni's input component has no native change event (Mini Programs only have input / blur / confirm), so typing only updates an internal draft and commits once on blur or confirm (Enter on H5 / the keyboard's "done" on MP) — equivalent to plus's native change firing only at commit time (same approach as the React package). The same value is never emitted twice (on MP, confirm is followed by another blur; deduplication avoids double emits).
- **Buttons are view-based taps**: plus's `<button>` becomes `<view role="button">` (MP buttons cannot reset their default styles); taps work on all platforms. Views have no `:disabled` pseudo-class, so the disabled look is provided by an inline fallback rule using the same tokens.
- **Arrow-key stepping is H5-only**: ↑ increments / ↓ decrements (Enter commit is not wired on keydown — on H5 the keydown and confirm events fire together, so commits go through confirm only to avoid double submission); Mini Programs have no keyboard events, so no behavioral gap.
- **Placeholder styling**: share's `::placeholder` rule only ships in the H5 bundle; the Mini Program side uses the `placeholder-style` prop (token color fallback).
- **Form validation wiring not connected**: plus outputs `aria-invalid` on the input via form context; the input family in this package does not wire form-context aria, with values and validation behavior unaffected.

::: tip Differences from the Vue 3 version
- Logic semantics (parameter normalization, stepping, precision / min/max / stepStrictly clamping) match plus exactly (same share core).
- A `customClass` prop is added: custom classes cannot penetrate `styleIsolation` in uni-app, so they are forwarded via a prop.
- Typed-value commit timing: see the first "Platform differences" entry (draft model, equivalent to plus's change semantics).
:::
