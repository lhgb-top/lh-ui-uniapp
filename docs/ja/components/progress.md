# Progress プログレスバー

タスクの進捗を表示します。状態色、カスタム色、テキストのフォーマットをサポートします。

## 基本的な使い方

```vue
<template>
  <lh-progress :percentage="42" />
</template>
```

## 状態

```vue
<template>
  <lh-progress :percentage="70" status="success" />
  <lh-progress :percentage="70" status="warning" />
  <lh-progress :percentage="70" status="exception" />
  <lh-progress :percentage="100" />
</template>
```

`status` が `normal` で 100 に達すると自動的に `success` とみなされます。

## 線幅とテキストの非表示

```vue
<template>
  <lh-progress :percentage="60" :stroke-width="12" />
  <lh-progress :percentage="60" :show-text="false" />
</template>
```

## カスタム色

文字列はそのままバーの色として使い、関数はパーセンテージに応じて色を返します。

```vue
<template>
  <lh-progress :percentage="60" color="#C4A35A" />
  <lh-progress :percentage="60" :color="gradient" />
</template>

<script setup lang="ts">
const gradient = (p: number) => `rgb(${p}, 0, 0)`
</script>
```

## カスタムフォーマットとテキストスロット

```vue
<template>
  <lh-progress :percentage="42" :format="format" />
  <lh-progress :percentage="42">
    <template #text="{ percentage }">
      <text>{{ percentage }} / 100</text>
    </template>
  </lh-progress>
</template>

<script setup lang="ts">
const format = (p: number) => `進捗 ${p}`
</script>
```

## Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| percentage | 進捗のパーセンテージ 0-100（範囲外は自動でクランプ） | `number` | `0` |
| type | タイプ | `'line' \| 'circle'` | `'line'` |
| status | 状態 | `'normal' \| 'success' \| 'warning' \| 'exception'` | `'normal'` |
| color | プログレスバーの色：文字列、またはパーセンテージに応じて色を返す関数 | `string \| ((percentage: number) => string)` | — |
| strokeWidth | 線の幅 px | `number` | `6` |
| width | 円形モードのキャンバス幅 px | `number` | `126` |
| showText | テキストを表示するか | `boolean` | `true` |
| format | カスタムテキストフォーマット | `(percentage: number) => string` | — |
| customClass | カスタムクラス名 | `string` | — |
| sx | クイックレイアウトプロパティ | `LhSxProps` | — |

## Slots

| スロット | 説明 | スコープ引数 |
| --- | --- | --- |
| text | カスタムの進捗テキスト | `{ percentage: number }` |

::: tip circle 型は未実装
ミニプログラムは svg のサポートが限定的なため、初版は line 型のみ実装します。`type="circle"` を渡すと line としてレンダリングし、開発時に一度警告を出します（無言のフォールバックは行いません）。circle は第二期に回します。
:::
