# Popover (globo de información)

Un popover de contenido enriquecido: transporta más información que un Tooltip (título, cuerpo, nodos interactivos). El disparador se envuelve en el slot predeterminado y el contenido del popover se pasa mediante el slot `content`; la capa emergente es `role="dialog"` con una flecha que siempre apunta al disparador.

## Uso básico

```vue
<template>
  <lh-popover title="Consejo de tinta" placement="top">
    <lh-button>Haga clic para mostrar</lh-button>
    <template #content>
      <text>Esto es contenido enriquecido; se puede colocar cualquier nodo.</text>
    </template>
  </lh-popover>
</template>
```

::: warning El Mini Programa no tiene semántica de hover / focus
`trigger` es `click` por defecto (disponible en todos los destinos). `hover` / `focus` solo son válidos en H5: en el Mini Programa se degradan automáticamente a alternancia por toque / pulsación (el primer toque abre, el segundo cierra).
:::

## Métodos de disparo

```vue
<template>
  <!-- Disparo por hover (solo H5; se degrada a alternancia por toque en el Mini Programa) -->
  <lh-popover trigger="hover" title="Disparo por hover">
    <lh-button>Pase el puntero</lh-button>
    <template #content><text>Mover el puntero a la capa emergente no la cierra.</text></template>
  </lh-popover>

  <!-- Disparo por foco (solo H5) -->
  <lh-popover trigger="focus" title="Disparo por foco">
    <lh-input placeholder="Enfoque el campo" />
    <template #content><text>Se muestra cuando el campo recibe el foco.</text></template>
  </lh-popover>

  <!-- Manual: la visibilidad se controla completamente con v-model:visible externo -->
  <lh-popover v-model:visible="manualVisible" trigger="manual" title="Control manual">
    <lh-button @click="manualVisible = !manualVisible">Interruptor externo</lh-button>
    <template #content><text>La visibilidad se controla completamente desde el estado externo.</text></template>
  </lh-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const manualVisible = ref(false)
</script>
```

> Los retardos `showAfter` / `hideAfter` solo se aplican a hover / focus (H5); `click` y `manual` responden de inmediato.

## Doce posiciones

```vue
<template>
  <lh-popover
    v-for="p in placements"
    :key="p"
    :placement="p"
    :title="p"
  >
    <lh-button size="small">{{ p }}</lh-button>
    <template #content><text>Posición: {{ p }}</text></template>
  </lh-popover>
</template>

<script setup lang="ts">
const placements = [
  'top', 'top-start', 'top-end',
  'bottom', 'bottom-start', 'bottom-end',
  'left', 'left-start', 'left-end',
  'right', 'right-start', 'right-end',
] as const
</script>
```

> Cuando falta espacio en el viewport, la capa emergente se voltea automáticamente (flip) y se reintegra en el eje cruzado (shift); la posición de la flecha cambia en consecuencia.

## Ancho, flecha y deshabilitado

```vue
<template>
  <!-- Ancho fijo -->
  <lh-popover title="Ancho fijo" width="240">
    <lh-button>Ancho fijo</lh-button>
    <template #content><text>El ancho de la capa emergente se fija con width.</text></template>
  </lh-popover>

  <!-- Sin flecha -->
  <lh-popover title="Sin flecha" :arrow="false">
    <lh-button>Sin flecha</lh-button>
    <template #content><text>Cuando arrow es false no se dibuja la flecha.</text></template>
  </lh-popover>

  <!-- Deshabilitado -->
  <lh-popover title="Deshabilitado" disabled>
    <lh-button disabled>Disparador deshabilitado</lh-button>
    <template #content><text>Con disabled ni el disparador ni la capa emergente responden.</text></template>
  </lh-popover>
</template>
```

## Popover API

### Props

| Propiedad | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| placement | Posición de la capa (12 posiciones) | `LhPopoverPlacement` | `'top'` |
| trigger | Método de disparo: `click` (todos los destinos) / `hover`, `focus` (solo H5, se degrada a toque en MP) / `manual` (controlado) | `'click' \| 'hover' \| 'focus' \| 'manual'` | `'click'` |
| title | Título (también disponible como slot title) | `string` | — |
| visible | Visibilidad controlada manualmente (v-model:visible) | `boolean` | — |
| disabled | Deshabilitado | `boolean` | `false` |
| arrow | Mostrar la flecha | `boolean` | `true` |
| width | Ancho de la capa emergente (los números son px) | `string \| number` | — |
| popperClass | Clase personalizada para la capa emergente | `string` | — |
| showAfter | Retardo de aparición (ms, solo hover / focus en H5) | `number` | — |
| hideAfter | Retardo de ocultación (ms, solo hover / focus en H5) | `number` | — |
| themeVars | Variables de tema a nivel de componente | `Record<string, string>` | — |
| bgPattern | Patrón de fondo a nivel de componente, anula ConfigProvider | `string` | — |
| sx | Propiedades de maquetación rápida sx (aplicadas al elemento raíz del disparador) | `LhSxProps` | — |

### Events

| Evento | Descripción | Parámetros |
| --- | --- | --- |
| update:visible | Cambio de visibilidad (v-model) | `(value: boolean)` |
| show | Se emite tras mostrarse | — |
| hide | Se emite tras ocultarse | — |

### Slots

| Slot | Descripción |
| --- | --- |
| default | Contenido del disparador |
| title | Título personalizado |
| content | Contenido emergente |

### Methods

| Método | Descripción |
| --- | --- |
| show | Mostrar programáticamente |
| hide | Ocultar programáticamente |
| toggle | Alternar programáticamente |

### Accesibilidad

- El disparador lleva `aria-haspopup="true"` junto con `aria-expanded` / `aria-controls`; la capa emergente es `role="dialog"` y, con título, se enlaza mediante `aria-labelledby`
- Esc cierra, hacer clic fuera de la capa emergente (máscara transparente en la página) cierra; con varias capas apiladas Esc cierra solo la superior (todo ello solo en H5)
- El motor de posicionamiento es una función pura propia (protección contra desbordes flip / shift), sin dependencias de terceros en tiempo de ejecución

::: tip Diferencias de plataforma (diferencias con la versión Vue3)
- **Métodos de disparo**: el Mini Programa no tiene semántica de hover / focus, por lo que `trigger="hover"` / `trigger="focus"` se degradan a alternancia por toque / pulsación en MP; los retardos (`showAfter` / `hideAfter`) solo se aplican a los modos hover / focus en H5, mientras que `click` y `manual` responden de inmediato.
- **Transporte y posicionamiento de la capa**: sin prop `teleportTarget` — el Mini Programa no tiene teleport de DOM, así que la capa se transporta con `root-portal` (con respaldo fijo dentro de la página en versiones antiguas); el posicionamiento popper usa medición asíncrona de dos fotogramas (renderizar oculto para medir → `computePosition` → mostrar, para evitar parpadeos). El cálculo es asíncrono; no asuma un resultado sincrónico. El desplazamiento de la flecha lo escribe el pegamento del componente en `--lh-arrow-offset` a partir del `arrowOffset` del resultado.
- **Comportamiento de teclado solo en H5**: el cierre con Esc usa un listener a nivel de documento (cierra solo la capa superior cuando hay varias apiladas); el Mini Programa no tiene eventos de teclado y todo el bloque se elimina mediante compilación condicional.
- **Sin trampa de foco**: el disparo por clic de plus atrapa el foco dentro de la capa (focus-trap) y lo devuelve al cerrar; MP no tiene semántica de foco de teclado y, como el Dialog de este repositorio, no se porta en absoluto.
- **Sin transición de entrada/salida**: plus anima con `Transition`; `Transition` no es fiable en MP y, como tooltip / dropdown, no se enlaza transición.
- **Sin cierre automático al salir el disparador del viewport**: el `useLhPopper` de plus tiene una retrollamida scroll-out; uni-app no tiene un canal unificado de escucha de desplazamiento / cambio de tamaño, por lo que no se portó.
:::
