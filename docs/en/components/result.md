# Result

A result display for the end of a feedback flow, shipping with a status icon and matching colors.

## Basic usage

```vue
<template>
  <lh-result
    status="success"
    title="Submitted successfully"
    sub-title="The work order has moved to the next step"
  />
</template>
```

Four statuses: `success` / `warning` / `error` / `info` (`info` by default), each with a default icon and color scheme; an invalid status value falls back to `info`.

## Custom icon

```vue
<template>
  <lh-result
    icon="like"
    :icon-size="48"
    title="Liked and favorited"
  />
</template>
```

Passing an empty string `""` to `icon` renders no icon; when not passed, the status default icon is used.

## Slots

```vue
<template>
  <lh-result status="success">
    <template #subTitle> Custom subtitle </template>
    <template #extra>
      <lh-button type="primary" size="small">Back to home</lh-button>
    </template>
  </lh-result>
</template>
```

The `title` / `subTitle` / `extra` slots all override the prop of the same name.

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| status | Result status | `'success' \| 'warning' \| 'info' \| 'error'` | `'info'` |
| icon | Custom icon name (overrides the status default icon; an empty string renders nothing) | `string` | — |
| iconSize | Icon size | `string \| number` | `64` |
| title | Title | `string` | — |
| subTitle | Subtitle | `string` | — |
| customClass | Custom class name | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## Slots

| Slot | Description |
| --- | --- |
| title | Title (overrides the title prop) |
| subTitle | Subtitle (overrides the subTitle prop) |
| extra | Bottom action area |
