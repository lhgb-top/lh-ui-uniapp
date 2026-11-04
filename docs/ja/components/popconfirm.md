# Popconfirm 確認バブル

軽量な二段階確認：トリガーの近くに確認バブルを表示し、ダイアログを開かずに済みます。セマンティクスはブロッキング確認（`role="alertdialog"`）で、Escape はキャンセルとして扱われます。確認内容は `content` スロットまたは `title` プロップで渡し、トリガーはデフォルトスロットで包みます。

## 基本的な使い方

```vue
<template>
  <lh-popconfirm title="この記録を削除しますか？" @confirm="onConfirm" @cancel="onCancel">
    <lh-button type="danger">削除</lh-button>
  </lh-popconfirm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const action = ref('')
function onConfirm() {
  action.value = '確認済み'
}
function onCancel() {
  action.value = 'キャンセル済み'
}
</script>
```

::: warning ミニプログラムには hover / focus のセマンティクスがありません
`trigger` のデフォルトは `click`（全端で利用可能）。`hover` / `focus` は H5 のみ有効——ミニプログラムではタップ切り替えに自動ダウングレードします（1 回目のタップで開く、2 回目で閉じる）。
:::

## 3 種類のトーン

`type` がトーンアイコンと修飾クラスを決めます：`info`（情報）/ `warning`（警告、デフォルト）/ `danger`（危険）。

```vue
<template>
  <lh-popconfirm type="info" title="この記録のアクセスログを表示しますか？">
    <lh-button>情報</lh-button>
  </lh-popconfirm>
  <lh-popconfirm type="warning" title="この操作は全メンバーに通知されます。">
    <lh-button type="warning">警告</lh-button>
  </lh-popconfirm>
  <lh-popconfirm type="danger" title="削除後は元に戻せません。">
    <lh-button type="danger">危険</lh-button>
  </lh-popconfirm>
</template>
```

## カスタムテキストと配置

```vue
<template>
  <lh-popconfirm
    title="アーカイブ後はゴミ箱から復元できます。"
    confirm-text="アーカイブ"
    cancel-text="やめておく"
    placement="right"
  >
    <lh-button>カスタムテキスト</lh-button>
  </lh-popconfirm>

  <!-- ホバー トリガー（H5 のみ有効、ミニプログラムではタップ切り替えにダウングレード） -->
  <lh-popconfirm title="ホバーで確認できます。" trigger="hover" :show-after="0" placement="bottom">
    <lh-button>ホバー トリガー</lh-button>
  </lh-popconfirm>
</template>
```

> ボタンのテキストはデフォルトで言語パックの `popconfirm.confirm` / `popconfirm.cancel` を使用し、`confirm-text` / `cancel-text` で上書きできます。

## 制御付き表示とアイコン

```vue
<template>
  <!-- 制御モード：表示は完全に外部の v-model:visible が制御 -->
  <lh-popconfirm v-model:visible="pcVisible" trigger="manual" title="制御バブル">
    <lh-button @click="pcVisible = !pcVisible">{{ pcVisible ? '閉じる' : '開く' }}</lh-button>
  </lh-popconfirm>

  <!-- アイコンの切り替えと確認ボタンのタイプ -->
  <lh-popconfirm title="この記録を削除しますか？" :show-icon="false" confirm-button-type="primary">
    <lh-button type="danger">アイコンなし</lh-button>
  </lh-popconfirm>

  <!-- 無効化 -->
  <lh-popconfirm title="この操作は利用できません。" disabled>
    <lh-button disabled>無効</lh-button>
  </lh-popconfirm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const pcVisible = ref(false)
</script>
```

## Popconfirm API

### Props

| プロップ | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| type | 確認トーン：`info` / `warning` / `danger` | `'info' \| 'warning' \| 'danger'` | `'warning'` |
| placement | 表示位置（12 方位） | `LhPopconfirmPlacement` | `'top'` |
| trigger | トリガー方式：`click`（全端）/ `hover`、`focus`（H5 のみ、MP ではタップにダウングレード）/ `manual`（制御） | `'click' \| 'hover' \| 'focus' \| 'manual'` | `'click'` |
| title | 確認内容（content スロットでも可） | `string` | — |
| confirmText | 確認ボタンのテキスト（未指定時は言語パック popconfirm.confirm） | `string` | — |
| cancelText | キャンセルボタンのテキスト（未指定時は言語パック popconfirm.cancel） | `string` | — |
| confirmButtonType | 確認ボタンのタイプ | `'default' \| 'primary'` | `'primary'` |
| visible | 手動制御の表示状態（v-model:visible） | `boolean` | — |
| disabled | 無効化するか | `boolean` | `false` |
| showIcon | トーンアイコンを表示するか | `boolean` | `true` |
| popperClass | ポップアップ層のカスタムクラス名 | `string` | — |
| showAfter | 表示遅延（ms、H5 の hover / focus のみ有効） | `number` | — |
| hideAfter | 非表示遅延（ms、H5 の hover / focus のみ有効） | `number` | — |
| themeVars | コンポーネント級テーマ変数 | `Record<string, string>` | — |
| bgPattern | コンポーネント級背景パターン、ConfigProvider 設定を上書き | `string` | — |
| sx | sx クイックレイアウト属性（トリガールート要素に適用） | `LhSxProps` | — |

### Events

| イベント | 説明 | パラメータ |
| --- | --- | --- |
| confirm | 確認ボタン クリック後に発火 | — |
| cancel | キャンセルボタン クリックまたは Escape 押下後に発火 | — |
| update:visible | 表示状態の変化（v-model） | `(value: boolean)` |
| show | 表示後に発火 | — |
| hide | 非表示後に発火 | — |

### Slots

| スロット | 説明 |
| --- | --- |
| default | トリガー内容 |
| content | カスタム確認内容 |

### Methods

| メソッド | 説明 |
| --- | --- |
| show | プログラム的に表示 |
| hide | プログラム的に非表示 |
| toggle | プログラム的に切り替え |

### アクセシビリティ

- ポップアップ層は `role="alertdialog"` + `aria-modal="true"`、確認内容は `aria-labelledby` で関連付け；トリガーは `aria-haspopup` / `aria-expanded` / `aria-controls` を持ちます（属性パックは share 純関数が生成）
- Escape はキャンセルとして扱う（WAI-ARIA alertdialog パターンに準拠：Escape で閉じて否定とみなす）；複数ポップアップ重積時はスタック最上位のみ Esc に応答（H5 のみ）
- キャンセルボタン、確認ボタン以外の透明マスクのクリックでも閉じます；トーンアイコンは装飾的（`aria-hidden`）
- 位置決めエンジンは自社製純関数（flip / shift はみ出し防止）で、サードパーティ実行時依存ゼロ

::: tip プラットフォーム差異（Vue3 版との差異）
- **トリガー方式**：ミニプログラムには hover / focus のセマンティクスがなく、`trigger="hover"` / `trigger="focus"` は MP 端でタップ切り替えにダウングレード；表示遅延（`showAfter` / `hideAfter`）は H5 の hover / focus モードでのみ有効で、`click` と `manual` は即時応答します。
- **ポップアップの搬送と位置決め**：`teleportTarget` プロップなし——ミニプログラムには DOM teleport がなく、ポップアップ層は `root-portal`（低バージョンはページ内 fixed フォールバック）で搬送；popper 位置決めは 2 フレーム非同期計測（先に非表示レンダリングでサイズを測る → `computePosition` で配置 → 表示、ちらつき防止）で、位置決め計算は非同期のため同期的に結果を取れると仮定できません；矢印オフセットはコンポーネント グルーが位置決め結果の `arrowOffset` を `--lh-arrow-offset` に書き込みます。
- **キーボード動作は H5 のみ**：Esc = キャンセルはドキュメント レベルのリスナー（複数ポップアップ重積時は最上位のみ閉じる）；ミニプログラムにはキーボード イベントがなく、条件付きコンパイルで全段が切り取られます。
- **フォーカス トラップ未移植**：plus は開時にフォーカスを「確定」ボタンに置き、Tab が 2 ボタン間を循環してポップアップ層に閉じ込め（focus-trap）、閉じ時にフォーカスを返します；MP にはキーボード フォーカスのセマンティクスがなく、本リポジトリの Dialog / Popover と同様に全体を移植していません。
- **出入りトランジション未実装**：plus は `Transition` でフェードイン / アウト（`lh-popconfirm-fade`）；MP 端では `Transition` が信頼できないため、tooltip / dropdown / popover と同様にトランジションをバインドしません。
- **トリガーがビューポート外にスクロールしても自動非表示しない**：plus の `useLhPopper` には scroll-out コールバックがありますが、uni-app には統一されたスクロール / サイズ変更監視チャネルがなく未移植です。
- **aria-haspopup の値**：plus のテンプレートは `aria-haspopup="dialog"` をハードコードしていますが、本リポジトリのトリガー属性パックは share の `getPopconfirmTriggerAria` が統一生成（値は `'true'`）し、契約は share 純関数に従います。
:::
