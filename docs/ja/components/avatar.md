# Avatar アバター

ユーザーや物事のアバターを表示します。画像、アイコン、テキストの 3 つの形態をサポートします。

## 基本的な使い方

```vue
<template>
  <lh-avatar src="https://placeholder.invalid/avatar.png" />
  <lh-avatar icon="user" />
  <lh-avatar text="水墨" />
</template>
```

## 形状とサイズ

```vue
<template>
  <lh-avatar text="水" shape="circle" />
  <lh-avatar text="墨" shape="square" />
  <lh-avatar text="小" size="small" />
  <lh-avatar text="大" size="large" />
</template>
```

## クロップモード

`fit` は uni の `<image>` の `mode` にマッピングされます：`fill` → `scaleToFill`、`contain` → `aspectFit`、`cover` → `aspectFill`、`none` → `center`。

```vue
<template>
  <lh-avatar src="https://placeholder.invalid/avatar.png" fit="cover" />
  <lh-avatar src="https://placeholder.invalid/avatar.png" fit="contain" />
</template>
```

::: tip scale-down は近似です
uni には `scale-down` と等価な mode がないため、セマンティクスが最も近い `aspectFit` を使います（比率を保って全体を表示し、拡大はしない）。
:::

## 読み込み失敗時のフォールバック

画像の読み込みに失敗した場合は「アイコン → テキスト → 空」の順にフォールバックし、`error` イベントを発火します。

```vue
<template>
  <lh-avatar
    src="https://placeholder.invalid/broken.png"
    icon="user"
    alt="アバター"
    @error="onError"
  />
</template>

<script setup lang="ts">
const onError = () => console.log('画像の読み込みに失敗しました')
</script>
```

## Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| src | 画像アドレス。空の場合は順にアイコン、テキストへフォールバック | `string` | — |
| alt | 画像読み込み失敗時の代替テキスト。同時にアクセシビリティ名としても機能 | `string` | — |
| icon | アイコン名（src が空または読み込み失敗時に表示） | `LhIconName` | — |
| text | テキストアバターの内容（src と icon の両方が未指定のときは先頭の 1 文字を表示） | `string` | — |
| shape | 形状 | `'circle' \| 'square'` | `'circle'` |
| size | サイズ | `'small' \| 'medium' \| 'large'` | `'medium'` |
| fit | 画像クロップモード（uni image の mode にマッピング） | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'cover'` |
| customClass | カスタムクラス名 | `string` | — |
| sx | クイックレイアウトプロパティ | `LhSxProps` | — |

## Events

| イベント | 説明 | コールバックパラメータ |
| --- | --- | --- |
| error | 画像の読み込みに失敗 | `(e: Event)` |
