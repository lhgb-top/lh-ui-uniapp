# Breadcrumb パンくず

現在のページのパスを表示し、任意の一つ前のページへ素早く戻れるようにします。

## 基本的な使い方

```vue
<template>
  <lh-breadcrumb separator="/">
    <lh-breadcrumb-item>ホーム</lh-breadcrumb-item>
    <lh-breadcrumb-item>コンポーネント</lh-breadcrumb-item>
    <lh-breadcrumb-item>パンくず</lh-breadcrumb-item>
  </lh-breadcrumb>
</template>
```

## クリック可能な遷移項

末項以外に `to` を渡すとリンクとして描画され、クリックで `uni.navigateTo` により遷移します（url は `/` で始まるページパスである必要があります）。

```vue
<template>
  <lh-breadcrumb>
    <lh-breadcrumb-item to="/pages/index/index">ホーム</lh-breadcrumb-item>
    <lh-breadcrumb-item to="/pages/component/index">コンポーネント</lh-breadcrumb-item>
    <lh-breadcrumb-item>パンくず</lh-breadcrumb-item>
  </lh-breadcrumb>
</template>
```

## 折りたたみ

`maxItems` が表示項目数の上限（省略記号を含む）を制御します。超えると先頭項目 + 省略記号 + 末尾数項を残し、省略記号をクリックするとすべて展開されます。

```vue
<template>
  <lh-breadcrumb :max-items="3">
    <lh-breadcrumb-item>ホーム</lh-breadcrumb-item>
    <lh-breadcrumb-item>イベント</lh-breadcrumb-item>
    <lh-breadcrumb-item>一覧</lh-breadcrumb-item>
    <lh-breadcrumb-item>詳細</lh-breadcrumb-item>
    <lh-breadcrumb-item>レビュー</lh-breadcrumb-item>
  </lh-breadcrumb>
</template>
```

## Breadcrumb Props

| Prop | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| separator | 区切り文字 | `string` | `'/'` |
| maxItems | 表示項目数の上限（先頭 + 省略記号 + 末尾数項）。超えると折りたたまれる。`0` は折りたたみなし | `number` | `0` |
| customClass | カスタムクラス名 | `string` | — |
| sx | レイアウト省略記法 | `LhSxProps` | — |

## BreadcrumbItem Props

| Prop | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| to | 遷移先アドレス。設定され、かつ末項でなければリンクとして描画され、クリックで `uni.navigateTo` が呼ばれる | `string` | — |
| customClass | カスタムクラス名 | `string` | — |

## Slots

| Slot | 説明 |
| --- | --- |
| default | パンくず項のテキスト内容 |

::: tip Vue3 版との違い
- `to` は vue-router を使わない（uni-app プロジェクトに router はない）：常に `uni.navigateTo`。H5 では uni の H5 ルーティング戦略に従う。
- `<nav>/<ol>/<li>` は `<view>` に置き換える（WXSS はタグセレクタを禁じる）。`aria-current="page"` と `aria-label` は維持される。
- 折りたたみ / 省略記号のロジックは share core の純関数をそのまま利用し、plus と同じ挙動。
:::
