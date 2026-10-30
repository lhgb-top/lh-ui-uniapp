# Tag

## Basic usage

```vue
<template>
  <lh-tag>Default</lh-tag>
  <lh-tag type="primary">Primary</lh-tag>
  <lh-tag type="success">Success</lh-tag>
  <lh-tag type="warning">Warning</lh-tag>
  <lh-tag type="danger">Danger</lh-tag>
</template>
```

## Style and closing

```vue
<template>
  <lh-tag round>Rounded</lh-tag>
  <lh-tag hit>Outlined</lh-tag>
  <lh-tag closable @close="onClose">Closable</lh-tag>
</template>

<script setup lang="ts">
const onClose = () => console.log('Closed')
</script>
```

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| type | Type | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| size | Size | `'small' \| 'medium' \| 'large'` | — |
| closable | Closable | `boolean` | `false` |
| disabled | Disabled | `boolean` | `false` |
| round | Rounded corners | `boolean` | `false` |
| hit | Outlined (no fill) | `boolean` | `false` |
| customClass | Custom class name | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## Events

| Event | Description | Callback parameters |
| --- | --- | --- |
| close | The close button was tapped | — |

::: tip Differences from the Vue3 version
The inline SVG inside the close button is replaced by lh-icon (the iconfont approach) in this library.
:::
