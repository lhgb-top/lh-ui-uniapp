# Table

Data table: multi-level headers, sorting, filtering, virtual scrolling and custom
cells. Header building (`buildHeaderCells`), sorting (`sortTableRows`), filtering
(`filterTableRows`), the virtual window (`computeVisibleRange`) and the class name /
sticky offset computations all come from the `@lh-ui/share` core pure functions.

## Platform differences (important)

- **Horizontal scrolling**: on H5 the header and body are two independent scroll
  containers with `scrollLeft` synced both ways; on the WeChat side a single outer
  `scroll-view` (scroll-x) scrolls the whole table horizontally, so header and body
  share one scroll axis and no sync mechanism is needed.
- **Fixed columns (H5 only)**: fixed columns rely on `position: sticky` support on
  table cells, which is unreliable under WXSS, so the MP fixed-column styles are
  stripped at build time (the `#ifdef H5` wrapper in `build-styles`) and degrade to
  plain horizontally scrolled columns.
- **Column resize (H5 only)**: `mousedown` and keyboard semantics do not exist on MP,
  so the drag handles are rendered on H5 only.
- **Stripe rows**: the share `:nth-child(even)` rule is H5-only (WXSS does not
  support nth pseudo-classes); on MP the template adds an `--alt` class by row index
  instead.
- **Virtual scrolling**: H5 uses `clientHeight` + `ResizeObserver`; MP uses the
  `scroll-view` `detail.scrollTop` + `createSelectorQuery`.

## Basic usage

```vue
<template>
  <lh-table :data="rows" :columns="columns" />
</template>

<script setup lang="ts">
const rows = [
  { id: 1, name: 'User 1', age: 28, city: 'Beijing' },
  { id: 2, name: 'User 2', age: 34, city: 'Shanghai' },
]
const columns = [
  { prop: 'name', label: 'Name', width: 140 },
  { prop: 'age', label: 'Age', width: 120, align: 'right' },
  { prop: 'city', label: 'City', width: 160 },
]
</script>
```

## Stripe and border

```vue
<template>
  <lh-table :data="rows" :columns="columns" stripe border />
</template>
```

## Sorting and filtering

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
  { prop: 'age', label: 'Age', width: 120, sortable: true },
  {
    prop: 'city',
    label: 'City',
    width: 160,
    filters: [
      { text: 'Beijing', value: 'Beijing' },
      { text: 'Shanghai', value: 'Shanghai' },
    ],
  },
]

function onSort(payload: { prop: string; order?: 'asc' | 'desc' }) {}
function onFilter(payload: { prop: string; values: (string | number)[] }) {}
</script>
```

Clicking the header of a sortable column cycles `none → ascending → descending`
(`cycleSortOrder`); a filterable column header carries a filter trigger, and the rows
are filtered after checking items in the panel and confirming (the filtering logic
runs through share's `filterTableRows`). The filter state supports both controlled
(`filtered-values`) and uncontrolled (`default-filtered-values`) modes.

## Fixed columns and horizontal scrolling (H5 only)

```vue
<template>
  <lh-table :data="rows" :columns="columns" />
</template>

<script setup lang="ts">
const columns = [
  { prop: 'name', label: 'Name', width: 140, fixed: 'left' },
  { prop: 'age', label: 'Age', width: 120 },
  { prop: 'city', label: 'City', width: 160 },
  { prop: 'status', label: 'Status', width: 120, fixed: 'right' },
]
</script>
```

`fixed: 'left' / 'right'` requires a numeric width; for the MP side see Platform
differences above.

## Virtual scrolling (ten thousand rows)

```vue
<template>
  <lh-table :data="hugeRows" :columns="columns" :height="360" />
</template>
```

Setting `height` enables virtual scrolling: the table body gets a fixed height and
renders only the visible window plus overscan (`LH_TABLE_OVERSCAN = 3`); `row-height`
must match the actual row height (default 48).

## Custom cells

```vue
<template>
  <lh-table :data="rows" :columns="columns">
    <template #status="{ row }">
      <lh-tag :type="row.status === 'active' ? 'success' : 'danger'">
        {{ row.status === 'active' ? 'Enabled' : 'Disabled' }}
      </lh-tag>
    </template>
  </lh-table>
</template>

<script setup lang="ts">
const columns = [
  { prop: 'name', label: 'Name', width: 140 },
  { prop: 'status', label: 'Status', width: 140, slot: 'status' },
]
</script>
```

The column config's `slot` field declares a named scoped slot; the slot params are
`{ row, column, index, value }`.

## Multi-level headers

```vue
<script setup lang="ts">
const columns = [
  { prop: 'name', label: 'Name', width: 140 },
  {
    label: 'Group',
    children: [
      { prop: 'age', label: 'Age', width: 120 },
      { prop: 'city', label: 'City', width: 160 },
    ],
  },
]
</script>
```

The column config's `children` declares sub-columns; the header rows are laid out
per level and positioned with a grid (`buildHeaderCells` computes the colspan /
rowspan).

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| data | Row data | `LhTableRow[]` | `[]` |
| columns | Column config | `LhTableColumn[]` | `[]` |
| height | Table body height (enables virtual scrolling when set) | `number \| string` | `-` |
| max-height | Max height in non-virtual mode | `number \| string` | `-` |
| row-height | Row height for virtual scrolling | `number` | `48` |
| stripe | Stripe rows | `boolean` | `false` |
| border | Cell borders | `boolean` | `false` |
| size | Size | `'small' \| 'default' \| 'large'` | `'default'` |
| row-key | Row key field name | `string` | `'id'` |
| default-sort-prop | Default sort column | `string` | `-` |
| default-sort-order | Default sort direction | `'asc' \| 'desc'` | `-` |
| sorter | Custom sort function | `(a, b) => number` | `-` |
| resizable | Enable column resize (H5 only) | `boolean` | `false` |
| default-filtered-values | Default filter state (uncontrolled) | `Record<string, (string \| number)[]>` | `{}` |
| filtered-values | Controlled filter state | `Record<string, (string \| number)[]>` | `-` |
| sx | sx quick layout props | `LhSxProps` | `-` |

### LhTableColumn

| Prop | Description | Type |
| --- | --- | --- |
| prop | Field name | `string` |
| label | Header text | `string` |
| width | Column width (numbers are px) | `number \| string` |
| align | Alignment | `'left' \| 'center' \| 'right'` |
| fixed | Fixed column (H5 only) | `'left' \| 'right'` |
| sortable | Sortable | `boolean` |
| resizable | Resizable (needs to be enabled per column plus a numeric width, H5 only) | `boolean` |
| filters | Filter options | `{ text, value }[]` |
| filter-multiple | Multi-select filter (true by default) | `boolean` |
| formatter | Cell formatter | `(row, value) => string` |
| slot | Named slot for custom cells | `string` |
| children | Sub-columns (multi-level headers) | `LhTableColumn[]` |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| sort-change | The sort changed | `(payload: { prop, order })` |
| row-click | A row was clicked | `(row, index)` |
| filter-change | The filter changed | `(payload: { prop, values })` |
| update:filtered-values | Controlled filter update | `(values)` |
| column-resize | Column width adjusted (H5 only) | `(payload: { prop, width })` |

### Slots

| Slot | Description | Scoped params |
| --- | --- | --- |
| [Column slot] | Custom cell (name given by the column config `slot`) | `{ row, column, index, value }` |
| empty | Empty data content ("No data" by default) | `-` |
