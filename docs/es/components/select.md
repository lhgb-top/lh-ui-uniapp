# Selector

## Uso básico

```vue
<template>
  <lh-select v-model="value" :options="options" placeholder="Selecciona..." />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref()
const options = [
  { label: 'Opción uno', value: 'a' },
  { label: 'Opción dos', value: 'b' },
  { label: 'Elemento desactivado', value: 'c', disabled: true },
]
</script>
```

## Se puede vaciar / filtrar

```vue
<template>
  <lh-select v-model="value" :options="options" clearable />
  <lh-select v-model="value" :options="options" filterable placement="bottom" />
</template>
```

## Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| modelValue (v-model) | Valor enlazado | `unknown` | — |
| options | Lista de opciones | `LhSelectOption[]` | — |
| size | Tamaño | `'small' \| 'medium' \| 'large'` | — |
| disabled | Desactivado | `boolean` | `false` |
| clearable | Se puede vaciar | `boolean` | `false` |
| placeholder | Texto del marcador de posición | `string` | — |
| filterable | Se puede filtrar (en la plataforma MP el campo de entrada va dentro de la capa flotante) | `boolean` | `false` |
| placement | Posición de la capa flotante (12 posiciones) | `LhPlacement` | `'bottom'` |
| customClass | Clase personalizada | `string` | — |
| themeVars | Variables de tema a nivel de componente | `Record<string, string>` | — |
| sx | Props rápidas de disposición | `LhSxProps` | — |

### LhSelectOption

| Prop | Descripción | Tipo |
| --- | --- | --- |
| label | Texto que se muestra | `string` |
| value | Valor | `unknown` |
| disabled | Desactivado | `boolean` |

## Events

| Evento | Descripción | Parámetros de la retrollamada |
| --- | --- | --- |
| update:modelValue | Cambio de valor | `(value)` |
| change | Cambio de valor (incluido el vaciado con `undefined`) | `(value)` |
| visible-change | Mostrado / ocultado de la capa flotante | `(visible: boolean)` |

::: tip Diferencias frente a la versión Vue3
- La capa flotante usa `root-portal` + medición asíncrona en dos fotogramas (no es posicionamiento absolute).
- **La navegación por teclado (↑↓ / Home / End) solo en H5**: el Mini Programa no tiene eventos de teclado y se elimina en tiempo de compilación; en la plataforma MP solo se puede hacer clic en una opción.
- El campo de entrada de filtrado de `filterable`, en la plataforma MP, se renderiza dentro de la propia capa flotante.
:::
