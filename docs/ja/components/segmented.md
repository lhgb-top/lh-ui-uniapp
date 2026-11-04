# Segmented セグメントコントロール

排他的なオプション切替。ビュー切り替えの場面でよく使います。データ駆動：オプションは `options` 配列として直接渡し、子コンポーネントを手作業で組む必要はありません。

## 基本的な使い方

`options` は文字列の簡易記法に対応します。`modelValue`（`v-model`）が現在の選択値です。

```vue
<template>
  <lh-segmented v-model="view" :options="['リスト', 'カード', 'テーブル']" />
</template>

<script setup>
import { ref } from 'vue'
const view = ref('リスト')
</script>
```

## オブジェクト形式のオプション

オブジェクト記法では `label` / `value` を指定でき、表示テキストと値を分けたい場合に適しています。

```vue
<template>
  <lh-segmented
    v-model="mode"
    :options="[
      { label: '日', value: 'day' },
      { label: '週', value: 'week' },
      { label: '月', value: 'month' },
    ]"
  />
</template>

<script setup>
import { ref } from 'vue'
const mode = ref('day')
</script>
```

## 無効な項目と全体の無効化

オプションオブジェクトに `disabled: true` を指定するとその項目は選択できません。コンポーネントレベルの `disabled` はコントロール全体を無効化します。

```vue
<template>
  <lh-segmented
    v-model="seg"
    :options="[
      { label: '立春', value: 'lichun' },
      { label: '雨水', value: 'yushui' },
      { label: '啓蟄', value: 'jingzhe', disabled: true },
    ]"
  />
  <lh-segmented v-model="all" disabled :options="['甲', '乙', '丙']" />
</template>

<script setup>
import { ref } from 'vue'
const seg = ref('lichun')
const all = ref('甲')
</script>
```

## ブロック幅

`block` を指定するとコントロールがコンテナいっぱいに広がり、オプションが均等に幅を分け合います（ビュー切替バーでよく使います）。

```vue
<template>
  <lh-segmented v-model="block" block :options="['詩', '詞', '曲', '賦']" />
</template>

<script setup>
import { ref } from 'vue'
const block = ref('詩')
</script>
```

## Props

| 属性 | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| modelValue (v-model) | 現在の値（制御、`update:modelValue` イベントと併用） | `string \| number` | — |
| options | オプション（文字列の簡易記法または `{ label, value, disabled }` オブジェクト） | `[LhSegmentedInput](#型メモ)[]` | — |
| disabled | グループ全体を無効化 | `boolean` | `false` |
| block | コンテナいっぱいに広げる（オプションが均等に幅を分ける） | `boolean` | `false` |
| customClass | カスタムクラス名（ルートノードに転送） | `string` | — |
| sx | レイアウト簡易プロパティ | `LhSxProps` | — |

### 型メモ

```ts
/** オプション値の型 */
type LhSegmentedValue = string | number

/** オプションオブジェクトの形 */
interface LhSegmentedOption {
  label: string
  value: LhSegmentedValue
  disabled?: boolean
}

/** 入力オプション（文字列の簡易記法またはオブジェクト） */
type LhSegmentedInput = LhSegmentedValue | LhSegmentedOption
```

## Events

| イベント名 | 説明 | コールバックパラメータ |
| --- | --- | --- |
| update:modelValue | 選択の変化時に発火、v-model と併用 | `(value: string \| number)` |
| change | 選択の変化時に発火（クリック・方向キーどちらでも発火） | `(value: string \| number)` |

## プラットフォームの違い

- **view による自前のタッチ操作、全端で利用可能**：Vue3 版の `<div>` + `<button>` は `<view>` に置き換えます（WXSS はタグセレクタを禁止、クラス名でスタイルを当てる）。選択の切替は `@click` で行い、H5 でも WeChat ミニプログラムでも同じ挙動で、プラットフォーム API への依存はありません。
- **選択スライダーは純 CSS トランジション**：選択項目の背景色 / シャドウはクラス切替で駆動し、WXSS はシンプルな `transition` をサポートするため両端でフェードが効きます。**`transitionend` には依存しません**（ミニプログラムでは同イベントが信頼できないため、本リポジトリの message / loading などのアニメーションコンポーネントは setTimeout で時刻を合わせますが、セグメントコントロールは JS のタイミング編成すら不要で、純 CSS で済みます）。
- **方向キーによるナビゲーションは H5 のみ**：roving tabindex（方向キーで選択を移動、両端で折り返し、無効項目をスキップ、`@lh-ui/share` core の `getNextListIndex` / `getRovingTabIndex` を再利用）は、ミニプログラムにキーボードイベントが存在しないため、SFC の `@keydown` 処理は条件付きコンパイルでガードされ MP バンドル内では呼ばれません。MP ではタップ選択のみです。
- **無効項目の見た目はクラスでフォールバック**：share のスタイルソースにある無効時のスタイルは `&:disabled` 疑似クラス（button 要素にしか一致しない）に書かれており、view にはその疑似クラスがないため、コンポーネントは SFC 内に同じトークン（`--lh-disabled-text-color`）で `lh-segmented__option--disabled` クラス規則をインラインで補います（lh-spinner / lh-empty のインラインフォールバックの先例と同様、浄化後の出力には含まれません）。
- **アクセシビリティ属性は個別にバインド**：`role="radiogroup"` / `role="radio"` + `aria-checked` / `aria-disabled` の契約は引き続き share の `getSegmentedAria` / `getSegmentedItemAria` が決定します。ミニプログラムのテンプレートコンパイラが `v-bind` のオブジェクト渡しをサポートしないため、グルー層で属性パックを個別の明示的バインドに展開しています。
- **移植結論**：segmented は計測もオーバーレイも document 依存もない純粋な切替コンポーネントで、オプションの正規化、クラス名、アクセシビリティ属性はすべて `@lh-ui/share` core の純関数が生成し、本リポジトリはリアクティブなグルーを書くだけです。API は Vue3 版と完全に一致します（`modelValue` / `options` / `disabled` / `block` / `sx`）。
