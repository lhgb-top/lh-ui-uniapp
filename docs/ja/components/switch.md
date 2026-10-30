# Switch スイッチ

::: tip ミニプログラム端は view による自前描画
ネイティブの switch コンポーネントはミニプログラムではスタイルを制御できないため、view でツマミを自前描画して視覚の一貫性を保ちます。
:::

## 基本的な使い方

```vue
<template>
  <lh-switch v-model="on" />
  <lh-switch v-model="on" active-text="オン" inactive-text="オフ" />
  <lh-switch v-model="on" loading />
  <lh-switch v-model="on" disabled />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const on = ref(true)
</script>
```

## Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| modelValue (v-model) | オンかどうか | `boolean` | `false` |
| disabled | 無効 | `boolean` | `false` |
| loading | 読み込み中 | `boolean` | `false` |
| name | ネイティブ name | `string` | — |
| size | サイズ | `'small' \| 'medium' \| 'large'` | — |
| activeText | オンの文言 | `string` | — |
| inactiveText | オフの文言 | `string` | — |
| customClass | カスタムクラス名 | `string` | — |
| sx | クイックレイアウトプロパティ | `LhSxProps` | — |

## Events

| イベント | 説明 | コールバックパラメータ |
| --- | --- | --- |
| update:modelValue | 値の変化 | `(value: boolean)` |
| change | 値の変化 | `(value: boolean)` |
