# Anchor アンカーナビゲーション

アンカーナビゲーション：クリックすると対応するセクションへジャンプし、スクロールに連動して現在のセクションをハイライトします。フラット化（`flattenAnchorItems`）とアクティブアンカーの判定（`resolveActiveAnchor`）は `@lh-ui/share` の core 純関数由来です。

## プラットフォームの違い（重要）

- **H5**：コンポーネントが自身で `window`（または `target` コンテナ）のスクロールを監視し、アンカーの位置決めはネイティブの `scrollIntoView` を使用します。
- **WeChat ミニプログラム**：スクロール連動には `scroll-view` の `detail.scrollTop` を `scrollTop` プロップ経由で注入する必要があります。アンカーをクリックするとコンポーネントが `update:scrollIntoView`（対象セクションの id）を発火し、これを `scroll-view` の `scroll-into-view` 属性にバインドして位置決めします。`target` を渡していない場合はページレベルの位置決めとなり、コンポーネントは `uni.pageScrollTo({ selector })` を直接呼び出します。

```vue
<template>
  <scroll-view
    class="my-scroll"
    :scroll-y="true"
    :scroll-into-view="anchorTarget"
    @scroll="onScroll"
  >
    <view id="section-a" class="my-section">区块 A</view>
    <view id="section-b" class="my-section">区块 B</view>
    <lh-anchor
      :items="items"
      :scroll-top="scrollTop"
      @update:scroll-into-view="anchorTarget = $event"
    />
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const items = [
  { id: 'section-a', title: '区块 A' },
  { id: 'section-b', title: '区块 B' },
]
const scrollTop = ref(0)
const anchorTarget = ref('')
function onScroll(event: { detail?: { scrollTop?: number } }) {
  scrollTop.value = event.detail?.scrollTop ?? 0
}
</script>
```

## 基本的な使い方

```vue
<template>
  <lh-anchor :items="items" />
</template>

<script setup lang="ts">
const items = [
  { id: 'section-a', title: '区块 A' },
  {
    id: 'group-b',
    title: 'B 组',
    children: [
      { id: 'section-b', title: '区块 B' },
      { id: 'section-c', title: '区块 C' },
    ],
  },
]
</script>
```

`items` は子階層（`children`）をサポートします。描画時に深さ優先でフラット化し、自動的にインデントを付けます。アクティブアンカーの判定規則：最後に「セクションの上端が `offset` の閾値ラインをスクロールで越えた」アンカーがアクティブ項目となります。

## 横並び

```vue
<template>
  <lh-anchor :items="items" direction="horizontal" />
</template>
```

## API

### Props

| プロパティ | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| items | アンカーデータ（children 子階層をサポート） | `LhAnchorItem[]` | `[]` |
| target | H5 のスクロールコンテナセレクタ（デフォルトは window） | `string` | — |
| scrollTop | スクロール位置の注入（MP：scroll-view の `detail.scrollTop`） | `number` | — |
| offset | アクティブ判定の閾値（セクション上端からコンテナ上端までの距離） | `number` | `0` |
| direction | 並び方向 | `'vertical' \| 'horizontal'` | `'vertical'` |
| smooth | スムーズスクロール | `boolean` | `true` |
| sx | レイアウト用ショートカット | `LhSxProps` | — |

### Events

| イベント | 説明 | コールバック引数 |
| --- | --- | --- |
| change | アクティブアンカーが変化した時に発火 | `(id: string)` |
| click | アンカー項目をクリックした時に発火（スクロール位置決めより前） | `(id: string)` |
| update:scrollIntoView | MP の位置決め契約：対象セクションの id、scroll-into-view にバインド | `(id: string)` |
