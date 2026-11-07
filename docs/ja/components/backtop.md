# BackTop トップへ戻る

スクロールが閾値を超えると表示される「トップへ戻る」ボタンです。可視判定
（`isBackTopVisible`）とスクロール命令（`backToTop`）は `@lh-ui/share` の
core 純関数から提供されます。

## プラットフォームの違い（重要）

- **H5**：コンポーネントが自ら `window`（または `target` コンテナ）の
  `scroll` イベントを監視します。クリックすると対象コンテナを直接
  スクロールします。
- **WeChat ミニプログラム**：`scroll-view` のスクロールイベント
  `detail.scrollTop` を `scrollTop` prop に注入して表示・非表示を駆動する
  必要があります。クリック時、コンポーネントは `update:scrollTop`
  （値 0）を発火し、これを `scroll-view` の `scroll-top` 属性にバインドすれば
  トップへ戻ります。`target` 未指定時はページレベルのスクロールとなり、
  コンポーネントは `uni.pageScrollTo` を直接呼び出します。

```vue
<template>
  <scroll-view
    class="my-scroll"
    :scroll-y="true"
    :scroll-top="scrollTop"
    @scroll="onScroll"
  >
    <!-- 長いコンテンツ -->
    <lh-backtop :scroll-top="scrollTop" @update:scroll-top="scrollTop = $event" />
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const scrollTop = ref(0)
function onScroll(event: { detail?: { scrollTop?: number } }) {
  scrollTop.value = event.detail?.scrollTop ?? 0
}
</script>
```

## 基本的な使い方

```vue
<template>
  <lh-backtop :visibility-height="200" />
</template>
```

ページまたはコンテナが `visibility-height`（デフォルト 200px）を超えて
スクロールすると、ボタンがフェードイントランジションで表示されます。
クリックするとスムーズにトップへ戻ります。

## カスタム内容と位置

```vue
<template>
  <lh-backtop :right="24" :bottom="80">
    <view class="my-backtop">トップ</view>
  </lh-backtop>
</template>
```

デフォルトでは円形ボタン（内蔵の `arrow-up` アイコン）がレンダリングされます。
`right` / `bottom` でビューポート右下隅からのオフセットを指定します。
デフォルトスロットでボタンの内容をカスタマイズできます。

## API

### Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| target | H5 スクロールコンテナのセレクタ（デフォルトはビューポート。MP ではページレベルか scroll-view レベルの戻り先の区別にのみ使用） | `string` | `-` |
| scrollTop | スクロール位置の注入（MP: scroll-view の `detail.scrollTop`） | `number` | `-` |
| visibility-height | 何ピクセルスクロールしたら表示するか | `number` | `200` |
| right | 右側からのオフセット（px） | `number` | `40` |
| bottom | 下側からのオフセット（px） | `number` | `40` |
| smooth | スムーズスクロール | `boolean` | `true` |
| sx | クイックレイアウトプロパティ | `LhSxProps` | `-` |

### Events

| イベント | 説明 | コールバックパラメータ |
| --- | --- | --- |
| click | ボタンクリック時に発火（スクロール命令より先） | `(event: Event)` |
| scrollend | スクロール停止後に発火（150ms デバウンス） | `(scrollTop: number)` |
| update:scrollTop | MP のトップ戻り契約: 値は 0、scroll-view の scroll-top にバインド | `(scrollTop: number)` |

### Slots

| 名前 | 説明 |
| --- | --- |
| default | ボタンの内容（デフォルトは arrow-up アイコン） |
