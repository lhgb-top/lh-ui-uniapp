# Tooltip

## Basic usage

```vue
<template>
  <lh-tooltip content="This is the tooltip text">
    <lh-button>Tap to see the tooltip</lh-button>
  </lh-tooltip>
</template>
```

::: warning The Mini Program has no hover semantics
`trigger` defaults to `click` (available on all targets). `hover` is H5-only — on the Mini Program target use `trigger="click"` and trigger/open it via tap / touch.
:::

## Position and width

```vue
<template>
  <lh-tooltip content="Bottom tooltip" placement="bottom">
    <lh-button>bottom</lh-button>
  </lh-tooltip>

  <lh-tooltip content="Long text wraps automatically" :max-width="200" placement="top">
    <lh-button>Limit width</lh-button>
  </lh-tooltip>
</template>
```

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| content | Tooltip text | `string` | — |
| placement | Overlay position (12 positions) | `LhTooltipPlacementCore` | `'top'` |
| trigger | Trigger method: `click` (all targets) / `hover` (H5 only) | `'click' \| 'hover'` | `'click'` |
| showDelay | Show delay (milliseconds) | `number` | — |
| hideDelay | Hide delay (milliseconds) | `number` | — |
| maxWidth | Maximum width (the content wraps automatically) | `string \| number` | — |
| disabled | Disabled | `boolean` | `false` |
| customClass | Custom class name | `string` | — |
| themeVars | Component-level theme variables | `Record<string, string>` | — |
| sx | Quick layout props | `LhSxProps` | — |

## Events

| Event | Description | Callback parameters |
| --- | --- | --- |
| update:modelValue | Visibility changed (controlled usage) | `(visible: boolean)` |
| show | Shown | — |
| hide | Hidden | — |

::: tip Differences from the Vue3 version
- The overlay goes through `root-portal` + two-frame asynchronous measurement positioning (render transparently to measure → position → show, to avoid flicker).
- On the MP target, `showDelay` / `hideDelay` only retain their immediate behavior in click mode.
- The position computation is asynchronous (`getLhRect` returns a Promise); do not assume the result is available synchronously.
:::
