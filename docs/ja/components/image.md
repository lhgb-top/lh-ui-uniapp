# Image 画像

読み込み失敗時のプレースホルダー付き画像コンポーネント。タップでプレビュー可能
（`uni.previewImage` ネイティブ API を使用、全プラットフォームで利用可）。
フィットモードは uni `<image>` の `mode` にマッピングされ、遅延読み込みは
コンポーネント内蔵の `lazy-load` を使用します。プレビューリストの正規化と
状態クラス名は `@lh-ui/share` core の純粋関数から生成されます。

## 基本的な使い方

```vue
<template>
  <lh-image src="https://picsum.photos/240/140" alt="サンプル画像" :sx="{ w: '240px', h: '140px' }" />
</template>
```

`alt` は TS レベルで必須です。uni `<image>` のデフォルトサイズは 320×240 のため、
サイズは `sx` の `w` / `h`（または style）で明示してください。角丸は share スタイルソースに
内蔵（`--lh-border-radius-small`）されており、設定は不要です。

## フィットモード

`fit` は CSS object-fit のセマンティクスを表し、uni `<image>` の `mode` にマッピングされます：
`contain` → `aspectFit`、`cover` → `aspectFill`、`fill` → `scaleToFill`。

```vue
<template>
  <lh-image src="https://picsum.photos/240/140" alt="カバー切り抜き" fit="cover" :sx="{ w: '110px', h: '80px' }" />
  <lh-image src="https://picsum.photos/240/140" alt="全体表示" fit="contain" :sx="{ w: '110px', h: '80px' }" />
  <lh-image src="https://picsum.photos/240/140" alt="引き伸ばし" fit="fill" :sx="{ w: '110px', h: '80px' }" />
</template>
```

::: tip none / scale-down は近似マッピング
`none` は `center` にマッピングされます（拡大縮小なしで中央部分のみ表示、
object-fit: none と同じセマンティクス）。uni には `scale-down` に相当する `mode` がないため、
意味的に最も近い `aspectFit` を使用します（lh-avatar と同じ逸脱登録）。
:::

## 遅延読み込み

`lazy` で uni `<image>` 内蔵の `lazy-load` を有効にします（ビューポートに入った時点で読み込み）。

```vue
<template>
  <scroll-view scroll-y style="height: 140px; width: 100%">
    <lh-image
      v-for="i in 4"
      :key="i"
      :src="`https://picsum.photos/240/120?random=${i}`"
      :alt="`遅延読み込み画像 ${i}`"
      lazy
      :sx="{ w: '240px', h: '120px', mb: 1 }"
    />
  </scroll-view>
</template>
```

WeChat では `lazy-load` は page と scroll-view 配下の image にのみ有効です。

## 読み込み失敗

読み込みに失敗すると失敗プレースホルダーに切り替わり（ルートノードに `lh-image--error` を追加）、
デフォルトの文言は言語パックの `image.error`（9 言語対応）を使います。`error` スロットで
カスタマイズも可能です。同時に `error` イベントを発火します。

```vue
<template>
  <lh-image src="https://invalid.example.com/not-found.png" alt="デフォルトの失敗プレースホルダー" :sx="{ w: '240px', h: '140px' }" />
  <lh-image src="https://invalid.example.com/not-found.png" alt="カスタム失敗プレースホルダー" :sx="{ w: '240px', h: '140px' }">
    <template #error>カスタム失敗プレースホルダー</template>
  </lh-image>
</template>
```

## タップでプレビュー

`preview` を有効にすると、画像をタップして `uni.previewImage` のネイティブプレビューが開きます
（全プラットフォーム利用可）。`preview-src-list` で複数画像のリストを渡せます。未指定の場合は
`[src]` にフォールバックします（plus と同じ正規化、初期インデックスは 0 固定）。

```vue
<template>
  <lh-image
    src="https://picsum.photos/240/140"
    alt="複数画像プレビュー"
    preview
    :preview-src-list="[
      'https://picsum.photos/600/400?random=1',
      'https://picsum.photos/600/400?random=2',
      'https://picsum.photos/600/400?random=3',
    ]"
    :sx="{ w: '240px', h: '140px' }"
  />
  <lh-image src="https://picsum.photos/240/140" alt="単一画像プレビュー" preview :sx="{ w: '140px', h: '140px' }" />
</template>
```

## Props

| プロパティ | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| src | 画像の URL | `string` | — |
| alt | 代替テキスト（a11y 強制、TS レベルで必須） | `string` | — |
| fit | フィットモード（uni image の mode にマッピング） | `'contain' \| 'cover' \| 'fill' \| 'none' \| 'scale-down'` | `'cover'` |
| preview | タッププレビューを有効にするか | `boolean` | `false` |
| preview-src-list | プレビュー画像リスト（未指定時は [src] にフォールバック） | `string[]` | — |
| lazy | 遅延読み込み（uni image ネイティブの lazy-load） | `boolean` | `false` |
| customClass | カスタムクラス名（ルートノードに透過） | `string` | — |
| sx | sx クイックレイアウトプロパティ | `LhSxProps` | — |

## Events

| イベント | 説明 | コールバック引数 |
| --- | --- | --- |
| load | 画像の読み込み成功時に発火 | `(event: Event)` |
| error | 画像の読み込み失敗時に発火（失敗プレースホルダーに切替） | `(event: Event)` |

## Slots

| スロット | 説明 |
| --- | --- |
| error | 読み込み失敗プレースホルダーの内容（デフォルトは言語パックの image.error） |

## プラットフォーム差異

- **プレビューは `uni.previewImage` ネイティブ API を使用**（全プラットフォーム利用可）：
  plus のプレビューは自前描画の Viewer オーバーレイ（body への teleport、拡大 / 回転 /
  複数画像切替 / Esc で閉じる / フォーカストラップ）ですが、ミニプログラムには document がなく
  そのまま移植できません。uniapp 版は `uni.previewImage` を呼び出します——H5 は uni ランタイムが
  オーバーレイを実装し、WeChat はネイティブのプレビューページを使用します。操作性はプラットフォーム
  が提供するため、**マスク透明度 / 閉じるボタン / ツールバーのカスタマイズはできません**。
  plus の `LhImageViewer` 独立コンポーネントは本リポジトリでは提供しません。
- **fit → mode マッピング**：`contain` / `cover` / `fill` は `aspectFit` / `aspectFill` /
  `scaleToFill` にマッピング。`none` は `center` にマッピング。`scale-down` に等価なモードは
  なく、最も近い `aspectFit` を使用します（lh-avatar と同じ逸脱登録）。object-fit の CSS 実装は
  H5 の実際の `<img>` にのみ有効で、uni `<image>` は全プラットフォームで `mode` により制御されます。
- **遅延読み込み**：uni `<image>` 内蔵の `lazy-load`（plus の `loading="lazy"` の代替）。
  WeChat では page と scroll-view 配下の image にのみ有効です。
- **サイズと角丸**：uni `<image>` のデフォルトは 320×240。サイズは `sx` / style で明示します。
  角丸は share スタイルソースの `--lh-border-radius-small` が内蔵です。plus にも
  width / height / radius の prop はなく（サイズは sx、角丸はスタイルソース）、本リポジトリでは
  独自に追加しません。
- **alt**：MP の `<image>` には alt の概念がありません（H5 では属性として透過）。Web の
  `<img alt>` よりアクセシビリティのフォールバックが弱いため、TS レベル必須の制約は維持します。
- **Viewer スタイルの残存**：share スタイルソースには `.lh-image-viewer*` ルール（plus の自前
  オーバーレイ用）が含まれ、スタイル単一ソースの制約により本コンポーネントの style.css 産物に
  入りますが、両プラットフォームとも対応するノードはありません（無害な冗長、WXSS ホワイトリストも
  維持：`:hover` / `:focus` 系は条件コンパイルで H5 のみになっています）。

::: tip Vue3 版との差異
- ロジックの考え方（プレビューリストの正規化、読み込み状態、クラス名）は plus と完全に一致
  （同じ share core）。
- プレビューは自前描画の Viewer オーバーレイから `uni.previewImage` ネイティブ API に変更
  （「プラットフォーム差異」参照）。
- `customClass` prop を追加：uni-app ではカスタムクラス名が styleIsolation を貫通できないため、
  prop で透過します。
- ミニプログラムでの `none` / `scale-down` は近似マッピング（「プラットフォーム差異」参照）。
:::
