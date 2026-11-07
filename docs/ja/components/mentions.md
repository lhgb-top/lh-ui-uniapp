# Mentions メンション

`@` 入力で発動するメンション入力欄で、フィルタリング、複数行、選択コールバックに対応します。

## 基本的な使い方

```vue
<script setup>
import { ref } from 'vue'
const value = ref('')
const members = [
  { label: '水墨', value: 'ink' },
  { label: '余白', value: 'blank' },
]
</script>

<template>
  <lh-mentions v-model="value" :options="members" />
</template>
```

`@` を入力すると候補パネルが展開し、続けて入力すると label で絞り込まれます。選択時に書き戻されるのは `label`（人が読める `@水墨 `）で、機械可読な識別子 `value` は `select` イベント経由で業務層に渡されます。

## 複数行

```vue
<template>
  <lh-mentions v-model="value" :options="members" multiline />
</template>
```

`multiline` は単一行の input を textarea に切り替えます。

## トリガー文字

```vue
<template>
  <lh-mentions v-model="value" :options="members" prefix="#" />
</template>
```

`prefix` のデフォルトは `'@'` です。ASCII の単語文字に直接後続する疑似プレフィックス（メールアドレスの `user@` など）は発動しません。

## Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| modelValue | テキスト内容（v-model） | `string` | `''` |
| options | 候補メンバー | `LhMentionOption[]` | `[]` |
| prefix | トリガー文字 | `string` | `'@'` |
| placeholder | プレースホルダー（デフォルトは言語パック mentions.placeholder から取得） | `string` | — |
| placeholderStyle | プレースホルダーのスタイル（`::placeholder` の代替） | `string` | — |
| disabled | 無効化 | `boolean` | `false` |
| multiline | 複数行 textarea | `boolean` | `false` |
| ariaLabel | アクセシブル名 | `string` | — |
| customClass | カスタムクラス名 | `string` | — |
| sx | クイックレイアウトプロパティ | `LhSxProps` | — |

## Slots

| スロット | 説明 |
| --- | --- |
| empty | 一致する候補がないときの空状態（デフォルトテキストは言語パック mentions.noMatch から取得） |

## Events

| イベント | 説明 | コールバックパラメータ |
| --- | --- | --- |
| update:modelValue | 入力または選択後に書き戻し | `(value: string)` |
| change | テキストの変化 | `(value: string)` |
| select | メンション項目が選択された | `(option: LhMentionOption)` |

## メソッド（defineExpose）

| メソッド | 説明 |
| --- | --- |
| updateContext | カーソルコンテキストを手動で更新 |
| close | 候補パネルを閉じる |

## プラットフォーム差異

| 能力 | H5 | ミニプログラム |
| --- | --- | --- |
| ドロップダウンの配置 | root-portal + 2 フレーム計測（select と同じ） | Alipay は基本ライブラリのバージョンに応じて root-portal / ページ内 fixed を切り替え、Douyin はページ内 fixed |
| カーソルコンテキスト | ネイティブの `selectionStart`（テキストの途中でもメンション発動可能） | **カーソル位置を取得できず、テキスト末尾で近似**——入力済みテキストの途中でメンションを発動するケースは機能せず、末尾への挿入にフォールバック |
| キーボード操作 / Esc | 方向キーでハイライト移動、Enter で選択、Esc で閉じる | キーボードイベントなし、クリックでのみ選択 |
| 選択後のカーソル位置 | メンションの直後に正確に配置 | 制御された書き戻しの後、カーソルは末尾 |
