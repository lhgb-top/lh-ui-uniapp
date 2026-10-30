# Botón de radio

::: tip En el Mini Programa es view dibujado a medida
No se usa el componente radio nativo (en MP los estilos no se pueden controlar); en su lugar se dibuja el punto con view.
:::

## Uso básico

```vue
<template>
  <lh-radio-group v-model="value">
    <lh-radio value="a" label="Opción uno" />
    <lh-radio value="b" label="Opción dos" />
    <lh-radio value="c" label="Opción tres" disabled />
  </lh-radio-group>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref('a')
</script>
```

## Radio Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| modelValue (v-model) | Si está seleccionado | `unknown` | — |
| value | El valor de este elemento | `unknown` | — |
| label | Texto | `string` | — |
| disabled | Desactivado | `boolean` | `false` |
| name | name nativo | `string` | — |
| size | Tamaño | `'small' \| 'medium' \| 'large'` | — |
| customClass | Clase personalizada | `string` | — |
| sx | Props rápidas de disposición | `LhSxProps` | — |

## RadioGroup Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| modelValue (v-model) | Valor seleccionado | `unknown` | — |
| disabled | Desactiva todos los elementos hijos | `boolean` | `false` |
| name | name nativo | `string` | — |
| size | Tamaño (se propaga a los elementos hijos) | `'small' \| 'medium' \| 'large'` | — |

## Events

| Evento | Descripción | Parámetros de la retrollamada |
| --- | --- | --- |
| update:modelValue | Cambio de valor | `(value)` |
| change | Cambio de valor | `(value)` |
