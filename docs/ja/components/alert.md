# Alert アラート

ページ内で重要な意味的フィードバック（成功 / 警告 / エラー / 情報）を表示します。タイトル、説明、意味的アイコン、クローズ操作をサポートします。

## 基本的な使い方

```vue
<template>
  <lh-alert title="情報">
    操作は保存されました。いつでも編集を再開できます。
  </lh-alert>
</template>
```

タイトルは `title` プロップまたは同名スロットで渡せます。デフォルトスロットは説明を担います。

## 意味的なタイプ

```vue
<template>
  <lh-alert type="success" title="成功">
    データの同期が完了しました。
  </lh-alert>
  <lh-alert type="warning" title="警告">
    残高が不足しています。早めにチャージしてください。
  </lh-alert>
  <lh-alert type="danger" title="エラー">
    送信に失敗しました。ネットワークを確認して再試行してください。
  </lh-alert>
  <lh-alert type="info" title="情報">
    新しいバージョンは来週公開予定です。
  </lh-alert>
</template>
```

## 意味的アイコン

```vue
<template>
  <lh-alert show-icon type="success" title="アイコン付きの成功メッセージ">
    アイコンの色は意味的タイプに自動的に追従します。
  </lh-alert>
</template>
```

## クローズ可能

```vue
<template>
  <lh-alert closable title="クローズ可能なアラート">
    右側の閉じるアイコンをクリックすると非表示になり、close イベントが発火します。
  </lh-alert>
</template>
```

## プレーンスタイル

```vue
<template>
  <lh-alert plain title="プレーンスタイル">
    透明な背景と意味色の境界線。コンパクトなリストに適しています。
  </lh-alert>
</template>
```

## Props

| プロパティ | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| type | 意味的タイプ | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` |
| title | タイトル（title スロットも可） | `string` | — |
| closable | クローズ可能かどうか | `boolean` | `false` |
| showIcon | 意味的アイコンを表示するか | `boolean` | `false` |
| plain | プレーン（浅色）スタイルにするか | `boolean` | `false` |
| closeLabel | 閉じるボタンのアクセシブル名（未指定時は `alert.close` 言語リソース） | `string` | — |
| customClass | カスタムクラス名 | `string` | — |
| sx | レイアウト用ショートカット | `LhSxProps` | — |

## Events

| イベント | 説明 | コールバック引数 |
| --- | --- | --- |
| close | 閉じるボタンをクリックした時に発火（直後に非表示） | — |

## Slots

| スロット | 説明 |
| --- | --- |
| default | 説明コンテンツ |
| title | タイトルコンテンツ（title プロップより優先） |

## プラットフォームの違い

- **アクセシビリティロール**：`warning` / `danger` は `role="alert"`（即時通知）、`info` / `success` は `role="status"`（待機中の通知）を描画します。plus 版の APG セマンティクスと一致し、プラットフォーム間で差異はありません。
- **タグの置き換え**：plus 版の `<div>` / `<span>` / `<p>` は `view` に置き換えられます（WXSS はタグセレクタを禁止しているため、スタイルは `lh-alert__*` クラス名で適用されます）。
- **アイコン**：インライン svg はミニプログラムでサポートされていないため、`lh-icon` ノード（`info` / `check` / `warning` / `error`）に統一され、`lh-alert__icon` クラスは share の scss と共通です。
- **閉じるボタン**：plus 版の `<button type="button">` は `role="button"` を持つ `view` に置き換えられます。アクセシブル名は同様に `closeLabel` または `alert.close` 言語リソースから取得します（9 言語すべてに対応）。
- **出入りアニメーションなし**：plus 版もクローズ時に `v-if` でノードを取り除くだけ（`<transition>` で包んでいない）のため、本バージョンの挙動は完全に一致し、ミニプログラムの `transitionend` 信頼性の問題は関係ありません。
- **移植の結論**：alert は純粋な表示コンポーネント（計測 / オーバーレイ / フォーカストラップ / document への依頼なし）で、全プラットフォームで利用可能。H5 と WeChat ミニプログラムで同一の挙動となります。
