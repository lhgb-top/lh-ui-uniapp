# Slider

A slider that lets the user drag a thumb along a track to pick a value. Supports a single thumb and a range (two-thumb) mode, `step` snapping and `marks` tick labels. The track, thumbs and fill bar are self-drawn `view` elements; clamping, step snapping, tick ordering and the accessibility contract all come from `@lh-ui/share` pure functions — no copies.

## Basic usage

```vue
<template>
  <lh-slider v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref(30)
</script>
```

Without `modelValue` the component initializes from `min`; passing it makes the component controlled (same as every form component). During a drag only the internal state updates — `update:modelValue` / `change` are emitted **once, when the drag ends** (same as the Vue3 version).

## Range selection

`range` enables the two-thumb mode; `modelValue` is a `[start, end]` tuple:

```vue
<template>
  <lh-slider v-model="span" range />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const span = ref<[number, number]>([20, 60])
</script>
```

Dragging one end past the other swaps the two ends (the thumb under the finger is always the one being dragged), so the value always stays `[earlier, later]`.

## Step and marks

`step` snaps the thumb to the step grid; `marks` renders tick labels from a `value → label` map (sorted by value):

```vue
<template>
  <lh-slider v-model="value" :min="0" :max="100" :step="10" :marks="marks" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref(30)
const marks: Record<number, string> = {
  0: '0',
  50: 'Half',
  100: 'Full',
}
</script>
```

## Disabled

`disabled` blocks dragging and keyboard stepping, and removes the thumb from the tab order:

```vue
<template>
  <lh-slider v-model="value" disabled />
</template>
```

## Show value

`show-input` echoes the current value to the right of the track (a `[start, end]` string in range mode):

```vue
<template>
  <lh-slider v-model="value" show-input />
</template>
```

## Slider API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue | Current value (controlled v-model; a tuple in range mode) | `number \| [number, number]` | — |
| min | Minimum value | `number` | `0` |
| max | Maximum value | `number` | `100` |
| step | Step size (the grid the thumb snaps to) | `number` | `1` |
| disabled | Disable the whole slider | `boolean` | `false` |
| range | Range mode (two thumbs) | `boolean` | `false` |
| showInput | Show the current value next to the track | `boolean` | `false` |
| size | Size | `'small' \| 'medium' \| 'large'` | `'medium'` |
| marks | Tick labels (keys are values, sorted ascending) | `Record<number, string>` | — |
| customClass | Custom class name forwarded to the root node | `string` | — |
| sx | Quick layout props (applied to the root node) | `LhSxProps` | — |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:modelValue | Value changed (v-model; emitted on drag end or keyboard step) | `(value: number \| [number, number])` |
| change | Value changed (same payload as update:modelValue) | `(value: number \| [number, number])` |

### Accessibility

- The thumb is `role="slider"` with `aria-valuemin` / `aria-valuemax` / `aria-valuenow` / `aria-valuetext` (the contract comes from share's `getSliderThumbAria`)
- In range mode the two thumbs carry distinct `aria-label`s ("start thumb" / "end thumb", locale keys `slider.thumbStart` / `slider.thumbEnd`; `slider.thumb` otherwise)
- Keyboard stepping (arrows move by `step`, PageUp / PageDown take bigger steps, Home / End jump to the extremes) is H5-only — see the platform differences below

::: tip Platform differences (differences from the Vue3 version)
- **Drag carrier**: plus attaches `mousedown` / `touchstart` on the thumb and then moves the move / up listeners to `document`; a Mini Program has no document, so `touchstart` / `touchmove` / `touchend` stay bound to the thumb itself (Mini Program touch events keep firing on the touchstart target — no global listeners needed). H5 keeps document-level mouse listeners (once the mouse is down, the drag continues outside the component), guarded by conditional compilation — the MP bundle contains no dead code.
- **Position computation is asynchronous**: plus measures the track with synchronous `getBoundingClientRect`; a Mini Program only has the asynchronous `createSelectorQuery`, so this component goes through the adapter's `getSingleLhRect`. The measurement is cached per drag session (warmed up on touchstart), so a normal drag is barely affected — but semantically the value update lags the touch by one frame. **Do not assume the value has already updated synchronously inside a move event**; the emit only happens when the drag ends.
- **Zero track width is skipped**: when the layout is not ready yet (or in a test environment) the track rect has width 0, which would produce a division by zero; the update is skipped instead of polluting the value with NaN.
- **Keyboard stepping is H5-only**: arrow / Home / End / PageUp / PageDown stepping has no keyboard events on MP, so the guarded code is not called at all — the MP bundle contains no dead code.
- **aria attributes are bound one by one**: the share `LhAriaAttrs` pack cannot be spread with `v-bind` (the MP template compiler does not support it), so the glue layer expands the `aria-*` keys into explicit bindings; the contract is still decided by share pure functions.
- **No vertical mode and no tooltip bubble**: the plus source has no `vertical` (vertical track) or tooltip bubble prop; this port stays strictly aligned and adds neither. For a vertical track you can rotate a wrapper element (and handle the touch coordinates yourself); for a value bubble use `show-input` to keep the value visible.
:::
