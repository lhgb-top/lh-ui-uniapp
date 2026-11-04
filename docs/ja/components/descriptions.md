# Descriptions 説明リスト

オブジェクトの属性一覧を表示します。列数、列またぎり（span）、罫線モードに対応します。項目データは `items` で渡し（`LhDescriptionsItem` は `@lh-ui/share` core が提供する項目型）、内容はスコープ付きスロットで上書きできます。

## 基本的な使い方

```vue
<template>
  <lh-descriptions
    title="藏品档案"
    :column="2"
    :items="[
      { label: '名称', value: '青花纏枝蓮紋瓶' },
      { label: '年代', value: '明永楽' },
      { label: '类别', value: '磁器' },
      { label: '級別', value: '一級文物' },
    ]"
  />
</template>
```

## 列数と列またぎり

`column` が 1 行の項目数を、各項目の `span` がまたぐ列数を制御します。`span` が行の残り幅を超える場合は自動的にクランプされ、最終行が足りない場合は自動で埋められます（埋め合わせセルは `aria-hidden`、装飾のみ）。

```vue
<template>
  <lh-descriptions
    :column="3"
    :items="[
      { label: '名称', value: '千里江山図', span: 2 },
      { label: '年代', value: '北宋' },
      { label: '作者', value: '王希孟' },
      { label: '材質', value: '絹本設色' },
      { label: '蔵地', value: '北京故宮博物院' },
    ]"
  />
</template>
```

## 罫線モード

`border` でテーブル罫線を有効にします（罫線モードでは行間がゼロになり、セルの罫線でテーブルを形成します）。

```vue
<template>
  <lh-descriptions
    :column="2"
    border
    :items="[
      { label: '名称', value: '蘭亭序' },
      { label: '作者', value: '王羲之' },
      { label: '年代', value: '東晋' },
      { label: '書体', value: '行書' },
    ]"
  />
</template>
```

## タイトルと内容のカスタマイズ

`title` スロットがタイトル部を上書きします。`item-<index>` スコープ付きスロットが対応する項目の内容を上書きします（`index` は項目が属する行内のセル番号、スコープは `{ item }` を提供）。

```vue
<template>
  <lh-descriptions :column="2" :items="items">
    <template #title>
      <text>藏品档案（スロットタイトル）</text>
    </template>
    <template #item-1="{ item }">
      <lh-tag type="success">{{ item.value }}</lh-tag>
    </template>
  </lh-descriptions>
</template>

<script setup lang="ts">
const items = [
  { label: 'ステータス', value: '進行中' },
  { label: '進捗', value: '鑑定済み' },
]
</script>
```

## Props

| Prop | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| title | リストのタイトル | `string` | — |
| column | 1 行あたりの項目数 | `number` | `3` |
| border | 罫線を表示するか | `boolean` | `false` |
| items | 項目リスト。label / value / span の 3 要組 | `[LhDescriptionsItem](#lhdescriptionsitem-型)`[] | `() => []` |
| customClass | カスタムクラス名 | `string` | — |
| sx | レイアウト簡易記法 | `LhSxProps` | — |

## LhDescriptionsItem（型）

`@lh-ui/share` core 由来（`LhDescriptionsItem`）。本リポジトリでは再定義しません。

| Prop | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| label | 項目ラベル | `string` | — |
| value | 項目内容（スコープ付きスロットでも渡せる） | `string \| number` | — |
| span | 占める列数。超過時はクランプ | `number` | `1` |

## Slots

| Slot | 説明 | スコープ |
| --- | --- | --- |
| title | カスタムタイトル | — |
| item-\<index\> | 項目の内容を上書き（index は行内のセル番号） | `{ item }` |

## プラットフォームの違い

- 純表示コンポーネントでプラットフォーム API を一切使わず、H5 と WeChat ミニプログラムで挙動は完全に一致します。`items` / `column` / `border` / `span` の挙動は Vue3 版と同じです。
- Vue3 版は `<dl>/<dt>/<dd>` のセマンティックタグを使いますが、本リポジトリでは `<view>` に置き換えます（WXSS はタグセレクタを禁止、クラス名でスタイルを適用）。行レイアウトはインライン `flex` とパーセント `flex-basis` で支え、幅の計算式は Vue3 版と同一です。
- 罫線モードのテーブル線は `@lh-ui/share` の styles ソースから提供され、`build-styles` の浄化を経てミニプログラムでも利用可能です（浄化産物にはクラスセレクタとプロパティのみ含まれ、WXSS ホワイトリストに準拠）。
- 行構造の集約（span の正規化・クランプ・折り返し・埋め合わせ）はすべて `@lh-ui/share` の `buildDescriptionRows` 純関数が産出し、本リポジトリはリアクティブな接着剤だけを書き、core の実装をコピーしません。
