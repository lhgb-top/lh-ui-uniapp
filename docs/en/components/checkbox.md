# Checkbox

::: tip Drawn with view on the Mini Program
The native checkbox component is not used (MP styles are not controllable); instead the checkbox is drawn with view + a lh-icon glyph, keeping the visuals consistent with the other builds of the family.
:::

## Basic usage

```vue
<template>
  <lh-checkbox v-model="checked" label="Agree to the terms" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const checked = ref(false)
</script>
```

## Checkbox group

```vue
<template>
  <lh-checkbox-group v-model="values">
    <lh-checkbox value="a" label="Option one" />
    <lh-checkbox value="b" label="Option two" />
    <lh-checkbox value="c" label="Option three" disabled />
  </lh-checkbox-group>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const values = ref(['a'])
</script>
```

## Indeterminate state

```vue
<lh-checkbox v-model="checked" indeterminate label="Select all (partially selected)" />
```

## Checkbox Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue (v-model) | Whether it is checked | `boolean` | `false` |
| value | The identifying value inside a group | `unknown` | — |
| label | Text | `string` | — |
| disabled | Disabled | `boolean` | `false` |
| indeterminate | Indeterminate state | `boolean` | `false` |
| name | Native name | `string` | — |
| size | Size | `'small' \| 'medium' \| 'large'` | — |
| customClass | Custom class name | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## CheckboxGroup Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue (v-model) | Array of checked values | `unknown[]` | `[]` |
| disabled | Disable all children | `boolean` | `false` |
| name | Native name | `string` | — |
| size | Size (passed down to the children) | `'small' \| 'medium' \| 'large'` | — |

## Events

| Event | Description | Callback parameters |
| --- | --- | --- |
| update:modelValue | Value changed | `(value)` |
| change | Value changed | `(value)` |
