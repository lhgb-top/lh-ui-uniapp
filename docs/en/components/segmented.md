# Segmented

Mutually exclusive option switching, commonly used for view switchers. Data-driven: options are given directly as an `options` array, no manual child components needed.

## Basic usage

`options` accepts a string shorthand; `modelValue` (`v-model`) is the currently selected value.

```vue
<template>
  <lh-segmented v-model="view" :options="['List', 'Card', 'Table']" />
</template>

<script setup>
import { ref } from 'vue'
const view = ref('List')
</script>
```

## Object options

The object form provides `label` / `value`, for cases where the displayed text differs from the value.

```vue
<template>
  <lh-segmented
    v-model="mode"
    :options="[
      { label: 'Day', value: 'day' },
      { label: 'Week', value: 'week' },
      { label: 'Month', value: 'month' },
    ]"
  />
</template>

<script setup>
import { ref } from 'vue'
const mode = ref('day')
</script>
```

## Disabled options and whole-group disabled

An option object with `disabled: true` cannot be selected; the component-level `disabled` disables the entire segmented control.

```vue
<template>
  <lh-segmented
    v-model="seg"
    :options="[
      { label: 'Spring begins', value: 'lichun' },
      { label: 'Rain water', value: 'yushui' },
      { label: 'Insects awaken', value: 'jingzhe', disabled: true },
    ]"
  />
  <lh-segmented v-model="all" disabled :options="['A', 'B', 'C']" />
</template>

<script setup>
import { ref } from 'vue'
const seg = ref('lichun')
const all = ref('A')
</script>
```

## Block width

`block` makes the segmented control fill its container and split the width evenly across options (common for view switcher bars).

```vue
<template>
  <lh-segmented v-model="block" block :options="['Shi', 'Ci', 'Qu', 'Fu']" />
</template>

<script setup>
import { ref } from 'vue'
const block = ref('Shi')
</script>
```

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue (v-model) | Current value (controlled, used with the `update:modelValue` event) | `string \| number` | — |
| options | Options (string shorthand or `{ label, value, disabled }` objects) | `[LhSegmentedInput](#type-notes)[]` | — |
| disabled | Disable the whole group | `boolean` | `false` |
| block | Fill the container (options share the width evenly) | `boolean` | `false` |
| customClass | Custom class name (forwarded to the root node) | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

### Type notes

```ts
/** Option value type */
type LhSegmentedValue = string | number

/** Option object shape */
interface LhSegmentedOption {
  label: string
  value: LhSegmentedValue
  disabled?: boolean
}

/** Input option (string shorthand or object) */
type LhSegmentedInput = LhSegmentedValue | LhSegmentedOption
```

## Events

| Event | Description | Callback parameters |
| --- | --- | --- |
| update:modelValue | Emitted when the selection changes, used with v-model | `(value: string \| number)` |
| change | Emitted when the selection changes (both click and arrow keys) | `(value: string \| number)` |

## Platform differences

- **Touch interaction drawn with view, available on all platforms**: the `<div>` + `<button>` of the Vue 3 version are replaced with `<view>` (WXSS forbids tag selectors, class names carry the styles); selection switches via `@click` and behaves identically on H5 and the WeChat Mini Program, with no platform API dependency.
- **The selected thumb is a pure CSS transition**: the selected option's background color / shadow is driven by class switching, and WXSS supports simple `transition`s, so both platforms get the fade; **it does not rely on `transitionend`** (that event is unreliable on the Mini Program — this repo's message / loading animation components all align timings with setTimeout instead, while the segmented control needs no JS orchestration at all, pure CSS with no timing burden).
- **Arrow-key navigation is H5 only**: roving tabindex (arrow keys move the selection, wrapping at the ends, skipping disabled options, reusing `getNextListIndex` / `getRovingTabIndex` of the `@lh-ui/share` core) has no keyboard events on the Mini Program; the `@keydown` handler of the SFC is guarded by conditional compilation and never called in the MP bundle — on MP you can only tap to select.
- **Disabled option looks rely on a class fallback**: the disabled styles in the share style source live on the `&:disabled` pseudo-class (which only matches button elements), and view has no such pseudo-class, so the component adds an inline `lh-segmented__option--disabled` rule with the same token (`--lh-disabled-text-color`), following the inline fallback precedent of lh-spinner / lh-empty (not part of the purified output).
- **Accessibility attributes are bound one by one**: the contract for `role="radiogroup"` / `role="radio"` + `aria-checked` / `aria-disabled` is still decided by share's `getSegmentedAria` / `getSegmentedItemAria`; because the Mini Program template compiler does not support `v-bind` with an object, the glue layer flattens the attribute bag into explicit per-item bindings.
- **Porting conclusion**: Segmented is a pure switching component with no measuring, no overlays and no document dependency; option normalization, class names and accessibility attributes are all produced by the pure functions of the `@lh-ui/share` core, and this repo only adds reactive glue. The API is identical to the Vue 3 version (`modelValue` / `options` / `disabled` / `block` / `sx`).
