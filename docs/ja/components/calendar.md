# Calendar カレンダー

月単位のグリッドで日付を表示するカレンダーコンポーネント。単一選択 / 期間（開始・終了）/ 複数選択の 3 モードをサポートし、`range` で選択可能範囲を制約できます。グリッド・曜日ヘッダー・月份タイトルのテキストはすべて言語パック（`datepicker.weeks.*` / `datepicker.month1~12` / `datepicker.panelTitle`）から取得します。カレンダーは `view` 自描きグリッドで、ネイティブの日付コントロールに依存しないため、モバイル環境と相性が良く全端末で利用できます。

## 基本的な使い方

```vue
<template>
  <lh-calendar v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date>()
</script>
```

`modelValue` を渡さない場合はコンポーネント内部で選択状態を保持します。渡せば制御（ほかのフォームコンポーネントと同じ）。

## 期間選択

`selection="range"` の場合、最初のクリックで開始日を確定（この時点の値は `[開始, 開始]`）、2 回目のクリックで終了日を確定し、自動的に正規化します（逆順にクリックしても `[早, 遅]` になります）：

```vue
<template>
  <lh-calendar v-model="span" selection="range" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const span = ref<Date[]>([])
</script>
```

両端に `--selected`、中間の日に `--in-range` の区間背景色が付きます（両端は除く）。

## 選択可能範囲の制約

`range` に `[開始, 終了]` タプルを渡すと、範囲外の日は無効になります（無効判定は share の純関数が担当し、逆順区间も自動で正規化します）：

```vue
<template>
  <lh-calendar v-model="value" :range="[start, end]" />
</template>

<script setup lang="ts">
const start = new Date(2026, 10, 1)
const end = new Date(2026, 10, 30)
</script>
```

## 複数選択

`selection="multiple"` では、選択済みの日を再度クリックすると選択解除され、結果は時系列順に保たれます：

```vue
<template>
  <lh-calendar v-model="dates" selection="multiple" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const dates = ref<Date[]>([])
</script>
```

## input トリガーモード

`mode="input"` ではトリガーボックスのみを描画し、タップでパネルを開閉します。選択後に自動的に閉じます（`close-on-select` はデフォルトで有効。期間モードでは 2 回クリックが必要）：

```vue
<template>
  <lh-calendar v-model="value" mode="input" placeholder="日付を選択" />

  <!-- 期間 + 自動的に閉じない -->
  <lh-calendar v-model="span" mode="input" selection="range" :close-on-select="false" />
</template>
```

トリガーボックスのテキストはデフォルトで `YYYY-MM-DD`（期間は `早 ~ 遅`）。プレースホルダーは言語パック `select.placeholder` から取得します。

## 複数パネルとカスタムコンテンツ

`panels` で同時に表示する月パネル数を指定し（flex で折り返し配置）、`header` / `cell` スロットでパネルタイトルと日付セルをカスタマイズできます：

```vue
<template>
  <lh-calendar v-model="value" :panels="2">
    <template #header="{ year, month }">
      <view class="my-title">{{ year }} / {{ month + 1 }}</view>
    </template>
    <template #cell="{ date }">
      <view class="my-cell">{{ date.getDate() }}</view>
    </template>
  </lh-calendar>
</template>
```

::: tip モバイル対応
カレンダーパネルは純粋な `view` グリッド（7 等幅カラム）で、ネイティブの picker も DOM 計測も使いません。
H5 と WeChat ミニプログラムで表示が完全に一致し、小画面でもコンテナ幅に合わせて最適化されます。
:::

## Calendar API

### Props

| 属性 | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| modelValue | 現在の選択（制御 v-model。省略時は内部状態） | `Date \| Date[]` | — |
| selection | 選択モード：単一 / 期間 / 複数 | `'single' \| 'range' \| 'multiple'` | `'single'` |
| range | 選択可能な日付範囲（範囲外は無効、逆順は自動正規化） | `[Date, Date]` | — |
| mode | 表示形態：常駐パネル / 展開式トリガーボックス | `'panel' \| 'input'` | `'panel'` |
| panels | 同時に表示する月パネル数 | `number` | `1` |
| placeholder | input モードのプレースホルダー（デフォルトは言語パック select.placeholder） | `string` | — |
| closeOnSelect | input モードで選択後にパネルを閉じるか | `boolean` | `true` |
| customClass | ルートノードに転送するカスタムクラス名 | `string` | — |
| sx | sx レイアウトプロパティ（ルートノードに適用） | `LhSxProps` | — |

### Events

| イベント | 説明 | パラメータ |
| --- | --- | --- |
| update:modelValue | 選択値の変化（v-model） | `(value: Date \| Date[])` |
| change | 選択値の変化（update:modelValue と同ペイロード） | `(value: Date \| Date[])` |
| select | 日をクリックしたとき（無効な日は無視） | `(date: Date)` |

### Slots

| スロット | 説明 | スコープパラメータ |
| --- | --- | --- |
| header | パネルタイトルのカスタマイズ | `{ year: number, month: number }`（month は 0 始まり） |
| cell | 日付セルのカスタマイズ | `{ date: Date }` |

### アクセシビリティ

- グリッドは `role="grid"`、各行は `role="row"`、日付セルは `role="gridcell"`、ヘッダーは `role="columnheader"`。`aria-selected` / `aria-current="date"`（当日）/ `aria-disabled`（無効）を付与
- セルの `aria-label` は `YYYY-MM-DD` 形式でスクリーンリーダーに読み上げられます
- 月移動ボタンは `role="button"` + `aria-label`（言語パック `datepicker.prevMonth` / `datepicker.nextMonth`）
- キーボードグリッドナビゲーション（方向キー、Home / End、PageUp / PageDown）は H5 のみ有効。後述のプラットフォーム差異を参照

::: tip プラットフォーム差異（Vue3 版との違い）
- **グリッドの载体**：カレンダーは `view` 自描きの 7 カラムグリッド（WXSS `grid-template-columns: repeat(7, 1fr)`）で、ネイティブの日付コントロールを使用しません。H5 と WeChat ミニプログラムで表示・操作が完全に一致し、モバイルと相性が良いです。
- **DOM 要素の対応**：plus の `<div>` / `<button>` / `<input>` はすべて `<view>` に置き換えました。input モードのトリガーボックスは `<view>` 自描きでプレースホルダーと選択値を表示します（MP は `::placeholder` 非対応のため、ネイティブ `<input>` だと `placeholder-style` が追加で必要）。無効セルは `--disabled` クラスで外観を表現（view に `:disabled` 疑似クラスはないため、SFC 内で同一トークンのフォールバックを定義）。
- **キーボードグリッドナビゲーションは H5 のみ**：方向キー / Home / End / PageUp / PageDown のナビゲーションと roving tabindex は、MP にキーボードイベントがないため条件コンパイルのガードで呼び出しません。MP バンドルにデッドコードは残りません。
- **外部クリックで閉じるのは H5 のみ**：plus はドキュメントレベルの mousedown を監視してパネルを閉じますが、MP には document がないため、トリガーボックスのタップで開閉します。
- **aria 属性は個別に明示バインド**：plus テンプレートの share `LhAriaAttrs` パックは `v-bind` で展開できません（MP テンプレートコンパイラ非対応）。グルーコード層で `aria-*` を個別の値に展開してバインドします。契約は引き続き share の純関数が決定します。
:::
