# Popconfirm (burbuja de confirmación)

Confirmación ligera en línea: muestra una burbuja de confirmación junto al disparador sin necesidad de abrir un diálogo. La semántica es de confirmación bloqueante (`role="alertdialog"`): Escape cuenta como cancelación. El contenido de confirmación se pasa mediante el slot `content` o la prop `title`, y el disparador se envuelve en el slot predeterminado.

## Uso básico

```vue
<template>
  <lh-popconfirm title="¿Eliminar este registro?" @confirm="onConfirm" @cancel="onCancel">
    <lh-button type="danger">Eliminar</lh-button>
  </lh-popconfirm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const action = ref('')
function onConfirm() {
  action.value = 'confirmado'
}
function onCancel() {
  action.value = 'cancelado'
}
</script>
```

::: warning El Mini Program no tiene semántica de hover / focus
`trigger` es `click` por defecto (disponible en todos los destinos). `hover` / `focus` solo son válidos en H5; en el Mini Program se degradan automáticamente a alternancia por toque (el primer toque abre, el segundo cierra).
:::

## Tres tonos

`type` determina el icono de tono y la clase modificadora: `info` (información) / `warning` (advertencia, por defecto) / `danger` (peligro).

```vue
<template>
  <lh-popconfirm type="info" title="¿Ver el registro de acceso de este elemento?">
    <lh-button>Información</lh-button>
  </lh-popconfirm>
  <lh-popconfirm type="warning" title="Esta acción notificará a todos los miembros.">
    <lh-button type="warning">Advertencia</lh-button>
  </lh-popconfirm>
  <lh-popconfirm type="danger" title="No se puede deshacer después de eliminar.">
    <lh-button type="danger">Peligro</lh-button>
  </lh-popconfirm>
</template>
```

## Textos personalizados y posición

```vue
<template>
  <lh-popconfirm
    title="Podrás restaurarlo desde la papelera después de archivarlo."
    confirm-text="Archivar"
    cancel-text="Pensarlo mejor"
    placement="right"
  >
    <lh-button>Textos personalizados</lh-button>
  </lh-popconfirm>

  <!-- Disparador por hover (solo H5; se degrada a alternancia por toque en el Mini Program) -->
  <lh-popconfirm title="Pasa el cursor para confirmar." trigger="hover" :show-after="0" placement="bottom">
    <lh-button>Disparador hover</lh-button>
  </lh-popconfirm>
</template>
```

> Los textos de los botones toman por defecto las claves de idioma `popconfirm.confirm` / `popconfirm.cancel`; pueden sobrescribirse con `confirm-text` / `cancel-text`.

## Visibilidad controlada e icono

```vue
<template>
  <!-- Controlado: la visibilidad la gestiona totalmente el v-model:visible externo -->
  <lh-popconfirm v-model:visible="pcVisible" trigger="manual" title="Burbuja controlada">
    <lh-button @click="pcVisible = !pcVisible">{{ pcVisible ? 'Ocultar' : 'Mostrar' }}</lh-button>
  </lh-popconfirm>

  <!-- Interruptor de icono y tipo del botón de confirmación -->
  <lh-popconfirm title="¿Eliminar este registro?" :show-icon="false" confirm-button-type="primary">
    <lh-button type="danger">Sin icono</lh-button>
  </lh-popconfirm>

  <!-- Deshabilitado -->
  <lh-popconfirm title="Esta acción no está disponible." disabled>
    <lh-button disabled>Deshabilitado</lh-button>
  </lh-popconfirm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const pcVisible = ref(false)
</script>
```

## Popconfirm API

### Props

| Prop | Descripción | Tipo | Por defecto |
| --- | --- | --- | --- |
| type | Tono de confirmación: `info` / `warning` / `danger` | `'info' \| 'warning' \| 'danger'` | `'warning'` |
| placement | Posición de la capa (12 posiciones) | `LhPopconfirmPlacement` | `'top'` |
| trigger | Método de disparo: `click` (todos los destinos) / `hover`, `focus` (solo H5, se degrada a toque en MP) / `manual` (controlado) | `'click' \| 'hover' \| 'focus' \| 'manual'` | `'click'` |
| title | Contenido de confirmación (también disponible como slot content) | `string` | — |
| confirmText | Texto del botón de confirmación (usa la clave popconfirm.confirm si no se indica) | `string` | — |
| cancelText | Texto del botón de cancelación (usa la clave popconfirm.cancel si no se indica) | `string` | — |
| confirmButtonType | Tipo del botón de confirmación | `'default' \| 'primary'` | `'primary'` |
| visible | Visibilidad controlada manualmente (v-model:visible) | `boolean` | — |
| disabled | Deshabilitado | `boolean` | `false` |
| showIcon | Mostrar el icono de tono | `boolean` | `true` |
| popperClass | Nombre de clase personalizado de la capa | `string` | — |
| showAfter | Retardo de aparición (ms, solo hover / focus en H5) | `number` | — |
| hideAfter | Retardo de ocultación (ms, solo hover / focus en H5) | `number` | — |
| themeVars | Variables de tema a nivel de componente | `Record<string, string>` | — |
| bgPattern | Patrón de fondo a nivel de componente, sobrescribe ConfigProvider | `string` | — |
| sx | Propiedades de maquetación rápida (aplicadas al elemento raíz del disparador) | `LhSxProps` | — |

### Events

| Evento | Descripción | Parámetros |
| --- | --- | --- |
| confirm | Se dispara tras pulsar el botón de confirmación | — |
| cancel | Se dispara tras pulsar el botón de cancelación o Escape | — |
| update:visible | Visibilidad modificada (v-model) | `(value: boolean)` |
| show | Se dispara tras mostrarse | — |
| hide | Se dispara tras ocultarse | — |

### Slots

| Slot | Descripción |
| --- | --- |
| default | Contenido del disparador |
| content | Contenido de confirmación personalizado |

### Methods

| Método | Descripción |
| --- | --- |
| show | Mostrar programáticamente |
| hide | Ocultar programáticamente |
| toggle | Alternar programáticamente |

### Accesibilidad

- La capa es `role="alertdialog"` + `aria-modal="true"`; el contenido de confirmación se vincula mediante `aria-labelledby`; el disparador lleva `aria-haspopup` / `aria-expanded` / `aria-controls` (el paquete de atributos lo generan funciones puras de share)
- Escape cuenta como cancelación (alineado con el patrón alertdialog de WAI-ARIA: Escape cierra y cuenta como rechazo); con varias capas apiladas Esc solo cierra la superior (solo H5)
- Pulsar el botón de cancelación o la máscara transparente fuera de los botones cierra la burbuja; el icono de tono es decorativo (`aria-hidden`)
- El motor de posicionamiento es una función pura propia (protección contra desbordamiento flip / shift) sin dependencias de terceros en tiempo de ejecución

::: tip Diferencias de plataforma (diferencias con la versión Vue3)
- **Métodos de disparo**: el Mini Program no tiene semántica de hover / focus; `trigger="hover"` / `trigger="focus"` se degradan a alternancia por toque en MP; los retardos `showAfter` / `hideAfter` solo se aplican a los modos hover / focus en H5, mientras que `click` y `manual` responden de inmediato.
- **Portador y posicionamiento de la capa**: sin prop `teleportTarget` — el Mini Program no tiene DOM teleport, así que la capa la transporta `root-portal` (con fallback fixed dentro de la página en versiones antiguas); el posicionamiento popper usa medición asíncrona de dos fotogramas (renderizar oculto para medir → `computePosition` → mostrar, para evitar parpadeos). El cálculo es asíncrono; no asumas un resultado síncrono. El desplazamiento de la flecha lo escribe el pegamento del componente en `--lh-arrow-offset` a partir del `arrowOffset` del resultado.
- **Comportamiento de teclado solo en H5**: Esc-como-cancelación usa un listener a nivel de documento (cerrando solo la capa superior cuando hay varias apiladas); el Mini Program no tiene eventos de teclado y todo el bloque se elimina mediante compilación condicional.
- **Sin trampa de foco**: plus mueve el foco al botón de confirmación al abrir, deja que Tab ciclo entre los dos botones dentro de una focus-trap y restaura el foco al cerrar; MP no tiene semántica de foco de teclado, así que igual que Dialog / Popover de este repositorio no se porta en absoluto.
- **Sin transición de entrada/salida**: plus anima con `Transition` (`lh-popconfirm-fade`); `Transition` no es fiable en MP y, como tooltip / dropdown / popover, no se enlaza ninguna transición.
- **Sin cierre automático al salir el disparador del viewport**: el `useLhPopper` de plus tiene una retrollamada scroll-out; uni-app no tiene un canal unificado de escucha de scroll/cambio de tamaño, así que no se porta.
- **Valor de aria-haspopup**: plus codifica `aria-haspopup="dialog"` en su plantilla; este repositorio genera el paquete de atributos del disparador con `getPopconfirmTriggerAria` de share (valor `'true'`), y el contrato sigue la función pura de share.
:::
