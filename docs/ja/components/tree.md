# Tree ツリーコントロール

階層データの表示と操作。展開 / 折りたたみ、チェックボックスの連動、遅延読み込みのマージなどの
純粋ロジックはすべて `@lh-ui/share` の core 純関数（`flattenTree` / `toggleCheckKeys` /
`mergeLoadedChildren` など）をそのまま利用し、コンポーネント層は描画・イベント・
キーボード操作のみを担います。

## 基本的な使い方

```vue
<template>
  <lh-tree :data="treeData" :default-expanded-keys="['a']" />
</template>

<script setup lang="ts">
import type { LhTreeNode } from '@lh-ui/share/core/tree'

const treeData: LhTreeNode[] = [
  {
    key: 'a',
    label: 'フロントエンド',
    children: [
      { key: 'a-1', label: 'Vue' },
      { key: 'a-2', label: 'React' },
    ],
  },
  { key: 'b', label: 'バックエンド', children: [{ key: 'b-1', label: 'Node' }] },
  { key: 'c', label: '運用', disabled: true },
]
</script>
```

`data` は `LhTreeNode[]` です：`key` は一意、`label` は表示テキスト、`children` は子ノード、
`disabled` は無効化、`isLeaf` は葉かどうか（省略時は `children` から推論）。
階層のインデントはインラインスタイル `level * 18 + 8` px で表現します。
行全体のクリックでノードを選択し（`update:selectedKeys` / `select`）、
`expandOnClickNode` のデフォルト（オン）では非葉ノードのクリックで展開 / 折りたたみも行います；
矢印のクリックは展開のみを切り替えます。

## チェックボックス（連動）

`show-checkbox` でチェックボックスを表示します。親をチェックするとすべての子孫に連動します；
子がすべてチェックされると親も自動的にチェックされ、一部選択は中間状態（indeterminate）になります。

```vue
<template>
  <lh-tree :data="treeData" show-checkbox :default-expanded-keys="['a', 'b']" />
</template>
```

チェック状態は `default-checked-keys`（非制御）または `v-model:checked-keys`（制御）で保持し、
変化は `update:checkedKeys` / `check` イベントで送出されます。`checkStrictly` をオンにすると
チェックはノード自身にのみ作用します：子孫への連動・祖先への遡及・中間状態はありません。

## 遅延読み込み

`lazy` をオンにすると、未読み込みノードの展開時に `load` コールバックを呼び出します
（`resolve` が子ノードを確定して展開、`reject` または例外でキャンセル）；読み込み中は矢印が回転します。

```vue
<template>
  <lh-tree :data="lazyData" lazy :load="loadNodes" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhTreeNode } from '@lh-ui/share/core/tree'

const lazyData = ref<LhTreeNode[]>([{ key: 'lazy', label: 'タップして読み込み', isLeaf: false }])

function loadNodes(
  node: LhTreeNode,
  resolve: (children: LhTreeNode[]) => void,
  reject: (reason?: unknown) => void,
) {
  // 非同期リクエストをシミュレート
  setTimeout(() => {
    if (node.key === 'lazy') {
      resolve([
        { key: 'lazy-1', label: '子ノード一', isLeaf: true },
        { key: 'lazy-2', label: '子ノード二', isLeaf: true },
      ])
    } else {
      reject(new Error('nothing to load'))
    }
  }, 600)
}
</script>
```

読み込み可能ノードは明示的に `isLeaf: false` を宣言する必要があります
（さもないと `children` のないノードは葉と推論され、展開矢印が表示されません）；
読み込まれた子ノードがさらに読み込み待ちの枝であれば同様に `isLeaf: false`、
本物の葉には `isLeaf: true` を宣言します。読み込み結果は share の
`mergeLoadedChildren` によって `props.data` に不変マージされ、
利用者のデータは変更されません；子ノード到着時に `nodeLoad` イベントを伴います。

## 選択と制御キー

`multiple` は複数選択を許可します（置き換えではなく選択をトグル）；
`default-selected-keys` / `v-model:selected-keys` で選択を制御；
`default-expanded-keys` / `v-model:expanded-keys` で展開を制御；
`disabled` はツリー全体を無効化します（クリックもキー操作も無応答）。

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
    label: 'デザイン',
    children: [{ key: 'x-1', label: '色彩' }, { key: 'x-2', label: '書体' }],
  },
  { key: 'y', label: 'エンジニアリング' },
]
</script>
```

## 大規模データの仮想化（uni-app 独自）

数百・数千ノードの場合は `virtual` を有効化します：ノードリストを `scroll-view` で担い、
固定行高 34px（`--lh-tree-node-height` のデフォルト）でウィンドウレンダリングし、
可視領域 + 上下バッファ行のみを描画します；`virtualHeight` は scroll-view の高さ
（数値は px、文字列はそのまま、デフォルト 300px）を指定します。

```vue
<template>
  <lh-tree :data="bigData" virtual :virtual-height="320" />
</template>
```

ノード内容は単行で折り返さない必要があります（share scss の `.lh-tree-node__label` が
`nowrap` + 省略符号を強制済み）。`virtual` を渡さない通常モードではノードは
ルートコンテナに直接描画され、Vue3 版と同じ構造です。

## スロット

`node` スコープ付きスロットは `{ node, level, expanded, selected }` を受け取りノード内容を
カスタマイズします；`empty` スロットは空状態をカスタマイズします
（デフォルトは言語パック `tree.empty`、日本語「データがありません」）。

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

| 属性 | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| data | ツリーデータ | `LhTreeNode[]` | — |
| showCheckbox | チェックボックスを表示 | `boolean` | `false` |
| multiple | 複数選択（置き換えではなく選択をトグル） | `boolean` | `false` |
| expandOnClickNode | 非葉ノードの行クリックで展開 / 折りたたみ | `boolean` | `true` |
| defaultExpandedKeys | デフォルトで展開されるキー（非制御） | `string[]` | `[]` |
| expandedKeys | 制御される展開キー | `string[]` | — |
| defaultSelectedKeys | デフォルトで選択されるキー（非制御） | `string[]` | `[]` |
| selectedKeys | 制御される選択キー | `string[]` | — |
| defaultCheckedKeys | デフォルトでチェックされるキー（非制御） | `string[]` | `[]` |
| checkedKeys | 制御されるチェックキー | `string[]` | — |
| checkStrictly | 親子のチェックを連動させない（自身のみ、連動・中間状態なし） | `boolean` | `false` |
| lazy | 遅延モード（未読み込みノードの展開時に load を呼ぶ） | `boolean` | `false` |
| load | 遅延コールバック（resolve が子を確定して展開、reject はキャンセル） | `(node: LhTreeNode, resolve: (children: LhTreeNode[]) => void, reject: (reason?: unknown) => void) => void` | — |
| disabled | ツリー全体を無効化 | `boolean` | `false` |
| virtual | 大規模データの仮想化（uni-app 独自） | `boolean` | `false` |
| virtualHeight | 仮想 scroll-view の高さ（数値は px / 文字列はそのまま） | `number \| string` | `300` |
| sx | sx クイックレイアウト | `LhSxProps` | — |

### Events

| イベント | 説明 | パラメータ |
| --- | --- | --- |
| update:expandedKeys | 展開キー変更（v-model:expanded-keys 用） | `(keys: string[])` |
| update:selectedKeys | 選択キー変更（v-model:selected-keys 用） | `(keys: string[])` |
| update:checkedKeys | チェックキー変更（v-model:checked-keys 用） | `(keys: string[])` |
| select | ノードがクリックで選択 / トグルされた | `(key: string, node: LhTreeNode)` |
| check | チェック状態が変化した | `(keys: string[], node: LhTreeNode)` |
| expand | ノードが展開 / 折りたたまれた | `(key: string, expanded: boolean)` |
| nodeLoad | 遅延読み込みの子ノードが到着した | `(node: LhTreeNode, children: LhTreeNode[])` |

### Slots

| スロット | 説明 |
| --- | --- |
| node | ノード内容（スコープ `{ node, level, expanded, selected }`） |
| empty | 空状態（デフォルトは言語パック `tree.empty`） |

### LhTreeNode

| フィールド | 説明 | 型 |
| --- | --- | --- |
| key | 一意キー | `string` |
| label | 表示テキスト | `string` |
| children | 子ノード | `LhTreeNode[]` |
| disabled | 無効化 | `boolean` |
| isLeaf | 葉かどうか（省略時は children から推論） | `boolean` |

### アクセシビリティ

- `role="tree"` + `role="treeitem"`、`aria-level` / `aria-expanded` / `aria-selected` / `aria-disabled` をすべて公開
- チェックボックスは `role="checkbox"` + `aria-checked`（中間状態は `mixed`）

::: tip プラットフォーム差異（Vue3 版との差異）
- **仮想化は本パッケージ独自の機能**：大規模データ（数百・数千ノード）では `virtual` を推奨。
  ノードリストは `scroll-view` で担い、固定行高 34px でウィンドウレンダリング（可視領域 + バッファ）、
  `virtualHeight` でビューポート高さを指定。ノード内容は単行必須；通常モードではノードは
  ルートコンテナに直接描画されます。
- **キーボード操作は H5 的み**：↑/↓ で項目間移動（無効をスキップ・ループ）、→ で展開または先頭子へ、
  ← で折りたたみまたは親へ、Home/End で先頭 / 末尾、Enter/Space で起動する APG tree パターンの
  キー操作は H5 のみ有効；小プログラムにキーボードイベントはなく、条件コンパイルで丸ごと削除され
  （MP パッケージにデッドコードなし）、roving tabindex も H5 のみ出力されます。
- **RTL のインデント**：階層インデントは両端で物理 `padding-left` を使用
  （本リポジトリの「MP は固定 LTR」という既存決定と一致）；H5 で RTL ミラーが必要な場合は
  利用者側で上書きしてください。
- **矢印は自己描画**：展開矢印はグリフ `▸` を `view` に載せたもの（回転 / 読み込み中の回転も
  CSS 変換のみ）で、アイコンフォントには依存しません。
:::
