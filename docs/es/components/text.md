# Text texto

Componente de tipografía integral para títulos, texto, elipsis y copia; todos los modificadores semánticos recaen en clases modificadoras BEM.

## Nivel

```vue
<template>
  <lh-text level="h1">Título 1</lh-text>
  <lh-text level="p">Párrafo de texto</lh-text>
  <lh-text level="caption">Nota auxiliar</lh-text>
</template>
```

`level` admite `h1` ~ `h6` / `p` (predeterminado) / `caption`. Un valor no válido degrada a `p`.

## Semántica y modificadores

```vue
<template>
  <lh-text type="success" strong>Éxito y negrita</lh-text>
  <lh-text mark>Marcado resaltado</lh-text>
  <lh-text code>Estilo de código</lh-text>
</template>
```

`type`: `default` (predeterminado) / `secondary` / `success` / `warning` / `danger`; propiedades modificadoras: `strong` / `italic` / `underline` / `mark` / `code` / `disabled`.

## Elipsis

```vue
<template>
  <lh-text :ellipsis="true">Elipsis de una línea</lh-text>
  <lh-text :ellipsis="2">Elipsis de dos líneas</lh-text>
</template>
```

`ellipsis` con `true` aplica elipsis de una línea; un número trunca por líneas (máximo 10; la elipsis multilínea usa `-webkit-line-clamp` en línea).

## Copia

```vue
<template>
  <lh-text copyable copy-text="Texto fijo">Pulsa el botón para copiar</lh-text>
</template>
```

`copyable` añade un botón de copia: al pulsarlo escribe en el portapapeles, cambia brevemente a "Copiado" y emite el evento `copy` (el argumento es el texto realmente escrito).

::: tip Copia en el Mini Programa
En H5, cuando no se pasa `copy-text` se toma automáticamente el texto del slot; **el Mini Programa no puede leer el texto del slot, por lo que `copy-text` es obligatorio**, de lo contrario el botón no escribe nada (la pulsación sigue emitiendo el evento `copy`). Las etiquetas provienen del paquete de idioma `text.copy` / `text.copied` y se pueden sobrescribir con `copy-label`.
:::

## Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| level | Nivel de título y forma de párrafo | `'h1' \| ... \| 'h6' \| 'p' \| 'caption'` | `'p'` |
| type | Color semántico | `'default' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | `'default'` |
| strong / italic / underline / mark / code / disabled | Modificadores booleanos | `boolean` | `false` |
| ellipsis | Elipsis: `true` para una línea, un número para el número de líneas | `boolean \| number` | `false` |
| copyable | Añade el botón de copia | `boolean` | `false` |
| copyLabel | Nombre accesible del botón de copia | `string` | — |
| copyText | Texto a copiar (obligatorio en el Mini Programa) | `string` | — |
| customClass | Clase personalizada | `string` | — |
| sx | Props de maquetación rápida | `LhSxProps` | — |

## Events

| Evento | Descripción | Parámetros |
| --- | --- | --- |
| copy | Clic en el botón de copia | `(text: string)` |

## Diferencias de plataforma

| Capacidad | H5 | Mini Programa |
| --- | --- | --- |
| Soporte de renderizado | view (la tipografía recae en las clases `lh-text--<level>`) | Igual que H5 |
| Copia | Toma el texto del slot automáticamente cuando no se pasa `copy-text` (`navigator.clipboard`) | `copy-text` es obligatorio; pasa por `uni.setClipboardData` (con un aviso del sistema) |
