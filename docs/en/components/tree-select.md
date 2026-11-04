# TreeSelect

A tree selector for hierarchical data, such as organization structures or category trees. Clicking the trigger opens a tree panel; in single selection clicking a node selects it and closes the panel, in multiple selection nodes are checked via checkboxes (parent-child cascading).

## Basic usage

```vue
<template>
  <lh-tree-select v-model="value" :data="data" placeholder="请选择节点" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<string | undefined>(undefined)
const data = [
  {
    key: 'zhinan',
    label: '指南',
    children: [
      {
        key: 'sheji',
        label: '设计指南',
        children: [
          { key: 'yuansze', label: '颜色' },
          { key: 'fuziyuanze', label: '字体' },
        ],
      },
      { key: 'shejiguize', label: '设计规则' },
    ],
  },
  {
    key: 'zujian',
    label: '组件',
    children: [
      { key: 'jiben', label: '基础' },
      { key: 'fankui', label: '反馈' },
    ],
  },
]
</script>
```

Clicking a node selects it (non-leaf nodes included) and closes the panel; clicking the expand arrow on the left of a node only expands / collapses it without changing the selection. The trigger echoes the `label` of the selected node.

## Multiple selection

```vue
<template>
  <lh-tree-select v-model="value" :data="data" multiple placeholder="请选择多个节点" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<string[]>(['jiben', 'fankui'])
const data = [
  {
    key: 'zujian',
    label: '组件',
    children: [
      { key: 'jiben', label: '基础' },
      { key: 'fankui', label: '反馈' },
    ],
  },
]
</script>
```

In multiple selection `v-model` binds the checked key array (`string[]`) with parent-child cascading: checking a parent automatically checks all checkable descendants, a parent becomes fully checked when all its descendants are checked and half-selected (indeterminate) when some of them are. Clicking a node label only expands it; checking is done via the checkbox (consistent with the Vue3 version). The trigger echoes the labels of all checked keys joined with '、'.

## Disabled nodes

`disabled: true` in the node data disables that node (clicking neither expands nor selects it, and its checkbox is not clickable); the `disabled` prop disables the whole selector.

```vue
<template>
  <lh-tree-select v-model="value" :data="disabledData" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<string | undefined>(undefined)
const disabledData = [
  {
    key: 'zhinan',
    label: '指南',
    children: [
      {
        key: 'sheji',
        label: '设计指南',
        disabled: true,
        children: [{ key: 'yuansze', label: '颜色' }],
      },
      { key: 'shejiguize', label: '设计规则' },
    ],
  },
]
</script>
```

## TreeSelect API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue | Bound value (`string` for single selection / `string[]` for multiple, controlled v-model) | `string \| string[] \| undefined` | — |
| data | Tree data | `LhTreeNode[]` | `() => []` |
| multiple | Whether multiple selection is enabled (checkboxes shown, value is the checked key array, parent-child cascading) | `boolean` | `false` |
| disabled | Whether the whole selector is disabled | `boolean` | `false` |
| placeholder | Placeholder (falls back to the locale key `select.placeholder`, 'Please select' in English) | `string` | — |
| customClass | Custom class name (forwarded to the root node) | `string` | — |
| themeVars | Component-level theme variables | `Record<string, string>` | — |
| sx | sx quick layout props (applied to the trigger root element, the floating panel is not affected) | `LhSxProps` | — |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:modelValue | Fired when the bound value changes | `(value: string \| string[] \| undefined)` |
| change | Fired when the selection changes | `(value: string \| string[] \| undefined)` |

### Data structure

`LhTreeNode` type definition (source of truth in `@lh-ui/share/core/tree`):

```ts
interface LhTreeNode {
  /** Unique key */
  key: string
  /** Display text */
  label: string
  /** Children */
  children?: LhTreeNode[]
  /** Disabled */
  disabled?: boolean
  /** Whether it is a leaf (inferred from children when omitted) */
  isLeaf?: boolean
}
```

### Accessibility

- The trigger carries `aria-haspopup="tree"` / `aria-expanded` / `aria-label` (from the locale key `treeSelect.triggerLabel`)
- The panel is `role="listbox"`, the embedded tree is `role="tree"`, nodes are `role="treeitem"` with `aria-level` / `aria-expanded` / `aria-selected` / `aria-disabled`; in multiple selection the panel carries `aria-multiselectable` and checkboxes are `role="checkbox` with `aria-checked` (`mixed` for indeterminate)
- Level indentation, expand-arrow rotation and checkbox tri-state appearance all come from the share style source (`@lh-ui/share/styles/tree`), with no duplicated styles on this side

::: tip Platform differences (differences from the Vue3 version)
- **Glue composition instead of a dedicated core**: share core has no tree-select module; this side follows the plus implementation shape and composes a 'select trigger + lh-tree panel' — the panel embeds `lh-tree`, and all tree logic (expansion / selection / cascaded checking) is consumed from `core/tree` pure functions (`flattenTree` / `toggleCheckKeys` / `getNodeCheckState`, …) with nothing copied. The API and events are aligned with plus; no capabilities were added on this side.
- **Panelized overlay**: plus mounts the panel under `Teleport to="body"`; on uni-app it is carried by `lh-root-portal` (in-page fixed fallback on older base libraries) and positioned with two-frame asynchronous measurement (render hidden to measure → `computePosition` → show, to avoid flicker). The computation is asynchronous; do not assume a synchronous result.
- **Tree panel scrolling**: the share scss `.lh-tree-select__panel` uses `overflow: auto`, but the MP `view` has no reliable overflow scrolling, so the panel wraps the tree in a `scroll-view` (`scroll-y`) for vertical scrolling, with the max-height aligned to the share value of 320px.
- **No keyboard navigation**: plus closes the panel with Escape via document-level keyboard listeners; the Mini Program has no keyboard events, so this side closes the panel by tapping an in-page transparent mask (like select / cascader), with no conditional-compilation degradation.
- **`teleported` prop not ported**: plus uses it to control whether the panel is mounted on body; on uni-app the overlay always goes through `lh-root-portal`, so the semantics do not exist.
- **Outside-click closing**: plus listens to document clicks with `useLhClickOutside`; uni-app uses an in-page transparent mask (clicking the mask closes).
- **Controlled checked state fix**: plus does not pass `checked-keys` to the embedded tree, so a preset multiple value is not reflected in the checkboxes; this side passes `v-model` as `checked-keys` as well, so both the checkboxes and the trigger echo are driven by `v-model` with an unchanged API.
- **No auto-close when the trigger scrolls out of the viewport**: uni-app has no unified scroll / resize channel, so it is not ported.
:::
