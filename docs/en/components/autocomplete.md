# Autocomplete

A suggestion input that filters as you type: a text field (combobox) plus a dropdown suggestion list (listbox).

## Basic usage

```vue
<script setup>
import { ref } from 'vue'
const value = ref('')
const options = [
  { label: 'Ink wash' },
  { label: 'Blank space' },
  { label: 'Seal', value: 'seal' },
]
</script>

<template>
  <lh-autocomplete v-model="value" :options="options" />
</template>
```

When an option carries only a `label`, the submitted value is the label itself; add a `value` when a machine-readable identifier is needed. Disabled options stay in the list, grayed out and not selectable.

## Filtering

By default, suggestions are filtered by whether the `label` contains the query string (case-insensitive, and leading/trailing whitespace does not participate in matching):

```vue
<template>
  <lh-autocomplete v-model="value" :options="options" case-sensitive />
</template>
```

`case-sensitive` enables case-sensitive matching; pass `trim` as `false` to keep whitespace in the match.

## Select callback

```vue
<template>
  <lh-autocomplete v-model="value" :options="options" @select="onSelect" />
</template>
```

The `select` event receives the submitted value and the original option object.

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue | Input value (v-model) | `string` | `''` |
| options | Suggestion options | `LhAutocompleteOption[]` | `[]` |
| caseSensitive | Case-sensitive matching | `boolean` | `false` |
| trim | Trim leading/trailing whitespace of the query string before matching | `boolean` | `true` |
| placeholder | Placeholder hint | `string` | — |
| placeholderStyle | Placeholder style (replaces `::placeholder`) | `string` | — |
| disabled | Disable the component | `boolean` | `false` |
| openOnFocus | Open the suggestion panel on focus | `boolean` | `true` |
| ariaLabel | Accessible name | `string` | — |
| customClass | Custom class name | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## Slots

| Slot | Description |
| --- | --- |
| empty | Empty state when nothing matches (default text comes from the autocomplete.noMatch locale message) |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:modelValue | Writes back after input or selection | `(value: string)` |
| change | Input value changed | `(value: string)` |
| select | A suggestion item was selected | `(value: string \| number, option: LhAutocompleteOption)` |

## Methods (defineExpose)

| Method | Description |
| --- | --- |
| open / close | Open / close the panel manually |
| isOpen | Current open/closed state (read-only) |

## Platform differences

| Capability | H5 | Mini Program |
| --- | --- | --- |
| Dropdown positioning | root-portal + two-frame measurement (same as select) | Alipay uses root-portal or in-page fixed depending on the base library version; Douyin uses in-page fixed |
| Keyboard navigation / Esc | Arrow keys move the highlight, Enter selects, Esc closes | No keyboard events; selection by click only |
| hover highlight | Yes | No (click selects directly) |
| openOnFocus | Opens on focus | Opens on focus |
