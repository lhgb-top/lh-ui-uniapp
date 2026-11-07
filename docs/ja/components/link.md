# Link リンク

意味的类型、下線の形状、前後にアイコンを置くスロットをサポートするテキストハイパーリンク。

## 基本的な使い方

```vue
<template>
  <lh-link>デフォルトリンク</lh-link>
  <lh-link type="primary">メインリンク</lh-link>
</template>
```

`type`：`default`（デフォルト）/ `primary` / `success` / `warning` / `danger` / `info`。

## 下線

```vue
<template>
  <lh-link underline="always">常に表示</lh-link>
  <lh-link underline="none">なし</lh-link>
</template>
```

`underline`：`always` 常に表示 / `hover` ホバー時に表示（デフォルト）/ `none` なし。

## 無効化と前後のアイコン

```vue
<template>
  <lh-link disabled>無効リンク</lh-link>
  <lh-link>
    <template #prefix><lh-icon name="left" /></template>
    前のページ
  </lh-link>
</template>
```

## Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| href | リンク先（disabled 時は href を描画しない） | `string` | — |
| target | ターゲットウィンドウ（H5 のみ） | `string` | — |
| type | リンクの意味的类型 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| underline | 下線の形状 | `'always' \| 'hover' \| 'none'` | `'hover'` |
| disabled | 無効 | `boolean` | `false` |
| current | 現在ページのマーカー（`aria-current` を出力） | `'page' \| 'location' \| true` | — |
| customClass | カスタムクラス名 | `string` | — |
| sx | クイックレイアウトプロパティ | `LhSxProps` | — |

## Slots

| スロット | 説明 |
| --- | --- |
| default | リンクテキスト |
| prefix | 前置きアイコン枠 |
| suffix | 後置きアイコン枠 |

## Events

| イベント | 説明 | コールバックパラメータ |
| --- | --- | --- |
| click | クリック | `(event: Event)` |

## プラットフォーム差異

| 能力 | H5 | ミニプログラム |
| --- | --- | --- |
| 載体 | view + `@click` | 同 H5（`href` / `target` にナビゲーション意味はなく、遷移は `click` イベントで業務側が処理） |
| ホバー下線 | あり | なし（`underline="always"` / `"none"` は有効、VIEW の下線描画は実際の表示次第） |
