# Button ボタン

基本的なボタンコンポーネントです。レンダリングは uni 内蔵の `<button>`（各端のネイティブボタンにコンパイルされます）で行い、クリックイベントは uni が `bindtap` にコンパイルします。

## 基本的な使い方

```vue
<template>
  <lh-button>デフォルト</lh-button>
  <lh-button type="primary">プライマリ</lh-button>
  <lh-button type="success">成功</lh-button>
  <lh-button type="warning">警告</lh-button>
  <lh-button type="danger">危険</lh-button>
  <lh-button type="info">情報</lh-button>
</template>
```

## 状態と形状

```vue
<template>
  <lh-button loading>読み込み中</lh-button>
  <lh-button disabled>無効</lh-button>
  <lh-button plain>プレーン</lh-button>
  <lh-button round>角丸</lh-button>
  <lh-button circle icon="search" />
  <lh-button block>ブロック（1 行を占有）</lh-button>
  <lh-button icon="search" type="primary">アイコン付き</lh-button>
</template>
```

## Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| type | タイプ | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| size | サイズ。渡さない場合は ConfigProvider から継承 | `'small' \| 'medium' \| 'large'` | — |
| loading | 読み込み中状態 | `boolean` | `false` |
| disabled | 無効 | `boolean` | `false` |
| plain | プレーン（アウトライン）スタイル | `boolean` | `false` |
| block | ブロックレイアウト | `boolean` | `false` |
| round | 角丸 | `boolean` | `false` |
| circle | 円形 | `boolean` | `false` |
| icon | アイコン名 | `LhIconName` | — |
| customClass | カスタムクラス名（ルートノードに透過） | `string` | — |
| themeVars | コンポーネントレベルのテーマ変数 | `Record<string, string>` | — |
| bgPattern | コンポーネントレベルの背景紋様 | `string` | — |
| sx | クイックレイアウトプロパティ | `LhSxProps` | — |

## Events

| イベント | 説明 | コールバックパラメータ |
| --- | --- | --- |
| click | クリック | `(event)` |

::: tip Vue3 版との差異
ミニプログラムの button には `nativeType` / `href` / `target` のセマンティクスがないため、この 3 つのプロパティは本ライブラリでは**実装しません**。
その他の API は同じです。
:::
