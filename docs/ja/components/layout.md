# Layout レイアウトコンテナ

ページレベルの骨組み：`lh-layout` に `lh-header` / `lh-aside` / `lh-main` / `lh-footer` のサブコンポーネントを組み合わせます（easycom ならタグをそのまま記述可能、必要に応じて import する場合は `LhLayout` / `LhHeader` / `LhAside` / `LhMain` / `LhFooter`）。

## 基本的な使い方（ヘッダー / 本文 / フッター）

コンテナには明示的な高さが必要です：`lh-layout` 自身が `flex: 1` のフレックスコンテナであるため、通常のフロー親要素の中では `sx` か外側のスタイルで高さを与えないと、header / main / footer が比率通りに広がりません。

```vue
<template>
  <lh-layout direction="vertical" :sx="{ h: '240px' }">
    <lh-header>ヘッダー</lh-header>
    <lh-main>コンテンツ</lh-main>
    <lh-footer>フッター</lh-footer>
  </lh-layout>
</template>
```

## 並べ方

`direction` が子要素の並び方を明示的に制御します：デフォルトは `horizontal`（横並び）、`lh-aside` が存在すると自動で `vertical` に切り替わり、手動指定も可能です。

```vue
<template>
  <lh-layout direction="horizontal" :sx="{ h: '80px' }">
    <lh-main>横並び</lh-main>
    <lh-main>横並び</lh-main>
  </lh-layout>
  <lh-layout direction="vertical" :sx="{ h: '140px', mt: '12px' }">
    <lh-main>縦積み</lh-main>
    <lh-main>縦積み</lh-main>
  </lh-layout>
</template>
```

## サイドバー付きレイアウト

`lh-aside` が存在すると親は自動的に縦方向に切り替わります（header が上、aside と main が横並び）。

```vue
<template>
  <lh-layout direction="vertical" :sx="{ h: '240px' }">
    <lh-header>ヘッダー</lh-header>
    <lh-layout :sx="{ flex: '1', minHeight: '0px' }">
      <lh-aside :width="140" aria-label="サイドナビゲーション">サイドバー</lh-aside>
      <lh-main>コンテンツ</lh-main>
    </lh-layout>
    <lh-footer>フッター</lh-footer>
  </lh-layout>
</template>
```

`width` は `number`（px 換算）と単位付き `string`（例：`'30%'`）を受け付けます。省略時は `--lh-layout-aside-width`（デフォルト 220px）になります。

## Layout Props

| 属性 | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| direction | 並べ方（Aside が存在すると自動で vertical） | `'horizontal' \| 'vertical'` | `'horizontal'` |
| customClass | カスタムクラス名（ルートノードに転送） | `string` | — |
| sx | sx 簡易レイアウトプロパティ | `LhSxProps` | — |

## Header / Main / Footer Props

| 属性 | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| customClass | カスタムクラス名（ルートノードに転送） | `string` | — |
| sx | sx 簡易レイアウトプロパティ | `LhSxProps` | — |

## Aside Props

| 属性 | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| width | サイドバーの幅 | `number \| string` | — |
| ariaLabel | アクセシブル名（landmark の命名） | `string` | — |
| customClass | カスタムクラス名（ルートノードに転送） | `string` | — |
| sx | sx 簡易レイアウトプロパティ | `LhSxProps` | — |

## Slots

| スロット | 説明 |
| --- | --- |
| default | レイアウト内容（5 つのコンポーネントすべてがデフォルトスロット） |

## プラットフォームの違い

- **純粋な CSS レイアウトコンポーネント**：share core に layout モジュールはなく、ロジック層は provide/inject コンテキスト（Aside が登録されると親が縦方向に切り替え）だけを持ちます。計測もオーバーレイも document 依存もなく、H5 と WeChat ミニプログラムで動作は同一です。
- **タグ置換**：plus 版の `<section>` / `<header>` / `<aside>` / `<main>` / `<footer>` はすべて `view` に置き換えられます（WXSS はタグセレクタを禁止、スタイルは `lh-layout*` クラス名で適用）。
- **landmark セマンティクス**：セマンティックタグが本来持つ landmark role は `role` 属性で補います——header は `banner`、aside は `complementary`、main は `main`、footer は `contentinfo`。複数の `aside` がある場合は `ariaLabel` で区別することを推奨します（例：「サイドナビゲーション」「関連リンク」）。
- **スクロールコンテナ**：`lh-main` と `lh-aside` の `overflow: auto` は H5 では要素自身のスクロールです；**ミニプログラムのページ自体にはスクロール可能な body コンテナがありません**（ページスクロールは `page` ルートノードが担う）。ミニプログラムでページ全体を `lh-main` に直接入れると、要素内スクロールとページスクロールが重複して二重スクロールバーになることがあります。サイドバー付きの全画面レイアウトでは外側に `h: '100vh'` を与えて `lh-main` に自身でスクロールさせるか、必要に応じて内容を `scroll-view` で包んでください。
- **移植結論**：全端末で利用可能、挙動は plus と同一です。留意すべきはミニプログラムにおける「ページレベルスクロール vs 要素レベルスクロール」というコンテナのセマンティクスだけです。

::: tip Vue3 版との違い
- セマンティックタグは `view` と `role` 属性に置き換え（WXSS はタグセレクタを禁止）、アクセシビリティのセマンティクスを維持します。
- サブコンポーネントのタグは easycom の慣例に従い `lh-header` / `lh-aside` / `lh-main` / `lh-footer`（必要に応じて import する場合の対応するコンポーネント名は `LhHeader` など）。
- `customClass` prop を追加：uni-app では通常のクラスが `styleIsolation` を貫通できないため、prop 経由で転送します（plus 版はクラスを直接渡す）。
- 並べ方と、Aside 検出で縦方向に切り替える provide/inject の仕組みは plus と全く同じです。
:::
