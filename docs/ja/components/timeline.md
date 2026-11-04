# Timeline タイムライン

縦方向のイベントフロー。時間順序＝ドキュメント順序。タイムスタンプ、セマンティックタイプ、中空ドット、左右交互レイアウトをサポートします。

> 純表示コンポーネント：イベントも制御状態もなく、H5 と WeChat ミニプログラムで完全に同じ挙動になります（末尾の「プラットフォームの違い」を参照）。

## 基本的な使い方

`timestamp` でタイムスタンプテキストを指定します；`type` でノードドットにセマンティックカラー（`'primary'` / `'success'` / `'warning'` / `'danger'`）を付けます。

```vue
<template>
  <lh-timeline>
    <lh-timeline-item timestamp="2026-09-01">
      立項レビュー
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="2026-09-15"
      type="success"
    >
      一次納品
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="2026-09-25"
      type="warning"
    >
      検収進行中
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## 左右交互

`mode="alternate"` は、コンテナ中央の軸を境にしてアイテムをインデックス順に左右交互に並べます（偶数インデックスは左、奇数インデックスは右）。

```vue
<template>
  <lh-timeline mode="alternate">
    <lh-timeline-item timestamp="Q1">
      計画
    </lh-timeline-item>
    <lh-timeline-item timestamp="Q2">
      開発
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="Q3"
      type="danger"
    >
      負荷試験
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="Q4"
      type="success"
    >
      リリース
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## 中空ドット

`hollow` はノードを中空のドットで描画します。未完了状態によく使われます。

```vue
<template>
  <lh-timeline>
    <lh-timeline-item
      timestamp="Q1"
      hollow
    >
      未開始
    </lh-timeline-item>
    <lh-timeline-item timestamp="Q2">
      進行中
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="Q3"
      type="success"
    >
      完了
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## タイムスタンプとドットのカスタマイズ

`timestamp` と `dot` はどちらもスロットです：prop の代わりに `#timestamp` スロットを使えば任意の内容を置けます；`#dot` スロットはデフォルトのドットを置き換えます（アイコンなど）。

```vue
<template>
  <lh-timeline>
    <lh-timeline-item type="primary">
      <template #timestamp>
        2026 年 9 月
      </template>
      カスタムタイムスタンプ
    </lh-timeline-item>
    <lh-timeline-item type="success">
      <template #dot>
        <lh-icon
          name="check"
          :size="12"
        />
      </template>
      カスタムドット（lh-icon）
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## Timeline Props

| Prop | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| mode | レイアウト：`'left'` 片側 / `'alternate'` 左右交互 | `'left' \| 'alternate'` | `'left'` |
| customClass | カスタムクラス名 | `string` | — |
| sx | クイックレイアウトプロパティ | `LhSxProps` | — |

## TimelineItem Props

| Prop | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| timestamp | タイムスタンプテキスト（`#timestamp` スロットも可） | `string` | — |
| type | ノードのセマンティックタイプ（ドットの枠線をトークン色で着色） | `'primary' \| 'success' \| 'warning' \| 'danger'` | — |
| hollow | 中空ノード（未完了状態によく使用） | `boolean` | `false` |
| customClass | カスタムクラス名（アイテムのルートノードに転送） | `string` | — |
| sx | クイックレイアウトプロパティ | `LhSxProps` | — |

## Slots

| Slot | 説明 |
| --- | --- |
| Timeline default | アイテムノード（`lh-timeline-item`） |
| TimelineItem default | アイテムの本文 |
| TimelineItem timestamp | タイムスタンプ内容（prop もスロットもない場合はその行は描画されません） |
| TimelineItem dot | カスタムドット（デフォルトドットは純装飾でアクセシビリティツリーに入りません） |

## プラットフォームの違い

- タイムラインは**純表示コンポーネント**です：イベント、制御状態、計測やプラットフォーム API の呼び出しが一切なく、H5 と WeChat ミニプログラムの両方で完全に利用可能、かつ同じ表示になります。
- セマンティックな `<ol>` / `<li>` リストは両プラットフォームとも `<view>` で実装します（WXSS はタグセレクタを禁じているためクラス名でスタイルを当てます）。`role="list"` / `role="listitem"` でリストのセマンティクスを保持します；ミニプログラムの読み上げ対応はプラットフォームの能力次第です。
- 接続線と中央軸はすべて CSS 疑似要素（`::before`）で、JS の計測に依存しません；`alternate` の左右交互はインデックスの偶奇と flex 方向で実現し、両プラットフォームで同一です。
- **WXSS 処理**：share スタイルソースの `.lh-timeline__item:not(.lh-timeline__item--last)` はビルド時に `:not()` 修飾を剥離します（WXSS は `:not()` 非対応）。最終アイテム以外の接続線の表示・非表示は、特異度がそれ以上の `.lh-timeline__item--last::before` が引き受け、両プラットフォームの描画結果は変わりません。
- アクセシビリティ：ノードのドットは純装飾（`aria-hidden="true"`）で、カスタムドットスロットもアクセシビリティツリーに入りません。Vue3 版と同じです。
- **移植の決定（Vue3 版に整合、未定義 API の導入なし）**：移植時点では plus の真源と `@lh-ui/share` core に `placement`（タイムスタンプ位置）や `center`（中央レイアウト）がまだ存在しなかったため、本ライブラリでも提供しません。`mode` は現在 `'left'` / `'alternate'` のみです。真源に追加され次第、追從してアップグレードします。
