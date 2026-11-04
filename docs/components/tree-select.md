# TreeSelect 树形选择器

树形选择器用于带层级结构数据的场景，例如组织架构、目录分类。触发器点击后弹出树面板，单选点节点即选中并关闭，多选通过勾选框选择（父子级联）。

## 基础用法

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

点击节点即选中（含非叶节点）并关闭面板；点击节点左侧的展开箭头只展开 / 收起，不改变选中值。触发器回显已选节点的 `label`。

## 多选模式

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

多选模式下 `v-model` 绑定勾选键数组（`string[]`），勾选父子级联：勾选父节点自动带上全部可勾选后代，后代全部勾选时父节点变为全选、部分勾选时为半选。点击节点标签只展开，勾选走勾选框（与 Vue3 版一致）。触发器回显全部勾选键的 `label`，以「、」拼接。

## 节点禁用

节点数据中的 `disabled: true` 禁用该节点（点击不展开也不选中，勾选框不可点）；`disabled` prop 禁用整个选择器。

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 绑定值（单选 `string` / 多选 `string[]`，受控 v-model） | `string \| string[] \| undefined` | — |
| data | 树数据 | `LhTreeNode[]` | `() => []` |
| multiple | 是否多选（显示勾选框，值为勾选键数组，父子级联） | `boolean` | `false` |
| disabled | 是否禁用整个选择器 | `boolean` | `false` |
| placeholder | 占位符（未传时取语言包 `select.placeholder`，中文「请选择」） | `string` | — |
| customClass | 自定义类名（透传到根节点） | `string` | — |
| themeVars | 组件级主题变量 | `Record<string, string>` | — |
| sx | sx 快速布局属性（作用于触发器根元素，浮层面板不受影响） | `LhSxProps` | — |

### Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 绑定值变化时触发 | `(value: string \| string[] \| undefined)` |
| change | 选中值变化时触发 | `(value: string \| string[] \| undefined)` |

### 数据结构

`LhTreeNode` 类型定义（真源在 `@lh-ui/share/core/tree`）：

```ts
interface LhTreeNode {
  /** 唯一键 */
  key: string
  /** 显示文本 */
  label: string
  /** 子节点 */
  children?: LhTreeNode[]
  /** 禁用 */
  disabled?: boolean
  /** 是否叶子（不传按 children 推断） */
  isLeaf?: boolean
}
```

### 无障碍

- 触发器带 `aria-haspopup="tree"` / `aria-expanded` / `aria-label`（取语言包 `treeSelect.triggerLabel`，中文「树选择」）
- 面板为 `role="listbox"`，内嵌树为 `role="tree"`，节点为 `role="treeitem"` 并带 `aria-level` / `aria-expanded` / `aria-selected` / `aria-disabled`；多选时面板带 `aria-multiselectable`，勾选框为 `role="checkbox"` 并带 `aria-checked`（半选输出 `mixed`）
- 层级缩进、展开箭头旋转、勾选框三态外观全部来自 share 样式源（`@lh-ui/share/styles/tree`），无端内重复样式

::: tip 平台差异（与 Vue3 版的差异）
- **胶水组合而非独立 core**：share core 没有 tree-select 模块，本端按 plus 的实现形态做「select 触发器 + lh-tree 面板」的组合——面板内嵌 `lh-tree`，树形展开 / 选中 / 勾选级联全部由 `lh-tree` 消费 `core/tree` 纯函数（`flattenTree` / `toggleCheckKeys` / `getNodeCheckState` 等），本组件不拷贝任何树逻辑。API 与事件按 plus 对齐，未私自新增能力。
- **弹层面板化**：plus 的面板挂在 `Teleport to="body"` 下；uni-app 端由 `lh-root-portal` 承载（低版本页内 fixed 兜底），定位走两帧异步度量（先隐藏渲染量尺寸 → `computePosition` 定位 → 显示，防闪烁），定位计算是异步的，不能假设同步拿到结果。
- **树面板滚动**：share scss 的 `.lh-tree-select__panel` 用 `overflow: auto`，MP 的 `view` 没有可靠的溢出滚动，面板内再包一层 `scroll-view`（`scroll-y`）承载纵向滚动，最大高度与 share 的 320px 对齐。
- **键盘导航不启用**：plus 的触发器 Escape 关闭与文档级键盘监听依赖键盘事件，小程序无键盘事件，本端由点击页内透明遮罩关闭面板（与 select / cascader 同款），未做条件编译降级。
- **`teleported` prop 未移植**：plus 用它控制面板是否挂到 body，uni-app 端弹层一律走 `lh-root-portal`，无此语义。
- **点击外部关闭**：plus 用 `useLhClickOutside` 监听 document 点击；uni-app 端由页内透明遮罩承载（点击遮罩即关闭）。
- **多选勾选态受控修正**：plus 没有把 `checked-keys` 传给内嵌的树，多选预设值不会回显到勾选框；本端把 `v-model` 同时作为 `checked-keys` 传入，勾选框与触发器回显都由 `v-model` 驱动，API 不变。
- **触发器滚出视口不自动收起**：uni-app 无统一的滚动 / 尺寸变化监听通道，未移植。
:::
