# DatePicker (selector de fecha)

Selector de fecha: toca la caja del disparador para abrir un panel de calendario que admite tres modos de selección (fecha / mes / año), un formato de visualización personalizado y el eco de valores de rango. La generación de la cuadrícula del calendario, el formato de fechas y la comprobación de deshabilitado consumen funciones puras de `@lh-ui/share` core, y el panel es una cuadrícula `view` dibujada a mano, por lo que H5 y el Mini Programa de WeChat lo renderizan de forma idéntica.

## Contrato del tipo de valor

El valor vinculado es **siempre un objeto `Date`** (un rango es una tupla `[Date, Date]`); el componente no acepta ni emite cadenas de fecha ISO:

```vue
<template>
  <lh-date-picker v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
// ✅ Correcto: un objeto Date
const value = ref<Date | null>(new Date(2026, 10, 3))
// ❌ Incorrecto: '2026-11-03' ni se muestra ni se analiza
</script>
```

La prop `format` solo afecta a la **visualización en el disparador y el panel** (tokens de ancho fijo `yyyy` / `MM` / `dd` / `HH` / `mm` / `ss`); nunca cambia el valor vinculado. Lo que recibes es un `Date`; si necesitas una cadena ISO para almacenamiento, llama tú mismo a `formatDate` o `toISOString()`.

## Uso básico

```vue
<template>
  <lh-date-picker v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3))
</script>
```

En modo fecha, tocar un día solo lo **almacena temporalmente**; toca「OK」en el pie del panel para confirmarlo (envío en dos pasos, igual que la versión Vue3). El botón「Hoy」devuelve el panel al mes actual y almacena el día de hoy.

## Modos mes y año

Con `mode="month"` / `mode="year"` el panel se abre directamente en la cuadrícula correspondiente y tocar una celda selecciona y cierra al instante (sin botones en el pie). En modo fecha, tocar el título del panel permite navegar por niveles: fecha → mes → año; en la vista de año, tocar el título vuelve a meses.

```vue
<template>
  <lh-date-picker v-model="month" mode="month" />
  <lh-date-picker v-model="year" mode="year" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const month = ref<Date | null>(new Date(2026, 5, 1))
const year = ref<Date | null>(new Date(2024, 0, 1))
</script>
```

## Formato de fecha

```vue
<template>
  <lh-date-picker v-model="value" format="MM/dd/yyyy" />
  <lh-date-picker v-model="value" format="yyyy-MM-dd" />
</template>
```

Si se omite `placeholder`, el texto del marcador se genera a partir de `format` (`yyyy` →「año」del paquete de idioma, `MM` →「mes」, `dd` →「día」).

## Deshabilitado y de solo lectura

```vue
<template>
  <lh-date-picker v-model="value" disabled />
  <lh-date-picker :model-value="value" readonly />
</template>
```

`disabled` deshabilita todo el selector (al tocar no se abre el panel); `readonly` es de solo lectura (admite valores programáticos pero nunca abre el panel).

## Tamaños y borrado

```vue
<template>
  <lh-date-picker v-model="value" size="small" />
  <lh-date-picker v-model="value" size="medium" />
  <lh-date-picker v-model="value" size="large" />
  <lh-date-picker v-model="value" :clearable="false" />
</template>
```

`size` cae al tamaño global del ConfigProvider y, por último, a `medium`. `clearable` está activado por defecto y muestra un icono de borrado a la derecha del disparador.

## Eco de valores de rango

Cuando el valor vinculado es `[Date, Date]`, el disparador muestra ambos extremos unidos por `range-separator` (`~` por defecto):

```vue
<template>
  <lh-date-picker v-model="span" range-separator=" a " />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const span = ref<[Date, Date]>([new Date(2026, 10, 1), new Date(2026, 10, 7)])
</script>
```

::: warning La UI de selección de rango / fecha-hora aún no está implementada
Al igual que la versión Vue3, `mode="datetime"` y la selección de rango son **solo una reserva de tipos, sin UI de selección** (las columnas de hora y el panel de rango no están implementadas, pendiente familiar P-08). Un valor de rango se puede mostrar, pero tocar「OK」dentro del panel nunca sobrescribe un rango ya vinculado con un único `Date`.
:::

## Personalización de celdas y panel

```vue
<template>
  <lh-date-picker v-model="value" :cell-class-name="cellClassName" popper-class="my-popper" />
</template>

<script setup lang="ts">
const cellClassName = (date: Date) => (date.getDay() === 0 || date.getDay() === 6 ? 'my-weekend' : '')
</script>
```

`cell-class-name` añade una clase personalizada por día (los valores vacíos se omiten); `popper-class` se reenvía a la raíz del panel para estilizarlo a nivel de panel.

## DatePicker API

### Props

| Prop | Descripción | Tipo | Por defecto |
| --- | --- | --- | --- |
| modelValue | Valor vinculado (Date / tupla de rango / null; **sin cadenas ISO**) | `Date \| [Date, Date] \| null` | `null` |
| mode | Modo de selección | `'date' \| 'month' \| 'year' \| 'datetime' \| 'range'` | `'date'` |
| size | Tamaño (cae al tamaño global del ConfigProvider y luego a medium) | `'small' \| 'medium' \| 'large' \| 'mini' \| 'x-large'` | `'medium'` |
| disabled | Deshabilitar todo el selector | `boolean` | `false` |
| clearable | Mostrar el botón de borrado | `boolean` | `true` |
| placeholder | Marcador de posición (se genera desde format si se omite) | `string` | `''` |
| format | Formato de visualización (tokens de ancho fijo, solo visualización) | `string` | `'yyyy-MM-dd'` |
| readonly | Solo lectura (nunca abre el panel) | `boolean` | `true` |
| rangeSeparator | Separador de rango (une el eco de rango) | `string` | `'~'` |
| cellClassName | Devolución de clase personalizada por celda de día | `(date: Date) => string` | — |
| popperClass | Clase personalizada del panel | `string` | — |
| customClass | Clase personalizada del nodo raíz | `string` | — |
| themeVars | Variables de tema a nivel de componente, pisan el ConfigProvider | `Record<string, string>` | — |
| sx | Props de diseño rápido (nodo raíz; el panel flotante no se ve afectado) | `LhSxProps` | — |

::: tip Valores de mode
`'datetime'` y `'range'` son **reservas de tipos**: `LhDatePickerMode` (share core) los incluye, pero las columnas de hora y el panel de rango no están implementados (pendiente P-08); por ahora usa solo `'date'` / `'month'` / `'year'`.
:::

### Events

| Evento | Descripción | Parámetros |
| --- | --- | --- |
| update:modelValue | Cambio de valor (v-model) | `(value: Date \| [Date, Date] \| null)` |
| change | Valor confirmado (mismo payload que update:modelValue) | `(value: Date \| [Date, Date] \| null)` |

### Accesibilidad

- El disparador es `role="combobox"` (`aria-expanded` / `aria-haspopup="dialog"` / `aria-controls` apuntando al panel); el paquete de atributos lo genera `getDatePickerTriggerAria` de share
- El panel es `role="dialog"`; el calendario es `role="grid"` con celdas `role="gridcell"` que llevan `aria-selected` / `aria-current="date"` (hoy) / `aria-disabled` (deshabilitado)
- El `aria-label` de cada celda es el texto completo「YYYY, mes M, día D, día de la semana X」para lectores de pantalla
- Los botones de navegación de meses son `role="button"` + `aria-label` (claves de idioma `datepicker.prevMonth` / `datepicker.nextMonth`)
- La navegación por teclado de la cuadrícula y el comportamiento de teclado del disparador son solo para H5; consulta las diferencias de plataforma a continuación

::: tip Diferencias de plataforma (diferencias con la versión Vue3)
- **Selección basada en panel**: el panel de calendario de plus ya es de tipo panel (no un selector de rueda) y este puerto mantiene esa interacción; la capa flotante la soporta `lh-root-portal` en lugar de `Teleport to="body"` (con un repliegue a `fixed` en página para versiones antiguas), la posición se calcula con medición asincrónica de dos fotogramas (renderizar oculto para medir → `computePosition` → mostrar, sin parpadeo) y no se enchufan transiciones de entrada/salida.
- **Mapeo de elementos**: los `<div>` / `<button>` / `<input>` de plus se sustituyen por `<view>`; el eco y el marcador del disparador son `<text>` dibujados a mano (MP no soporta `::placeholder`; el color del marcador lo aporta una clase modificadora inline del SFC con el mismo token), y los estados deshabilitados de los botones de mes / hoy / OK se llevan por clases (un `view` no tiene la pseudoclase `:disabled`).
- **Cierre por toque fuera**: plus escucha un click a nivel de documento; este puerto cierra al tocar una máscara transparente en página (semántica equivalente, MP no tiene document). Tocar la máscara solo cierra, no emite change.
- **La navegación por teclado es solo H5**: Enter / Space del disparador, movimiento con flechas en la cuadrícula (incluido cambio de mes) / Home / End / PageUp / PageDown, el roving tabindex y Escape cerrando la superposición superior no tienen eventos de teclado en MP; el código protegido por compilación condicional no se llama en absoluto y el paquete MP no contiene código muerto.
- **Los atributos aria se enlazan uno a uno**: el paquete `LhAriaAttrs` de share no se puede extender con `v-bind` (el compilador de plantillas de MP no lo soporta), de modo que la capa de pegamento expande las claves `aria-*` en enlaces explícitos; el contrato lo siguen decidiendo las funciones puras de share.
- **Contrato del tipo de valor**: idéntico a plus — el valor vinculado es `Date` / `[Date, Date]`, nunca una cadena de fecha ISO en ningún sentido; `format` solo afecta a la capa de visualización.
:::
