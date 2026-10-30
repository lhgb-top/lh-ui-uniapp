# Badge バッジ

アイコン右上のコーナーバッジで、通知数、状態ドット、カスタム文言に使います。

## 基本的な使い方

```vue
<template>
  <lh-badge :value="8">
    <lh-button size="small">メッセージ</lh-button>
  </lh-badge>
  <lh-badge :value="8" type="primary">
    <lh-button size="small">プライマリ</lh-button>
  </lh-badge>
</template>
```

## 数値の扱い

```vue
<template>
  <lh-badge :value="200" :max="99">
    <lh-button size="small">max 超えは 99+ を表示</lh-button>
  </lh-badge>
  <lh-badge :value="0" show-zero>
    <lh-button size="small">0 を表示</lh-button>
  </lh-badge>
  <lh-badge :value="0">
    <lh-button size="small">0 を非表示</lh-button>
  </lh-badge>
  <lh-badge content="新">
    <lh-button size="small">カスタム文言</lh-button>
  </lh-badge>
</template>
```

## 小さいドット

```vue
<template>
  <lh-badge is-dot>
    <lh-button size="small">新着メッセージあり</lh-button>
  </lh-badge>
</template>
```

## オフセットとサイズ

```vue
<template>
  <lh-badge :value="8" :offset="[6, 4]">
    <lh-button size="small">オフセット</lh-button>
  </lh-badge>
  <lh-badge :value="8" size="small">
    <lh-button size="small">小サイズ</lh-button>
  </lh-badge>
</template>
```

## Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| type | タイプ | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'default'` | `'danger'` |
| value | 表示する数値 | `string \| number` | — |
| size | サイズ | `'small' \| 'medium' \| 'large'` | `'medium'` |
| max | 最大値。超えた場合は `${max}+` を表示 | `number` | `99` |
| isDot | 小さいドットか（数値を表示しない） | `boolean` | `false` |
| hidden | 非表示にするか | `boolean` | `false` |
| offset | デフォルト位置からのオフセット `[x, y]`。負の margin で実現 | `[number, number]` | — |
| showZero | value が 0 のときに表示するか | `boolean` | `false` |
| content | カスタム文言（value より優先） | `string` | — |
| customClass | カスタムクラス名 | `string` | — |
| sx | クイックレイアウトプロパティ | `LhSxProps` | — |

## Slots

| スロット | 説明 |
| --- | --- |
| default | バッジが付く対象のコンテンツ |

::: tip Vue3 版との差異
進退アニメーションは Vue 内蔵の `<transition>` に依存せず（ミニプログラムのトランジション終了イベントは信頼できないため）、class の切り替え + タイマーで 0.15s のアニメーション時間に合わせます。見た目の表現は plus と同じです。
:::
