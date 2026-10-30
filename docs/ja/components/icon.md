# Icon アイコン

::: tip ミニプログラム端はフォントレンダリング
Web 版（plus）はインライン `<svg><path>` を使いますが、ミニプログラムは **`<svg>` タグに対応していません**。
本ライブラリはビルド時に share の SVG path 集合を iconfont フォントへ変換し（base64 を
`iconfont.css` に埋め込み）、コンポーネントは `<text class="lh-iconfont lh-iconfont--<name>">` をレンダリングします。
色は CSS の `color` を使用し（**`fill` / `stroke` は使用できません**）、Web 版の `currentColor` セマンティクスを完全に代替します。
:::

## 基本的な使い方

```vue
<template>
  <lh-icon name="search" />
  <lh-icon name="loading" size="24" color="#1677ff" />
  <lh-icon name="star" size="1.5em" />
</template>
```

## Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| name | アイコン名（share の `LH_ICON_SVGS_CONST` のキー） | `LhIconName` | — |
| size | サイズ（数値は px。文字列はそのまま透過、例：`'1.5em'`） | `string \| number` | — |
| color | 色（Web 版の `currentColor` を代替） | `string` | — |
| customClass | カスタムクラス名（ルートノードに透過） | `string` | — |
| themeVars | コンポーネントレベルのテーマ変数 | `Record<string, string>` | — |
| bgPattern | コンポーネントレベルの背景紋様 | `string` | — |

## アイコン一覧

全部で 37 個のアイコン（24×24 単色、単一 path）で、すべて `@lh-ui/share` の `LH_ICON_SVGS_CONST` に由来します。
ビルドコマンド `pnpm build:iconfont` がフォントとコードポイントのマッピング（`src/icon/icon-map.ts`）を再生成します。

::: warning フォントスタイルのインポートを忘れずに
利用側は `@lh-ui/uniapp/src/icon/iconfont.css` をインポートする必要があります。そうしないとアイコンは空白の四角として表示されます。
:::
