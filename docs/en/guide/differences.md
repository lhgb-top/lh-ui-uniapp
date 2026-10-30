# API Differences from the Vue3 Version

This library shares the core pure functions of `@lh-ui/share` with `@lh-ui/vue3` (plus), so **Prop and event naming are largely identical**. The following are the inevitable differences introduced by the uni-app target platforms; any API not listed behaves the same as in the Vue3 version.

## icon: font rendering instead of inline SVG

| | Vue3 version (plus) | This library |
| --- | --- | --- |
| Rendering | Inline `<svg><path>` | `<text class="lh-iconfont lh-iconfont--<name>">` |
| Color | `currentColor` (inherits the parent color) | Explicit `color` prop / parent color (CSS font color; semantically equivalent) |
| Size | `size` prop | `size` prop (sets font-size) |

The Mini Program does not support the `<svg>` tag, so icons are converted at build time from share's SVG path set into an iconfont font (base64 embedded in `iconfont.css`; 37 icons, 24×24 monochrome). Visually these are the same glyphs, but they are fundamentally a font, so in CSS you **cannot** use `fill` / `stroke` — only `color`.

## input: placeholder styling via props

MP does not support the `::placeholder` pseudo-element. Use props for placeholder styling:

```vue
<lh-input placeholder="Type here" placeholder-style="color: #999" />
```

| prop | Description |
| --- | --- |
| `placeholder-style` | Inline style string for the placeholder text |
| `placeholder-class` | Class name for the placeholder text (pick one of style or class) |

The remaining APIs (`v-model`, `maxlength`, the word counter `show-word-limit`, `type`) are identical to the Vue3 version.

## select / dialog / tooltip: desktop-class capabilities are H5-only

| Capability | H5 | WeChat Mini Program |
| --- | --- | --- |
| Keyboard navigation (arrow keys / Enter / Esc) | ✅ | ❌ Removed at compile time |
| focus-trap (dialog focus cycle) | ✅ | ❌ Not called at compile time |
| lockScroll (lock background scrolling) | ✅ | ❌ (mask interception fallback) |
| hover trigger (tooltip) | ✅ | ❌, switched to click / touchstart |

**The `trigger` of tooltip**: `'click' | 'hover'` is still supported, but `hover` has no semantics in the Mini Program — on the MP target use `trigger="click"` (or the default value) and trigger via tap / touch.

**The events of select** are unchanged (`update:modelValue` / `change` / `visible-change`), but "clear" and "select" on MP can only be done by tapping listbox items; there is no keyboard path.

## message / loading: mount-point pattern

This is **the biggest usage difference**. The Vue3 version does `createApp + mount to document.body` and shows on call; the Mini Program has no document, so you must **place the mount-point components first**:

```vue
<!-- place once on the page -->
<lh-message />
<lh-loading />
```

```ts
const { success, closeAll } = useLhMessage()
const loading = useLhLoading()

loading.show({ text: 'Loading...' })
// ...
loading.close()
```

See [Installation - Imperative services need a mount point](/en/guide/installation#imperative-services-need-a-mount-point).

::: tip The Notification component is absent from the first release
The Vue3 version has `lh-notification`; this library **does not build it** in the first release (low value on the Mini Program target, where notifications generally go through system capabilities). Use `lh-message` as an alternative when you need a notification-style prompt.
:::

## config-provider: dark mode via class name instead of document

| | Vue3 version | This library |
| --- | --- | --- |
| Dark mode toggle | Adds a class on `document.documentElement` | Adds a `dark` class on the wrapping node (the Mini Program has no document) |
| `theme` prop | `'light' \| 'dark'` | Same (internal implementation differs) |

Usage is unchanged — both are `<lh-config-provider :theme="dark">`. In this library's `theme/index.css`, the dark variables are attached to `page.dark, .dark`, so the dark scope follows the node wrapped by ConfigProvider.

## Units: px straight through

This library **does not convert px→rpx**; the style sources are px-based straight through — consistent with mainstream uni component libraries such as wot-design-uni / uview-plus / uni-ui / TDesign (the official uni compilation does not auto-convert px→rpx either). If your project is configured with a plugin like `postcss-px-to-rpx`, this library's artifacts will be converted along with it; no special handling is needed.

## Mini Program options built into the component SFCs

Every component SFC declares:

```ts
defineOptions({
  name: 'LhXxx',
  options: { virtualHost: true, addGlobalClass: true, styleIsolation: 'shared' },
})
```

- `virtualHost: true` — the component does not produce extra wrapping nodes, so custom-class / customStyle land on the target element.
- `addGlobalClass: true` — global styles (`app.wxss` / page styles) can be used inside the component.
- `styleIsolation: 'shared'` — style isolation is in shared mode; component styles and page styles are mutually visible.

**Consumers do not need to configure these three options in pages.json or the project** — they are already declared in the component's own json. If component styles look wrong (all class names are present but the styles do not apply), first check whether the project's `styleIsolation` override is overriding the component-level declaration.
