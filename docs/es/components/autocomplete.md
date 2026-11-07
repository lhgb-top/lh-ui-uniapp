# Autocomplete

Un campo de sugerencias que filtra mientras se escribe: una caja de texto (combobox) más una lista desplegable de sugerencias (listbox).

## Uso básico

```vue
<script setup>
import { ref } from 'vue'
const value = ref('')
const options = [
  { label: 'Tinta' },
  { label: 'Espacio en blanco' },
  { label: 'Sello', value: 'seal' },
]
</script>

<template>
  <lh-autocomplete v-model="value" :options="options" />
</template>
```

Cuando una opción solo lleva `label`, el valor enviado es el propio label; añade un `value` cuando se necesite un identificador legible por máquina. Las opciones deshabilitadas permanecen en la lista, atenuadas y no seleccionables.

## Filtrado

Por defecto, las sugerencias se filtran según si el `label` contiene la cadena de consulta (sin distinguir mayúsculas de minúsculas, y los espacios en blanco al inicio y al final no participan en la coincidencia):

```vue
<template>
  <lh-autocomplete v-model="value" :options="options" case-sensitive />
</template>
```

`case-sensitive` activa la coincidencia sensible a mayúsculas; pasa `trim` como `false` para mantener los espacios en blanco en la coincidencia.

## Callback de selección

```vue
<template>
  <lh-autocomplete v-model="value" :options="options" @select="onSelect" />
</template>
```

El evento `select` recibe el valor enviado y el objeto de opción original.

## Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| modelValue | Valor de entrada (v-model) | `string` | `''` |
| options | Opciones de sugerencia | `LhAutocompleteOption[]` | `[]` |
| caseSensitive | Coincidencia sensible a mayúsculas | `boolean` | `false` |
| trim | Recortar los espacios en blanco del inicio y final de la consulta antes de coincidir | `boolean` | `true` |
| placeholder | Texto de marcador de posición | `string` | — |
| placeholderStyle | Estilo del marcador de posición (sustituye a `::placeholder`) | `string` | — |
| disabled | Deshabilitar el componente | `boolean` | `false` |
| openOnFocus | Abrir el panel de sugerencias al enfocar | `boolean` | `true` |
| ariaLabel | Nombre accesible | `string` | — |
| customClass | Clase personalizada | `string` | — |
| sx | Propiedades de diseño rápido | `LhSxProps` | — |

## Slots

| Ranura | Descripción |
| --- | --- |
| empty | Estado vacío cuando no hay coincidencias (el texto por defecto proviene del mensaje de idioma autocomplete.noMatch) |

## Events

| Evento | Descripción | Parámetros |
| --- | --- | --- |
| update:modelValue | Escribe el valor de vuelta tras la entrada o la selección | `(value: string)` |
| change | El valor de entrada cambió | `(value: string)` |
| select | Se seleccionó una sugerencia | `(value: string \| number, option: LhAutocompleteOption)` |

## Métodos (defineExpose)

| Método | Descripción |
| --- | --- |
| open / close | Abrir / cerrar el panel manualmente |
| isOpen | Estado actual de abierto/cerrado (solo lectura) |

## Diferencias de plataforma

| Capacidad | H5 | Mini Programa |
| --- | --- | --- |
| Posicionamiento del desplegable | root-portal + medición de dos fotogramas (igual que select) | Alipay usa root-portal o fixed en página según la versión de la biblioteca base; Douyin usa fixed en página |
| Navegación por teclado / Esc | Las flechas mueven el resaltado, Enter selecciona, Esc cierra | Sin eventos de teclado; selección únicamente con clic |
| Resaltado hover | Sí | No (el clic selecciona directamente) |
| openOnFocus | Se abre al enfocar | Se abre al enfocar |
