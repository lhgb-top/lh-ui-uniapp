# Table

Tabla de datos: encabezados multinivel, ordenación, filtrado, desplazamiento
virtual y celdas personalizadas. La construcción de encabezados
(`buildHeaderCells`), la ordenación (`sortTableRows`), el filtrado
(`filterTableRows`), el intervalo virtual (`computeVisibleRange`) y el cálculo de
nombres de clase / desplazamientos sticky provienen por completo de las funciones
puras del core de `@lh-ui/share`.

## Diferencias de plataforma (importante)

- **Desplazamiento horizontal**: en H5 la cabecera y el cuerpo son dos
  contenedores de desplazamiento independientes, con `scrollLeft` sincronizado en
  ambos sentidos; en el lado WeChat un único `scroll-view` exterior (scroll-x)
  desplaza toda la tabla horizontalmente, por lo que cabecera y cuerpo comparten
  el mismo eje de desplazamiento y no hace falta mecanismo de sincronización.
- **Columnas fijas (solo H5)**: las columnas fijas dependen del soporte de
  `position: sticky` en celdas de tabla, poco fiable bajo WXSS, por lo que los
  estilos de columnas fijas en MP se eliminan en tiempo de construcción (el
  envoltorio `#ifdef H5` de `build-styles`) y degradan a columnas normales de
  desplazamiento horizontal.
- **Redimensionado de columnas (solo H5)**: `mousedown` y la semántica de teclado
  no existen en MP, por lo que los tiradores de arrastre solo se renderizan en H5.
- **Filas alternas (stripes)**: la regla `:nth-child(even)` de share es solo H5
  (WXSS no soporta pseudo-clases nth); en MP la plantilla añade la clase `--alt`
  según el índice de la fila.
- **Desplazamiento virtual**: H5 usa `clientHeight` + `ResizeObserver`; MP usa
  `detail.scrollTop` del `scroll-view` + `createSelectorQuery`.

## Uso básico

```vue
<template>
  <lh-table :data="rows" :columns="columns" />
</template>

<script setup lang="ts">
const rows = [
  { id: 1, name: 'Usuario 1', age: 28, city: 'Pekín' },
  { id: 2, name: 'Usuario 2', age: 34, city: 'Shanghái' },
]
const columns = [
  { prop: 'name', label: 'Nombre', width: 140 },
  { prop: 'age', label: 'Edad', width: 120, align: 'right' },
  { prop: 'city', label: 'Ciudad', width: 160 },
]
</script>
```

## Filas alternas y bordes

```vue
<template>
  <lh-table :data="rows" :columns="columns" stripe border />
</template>
```

## Ordenación y filtrado

```vue
<template>
  <lh-table
    :data="rows"
    :columns="columns"
    @sort-change="onSort"
    @filter-change="onFilter"
  />
</template>

<script setup lang="ts">
const columns = [
  { prop: 'age', label: 'Edad', width: 120, sortable: true },
  {
    prop: 'city',
    label: 'Ciudad',
    width: 160,
    filters: [
      { text: 'Pekín', value: 'Pekín' },
      { text: 'Shanghái', value: 'Shanghái' },
    ],
  },
]

function onSort(payload: { prop: string; order?: 'asc' | 'desc' }) {}
function onFilter(payload: { prop: string; values: (string | number)[] }) {}
</script>
```

Al pulsar la cabecera de una columna ordenable se cicla `ninguno → ascendente →
descendente` (`cycleSortOrder`); la cabecera de una columna filtrable lleva un
disparador de filtro y, al marcar los elementos en el panel y confirmar, se
filtran las filas (la lógica de filtrado pasa por `filterTableRows` de share). El
estado del filtro soporta los modos controlado (`filtered-values`) y no controlado
(`default-filtered-values`).

## Columnas fijas y desplazamiento horizontal (solo H5)

```vue
<template>
  <lh-table :data="rows" :columns="columns" />
</template>

<script setup lang="ts">
const columns = [
  { prop: 'name', label: 'Nombre', width: 140, fixed: 'left' },
  { prop: 'age', label: 'Edad', width: 120 },
  { prop: 'city', label: 'Ciudad', width: 160 },
  { prop: 'status', label: 'Estado', width: 120, fixed: 'right' },
]
</script>
```

`fixed: 'left' / 'right'` requiere una anchura numérica; para el lado MP consulta
las diferencias de plataforma más arriba.

## Desplazamiento virtual (decenas de miles de filas)

```vue
<template>
  <lh-table :data="hugeRows" :columns="columns" :height="360" />
</template>
```

Al definir `height` se activa el desplazamiento virtual: el cuerpo de la tabla toma una altura fija y solo se
renderiza la ventana visible más el overscan
(`LH_TABLE_OVERSCAN = 3`); `row-height` debe coincidir con la altura real de la
fila (por defecto 48).

## Celdas personalizadas

```vue
<template>
  <lh-table :data="rows" :columns="columns">
    <template #status="{ row }">
      <lh-tag :type="row.status === 'active' ? 'success' : 'danger'">
        {{ row.status === 'active' ? 'Activo' : 'Inactivo' }}
      </lh-tag>
    </template>
  </lh-table>
</template>

<script setup lang="ts">
const columns = [
  { prop: 'name', label: 'Nombre', width: 140 },
  { prop: 'status', label: 'Estado', width: 140, slot: 'status' },
]
</script>
```

El campo `slot` de la configuración de columna declara un slot con nombre y ámbito;
los parámetros del slot son `{ row, column, index, value }`.

## Encabezados multinivel

```vue
<script setup lang="ts">
const columns = [
  { prop: 'name', label: 'Nombre', width: 140 },
  {
    label: 'Grupo',
    children: [
      { prop: 'age', label: 'Edad', width: 120 },
      { prop: 'city', label: 'Ciudad', width: 160 },
    ],
  },
]
</script>
```

El campo `children` de la configuración de columna declara columnas hijas; las
filas de cabecera se dividen automáticamente por nivel y se posicionan con una
rejilla (`buildHeaderCells` calcula el colspan / rowspan).

## API

### Props

| Prop | Descripción | Tipo | Por defecto |
| --- | --- | --- | --- |
| data | Datos de las filas | `LhTableRow[]` | `[]` |
| columns | Configuración de columnas | `LhTableColumn[]` | `[]` |
| height | Altura del cuerpo (activa el desplazamiento virtual al definirse) | `number \| string` | `-` |
| max-height | Altura máxima en modo no virtual | `number \| string` | `-` |
| row-height | Altura de fila del desplazamiento virtual | `number` | `48` |
| stripe | Filas alternas | `boolean` | `false` |
| border | Bordes de las celdas | `boolean` | `false` |
| size | Tamaño | `'small' \| 'default' \| 'large'` | `'default'` |
| row-key | Campo clave de la fila | `string` | `'id'` |
| default-sort-prop | Columna de ordenación por defecto | `string` | `-` |
| default-sort-order | Dirección de ordenación por defecto | `'asc' \| 'desc'` | `-` |
| sorter | Función de ordenación personalizada | `(a, b) => number` | `-` |
| resizable | Activar el redimensionado de columnas (solo H5) | `boolean` | `false` |
| default-filtered-values | Estado de filtrado por defecto (no controlado) | `Record<string, (string \| number)[]>` | `{}` |
| filtered-values | Estado de filtrado controlado | `Record<string, (string \| number)[]>` | `-` |
| sx | Props de maquetación rápida | `LhSxProps` | `-` |

### LhTableColumn

| Prop | Descripción | Tipo |
| --- | --- | --- |
| prop | Nombre del campo | `string` |
| label | Texto de la cabecera | `string` |
| width | Ancho de columna (los números son px) | `number \| string` |
| align | Alineación | `'left' \| 'center' \| 'right'` |
| fixed | Columna fija (solo H5) | `'left' \| 'right'` |
| sortable | Ordenable | `boolean` |
| resizable | Redimensionable (Debe activarse por columna y con un `width` numérico, solo H5) | `boolean` |
| filters | Opciones de filtro | `{ text, value }[]` |
| filter-multiple | Filtro de selección múltiple (true por defecto) | `boolean` |
| formatter | Formateador de celda | `(row, value) => string` |
| slot | Nombre del slot para celdas personalizadas | `string` |
| children | Columnas hijas (encabezados multinivel) | `LhTableColumn[]` |

### Events

| Evento | Descripción | Parámetros |
| --- | --- | --- |
| sort-change | Cambió la ordenación | `(payload: { prop, order })` |
| row-click | Se pulsó una fila | `(row, index)` |
| filter-change | Cambió el filtrado | `(payload: { prop, values })` |
| update:filtered-values | Actualización del filtrado controlado | `(values)` |
| column-resize | Ajuste del ancho de columna (solo H5) | `(payload: { prop, width })` |

### Slots

| Slot | Descripción | Parámetros de ámbito |
| --- | --- | --- |
| [Slot de columna] | Celda personalizada (el nombre lo define el `slot` de la columna) | `{ row, column, index, value }` |
| empty | Contenido para datos vacíos (por defecto «Sin datos») | `-` |
