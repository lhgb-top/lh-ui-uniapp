# Table 表格

資料表格：多級表頭、排序、篩選、虛擬捲動、自訂儲存格。表頭建構
（`buildHeaderCells`）、排序（`sortTableRows`）、過濾（`filterTableRows`）、
虛擬區間（`computeVisibleRange`）與類名 / sticky 偏移計算全部來自
`@lh-ui/share` 的 core 純函式。

## 平台差異（重要）

- **橫向捲動**：H5 端表頭與表體是兩個獨立的捲動容器，`scrollLeft` 雙向
  同步；微信端外層 `scroll-view`（scroll-x）整表橫向捲動，表頭表體
  共用同一根捲動軸，無需同步機制。
- **固定列（僅 H5）**：固定列依賴 `position: sticky` 的表格儲存格支援，
  WXSS 下不可靠，MP 端固定列樣式在建構期剔除（`build-styles` 的
  `#ifdef H5` 包裹），退化為一般橫向捲動列。
- **列寬拖曳（僅 H5）**：`mousedown` / 鍵盤語意在 MP 不存在，拖曳把手
  只在 H5 渲染。
- **斑馬紋**：share 的 `:nth-child(even)` 規則僅 H5（WXSS 不支援 nth
  偽類），MP 端由範本依行索引補 `--alt` 類實現。
- **虛擬捲動**：H5 用 `clientHeight` + `ResizeObserver`，MP 用
  `scroll-view` 的 `detail.scrollTop` + `createSelectorQuery`。

## 基礎用法

```vue
<template>
  <lh-table :data="rows" :columns="columns" />
</template>

<script setup lang="ts">
const rows = [
  { id: 1, name: '使用者 1', age: 28, city: '北京' },
  { id: 2, name: '使用者 2', age: 34, city: '上海' },
]
const columns = [
  { prop: 'name', label: '姓名', width: 140 },
  { prop: 'age', label: '年齡', width: 120, align: 'right' },
  { prop: 'city', label: '城市', width: 160 },
]
</script>
```

## 斑馬紋與邊框

```vue
<template>
  <lh-table :data="rows" :columns="columns" stripe border />
</template>
```

## 排序與篩選

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
  { prop: 'age', label: '年齡', width: 120, sortable: true },
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

可排序列點擊表頭按 `無 → 升序 → 降序` 循環（`cycleSortOrder`）；
篩選列表頭帶篩選觸發器，面板裡勾選確定後過濾行（過濾邏輯走 share
的 `filterTableRows`）。篩選狀態支援受控（`filtered-values`）與
非受控（`default-filtered-values`）兩種模式。

## 固定列與橫向捲動（僅 H5）

```vue
<template>
  <lh-table :data="rows" :columns="columns" />
</template>

<script setup lang="ts">
const columns = [
  { prop: 'name', label: '姓名', width: 140, fixed: 'left' },
  { prop: 'age', label: '年齡', width: 120 },
  { prop: 'city', label: '城市', width: 160 },
  { prop: 'status', label: '狀態', width: 120, fixed: 'right' },
]
</script>
```

`fixed: 'left' / 'right'` 需搭配數字寬度；MP 端見上方平台差異。

## 虛擬捲動（萬列）

```vue
<template>
  <lh-table :data="hugeRows" :columns="columns" :height="360" />
</template>
```

設定 `height` 後啟用虛擬捲動：表體固定高度、只繪製可視視窗 + 過掃描
（`LH_TABLE_OVERSCAN = 3`），`row-height` 需與實際行高一致（預設 48）。

## 自訂儲存格

```vue
<template>
  <lh-table :data="rows" :columns="columns">
    <template #status="{ row }">
      <lh-tag :type="row.status === 'active' ? 'success' : 'danger'">
        {{ row.status === 'active' ? '啟用' : '停用' }}
      </lh-tag>
    </template>
  </lh-table>
</template>

<script setup lang="ts">
const columns = [
  { prop: 'name', label: '姓名', width: 140 },
  { prop: 'status', label: '狀態', width: 140, slot: 'status' },
]
</script>
```

列配置 `slot` 欄位宣告具名作用域插槽；插槽參數為
`{ row, column, index, value }`。

## 多級表頭

```vue
<script setup lang="ts">
const columns = [
  { prop: 'name', label: '姓名', width: 140 },
  {
    label: '分組',
    children: [
      { prop: 'age', label: '年齡', width: 120 },
      { prop: 'city', label: '城市', width: 160 },
    ],
  },
]
</script>
```

列配置 `children` 宣告子級列，表頭依層級自動分行並用網格定位
（`buildHeaderCells` 計算 colspan / rowspan）。

## API

### Props

| 屬性 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| data | 列資料 | `LhTableRow[]` | `[]` |
| columns | 列配置 | `LhTableColumn[]` | `[]` |
| height | 表體高度（設定後啟用虛擬捲動） | `number \| string` | `-` |
| max-height | 非虛擬模式下的最大高度 | `number \| string` | `-` |
| row-height | 虛擬捲動行高 | `number` | `48` |
| stripe | 斑馬紋 | `boolean` | `false` |
| border | 儲存格邊框 | `boolean` | `false` |
| size | 尺寸 | `'small' \| 'default' \| 'large'` | `'default'` |
| row-key | 行鍵欄位名 | `string` | `'id'` |
| default-sort-prop | 預設排序列 | `string` | `-` |
| default-sort-order | 預設排序方向 | `'asc' \| 'desc'` | `-` |
| sorter | 自訂排序函式 | `(a, b) => number` | `-` |
| resizable | 開啟列寬拖曳（僅 H5） | `boolean` | `false` |
| default-filtered-values | 預設篩選狀態（非受控） | `Record<string, (string \| number)[]>` | `{}` |
| filtered-values | 受控篩選狀態 | `Record<string, (string \| number)[]>` | `-` |
| sx | 快速佈局屬性 | `LhSxProps` | `-` |

### LhTableColumn

| 屬性 | 說明 | 型別 |
| --- | --- | --- |
| prop | 欄位名 | `string` |
| label | 表頭文案 | `string` |
| width | 列寬（數字為 px） | `number \| string` |
| align | 對齊 | `'left' \| 'center' \| 'right'` |
| fixed | 固定列（僅 H5） | `'left' \| 'right'` |
| sortable | 可排序 | `boolean` |
| resizable | 可拖曳（需列級開啟且數字 width，僅 H5） | `boolean` |
| filters | 篩選項 | `{ text, value }[]` |
| filter-multiple | 篩選多選（預設 true） | `boolean` |
| formatter | 儲存格格式化 | `(row, value) => string` |
| slot | 自訂儲存格的具名插槽名 | `string` |
| children | 子級列（多級表頭） | `LhTableColumn[]` |

### Events

| 事件 | 說明 | 回呼參數 |
| --- | --- | --- |
| sort-change | 排序變化 | `(payload: { prop, order })` |
| row-click | 點擊行 | `(row, index)` |
| filter-change | 篩選變化 | `(payload: { prop, values })` |
| update:filtered-values | 受控篩選更新 | `(values)` |
| column-resize | 列寬調整（僅 H5） | `(payload: { prop, width })` |

### 插槽

| 插槽 | 說明 | 作用域參數 |
| --- | --- | --- |
| [列 slot] | 自訂儲存格（名由列配置 slot 指定） | `{ row, column, index, value }` |
| empty | 空資料內容（預設「暫無資料」） | `-` |
