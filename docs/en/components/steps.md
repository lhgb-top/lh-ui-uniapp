# Steps

Guide users through a task flow. Supports horizontal / vertical layouts, icons, descriptions and click navigation. A display-only + status component, fully usable on both H5 and WeChat Mini Program.

## Basic usage

`current` sets the active step index (0-based, two-way bindable with `v-model:current`). Steps before it are `finish`, the step itself is `process`, steps after it are `wait`.

```vue
<template>
  <lh-steps :current="current">
    <lh-step
      title="Grind ink"
      description="Ink in five tones"
    />
    <lh-step
      title="Draft"
      description="Compose the layout"
    />
    <lh-step
      title="Lay the ink"
      description="Brushwork as bone"
    />
    <lh-step
      title="Inscription"
      description="The finishing touch"
    />
  </lh-steps>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const current = ref(1)
</script>
```

## Vertical steps

`direction="vertical"` switches to a vertical layout (CSS-driven, no platform difference).

```vue
<template>
  <lh-steps
    :current="1"
    direction="vertical"
  >
    <lh-step
      title="Order placed"
      description="2026-10-01 10:00"
    />
    <lh-step
      title="Payment received"
      description="2026-10-01 10:05"
    />
    <lh-step
      title="Shipped"
      description="Estimated delivery 10-03"
    />
    <lh-step title="Confirm receipt" />
  </lh-steps>
</template>
```

## With icons

Pass `icon` to `lh-step` to use the built-in icon font (see the Icon docs for names). Without it, `finish` shows a check, `error` shows a cross, and the rest show ordinal numbers.

```vue
<template>
  <lh-steps :current="1">
    <lh-step
      title="Register"
      icon="user"
    />
    <lh-step
      title="Verify"
      icon="email"
    />
    <lh-step
      title="Done"
      icon="check"
    />
  </lh-steps>
</template>
```

The `icon` slot fully overrides the default fallback (custom graphics or text both work):

```vue
<template>
  <lh-steps :current="2">
    <lh-step title="Step one">
      <template #icon>
        <text class="step-badge">I</text>
      </template>
    </lh-step>
    <lh-step title="Step two">
      <template #icon>
        <text class="step-badge">II</text>
      </template>
    </lh-step>
    <lh-step title="Step three">
      <template #icon>
        <text class="step-badge">III</text>
      </template>
    </lh-step>
  </lh-steps>
</template>
```

## Clickable navigation

With `clickable`, steps that are `finish` or `process` render a clickable head; clicking emits `update:current` (v-model) and `change`. Upcoming `wait` steps are not navigable.

```vue
<template>
  <lh-steps
    v-model:current="active"
    clickable
  >
    <lh-step title="Step one" />
    <lh-step title="Step two" />
    <lh-step title="Step three" />
  </lh-steps>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref(1)
</script>
```

## Forced status override

`status` overrides the derived status of every step (`wait` / `process` / `finish` / `error`) for custom presentations.

```vue
<template>
  <lh-steps
    :current="2"
    status="error"
  >
    <lh-step title="Step one" />
    <lh-step title="Step two" />
    <lh-step title="Step three" />
  </lh-steps>
</template>
```

## Steps Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| current | Active step index (v-model:current, 0-based) | `number` | `0` |
| direction | Direction: `'horizontal'` / `'vertical'` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| clickable | Whether steps are clickable (only finished / in-progress steps are) | `boolean` | `false` |
| status | Overrides the status of all steps (for custom presentations) | `'wait' \| 'process' \| 'finish' \| 'error'` | — |
| customClass | Custom class name (forwarded to the root node) | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## Step Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| title | Step title (title slot also works) | `string` | `''` |
| description | Step description (description slot also works) | `string` | `''` |
| icon | Custom icon name (without it, finish/error use a check/cross, others show an ordinal) | `LhIconName` | — |
| customClass | Custom class name (forwarded to the item root node) | `string` | — |

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| update:current | Active step changed (v-model:current) | `(index: number)` |
| change | Navigation by clicking a clickable step | `(index: number)` |

## Slots

| Slot | Description |
| --- | --- |
| Steps default | Step items (only `lh-step` is collected) |
| Step icon | Circle content (overrides the icon prop and the ordinal fallback) |
| Step title | Title (overrides the title prop) |
| Step description | Description (overrides the description prop) |

## Platform differences

- **A display-only + status component, fully usable on H5 and WeChat Mini Program**; horizontal / vertical layout is CSS-driven and identical on both platforms.
- `<ol>/<li>` are replaced with `<view>` (WXSS forbids tag selectors); clickable heads use `view` + `role="button"` (the Mini Program `<button>` carries native styles that cannot be reset). The accessible names come from the share locales keys `steps.step` / `steps.finish` / `steps.error` (all nine languages included, no copy kept in this repo).
- **The "last step draws no connector" mechanism differs per platform**: in the share source the connectors (horizontal `::after` / vertical `::before`) rely on the structural `:not(:last-child)` to skip the last item; WXSS does not support `:not()`, so the build strips it (every item draws the connector) and the hiding of the last / line-end items is delegated to the `--line-last` class:
  - Horizontal: the wrap measurement logic is the same as the Vue 3 version (`getStepsLineLastIndices`), but measuring goes through the adapter `getLhRect` (H5 uses document queries, MP uses the async `createSelectorQuery`, which must run after onMounted).
  - Vertical: no wrapping, so the global last item is marked directly, and the component SFC adds one uni-app adapter rule to hide `--line-last::before` (the share source has no such rule).
- **Re-measuring wrap on container resize is H5 only**: H5 uses `ResizeObserver`; MP has no such API, step add/remove and direction switching still re-measure, but dynamic size changes need a page re-entry (an accepted degradation that keeps the MP bundle free of dead code).
- **Porting decision (aligned with the Vue 3 version, no invented APIs)**: at port time the plus source of truth did not provide a `simple` mode, `process-status` / `finish-status` custom statuses, `space` spacing, or similar APIs (the source props are `current` / `direction` / `clickable` / `status` / `themeVars` / `sx`), so this library does not provide them either. This library also omits `themeVars` (the ConfigProvider `componentTheme` allow-list does not include steps yet). These will follow once the source of truth adds them.
