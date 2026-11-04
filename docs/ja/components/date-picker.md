# DatePicker 日付選択

日付選択器：トリガーボックスをタップしてカレンダーパネルを開き、日付 / 月 / 年の 3 つの選択モード、カスタム表示フォーマット、範囲値のエコーに対応します。カレンダーグリッドの生成、日付フォーマット、無効判定はすべて `@lh-ui/share` core の純関数を消費し、パネルは `view` 自描きグリッドのため H5 と WeChat ミニプログラムで同一に描画されます。

## 値型の契約

コンポーネントのバインド値は**常に `Date` オブジェクト**（範囲は `[Date, Date]` タプル）で、ISO 日付文字列は受け取らず、出力もしません：

```vue
<template>
  <lh-date-picker v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
// ✅ 正しい：Date オブジェクト
const value = ref<Date | null>(new Date(2026, 10, 3))
// ❌ 間違い：'2026-11-03' 文字列はエコーも解析もされません
</script>
```

`format` prop は**トリガーとパネルの表示にのみ**影響します（固定幅トークン `yyyy` / `MM` / `dd` / `HH` / `mm` / `ss`）。バインド値の形は変わりません。受け取るのは `Date` です。保存用に ISO 文字列が必要なら、自身で `formatDate` や `toISOString()` を呼び出してください。

## 基本的な使い方

```vue
<template>
  <lh-date-picker v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3))
</script>
```

日付モードではパネル内で日付をタップした時点では**一時保持**され、フッターの「确定（OK）」で確定されます（Vue3 版と同じ二段階確定）。「今天（今日）」ボタンはパネルを当月に戻し、今日を一時保持します。

## 月・年モード

`mode="month"` / `mode="year"` ではパネルを開くと対応するグリッドに直接落ち、セルをタップすると即座に選択して閉じます（フッターボタンなし）。日付モードではパネルのタイトルをタップして段階的にドリルダウンできます：日付 → 月 → 年。年ビューでタイトルをタップすると月に戻ります。

```vue
<template>
  <lh-date-picker v-model="month" mode="month" />
  <lh-date-picker v-model="year" mode="year" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const month = ref<Date | null>(new Date(2026, 5, 1))
const year = ref<Date | null>(new Date(2024, 0, 1))
</script>
```

## 日付フォーマット

```vue
<template>
  <lh-date-picker v-model="value" format="MM/dd/yyyy" />
  <lh-date-picker v-model="value" format="yyyy年MM月dd日" />
</template>
```

`placeholder` を省略すると、`format` からプレースホルダーを生成します（`yyyy` → 言語パックの「年」、`MM` → 「月」、`dd` → 「日」）。

## 無効・読み取り専用

```vue
<template>
  <lh-date-picker v-model="value" disabled />
  <lh-date-picker :model-value="value" readonly />
</template>
```

`disabled` は選択器全体を無効化（タップしてもパネルが開きません）；`readonly` は読み取り専用（プログラム的に値を設定できますが、タップしてもパネルが開きません）。

## サイズとクリア

```vue
<template>
  <lh-date-picker v-model="value" size="small" />
  <lh-date-picker v-model="value" size="medium" />
  <lh-date-picker v-model="value" size="large" />
  <lh-date-picker v-model="value" :clearable="false" />
</template>
```

`size` は ConfigProvider のグローバルサイズにフォールバックし、最終的に `medium` になります。`clearable` はデフォルトでオン、トリガー右側にクリアアイコンが表示されます。

## 範囲値のエコー

バインド値が `[Date, Date]` の場合、トリガーは両端を `range-separator`（デフォルト `~`）で結んでエコーします：

```vue
<template>
  <lh-date-picker v-model="span" range-separator=" ～ " />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const span = ref<[Date, Date]>([new Date(2026, 10, 1), new Date(2026, 10, 7)])
</script>
```

::: warning 範囲 / 日付時刻選択 UI は未実装
Vue3 版と同様、`mode="datetime"` と範囲選択は**型予約のみで、選択 UI がありません**（時刻列と範囲パネルは未実装、家族バックログ P-08）。範囲値のエコーはできますが、パネル内で「OK」をタップしても、既にバインドされている範囲値が単一の `Date` で上書きされることはありません。
:::

## セルとパネルのカスタマイズ

```vue
<template>
  <lh-date-picker v-model="value" :cell-class-name="cellClassName" popper-class="my-popper" />
</template>

<script setup lang="ts">
const cellClassName = (date: Date) => (date.getDay() === 0 || date.getDay() === 6 ? 'my-weekend' : '')
</script>
```

`cell-class-name` は日付ごとにセルへカスタムクラスを追加します（空の戻り値はスキップ）；`popper-class` はパネルのルートに転送され、パネル単位のスタイル調整に使えます。

## DatePicker API

### Props

| Prop | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| modelValue | バインド値（Date / 範囲タプル / null、**ISO 文字列不可**） | `Date \| [Date, Date] \| null` | `null` |
| mode | 選択モード | `'date' \| 'month' \| 'year' \| 'datetime' \| 'range'` | `'date'` |
| size | サイズ（省略時は ConfigProvider のグローバルサイズ、最終的に medium） | `'small' \| 'medium' \| 'large' \| 'mini' \| 'x-large'` | `'medium'` |
| disabled | 選択器全体を無効化 | `boolean` | `false` |
| clearable | �クリアボタンを表示 | `boolean` | `true` |
| placeholder | プレースホルダー（省略時は format から生成） | `string` | `''` |
| format | 表示フォーマット（固定幅トークン、表示のみ） | `string` | `'yyyy-MM-dd'` |
| readonly | 読み取り専用（パネルを開かない） | `boolean` | `true` |
| rangeSeparator | 範囲セパレータ（範囲エコーの結合） | `string` | `'~'` |
| cellClassName | 日付セルのカスタムクラスコールバック | `(date: Date) => string` | — |
| popperClass | パネルのカスタムクラス | `string` | — |
| customClass | ルートノードのカスタムクラス | `string` | — |
| themeVars | コンポーネントレベルのテーマ変数（ConfigProvider を上書き） | `Record<string, string>` | — |
| sx | sx クイックレイアウト props（ルート要素、フローティングパネルには影響しない） | `LhSxProps` | — |

::: tip mode の値
`'datetime'` と `'range'` は**型予約**です：`LhDatePickerMode`（share core）には含まれますが、時刻列と範囲パネルは未実装（バックログ P-08）のため、今は `'date'` / `'month'` / `'year'` のみご使用ください。
:::

### Events

| Event | 説明 | パラメータ |
| --- | --- | --- |
| update:modelValue | 値の変更（v-model） | `(value: Date \| [Date, Date] \| null)` |
| change | 値の確定（update:modelValue と同じペイロード） | `(value: Date \| [Date, Date] \| null)` |

### アクセシビリティ

- トリガーは `role="combobox"`（`aria-expanded` / `aria-haspopup="dialog"` / パネルを指す `aria-controls`）。属性パックは share の `getDatePickerTriggerAria` が生成します
- パネルは `role="dialog"`；カレンダーは `role="grid"`、日付セルは `role="gridcell"` で `aria-selected` / `aria-current="date"`（今日）/ `aria-disabled`（無効）を持ちます
- 日付セルの `aria-label` は「YYYY年M月D日 曜日X」の完全なテキストで、スクリーンリーダーが認識できます
- 月送りボタンは `role="button"` + `aria-label`（言語パック `datepicker.prevMonth` / `datepicker.nextMonth`）
- キーボードのグリッドナビゲーションとトリガーのキーボード操作は H5 のみです。下記のプラットフォーム差異を参照してください

::: tip プラットフォーム差異（Vue3 版との差異）
- **パネル型の選択**：plus のカレンダーパネルは元々パネル型（ホイール型選択器ではない）で、本ポートは同じ操作系を維持しています。フローティングレイヤーの载体は `Teleport to="body"` から `lh-root-portal`（旧バージョンではページ内 fixed のフォールバック）に変更、位置決めは二段階の非同期計測（非表示で描画してサイズ計測 → `computePosition` で位置決め → 表示、ちらつき防止）で行い、トランジションは割り当てていません。
- **要素の対応付け**：plus の `<div>` / `<button>` / `<input>` はすべて `<view>` に置換；トリガーのエコーとプレースホルダーは `<text>` 自描きです（MP は `::placeholder` 非対応、プレースホルダー色は SFC インラインの修飾クラスが同じトークンで補色します）；月送り / 今日 / OK ボタンの無効状態はクラスで表現します（view に `:disabled` 疑似クラスはありません）。
- **外面クリックで閉じる**：plus はドキュメントレベルの click を監視しますが、本ポートではページ内の透明マスクのタップで閉じます（同義、MP に document はありません）。マスクのタップは閉じるだけで change は発火しません。
- **キーボードナビゲーションは H5 のみ**：トリガーの Enter / Space、グリッドの矢印移動（月送り含む）/ Home / End / PageUp / PageDown、roving tabindex、Escape によるスタックトップ CLOSE は、MP にキーボードイベントがないため条件コンパイルの番兵で呼び出しません。MP バンドルにデッドコードはありません。
- **aria 属性は一つずつ明示的にバインド**：plus テンプレートの share `LhAriaAttrs` 属性パックは `v-bind` で展開できません（MP テンプレートコンパイラが非対応）ため、グルー層が `aria-*` キーを個別の値に展開してバインドします。契約は引き続き share の純関数が決定します。
- **値型の契約**：plus と完全に同一——バインド値は `Date` / `[Date, Date]` で、ISO 日付文字列を双方向で扱うことはありません；`format` は表示層のみに作用します。
:::
