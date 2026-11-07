# Link

A text hyperlink supporting semantic types, underline behavior and prefix/suffix icon slots.

## Basic usage

```vue
<template>
  <lh-link>Default link</lh-link>
  <lh-link type="primary">Primary link</lh-link>
</template>
```

`type`: `default` (default) / `primary` / `success` / `warning` / `danger` / `info`.

## Underline

```vue
<template>
  <lh-link underline="always">Always</lh-link>
  <lh-link underline="none">None</lh-link>
</template>
```

`underline`: `always` for a persistent line / `hover` to show it on hover (default) / `none` for no line.

## Disabled and prefix/suffix

```vue
<template>
  <lh-link disabled>Disabled link</lh-link>
  <lh-link>
    <template #prefix><lh-icon name="left" /></template>
    Previous page
  </lh-link>
</template>
```

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| href | Link URL (href is not rendered when disabled) | `string` | — |
| target | Target window (H5 only) | `string` | — |
| type | Link semantic type | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| underline | Underline behavior | `'always' \| 'hover' \| 'none'` | `'hover'` |
| disabled | Disabled | `boolean` | `false` |
| current | Current-page marker (outputs `aria-current`) | `'page' \| 'location' \| true` | — |
| customClass | Custom class name | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## Slots

| Slot | Description |
| --- | --- |
| default | Link text |
| prefix | Prefix icon slot |
| suffix | Suffix icon slot |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| click | Click | `(event: Event)` |

## Platform differences

| Capability | H5 | Mini Program |
| --- | --- | --- |
| Rendering element | view + `@click` | Same as H5 (`href` / `target` carry no navigation semantics; navigation is handled by the business layer in the `click` event) |
| Hover underline | Yes | No (`underline="always"` / `"none"` still apply; the rendered underline of the VIEW is subject to the actual result) |
