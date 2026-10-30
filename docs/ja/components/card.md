# Card カード

情報を集約するコンテナで、カバー、ヘッダー、本文、フッター、読み込み中プレースホルダーをサポートします。

## 基本的な使い方

```vue
<template>
  <lh-card title="水墨">
    <view>カードの内容</view>
  </lh-card>
</template>
```

## カバーとフッター

```vue
<template>
  <lh-card title="山水画帖">
    <template #cover>
      <image class="cover" src="https://placeholder.invalid/cover.png" mode="aspectFill" />
    </template>
    <view>カードの内容</view>
    <template #footer>
      <view>フッターの操作</view>
    </template>
  </lh-card>
</template>
```

::: tip カバー内の子要素は幅を自分で指定する必要があります
share の「カバーの子要素を幅いっぱいに広げる」ルール（`.lh-card__cover > *`）は WXSS が非対応のワイルドカードセレクタに依存しており、精製パイプラインがこれを破棄します。ミニプログラム端では、カバー内の `<image>` などの子要素に明示的に幅を書いてください（例：`width: 100%`）。
:::

## ヘッダー右側の操作エリア

`extra` スロットはタイトルの右側にレンダリングされ、`title` または `header` スロットが存在する場合にのみ現れます。

```vue
<template>
  <lh-card title="注文">
    <template #extra>
      <lh-button size="small" text>もっと見る</lh-button>
    </template>
    <view>カードの内容</view>
  </lh-card>
</template>
```

## 影とクリック可能

```vue
<template>
  <lh-card shadow="hover" clickable @click="onClick">
    <view>ホバーで浮き上がり、クリックでイベントを発火</view>
  </lh-card>
</template>

<script setup lang="ts">
const onClick = () => console.log('カードをクリック')
</script>
```

## 読み込み中プレースホルダー

```vue
<template>
  <lh-card title="水墨" loading>
    <view>コンテンツの読み込み中はレンダリングしない</view>
  </lh-card>
</template>
```

## Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| title | カードのタイトル（header スロットでも可） | `string` | — |
| shadow | 影を表示するタイミング | `'always' \| 'hover' \| 'never'` | `'always'` |
| clickable | カード全体をクリック可能に（button のキーボードセマンティクスを担う） | `boolean` | `false` |
| loading | 読み込み状態：コンテンツエリアをスケルトンでプレースホルダー表示 | `boolean` | `false` |
| themeVars | コンポーネントレベルのテーマ変数（キーには自動で `--lh-` 接頭辞が付く） | `Record<string, string>` | — |
| bgPattern | 紋様背景の URL（例：`var(--lh-pattern-willow)`）。グローバルのホワイトリストの制限を受けない | `string` | — |
| customClass | カスタムクラス名 | `string` | — |
| sx | クイックレイアウトプロパティ | `LhSxProps` | — |

## Events

| イベント | 説明 | コールバックパラメータ |
| --- | --- | --- |
| click | カード全体のクリック（`clickable` のときのみ発火） | `(e: Event)` |

## Slots

| スロット | 説明 |
| --- | --- |
| cover | カバー |
| header | ヘッダー（title より優先） |
| extra | ヘッダー右側の操作エリア（ヘッダーの存在に依存） |
| default | 本文の内容 |
| footer | フッター |

::: tip キーボードによる起動は H5 のみ
`clickable` のカードは H5 で Enter / Space によるキーボード起動をサポートします（APG button pattern に準拠）。ミニプログラムにはキーボードイベントがなく、この処理は条件コンパイルにより MP 端で取り除かれます。
:::
