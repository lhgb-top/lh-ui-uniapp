# Tooltip (información sobre herramientas)

## Uso básico

```vue
<template>
  <lh-tooltip content="Este es el texto de la sugerencia">
    <lh-button>Clic para ver la sugerencia</lh-button>
  </lh-tooltip>
</template>
```

::: warning El Mini Programa no tiene semántica de hover
El valor por defecto de `trigger` es `click` (disponible en todas las plataformas). `hover` solo es efectivo en H5:
en la plataforma MP usa `trigger="click"`; la apertura y el cierre se producen por clic / toque.
:::

## Posición y ancho

```vue
<template>
  <lh-tooltip content="Sugerencia inferior" placement="bottom">
    <lh-button>bottom</lh-button>
  </lh-tooltip>

  <lh-tooltip content="El texto largo se ajusta automáticamente" :max-width="200" placement="top">
    <lh-button>Limitar el ancho</lh-button>
  </lh-tooltip>
</template>
```

## Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| content | Texto de la sugerencia | `string` | — |
| placement | Posición de la capa flotante (12 posiciones) | `LhTooltipPlacementCore` | `'top'` |
| trigger | Forma de disparo: `click` (en todas las plataformas) / `hover` (solo H5) | `'click' \| 'hover'` | `'click'` |
| showDelay | Retardo de mostrado (milisegundos) | `number` | — |
| hideDelay | Retardo de ocultación (milisegundos) | `number` | — |
| maxWidth | Ancho máximo (el contenido se ajusta automáticamente) | `string \| number` | — |
| disabled | Desactivado | `boolean` | `false` |
| customClass | Clase personalizada | `string` | — |
| themeVars | Variables de tema a nivel de componente | `Record<string, string>` | — |
| sx | Props rápidas de disposición | `LhSxProps` | — |

## Events

| Evento | Descripción | Parámetros de la retrollamada |
| --- | --- | --- |
| update:modelValue | Cambio de visibilidad (uso controlado) | `(visible: boolean)` |
| show | Mostrado | — |
| hide | Ocultación | — |

::: tip Diferencias frente a la versión Vue3
- La capa flotante usa `root-portal` + medición asíncrona en dos fotogramas (primero se renderiza de forma transparente para medir → se posiciona → se muestra, para evitar parpadeos).
- En la plataforma MP, `showDelay` / `hideDelay` solo conservan el comportamiento inmediato en modo click.
- El cálculo del posicionamiento es asíncrono (`getLhRect` devuelve una Promise); no se puede asumir que el resultado se obtiene de forma síncrona.
:::
