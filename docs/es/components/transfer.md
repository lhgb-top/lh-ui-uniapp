# Transfer (lista de transferencia)

Lista de dos paneles con movimiento mediante casillas de verificación. La partición de datos, el
filtrado, la selección total y la lógica de movimiento se consumen íntegramente de las funciones
puras del core de `@lh-ui/share` (`partitionTransferData` / `filterTransferItems` /
`toggleTransferCheckAll` / `moveTransferKeys`, entre otras); la capa del componente solo se
ocupa del renderizado, los eventos y la navegación por teclado. Ambos paneles son
`role="listbox"` (patrón listbox de APG).

## Uso básico

```vue
<template>
  <lh-transfer v-model="source" :data="items" @change="onChange" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhTransferItem } from '@lh-ui/share/core/transfer'

const source = ref<Array<string | number>>(['a'])
const items: LhTransferItem[] = [
  { key: 'a', label: 'A' },
  { key: 'b', label: 'B' },
  { key: 'c', label: 'C', disabled: true },
  { key: 'd', label: 'D' },
]

function onChange(keys: Array<string | number>, direction: 'left-to-right' | 'right-to-left') {
  console.log(keys, direction)
}
</script>
```

`v-model` transporta la lista de claves de la izquierda (origen): las claves presentes en
`modelValue` se renderizan en la columna izquierda y el resto en la derecha. Marca cualquier
elemento, pulsa los botones › / ‹ del centro para moverlo y se disparan `update:modelValue` y
`change` (con la dirección `'left-to-right'` / `'right-to-left'`); el conjunto de casillas
marcadas se vacía después de cada movimiento.

Cada panel incluye un cuadro de búsqueda en la parte superior (siempre activo, igual que la
versión Vue3) que filtra sin distinguir mayúsculas y minúsculas por etiqueta; la cabecera del
panel muestra el conteo "cantidad del lado / total" y una casilla de selección total (el estado
parcial se expresa con `indeterminate`).

`data` es un `LhTransferItem[]`: `key` es única, `label` el texto a mostrar (si falta, se vuelve
a mostrar la `key`) y `disabled` deshabilita el elemento (no se puede marcar, queda fuera del
"seleccionar todo" y no se puede mover).

## Deshabilitado

`disabled` deshabilita toda la lista de transferencia: marcar, seleccionar todo, buscar y mover
quedan todos bloqueados.

```vue
<template>
  <lh-transfer v-model="source" :data="items" disabled />
</template>
```

## API

### Props

| Propiedad | Descripción | Tipo | Valor por defecto |
| --- | --- | --- | --- |
| data | Conjunto completo de datos | `LhTransferItem[]` | — |
| modelValue | Lista de claves de la izquierda (origen, controlada con v-model) | `Array<string \| number>` | `[]` |
| disabled | Deshabilitar | `boolean` | `false` |
| sx | props de diseño rápido sx | `LhSxProps` | — |

### Events

| Evento | Descripción | Parámetros |
| --- | --- | --- |
| update:modelValue | La lista de claves de la izquierda (origen) cambió (para v-model) | `(keys: Array<string \| number>)` |
| change | Se dispara al completarse un movimiento | `(keys: Array<string \| number>, direction: 'left-to-right' \| 'right-to-left')` |

### LhTransferItem

| Campo | Descripción | Tipo |
| --- | --- | --- |
| key | Clave única | `string \| number` |
| label | Texto a mostrar (si falta, se vuelve a mostrar la key) | `string` |
| disabled | Deshabilitado (no se puede marcar / queda fuera del seleccionar todo / no se puede mover) | `boolean` |

### Accesibilidad

- Ambos paneles son `role="listbox"` + `aria-multiselectable`; los elementos son `role="option"`
  con `aria-selected` / `aria-disabled`
- Cada panel tiene su propio cuadro de búsqueda con `aria-label`; los botones de movimiento
  llevan `aria-label` ("Mover a la derecha" / "Mover a la izquierda")
- La casilla de selección total expresa el estado parcial con `indeterminate`; los elementos
  deshabilitados se suprimen en todas partes (marcar, seleccionar todo, mover)

::: tip Diferencias de plataforma (diferencias con la versión Vue3)
- **El alcance del API se mantiene estrictamente alineado con la fuente de la versión Vue3**:
  aquí solo se ofrece lo que la versión Vue3 ofrece: `data` / `modelValue` / `disabled` /
  `sx`. Funcionalidades que otras librerías suelen incluir pero que la fuente Vue3 no tiene —
  `titles` (títulos de panel), `filterable` (un interruptor de búsqueda), `props` (nombres de
  campo personalizados), `left/right-default-checked` (claves marcadas por defecto) — no se
  añadieron a propósito; los títulos de panel llegan a través de las claves de locale de share
  `transfer.sourceTitle` / `transfer.targetTitle` (disponibles en diez idiomas) y el cuadro de
  búsqueda mantiene la forma siempre activa de la versión Vue3 (sin interruptor).
- **Ambas listas las porta un scroll-view**: las listas `<ul>` / `<li>` de la versión Vue3 se
  convierten aquí en `<scroll-view scroll-y>` + `<view>` (en el Mini Programa un `view` no puede
  desbordarse de forma fiable), con un comportamiento idéntico en H5 y en el Mini Programa de
  WeChat; los estilos de la lista siguen viniendo de `.lh-transfer-panel__list` de share.
- **El movimiento con botones sirve en todas las plataformas**: los botones › / ‹ centrales son
  el `<button>` integrado de uni, pulsables tanto en H5 como en el Mini Programa; aquí no hay
  diferencia de plataforma y el estado deshabilitado lo porta el atributo `disabled`.
- **La navegación por teclado es solo para H5**: las teclas del patrón listbox de APG — ↑/↓
  dentro de la lista filtrada (saltando los deshabilitados, sin bucle), Enter / Space para
  marcar el elemento con el foco, ←/→ para mover el foco entre paneles, Escape para
  restablecerlo — solo funcionan en H5; el Mini Programa no tiene eventos de teclado y todo el
  bloque se elimina mediante compilación condicional (nada de código muerto en el paquete MP),
  y el roving tabindex likewise solo se produce en H5.
- **Las casillas se dibujan a mano**: la casilla de selección total y las de los elementos no
  usan un `<input type="checkbox">` nativo (su estilo no se puede controlar en el Mini
  Programa); en su lugar usan el `lh-checkbox` de este paquete (dibujado con view + lh-icon).
  El estado lo sigue escribiendo el componente de forma controlada, de modo que la semántica
  no cambia.
:::
