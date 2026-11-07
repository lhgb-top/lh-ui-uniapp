# ColorPicker

Clicking the trigger opens the palette panel: a saturation / brightness board with drag, hue / alpha
sliders, hex / rgb input and predefined swatches. All color conversions come from the
`@lh-ui/share/core/color-picker` pure functions (round trips between the hex/rgb and HSV spaces,
with every channel clamped throughout), and rendering is identical on H5 and the WeChat Mini Program.

## Basic usage

```vue
<template>
  <lh-color-picker v-model="color" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const color = ref('#2B4C7C')
</script>
```

## Alpha and predefined swatches

```vue
<template>
  <lh-color-picker
    v-model="color"
    show-alpha
    :predefine="predefine"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const color = ref('rgba(43, 76, 124, 0.6)')
// With showAlpha enabled, hex output is 8 digits (#2b4c7c99) and rgb output is rgba() — a
// non-null alpha is never silently dropped
const predefine = ['#2B4C7C', '#5B8C5A', '#C4A35A', '#B23A3A']
</script>
```

## Output format

```vue
<lh-color-picker v-model="color" format="rgb" />
```

`format` only affects the output form of `v-model` (`hex` or `rgb`); invalid values fall back to `hex`.

## Size / clear / disabled

```vue
<lh-color-picker v-model="color" size="small" />
<lh-color-picker v-model="color" clearable />
<lh-color-picker v-model="color" disabled />
```

With `clearable` enabled, a clear button appears inside the trigger when a value is set; clicking it empties the value and emits the `clear` event.

## Imperative open/close

```vue
<template>
  <lh-color-picker ref="pickerRef" v-model="color" />
  <lh-button size="small" @click="pickerRef?.open()">Open panel</lh-button>
</template>
```

The component exposes `open` / `close` / `isOpen` via ref.

## ColorPicker API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| model-value | Bound value (controlled v-model; a hex or rgb() string, output per format) | string | `''` |
| format | Output format (invalid values fall back to hex) | `'hex' \| 'rgb'` | hex |
| show-alpha | Alpha channel (8-digit hex / rgba() output when enabled) | boolean | `false` |
| predefine | Predefined swatches | string[] | `[]` |
| size | Size | `'mini' \| 'small' \| 'medium' \| 'large' \| 'x-large'` | medium |
| disabled | Disable the component | boolean | `false` |
| clearable | Show the clear (empty) button | boolean | `false` |
| placeholder | Placeholder shown when empty (falls back to locale colorPicker.placeholder) | string | `''` |
| aria-label | Accessible name (falls back to locale colorPicker.label) | string | — |
| custom-class | Custom class name forwarded to the root node | string | — |
| sx | Quick layout props | LhSxProps | — |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:model-value | Color changed (v-model) | `(value: string)` |
| change | Color change confirmed (same payload as update:model-value) | `(value: string)` |
| clear | The clear button was clicked | — |

### Expose

| Method | Description |
| --- | --- |
| open | Open the panel |
| close | Close the panel |
| isOpen | Whether the panel is open (ref) |

### Accessibility

- The trigger is `role="button"` with `aria-expanded` and `aria-label` (locale key colorPicker.label).
- The hue / alpha sliders are `role="slider"` with `aria-valuenow` / `aria-valuemin` / `aria-valuemax`; arrow keys fine-tune (Shift accelerates).
- Every predefined swatch is clickable, and its accessible name is the color value string itself.

::: tip Platform differences (differences from the Vue3 version)
- Drag carrier: MP dispatches touchmove / touchend on the touch target (no document listeners
  needed), while H5 additionally uses document-level mouse listeners (the drag continues after the
  pointer leaves the component) — the same pattern as Slider.
- The hex / rgb inputs inside the panel use the uni `<input>`: Enter submits via `@confirm` (the
  keyboard's "Done" button), and blur submits via `@blur` (MP has no keydown.enter).
- Keyboard interaction (arrow fine-tuning, Enter / Space to open/close, Esc to close) works on H5
  only; MP has no keyboard events.
- Panel positioning goes through root-portal + two-frame measurement (measure → position → show,
  preventing flicker).
:::
