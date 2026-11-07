# Result 結果

フィードバックフローの終点を示す結果表示で、ステータスアイコンと配色を備えています。

## 基本的な使い方

```vue
<template>
  <lh-result
    status="success"
    title="送信成功"
    sub-title="作業オーダーは次のステップに進みました"
  />
</template>
```

4 つのステータス：`success` / `warning` / `error` / `info`（デフォルト `info`）。それぞれデフォルトアイコンと配色を持ち、無効なステータス値は `info` にフォールバックします。

## カスタムアイコン

```vue
<template>
  <lh-result
    icon="like"
    :icon-size="48"
    title="いいね・お気に入り"
  />
</template>
```

`icon` に空文字 `""` を渡すとアイコンを描画しません。未指定時はステータスのデフォルトアイコンが使われます。

## スロット

```vue
<template>
  <lh-result status="success">
    <template #subTitle> カスタムサブタイトル </template>
    <template #extra>
      <lh-button type="primary" size="small">ホームに戻る</lh-button>
    </template>
  </lh-result>
</template>
```

`title` / `subTitle` / `extra` の 3 つのスロットはいずれも同名 prop を上書きします。

## Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| status | 結果ステータス | `'success' \| 'warning' \| 'info' \| 'error'` | `'info'` |
| icon | カスタムアイコン名（ステータスのデフォルトアイコンを上書き、空文字は描画しない） | `string` | — |
| iconSize | アイコンサイズ | `string \| number` | `64` |
| title | タイトル | `string` | — |
| subTitle | サブタイトル | `string` | — |
| customClass | カスタムクラス名 | `string` | — |
| sx | クイックレイアウトプロパティ | `LhSxProps` | — |

## Slots

| スロット | 説明 |
| --- | --- |
| title | タイトル（title prop を上書き） |
| subTitle | サブタイトル（subTitle prop を上書き） |
| extra | 下部の操作領域 |
