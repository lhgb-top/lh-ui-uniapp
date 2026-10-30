# Progress

Displays task progress, supporting status colors, custom colors, and text formatting.

## Basic usage

```vue
<template>
  <lh-progress :percentage="42" />
</template>
```

## Status

```vue
<template>
  <lh-progress :percentage="70" status="success" />
  <lh-progress :percentage="70" status="warning" />
  <lh-progress :percentage="70" status="exception" />
  <lh-progress :percentage="100" />
</template>
```

When `status` is `normal` and the value reaches 100, it is automatically treated as `success`.

## Stroke width and hidden text

```vue
<template>
  <lh-progress :percentage="60" :stroke-width="12" />
  <lh-progress :percentage="60" :show-text="false" />
</template>
```

## Custom color

A string is used directly as the bar color; a function returns a color based on the percentage.

```vue
<template>
  <lh-progress :percentage="60" color="#C4A35A" />
  <lh-progress :percentage="60" :color="gradient" />
</template>

<script setup lang="ts">
const gradient = (p: number) => `rgb(${p}, 0, 0)`
</script>
```

## Custom formatting and the text slot

```vue
<template>
  <lh-progress :percentage="42" :format="format" />
  <lh-progress :percentage="42">
    <template #text="{ percentage }">
      <text>{{ percentage }} / 100</text>
    </template>
  </lh-progress>
</template>

<script setup lang="ts">
const format = (p: number) => `Progress ${p}`
</script>
```

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| percentage | Progress percentage 0-100 (clamped automatically when out of range) | `number` | `0` |
| type | Type | `'line' \| 'circle'` | `'line'` |
| status | Status | `'normal' \| 'success' \| 'warning' \| 'exception'` | `'normal'` |
| color | Progress bar color: a string, or a function that returns a color by percentage | `string \| ((percentage: number) => string)` | — |
| strokeWidth | Stroke width in px | `number` | `6` |
| width | Canvas width in px for the circle mode | `number` | `126` |
| showText | Whether to show the text | `boolean` | `true` |
| format | Custom text formatting | `(percentage: number) => string` | — |
| customClass | Custom class name | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## Slots

| Slot | Description | Scoped parameters |
| --- | --- | --- |
| text | Custom progress text | `{ percentage: number }` |

::: tip The circle type is not implemented yet
The Mini Program has limited svg support, so only the line type is implemented in the first release. Passing `type="circle"` renders as line and warns once during development (no silent degradation); circle is left for a later phase.
:::
