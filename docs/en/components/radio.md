# Radio

::: tip Drawn with view on the Mini Program
The native radio component is not used (MP styles are not controllable); instead the dot is drawn with view.
:::

## Basic usage

```vue
<template>
  <lh-radio-group v-model="value">
    <lh-radio value="a" label="Option one" />
    <lh-radio value="b" label="Option two" />
    <lh-radio value="c" label="Option three" disabled />
  </lh-radio-group>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref('a')
</script>
```

## Radio Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue (v-model) | Whether it is checked | `unknown` | — |
| value | The value of this item | `unknown` | — |
| label | Text | `string` | — |
| disabled | Disabled | `boolean` | `false` |
| name | Native name | `string` | — |
| size | Size | `'small' \| 'medium' \| 'large'` | — |
| customClass | Custom class name | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## RadioGroup Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue (v-model) | Checked value | `unknown` | — |
| disabled | Disable all children | `boolean` | `false` |
| name | Native name | `string` | — |
| size | Size (passed down to the children) | `'small' \| 'medium' \| 'large'` | — |

## Events

| Event | Description | Callback parameters |
| --- | --- | --- |
| update:modelValue | Value changed | `(value)` |
| change | Value changed | `(value)` |
