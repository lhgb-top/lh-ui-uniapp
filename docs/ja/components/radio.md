# Radio ラジオボタン

::: tip ミニプログラム端は view による自前描画
ネイティブの radio コンポーネントは使いません（MP ではスタイルを制御できないため）。代わりに view で円点を自前描画します。
:::

## 基本的な使い方

```vue
<template>
  <lh-radio-group v-model="value">
    <lh-radio value="a" label="選択肢 1" />
    <lh-radio value="b" label="選択肢 2" />
    <lh-radio value="c" label="選択肢 3" disabled />
  </lh-radio-group>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref('a')
</script>
```

## Radio Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| modelValue (v-model) | 選択されているか | `unknown` | — |
| value | この項目の値 | `unknown` | — |
| label | 文言 | `string` | — |
| disabled | 無効 | `boolean` | `false` |
| name | ネイティブ name | `string` | — |
| size | サイズ | `'small' \| 'medium' \| 'large'` | — |
| customClass | カスタムクラス名 | `string` | — |
| sx | クイックレイアウトプロパティ | `LhSxProps` | — |

## RadioGroup Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| modelValue (v-model) | 選択値 | `unknown` | — |
| disabled | すべての子項目を無効化 | `boolean` | `false` |
| name | ネイティブ name | `string` | — |
| size | サイズ（子項目に伝達） | `'small' \| 'medium' \| 'large'` | — |

## Events

| イベント | 説明 | コールバックパラメータ |
| --- | --- | --- |
| update:modelValue | 値の変化 | `(value)` |
| change | 値の変化 | `(value)` |
