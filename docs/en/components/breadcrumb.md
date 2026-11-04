# Breadcrumb

Shows the path of the current page so users can jump back to any earlier level.

## Basic usage

```vue
<template>
  <lh-breadcrumb separator="/">
    <lh-breadcrumb-item>Home</lh-breadcrumb-item>
    <lh-breadcrumb-item>Components</lh-breadcrumb-item>
    <lh-breadcrumb-item>Breadcrumb</lh-breadcrumb-item>
  </lh-breadcrumb>
</template>
```

## Clickable items

Non-last items with a `to` prop render as links and navigate via `uni.navigateTo` (the url must be a page path starting with `/`).

```vue
<template>
  <lh-breadcrumb>
    <lh-breadcrumb-item to="/pages/index/index">Home</lh-breadcrumb-item>
    <lh-breadcrumb-item to="/pages/component/index">Components</lh-breadcrumb-item>
    <lh-breadcrumb-item>Breadcrumb</lh-breadcrumb-item>
  </lh-breadcrumb>
</template>
```

## Collapsing

`maxItems` caps the visible item count (ellipsis included): beyond it, the first item, an ellipsis and the last few items are kept; click the ellipsis to expand all.

```vue
<template>
  <lh-breadcrumb :max-items="3">
    <lh-breadcrumb-item>Home</lh-breadcrumb-item>
    <lh-breadcrumb-item>Events</lh-breadcrumb-item>
    <lh-breadcrumb-item>List</lh-breadcrumb-item>
    <lh-breadcrumb-item>Detail</lh-breadcrumb-item>
    <lh-breadcrumb-item>Reviews</lh-breadcrumb-item>
  </lh-breadcrumb>
</template>
```

## Breadcrumb Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| separator | Separator character | `string` | `'/'` |
| maxItems | Max visible items (first item + ellipsis + last few); beyond this it collapses; `0` disables collapsing | `number` | `0` |
| customClass | Custom class name | `string` | — |
| sx | Layout shorthand | `LhSxProps` | — |

## BreadcrumbItem Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| to | Target address; when set and not the last item it renders as a link and navigates via `uni.navigateTo` on click | `string` | — |
| customClass | Custom class name | `string` | — |

## Slots

| Slot | Description |
| --- | --- |
| default | Text content of the breadcrumb item |

::: tip Differences from the Vue 3 version
- `to` does not use vue-router (a uni-app project has no router): navigation is always `uni.navigateTo`; on H5 it follows uni's H5 routing strategy.
- `<nav>/<ol>/<li>` are replaced with `<view>` (WXSS forbids tag selectors); `aria-current="page"` and `aria-label` are preserved.
- Collapsing / ellipsis logic reuses the same share core pure functions, matching plus's behavior.
:::
