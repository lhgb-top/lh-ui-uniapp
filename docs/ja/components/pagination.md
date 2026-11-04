# Pagination ページネーション

ページ送りナビゲーション：前へ / ページ番号 / 省略記号 / 次へ / 総件数 / 件数切り替え / ページジャンプ。
ページウィンドウの収縮アルゴリズム（最初と最後のページを常に表示、現在ページの両側に隣接ページを
表示、実際に隙間が生じたときだけ省略記号を出力）は `@lh-ui/share` core 層の純粋関数で実装されています。

## 基本的な使い方

`total` はデータの総件数（必須）です。デフォルトは 1 ページ 10 件です。

```vue
<template>
  <lh-pagination :total="120" />
</template>
```

## 総件数と件数切り替え

`show-total` で総件数を表示し、`show-size-changer` でページあたりの件数切り替えを表示します
（uni 端では内蔵 picker で担います）。

```vue
<template>
  <lh-pagination :total="480" show-total show-size-changer />
</template>
```

## ページジャンプ

`show-jumper` でジャンプ入力を表示します。ページ番号を入力して Enter（confirm）または
フォーカスアウトで確定し、範囲外は自動的にクランプされます。

```vue
<template>
  <lh-pagination :total="480" show-total show-jumper />
</template>
```

## シンプルモード

`simple` でページ番号エリアを畳み、「現在ページ / 総ページ数」のみ表示します。

```vue
<template>
  <lh-pagination :total="480" simple show-jumper />
</template>
```

## 制御（受控）用法

現在ページは `v-model:current` で制御します。

```vue
<template>
  <lh-pagination v-model:current="page" :total="95" />
  <text>現在ページ：{{ page }}</text>
</template>

<script setup>
import { ref } from 'vue'
const page = ref(2)
</script>
```

## ページあたりの件数と無効化

`v-model:page-size` でページあたりの件数を制御し、`page-sizes` で件数の選択肢をカスタマイズします。
件数変更後に現在ページが範囲外になると自動的にクランプされます。`disabled` で全体を無効化します。

```vue
<template>
  <lh-pagination
    v-model:page-size="pageSize"
    :total="480"
    show-size-changer
    :page-sizes="[10, 20, 50, 100]"
  />
  <text>ページあたりの件数：{{ pageSize }}</text>
  <lh-pagination :total="480" disabled />
</template>

<script setup>
import { ref } from 'vue'
const pageSize = ref(20)
</script>
```

## Props

| プロパティ | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| total | データの総件数（必須） | `number` | — |
| pageSize | ページあたりの件数（`update:pageSize` イベントで制御） | `number` | `10` |
| current | 現在ページ（`v-model:current`） | `number` | — |
| pageSizes | ページあたりの件数の選択肢 | `number[]` | `[10, 20, 30, 40]` |
| showTotal | 総件数を表示するか | `boolean` | `false` |
| showSizeChanger | 件数切り替えを表示するか | `boolean` | `false` |
| showJumper | ジャンプ入力を表示するか | `boolean` | `false` |
| simple | コンパクトモード | `boolean` | `false` |
| disabled | 無効化するか | `boolean` | `false` |
| sx | クイックレイアウト属性 | `LhSxProps` | — |

## Events

| イベント名 | 説明 | コールバック引数 |
| --- | --- | --- |
| update:current | 現在ページが変わったとき（`v-model:current` と併用） | `(page: number)` |
| update:pageSize | ページあたりの件数が変わったとき（`v-model:page-size` と併用） | `(size: number)` |
| change | 現在ページが変わったとき（ページ番号 / 前後 / ジャンプすべてで発火） | `(page: number)` |
| size-change | ページあたりの件数が変わったとき | `(size: number)` |

## アクセシビリティ

- ルートノードは `role="navigation"` + `aria-label="pagination"`
- 現在ページのボタンには自動で `aria-current="page"` が設定され、各ページ番号ボタンと
  前へ / 次へボタンには個別の `aria-label` が付きます（言語パックの `pagination.page` / `prev` /
  `next` を使用）。記号のみの「‹」「›」は `aria-hidden` で隠します
- ページ番号ボタンと前後ボタンは `role="button"` で、無効時は `aria-disabled` を出力します
- 省略記号は純粋な表示用の `aria-hidden` 要素で、読み上げの妨げになりません

## プラットフォーム差異

- **view によるタッチ操作で全プラットフォーム利用可**：Vue 3 版の `<nav>` / `<button>` /
  `<ul>` / `<span>` は本ライブラリでは `<view>` / `<text>` に置き換わります（WXSS はタグ
  セレクタを禁止しているためクラス名でスタイルを付けます）。ページ番号と前後の切り替えは
  `@click` で発火し、H5 と WeChat ミニプログラムで挙動が一致します。
- **ページ溢れの省略ロジックは core**：ウィンドウ収縮アルゴリズム（最初と最後のページを常に表示、
  現在ページの両側に 1 ページずつ表示、足りないときは端に寄せ、実際に隙間が生じたときだけ
  省略記号を出力）は `@lh-ui/share` core の純粋関数 `getPaginationRange` で、クランプの
  `clampPage` と総ページ数の `getPageCount` も core から提供されます。リポジトリ側は
  リアクティブなグルーだけを書きます。
- **件数切り替えは内蔵 picker で担う**：uni には `<select>` がないため、`show-size-changer` は
  uni 内蔵の `<picker mode="selector">` で担い、選択肢は `page-sizes` です。change イベントの
  値は `event.detail.value`（選択肢のインデックス）に入ります。H5 では uni のセレクターパネルが、
  ミニプログラムではネイティブのホイールセレクターが開きます。
- **ジャンプ入力の確定タイミングが異なる**：uni の input にはネイティブの change イベントがないため、
  確定は Enter（confirm — H5 の Enter とミニプログラムキーボードの「完了」の両方で発火）または
  フォーカスアウト（blur）時にまとめて行われ、入力イベントの値は `event.detail.value` から
  取得します（lh-input-number と同じ先例）。ネイティブの `min` / `max` 属性は透過せず、
  ページ番号は常に core の `clampPage` でクランプされます。Vue 3 版は「入力後に空にして
  フォーカスアウト」すると 1 ページ目に戻りますが、本ライブラリはジャンプしないよう
  厳格化しています（空文字列と不正な数値はイベントを発火しません）。
- **無効外観はクラス名でフォールバック**：share スタイルソースの無効スタイルは
  `&:disabled` 疑似クラス（button 要素のみに一致）に書かれていますが、view にはこの疑似クラスが
  ないため、同じトークン（`--lh-disabled-text-color`）で `lh-pagination__btn--disabled`
  クラスルールを SFC 内に補っています（lh-segmented / lh-input-number と同じインライン
  フォールバックの先例で、浄化産物には入りません）。
- **アクセシビリティ属性は個別バインド**：ページボタンの `aria-current` / `aria-label` の契約は
  share の `getPaginationItemAria` が決定しますが、ミニプログラムのテンプレートコンパイラは
  `v-bind` オブジェクトをサポートしないため、グルー層で属性バッグを個別のバインドに展開します。
- **移植結論**：pagination は計測なし / ポップアップなし / document 依存なしの純粋な切り替え
  コンポーネントで、ページ範囲・クランプ・アクセシビリティ属性はすべて `@lh-ui/share` core の
  純粋関数から産出され、リポジトリ側はリアクティブなグルーだけを書きます。API は Vue 3 版と
  完全に一致します（`total` / `pageSize` / `current` / `pageSizes` / `showTotal` /
  `showSizeChanger` / `showJumper` / `simple` / `disabled` / `sx`）。
