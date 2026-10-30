# Checkbox チェックボックス

::: tip ミニプログラム端は view による自前描画
ネイティブの checkbox コンポーネントは使いません（MP ではスタイルを制御できないため）。代わりに view でチェックボックスを自前描画し、lh-icon アイコンを組み合わせて、
ファミリーの他端と視覚を一致させます。
:::

## 基本的な使い方

```vue
<template>
  <lh-checkbox v-model="checked" label="規約に同意する" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const checked = ref(false)
</script>
```

## チェックボックスグループ

```vue
<template>
  <lh-checkbox-group v-model="values">
    <lh-checkbox value="a" label="選択肢 1" />
    <lh-checkbox value="b" label="選択肢 2" />
    <lh-checkbox value="c" label="選択肢 3" disabled />
  </lh-checkbox-group>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const values = ref(['a'])
</script>
```

## 半選択状態

```vue
<lh-checkbox v-model="checked" indeterminate label="全選択（一部選択）" />
```

## Checkbox Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| modelValue (v-model) | 選択されているか | `boolean` | `false` |
| value | group 内での識別値 | `unknown` | — |
| label | 文言 | `string` | — |
| disabled | 無効 | `boolean` | `false` |
| indeterminate | 半選択状態 | `boolean` | `false` |
| name | ネイティブ name | `string` | — |
| size | サイズ | `'small' \| 'medium' \| 'large'` | — |
| customClass | カスタムクラス名 | `string` | — |
| sx | クイックレイアウトプロパティ | `LhSxProps` | — |

## CheckboxGroup Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| modelValue (v-model) | 選択値の配列 | `unknown[]` | `[]` |
| disabled | すべての子項目を無効化 | `boolean` | `false` |
| name | ネイティブ name | `string` | — |
| size | サイズ（子項目に伝達） | `'small' \| 'medium' \| 'large'` | — |

## Events

| イベント | 説明 | コールバックパラメータ |
| --- | --- | --- |
| update:modelValue | 値の変化 | `(value)` |
| change | 値の変化 | `(value)` |
