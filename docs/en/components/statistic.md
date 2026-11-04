# Statistic

Displays statistical values, supporting precision, digit grouping, prefixes/suffixes, and huge numbers as strings.

## Basic usage

```vue
<template>
  <lh-statistic
    title="Annual visits"
    :value="2384712"
  />
</template>
```

## Precision and separator

`precision` controls the decimal places (rounded), and `separator` controls the digit grouping (pass an empty string to disable grouping).

```vue
<template>
  <lh-statistic
    title="Rating"
    :value="4.8471"
    :precision="2"
  />
  <lh-statistic
    title="ID"
    :value="8899001"
    separator=""
  />
</template>
```

## Prefix and suffix

```vue
<template>
  <lh-statistic
    title="Turnover"
    :value="128600"
    prefix="¥"
    suffix="CNY"
  />
  <lh-statistic
    title="Growth rate"
    :value="12.6"
    :precision="1"
    suffix="%"
  />
</template>
```

## Huge numbers and non-numeric text

A string `value` can carry huge numbers: integer strings beyond `Number.MAX_SAFE_INTEGER` go through a string formatting path that never converts to Number and loses no precision; strings that cannot be parsed as numbers are displayed as-is.

```vue
<template>
  <lh-statistic
    title="Stars"
    value="Countless"
  />
  <lh-statistic
    title="Interstellar distance"
    value="9007199254740993"
  />
</template>
```

## Slots

The `title` / `prefix` / `suffix` slots override the props of the same names.

```vue
<template>
  <lh-statistic :value="1024">
    <template #title>
      <text>Custom title</text>
    </template>
    <template #prefix>
      <text>¥</text>
    </template>
    <template #suffix>
      <text>CNY</text>
    </template>
  </lh-statistic>
</template>
```

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| title | Value title (shown above the value) | `string` | — |
| value | Statistical value; a string can carry huge numbers or signed text | `string \| number` | `0` |
| precision | Decimal places | `number` | `0` |
| separator | Digit grouping separator; an empty string disables grouping | `string` | `','` |
| prefix | Value prefix, e.g. a currency symbol | `string` | — |
| suffix | Value suffix, e.g. a unit | `string` | — |
| customClass | Custom class name | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## Slots

| Slot | Description |
| --- | --- |
| title | Custom title |
| prefix | Custom prefix |
| suffix | Custom suffix |

## Platform differences

- A pure display component with no platform API usage; behaves identically on H5 and WeChat Mini Program.
- All formatting logic (precision, digit grouping, the huge-number string path) comes from the `formatStatisticValue` pure function of `@lh-ui/share`; this repo only adds reactive glue and never copies the core implementation.
- The value area carries `aria-live="polite"`: on H5 screen readers politely announce the new value when `value` changes; Mini Program screen-reader support depends on the platform.
- This component does not include a count-up animation. If one is added later: both `setInterval` and `requestAnimationFrame` are available on the Mini Program, but `transitionend` is unreliable there, so the animation tail must be aligned with `setTimeout` (the same approach as the message / loading transitions).
