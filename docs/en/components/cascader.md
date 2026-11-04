# Cascader

A cascade selector for hierarchical data, such as province / city / district selection. Clicking the trigger opens a multi-column panel; expanding level by level and selecting a leaf node (or any level with `check-strictly`) completes the selection.

## Basic usage

```vue
<template>
  <lh-cascader v-model="value" :options="options" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>([])
const options = [
  {
    value: 'zhinan',
    label: '指南',
    children: [
      {
        value: 'sheji',
        label: '设计指南',
        children: [
          { value: 'yuansze', label: '颜色' },
          { value: 'fuziyuanze', label: '字体' },
        ],
      },
      { value: 'shejiguize', label: '设计规则' },
    ],
  },
  {
    value: 'zujian',
    label: '组件',
    children: [
      { value: 'jiben', label: '基础' },
      { value: 'fankui', label: '反馈' },
    ],
  },
]
</script>
```

Clicking an item with children expands the next column first; clicking a leaf selects it (single selection closes the panel automatically).

## Multiple selection

```vue
<template>
  <lh-cascader v-model="value" :options="options" multiple />
  <!-- Collapsed tags: only the first selected item + a counter -->
  <lh-cascader v-model="value2" :options="options" multiple collapse-tags />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>([])
const value2 = ref<(string | number)[]>(['yuansze', 'fuziyuanze'])
const options = [
  {
    value: 'zhinan',
    label: '指南',
    children: [
      { value: 'sheji', label: '设计指南' },
      { value: 'shejiguize', label: '设计规则' },
    ],
  },
  {
    value: 'zujian',
    label: '组件',
    children: [
      { value: 'jiben', label: '基础组件' },
      { value: 'fankui', label: '反馈组件' },
    ],
  },
]
</script>
```

In multiple mode `v-model` binds the array of **last-level values** of each selected path; selected items are shown as tags inside the trigger.

## Disabled options

`disabled: true` on a node data item disables that node (clicking neither expands nor selects it); the `disabled` prop disables the whole selector; `readonly` shows the value without opening the panel.

```vue
<template>
  <lh-cascader v-model="value" :options="disabledOptions" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>([])
const disabledOptions = [
  {
    value: 'zhinan',
    label: '指南',
    disabled: true,
    children: [{ value: 'sheji', label: '设计指南' }],
  },
  {
    value: 'zujian',
    label: '组件',
    children: [
      { value: 'jiben', label: '基础组件' },
      { value: 'fankui', label: '反馈组件', disabled: true },
    ],
  },
]
</script>
```

## Path display and return value

```vue
<template>
  <!-- Full path (default) -->
  <lh-cascader v-model="value" :options="options" placeholder="Full path (default)" />
  <!-- Last level only -->
  <lh-cascader v-model="value" :options="options" :show-all-levels="false" placeholder="Last level only" />
  <!-- Custom separator -->
  <lh-cascader v-model="value" :options="options" separator=" > " placeholder="Separator >" />
  <!-- v-model binds only the last-level value (echo is still the full path) -->
  <lh-cascader v-model="leafValue" :options="options" :emit-path="false" placeholder="Last-level value only" />
  <!-- Any level selectable (clicking a non-leaf selects it directly) -->
  <lh-cascader v-model="anyValue" :options="options" check-strictly placeholder="Any level selectable" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>(['zhinan', 'sheji', 'yuansze'])
const leafValue = ref<(string | number)[]>(['yuansze'])
const anyValue = ref<(string | number)[]>(['zhinan', 'sheji'])
const options = [
  {
    value: 'zhinan',
    label: '指南',
    children: [
      { value: 'sheji', label: '设计指南', children: [{ value: 'yuansze', label: '颜色' }] },
    ],
  },
]
</script>
```

> The placeholder defaults to the locale key `cascader.placeholder` and can be overridden with `placeholder`.

## Filterable

`filterable` enables search: the filter input lives inside the panel (the Mini Program has no focus semantics inside the trigger); after typing a keyword, matches are shown with their full path and clicking a result selects it directly.

```vue
<template>
  <lh-cascader v-model="value" :options="options" filterable placeholder="Type a keyword to search" />
</template>
```

When nothing matches, the locale key `cascader.noMatch` is shown; override it with the `no-match` slot.

## Field aliases

`item-config` declares node field aliases (`value` / `label` / `children` / `disabled` / `leaf`), so async or backend data needs no manual conversion:

```vue
<template>
  <lh-cascader
    v-model="value"
    :options="aliasedOptions"
    :item-config="{ value: 'id', label: 'name', children: 'sub' }"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>(['zhejiang', 'hangzhou', 'xihu'])
const aliasedOptions = [
  {
    id: 'zhejiang',
    name: '浙江省',
    sub: [{ id: 'hangzhou', name: '杭州市', sub: [{ id: 'xihu', name: '西湖区' }] }],
  },
]
</script>
```

## Cascader API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue | Bound value (last-level only when `emitPath` is `false`) | `(string \| number)[]` | `() => []` |
| options | Option list (tree structure) | `LhCascaderNode[]` | `() => []` |
| size | Size | `LhCascaderSize` | `'medium'` |
| disabled | Disable the whole selector | `boolean` | `false` |
| clearable | Clearable | `boolean` | `true` |
| placeholder | Placeholder (falls back to the locale key cascader.placeholder) | `string` | — |
| readonly | Read-only (panel does not open) | `boolean` | `false` |
| showAllLevels | Show the full path in the trigger | `boolean` | `true` |
| checkStrictly | Any level of node can be selected | `boolean` | `false` |
| emitPath | Whether the return value contains the full path | `boolean` | `true` |
| multiple | Multiple selection | `boolean` | `false` |
| cascading | Cascading association (hover to expand children, H5 only) | `boolean` | `true` |
| separator | Path separator | `string` | `'/'` |
| collapseTags | Collapse tags in multiple mode | `boolean` | `false` |
| filterable | Searchable | `boolean` | `false` |
| itemConfig | Node field aliases | `LhCascaderItemConfig` | `() => ({})` |
| customClass | Custom class name (forwarded to the root node) | `string` | — |
| themeVars | Component-level theme variables | `Record<string, string>` | — |
| sx | Quick layout props (applied to the trigger root; the overlay panel is unaffected) | `LhSxProps` | — |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:modelValue | Fired when the bound value changes | `(value: (string \| number)[])` |
| change | Fired when the selection changes | `(value: (string \| number)[], path: LhCascaderNode[] \| null)` |

### Slots

| Slot | Description |
| --- | --- |
| no-match | Custom content when the filter matches nothing |

### Data structure

`LhCascaderNode` type definition:

```ts
interface LhCascaderNode {
  value: string | number
  label: string
  disabled?: boolean
  leaf?: boolean
  children?: LhCascaderNode[]
}
```

### Accessibility

- The trigger carries `aria-haspopup="listbox"` / `aria-expanded` / `aria-controls` (produced by share's `getCascaderTriggerAria`, bound key by key)
- The panel is `role="dialog"`; each column is `role="listbox"` (its `aria-label` comes from the locale key `cascader.columnLabel`), and each item is `role="option"` with `aria-selected` / `aria-disabled` / `aria-expanded`
- The positioning engine is a hand-written pure function (flip / shift overflow protection) with zero third-party runtime dependencies

::: tip Platform differences (differences from the Vue3 version)
- **Panelized overlay**: plus mounts the panel under `Teleport to="body"` with a `Transition` fade; on uni-app it is carried by `lh-root-portal` (in-page fixed fallback on older base libraries) and positioned with two-frame asynchronous measurement (render hidden to measure → `computePosition` → show, to avoid flicker). The computation is asynchronous; do not assume a synchronous result. No enter/leave transition is bound (`Transition` is unreliable on MP, consistent with tooltip / dropdown / popover).
- **Column scrolling**: each column is an independent vertical `scroll-view` (`scroll-y`) — the MP `view` has no reliable overflow scrolling; the `overflow-y: auto` column containers from the share scss fall back to the H5 implementation of `scroll-view` on the H5 side.
- **Keyboard navigation is H5-only**: the trigger opens/closes with Enter/Space and arrow keys move focus into the panel; inside the panel ↑↓ move within a column (skipping disabled items), ←→ move across columns, Enter/Space behave like a click; Escape closes via a document-level listener (closing only the topmost overlay when several are stacked). The whole block is stripped by conditional compilation, with no dead code in the MP bundle.
- **Hover expansion is H5-only**: `cascading` hover-expansion depends on hover semantics, which the Mini Program does not have; children can only be expanded by tap (`cascading` is effectively hover-expansion off on MP).
- **Filter input placement**: plus uses the trigger itself as the filterable input; uni-app moves the filter input into the panel (like select), since the MP has no focus semantics inside the trigger.
- **Outside-click closing**: plus listens to document clicks with `useLhClickOutside`; uni-app uses an in-page transparent mask (clicking the mask closes).
- **No auto-close when the trigger scrolls out of the viewport**: uni-app has no unified scroll / resize channel, so it is not ported.
- **Focus ring / roving tabindex are H5-only**: the MP has no keyboard focus semantics; the `tabindex` binding produces no value on MP.
:::
