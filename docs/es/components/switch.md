# Interruptor

::: tip En el Mini Programa es view dibujado a medida
El componente switch nativo tiene los estilos incontrolables en el Mini Programa, de modo que el control deslizante se dibuja con view para garantizar la coherencia visual.
:::

## Uso básico

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

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| modelValue (v-model) | Si está activado | `boolean` | `false` |
| disabled | Desactivado | `boolean` | `false` |
| loading | Cargando | `boolean` | `false` |
| name | name nativo | `string` | — |
| size | Tamaño | `'small' \| 'medium' \| 'large'` | — |
| activeText | Texto de activado | `string` | — |
| inactiveText | Texto de desactivado | `string` | — |
| customClass | Clase personalizada | `string` | — |
| sx | Props rápidas de disposición | `LhSxProps` | — |

## Events

| Evento | Descripción | Parámetros de la retrollamada |
| --- | --- | --- |
| update:modelValue | Cambio de valor | `(value: boolean)` |
| change | Cambio de valor | `(value: boolean)` |
