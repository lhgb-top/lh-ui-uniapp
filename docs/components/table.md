# Table 表格

数据表格：多级表头、排序、筛选、虚拟滚动、自定义单元格。表头构建
（`buildHeaderCells`）、排序（`sortTableRows`）、过滤（`filterTableRows`）、
虚拟区间（`computeVisibleRange`）与类名 / sticky 偏移计算全部来自
`@lh-ui/share` 的 core 纯函数。

## 平台差异（重要）

- **横向滚动**：H5 端表头与表体是两个独立滚动容器，`scrollLeft` 双向
  同步；微信端外层 `scroll-view`（scroll-x）整表横向滚动，表头表体
  共享同一根滚动轴，无需同步机制。
- **固定列（仅 H5）**：固定列依赖 `position: sticky` 的表格单元格支持，
  WXSS 下不可靠，MP 端固定列样式在构建期剔除（`build-styles` 的
  `#ifdef H5` 包裹），退化为普通横向滚动列。
- **列宽拖拽（仅 H5）**：`mousedown` / 键盘语义在 MP 不存在，拖拽手柄
  只在 H5 渲染。
- **斑马纹**：share 的 `:nth-child(even)` 规则仅 H5（WXSS 不支持 nth
  伪类），MP 端由模板按行索引补 `--alt` 类实现。
- **虚拟滚动**：H5 用 `clientHeight` + `ResizeObserver`，MP 用
  `scroll-view` 的 `detail.scrollTop` + `createSelectorQuery`。

## 基础用法

```vue
<template>
  <lh-table :data="rows" :columns="columns" />
</template>

<script setup lang="ts">
const rows = [
  { id: 1, name: '用户 1', age: 28, city: '北京' },
  { id: 2, name: '用户 2', age: 34, city: '上海' },
]
const columns = [
  { prop: 'name', label: '姓名', width: 140 },
  { prop: 'age', label: '年龄', width: 120, align: 'right' },
  { prop: 'city', label: '城市', width: 160 },
]
</script>
```

## 斑马纹与边框

```vue
<template>
  <lh-table :data="rows" :columns="columns" stripe border />
</template>
```

## 排序与筛选

```vue
<template>
  <lh-table
    :data="rows"
    :columns="columns"
    @sort-change="onSort"
    @filter-change="onFilter"
  />
</template>

<script setup lang="ts">
const columns = [
  { prop: 'age', label: '年龄', width: 120, sortable: true },
  {
    prop: 'city',
    label: '城市',
    width: 160,
    filters: [
      { text: '北京', value: '北京' },
      { text: '上海', value: '上海' },
    ],
  },
]

function onSort(payload: { prop: string; order?: 'asc' | 'desc' }) {}
function onFilter(payload: { prop: string; values: (string | number)[] }) {}
</script>
```

排序列点击表头按 `无 → 升序 → 降序` 循环（`cycleSortOrder`）；
筛选列的表头带筛选触发器，面板里勾选确定后过滤行（过滤逻辑走 share
的 `filterTableRows`）。筛选状态支持受控（`filtered-values`）与
非受控（`default-filtered-values`）两种模式。

## 固定列与横向滚动（仅 H5）

```vue
<template>
  <lh-table :data="rows" :columns="columns" />
</template>

<script setup lang="ts">
const columns = [
  { prop: 'name', label: '姓名', width: 140, fixed: 'left' },
  { prop: 'age', label: '年龄', width: 120 },
  { prop: 'city', label: '城市', width: 160 },
  { prop: 'status', label: '状态', width: 120, fixed: 'right' },
]
</script>
```

`fixed: 'left' / 'right'` 需配合数字宽度；MP 端见上方平台差异。

## 虚拟滚动（万行）

```vue
<template>
  <lh-table :data="hugeRows" :columns="columns" :height="360" />
</template>
```

设置 `height` 后启用虚拟滚动：表体固定高度、只渲染可视窗口 + 过扫描
（`LH_TABLE_OVERSCAN = 3`），`row-height` 需与实际行高一致（默认 48）。

## 自定义单元格

```vue
<template>
  <lh-table :data="rows" :columns="columns">
    <template #status="{ row }">
      <lh-tag :type="row.status === 'active' ? 'success' : 'danger'">
        {{ row.status === 'active' ? '启用' : '停用' }}
      </lh-tag>
    </template>
  </lh-table>
</template>

<script setup lang="ts">
const columns = [
  { prop: 'name', label: '姓名', width: 140 },
  { prop: 'status', label: '状态', width: 140, slot: 'status' },
]
</script>
```

列配置 `slot` 字段声明具名作用域插槽；插槽参数为
`{ row, column, index, value }`。

## 多级表头

```vue
<script setup lang="ts">
const columns = [
  { prop: 'name', label: '姓名', width: 140 },
  {
    label: '分组',
    children: [
      { prop: 'age', label: '年龄', width: 120 },
      { prop: 'city', label: '城市', width: 160 },
    ],
  },
]
</script>
```

列配置 `children` 声明子级列，表头按层级自动分行并用网格定位
（`buildHeaderCells` 计算 colspan / rowspan）。

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 行数据 | `LhTableRow[]` | `[]` |
| columns | 列配置 | `LhTableColumn[]` | `[]` |
| height | 表体高度（设置后启用虚拟滚动） | `number \| string` | `-` |
| max-height | 非虚拟模式下的最大高度 | `number \| string` | `-` |
| row-height | 虚拟滚动行高 | `number` | `48` |
| stripe | 斑马纹 | `boolean` | `false` |
| border | 单元格边框 | `boolean` | `false` |
| size | 尺寸 | `'small' \| 'default' \| 'large'` | `'default'` |
| row-key | 行键字段名 | `string` | `'id'` |
| default-sort-prop | 默认排序列 | `string` | `-` |
| default-sort-order | 默认排序方向 | `'asc' \| 'desc'` | `-` |
| sorter | 自定义排序函数 | `(a, b) => number` | `-` |
| resizable | 开启列宽拖拽（仅 H5） | `boolean` | `false` |
| default-filtered-values | 默认筛选状态（非受控） | `Record<string, (string \| number)[]>` | `{}` |
| filtered-values | 受控筛选状态 | `Record<string, (string \| number)[]>` | `-` |
| sx | 快速布局属性 | `LhSxProps` | `-` |

### LhTableColumn

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| prop | 字段名 | `string` |
| label | 表头文案 | `string` |
| width | 列宽（数字为 px） | `number \| string` |
| align | 对齐 | `'left' \| 'center' \| 'right'` |
| fixed | 固定列（仅 H5） | `'left' \| 'right'` |
| sortable | 可排序 | `boolean` |
| resizable | 可拖拽（需列级开启且数字 width，仅 H5） | `boolean` |
| filters | 筛选项 | `{ text, value }[]` |
| filter-multiple | 筛选多选（默认 true） | `boolean` |
| formatter | 单元格格式化 | `(row, value) => string` |
| slot | 自定义单元格的具名插槽名 | `string` |
| children | 子级列（多级表头） | `LhTableColumn[]` |

### Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| sort-change | 排序变化 | `(payload: { prop, order })` |
| row-click | 点击行 | `(row, index)` |
| filter-change | 筛选变化 | `(payload: { prop, values })` |
| update:filtered-values | 受控筛选更新 | `(values)` |
| column-resize | 列宽调整（仅 H5） | `(payload: { prop, width })` |

### 插槽

| 插槽 | 说明 | 作用域参数 |
| --- | --- | --- |
| [列 slot] | 自定义单元格（名由列配置 slot 指定） | `{ row, column, index, value }` |
| empty | 空数据内容（默认「暂无数据」） | `-` |
