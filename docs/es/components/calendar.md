# Calendar Calendario

Componente de calendario que muestra los días en una cuadrícula mensual, con tres modos de selección — único, rango (inicio y fin) y múltiple — y una restricción opcional `range`. Todos los textos (encabezados de semana, nombres de mes y título del panel) provienen de las claves de locale `datepicker.weeks.*` / `datepicker.month1~12` / `datepicker.panelTitle`. El calendario es una cuadrícula `view` dibujada a mano, sin ningún control de fecha nativo, por lo que es naturalmente apto para móviles y funciona en todos los destinos.

## Uso básico

```vue
<template>
  <lh-calendar v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date>()
</script>
```

Sin `modelValue`, el componente mantiene su propio estado de selección; al pasarlo, pasa a ser controlado (igual que el resto de componentes de formulario).

## Selección de rango

Con `selection="range"`, el primer clic fija la fecha de inicio (el valor pasa a ser `[inicio, inicio]`) y el segundo fija el final, normalizándose automáticamente (pulsar en orden inverso también da `[temprano, tarde]`):

```vue
<template>
  <lh-calendar v-model="span" selection="range" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const span = ref<Date[]>([])
</script>
```

Ambos extremos reciben `--selected` y los días intermedios el fondo de intervalo `--in-range` (excluidos los extremos).

## Restringir el rango seleccionable

`range` recibe una tupla `[inicio, fin]`; los días fuera del intervalo se deshabilitan (la comprobación la hace una función pura de share, y los rangos invertidos se normalizan solos):

```vue
<template>
  <lh-calendar v-model="value" :range="[start, end]" />
</template>

<script setup lang="ts">
const start = new Date(2026, 10, 1)
const end = new Date(2026, 10, 30)
</script>
```

## Selección múltiple

Con `selection="multiple"`, volver a clicar un día ya seleccionado lo deselecciona, y el resultado permanece ordenado:

```vue
<template>
  <lh-calendar v-model="dates" selection="multiple" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const dates = ref<Date[]>([])
</script>
```

## Modo de disparador input

Con `mode="input"` solo se dibuja una caja disparadora; tócala para desplegar o contraer el panel, que se cierra solo tras la selección (`close-on-select` activo por defecto; un rango necesita dos clics):

```vue
<template>
  <lh-calendar v-model="value" mode="input" placeholder="Elige una fecha" />

  <!-- Rango + sin cierre automático -->
  <lh-calendar v-model="span" mode="input" selection="range" :close-on-select="false" />
</template>
```

El texto de la caja es por defecto `YYYY-MM-DD` (`inicio ~ fin` para un rango); el marcador de posición viene de la clave de locale `select.placeholder`.

## Varios paneles y contenido personalizado

`panels` controla cuántos paneles mensuales se muestran a la vez (dispuestos en flex con ajuste); los slots `header` y `cell` personalizan el título del panel y las celdas de día:

```vue
<template>
  <lh-calendar v-model="value" :panels="2">
    <template #header="{ year, month }">
      <view class="my-title">{{ year }} / {{ month + 1 }}</view>
    </template>
    <template #cell="{ date }">
      <view class="my-cell">{{ date.getDate() }}</view>
    </template>
  </lh-calendar>
</template>
```

::: tip Aptó para móviles
El panel del calendario es una cuadrícula pura de `view` (7 columnas de igual ancho), sin picker nativo ni mediciones DOM:
H5 y el Mini Programa de WeChat lo renderizan idéntico, y en pantallas pequeñas se adapta al ancho del contenedor.
:::

## Calendar API

### Props

| Propiedad | Descripción | Tipo | Valor por defecto |
| --- | --- | --- | --- |
| modelValue | Selección actual (v-model controlado; estado interno si se omite) | `Date \| Date[]` | — |
| selection | Modo de selección: único / rango / múltiple | `'single' \| 'range' \| 'multiple'` | `'single'` |
| range | Rango de fechas seleccionables (fuera se deshabilita, los invertidos se normalizan) | `[Date, Date]` | — |
| mode | Forma de presentación: panel fijo / caja disparadora desplegable | `'panel' \| 'input'` | `'panel'` |
| panels | Número de paneles mensuales mostrados a la vez | `number` | `1` |
| placeholder | Marcador de la caja input (por defecto la clave de locale select.placeholder) | `string` | — |
| closeOnSelect | Si el panel se contrae tras una selección en modo input | `boolean` | `true` |
| customClass | Clase personalizada reenviada al nodo raíz | `string` | — |
| sx | Props rápidas de layout (aplicadas al nodo raíz) | `LhSxProps` | — |

### Events

| Evento | Descripción | Parámetros |
| --- | --- | --- |
| update:modelValue | Cambio de selección (v-model) | `(value: Date \| Date[])` |
| change | Cambio de selección (mismo payload que update:modelValue) | `(value: Date \| Date[])` |
| select | Al clicar un día (los días deshabilitados se ignoran) | `(date: Date)` |

### Slots

| Slot | Descripción | Parámetros de ámbito |
| --- | --- | --- |
| header | Título personalizado del panel | `{ year: number, month: number }` (month base 0) |
| cell | Celda de día personalizada | `{ date: Date }` |

### Accesibilidad

- La cuadrícula es `role="grid"` con filas `role="row"`, celdas `role="gridcell"` y encabezados `role="columnheader"`, más `aria-selected` / `aria-current="date"` (hoy) / `aria-disabled` (deshabilitado)
- El `aria-label` de cada celda es una cadena `YYYY-MM-DD` para lectores de pantalla
- Los botones de mes son `role="button"` + `aria-label` (claves de locale `datepicker.prevMonth` / `datepicker.nextMonth`)
- La navegación por teclado (flechas, Home / End, PageUp / PageDown) solo funciona en H5; véanse las diferencias de plataforma

::: tip Diferencias de plataforma (frente a la versión Vue3)
- **Soporte de la cuadrícula**: el calendario es una cuadrícula de 7 columnas dibujada con `view` (WXSS `grid-template-columns: repeat(7, 1fr)`) sin control de fecha nativo; H5 y el Mini Programa de WeChat lo renderizan y comportan de forma idéntica, siendo naturalmente apto para móviles.
- **Mapeo de elementos**: el `<div>` / `<button>` / `<input>` de plus se sustituyen por `<view>`; en el modo input la caja disparadora se dibuja con `<view>` y	rendera el marcador y el valor seleccionado (MP no soporta `::placeholder`, y un `<input>` nativo requeriría `placeholder-style`). Las celdas deshabilitadas llevan la clase `--disabled` (un `view` no tiene la pseudoclase `:disabled`; el SFC añade un respaldo inline con el mismo token).
- **Navegación por teclado solo en H5**: las flechas / Home / End / PageUp / PageDown y el roving tabindex no tienen eventos de teclado en MP, así que el código guarded no se llama: el bundle de MP no contiene código muerto.
- **Cierre al clicar fuera solo en H5**: plus escucha un mousedown a nivel de documento para cerrar el panel; MP no tiene document, de modo que el panel se conmuta tocando la caja disparadora.
- **Atributos aria vinculados uno a uno**: el paquete `LhAriaAttrs` de share no se puede desplegar con `v-bind` (el compilador de plantillas de MP no lo soporta), de modo que la capa de pegamento expande las claves `aria-*` en vinculaciones explícitas; el contrato lo siguen decidiendo las funciones puras de share.
:::
