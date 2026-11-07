# Autocomplete 自動補完

入力に合わせて候補を絞り込むサジェスト入力欄で、入力欄（combobox）とドロップダウンの候補リスト（listbox）で構成されます。

## 基本的な使い方

```vue
<script setup>
import { ref } from 'vue'
const value = ref('')
const options = [
  { label: '水墨' },
  { label: '余白' },
  { label: '印章', value: 'seal' },
]
</script>

<template>
  <lh-autocomplete v-model="value" :options="options" />
</template>
```

オプションに `label` しか書かない場合、送信値は label そのままになります。機械可読な識別子が必要な場合は `value` を書きます。無効化されたオプションはリストに残り、グレーアウトして選択できません。

## フィルタリング

デフォルトでは `label` がクエリ文字列を含むかどうかで絞り込みます（大文字・小文字を区別せず、前後の空白はマッチング対象外）：

```vue
<template>
  <lh-autocomplete v-model="value" :options="options" case-sensitive />
</template>
```

`case-sensitive` で大文字・小文字を区別します。`trim` に `false` を渡すと空白を含めたマッチングになります。

## 選択コールバック

```vue
<template>
  <lh-autocomplete v-model="value" :options="options" @select="onSelect" />
</template>
```

`select` イベントの引数は、送信値と元のオプションオブジェクトです。

## Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| modelValue | 入力値（v-model） | `string` | `''` |
| options | 候補オプション | `LhAutocompleteOption[]` | `[]` |
| caseSensitive | 大文字・小文字を区別してマッチング | `boolean` | `false` |
| trim | クエリ文字列の前後の空白を除去してからマッチング | `boolean` | `true` |
| placeholder | プレースホルダー | `string` | — |
| placeholderStyle | プレースホルダーのスタイル（`::placeholder` の代替） | `string` | — |
| disabled | 無効化 | `boolean` | `false` |
| openOnFocus | フォーカス時に候補パネルを展開 | `boolean` | `true` |
| ariaLabel | アクセシブル名 | `string` | — |
| customClass | カスタムクラス名 | `string` | — |
| sx | クイックレイアウトプロパティ | `LhSxProps` | — |

## Slots

| スロット | 説明 |
| --- | --- |
| empty | 一致する候補がないときの空状態（デフォルトテキストは言語パック autocomplete.noMatch から取得） |

## Events

| イベント | 説明 | コールバックパラメータ |
| --- | --- | --- |
| update:modelValue | 入力または選択後に書き戻し | `(value: string)` |
| change | 入力値の変化 | `(value: string)` |
| select | 候補項目が選択された | `(value: string \| number, option: LhAutocompleteOption)` |

## メソッド（defineExpose）

| メソッド | 説明 |
| --- | --- |
| open / close | パネルを手動で開く / 閉じる |
| isOpen | 現在の開閉状態（読み取り専用） |

## プラットフォーム差異

| 能力 | H5 | ミニプログラム |
| --- | --- | --- |
| ドロップダウンの配置 | root-portal + 2 フレーム計測（select と同じ） | Alipay は基本ライブラリのバージョンに応じて root-portal / ページ内 fixed を切り替え、Douyin はページ内 fixed |
| キーボード操作 / Esc | 方向キーでハイライト移動、Enter で選択、Esc で閉じる | キーボードイベントなし、クリックでのみ選択 |
| hover ハイライト | あり | なし（クリックで直接選択） |
| openOnFocus | フォーカスで展開 | フォーカスで展開 |
