# Alert

Displays important semantic feedback in the page (success / warning / error / info), with title, description, semantic icon, and an optional close action.

## Basic usage

```vue
<template>
  <lh-alert title="Notice">
    Your changes have been saved and you can continue editing at any time.
  </lh-alert>
</template>
```

The title can be passed with the `title` prop or the same-named slot; the default slot carries the description.

## Semantic types

```vue
<template>
  <lh-alert type="success" title="Success">
    Data has been synchronized.
  </lh-alert>
  <lh-alert type="warning" title="Warning">
    Insufficient balance, please top up soon.
  </lh-alert>
  <lh-alert type="danger" title="Error">
    Submission failed, please check your network and try again.
  </lh-alert>
  <lh-alert type="info" title="Info">
    A new version will be released next week.
  </lh-alert>
</template>
```

## Semantic icon

```vue
<template>
  <lh-alert show-icon type="success" title="Success with icon">
    The icon color follows the semantic type automatically.
  </lh-alert>
</template>
```

## Closable

```vue
<template>
  <lh-alert closable title="Closable alert">
    Click the close icon on the right to hide the component and trigger the close event.
  </lh-alert>
</template>
```

## Plain style

```vue
<template>
  <lh-alert plain title="Plain style">
    Transparent background with a semantic border, suitable for compact lists.
  </lh-alert>
</template>
```

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| type | Semantic type | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` |
| title | Title (also available via the title slot) | `string` | — |
| closable | Whether the alert can be closed | `boolean` | `false` |
| showIcon | Whether to show the semantic icon | `boolean` | `false` |
| plain | Whether to use the plain style | `boolean` | `false` |
| closeLabel | Accessible name of the close button (falls back to the `alert.close` locale message) | `string` | — |
| customClass | Custom class name | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| close | Emitted when the close button is clicked (the component is hidden right after) | — |

## Slots

| Slot | Description |
| --- | --- |
| default | Description content |
| title | Title content (takes precedence over the title prop) |

## Platform differences

- **Accessibility roles**: `warning` / `danger` render `role="alert"` (announced immediately), `info` / `success` render `role="status"` (announced politely), matching the APG semantics of the plus version, with no difference between platforms.
- **Tag replacement**: the `<div>` / `<span>` / `<p>` tags of the plus version are replaced with `view` elements (WXSS forbids tag selectors, styles rely on the `lh-alert__*` class names).
- **Icons**: inline svgs are not supported on the Mini Program, so they are replaced with `lh-icon` nodes (`info` / `check` / `warning` / `error`), sharing the `lh-alert__icon` class with the share scss.
- **Close button**: the `<button type="button">` of the plus version is replaced with a `view` carrying `role="button"`; the accessible name still comes from `closeLabel` or the `alert.close` locale message (available in all nine languages).
- **No enter/leave animation**: the plus version also just removes the node with `v-if` on close (no `<transition>` wrapper), so the behavior is identical here and the unreliable Mini Program transition-end event is not involved.
- **Porting conclusion**: Alert is a pure presentational component (no measuring, no overlays, no focus trap, no document dependency); it works on all platforms with identical behavior on H5 and the WeChat Mini Program.
