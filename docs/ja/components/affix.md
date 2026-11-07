# Affix 固定表示

コンテンツをビューポートの上部または下部に固定します。固定判定（`isAffixFixed`）と
固定スタイル（`getAffixFixedStyle`）は `@lh-ui/share` の core 純関数から提供され、
コンポーネント層はスクロール購読、プレースホルダー計測、リアクティブな接着処理のみを
担当します。

## プラットフォーム差異（重要）

H5 と WeChat ミニプログラムではスクロールのセマンティクスが異なるため、本コンポーネントは
両端対応の方式を採用しています：

- **H5**：コンポーネントが自身で `window`（または `target` セレクタが指すコンテナ）の
  `scroll` イベントを監視し、プレースホルダーノードの `getBoundingClientRect` で
  固定状態を判定します。
- **WeChat ミニプログラム**：`scroll` イベントは `scroll-view` タグにしかバインドできないため、
  コンポーネントが自身で購読することはできません。コンポーネントを `scroll-view` 内に配置し、
  スクロールイベントの `detail.scrollTop` を `scrollTop` prop 経由で注入します：

```vue
<template>
  <scroll-view
    class="my-scroll"
    :scroll-y="true"
    :scroll-top="scrollTop"
    @scroll="onScroll"
  >
    <lh-affix :scroll-top="scrollTop" :offset-top="20">
      <view class="my-bar">上部固定バー</view>
    </lh-affix>
    <!-- 長いコンテンツ -->
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

H5 では `scrollTop` を渡さない場合、コンポーネントが自動的に `window` を監視します。
`target` セレクタを渡した場合はそのコンテナを監視します。

## 基本的な使い方

```vue
<template>
  <lh-affix :offset-top="20">
    <lh-button type="primary">上部固定ボタン</lh-button>
  </lh-affix>
</template>
```

コンテンツがスクロールで `offset-top` を越えるとビューポート上部に固定されます。
固定中はプレースホルダーが元の高さでドキュメントの位置を保持するため、
後続のコンテンツが跳びません。

## 下部固定モード

```vue
<template>
  <lh-affix :offset-bottom="24">
    <view class="my-bar">下部固定バー</view>
  </lh-affix>
</template>
```

`offset-bottom` は `offset-top` より優先されます：プレースホルダーの下辺が
「ビューポート高 - offset-bottom」を越えると下部に固定されます。

## API

### Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| offset-top | ビューポート上部からのピクセル数で上部固定を発動 | `number` | `0` |
| offset-bottom | ビューポート下部からのピクセル数で下部固定を発動（offset-top より優先） | `number` | `0` |
| target | H5 のスクロールコンテナセレクタ（デフォルトはビューポート、MP では無効） | `string` | `-` |
| scrollTop | スクロール位置の注入（MP：scroll-view の `detail.scrollTop`） | `number` | `-` |
| sx | クイックレイアウトプロパティ（間隔 / サイズ / flex） | `LhSxProps` | `-` |

### Events

| イベント | 説明 | コールバックパラメータ |
| --- | --- | --- |
| change | 固定状態が変化した時に発火 | `(fixed: boolean)` |

### Slots

| スロット | 説明 |
| --- | --- |
| default | 固定するコンテンツ |
