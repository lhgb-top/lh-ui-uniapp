# InputTag entrada de etiquetas

Grupo de etiquetas que se envía al escribir, con teclas de disparo, límite, deduplicación y eliminación al pulsar.

## Uso básico

```vue
<script setup>
import { ref } from 'vue'
const tags = ref(['tinta', 'espacio'])
</script>

<template>
  <lh-input-tag v-model="tags" placeholder="Pulsa Enter para enviar" />
</template>
```

## Teclas de disparo

`trigger` admite `enter` (predeterminado) / `space` / `comma`. Cuando el disparo es `space` / `comma`, el espacio en blanco no entra en el campo.

```vue
<template>
  <lh-input-tag v-model="tags" trigger="comma" placeholder="Escribe una coma para enviar" />
</template>
```

## Límite y deduplicación

```vue
<template>
  <lh-input-tag v-model="tags" :max="3" allow-duplicate />
</template>
```

Cuando `max` es positivo fija el límite (los envíos que lo superan se rechazan y la entrada se vacía); por defecto no se permiten duplicados (un duplicado no se envía).

## Solo lectura y deshabilitado

```vue
<template>
  <lh-input-tag v-model="tags" readonly />
  <lh-input-tag v-model="tags" disabled />
</template>
```

## Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| modelValue | Lista de etiquetas (v-model) | `string[]` | `[]` |
| trigger | Tecla de disparo del envío (en el Mini Programa siempre es la tecla Listo) | `'enter' \| 'space' \| 'comma'` | `'enter'` |
| placeholder | Texto del marcador (solo se muestra cuando no hay etiquetas) | `string` | `''` |
| placeholderStyle | Estilo del marcador (sustituye a `::placeholder`) | `string` | — |
| max | Límite de etiquetas (un valor no positivo significa ilimitado) | `number` | `0` |
| allowDuplicate | Permite etiquetas duplicadas | `boolean` | `false` |
| readonly | Solo lectura | `boolean` | `false` |
| disabled | Deshabilitado | `boolean` | `false` |
| ariaLabel | Nombre accesible | `string` | — |
| customClass | Clase personalizada | `string` | — |
| sx | Props de maquetación rápida | `LhSxProps` | — |

## Events

| Evento | Descripción | Parámetros |
| --- | --- | --- |
| update:modelValue | Cambio en la lista de etiquetas | `(value: string[])` |
| change | Cambio en la lista de etiquetas (igual que modelValue) | `(value: string[])` |
| add | Envío de una etiqueta | `(tag: string)` |
| remove | Eliminación de una etiqueta | `(tag: string)` |

## Métodos (defineExpose)

| Método | Descripción |
| --- | --- |
| focus | Enfoca el campo |
| commit | Envía la entrada actual |

## Diferencias de plataforma

| Capacidad | H5 | Mini Programa |
| --- | --- | --- |
| Tecla de disparo del envío | Todos los valores de `trigger` (eventos de teclado Enter / Space / Comma) | Siempre la **tecla Listo** (`@confirm`); las teclas `space` / `comma` son solo para H5 |
| Eliminar con Backspace | Backspace elimina la última etiqueta cuando la entrada está vacía | Sin eventos de teclado; la eliminación se hace con el **botón ×** de cada etiqueta (disponible en ambas plataformas) |
| Envío al perder el foco | Sí | Sí |
| Borde de foco | El estilo de foco con `:has()` se aplica | Sin borde de foco (WXSS no admite `:has()`); la entrada funciona con normalidad |
