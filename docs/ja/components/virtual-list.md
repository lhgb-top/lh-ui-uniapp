# VirtualList 仮想リスト

万件のデータでも可視ウィンドウだけを描画します。固定高の範囲計算
（`computeVirtualRange`）と動的高さのロジック
（`buildVirtualItems` / `findVirtualRange`）はすべて `@lh-ui/share`
の core 純関数から提供され、コンポーネント層はスクロール駆動と
ビューポート計測のみを担います。

## プラットフォーム差異

- **H5**：コンテナは `view`（`overflow: auto`）として描画され、
  ビューポート高は `clientHeight` + `ResizeObserver` で計測します。
- **WeChat ミニプログラム**：コンテナは `scroll-view`（`scroll-y`）と
  して描画され、スクロールイベントは `detail.scrollTop` を取り、
  ビューポート高は `createSelectorQuery` で計測します
  （MP に `ResizeObserver` はありません）。
- **動的高さ**：`itemSize` は宣言的な関数契約（呼び出し側が各項の高さを
  返す）です。両端で同じように動作し、MP にない計測 API には依存しません。

## 基本的な使い方（固定高）

```vue
<template>
  <lh-virtual-list :data="items" :height="360" :item-height="48">
    <template #default="{ item, index }">
      <view class="my-item">{{ index + 1 }} 行目：{{ item.label }}</view>
    </template>
  </lh-virtual-list>
</template>

<script setup lang="ts">
const items = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  label: `リスト項目 ${i + 1}`,
}))
</script>
```

`height` はコンテナ高を、`item-height` は固定高モードでの項高を
設定します（実際の項高と一致させる必要があります）。可視ウィンドウ外には
`overscan`（デフォルト 2）画面分のバッファ項目のみ保持します。

## 動的高さ

```vue
<template>
  <lh-virtual-list :data="items" :height="360" :item-size="sizeOf">
    <template #default="{ item, index }">
      <view class="my-item" :style="{ height: `${sizeOf(index)}px` }">
        {{ index + 1 }} 行目：{{ item.label }}
      </view>
    </template>
  </lh-virtual-list>
</template>

<script setup lang="ts">
// itemSize は宣言的な関数：各項の高さを返す。両端で同じように動作する
function sizeOf(index: number): number {
  return 48 + (index % 5) * 24
}
</script>
```

`item-height` と `item-size` はどちらか一方を使用します：`itemSize` を渡すと
動的高さモードになり（各項のオフセットを事前計算し、二分探索で可視区間を
見つけます）。

## API

### Props

| 属性 | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| data | データソース（項目の描画は default スロットが担う） | `any[]` | `[]` |
| height | コンテナ高（数値は px） | `number \| string` | `300` |
| itemHeight | 固定高モードでの項高 | `number` | `-` |
| itemSize | 動的高さモード：各項の高さを返す | `(index: number) => number` | `-` |
| overscan | オーバースキャン項数（可視ウィンドウ外のバッファ項目） | `number` | `2` |
| sx | sx クイックレイアウトプロパティ | `LhSxProps` | `-` |

### Slots

| スロット | 説明 | スコープ引数 |
| --- | --- | --- |
| default | 項目の描画 | `{ item, index }` |
