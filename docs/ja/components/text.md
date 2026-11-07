# Text テキスト

見出し / 本文 / 省略 / コピーを一つにした組版コンポーネント。意味修飾はすべて BEM 修飾クラスに委ねられます。

## レベル

```vue
<template>
  <lh-text level="h1">見出し 1</lh-text>
  <lh-text level="p">本文の段落</lh-text>
  <lh-text level="caption">補足説明</lh-text>
</template>
```

`level` は `h1` ~ `h6` / `p`（デフォルト）/ `caption` をサポートします。無効な値は `p` にフォールバックします。

## 意味と修飾

```vue
<template>
  <lh-text type="success" strong>成功・太字</lh-text>
  <lh-text mark>マークハイライト</lh-text>
  <lh-text code>コード風</lh-text>
</template>
```

`type`：`default`（デフォルト）/ `secondary` / `success` / `warning` / `danger`。修飾プロパティ：`strong` / `italic` / `underline` / `mark` / `code` / `disabled`。

## 省略

```vue
<template>
  <lh-text :ellipsis="true">1 行省略</lh-text>
  <lh-text :ellipsis="2">2 行省略</lh-text>
</template>
```

`ellipsis` に `true` を渡すと 1 行省略、数値を渡すと行数で切り詰めます（上限 10、複数行省略はインラインの `-webkit-line-clamp` を使用）。

## コピー

```vue
<template>
  <lh-text copyable copy-text="固定テキスト">後ろのボタンを押してコピー</lh-text>
</template>
```

`copyable` はコピーボタンを追加します。クリックでクリップボードに書き込み、一時的に「コピー済み」に切り替わると同時に `copy` イベントを発火します（引数は実際に書き込まれたテキスト）。

::: tip ミニプログラム端のコピー
H5 は `copy-text` 未指定時にスロットのテキストを自動取得します。**ミニプログラム端はコンポーネントがスロットのテキストを読めないため、`copy-text` の受け渡しが必須**です。渡さない場合書き込まれません（クリック自体は `copy` イベントを発火します）。ラベルは言語パッケージ `text.copy` / `text.copied` から取得し、`copy-label` で上書きできます。
:::

## Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| level | 見出しレベルと段落形態 | `'h1' \| ... \| 'h6' \| 'p' \| 'caption'` | `'p'` |
| type | 意味色 | `'default' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | `'default'` |
| strong / italic / underline / mark / code / disabled | 真偽値の修飾 | `boolean` | `false` |
| ellipsis | 省略：`true` は 1 行、数値は行数 | `boolean \| number` | `false` |
| copyable | コピーボタンを追加 | `boolean` | `false` |
| copyLabel | コピーボタンのアクセシビリティ名 | `string` | — |
| copyText | コピーするテキスト（ミニプログラム端は必須） | `string` | — |
| customClass | カスタムクラス名 | `string` | — |
| sx | クイックレイアウトプロパティ | `LhSxProps` | — |

## Events

| イベント | 説明 | コールバックパラメータ |
| --- | --- | --- |
| copy | コピーボタンクリック | `(text: string)` |

## プラットフォーム差異

| 能力 | H5 | ミニプログラム |
| --- | --- | --- |
| 描画の担い手 | view（組版は `lh-text--<level>` クラスが担う） | 同 H5 |
| コピー | `copy-text` 未指定時にスロットのテキストを自動取得（`navigator.clipboard`） | `copy-text` 必須、`uni.setClipboardData` を使用（システムの提示あり） |
