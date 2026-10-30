# Barra de progreso

Muestra el progreso de una tarea; admite colores por estado, colores personalizados y formato de texto personalizado.

## Uso básico

```vue
<template>
  <lh-progress :percentage="42" />
</template>
```

## Estados

```vue
<template>
  <lh-progress :percentage="70" status="success" />
  <lh-progress :percentage="70" status="warning" />
  <lh-progress :percentage="70" status="exception" />
  <lh-progress :percentage="100" />
</template>
```

Cuando `status` es `normal` y se alcanza 100, se considera automáticamente `success`.

## Grosor de trazo y ocultación del texto

```vue
<template>
  <lh-progress :percentage="60" :stroke-width="12" />
  <lh-progress :percentage="60" :show-text="false" />
</template>
```

## Color personalizado

Una cadena se usa directamente como color de la barra; una función devuelve el color en función del porcentaje.

```vue
<template>
  <lh-progress :percentage="60" color="#C4A35A" />
  <lh-progress :percentage="60" :color="gradient" />
</template>

<script setup lang="ts">
const gradient = (p: number) => `rgb(${p}, 0, 0)`
</script>
```

## Formato personalizado y slot de texto

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
const format = (p: number) => `Progreso ${p}`
</script>
```

## Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| percentage | Porcentaje de progreso 0-100 (al superarlo se aplica clamp automáticamente) | `number` | `0` |
| type | Tipo | `'line' \| 'circle'` | `'line'` |
| status | Estado | `'normal' \| 'success' \| 'warning' \| 'exception'` | `'normal'` |
| color | Color de la barra: cadena o función que devuelve el color según el porcentaje | `string \| ((percentage: number) => string)` | — |
| strokeWidth | Grosor del trazo, en px | `number` | `6` |
| width | Ancho del lienzo en modo circular, en px | `number` | `126` |
| showText | Si se muestra el texto | `boolean` | `true` |
| format | Formato de texto personalizado | `(percentage: number) => string` | — |
| customClass | Clase personalizada | `string` | — |
| sx | Props rápidas de disposición | `LhSxProps` | — |

## Slots

| Slot | Descripción | Parámetros de ámbito |
| --- | --- | --- |
| text | Texto de progreso personalizado | `{ percentage: number }` |

::: tip El tipo circle aún no está implementado
El Mini Programa admite svg de forma limitada, de modo que la primera versión solo implementa el tipo line. Al pasar `type="circle"` se renderiza como line y, en desarrollo, se emite una advertencia una sola vez (sin degradación silenciosa); el tipo circle queda para una segunda fase.
:::
