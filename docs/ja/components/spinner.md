# Spinner スピナー

進行中の状態を示す基本的な回転図形です。ロードオーバーレイ（LhLoading サービス）の内部にも同じものが描画されます。

## 基本的な使い方

5 つのサイズ：`mini` / `small` / `medium` / `large` / `x-large`。直径は `@lh-ui/share` core の `LH_SPINNER_SIZE_PX` 定数で一元管理されます（12 / 16 / 24 / 32 / 40 px）。

```vue
<template>
  <lh-spinner />
  <lh-spinner size="mini" />
  <lh-spinner size="small" />
  <lh-spinner size="medium" />
  <lh-spinner size="large" />
  <lh-spinner size="x-large" />
</template>
```

## 色のカスタマイズ

`color` は任意の CSS color 値を受け取ります。未指定時は現在の文字色（`currentColor`）を継承します。

```vue
<template>
  <lh-spinner color="#C4A35A" />
  <lh-spinner color="#5B8C5A" />
  <lh-spinner color="#B5462F" />
</template>
```

## 文字色の継承

`color` を渡さない場合、図形は所属コンテナの文字色に追従します。テキストとの混在配置に適しています。

```vue
<template>
  <view class="row">
    <text>読み込み中…</text>
    <lh-spinner size="small" />
  </view>
</template>
```

## Props

| プロパティ | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| size | サイズ | `'mini' \| 'small' \| 'medium' \| 'large' \| 'x-large'` | `'medium'` |
| color | 回転の色（CSS color 値。未指定時は currentColor を継承） | `string` | — |
| customClass | カスタムクラス名 | `string` | — |
| sx | レイアウト用ショートカット | `LhSxProps` | — |

## プラットフォームの違い

- **回転アニメーションは純粋な CSS animation** で、プラットフォーム API に依存しません。すべてのプラットフォームで利用可能で、H5 と WeChat ミニプログラムで同一の挙動となります。
- **図形の描画はプラットフォームごとに分かれます**：H5 では svg のストリング（`stroke-dasharray` の二重アニメーション、Vue3 版とピクセル単位で同一）を描画します。ミニプログラムは svg テンプレートタグをサポートしていないため、代わりに `view` + `border` のリングを使用します——3 辺を着色して約 4 分の 3 の円弧を構成し（Vue3 版の 72% 弧と視覚的に同型）、線幅は直径の 10% をインラインで計算します（最小 1px）。両プラットフォームとも回転は CSS animation で駆動するため、`transitionend` のようなミニプログラムで信頼できない機能には触れません。
- **色は currentColor 経由**：`color` prop はルートノードのインライン `color` スタイルに書き込まれ、図形がそれを継承します。Vue3 版と同じ挙動です。
- **アクセシビリティ**：図形は純粋な装飾であり、`aria-hidden="true"` でアクセシビリティツリーから外します。進行中のセマンティクスは外側のコンテナ（例：`role="status"`）が担うべきです。
- **モーションの低減**：`prefers-reduced-motion` 時に静的な半リングへ落とす処理は `@lh-ui/share` の scss ソースが提供します。このメディアクエリのブロックはミニプログラムのビルド時に全体が削除されるため（WXSS は非対応）、低減は H5 のみ有効です。
- **移植の結論**：spinner は純粋な表示コンポーネント（計測 / オーバーレイ / document への依存なし）です。サイズのマッピングとクラス名は `@lh-ui/share` core の純粋関数（`getSpinnerClassNames` / `LH_SPINNER_SIZE_PX`）が产出し、本リポジトリはリアクティブな接着剤しか書きません。
