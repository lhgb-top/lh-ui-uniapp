# Tree

Display and interact with hierarchical data. All pure logic — expand / collapse, checkbox
cascading, lazy-load merging — is consumed from the `@lh-ui/share` core pure functions
(`flattenTree` / `toggleCheckKeys` / `mergeLoadedChildren` and friends); the component layer
only handles rendering, events and keyboard navigation.

## Basic usage

```vue
<template>
  <lh-tree :data="treeData" :default-expanded-keys="['a']" />
</template>

<script setup lang="ts">
import type { LhTreeNode } from '@lh-ui/share/core/tree'

const treeData: LhTreeNode[] = [
  {
    key: 'a',
    label: 'Frontend',
    children: [
      { key: 'a-1', label: 'Vue' },
      { key: 'a-2', label: 'React' },
    ],
  },
  { key: 'b', label: 'Backend', children: [{ key: 'b-1', label: 'Node' }] },
  { key: 'c', label: 'DevOps', disabled: true },
]
</script>
```

`data` is a `LhTreeNode[]`: `key` is unique, `label` the display text, `children` sub-nodes,
`disabled` disables a node, and `isLeaf` marks a leaf (inferred from `children` when omitted).
Level indentation is carried by inline style `level * 18 + 8` px. Clicking a whole row selects
the node (`update:selectedKeys` / `select`); with `expandOnClickNode` on (default), clicking a
non-leaf node also expands / collapses it; clicking the arrow only toggles expansion.

## Checkable (cascade)

`show-checkbox` renders check boxes. Checking a parent cascades to all descendants; when all
children are checked the parent is checked automatically, and a partial selection shows an
indeterminate state.

```vue
<template>
  <lh-tree :data="treeData" show-checkbox :default-expanded-keys="['a', 'b']" />
</template>
```

The checked set is carried by `default-checked-keys` (uncontrolled) or `v-model:checked-keys`
(controlled), and reported through `update:checkedKeys` / `check`. With `checkStrictly`,
checking affects only the node itself: no descendant cascade, no ancestor backtracking and no
indeterminate state.

## Lazy loading

With `lazy` on, expanding an unloaded node invokes the `load` callback (`resolve` submits the
children and expands, `reject` or a thrown error cancels); the arrow shows a spinning state
while loading.

```vue
<template>
  <lh-tree :data="lazyData" lazy :load="loadNodes" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhTreeNode } from '@lh-ui/share/core/tree'

const lazyData = ref<LhTreeNode[]>([{ key: 'lazy', label: 'Tap to load', isLeaf: false }])

function loadNodes(
  node: LhTreeNode,
  resolve: (children: LhTreeNode[]) => void,
  reject: (reason?: unknown) => void,
) {
  // simulate an async request
  setTimeout(() => {
    if (node.key === 'lazy') {
      resolve([
        { key: 'lazy-1', label: 'Child one', isLeaf: true },
        { key: 'lazy-2', label: 'Child two', isLeaf: true },
      ])
    } else {
      reject(new Error('nothing to load'))
    }
  }, 600)
}
</script>
```

A loadable node must declare `isLeaf: false` explicitly (otherwise a node without `children`
is inferred as a leaf and gets no expand arrow); if the loaded children are themselves pending
branches, declare `isLeaf: false` on them too, and `isLeaf: true` for real leaves.
Loaded results are merged onto `props.data` immutably by share's `mergeLoadedChildren` — the
caller's data is never mutated — and a `nodeLoad` event accompanies each delivery.

## Selection and controlled keys

`multiple` enables multi-selection (clicking a node toggles selection instead of replacing);
`default-selected-keys` / `v-model:selected-keys` control selection;
`default-expanded-keys` / `v-model:expanded-keys` control expansion; `disabled` disables the
whole tree (both clicks and keys are suppressed).

```vue
<template>
  <lh-tree
    v-model:selected-keys="selKeys"
    v-model:checked-keys="chkKeys"
    :data="ctrlData"
    multiple
    :default-expanded-keys="['x']"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhTreeNode } from '@lh-ui/share/core/tree'

const selKeys = ref(['x'])
const chkKeys = ref(['x-1'])
const ctrlData: LhTreeNode[] = [
  {
    key: 'x',
    label: 'Design',
    children: [{ key: 'x-1', label: 'Color' }, { key: 'x-2', label: 'Type' }],
  },
  { key: 'y', label: 'Engineering' },
]
</script>
```

## Large-data virtualization (uni-app only)

For hundreds or thousands of nodes, enable `virtual`: the node list is carried by a
`scroll-view` and windowed by the fixed row height of 34px (the `--lh-tree-node-height`
default), rendering only the visible window plus a buffer; `virtualHeight` sets the
scroll-view height (numbers are px, strings are used verbatim, default 300px).

```vue
<template>
  <lh-tree :data="bigData" virtual :virtual-height="320" />
</template>
```

Node content must stay on a single line (the share scss `.lh-tree-node__label` already enforces
`nowrap` + ellipsis). Without `virtual`, nodes render directly under the root container, the
same structure as the Vue3 version.

## Slots

The `node` scoped slot receives `{ node, level, expanded, selected }` to customize node
content; the `empty` slot customizes the empty state (defaults to the locale key `tree.empty`,
English "No data").

```vue
<template>
  <lh-tree :data="treeData">
    <template #node="{ node, level }">
      <text>{{ level > 0 ? '· ' : '' }}{{ node.label }}</text>
    </template>
  </lh-tree>
</template>
```

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| data | Tree data | `LhTreeNode[]` | — |
| showCheckbox | Show check boxes | `boolean` | `false` |
| multiple | Multi-select (clicking a node toggles selection instead of replacing) | `boolean` | `false` |
| expandOnClickNode | Expand / collapse non-leaf nodes on row click | `boolean` | `true` |
| defaultExpandedKeys | Keys expanded by default (uncontrolled) | `string[]` | `[]` |
| expandedKeys | Controlled expanded keys | `string[]` | — |
| defaultSelectedKeys | Keys selected by default (uncontrolled) | `string[]` | `[]` |
| selectedKeys | Controlled selected keys | `string[]` | — |
| defaultCheckedKeys | Keys checked by default (uncontrolled) | `string[]` | `[]` |
| checkedKeys | Controlled checked keys | `string[]` | — |
| checkStrictly | Parent and child do not influence each other (no cascade, no indeterminate) | `boolean` | `false` |
| lazy | Lazy mode (invoke load when an unloaded node is expanded) | `boolean` | `false` |
| load | Lazy callback (resolve submits children and expands, reject cancels) | `(node: LhTreeNode, resolve: (children: LhTreeNode[]) => void, reject: (reason?: unknown) => void) => void` | — |
| disabled | Disable the whole tree | `boolean` | `false` |
| virtual | Large-data virtualization (uni-app only) | `boolean` | `false` |
| virtualHeight | Virtual scroll-view height (number in px / string verbatim) | `number \| string` | `300` |
| sx | sx quick layout props | `LhSxProps` | — |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:expandedKeys | Expanded key list changed (for v-model:expanded-keys) | `(keys: string[])` |
| update:selectedKeys | Selected key list changed (for v-model:selected-keys) | `(keys: string[])` |
| update:checkedKeys | Checked key list changed (for v-model:checked-keys) | `(keys: string[])` |
| select | Fired when a node is clicked to select / toggle | `(key: string, node: LhTreeNode)` |
| check | Fired after the checked set changes | `(keys: string[], node: LhTreeNode)` |
| expand | Fired after a node expands / collapses | `(key: string, expanded: boolean)` |
| nodeLoad | Fired after lazy-loaded children arrive | `(node: LhTreeNode, children: LhTreeNode[])` |

### Slots

| Slot | Description |
| --- | --- |
| node | Node content (scoped `{ node, level, expanded, selected }`) |
| empty | Empty state (defaults to the locale key `tree.empty`) |

### LhTreeNode

| Field | Description | Type |
| --- | --- | --- |
| key | Unique key | `string` |
| label | Display text | `string` |
| children | Sub-nodes | `LhTreeNode[]` |
| disabled | Disabled | `boolean` |
| isLeaf | Whether a leaf (inferred from children when omitted) | `boolean` |

### Accessibility

- `role="tree"` + `role="treeitem"`, with `aria-level` / `aria-expanded` / `aria-selected` / `aria-disabled` fully exposed
- Check boxes carry `role="checkbox"` + `aria-checked` (`mixed` for indeterminate)

::: tip Platform differences (differences from the Vue3 version)
- **Virtualization is unique to this package**: for large data (hundreds or thousands of nodes) enable `virtual`; the node list is carried by a `scroll-view` and windowed by the fixed row height of 34px (visible window plus buffer), with `virtualHeight` controlling the viewport. Node content must stay single-line; without `virtual`, nodes render directly under the root container.
- **Keyboard navigation is H5-only**: the APG tree pattern keys — ↑/↓ between items (skipping disabled, looping), → to expand or move to the first child, ← to collapse or move to the parent, Home/End to the ends, Enter/Space to activate — only work on H5; the Mini Program has no keyboard events and the whole block is stripped by conditional compilation (no dead code in the MP bundle), and roving tabindex is likewise only produced on H5.
- **RTL indentation**: level indentation uses the physical `padding-left` inline style on both targets (consistent with this repo's existing "fixed LTR on MP" decision); override on the consumer side if an H5 RTL mirror is needed.
- **Arrow is self-drawn**: the expand arrow is the glyph `▸` carried by a `view` (rotation and the spinning loading state are pure CSS transforms); no icon font is involved.
:::
