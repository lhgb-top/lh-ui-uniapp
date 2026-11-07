# Mentions

A member mention input triggered by typing `@`, supporting filtering, multiline input and a select callback.

## Basic usage

```vue
<script setup>
import { ref } from 'vue'
const value = ref('')
const members = [
  { label: 'Ink wash', value: 'ink' },
  { label: 'Blank space', value: 'blank' },
]
</script>

<template>
  <lh-mentions v-model="value" :options="members" />
</template>
```

After typing `@` the suggestion panel opens, and further typing filters by label. What gets written back on selection is the `label` (a human-readable `@Ink wash `); the machine-readable identifier `value` is handed to the business layer via the `select` event.

## Multiline

```vue
<template>
  <lh-mentions v-model="value" :options="members" multiline />
</template>
```

`multiline` swaps the single-line input for a textarea.

## Trigger character

```vue
<template>
  <lh-mentions v-model="value" :options="members" prefix="#" />
</template>
```

`prefix` defaults to `'@'`; a pseudo-prefix directly attached to an ASCII word character (such as `user@` in an email address) does not trigger.

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue | Text content (v-model) | `string` | `''` |
| options | Suggested members | `LhMentionOption[]` | `[]` |
| prefix | Trigger character | `string` | `'@'` |
| placeholder | Placeholder hint (defaults to the mentions.placeholder locale message) | `string` | — |
| placeholderStyle | Placeholder style (replaces `::placeholder`) | `string` | — |
| disabled | Disable the component | `boolean` | `false` |
| multiline | Multiline textarea | `boolean` | `false` |
| ariaLabel | Accessible name | `string` | — |
| customClass | Custom class name | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## Slots

| Slot | Description |
| --- | --- |
| empty | Empty state when nothing matches (default text comes from the mentions.noMatch locale message) |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:modelValue | Writes back after input or selection | `(value: string)` |
| change | Text changed | `(value: string)` |
| select | A mention item was selected | `(option: LhMentionOption)` |

## Methods (defineExpose)

| Method | Description |
| --- | --- |
| updateContext | Manually refresh the cursor context |
| close | Close the suggestion panel |

## Platform differences

| Capability | H5 | Mini Program |
| --- | --- | --- |
| Dropdown positioning | root-portal + two-frame measurement (same as select) | Alipay uses root-portal or in-page fixed depending on the base library version; Douyin uses in-page fixed |
| Cursor context | Native `selectionStart` (mentions can be triggered in the middle of the text) | **The cursor position is unavailable and is approximated as the end of the text** — triggering a mention in the middle of existing text does not work and degrades to appending at the end |
| Keyboard navigation / Esc | Arrow keys move the highlight, Enter selects, Esc closes | No keyboard events; selection by click only |
| Cursor position after selection | Lands exactly after the mention | After the controlled write-back the cursor sits at the end |
