# Tag タグ

## 基本的な使い方

```vue
<template>
  <lh-tag>デフォルト</lh-tag>
  <lh-tag type="primary">プライマリ</lh-tag>
  <lh-tag type="success">成功</lh-tag>
  <lh-tag type="warning">警告</lh-tag>
  <lh-tag type="danger">危険</lh-tag>
</template>
```

## スタイルとクローズ

```vue
<template>
  <lh-tag round>角丸</lh-tag>
  <lh-tag hit>アウトライン</lh-tag>
  <lh-tag closable @close="onClose">クローズ可能</lh-tag>
</template>

<script setup lang="ts">
const onClose = () => console.log('クローズしました')
</script>
```

## Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| type | タイプ | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| size | サイズ | `'small' \| 'medium' \| 'large'` | — |
| closable | クローズ可能 | `boolean` | `false` |
| disabled | 無効 | `boolean` | `false` |
| round | 角丸 | `boolean` | `false` |
| hit | アウトライン（塗りなし） | `boolean` | `false` |
| customClass | カスタムクラス名 | `string` | — |
| sx | クイックレイアウトプロパティ | `LhSxProps` | — |

## Events

| イベント | 説明 | コールバックパラメータ |
| --- | --- | --- |
| close | クローズボタンがタップされた | — |

::: tip Vue3 版との差異
クローズボタン内のインライン SVG は、本ライブラリでは lh-icon（iconfont 方式）に置き換わります。
:::
