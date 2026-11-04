# Tabs

Switch between panes within the same area. The tab header scrolls horizontally, supports a card style and closable / addable tabs.

## Basic usage

Bind the active pane `name` with `v-model`; when omitted the first enabled pane is activated.

```vue
<template>
  <lh-tabs v-model="active">
    <lh-tab-pane
      name="ink"
      label="Ink"
    >
      Ink wash: scorched, thick, heavy, light, clear.
    </lh-tab-pane>
    <lh-tab-pane
      name="danqing"
      label="Painting"
    >
      Danqing: cinnabar and azurite, a classical term for painting.
    </lh-tab-pane>
    <lh-tab-pane
      name="liubai"
      label="Whitespace"
    >
      Whitespace: treat blank space as ink, leaving room for the spirit.
    </lh-tab-pane>
  </lh-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref('ink')
</script>
```

## Card style

`type="card"` switches to a card appearance.

```vue
<template>
  <lh-tabs
    v-model="active"
    type="card"
  >
    <lh-tab-pane
      name="spring"
      label="Spring"
    >
      Spring: plants sprout.
    </lh-tab-pane>
    <lh-tab-pane
      name="summer"
      label="Summer"
    >
      Summer: all things blossom.
    </lh-tab-pane>
  </lh-tabs>
</template>
```

## Tab position

`tab-position="bottom"` places the tab header below the content.

```vue
<template>
  <lh-tabs
    v-model="active"
    tab-position="bottom"
  >
    <lh-tab-pane
      name="poem"
      label="Poetry"
    >
      Poetry: to express aspiration.
    </lh-tab-pane>
    <lh-tab-pane
      name="painting"
      label="Painting"
    >
      Painting: to convey the idea.
    </lh-tab-pane>
  </lh-tabs>
</template>
```

## Disabled panes

A `lh-tab-pane` with `disabled` cannot be activated (clicks are ignored, and a `modelValue` pointing at it falls back to the first enabled pane).

```vue
<template>
  <lh-tabs v-model="active">
    <lh-tab-pane
      name="first"
      label="Enabled"
    >
      The first pane is enabled.
    </lh-tab-pane>
    <lh-tab-pane
      name="second"
      label="Disabled"
      disabled
    >
      This pane is disabled and cannot be activated.
    </lh-tab-pane>
  </lh-tabs>
</template>
```

## Closable and addable

`closable` renders a close button on each tab (emitting `tab-remove` when clicked); `addable` renders an add button (emitting `tab-add`). The component only emits events — adding and removing pane nodes is up to the business layer, same as the Vue 3 version.

```vue
<template>
  <lh-tabs
    v-model="active"
    closable
    addable
    @tab-remove="handleRemove"
    @tab-add="handleAdd"
  >
    <lh-tab-pane
      v-for="pane in panes"
      :key="pane.name"
      :name="pane.name"
      :label="pane.label"
    >
      {{ pane.label }}: pane content.
    </lh-tab-pane>
  </lh-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref('one')
const panes = ref([
  { name: 'one', label: 'Tab one' },
  { name: 'two', label: 'Tab two' },
])

function handleRemove(name: string) {
  panes.value = panes.value.filter((pane) => pane.name !== name)
}

function handleAdd() {
  panes.value.push({ name: `new-${panes.value.length + 1}`, label: 'New tab' })
}
</script>
```

## Tabs Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue | Name of the active pane (v-model) | `string` | — |
| type | Appearance: `'line'` underline / `'card'` | `'line' \| 'card'` | `'line'` |
| closable | Whether tabs are closable | `boolean` | `false` |
| addable | Whether to show the add button | `boolean` | `false` |
| tabPosition | Tab position: `'top'` / `'bottom'` | `'top' \| 'bottom'` | `'top'` |
| customClass | Custom class name | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## TabPane Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| name | Unique pane identifier (stable key, avoid changing it dynamically) | `string` | — |
| label | Tab label | `string` | `''` |
| disabled | Whether the pane is disabled | `boolean` | `false` |
| customClass | Custom class name (forwarded to the pane root node) | `string` | — |

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| update:modelValue | Active pane changed (v-model) | `(name: string)` |
| tab-change | Active pane changed by user interaction | `(name: string)` |
| tab-remove | The close button was clicked; the component does not remove child nodes itself — the business layer maintains them | `(name: string)` |
| tab-add | The add button was clicked; the component does not add child nodes itself — the business layer maintains them | — |

## Slots

| Slot | Description |
| --- | --- |
| Tabs default | Pane nodes (only `lh-tab-pane` is collected; may be wrapped in `v-for` / `template`) |
| TabPane default | Pane content |

## Platform differences

- The tab header is a `scroll-view` (horizontally scrollable nav bar): on WeChat Mini Program `enable-flex` turns the scroll container into a flex layout so tabs never shrink or wrap; on H5 the class `display: flex` applies.
- **The active underline is a pure CSS transition** (the `::after` ink line of the active tab) and does not rely on `transitionend`. If a JS-driven sliding indicator is added later: `transitionend` is unreliable on Mini Program, so animation completion must be aligned with `setTimeout` (the same approach as the message / loading transitions).
- **Keyboard navigation (arrows / Home / End / Delete to close) is H5 only**: Mini Program has no keyboard events, and a compile-time constant guard keeps the navigation branch out of the MP bundle (no dead code). The `tabindex` attribute is kept on MP but has no keyboard semantics there.
- Accessibility `role="tablist" / "tab" / "tabpanel"` and `aria-selected` / `aria-controls` / `aria-labelledby` are output on both platforms; Mini Program screen-reader support depends on the platform.
- The tab and panel `id`s are prefixed with a per-instance unique value (`generateId`), so multiple tabs per page never clash.
- **Porting decision (aligned with the Vue 3 version, no invented APIs)**: at port time the plus source of truth and `@lh-ui/share` core did not yet provide `lazy`, `before-leave`, `editable` (= closable + addable sugar) or a `border-card` style, so this library does not provide them either. Pane content is always rendered and toggled with `v-show`. These will follow once the source of truth adds them.
