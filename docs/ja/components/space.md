# Space 間隔

隣接する要素の間隔をレイアウトするために使い、手書きの margin を置き換えます。間隔は CSS の `gap` に完全に依存しており、両端ともネイティブに対応しています。

## 基本的な使い方

```vue
<template>
  <lh-space>
    <lh-tag>水墨</lh-tag>
    <lh-tag>留白</lh-tag>
    <lh-tag>国风</lh-tag>
  </lh-space>
</template>
```

## 方向

```vue
<template>
  <lh-space direction="vertical">
    <lh-tag>水墨</lh-tag>
    <lh-tag>留白</lh-tag>
  </lh-space>
</template>
```

## 間隔の段階

プリセットの段階は spacing token を参照します（`--lh-spacing-*` でカスタマイズ可能）。数値は px として扱われ、配列は水平方向と垂直方向の間隔をそれぞれ制御します。

```vue
<template>
  <lh-space size="small">
    <lh-tag>小</lh-tag>
    <lh-tag>小</lh-tag>
  </lh-space>
  <lh-space size="medium">
    <lh-tag>中</lh-tag>
    <lh-tag>中</lh-tag>
  </lh-space>
  <lh-space size="large">
    <lh-tag>大</lh-tag>
    <lh-tag>大</lh-tag>
  </lh-space>
  <lh-space :size="24">
    <lh-tag>24px</lh-tag>
    <lh-tag>24px</lh-tag>
  </lh-space>
  <lh-space :size="[8, 16]">
    <lh-tag>水平 8</lh-tag>
    <lh-tag>垂直 16</lh-tag>
  </lh-space>
</template>
```

## 整列と折り返し

```vue
<template>
  <lh-space alignment="center">
    <lh-tag>中央揃え</lh-tag>
    <lh-button type="primary" size="small">ボタン</lh-button>
  </lh-space>
  <lh-space :wrap="true">
    <lh-tag v-for="i in 20" :key="i">タグ{{ i }}</lh-tag>
  </lh-space>
</template>
```

::: tip 折り返しは水平方向でのみ有効
`wrap` は `direction="horizontal"` の場合のみ意味を持ち、垂直方向で渡しても無視されます。
:::

## Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| direction | 並べる方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| size | 間隔：プリセットの段階 / ピクセル数値 / [水平, 垂直] | `'small' \| 'medium' \| 'large' \| number \| [number, number]` | `'medium'` |
| wrap | 折り返しを許可するか（水平方向のみ） | `boolean` | `true` |
| alignment | 整列方式 | `'start' \| 'center' \| 'end' \| 'baseline'` | `'start'` |
| customClass | カスタムクラス名 | `string` | — |
| sx | クイックレイアウトプロパティ | `LhSxProps` | — |

## Slots

| スロット | 説明 |
| --- | --- |
| default | 間隔を配置する対象の子要素 |
