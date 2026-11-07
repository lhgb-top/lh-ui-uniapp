# Mentions

Un campo de mención de miembros que se activa al escribir `@`, con soporte de filtrado, múltiples líneas y un callback de selección.

## Uso básico

```vue
<script setup>
import { ref } from 'vue'
const value = ref('')
const members = [
  { label: 'Tinta', value: 'ink' },
  { label: 'Espacio en blanco', value: 'blank' },
]
</script>

<template>
  <lh-mentions v-model="value" :options="members" />
</template>
```

Al escribir `@` se abre el panel de sugerencias y, al seguir escribiendo, se filtra por label. Lo que se escribe de vuelta al seleccionar es el `label` (un `@Tinta ` legible por humanos); el identificador legible por máquina `value` se entrega a la capa de negocio mediante el evento `select`.

## Múltiples líneas

```vue
<template>
  <lh-mentions v-model="value" :options="members" multiline />
</template>
```

`multiline` sustituye el input de una sola línea por un textarea.

## Carácter de activación

```vue
<template>
  <lh-mentions v-model="value" :options="members" prefix="#" />
</template>
```

`prefix` por defecto es `'@'`; un pseudo-prefijo pegado a un carácter de palabra ASCII (como `user@` en un correo) no se activa.

## Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| modelValue | Contenido del texto (v-model) | `string` | `''` |
| options | Miembros sugeridos | `LhMentionOption[]` | `[]` |
| prefix | Carácter de activación | `string` | `'@'` |
| placeholder | Texto de marcador de posición (por defecto proviene del mensaje de idioma mentions.placeholder) | `string` | — |
| placeholderStyle | Estilo del marcador de posición (sustituye a `::placeholder`) | `string` | — |
| disabled | Deshabilitar el componente | `boolean` | `false` |
| multiline | Textarea de múltiples líneas | `boolean` | `false` |
| ariaLabel | Nombre accesible | `string` | — |
| customClass | Clase personalizada | `string` | — |
| sx | Propiedades de diseño rápido | `LhSxProps` | — |

## Slots

| Ranura | Descripción |
| --- | --- |
| empty | Estado vacío cuando no hay coincidencias (el texto por defecto proviene del mensaje de idioma mentions.noMatch) |

## Events

| Evento | Descripción | Parámetros |
| --- | --- | --- |
| update:modelValue | Escribe el valor de vuelta tras la entrada o la selección | `(value: string)` |
| change | El texto cambió | `(value: string)` |
| select | Se seleccionó una mención | `(option: LhMentionOption)` |

## Métodos (defineExpose)

| Método | Descripción |
| --- | --- |
| updateContext | Actualizar manualmente el contexto del cursor |
| close | Cerrar el panel de sugerencias |

## Diferencias de plataforma

| Capacidad | H5 | Mini Programa |
| --- | --- | --- |
| Posicionamiento del desplegable | root-portal + medición de dos fotogramas (igual que select) | Alipay usa root-portal o fixed en página según la versión de la biblioteca base; Douyin usa fixed en página |
| Contexto del cursor | `selectionStart` nativo (la mención puede activarse en medio del texto) | **No se puede obtener la posición del cursor, se aproxima con el final del texto** — activar una mención en medio de un texto ya escrito no funciona y degrada a inserción al final |
| Navegación por teclado / Esc | Las flechas mueven el resaltado, Enter selecciona, Esc cierra | Sin eventos de teclado; selección únicamente con clic |
| Posición del cursor tras la selección | Se sitúa exactamente después de la mención | Tras la escritura controlada, el cursor queda al final |
