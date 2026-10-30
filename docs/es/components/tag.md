# Etiqueta

## Uso básico

```vue
<template>
  <lh-tag>Predeterminada</lh-tag>
  <lh-tag type="primary">Principal</lh-tag>
  <lh-tag type="success">Éxito</lh-tag>
  <lh-tag type="warning">Aviso</lh-tag>
  <lh-tag type="danger">Peligro</lh-tag>
</template>
```

## Estilo y cierre

```vue
<template>
  <lh-tag round>Redondeada</lh-tag>
  <lh-tag hit>Contorneada</lh-tag>
  <lh-tag closable @close="onClose">Se puede cerrar</lh-tag>
</template>

<script setup lang="ts">
const onClose = () => console.log('Cerrada')
</script>
```

## Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| type | Tipo | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| size | Tamaño | `'small' \| 'medium' \| 'large'` | — |
| closable | Se puede cerrar | `boolean` | `false` |
| disabled | Desactivada | `boolean` | `false` |
| round | Esquinas redondeadas | `boolean` | `false` |
| hit | Contorneada (sin relleno) | `boolean` | `false` |
| customClass | Clase personalizada | `string` | — |
| sx | Props rápidas de disposición | `LhSxProps` | — |

## Events

| Evento | Descripción | Parámetros de la retrollamada |
| --- | --- | --- |
| close | Clic en el botón de cierre | — |

::: tip Diferencias frente a la versión Vue3
El SVG en línea del botón de cierre se sustituye en esta biblioteca por lh-icon (solución iconfont).
:::
