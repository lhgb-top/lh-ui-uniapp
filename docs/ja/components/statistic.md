# Statistic 統計数値

統計数値を表示し、精度、桁区切り、プレフィックス・サフィックス、巨大数の文字列に対応します。

## 基本的な使い方

```vue
<template>
  <lh-statistic
    title="年間アクセス数"
    :value="2384712"
  />
</template>
```

## 精度と区切り文字

`precision` で小数位（四捨五入）を制御し、`separator` で桁区切りを制御します（空文字列で区切りを無効化）。

```vue
<template>
  <lh-statistic
    title="評価"
    :value="4.8471"
    :precision="2"
  />
  <lh-statistic
    title="番号"
    :value="8899001"
    separator=""
  />
</template>
```

## プレフィックスとサフィックス

```vue
<template>
  <lh-statistic
    title="取引額"
    :value="128600"
    prefix="¥"
    suffix="元"
  />
  <lh-statistic
    title="成長率"
    :value="12.6"
    :precision="1"
    suffix="%"
  />
</template>
```

## 巨大数と非数値テキスト

文字列の `value` は巨大数を扱えます。`Number.MAX_SAFE_INTEGER` を超える整数文字列は文字列フォーマットパスを通り、Number 変換を経ず精度を落としません。数値に解析できない文字列はそのまま表示されます。

```vue
<template>
  <lh-statistic
    title="星々"
    value="数えきれない"
  />
  <lh-statistic
    title="星間距離"
    value="9007199254740993"
  />
</template>
```

## スロット

`title` / `prefix` / `suffix` スロットが同名 props のテキストを上書きします。

```vue
<template>
  <lh-statistic :value="1024">
    <template #title>
      <text>カスタムタイトル</text>
    </template>
    <template #prefix>
      <text>¥</text>
    </template>
    <template #suffix>
      <text>元</text>
    </template>
  </lh-statistic>
</template>
```

## Props

| 属性 | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| title | 数値のタイトル（数値の上に表示） | `string` | — |
| value | 統計数値。文字列形式は巨大数や符号付きテキストを扱える | `string \| number` | `0` |
| precision | 小数精度 | `number` | `0` |
| separator | 桁区切り文字。空文字列で区切りを無効化 | `string` | `','` |
| prefix | 数値のプレフィックス（通貨記号など） | `string` | — |
| suffix | 数値のサフィックス（単位など） | `string` | — |
| customClass | カスタムクラス名 | `string` | — |
| sx | レイアウト簡易設定 | `LhSxProps` | — |

## Slots

| スロット | 説明 |
| --- | --- |
| title | カスタムタイトル |
| prefix | カスタムプレフィックス |
| suffix | カスタムサフィックス |

## プラットフォームの違い

- 純粋な表示コンポーネントで、プラットフォーム API を一切使用せず、H5 と WeChat ミニプログラムで動作は完全に一致します。
- フォーマットロジック（精度、桁区切り、巨大数の文字列パス）はすべて `@lh-ui/share` の `formatStatisticValue` 純粋関数が産出し、本リポジトリはリアクティブなグルーコードのみを記述し、core 実装をコピーしません。
- 数値領域には `aria-live="polite"` を付与します。H5 では `value` 変化時にスクリーンリーダーが新しい値を穏やかに読み上げます。ミニプログラムの読み上げ対応はプラットフォームの能力に依存します。
- 本コンポーネントにはカウントアップアニメーションは含まれません。将来追加する場合、ミニプログラムでは `setInterval` / `requestAnimationFrame` は利用できますが、`transitionend` は信頼できないため、アニメーション終端は `setTimeout` で長さを合わせる必要があります（message / loading のトランジションと同じ対応です）。
