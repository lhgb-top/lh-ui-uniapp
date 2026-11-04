# InputNumber 数値入力

数値入力フィールド：入力または増減ボタンで値を変更し、範囲クランプ・ステップ・精度・厳格ステップに対応します。パラメータの正規化・ステップ処理・送信時のクランプはすべて `@lh-ui/share` の core 純粋関数が担います。

## 基本的な使い方

```vue
<template>
  <lh-input-number v-model="value" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const value = ref<number | null>(1)
</script>
```

## 範囲制限

`min` / `max` はボタンのステップと入力値の送信の両方に効きます（範囲外の値はクランプされます）。

```vue
<template>
  <lh-input-number v-model="level" :min="1" :max="10" />
</template>
```

## ステップと精度

`step` でステップ量を調整、`precision` で小数桁を固定（クランプ前に適用）、`step-strictly` で入力値を step のグリッドに四捨五入でスナップさせます。

```vue
<template>
  <lh-input-number v-model="value" :step="2" />
  <lh-input-number v-model="value" :precision="2" placeholder="小数2桁" />
  <lh-input-number v-model="value" :step="10" step-strictly placeholder="10の倍数のみ" />
</template>
```

## サイズとコントロールボタン

`size` で small / medium / large を切り替え、`controls` で増減ボタンを非表示にします（入力のみ）。

```vue
<template>
  <lh-input-number v-model="value" size="small" />
  <lh-input-number v-model="value" size="large" />
  <lh-input-number v-model="value" :controls="false" placeholder="ボタンなし" />
</template>
```

## 無効化とフォーム名

`disabled` で全体を無効化（ボタン押下不可・入力不可）、`name` はネイティブなフォーム名です。

```vue
<template>
  <lh-input-number :model-value="5" disabled />
  <lh-input-number v-model="value" name="quantity" />
</template>
```

## Props

| プロパティ | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| modelValue / v-model | 現在値（null は空値） | `number \| null` | `null` |
| min | 最小値 | `number` | `-Infinity` |
| max | 最大値 | `number` | `Infinity` |
| step | ステップ量 | `number` | `1` |
| step-strictly | step の倍数のみ受け付ける | `boolean` | `false` |
| precision | 数値精度（小数桁数） | `number` | — |
| disabled | 無効化するか | `boolean` | `false` |
| size | サイズ | `"small" \| "medium" \| "large" \| "mini" \| "x-large"` | `'medium'` |
| controls | 増減ボタンを表示するか | `boolean` | `true` |
| placeholder | プレースホルダー | `string` | `''` |
| name | ネイティブなフォーム名 | `string` | `''` |
| customClass | カスタムクラス名（ルートノードへ透過） | `string` | — |
| sx | sx レイアウト簡易プロパティ | `LhSxProps` | — |

## Events

| イベント | 説明 | 引数 |
| --- | --- | --- |
| update:modelValue / change | 値の送信（ボタンは即時に送信、入力値はブラー / 確定時に送信。plus のネイティブ change と同じタイミング） | `(value: number \| null)` |

## プラットフォーム差異

- **送信タイミング（ドラフトモデル）**：uni の input コンポーネントにはネイティブ change イベントがありません（ミニプログラムは input / blur / confirm のみ）。入力中は内部ドラフトを同期するだけで送信せず、ブラーまたは confirm（H5 の Enter / ミニプログラムのキーボード「完了」）で一括送信します——plus のネイティブ change が送信時にのみ発火するのと等価なセマンティクスです（react 版と同じ方式）。同一値は二重に発行しません（MP では confirm の後に blur が再度走るため、重複を排除しています）。
- **増減ボタンは view の自前描画**：plus の `<button>` を `<view role="button">` に置き換え（MP の button はデフォルトスタイルをリセットできない）、全プラットフォームでタップ可能。view には `:disabled` 疑似クラスがないため、無効時の見た目は同じトークンでコンポーネント内のフォールバック規則が担います。
- **キーボードの上下キーステップは H5 のみ**：↑ で増加 / ↓ で減少（Enter による送信は keydown に組みません——H5 では keydown と confirm が同時に発火するため、二重送信を避けるべく confirm に統一）；ミニプログラムにキーボードイベントはないため、挙動差は生じません。
- **placeholder スタイル**：share の `::placeholder` ルールは H5 産物のみ。ミニプログラムでは `placeholder-style` プロパティを使います（トークン色でフォールバック）。
- **フォームバリデーション連携は未接続**：plus は form コンテキスト経由で input に `aria-invalid` を出力しますが、本パッケージの input 系コンポーネントはフォームコンテキストの aria 透過に未接続です。値とバリデーション動作には影響しません。

::: tip Vue3 版との違い
- ロジックの考え方（パラメータ正規化・ステップ・precision / min/max / stepStrictly のクランプ）は plus と完全に一致（同じ share core）。
- `customClass` プロパティを追加：uni-app ではカスタムクラスが `styleIsolation` を貫通できないため、prop で透過します。
- 入力値の送信タイミングは「プラットフォーム差異」の最初の項目を参照（ドラフトモデル、plus の change セマンティクスと等価）。
:::
