# InputTag

A tag group that submits as you type, supporting trigger keys, a tag limit, deduplication and click-to-remove.

## Basic usage

```vue
<script setup>
import { ref } from 'vue'
const tags = ref(['ink', 'blank'])
</script>

<template>
  <lh-input-tag v-model="tags" placeholder="Type and press Enter to submit" />
</template>
```

## Trigger keys

`trigger` accepts `enter` (default) / `space` / `comma`. When triggered by `space` / `comma`, the whitespace does not enter the input.

```vue
<template>
  <lh-input-tag v-model="tags" trigger="comma" placeholder="Type a comma to submit" />
</template>
```

## Limit and deduplication

```vue
<template>
  <lh-input-tag v-model="tags" :max="3" allow-duplicate />
</template>
```

When `max` is a positive number it caps the tag count (submissions beyond the cap are rejected and the input is cleared); duplicates are rejected by default (a duplicate is not submitted).

## Readonly and disabled

```vue
<template>
  <lh-input-tag v-model="tags" readonly />
  <lh-input-tag v-model="tags" disabled />
</template>
```

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue | Tag list (v-model) | `string[]` | `[]` |
| trigger | Submit trigger key (always the done key on the Mini Program) | `'enter' \| 'space' \| 'comma'` | `'enter'` |
| placeholder | Placeholder hint (shown only when there are no tags) | `string` | `''` |
| placeholderStyle | Placeholder styling (replaces `::placeholder`) | `string` | — |
| max | Tag limit (a non-positive value means unlimited) | `number` | `0` |
| allowDuplicate | Allow duplicate tags | `boolean` | `false` |
| readonly | Readonly | `boolean` | `false` |
| disabled | Disabled | `boolean` | `false` |
| ariaLabel | Accessibility name | `string` | — |
| customClass | Custom class name | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:modelValue | Tag list changed | `(value: string[])` |
| change | Tag list changed (same as modelValue) | `(value: string[])` |
| add | A single tag submitted | `(tag: string)` |
| remove | A single tag removed | `(tag: string)` |

## Methods (defineExpose)

| Method | Description |
| --- | --- |
| focus | Focus the input |
| commit | Submit the current input |

## Platform differences

| Capability | H5 | Mini Program |
| --- | --- | --- |
| Submit trigger key | All `trigger` values supported (Enter / Space / Comma keyboard events) | Always the **done key** (`@confirm`); the `space` / `comma` trigger keys are H5-only |
| Backspace removal | Backspace removes the last tag when the input is empty | No keyboard events; removal goes through the **× button** on each tag (available on both platforms) |
| Commit on blur | Yes | Yes |
| Focus border | `:has()` focus styling applies | No focus border (WXSS does not support `:has()`); input works normally |
