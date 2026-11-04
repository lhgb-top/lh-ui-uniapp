# Pagination

Page navigation: previous page / page numbers / ellipsis / next page / total count / size changer / jumper. The page window shrinking algorithm (first and last pages always visible, siblings around the current page, ellipsis only when a real gap appears) is implemented as a pure function in the `@lh-ui/share` core.

## Basic usage

`total` is the number of data items (required); the default page size is 10.

```vue
<template>
  <lh-pagination :total="120" />
</template>
```

## Total count and size changer

`show-total` displays the total count; `show-size-changer` displays the page size switcher (carried by the built-in picker on uni).

```vue
<template>
  <lh-pagination :total="480" show-total show-size-changer />
</template>
```

## Jumper

`show-jumper` displays the jump input; after typing a page number, press enter (confirm) or blur to submit, with out-of-range values clamped automatically.

```vue
<template>
  <lh-pagination :total="480" show-total show-jumper />
</template>
```

## Simple mode

`simple` collapses the page number area and only shows "current page / total pages".

```vue
<template>
  <lh-pagination :total="480" simple show-jumper />
</template>
```

## Controlled usage

The current page is controlled with `v-model:current`.

```vue
<template>
  <lh-pagination v-model:current="page" :total="95" />
  <text>Current page: {{ page }}</text>
</template>

<script setup>
import { ref } from 'vue'
const page = ref(2)
</script>
```

## Page size and disabled

`v-model:page-size` controls the page size, `page-sizes` customizes the size options; when the current page falls out of range after a size change it is clamped automatically; `disabled` disables the whole pagination.

```vue
<template>
  <lh-pagination
    v-model:page-size="pageSize"
    :total="480"
    show-size-changer
    :page-sizes="[10, 20, 50, 100]"
  />
  <text>Page size: {{ pageSize }}</text>
  <lh-pagination :total="480" disabled />
</template>

<script setup>
import { ref } from 'vue'
const pageSize = ref(20)
</script>
```

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| total | Number of data items (required) | `number` | — |
| pageSize | Items per page (controlled with the `update:pageSize` event) | `number` | `10` |
| current | Current page (`v-model:current`) | `number` | — |
| pageSizes | Page size options | `number[]` | `[10, 20, 30, 40]` |
| showTotal | Show the total count | `boolean` | `false` |
| showSizeChanger | Show the page size switcher | `boolean` | `false` |
| showJumper | Show the jump input | `boolean` | `false` |
| simple | Compact mode | `boolean` | `false` |
| disabled | Whether disabled | `boolean` | `false` |
| sx | Quick layout props | `LhSxProps` | — |

## Events

| Event | Description | Callback parameters |
| --- | --- | --- |
| update:current | Emitted when the current page changes, used with `v-model:current` | `(page: number)` |
| update:pageSize | Emitted when the page size changes, used with `v-model:page-size` | `(size: number)` |
| change | Emitted when the current page changes (page numbers / prev / next / jumper all trigger it) | `(page: number)` |
| size-change | Emitted when the page size changes | `(size: number)` |

## Accessibility

- Root node `role="navigation"` + `aria-label="pagination"`
- The current page button gets `aria-current="page"` automatically; every page button and the prev / next buttons carry an individual `aria-label` (from the locale keys `pagination.page` / `prev` / `next`); the bare symbols "‹" "›" are hidden with `aria-hidden`
- Page buttons and prev / next are `role="button"` and output `aria-disabled` when disabled
- The ellipsis is a purely presentational `aria-hidden` element that does not disturb reading

## Platform differences

- **Touch interaction drawn with view, available on all platforms**: the `<nav>` / `<button>` / `<ul>` / `<span>` of the Vue 3 version are replaced with `<view>` / `<text>` (WXSS forbids tag selectors, class names carry the styles); page numbers and prev / next switch via `@click` and behave identically on H5 and the WeChat Mini Program, with no platform API dependency.
- **The page overflow ellipsis logic lives in core**: the window shrinking algorithm (first / last pages always visible, one sibling page on each side of the current page, snapping to the edges when short of pages, ellipsis only when a real gap appears) is the pure function `getPaginationRange` of the `@lh-ui/share` core; page clamping (`clampPage`) and page counting (`getPageCount`) also come from core — this repo only adds reactive glue.
- **The size changer is carried by the built-in picker**: uni has no `<select>`, so `show-size-changer` is carried by the uni built-in `<picker mode="selector">` with `page-sizes` as the options; the change event's value is in `event.detail.value` (the option index). H5 opens uni's picker panel, the Mini Program opens the native wheel picker.
- **The jumper commits at a different time**: uni's input has no native change event, so the commit happens on enter (confirm — triggered by both the H5 enter key and the Mini Program keyboard "done") or on blur, and the input event's value is read from `event.detail.value` (same precedent as lh-input-number); the native `min` / `max` attributes are not forwarded — page numbers are always clamped by core's `clampPage`. The Vue 3 version jumps back to page 1 when the input is cleared and then blurred; this library tightens that to no jump (empty strings and invalid numbers emit no events).
- **Disabled looks rely on a class fallback**: the disabled styles in the share style source live on the `&:disabled` pseudo-class (which only matches button elements), and view has no such pseudo-class, so the component adds an inline `lh-pagination__btn--disabled` rule with the same token (`--lh-disabled-text-color`), following the inline fallback precedent of lh-segmented / lh-input-number (not part of the purified output).
- **Accessibility attributes are bound one by one**: the contract for the page buttons' `aria-current` / `aria-label` is decided by share's `getPaginationItemAria`; because the Mini Program template compiler does not support `v-bind` with an object, the glue layer flattens the attribute bag into explicit per-item bindings.
- **Porting conclusion**: Pagination is a pure switching component with no measuring, no overlays and no document dependency; the page range, clamping and accessibility attributes are all produced by the pure functions of the `@lh-ui/share` core, and this repo only adds reactive glue. The API is identical to the Vue 3 version (`total` / `pageSize` / `current` / `pageSizes` / `showTotal` / `showSizeChanger` / `showJumper` / `simple` / `disabled` / `sx`).
