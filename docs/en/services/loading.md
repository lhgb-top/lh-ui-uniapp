# Loading

Global loading mask service. Like Message, it uses the **mount-point pattern**.

## Place the mount point

```vue
<template>
  <lh-config-provider>
    <view><!-- page content --></view>
    <lh-loading />
  </lh-config-provider>
</template>
```

## Usage

```ts
import { useLhLoading } from '@lh-ui/uniapp'

const loading = useLhLoading()

// show accepts an options object or a plain text string, and returns a handle
const handle = loading.show({ text: 'Loading...' })
handle.close()

// close all
loading.closeAll()
```

::: danger A missing mount point triggers a warning
Same as Message: when `useLhLoading()` is called but the page has no `<lh-loading />`, a clear `console.error` warning is emitted during development, with no silent degradation.
:::

## LhLoadingOptions

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| target | Target node (**H5 only**; always full-screen on MP) | `string` | — |
| text | Loading text | `string` | — |
| background | Mask background color | `string` | — |
| lock | Lock scrolling (**H5 only**) | `boolean` | `false` |
| zIndex | Stacking; auto-incremented when not passed | `number` | — |

## Methods

| Method | Description | Parameters |
| --- | --- | --- |
| show | Shows the loading mask and returns a handle (`{ close }`) | `(options: LhLoadingOptions \| string)` |
| close | Closes the loading instance with the given id | `(id: number)` |
| closeAll | Closes all | — |

## Differences from the Vue3 version

- `target` **only supports a full-screen mask** on the Mini Program — an arbitrary node cannot be selected for the mask there, so the first release ignores `target` on MP (the field is retained and documented).
- `lock` is H5-only; the Mini Program has no body scroll locking.
- When multiple instances stack, `useLhZIndex` guarantees that a mask opened later is on top.
