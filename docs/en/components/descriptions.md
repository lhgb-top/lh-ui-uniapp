# Descriptions

Displays a list of an object's attributes, with column count, column spanning, and a bordered mode. Entries are passed via `items` (`LhDescriptionsItem` is the entry type from `@lh-ui/share` core), and their content can be overridden with scoped slots.

## Basic usage

```vue
<template>
  <lh-descriptions
    title="Collection archive"
    :column="2"
    :items="[
      { label: 'Name', value: 'Blue and white vase' },
      { label: 'Period', value: 'Yongle, Ming' },
      { label: 'Category', value: 'Porcelain' },
      { label: 'Grade', value: 'Grade I' },
    ]"
  />
</template>
```

## Columns and spanning

`column` controls the number of entries per row, and an entry's `span` controls how many columns it covers. A `span` wider than the row's remaining width is clamped, and the last row is padded when incomplete (padding cells are `aria-hidden`, purely decorative).

```vue
<template>
  <lh-descriptions
    :column="3"
    :items="[
      { label: 'Name', value: 'A Thousand Li of Rivers', span: 2 },
      { label: 'Period', value: 'Northern Song' },
      { label: 'Artist', value: 'Wang Ximeng' },
      { label: 'Medium', value: 'Ink and color on silk' },
      { label: 'Collection', value: 'Palace Museum, Beijing' },
    ]"
  />
</template>
```

## Bordered mode

`border` enables table borders (in bordered mode the row gap is removed and cell borders form a table grid).

```vue
<template>
  <lh-descriptions
    :column="2"
    border
    :items="[
      { label: 'Name', value: 'Orchid Pavilion Preface' },
      { label: 'Author', value: 'Wang Xizhi' },
      { label: 'Period', value: 'Eastern Jin' },
      { label: 'Script', value: 'Running script' },
    ]"
  />
</template>
```

## Custom title and content

The `title` slot overrides the header; the `item-<index>` scoped slot overrides the matching entry's content (`index` is the entry's cell index within its row; the scope provides `{ item }`).

```vue
<template>
  <lh-descriptions :column="2" :items="items">
    <template #title>
      <text>Collection archive (slot title)</text>
    </template>
    <template #item-1="{ item }">
      <lh-tag type="success">{{ item.value }}</lh-tag>
    </template>
  </lh-descriptions>
</template>

<script setup lang="ts">
const items = [
  { label: 'Status', value: 'In progress' },
  { label: 'Stage', value: 'Appraised' },
]
</script>
```

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| title | List title | `string` | — |
| column | Number of entries per row | `number` | `3` |
| border | Whether to show borders | `boolean` | `false` |
| items | Entry list; label / value / span triples | `[LhDescriptionsItem](#lhdescriptionsitem-type)`[] | `() => []` |
| customClass | Custom class name | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## LhDescriptionsItem (type)

From `@lh-ui/share` core (`LhDescriptionsItem`); not redefined in this repo.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| label | Entry label | `string` | — |
| value | Entry content (can also be provided via a scoped slot) | `string \| number` | — |
| span | Number of columns to occupy; clamped when exceeded | `number` | `1` |

## Slots

| Slot | Description | Scope |
| --- | --- | --- |
| title | Custom title | — |
| item-\<index\> | Overrides an entry's content (index is the cell index within its row) | `{ item }` |

## Platform differences

- A pure display component with no platform API usage; behaves identically on H5 and WeChat Mini Program. `items` / `column` / `border` / `span` behavior matches the Vue 3 version.
- The Vue 3 version uses `<dl>/<dt>/<dd>` semantic tags; this repo replaces them with `<view>` (WXSS forbids tag selectors, classes carry the styling). Row layout relies on inline `flex` plus percentage `flex-basis`, with the same width formulas as the Vue 3 version.
- The table lines of bordered mode come from the `@lh-ui/share` styles source and remain usable on the Mini Program after `build-styles` purification (the output contains only class selectors and properties, complying with the WXSS whitelist).
- Row aggregation (span normalization, clamping, wrapping, padding) is produced entirely by the `buildDescriptionRows` pure function of `@lh-ui/share`; this repo only adds reactive glue and never copies the core implementation.
