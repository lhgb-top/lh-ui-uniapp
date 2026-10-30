# Skeleton スケルトン

データの読み込みが整う前のプレースホルダーで、`loading` が false のときは実際のコンテンツをレンダリングします。

## 基本的な使い方

```vue
<template>
  <lh-skeleton :loading="loading">
    <view>実際のコンテンツ</view>
  </lh-skeleton>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const loading = ref(true)
</script>
```

## 行数とアバター

```vue
<template>
  <lh-skeleton :loading="true" :rows="4" avatar />
</template>
```

## アニメーションのオフ

```vue
<template>
  <lh-skeleton :loading="true" :animated="false" :rows="3" />
</template>
```

## 独立したプレースホルダーブロック

`lh-skeleton-item` は単独で使用してカスタムのプレースホルダーレイアウトを組み立てられます。`variant` は `text` / `rect` / `circle` を取ります。

```vue
<template>
  <view class="custom-skeleton">
    <lh-skeleton-item variant="circle" class="avatar" />
    <lh-skeleton-item variant="text" class="line" />
  </view>
</template>
```

## Props（lh-skeleton）

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| loading | 読み込み中か（false のときは default スロットの実際のコンテンツをレンダリング） | `boolean` | `true` |
| rows | テキストの行数 | `number` | `3` |
| avatar | 円形アバターのプレースホルダーを含むか | `boolean` | `false` |
| animated | アニメーションを有効にするか | `boolean` | `true` |
| customClass | カスタムクラス名 | `string` | — |
| sx | クイックレイアウトプロパティ | `LhSxProps` | — |

## Props（lh-skeleton-item）

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| variant | プレースホルダーブロックの形状 | `'text' \| 'rect' \| 'circle'` | `'text'` |
| animated | アニメーションを有効にするか | `boolean` | `true` |
| customClass | カスタムクラス名 | `string` | — |
| sx | クイックレイアウトプロパティ | `LhSxProps` | — |

## Slots（lh-skeleton）

| スロット | 説明 |
| --- | --- |
| default | `loading` が false のときにレンダリングされる実際のコンテンツ |

::: tip アクセシビリティ
コンテナには `aria-busy="true"` と `aria-live="polite"` を記し、プレースホルダーブロック自体は支援技術に対して隠します。データが整うとスクリーンリーダーが実際のコンテンツを自動で読み上げます。
:::
