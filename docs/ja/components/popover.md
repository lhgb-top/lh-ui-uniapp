# Popover ポップオーバー

リッチコンテンツを表示するポップオーバー：Tooltip より多くの情報（タイトル・本文・インタラクティブなノード）を扱えます。トリガーはデフォルトスロットに包み、ポップ内容は `content` スロットで渡します。ポップ層は `role="dialog"` で、矢印は常にトリガーを指します。

## 基本的な使い方

```vue
<template>
  <lh-popover title="水墨ヒント" placement="top">
    <lh-button>クリックで表示</lh-button>
    <template #content>
      <text>これはリッチコンテンツです。任意のノードを置けます。</text>
    </template>
  </lh-popover>
</template>
```

::: warning ミニプログラムには hover / focus のセマンティクスがありません
`trigger` のデフォルトは `click`（全ターゲットで利用可能）。`hover` / `focus` は H5 のみ有効です。ミニプログラムでは自動的にタップ / タッチ切り替えに縮退します（1 回目のタップで開き、もう 1 回で閉じます）。
:::

## トリガー方式

```vue
<template>
  <!-- ホバートリガー（H5 のみ有効、ミニプログラムではタップ切り替えに縮退） -->
  <lh-popover trigger="hover" title="ホバートリガー">
    <lh-button>ホバーしてください</lh-button>
    <template #content><text>ポインターがポップ層に入っても閉じません。</text></template>
  </lh-popover>

  <!-- フォーカストリガー（H5 のみ有効） -->
  <lh-popover trigger="focus" title="フォーカストリガー">
    <lh-input placeholder="入力欄にフォーカス" />
    <template #content><text>入力欄がフォーカスを得ると表示します。</text></template>
  </lh-popover>

  <!-- 手動制御：表示 / 非表示は完全に外部の v-model:visible で制御 -->
  <lh-popover v-model:visible="manualVisible" trigger="manual" title="手動制御">
    <lh-button @click="manualVisible = !manualVisible">外部スイッチ</lh-button>
    <template #content><text>表示 / 非表示は完全に外部の状態で制御されます。</text></template>
  </lh-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const manualVisible = ref(false)
</script>
```

> 遅延 `showAfter` / `hideAfter` は誤操作防止の hover / focus（H5）でのみ有効です。`click` と `manual` は即時応答します。

## 12 種類の配置

```vue
<template>
  <lh-popover
    v-for="p in placements"
    :key="p"
    :placement="p"
    :title="p"
  >
    <lh-button size="small">{{ p }}</lh-button>
    <template #content><text>配置：{{ p }}</text></template>
  </lh-popover>
</template>

<script setup lang="ts">
const placements = [
  'top', 'top-start', 'top-end',
  'bottom', 'bottom-start', 'bottom-end',
  'left', 'left-start', 'left-end',
  'right', 'right-start', 'right-end',
] as const
</script>
```

> ビューポートに空きがないとき、ポップ層は自動で方向を反転し（flip）、交差軸でクランプ（shift）されます。矢印の位置も連動して切り替わります。

## 幅・矢印・無効化

```vue
<template>
  <!-- 固定幅 -->
  <lh-popover title="固定幅" width="240">
    <lh-button>固定幅</lh-button>
    <template #content><text>width でポップ層の幅を指定します。</text></template>
  </lh-popover>

  <!-- 矢印なし -->
  <lh-popover title="矢印なし" :arrow="false">
    <lh-button>矢印なし</lh-button>
    <template #content><text>arrow が false のときは矢印を描画しません。</text></template>
  </lh-popover>

  <!-- 無効 -->
  <lh-popover title="無効" disabled>
    <lh-button disabled>無効なトリガー</lh-button>
    <template #content><text>disabled のときトリガーもポップ層も応答しません。</text></template>
  </lh-popover>
</template>
```

## Popover API

### Props

| プロパティ | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| placement | 表示位置（12 種類） | `LhPopoverPlacement` | `'top'` |
| trigger | トリガー方式：`click`（全ターゲット）/ `hover`、`focus`（H5 のみ、MP ではタップに縮退）/ `manual`（制御付き） | `'click' \| 'hover' \| 'focus' \| 'manual'` | `'click'` |
| title | タイトル（title スロットも可） | `string` | — |
| visible | 手動制御の表示状態（v-model:visible） | `boolean` | — |
| disabled | 無効かどうか | `boolean` | `false` |
| arrow | 矢印を表示するか | `boolean` | `true` |
| width | ポップ層の幅（数値は px） | `string \| number` | — |
| popperClass | ポップ層のカスタムクラス名 | `string` | — |
| showAfter | 表示遅延（ms、H5 の hover / focus のみ有効） | `number` | — |
| hideAfter | 非表示遅延（ms、H5 の hover / focus のみ有効） | `number` | — |
| themeVars | コンポーネントレベルのテーマ変数 | `Record<string, string>` | — |
| bgPattern | コンポーネントレベルの背景パターン。ConfigProvider の設定を上書き | `string` | — |
| sx | sx クイックレイアウト属性（トリガーのルート要素に適用） | `LhSxProps` | — |

### Events

| イベント | 説明 | 引数 |
| --- | --- | --- |
| update:visible | 表示状態の変化（v-model） | `(value: boolean)` |
| show | 表示後に発火 | — |
| hide | 非表示後に発火 | — |

### Slots

| スロット | 説明 |
| --- | --- |
| default | トリガーの内容 |
| title | カスタムタイトル |
| content | ポップ内容 |

### Methods

| メソッド | 説明 |
| --- | --- |
| show | プログラムで表示 |
| hide | プログラムで非表示 |
| toggle | プログラムで切り替え |

### アクセシビリティ

- トリガーには `aria-haspopup="true"` と `aria-expanded` / `aria-controls` が付きます。ポップ層は `role="dialog"` で、タイトルがある場合は `aria-labelledby` で関連付けます
- Esc で閉じる、ポップ層の外側のクリック（ページ内透明マスク）で閉じる。複数のポップ層が重なっている場合、Esc は最上位のみ閉じます（いずれも H5 のみ）
- 位置計算エンジンは自前の純粋関数（flip / shift のはみ出し防止）で、サードパーティの実行時依存はゼロです

::: tip プラットフォームの差異（Vue3 版との差異）
- **トリガー方式**：ミニプログラムには hover / focus のセマンティクスがないため、`trigger="hover"` / `trigger="focus"` は MP 端でタップ / タッチ切り替えに縮退します。表示 / 非表示の遅延（`showAfter` / `hideAfter`）は H5 の hover / focus モードでのみ有効で、`click` と `manual` は即時応答します。
- **ポップ層の配置と位置決め**：`teleportTarget` プロップはありません。ミニプログラムには DOM teleport がないため、ポップ層は `root-portal`（低バージョンではページ内 fixed でフォールバック）で担います。popper の位置決めは 2 フレームの非同期計測（非表示で描画してサイズを測る → `computePosition` で配置 → 表示、ちらつき防止）で行い、計算は非同期のため同期的な結果を仮定できません。矢印のオフセットはコンポーネントグルーが位置決め結果の `arrowOffset` を `--lh-arrow-offset` に書き込みます。
- **キーボード操作は H5 のみ**：Esc による閉じはドキュメントレベルのリスナーで行います（複数重なっている場合は最上位のみ閉じる）。ミニプログラムにはキーボードイベントがなく、この部分は条件付きコンパイルで削除されます。
- **フォーカストラップは未移植**：plus のクリックトリガーはフォーカスをポップ層に閉じ込め（focus-trap）、閉じるときに返却します。MP にはキーボードフォーカスのセマンティクスがないため、本リポジトリの Dialog と同様に全体を移植していません。
- **出入りのトランジション未実装**：plus は `Transition` でフェードしますが、MP 端では `Transition` が信頼できないため、tooltip / dropdown と同様にバインドしていません。
- **トリガーがビューポート外にスクロールしても自動で閉じない**：plus の `useLhPopper` には scroll-out コールバックがありますが、uni-app には統一されたスクロール / サイズ変化の監視経路がないため未移植です。
:::
