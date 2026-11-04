# Tree 树形控件

树形数据的展示与交互。展开 / 收起、复选框级联、懒加载合并等纯逻辑全部消费
`@lh-ui/share` 的 core 纯函数（`flattenTree` / `toggleCheckKeys` / `mergeLoadedChildren` 等），
组件层只负责渲染、事件与键盘导航。

## 基础用法

```vue
<template>
  <lh-tree :data="treeData" :default-expanded-keys="['a']" />
</template>

<script setup lang="ts">
import type { LhTreeNode } from '@lh-ui/share/core/tree'

const treeData: LhTreeNode[] = [
  {
    key: 'a',
    label: '前端',
    children: [
      { key: 'a-1', label: 'Vue' },
      { key: 'a-2', label: 'React' },
    ],
  },
  { key: 'b', label: '后端', children: [{ key: 'b-1', label: 'Node' }] },
  { key: 'c', label: '运维', disabled: true },
]
</script>
```

`data` 是 `LhTreeNode[]`：`key` 唯一、`label` 显示文本、`children` 子节点、
`disabled` 禁用、`isLeaf` 是否叶子（不传按 `children` 推断）。节点层级缩进由行内样式
`level * 18 + 8` px 承载。点击整行会选中节点（`update:selectedKeys` / `select`），
`expandOnClickNode` 默认开启时点击非叶子节点同时展开 / 收起；点击箭头只切换展开。

## 可勾选（级联）

`show-checkbox` 显示勾选框。勾选父级会级联全部后代；子级全选时父级自动选中，
部分选中显示半选态（indeterminate）。

```vue
<template>
  <lh-tree :data="treeData" show-checkbox :default-expanded-keys="['a', 'b']" />
</template>
```

勾选态可用 `default-checked-keys`（非受控）或 `v-model:checked-keys`（受控）承载，
变化由 `update:checkedKeys` / `check` 事件抛出。`checkStrictly` 开启后勾选只作用于
节点自身：不级联后代、不回溯祖先、无半选态。

## 懒加载

开启 `lazy` 后，展开未加载的节点会调用 `load` 回调（`resolve` 提交子节点并展开，
`reject` 或抛错取消）；加载中箭头显示旋转态。

```vue
<template>
  <lh-tree :data="lazyData" lazy :load="loadNodes" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhTreeNode } from '@lh-ui/share/core/tree'

const lazyData = ref<LhTreeNode[]>([{ key: 'lazy', label: '点我加载', isLeaf: false }])

function loadNodes(
  node: LhTreeNode,
  resolve: (children: LhTreeNode[]) => void,
  reject: (reason?: unknown) => void,
) {
  // 模拟异步请求
  setTimeout(() => {
    if (node.key === 'lazy') {
      resolve([
        { key: 'lazy-1', label: '子节点一', isLeaf: true },
        { key: 'lazy-2', label: '子节点二', isLeaf: true },
      ])
    } else {
      reject(new Error('nothing to load'))
    }
  }, 600)
}
</script>
```

可加载节点须显式声明 `isLeaf: false`（否则无 children 的节点会被推断为叶子、不显示展开箭头）；
加载下来的子节点如仍是待加载分支，同样声明 `isLeaf: false`，真叶子声明 `isLeaf: true`。
加载结果由 share 的 `mergeLoadedChildren` 不可变合并到 `props.data` 上，
不修改使用方持有的数据；子节点返回时附带 `nodeLoad` 事件。

## 选中与受控键值

`multiple` 允许多选（点击节点切换选中而非替换）；`default-selected-keys` /
`v-model:selected-keys` 受控选中；`default-expanded-keys` /
`v-model:expanded-keys` 受控展开；`disabled` 禁用整棵树（按键与点击均不响应）。

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
    label: '设计',
    children: [{ key: 'x-1', label: '色彩' }, { key: 'x-2', label: '字体' }],
  },
  { key: 'y', label: '工程' },
]
</script>
```

## 大数据量虚拟化（uni-app 独有）

成百上千节点时开启 `virtual`：节点列表改由 `scroll-view` 承载并按固定行高 34px
（对齐 `--lh-tree-node-height` 默认值）开窗渲染，只绘制可见区 + 上下缓冲行；
`virtualHeight` 指定 scroll-view 高度（数字按 px，字符串原样写入，默认 300px）。

```vue
<template>
  <lh-tree :data="bigData" virtual :virtual-height="320" />
</template>
```

要求节点内容单行不换行（share scss 的 `.lh-tree-node__label` 已带 `nowrap` + 省略号）。
普通模式（`virtual` 不传）下节点直接渲染在根容器，与 Vue3 版结构一致。

## 插槽

`node` 作用域插槽接收 `{ node, level, expanded, selected }` 自定义节点内容；
`empty` 插槽自定义空态（默认取语言包 `tree.empty`，中文「暂无数据」）。

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 树数据 | `LhTreeNode[]` | — |
| showCheckbox | 显示勾选框 | `boolean` | `false` |
| multiple | 多选（点击节点切换选中而非替换） | `boolean` | `false` |
| expandOnClickNode | 点击非叶子节点时展开/收起 | `boolean` | `true` |
| defaultExpandedKeys | 默认展开的键（非受控） | `string[]` | `[]` |
| expandedKeys | 受控展开的键 | `string[]` | — |
| defaultSelectedKeys | 默认选中的键（非受控） | `string[]` | `[]` |
| selectedKeys | 受控选中的键 | `string[]` | — |
| defaultCheckedKeys | 默认勾选的键（非受控） | `string[]` | `[]` |
| checkedKeys | 受控勾选的键 | `string[]` | — |
| checkStrictly | 父子勾选不联动（只作用于自身，无级联与半选） | `boolean` | `false` |
| lazy | 懒加载模式（展开未加载节点时调用 load） | `boolean` | `false` |
| load | 懒加载回调（resolve 提交子节点并展开，reject 取消） | `(node: LhTreeNode, resolve: (children: LhTreeNode[]) => void, reject: (reason?: unknown) => void) => void` | — |
| disabled | 整体禁用 | `boolean` | `false` |
| virtual | 大数据量虚拟化（uni-app 独有） | `boolean` | `false` |
| virtualHeight | 虚拟化 scroll-view 高度（数字按 px / 字符串原样） | `number \| string` | `300` |
| sx | sx 快速布局属性 | `LhSxProps` | — |

### Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| update:expandedKeys | 展开键列表变化（配合 v-model:expanded-keys） | `(keys: string[])` |
| update:selectedKeys | 选中键列表变化（配合 v-model:selected-keys） | `(keys: string[])` |
| update:checkedKeys | 勾选键列表变化（配合 v-model:checked-keys） | `(keys: string[])` |
| select | 节点被点击选中 / 切换选中后触发 | `(key: string, node: LhTreeNode)` |
| check | 勾选变化后触发 | `(keys: string[], node: LhTreeNode)` |
| expand | 节点展开 / 收起后触发 | `(key: string, expanded: boolean)` |
| nodeLoad | 懒加载子节点返回后触发 | `(node: LhTreeNode, children: LhTreeNode[])` |

### Slots

| 插槽 | 说明 |
| --- | --- |
| node | 节点内容（作用域 `{ node, level, expanded, selected }`） |
| empty | 空态内容（默认取语言包 `tree.empty`） |

### LhTreeNode

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| key | 唯一键 | `string` |
| label | 显示文本 | `string` |
| children | 子节点 | `LhTreeNode[]` |
| disabled | 禁用 | `boolean` |
| isLeaf | 是否叶子（不传按 children 推断） | `boolean` |

### 无障碍

- `role="tree"` + `role="treeitem"`，`aria-level` / `aria-expanded` / `aria-selected` / `aria-disabled` 全量暴露
- 勾选框 `role="checkbox"` + `aria-checked`（半选为 `mixed`）

::: tip 平台差异（与 Vue3 版的差异）
- **虚拟化为本仓独有能力**：大数据量（成百上千节点）时建议开启 `virtual`，
  节点列表由 `scroll-view` 承载并按固定行高 34px 开窗渲染（可见区 + 上下缓冲），
  `virtualHeight` 控制可视高度。要求节点内容单行不换行；普通模式下节点直接渲染在根容器。
- **键盘导航仅 H5**：↑/↓ 项间移动（跳过禁用、循环）、→ 展开或进首子、← 收起或回父级、
  Home/End 首末、Enter/Space 激活的 APG tree 模式键盘导航只在 H5 端生效；
  小程序无键盘事件，整段由条件编译裁剪（MP 包内无死代码），roving tabindex 同样只在 H5 落值。
- **RTL 缩进差异**：层级缩进行内样式在两端统一用物理 `padding-left`
  （与仓内「MP 端固定 LTR」的既有决策一致），H5 端如需 RTL 镜像请在使用方覆盖。
- **箭头图标自绘**：展开箭头是字符 `▸` 承载在 `view` 上（旋转 / 旋转 loading 态由 CSS 变换承载），
  不依赖图标字体；懒加载中的旋转占位同理。
:::
