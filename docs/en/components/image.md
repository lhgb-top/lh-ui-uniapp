# Image

An image with a load-failure placeholder and optional tap-to-preview (via the native `uni.previewImage` API, available on all platforms). The crop mode maps to the `mode` of the uni `<image>`, and lazy loading uses the component's built-in `lazy-load`. Preview list normalization and state class names come from `@lh-ui/share` core pure functions.

## Basic usage

```vue
<template>
  <lh-image src="https://picsum.photos/240/140" alt="Sample image" :sx="{ w: '240px', h: '140px' }" />
</template>
```

`alt` is required at the TS level, so no image can ship without alternative text. The uni `<image>` defaults to 320×240 — set the size explicitly with the `w` / `h` of `sx` (or a style); the border radius is built in from the share style source (`--lh-border-radius-small`), no configuration needed.

## Fit modes

`fit` describes CSS object-fit semantics and maps to the `mode` of the uni `<image>`: `contain` → `aspectFit`, `cover` → `aspectFill`, `fill` → `scaleToFill`.

```vue
<template>
  <lh-image src="https://picsum.photos/240/140" alt="Cover crop" fit="cover" :sx="{ w: '110px', h: '80px' }" />
  <lh-image src="https://picsum.photos/240/140" alt="Fit entirely" fit="contain" :sx="{ w: '110px', h: '80px' }" />
  <lh-image src="https://picsum.photos/240/140" alt="Stretch" fit="fill" :sx="{ w: '110px', h: '80px' }" />
</template>
```

::: tip none / scale-down are approximate
`none` maps to `center` (no scaling, only the middle area is shown — same semantics as object-fit: none); uni has no `mode` equivalent to `scale-down`, so the semantically closest `aspectFit` is used (the same registered deviation as lh-avatar).
:::

## Lazy loading

`lazy` enables the `lazy-load` built into the uni `<image>` (loads when entering the viewport).

```vue
<template>
  <scroll-view scroll-y style="height: 140px; width: 100%">
    <lh-image
      v-for="i in 4"
      :key="i"
      :src="`https://picsum.photos/240/120?random=${i}`"
      :alt="`Lazy image ${i}`"
      lazy
      :sx="{ w: '240px', h: '120px', mb: 1 }"
    />
  </scroll-view>
</template>
```

On WeChat, `lazy-load` only works for images under page and scroll-view.

## Load failure

When loading fails, the component switches to the failure placeholder (the root node gets `lh-image--error`). The default text comes from the locale key `image.error` (nine languages available) and can be overridden with the `error` slot; the `error` event is emitted as well.

```vue
<template>
  <lh-image src="https://invalid.example.com/not-found.png" alt="Default placeholder" :sx="{ w: '240px', h: '140px' }" />
  <lh-image src="https://invalid.example.com/not-found.png" alt="Custom placeholder" :sx="{ w: '240px', h: '140px' }">
    <template #error>Custom failure placeholder</template>
  </lh-image>
</template>
```

## Tap to preview

With `preview` enabled, tapping the image opens the native `uni.previewImage` preview (available on all platforms). Pass multiple images via `preview-src-list`; when absent it falls back to `[src]` (same normalization as plus, initial index fixed at 0).

```vue
<template>
  <lh-image
    src="https://picsum.photos/240/140"
    alt="Multi-image preview"
    preview
    :preview-src-list="[
      'https://picsum.photos/600/400?random=1',
      'https://picsum.photos/600/400?random=2',
      'https://picsum.photos/600/400?random=3',
    ]"
    :sx="{ w: '240px', h: '140px' }"
  />
  <lh-image src="https://picsum.photos/240/140" alt="Single-image preview" preview :sx="{ w: '140px', h: '140px' }" />
</template>
```

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| src | Image URL | `string` | — |
| alt | Alternative text (a11y strict, required at the TS level) | `string` | — |
| fit | Crop mode (maps to the mode of the uni image) | `'contain' \| 'cover' \| 'fill' \| 'none' \| 'scale-down'` | `'cover'` |
| preview | Whether tapping opens the preview | `boolean` | `false` |
| preview-src-list | Preview list (falls back to [src] when absent) | `string[]` | — |
| lazy | Lazy loading (native lazy-load of the uni image) | `boolean` | `false` |
| customClass | Custom class name | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## Events

| Event | Description | Callback parameters |
| --- | --- | --- |
| load | Fired when the image loads successfully | `(event: Event)` |
| error | Fired when the image fails to load (switches to the placeholder) | `(event: Event)` |

## Slots

| Slot | Description |
| --- | --- |
| error | Failure placeholder content (defaults to the locale key image.error) |

## Platform differences

- **Preview goes through the native `uni.previewImage` API** (available on all platforms): the plus preview is a self-drawn viewer overlay (teleport to body, zoom / rotate / multi-image switching / Esc to close / focus trap), which cannot be reproduced on Mini Programs since there is no document. The uniapp version calls `uni.previewImage` instead — H5 gets the overlay from the uni runtime and WeChat uses its native preview page. The interaction is platform-provided and **cannot be customized** (mask opacity / close button / toolbar). The standalone `LhImageViewer` of plus is not shipped in this repo.
- **fit → mode mapping**: `contain` / `cover` / `fill` map to `aspectFit` / `aspectFill` / `scaleToFill`; `none` maps to `center`; `scale-down` has no equivalent and uses the closest `aspectFit` (same registered deviation as lh-avatar). The CSS object-fit implementation only applies to a real `<img>` on H5; the uni `<image>` is controlled by `mode` across platforms.
- **Lazy loading**: the uni `<image>` ships `lazy-load` (replacing plus's `loading="lazy"`); on WeChat it only applies to images under page and scroll-view.
- **Size and radius**: the uni `<image>` defaults to 320×240; set the size via `sx` / style. The radius is built in from the share style source (`--lh-border-radius-small`). plus likewise has no width / height / radius prop (size via sx, radius via the style source), so nothing extra is added here.
- **alt**: the MP `<image>` has no alt concept (passed through as an attribute on H5), so the accessibility fallback is weaker than the Web's `<img alt>`; the TS-level required constraint is kept.
- **Viewer style leftovers**: the share style source contains `.lh-image-viewer*` rules (the plus self-drawn viewer styles), which enter this component's style.css product under the single-style-source constraint. No matching nodes exist on either platform (harmless redundancy, still WXSS-whitelist compliant: the `:hover` / `:focus` family is conditionally compiled as H5-only).

::: tip Differences from the Vue3 version
- Logic semantics (preview list normalization, load state, class names) are identical to plus (same share core).
- Preview changed from the self-drawn viewer overlay to the native `uni.previewImage` API (see "Platform differences").
- Adds the `customClass` prop: custom class names cannot pierce styleIsolation on uni-app, so they are passed via a prop.
- `none` / `scale-down` are approximate mappings on Mini Programs (see "Platform differences").
:::
