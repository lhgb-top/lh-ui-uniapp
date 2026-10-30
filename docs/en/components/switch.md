# Switch

::: tip Drawn with view on the Mini Program
The native switch component has uncontrollable styles on the Mini Program, so the thumb is drawn with view to keep the visuals consistent.
:::

## Basic usage

```vue
<template>
  <lh-switch v-model="on" />
  <lh-switch v-model="on" active-text="On" inactive-text="Off" />
  <lh-switch v-model="on" loading />
  <lh-switch v-model="on" disabled />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const on = ref(true)
</script>
```

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue (v-model) | Whether it is on | `boolean` | `false` |
| disabled | Disabled | `boolean` | `false` |
| loading | Loading | `boolean` | `false` |
| name | Native name | `string` | — |
| size | Size | `'small' \| 'medium' \| 'large'` | — |
| activeText | Text for the on state | `string` | — |
| inactiveText | Text for the off state | `string` | — |
| customClass | Custom class name | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## Events

| Event | Description | Callback parameters |
| --- | --- | --- |
| update:modelValue | Value changed | `(value: boolean)` |
| change | Value changed | `(value: boolean)` |
