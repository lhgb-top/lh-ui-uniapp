# Empty 空の状態

データが空のときのプレースホルダー表示で、水墨のイラストを備えています。

## 基本的な使い方

```vue
<template>
  <lh-empty />
</template>
```

`description` を渡さない場合は言語パッケージの `empty.description`（中国語では「暂无数据」）を使用し、ConfigProvider の言語を切り替えると自動で追随します。

## カスタム文言

```vue
<template>
  <lh-empty description="墨痕未干，暂无可览之物" />
</template>
```

## カスタム画像

```vue
<template>
  <lh-empty image="https://placeholder.invalid/empty.png" description="空空如也" />
</template>
```

## スロットによる自前描画

デフォルトスロットはデフォルトのイラストを完全に置き換えられます（`image` を渡した場合はデフォルトのイラストもレンダリングされません）。

```vue
<template>
  <lh-empty description="暂无收藏">
    <view class="my-illustration">🎨</view>
  </lh-empty>
</template>
```

## Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| description | 空状態の説明文言（渡さない場合は言語パッケージの empty.description を使用） | `string` | — |
| image | カスタム画像 URL（デフォルトのイラストを代替） | `string` | — |
| customClass | カスタムクラス名 | `string` | — |
| sx | クイックレイアウトプロパティ | `LhSxProps` | — |

## Slots

| スロット | 説明 |
| --- | --- |
| default | 自前描画のイラスト（渡すとデフォルトのイラストを代替） |

::: tip ミニプログラム端のデフォルトイラスト
H5 はインライン `<svg>` のイラストを保持します（テーマ着色も完全に保たれます）。ミニプログラムは svg 非対応のため、デフォルトイラストは CSS 描画の簡略版に切り替え、色はテーマ変数から取り、明暗モードに自動で適応します。
:::
