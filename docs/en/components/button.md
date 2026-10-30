# Button

Basic button component. It is rendered by the uni built-in `<button>` (compiled to the native button on each target), and the click event is compiled by uni into `bindtap`.

## Basic usage

```vue
<template>
  <lh-button>Default</lh-button>
  <lh-button type="primary">Primary</lh-button>
  <lh-button type="success">Success</lh-button>
  <lh-button type="warning">Warning</lh-button>
  <lh-button type="danger">Danger</lh-button>
  <lh-button type="info">Info</lh-button>
</template>
```

## States and shapes

```vue
<template>
  <lh-button loading>Loading</lh-button>
  <lh-button disabled>Disabled</lh-button>
  <lh-button plain>Plain</lh-button>
  <lh-button round>Round</lh-button>
  <lh-button circle icon="search" />
  <lh-button block>Block (fills the row)</lh-button>
  <lh-button icon="search" type="primary">With icon</lh-button>
</template>
```

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| type | Type | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| size | Size; inherited from ConfigProvider when not passed | `'small' \| 'medium' \| 'large'` | — |
| loading | Loading state | `boolean` | `false` |
| disabled | Disabled | `boolean` | `false` |
| plain | Plain (outlined) style | `boolean` | `false` |
| block | Block layout | `boolean` | `false` |
| round | Rounded corners | `boolean` | `false` |
| circle | Circular | `boolean` | `false` |
| icon | Icon name | `LhIconName` | — |
| customClass | Custom class name (passed through to the root node) | `string` | — |
| themeVars | Component-level theme variables | `Record<string, string>` | — |
| bgPattern | Component-level background pattern | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## Events

| Event | Description | Callback parameters |
| --- | --- | --- |
| click | Click | `(event)` |

::: tip Differences from the Vue3 version
The Mini Program button has no `nativeType` / `href` / `target` semantics, so these three props are **not implemented** in this library. The rest of the API is identical.
:::
