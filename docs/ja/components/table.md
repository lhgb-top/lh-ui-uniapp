# Table テーブル

データテーブル：多段ヘッダー、ソート、フィルタ、仮想スクロール、カスタムセル。
ヘッダー構築（`buildHeaderCells`）、ソート（`sortTableRows`）、フィルタ
（`filterTableRows`）、仮想区間（`computeVisibleRange`）とクラス名 / sticky
オフセットの計算はすべて `@lh-ui/share` の core 純関数由来です。

## プラットフォームの違い（重要）

- **横スクロール**：H5 ではヘッダーとボディが 2 つの独立したスクロール
  コンテナで、`scrollLeft` を双方向同期します。微信端では外層の
  `scroll-view`（scroll-x）でテーブル全体を横スクロールし、ヘッダーと
  ボディは同じスクロール軸を共有するため同期機構は不要です。
- **固定列（H5 のみ）**：固定列はテーブルセルの `position: sticky` 支持に
  依存しますが、WXSS では信頼性が低いため、MP 側の固定列スタイルは
  ビルド時に除去されます（`build-styles` の `#ifdef H5` ラップ）。
  MP では通常の横スクロール列に退化します。
- **列幅ドラッグ（H5 のみ）**：`mousedown` / キーボードのセマンティクスは
  MP に存在しないため、ドラッグハンドルは H5 でのみ描画されます。
- **縞模様**：share の `:nth-child(even)` 規則は H5 専用（WXSS は nth
  疑似クラスをサポートしない）で、MP 側ではテンプレートが行インデックスに
  基づいて `--alt` クラスを付与します。
- **仮想スクロール**：H5 は `clientHeight` + `ResizeObserver`、MP は
  `scroll-view` の `detail.scrollTop` + `createSelectorQuery` を使用します。

## 基本的な使い方

```vue
<template>
  <lh-table :data="rows" :columns="columns" />
</template>

<script setup lang="ts">
const rows = [
  { id: 1, name: 'ユーザー 1', age: 28, city: '北京' },
  { id: 2, name: 'ユーザー 2', age: 34, city: '上海' },
]
const columns = [
  { prop: 'name', label: '名前', width: 140 },
  { prop: 'age', label: '年齢', width: 120, align: 'right' },
  { prop: 'city', label: '都市', width: 160 },
]
</script>
```

## 縞模様と罫線

```vue
<template>
  <lh-table :data="rows" :columns="columns" stripe border />
</template>
```

## ソートとフィルタ

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
  { prop: 'age', label: '年齢', width: 120, sortable: true },
  {
    prop: 'city',
    label: '都市',
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

ソート列のヘッダーをクリックすると `なし → 昇順 → 降順` の順に切り替えます
（`cycleSortOrder`）。フィルタ列のヘッダーにはフィルタトリガーがあり、
パネルで項目にチェックを入れて確定すると行をフィルタします（フィルタロジックは
share の `filterTableRows` 経由）。フィルタ状態は制御（`filtered-values`）と
非制御（`default-filtered-values`）の両モードをサポートします。

## 固定列と横スクロール（H5 のみ）

```vue
<template>
  <lh-table :data="rows" :columns="columns" />
</template>

<script setup lang="ts">
const columns = [
  { prop: 'name', label: '名前', width: 140, fixed: 'left' },
  { prop: 'age', label: '年齢', width: 120 },
  { prop: 'city', label: '都市', width: 160 },
  { prop: 'status', label: '状態', width: 120, fixed: 'right' },
]
</script>
```

`fixed: 'left' / 'right'` には数値の width が必須です。MP 側については上記の
プラットフォームの違いを参照してください。

## 仮想スクロール（万行）

```vue
<template>
  <lh-table :data="hugeRows" :columns="columns" :height="360" />
</template>
```

`height` を設定すると仮想スクロールが有効になります：ボディが固定高になり、
可視ウィンドウ + オーバースキャン（`LH_TABLE_OVERSCAN = 3`）のみを描画します。
`row-height` は実際の行高と一致させる必要があります（デフォルト 48）。

## カスタムセル

```vue
<template>
  <lh-table :data="rows" :columns="columns">
    <template #status="{ row }">
      <lh-tag :type="row.status === 'active' ? 'success' : 'danger'">
        {{ row.status === 'active' ? '有効' : '無効' }}
      </lh-tag>
    </template>
  </lh-table>
</template>

<script setup lang="ts">
const columns = [
  { prop: 'name', label: '名前', width: 140 },
  { prop: 'status', label: '状態', width: 140, slot: 'status' },
]
</script>
```

列設定の `slot` フィールドが名前付きスコープ付きスロットを宣言します。
スロットパラメータは `{ row, column, index, value }` です。

## 多段ヘッダー

```vue
<script setup lang="ts">
const columns = [
  { prop: 'name', label: '名前', width: 140 },
  {
    label: 'グループ',
    children: [
      { prop: 'age', label: '年齢', width: 120 },
      { prop: 'city', label: '都市', width: 160 },
    ],
  },
]
</script>
```

列設定の `children` が子列を宣言します。ヘッダーは階層ごとに自動的に
行分けされ、グリッドで配置されます（`buildHeaderCells` が colspan /
rowspan を計算）。

## API

### Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| data | 行データ | `LhTableRow[]` | `[]` |
| columns | 列設定 | `LhTableColumn[]` | `[]` |
| height | ボディ高（設定すると仮想スクロールが有効） | `number \| string` | `-` |
| max-height | 非仮想モードでの最大高 | `number \| string` | `-` |
| row-height | 仮想スクロールの行高 | `number` | `48` |
| stripe | 縞模様 | `boolean` | `false` |
| border | セルの罫線 | `boolean` | `false` |
| size | サイズ | `'small' \| 'default' \| 'large'` | `'default'` |
| row-key | 行キーのフィールド名 | `string` | `'id'` |
| default-sort-prop | デフォルトのソート列 | `string` | `-` |
| default-sort-order | デフォルトのソート方向 | `'asc' \| 'desc'` | `-` |
| sorter | カスタムソート関数 | `(a, b) => number` | `-` |
| resizable | 列幅ドラッグを有効化（H5 のみ） | `boolean` | `false` |
| default-filtered-values | デフォルトのフィルタ状態（非制御） | `Record<string, (string \| number)[]>` | `{}` |
| filtered-values | 制御されたフィルタ状態 | `Record<string, (string \| number)[]>` | `-` |
| sx | クイックレイアウトプロパティ | `LhSxProps` | `-` |

### LhTableColumn

| プロパティ | 説明 | 型 |
| --- | --- | --- |
| prop | フィールド名 | `string` |
| label | ヘッダー文案 | `string` |
| width | 列幅（数値は px） | `number \| string` |
| align | 整列 | `'left' \| 'center' \| 'right'` |
| fixed | 固定列（H5 のみ） | `'left' \| 'right'` |
| sortable | ソート可 | `boolean` |
| resizable | ドラッグ可（列単位の有効化と数値 width が必要、H5 のみ） | `boolean` |
| filters | フィルタ項目 | `{ text, value }[]` |
| filter-multiple | フィルタ複数選択（デフォルト true） | `boolean` |
| formatter | セルのフォーマット | `(row, value) => string` |
| slot | カスタムセルの名前付きスロット名 | `string` |
| children | 子列（多段ヘッダー） | `LhTableColumn[]` |

### Events

| イベント | 説明 | コールバックパラメータ |
| --- | --- | --- |
| sort-change | ソートが変化 | `(payload: { prop, order })` |
| row-click | 行をクリック | `(row, index)` |
| filter-change | フィルタが変化 | `(payload: { prop, values })` |
| update:filtered-values | 制御フィルタの更新 | `(values)` |
| column-resize | 列幅の調整（H5 のみ） | `(payload: { prop, width })` |

### スロット

| スロット | 説明 | スコープパラメータ |
| --- | --- | --- |
| [列 slot] | カスタムセル（名前は列設定の slot で指定） | `{ row, column, index, value }` |
| empty | 空データ時の内容（デフォルトは「データがありません」） | `-` |
