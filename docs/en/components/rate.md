# Rate

Star rating: click to select, optional half stars and score text; the readonly variant exposes the rating as text for screen readers. Fill tiers, clamping and stepping all come from `@lh-ui/share` core pure functions.

## Basic usage

```vue
<template>
  <lh-rate v-model="value" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const value = ref(3)
</script>
```

## Half stars

`allow-half` enables half stars: on H5, clicking the left half of a star counts 0.5 (based on the horizontal click offset).

```vue
<template>
  <lh-rate v-model="value" allow-half />
</template>
```

## Readonly and score text

`readonly` switches to a pure display branch (`role="img"` with the rating in `aria-label`); `show-score` appends a score text and `score-template` customizes it (`{n}` placeholder).

```vue
<template>
  <lh-rate :model-value="3.5" readonly allow-half show-score />
  <lh-rate :model-value="4" readonly show-score score-template="{n} pts" />
</template>
```

## Custom count and character

`max` adjusts the star limit (clamped to [0, max]); `character` replaces the default `★`.

```vue
<template>
  <lh-rate :model-value="5" :max="8" character="墨" />
</template>
```

## Disabled

`disabled` disables the whole group: clicks are ignored and the root gets `lh-rate--disabled` plus `aria-disabled`.

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue / v-model | Current rating | `number` | `0` |
| max | Star limit | `number` | `5` |
| allow-half | Allow half stars | `boolean` | `false` |
| readonly | Readonly (display only) | `boolean` | `false` |
| disabled | Disabled | `boolean` | `false` |
| character | Custom character | `string` | — |
| show-score | Show score text | `boolean` | `false` |
| score-template | Score template (`{n}` placeholder) | `string` | — |
| customClass | Custom class name (forwarded to the root node) | `string` | — |
| sx | sx shorthand layout properties | `LhSxProps` | — |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:modelValue / change | Rating changed (same value never re-emitted) | `(value: number)` |

## Platform differences

- **Half-star hit detection is H5-only**: it relies on the click event's horizontal offset (`offsetX`), which **Mini Program events do not carry** — clicks degrade to whole stars there. If you need half-star precision on the Mini Program, build it on touch events + async offset math via `uni.createSelectorQuery` (note SelectorQuery is asynchronous).
- **Star element**: plus's `<button>` stars become `<view role="radio">` (MP buttons cannot reset their default styles); disabled is expressed by the click guard + the `--disabled` modifier + `aria-disabled`.
- **Keyboard stepping is H5-only**: arrow keys ±1 (±0.5 with half stars), Home clears, End maxes out; Mini Programs have no keyboard events, so no behavioral gap.
- **Score text**: comes from share locales' `rate.stars` (`{n} 星`, all nine languages); `score-template` overrides it.

::: tip Differences from the Vue 3 version
- Logic semantics (clamping, fill tiers, stepping, aria) match plus exactly (same share core).
- A `customClass` prop is added: custom classes cannot penetrate `styleIsolation` in uni-app, so they are forwarded via a prop.
- Half-star detection degrades to whole stars on the Mini Program (see "Platform differences").
:::
