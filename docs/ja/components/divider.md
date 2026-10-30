# Divider 区切り線

異なる内容を区切る区切り線で、テキスト付きのグループセマンティクスをサポートします。

## 基本的な使い方

```vue
<template>
  <view>上のテキスト</view>
  <lh-divider />
  <view>下のテキスト</view>
</template>
```

## テキスト付き

```vue
<template>
  <lh-divider>水墨</lh-divider>
  <lh-divider label-position="left">左揃え</lh-divider>
  <lh-divider label-position="right">右揃え</lh-divider>
</template>
```

## 破線とボーダースタイル

```vue
<template>
  <lh-divider dashed />
  <lh-divider border-style="dotted" />
</template>
```

`borderStyle` は `dashed` より優先されます。`dashed` / `dotted` のみに対応するスタイルがあり、それ以外の値はデフォルトの実線でレンダリングされます。

## 垂直方向

```vue
<template>
  <lh-space>
    <span>水墨</span>
    <lh-divider direction="vertical" />
    <span>留白</span>
  </lh-space>
</template>
```

::: tip 垂直方向の高さ
垂直の区切り線は `inline-block` で、flex 行内では `align-self: stretch` によって親の高さまで伸びます。単独でブロックレベル
コンテナに置くと高さは `1em` しかなく、flex 行内で使うのが直感に合います。
:::

## 垂直＋テキスト付き

垂直方向でもテキストをサポートします。線分はテキストの上下に配置され、ロールは `role="separator"` に昇格し、
`aria-orientation="vertical"` を宣言します。

```vue
<template>
  <view class="vertical-text-row">
    <text>上</text>
    <lh-divider direction="vertical">水墨</lh-divider>
    <text>下</text>
  </view>
</template>

<style>
.vertical-text-row {
  display: flex;
  align-items: center;
  height: 120px;
}
</style>
```

::: tip 垂直テキストの高さは親の行から
垂直＋テキスト付きの区切り線は親の行の `align-self: stretch` によって高さを得て、線分が伸びます —— 親コンテナは
確定した高さを持つ flex 行（上例の `height: 120px`）である必要があります。ブロックレベルの親コンテナでは、線分は最小長の 12px しか残りません。
:::

::: tip labelPosition は垂直方向では無効
`label-position` は水平方向の左右整列のセマンティクスです。垂直方向のテキストは常に中央揃えで、修飾クラスを生成しません。
:::

## Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| direction | 方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| dashed | 破線にするか | `boolean` | `false` |
| labelPosition | テキスト付きの場合の整列位置（水平方向で有効、垂直は常に中央） | `'left' \| 'center' \| 'right'` | `'center'` |
| borderStyle | ボーダースタイル（dashed より優先） | `string` | — |
| customClass | カスタムクラス名 | `string` | — |
| sx | クイックレイアウトプロパティ | `LhSxProps` | — |

## Slots

| スロット | 説明 |
| --- | --- |
| default | 区切り線のテキスト（水平方向は左右、垂直方向は上下に配置） |
