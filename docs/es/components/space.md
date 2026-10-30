# Espaciado

Se usa para disponer el espaciado entre elementos adyacentes, en sustitución de un `margin` escrito a mano. El espaciado se basa por completo en `gap` de CSS, admitido de forma nativa en ambas plataformas.

## Uso básico

```vue
<template>
  <lh-space>
    <lh-tag>Tinta china</lh-tag>
    <lh-tag>Espacio en blanco</lh-tag>
    <lh-tag>Estilo chino</lh-tag>
  </lh-space>
</template>
```

## Dirección

```vue
<template>
  <lh-space direction="vertical">
    <lh-tag>Tinta china</lh-tag>
    <lh-tag>Espacio en blanco</lh-tag>
  </lh-space>
</template>
```

## Niveles de espaciado

Los niveles preset hacen referencia a los spacing tokens (se pueden personalizar mediante `--lh-spacing-*`); los números se interpretan como px; un array controla por separado el espaciado horizontal y el vertical.

```vue
<template>
  <lh-space size="small">
    <lh-tag>Pequeño</lh-tag>
    <lh-tag>Pequeño</lh-tag>
  </lh-space>
  <lh-space size="medium">
    <lh-tag>Medio</lh-tag>
    <lh-tag>Medio</lh-tag>
  </lh-space>
  <lh-space size="large">
    <lh-tag>Grande</lh-tag>
    <lh-tag>Grande</lh-tag>
  </lh-space>
  <lh-space :size="24">
    <lh-tag>24px</lh-tag>
    <lh-tag>24px</lh-tag>
  </lh-space>
  <lh-space :size="[8, 16]">
    <lh-tag>Horizontal 8</lh-tag>
    <lh-tag>Vertical 16</lh-tag>
  </lh-space>
</template>
```

## Alineación y ajuste de línea

```vue
<template>
  <lh-space alignment="center">
    <lh-tag>Centrado</lh-tag>
    <lh-button type="primary" size="small">Botón</lh-button>
  </lh-space>
  <lh-space :wrap="true">
    <lh-tag v-for="i in 20" :key="i">Etiqueta {{ i }}</lh-tag>
  </lh-space>
</template>
```

::: tip El ajuste de línea solo funciona en dirección horizontal
`wrap` solo tiene sentido con `direction="horizontal"`; en dirección vertical se ignora.
:::

## Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| direction | Dirección de disposición | `'horizontal' \| 'vertical'` | `'horizontal'` |
| size | Espaciado: nivel preset / número de píxeles / [horizontal, vertical] | `'small' \| 'medium' \| 'large' \| number \| [number, number]` | `'medium'` |
| wrap | Si se permite el ajuste de línea (solo en dirección horizontal) | `boolean` | `true` |
| alignment | Forma de alineación | `'start' \| 'center' \| 'end' \| 'baseline'` | `'start'` |
| customClass | Clase personalizada | `string` | — |
| sx | Props rápidas de disposición | `LhSxProps` | — |

## Slots

| Slot | Descripción |
| --- | --- |
| default | Elementos hijos entre los que se dispone el espaciado |
