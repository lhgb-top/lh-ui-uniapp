# Casilla de verificación

::: tip En el Mini Programa es view dibujado a medida
No se usa el componente checkbox nativo (en MP los estilos no se pueden controlar); en su lugar se dibuja la casilla con view + el icono de lh-icon, para garantizar la coherencia visual con las demás plataformas de la familia.
:::

## Uso básico

```vue
<template>
  <lh-checkbox v-model="checked" label="Acepto el acuerdo" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const checked = ref(false)
</script>
```

## Grupo de casillas

```vue
<template>
  <lh-checkbox-group v-model="values">
    <lh-checkbox value="a" label="Opción uno" />
    <lh-checkbox value="b" label="Opción dos" />
    <lh-checkbox value="c" label="Opción tres" disabled />
  </lh-checkbox-group>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const values = ref(['a'])
</script>
```

## Estado indeterminado

```vue
<lh-checkbox v-model="checked" indeterminate label="Seleccionar todo (parcialmente seleccionado)" />
```

## Checkbox Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| modelValue (v-model) | Si está marcada | `boolean` | `false` |
| value | Valor identificador dentro del group | `unknown` | — |
| label | Texto | `string` | — |
| disabled | Desactivada | `boolean` | `false` |
| indeterminate | Estado indeterminado (semi-seleccionado) | `boolean` | `false` |
| name | name nativo | `string` | — |
| size | Tamaño | `'small' \| 'medium' \| 'large'` | — |
| customClass | Clase personalizada | `string` | — |
| sx | Props rápidas de disposición | `LhSxProps` | — |

## CheckboxGroup Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| modelValue (v-model) | Array de valores marcados | `unknown[]` | `[]` |
| disabled | Desactiva todos los elementos hijos | `boolean` | `false` |
| name | name nativo | `string` | — |
| size | Tamaño (se propaga a los elementos hijos) | `'small' \| 'medium' \| 'large'` | — |

## Events

| Evento | Descripción | Parámetros de la retrollamada |
| --- | --- | --- |
| update:modelValue | Cambio de valor | `(value)` |
| change | Cambio de valor | `(value)` |
