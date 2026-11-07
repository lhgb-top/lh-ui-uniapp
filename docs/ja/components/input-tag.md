# InputTag タグ入力

入力と同時にタグを確定するタググループ。トリガーキー、上限、重複排除、クリック削除をサポートします。

## 基本的な使い方

```vue
<script setup>
import { ref } from 'vue'
const tags = ref(['水墨', '留白'])
</script>

<template>
  <lh-input-tag v-model="tags" placeholder="入力後 Enter で確定" />
</template>
```

## トリガーキー

`trigger` は `enter`（デフォルト）/ `space` / `comma` をサポートします。`space` / `comma` でトリガーする場合、空白は入力欄に入りません。

```vue
<template>
  <lh-input-tag v-model="tags" trigger="comma" placeholder="カンマで確定" />
</template>
```

## 上限と重複排除

```vue
<template>
  <lh-input-tag v-model="tags" :max="3" allow-duplicate />
</template>
```

`max` が正の数の場合は上限となります（超過すると確定されず入力はクリア）。デフォルトでは重複を許可しません（重複するタグは確定されません）。

## 読み取り専用と無効化

```vue
<template>
  <lh-input-tag v-model="tags" readonly />
  <lh-input-tag v-model="tags" disabled />
</template>
```

## Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| modelValue | タグリスト（v-model） | `string[]` | `[]` |
| trigger | 確定のトリガーキー（ミニプログラム端は常に完了キー） | `'enter' \| 'space' \| 'comma'` | `'enter'` |
| placeholder | プレースホルダー（タグがない時のみ表示） | `string` | `''` |
| placeholderStyle | プレースホルダーのスタイル（`::placeholder` の代替） | `string` | — |
| max | タグ上限（正でない値は無制限） | `number` | `0` |
| allowDuplicate | 重複タグを許可 | `boolean` | `false` |
| readonly | 読み取り専用 | `boolean` | `false` |
| disabled | 無効 | `boolean` | `false` |
| ariaLabel | アクセシビリティ名 | `string` | — |
| customClass | カスタムクラス名 | `string` | — |
| sx | クイックレイアウトプロパティ | `LhSxProps` | — |

## Events

| イベント | 説明 | コールバックパラメータ |
| --- | --- | --- |
| update:modelValue | タグリスト変化 | `(value: string[])` |
| change | タグリスト変化（modelValue と同じ） | `(value: string[])` |
| add | タグを 1 件確定 | `(tag: string)` |
| remove | タグを 1 件削除 | `(tag: string)` |

## メソッド（defineExpose）

| メソッド | 説明 |
| --- | --- |
| focus | 入力欄にフォーカス |
| commit | 現在の入力を確定 |

## プラットフォーム差異

| 能力 | H5 | ミニプログラム |
| --- | --- | --- |
| 確定トリガーキー | `trigger` すべて対応（Enter / Space / Comma のキーボードイベント） | 常に**完了キー**（`@confirm`）。`space` / `comma` の意味は H5 のみ |
| Backspace での削除 | 入力が空の時に Backspace で最後のタグを削除 | キーボードイベントなし、削除は各タグの **× ボタン**（両端で利用可能） |
| フォーカス外しで確定 | あり | あり |
| フォーカス枠 | `:has()` のフォーカススタイルが有効 | フォーカス枠なし（WXSS は `:has()` 非対応）、入力は正常 |
