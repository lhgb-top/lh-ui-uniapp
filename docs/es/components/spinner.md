# Spinner (Indicador de carga)

Figura básica en rotación que indica un estado en curso. La capa de carga (el servicio LhLoading) también la renderiza internamente.

## Uso básico

Cinco tamaños: `mini` / `small` / `medium` / `large` / `x-large`. Los diámetros provienen de una única constante de mapeo (`LH_SPINNER_SIZE_PX`) del core de `@lh-ui/share` (12 / 16 / 24 / 32 / 40 px).

```vue
<template>
  <lh-spinner />
  <lh-spinner size="mini" />
  <lh-spinner size="small" />
  <lh-spinner size="medium" />
  <lh-spinner size="large" />
  <lh-spinner size="x-large" />
</template>
```

## Color personalizado

`color` acepta cualquier valor de color CSS; si se omite, la figura hereda el color de texto actual (`currentColor`).

```vue
<template>
  <lh-spinner color="#C4A35A" />
  <lh-spinner color="#5B8C5A" />
  <lh-spinner color="#B5462F" />
</template>
```

## Heredar el color del texto

Sin `color`, la figura sigue el color de texto del contenedor donde se ubica, ideal para composiciones mezcladas con texto.

```vue
<template>
  <view class="row">
    <text>Cargando…</text>
    <lh-spinner size="small" />
  </view>
</template>
```

## Props

| Propiedad | Descripción | Tipo | Valor por defecto |
| --- | --- | --- | --- |
| size | Tamaño | `'mini' \| 'small' \| 'medium' \| 'large' \| 'x-large'` | `'medium'` |
| color | Color de rotación (cualquier valor de color CSS; por defecto hereda currentColor) | `string` | — |
| customClass | Nombre de clase personalizado | `string` | — |
| sx | Props rápidas de diseño | `LhSxProps` | — |

## Diferencias de plataforma

- **La animación de rotación es una animación CSS pura**: no usa ninguna API de plataforma, funciona en todas las plataformas y se comporta de forma idéntica en H5 y en el Mini Programa de WeChat.
- **La figura se renderiza por plataforma**: en H5 es un anillo svg trazado (animación doble de `stroke-dasharray`, idéntica píxel a píxel a la versión Vue 3); el Mini Programa no soporta etiquetas de plantilla svg, así que usa un anillo de `view` + `border` — tres lados coloreados forman un arco de aproximadamente tres cuartos del círculo (visualmente isomorfo al arco del 72% de la versión Vue 3) y el grosor del trazo se calcula en línea al 10% del diámetro (con un mínimo de 1px). En ambas plataformas la rotación es una animación CSS, por lo que no se apoya en capacidades poco fiables del Mini Programa como `transitionend`.
- **El color fluye por currentColor**: la prop `color` se escribe en el estilo `color` en línea del nodo raíz y la figura lo hereda, exactamente igual que en la versión Vue 3.
- **Accesibilidad**: la figura es puramente decorativa y se saca del árbol de accesibilidad con `aria-hidden="true"`; el estado de progreso lo debe comunicar el contenedor ancestro (por ejemplo `role="status"`).
- **Movimiento reducido**: la degradación a un semianillo estático con `prefers-reduced-motion` la proporciona el código scss de `@lh-ui/share`; ese bloque de media query se elimina por completo durante la compilación del Mini Programa (WXSS no lo soporta), por lo que la degradación solo aplica en H5.
- **Conclusión del traslado**: Spinner es un componente puramente de presentación (sin mediciones, sin capas superpuestas, sin dependencia de document); el mapeo de tamaños y los nombres de clase los producen las funciones puras del core de `@lh-ui/share` (`getSpinnerClassNames` / `LH_SPINNER_SIZE_PX`) y este repositorio solo añade el pegamento reactivo.
