# Cascader 级联选择器

级联选择器用于多层级数据的场景，例如：省市地区选择。触发器点击后弹出多列面板，逐级展开子级，选中叶节点（或 `check-strictly` 下任意层级）完成选择。

## 基础用法

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

点击含子级的项先展开下一列，再点击叶节点选中（单选选中后自动关闭面板）。

## 多选模式

```vue
<template>
  <lh-cascader v-model="value" :options="options" multiple />
  <!-- 折叠标签：只显示首个已选项 + 计数 -->
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

多选模式下 `v-model` 绑定各选中路径的**末级值**数组，已选项以标签形式展示在触发器内。

## 选项禁用

节点数据中的 `disabled: true` 禁用该节点（点击不展开也不选中）；`disabled` prop 禁用整个选择器；`readonly` 只读不弹层。

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

## 路径显示与返回值

```vue
<template>
  <!-- 完整路径（默认） -->
  <lh-cascader v-model="value" :options="options" placeholder="完整路径（默认）" />
  <!-- 只显示末级 -->
  <lh-cascader v-model="value" :options="options" :show-all-levels="false" placeholder="只显示末级" />
  <!-- 自定义分隔符 -->
  <lh-cascader v-model="value" :options="options" separator=" > " placeholder="分隔符 >" />
  <!-- v-model 只绑定末级值（回显仍是完整路径） -->
  <lh-cascader v-model="leafValue" :options="options" :emit-path="false" placeholder="仅返回末级值" />
  <!-- 任意层级可选（点击非叶节点直接选中） -->
  <lh-cascader v-model="anyValue" :options="options" check-strictly placeholder="任意层级可选" />
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

> 占位符默认取语言包 `cascader.placeholder`（中文「请选择」），可用 `placeholder` 覆盖。

## 可过滤

`filterable` 开启搜索：过滤输入框位于弹层内（小程序无触发器内输入聚焦语义），输入关键字后搜索结果按完整路径展示，点击结果直接选中。

```vue
<template>
  <lh-cascader v-model="value" :options="options" filterable placeholder="输入关键字搜索" />
</template>
```

无匹配结果时展示语言包 `cascader.noMatch`（中文「无匹配数据」），可用 `no-match` 插槽自定义。

## 字段别名

`item-config` 声明节点字段别名（`value` / `label` / `children` / `disabled` / `leaf`），异步数据或后端结构无需手工转换：

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 绑定值（`emitPath` 为 `false` 时仅末级值） | `(string \| number)[]` | `() => []` |
| options | 选项列表（树形结构） | `LhCascaderNode[]` | `() => []` |
| size | 尺寸 | `LhCascaderSize` | `'medium'` |
| disabled | 是否禁用整个选择器 | `boolean` | `false` |
| clearable | 是否可清除 | `boolean` | `true` |
| placeholder | 占位符（未传时取语言包 `cascader.placeholder`） | `string` | — |
| readonly | 是否只读（不弹层） | `boolean` | `false` |
| showAllLevels | 触发器是否显示完整路径 | `boolean` | `true` |
| checkStrictly | 任意层级节点可选 | `boolean` | `false` |
| emitPath | 返回值是否包含完整路径 | `boolean` | `true` |
| multiple | 是否多选 | `boolean` | `false` |
| cascading | 是否级联关联（悬停展开子级，仅 H5 有效） | `boolean` | `true` |
| separator | 路径分隔符 | `string` | `'/'` |
| collapseTags | 多选模式下是否折叠标签 | `boolean` | `false` |
| filterable | 是否可搜索 | `boolean` | `false` |
| itemConfig | 节点字段别名 | `LhCascaderItemConfig` | `() => ({})` |
| customClass | 自定义类名（透传到根节点） | `string` | — |
| themeVars | 组件级主题变量 | `Record<string, string>` | — |
| sx | sx 快速布局属性（作用于触发器根元素，浮层面板不受影响） | `LhSxProps` | — |

### Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 绑定值变化时触发 | `(value: (string \| number)[])` |
| change | 选中值变化时触发 | `(value: (string \| number)[], path: LhCascaderNode[] \| null)` |

### Slots

| 插槽 | 说明 |
| --- | --- |
| no-match | 过滤无匹配结果时的自定义内容 |

### 数据结构

`LhCascaderNode` 类型定义：

```ts
interface LhCascaderNode {
  value: string | number
  label: string
  disabled?: boolean
  leaf?: boolean
  children?: LhCascaderNode[]
}
```

### 无障碍

- 触发器带 `aria-haspopup="listbox"` / `aria-expanded` / `aria-controls`（属性包由 share 的 `getCascaderTriggerAria` 产出，逐键摊开绑定）
- 弹层面板为 `role="dialog"`，每列为 `role="listbox"`（`aria-label` 走语言包 `cascader.columnLabel`「第 N 级」），列项为 `role="option"` 并带 `aria-selected` / `aria-disabled` / `aria-expanded`
- 定位引擎为自研纯函数（flip / shift 防溢出），零第三方运行时依赖

::: tip 平台差异（与 Vue3 版的差异）
- **浮层面板化**：plus 的面板挂在 `Teleport to="body"` 下、`Transition` 淡入淡出；uni-app 端由 `lh-root-portal` 承载（低版本页内 fixed 兜底），定位走两帧异步度量（先隐藏渲染量尺寸 → `computePosition` 定位 → 显示，防闪烁）。定位计算是异步的，不能假设同步拿到结果。进出过渡未绑定（MP 的 `Transition` 不可靠，与 tooltip / dropdown / popover 一致）。
- **列滚动**：每列是一个 `scroll-view`（`scroll-y`）独立纵向滚动——MP 的 `view` 没有可靠的溢出滚动，share scss 里 `overflow-y: auto` 的列容器在 H5 端由 `scroll-view` 的 H5 实现等价兜底。
- **键盘导航仅 H5**：触发器 Enter/Space 开合、方向键把焦点送进面板；面板内 ↑↓ 列内移动（跳过禁用项）、←→ 跨列、Enter/Space 等价点击；Escape 经文档级监听关闭（多弹层叠加时只关栈顶）。整段处理函数体由条件编译裁剪，MP 包内无死代码。
- **悬停展开仅 H5**：`cascading` 的悬停展开子级依赖 hover 语义，小程序端无 hover，子级只能点击展开（`cascading` 在 MP 端等效于关闭悬停展开）。
- **过滤输入框位置**：plus 的 `filterable` 输入框就是触发器本身；uni-app 端把过滤输入框放进弹层内（与 select 同款），MP 端无触发器内 input 聚焦语义。
- **点击外部关闭**：plus 用 `useLhClickOutside` 监听 document 点击；uni-app 端由页内透明遮罩承载（点击遮罩即关闭）。
- **触发器滚出视口不自动收起**：uni-app 无统一的滚动 / 尺寸变化监听通道，未移植。
- **焦点圈 / roving tabindex 仅 H5**：MP 无键盘焦点语义，`tabindex` 绑定在 MP 端不落值。
:::
