# Dialog

## Basic usage

```vue
<template>
  <lh-button @click="visible = true">Open dialog</lh-button>

  <lh-dialog v-model="visible" title="Title" width="80%">
    <view>This is the dialog content</view>
    <template #footer>
      <lh-button @click="visible = false">Cancel</lh-button>
      <lh-button type="primary" @click="visible = false">OK</lh-button>
    </template>
  </lh-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
</script>
```

## Positioning

```vue
<template>
  <lh-dialog v-model="visible" position="bottom" title="Bottom overlay">
    <view>Bottom content</view>
  </lh-dialog>

  <lh-dialog v-model="visible" fullscreen title="Full screen">
    <view>Full-screen content</view>
  </lh-dialog>
</template>
```

A bottom overlay automatically carries `env(safe-area-inset-bottom)` to adapt to full-screen devices.

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue (v-model) | Whether it is shown | `boolean` | `false` |
| title | Title | `string` | — |
| width | Width | `string \| number` | — |
| top | Distance from the top | `string \| number` | — |
| fullscreen | Full screen | `boolean` | `false` |
| position | Position | `'center' \| 'top' \| 'bottom'` | `'center'` |
| closeOnClickModal | Close on mask click | `boolean` | `true` |
| closeOnPressEscape | Close on Esc (**no-op on MP, which has no keyboard events**) | `boolean` | `true` |
| lockScroll | Lock background scrolling (**H5 only**) | `boolean` | `true` |
| zIndex | Stacking; auto-incremented when not passed | `number` | — |
| customClass | Custom class name | `string` | — |
| themeVars | Component-level theme variables | `Record<string, string>` | — |
| sx | Quick layout props | `LhSxProps` | — |

## Slots

| Slot | Description |
| --- | --- |
| default | Content |
| footer | Footer button area |

## Events

| Event | Description | Callback parameters |
| --- | --- | --- |
| update:modelValue | Visibility changed | `(visible: boolean)` |
| open | Opened | — |
| close | Closed | — |

::: tip Differences from the Vue3 version
- Overlay mounting goes through `root-portal` (teleport on H5; root-portal on MP, or an in-page fixed fallback).
- **focus-trap is unavailable on MP**: the `LH_IS_H5` compile-time guard returns false directly and focus-trap is not called.
- **lockScroll is a no-op on MP**: the Mini Program has no body scroll locking; the mask intercepts taps as a fallback.
- `closeOnPressEscape` is a no-op on MP (no keyboard events).
:::
