# Transfer トランスファー

2 列のリストとチェックボックスによる移動を組み合わせたコンポーネントです。データの振り分け、
フィルタリング、全選択、移動のロジックはすべて `@lh-ui/share` の core 純関数
（`partitionTransferData` / `filterTransferItems` / `toggleTransferCheckAll` /
`moveTransferKeys` など）を消費し、コンポーネント層は描画・イベント・
キーボード操作のみを担います。両列とも `role="listbox"` です（APG listbox パターン）。

## 基本的な使い方

```vue
<template>
  <lh-transfer v-model="source" :data="items" @change="onChange" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhTransferItem } from '@lh-ui/share/core/transfer'

const source = ref<Array<string | number>>(['a'])
const items: LhTransferItem[] = [
  { key: 'a', label: '甲' },
  { key: 'b', label: '乙' },
  { key: 'c', label: '丙', disabled: true },
  { key: 'd', label: '丁' },
]

function onChange(keys: Array<string | number>, direction: 'left-to-right' | 'right-to-left') {
  console.log(keys, direction)
}
</script>
```

`v-model` は左側（ソース）のキーリストを束縛します。`modelValue` に含まれるキーが左欄に、
それ以外は右欄に表示されます。任意の項目をチェックして中央の › / ‹ ボタンを押すと移動し、
`update:modelValue` と `change`（方向 `'left-to-right'` / `'right-to-left'` 付き）が
続けて発火します。チェック済みセットは移動後にクリアされます。

各パネルの上部には検索ボックスが常駐します（Vue3 版と同じく常時オン）。
ラベルに対して大文字小文字を区別せずフィルタリングします。パネルヘッダーには
「現在側の件数 / 全体件数」のカウントと全選択ボックス（中間状態は `indeterminate`）が
表示されます。

`data` は `LhTransferItem[]` です。`key` は一意、`label` は表示テキスト（欠落時は key に
フォールバック）、`disabled` はその項目を無効化します（チェック不可・全選択の対象外・移動不可）。

## 無効化

`disabled` でトランスファー全体を無効化します。チェック、全選択、検索、移動まで
すべての操作が抑制されます。

```vue
<template>
  <lh-transfer v-model="source" :data="items" disabled />
</template>
```

## API

### Props

| 属性 | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| data | 全データ | `LhTransferItem[]` | — |
| modelValue | 左側（ソース）のキーリスト（制御 v-model） | `Array<string \| number>` | `[]` |
| disabled | 無効化 | `boolean` | `false` |
| sx | sx クイックレイアウトプロパティ | `LhSxProps` | — |

### Events

| イベント | 説明 | パラメータ |
| --- | --- | --- |
| update:modelValue | 左側（ソース）のキーリストが変化（v-model 用） | `(keys: Array<string \| number>)` |
| change | データの移動完了後に発火 | `(keys: Array<string \| number>, direction: 'left-to-right' \| 'right-to-left')` |

### LhTransferItem

| フィールド | 説明 | 型 |
| --- | --- | --- |
| key | 一意キー | `string \| number` |
| label | 表示テキスト（欠落時は key にフォールバック） | `string` |
| disabled | 無効化（チェック不可 / 全選択の対象外 / 移動不可） | `boolean` |

### アクセシビリティ

- 両列とも `role="listbox"` + `aria-multiselectable`。項目は `role="option"` で
  `aria-selected` / `aria-disabled` を公開
- 各パネルの検索ボックスは `aria-label` を持ち、移動ボタンにも `aria-label`
  （「右へ移動」「左へ移動」）が付きます
- 全選択ボックスの中間状態は `indeterminate` が担います。無効項目は
  チェック・全選択・移動の全工程でスキップされます

::: tip プラットフォーム差異（Vue3 版との差異）
- **API 範囲は plus ソースに厳密に合わせる**：本パッケージが提供するのは plus にある
  `data` / `modelValue` / `disabled` / `sx` のみです。他ライブラリでよくある
  `titles`（パネルタイトル）、`filterable`（検索の ON/OFF）、`props`
  （フィールド名のカスタマイズ）、`left/right-default-checked`
  （デフォルトのチェックキー）のうち plus ソースに存在しないものは意図的に
  追加していません。パネルタイトルは share locales の
  `transfer.sourceTitle` / `transfer.targetTitle` キー（10 言語対応）から取得し、
  検索ボックスは plus と同じ常駐形式（トグルなし）を踏襲します。
- **両リストを scroll-view が担う**：Vue3 版の `<ul>` / `<li>` リストは
  `<scroll-view scroll-y>` + `<view>` に置き換わります（ミニプログラムでは
  `view` のオーバーフロースクロールが信頼できないため）。H5 と WeChat
  ミニプログラムで同じ挙動になります。リストのスタイルは引き続き share の
  `.lh-transfer-panel__list` から提供されます。
- **ボタンによる移動は全端末で利用可能**：中央の › / ‹ 移動ボタンは
  uni 組み込みの `<button>` で、H5・ミニプログラムのどちらでもクリックできます。
  ここにプラットフォーム差異はなく、無効状態は `disabled` 属性が担います。
- **キーボード操作は H5 のみ**：APG listbox パターンのキー操作 — フィルタ後の
  リスト内を ↑/↓ で移動（無効項目をスキップ、ループなし）、Enter / Space で
  フォーカス項目をチェック、←/→ でパネル間のフォーカス移動、Escape で
  フォーカスをリセット — は H5 端末でのみ機能します。ミニプログラムに
  キーボードイベントはなく、このブロックは条件付きコンパイルで丸ごと
  削除されます（MP バンドルにデッドコードは残りません）。roving tabindex も
  同様に H5 のみ出力されます。
- **チェックボックスは自前描画**：全選択ボックスと項目ごとのチェックボックスに
  ネイティブな `<input type="checkbox">` は使いません（ミニプログラムでは
  スタイルを制御できないため）。代わりに本パッケージの `lh-checkbox`
  （view 自前描画 + lh-icon）を使用します。状態は引き続きコンポーネントが
  制御的に書き込み、セマンティクスは変わりません。
:::
