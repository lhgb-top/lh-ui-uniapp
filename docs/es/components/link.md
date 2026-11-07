# Link enlace

Hipervínculo de texto que admite tipos semánticos, forma del subrayado y slots de iconos prefijo/sufijo.

## Uso básico

```vue
<template>
  <lh-link>Enlace predeterminado</lh-link>
  <lh-link type="primary">Enlace principal</lh-link>
</template>
```

`type`: `default` (predeterminado) / `primary` / `success` / `warning` / `danger` / `info`.

## Subrayado

```vue
<template>
  <lh-link underline="always">Siempre</lh-link>
  <lh-link underline="none">Ninguno</lh-link>
</template>
```

`underline`: `always` siempre / `hover` aparece al pasar el cursor (predeterminado) / `none` ninguno.

## Deshabilitado y prefijo/sufijo

```vue
<template>
  <lh-link disabled>Enlace deshabilitado</lh-link>
  <lh-link>
    <template #prefix><lh-icon name="left" /></template>
    Página anterior
  </lh-link>
</template>
```

## Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| href | Dirección del enlace (no se renderiza href cuando está deshabilitado) | `string` | — |
| target | Ventana de destino (solo H5) | `string` | — |
| type | Tipo semántico del enlace | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| underline | Forma del subrayado | `'always' \| 'hover' \| 'none'` | `'hover'` |
| disabled | Deshabilitado | `boolean` | `false` |
| current | Marcador de página actual (emite `aria-current`) | `'page' \| 'location' \| true` | — |
| customClass | Clase personalizada | `string` | — |
| sx | Props de maquetación rápida | `LhSxProps` | — |

## Slots

| Ranura | Descripción |
| --- | --- |
| default | Texto del enlace |
| prefix | Slot para el icono prefijo |
| suffix | Slot para el icono sufijo |

## Events

| Evento | Descripción | Parámetros |
| --- | --- | --- |
| click | Clic | `(event: Event)` |

## Diferencias de plataforma

| Capacidad | H5 | Mini Programa |
| --- | --- | --- |
| Soporte | view + `@click` | Igual que H5 (`href` / `target` no tienen semántica de navegación; la navegación la gestiona la capa de negocio en el evento `click`) |
| Subrayado en hover | Sí | No (`underline="always"` / `"none"` siguen aplicándose; el subrayado renderizado del VIEW depende del resultado real) |
