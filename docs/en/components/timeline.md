# Timeline

A vertical event flow. Time order is the document order. Supports timestamps, semantic types, hollow dots and an alternate layout.

> Purely presentational: no events, no controlled state — H5 and WeChat Mini Program behave identically (see "Platform differences" at the end).

## Basic usage

`timestamp` sets the timestamp text; `type` gives the node dot a semantic color (`'primary'` / `'success'` / `'warning'` / `'danger'`).

```vue
<template>
  <lh-timeline>
    <lh-timeline-item timestamp="2026-09-01">
      Project kickoff review
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="2026-09-15"
      type="success"
    >
      Phase one delivered
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="2026-09-25"
      type="warning"
    >
      Acceptance in progress
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## Alternate layout

`mode="alternate"` splits the timeline around a central axis: items alternate left and right by index (even indexes on the left, odd ones on the right).

```vue
<template>
  <lh-timeline mode="alternate">
    <lh-timeline-item timestamp="Q1">
      Planning
    </lh-timeline-item>
    <lh-timeline-item timestamp="Q2">
      Development
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="Q3"
      type="danger"
    >
      Stress test
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="Q4"
      type="success"
    >
      Launch
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## Hollow dots

`hollow` renders the node as a hollow dot, commonly used for pending states.

```vue
<template>
  <lh-timeline>
    <lh-timeline-item
      timestamp="Q1"
      hollow
    >
      Not started
    </lh-timeline-item>
    <lh-timeline-item timestamp="Q2">
      In progress
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="Q3"
      type="success"
    >
      Completed
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## Custom timestamp and dot

Both `timestamp` and `dot` are slots: use the `#timestamp` slot instead of the prop for arbitrary content; the `#dot` slot replaces the default dot (an icon, for example).

```vue
<template>
  <lh-timeline>
    <lh-timeline-item type="primary">
      <template #timestamp>
        September 2026
      </template>
      Custom timestamp content
    </lh-timeline-item>
    <lh-timeline-item type="success">
      <template #dot>
        <lh-icon
          name="check"
          :size="12"
        />
      </template>
      Custom dot (lh-icon)
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## Timeline Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| mode | Layout: `'left'` single-side / `'alternate'` left-right | `'left' \| 'alternate'` | `'left'` |
| customClass | Custom class name | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## TimelineItem Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| timestamp | Timestamp text (or the `#timestamp` slot) | `string` | — |
| type | Node semantic type (dot border is colored by token) | `'primary' \| 'success' \| 'warning' \| 'danger'` | — |
| hollow | Hollow node (commonly for pending states) | `boolean` | `false` |
| customClass | Custom class name (forwarded to the item root node) | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## Slots

| Slot | Description |
| --- | --- |
| Timeline default | Item nodes (`lh-timeline-item`) |
| TimelineItem default | Item body content |
| TimelineItem timestamp | Timestamp content (the row is not rendered when neither the prop nor the slot is given) |
| TimelineItem dot | Custom dot (the default dot is purely decorative and kept out of the accessibility tree) |

## Platform differences

- The timeline is a **purely presentational component**: no events, no controlled state, no measuring or platform API calls — H5 and WeChat Mini Program are both fully supported and render identically.
- The semantic `<ol>` / `<li>` list is carried by `<view>` on both platforms (tag selectors are forbidden in WXSS, classes apply the styles), with `role="list"` / `role="listitem"` keeping the list semantics; Mini Program screen-reader support depends on the platform.
- Connector lines and the central axis are pure CSS pseudo-elements (`::before`) with no JS measuring; the alternate layout is driven by index parity plus flex direction, identically on both platforms.
- **WXSS purification**: the share stylesheet's `.lh-timeline__item:not(.lh-timeline__item--last)` has its `:not()` qualifier stripped at build time (`:not()` is unsupported in WXSS). Whether a non-last item draws its connector is taken over by `.lh-timeline__item--last::before`, whose specificity is no lower — the rendered result is unchanged on both platforms.
- Accessibility: node dots are purely decorative (`aria-hidden="true"`), and the custom dot slot stays out of the accessibility tree, same as the Vue 3 version.
- **Porting decision (aligned with the Vue 3 version, no invented APIs)**: at port time the plus source of truth and `@lh-ui/share` core did not yet provide `placement` (timestamp position) or `center` (centered layout), so this library does not provide them either; `mode` currently offers only `'left'` / `'alternate'`. These will follow once the source of truth adds them.
