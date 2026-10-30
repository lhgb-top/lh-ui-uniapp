# Select

## Basic usage

```vue
<template>
  <lh-select v-model="value" :options="options" placeholder="Please select" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref()
const options = [
  { label: 'Option one', value: 'a' },
  { label: 'Option two', value: 'b' },
  { label: 'Disabled item', value: 'c', disabled: true },
]
</script>
```

## Clearable / filterable

```vue
<template>
  <lh-select v-model="value" :options="options" clearable />
  <lh-select v-model="value" :options="options" filterable placement="bottom" />
</template>
```

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue (v-model) | Bound value | `unknown` | — |
| options | Option list | `LhSelectOption[]` | — |
| size | Size | `'small' \| 'medium' \| 'large'` | — |
| disabled | Disabled | `boolean` | `false` |
| clearable | Clearable | `boolean` | `false` |
| placeholder | Placeholder text | `string` | — |
| filterable | Filterable (on MP an input is provided inside the overlay) | `boolean` | `false` |
| placement | Overlay position (12 positions) | `LhPlacement` | `'bottom'` |
| customClass | Custom class name | `string` | — |
| themeVars | Component-level theme variables | `Record<string, string>` | — |
| sx | Quick layout props | `LhSxProps` | — |

### LhSelectOption

| Prop | Description | Type |
| --- | --- | --- |
| label | Displayed text | `string` |
| value | Value | `unknown` |
| disabled | Disabled | `boolean` |

## Events

| Event | Description | Callback parameters |
| --- | --- | --- |
| update:modelValue | Value changed | `(value)` |
| change | Value changed (including `undefined` when cleared) | `(value)` |
| visible-change | Overlay visibility | `(visible: boolean)` |

::: tip Differences from the Vue3 version
- The overlay goes through `root-portal` + two-frame asynchronous measurement positioning (not absolute positioning).
- **Keyboard navigation (↑↓ / Home / End) is H5-only**; the Mini Program has no keyboard events, so it is removed at compile time — on MP the options can only be tapped.
- The filter input of `filterable` is rendered inside the overlay on MP.
:::
