# Layout

Page-level skeleton: `lh-layout` paired with the `lh-header` / `lh-aside` / `lh-main` / `lh-footer` subcomponents (easycom lets you use the tags directly; when importing on demand the component names are `LhLayout` / `LhHeader` / `LhAside` / `LhMain` / `LhFooter`).

## Basic usage (header / main / footer)

The container needs an explicit height: `lh-layout` is itself a `flex: 1` flex container, so when placed inside a normal flow parent you must give it a height via `sx` or an outer style for the header / main / footer children to stretch proportionally.

```vue
<template>
  <lh-layout direction="vertical" :sx="{ h: '240px' }">
    <lh-header>Header</lh-header>
    <lh-main>Content</lh-main>
    <lh-footer>Footer</lh-footer>
  </lh-layout>
</template>
```

## Direction

`direction` explicitly controls how children are laid out: the default is `horizontal` (side by side); it switches to `vertical` automatically when an `lh-aside` is present, and can also be set manually.

```vue
<template>
  <lh-layout direction="horizontal" :sx="{ h: '80px' }">
    <lh-main>Side by side</lh-main>
    <lh-main>Side by side</lh-main>
  </lh-layout>
  <lh-layout direction="vertical" :sx="{ h: '140px', mt: '12px' }">
    <lh-main>Stacked vertically</lh-main>
    <lh-main>Stacked vertically</lh-main>
  </lh-layout>
</template>
```

## With aside

When an `lh-aside` is present the parent switches to vertical automatically (header on top, aside and main side by side).

```vue
<template>
  <lh-layout direction="vertical" :sx="{ h: '240px' }">
    <lh-header>Header</lh-header>
    <lh-layout :sx="{ flex: '1', minHeight: '0px' }">
      <lh-aside :width="140" aria-label="Side navigation">Aside</lh-aside>
      <lh-main>Content</lh-main>
    </lh-layout>
    <lh-footer>Footer</lh-footer>
  </lh-layout>
</template>
```

`width` accepts a `number` (treated as px) or a `string` with units (such as `'30%'`); when omitted it falls back to `--lh-layout-aside-width` (220px by default).

## Layout Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| direction | Layout direction (automatically vertical when an Aside is present) | `'horizontal' \| 'vertical'` | `'horizontal'` |
| customClass | Custom class name (forwarded to the root node) | `string` | — |
| sx | Quick layout properties | `LhSxProps` | — |

## Header / Main / Footer Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| customClass | Custom class name (forwarded to the root node) | `string` | — |
| sx | Quick layout properties | `LhSxProps` | — |

## Aside Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| width | Aside width | `number \| string` | — |
| ariaLabel | Accessible name (landmark naming) | `string` | — |
| customClass | Custom class name (forwarded to the root node) | `string` | — |
| sx | Quick layout properties | `LhSxProps` | — |

## Slots

| Slot | Description |
| --- | --- |
| default | Layout content (all five components expose a default slot) |

## Platform differences

- **Pure CSS layout component**: there is no layout module in share core; the logic layer only carries a provide/inject context (the parent switches to vertical once an Aside registers), with no measuring, no overlays and no document dependency — behavior is identical on H5 and the WeChat Mini Program.
- **Tag replacement**: the `<section>` / `<header>` / `<aside>` / `<main>` / `<footer>` tags of the plus version are replaced with `view` elements (WXSS forbids tag selectors, styles rely on the `lh-layout*` class names).
- **Landmark semantics**: the landmark roles natively provided by the semantic tags are restored with `role` attributes — `banner` for header, `complementary` for aside, `main` for main, `contentinfo` for footer; when multiple `aside` elements are used, distinguish them with `ariaLabel` (for example "Side navigation", "Related links").
- **Scroll containers**: the `overflow: auto` of `lh-main` and `lh-aside` scrolls the element itself on H5; **a Mini Program page has no scrollable body container** (page scrolling is owned by the `page` root node), so if you place an entire page's content directly inside `lh-main` on a Mini Program, element-level scrolling and page-level scrolling may stack and produce double scrollbars. For a full-page layout with an aside, give the outer wrapper `h: '100vh'` so `lh-main` scrolls on its own; or wrap the content in a `scroll-view` as needed.
- **Porting conclusion**: works on all platforms with behavior identical to the plus version; the only thing to keep in mind is the "page-level scrolling vs element-level scrolling" container semantics on Mini Programs.

::: tip Differences from the Vue 3 version
- Semantic tags are replaced with `view` plus `role` attributes (WXSS forbids tag selectors); the accessibility semantics are preserved.
- Subcomponent tags follow the easycom convention `lh-header` / `lh-aside` / `lh-main` / `lh-footer` (the corresponding component names when importing on demand are `LhHeader`, etc.).
- A `customClass` prop is added: on uni-app a plain class cannot penetrate `styleIsolation`, so custom classes are forwarded via a prop (the plus version passes classes directly).
- The direction mechanism and the provide/inject based Aside-to-vertical switch are exactly the same as in the plus version.
:::
