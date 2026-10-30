# Badge

A corner badge on the upper right of an icon, used for notification counts, status dots, or custom text.

## Basic usage

```vue
<template>
  <lh-badge :value="8">
    <lh-button size="small">Messages</lh-button>
  </lh-badge>
  <lh-badge :value="8" type="primary">
    <lh-button size="small">Primary</lh-button>
  </lh-badge>
</template>
```

## Value handling

```vue
<template>
  <lh-badge :value="200" :max="99">
    <lh-button size="small">Over max shows 99+</lh-button>
  </lh-badge>
  <lh-badge :value="0" show-zero>
    <lh-button size="small">Shows 0</lh-button>
  </lh-badge>
  <lh-badge :value="0">
    <lh-button size="small">Hides 0</lh-button>
  </lh-badge>
  <lh-badge content="New">
    <lh-button size="small">Custom text</lh-button>
  </lh-badge>
</template>
```

## Dot

```vue
<template>
  <lh-badge is-dot>
    <lh-button size="small">New messages</lh-button>
  </lh-badge>
</template>
```

## Offset and size

```vue
<template>
  <lh-badge :value="8" :offset="[6, 4]">
    <lh-button size="small">Offset</lh-button>
  </lh-badge>
  <lh-badge :value="8" size="small">
    <lh-button size="small">Small</lh-button>
  </lh-badge>
</template>
```

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| type | Type | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'default'` | `'danger'` |
| value | Value to display | `string \| number` | — |
| size | Size | `'small' \| 'medium' \| 'large'` | `'medium'` |
| max | Maximum value; values beyond it show `${max}+` | `number` | `99` |
| isDot | Whether it is a dot (no value displayed) | `boolean` | `false` |
| hidden | Whether it is hidden | `boolean` | `false` |
| offset | Offset relative to the default position `[x, y]`, implemented with negative margins | `[number, number]` | — |
| showZero | Whether to show when value is 0 | `boolean` | `false` |
| content | Custom text (takes precedence over value) | `string` | — |
| customClass | Custom class name | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## Slots

| Slot | Description |
| --- | --- |
| default | The content the badge is attached to |

::: tip Differences from the Vue3 version
The enter/leave animation does not rely on the built-in `<transition>` of Vue (the transition-end event is unreliable on the Mini Program); instead it switches classes and uses a timer to align the 0.15s animation duration, giving the same visual result as plus.
:::
