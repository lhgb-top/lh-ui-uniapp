# TimePicker 時間選択器

時間を選択するためのコンポーネントです。トリガーをクリックするとパネルが開き、各列（時/分/秒）は独立して縦スクロールするリストです。列項目をクリックして選択し、下部の「現在 / OK」ボタンで確定します。

## 基本的な使い方

```vue
<template>
  <lh-time-picker v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

デフォルトの `format` は `HH:mm:ss` で、パネルには時/分/秒の 3 列が表示されます。列項目のクリックで即座に選択され（パネルは開いたまま）、「OK」で `Date` を確定してパネルを閉じます。「現在」で現在時刻を各列に反映します。

## 時分フォーマット

`format` に `ss` が含まれない場合、パネルには時/分の 2 列のみが表示され、プレースホルダーも `format` から生成されます：

```vue
<template>
  <lh-time-picker v-model="value" format="HH:mm" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## 時間範囲

`start` / `end` で時間列の選択範囲を限定します（0~23 との共通部分）。範囲外の既存値は範囲内に丸められ、「現在」も同様に丸められます：

```vue
<template>
  <lh-time-picker v-model="value" :start="8" :end="20" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## ステップ

`step-hour` / `step-minute` / `step-second` で各列のオプション間隔を指定します：

```vue
<template>
  <lh-time-picker v-model="value" :step-hour="2" :step-minute="5" :step-second="10" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## 無効化

`disabled` でピッカー全体を無効化します（パネルは開かず、クリアアイコンも非表示）：

```vue
<template>
  <lh-time-picker v-model="value" disabled />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## プレースホルダーとクリア

`placeholder` でプレースホルダーを上書きします（未指定時は `format` から言語パック `timepicker.hour/minute/second` を使って生成）。値がある場合、トリガー右側にクリアアイコンが表示され、クリックで空にします（`clearable` はデフォルト `true`）：

```vue
<template>
  <lh-time-picker v-model="value" placeholder="リマインダー時刻を選択" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(null)
</script>
```

## TimePicker API

### Props

| Prop | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| modelValue | バインドする時刻 | `Date \| null` | `null` |
| size | サイズ | `LhTimePickerSize` | `'medium'` |
| disabled | ピッカー全体を無効化 | `boolean` | `false` |
| clearable | クリアボタンを表示 | `boolean` | `true` |
| placeholder | プレースホルダー（未指定時は format から言語パック `timepicker.hour/minute/second` で生成） | `string` | — |
| format | 時刻フォーマット（`ss` がある場合のみ秒列を表示） | `string` | `'HH:mm:ss'` |
| readonly | 読み取り専用フラグ（トリガーは view 自描画で入力状態を持たないため、実質常に読み取り専用） | `boolean` | `false` |
| arrowControl | 矢印ボタンを表示（H5 のみ描画、キーボードステップと併用） | `boolean` | `false` |
| start | 開始時間（0~23 との共通部分） | `number` | `0` |
| end | 終了時間（0~23 との共通部分） | `number` | `24` |
| stepHour | 時間列のステップ | `number` | `1` |
| stepMinute | 分列のステップ | `number` | `1` |
| stepSecond | 秒列のステップ | `number` | `1` |
| customClass | カスタムクラス名（ルートノードに転送） | `string` | — |
| themeVars | コンポーネントレベルのテーマ変数 | `Record<string, string>` | — |
| sx | sx レイアウトプロパティ（トリガーのルートに適用、パネルには影響しない） | `LhSxProps` | — |

### Events

| Event | 説明 | パラメータ |
| --- | --- | --- |
| update:modelValue | バインド値の変化時に発火 | `(value: Date \| null)` |
| change | 「OK」またはクリアアイコンクリック時に発火 | `(value: Date \| null)` |

### アクセシビリティ

- トリガーは `aria-haspopup="dialog"` / `aria-expanded` / `aria-controls` を持ちます（share の `getTimePickerTriggerAria` が産出する属性パックをキーごとに展開してバインド）
- パネルは `role="dialog"`、各列は `role="listbox"`（`aria-label` は言語パック `timepicker.hourLabel/minuteLabel/secondLabel`）、列項目は `role="option"` に `aria-selected` / `aria-disabled` を伴います
- ポジショニングエンジンは自作の純関数（flip / shift で画面外にはみ出さない）、サードパーティの実行時依存はありません

::: tip プラットフォーム差異（Vue3 版との差異）
- **ホイールを scroll-view 列パネルに変更**：plus の列コンテナは `overflow-y: auto` の `div` で `@wheel.prevent` がホイールをインターセプトしてステップ移動し、選択項目は `scrollIntoView` で表示位置に合わせていました。uni-app 版では各列を独立した縦スクロールの `scroll-view`（`scroll-y`）に変更しました（MP の `view` には信頼できるオーバーフロースクロールがないため）。選択項目は `scroll-into-view` で表示位置に合わせます（MP に `scrollIntoView` API はありません）。選択インタラクションは変わらず、列項目のクリックで選択、下部の「現在 / OK」で確定します。
- **ホイールステップは未移植**：列内のスクロールは `scroll-view` のネイティブスクロールに任せ（H5 ではホイールで長いリストが自然にスクロールします）、wheel イベントのインターセプトによる step ジャンプは行いません。ステップ付きオプションの生成（`step-hour` 等）は plus と同じです。
- **キーボードナビゲーションは H5 のみ**：トリガーは Enter/Space/下方向キーでパネルを開き、最初の列にフォーカスを移します。パネル内では ↑↓ で設定ステップ移動（時間はラップ後に start/end 範囲へ丸め）、←→ で列間を移動、Enter/Space で確定して閉じ、Escape はドキュメントレベルのリスナーで閉じます（複数のオーバーレイが重なる場合は最上位のみ）。処理全体は条件コンパイルでカットされ、MP バンドルにデッドコードはありません。
- **arrowControl は H5 のみ描画**：矢印ボタンはキーボードステップのセマンティクスに依存するため、MP では描画しません（テンプレートの `v-if` をコンパイル時の `LH_IS_H5` でガード）。
- **外部クリックで閉じる**：plus は document のクリックを監視しますが、uni-app 版ではページ内の透明マスクで扱います（マスクをクリックすると change を発火せずに閉じます）。
- **トリガーは自描画**：plus のトリガーは入力可能な `<input>` ですが、uni-app 版は `<view>` + `<text>` で自描画します（MP にはトリガー内の input フォーカスセマンティクスがなく、プレースホルダーの色は修飾クラスで補完、`readonly` は実質常にオンです）。
- **トリガーのアイコン**：plus は `date` アイコンを使いますが、本ライブラリでは意味的に合う `clock` アイコンを使います。
- **出入りのトランジションは未バインド**：MP の `Transition` は信頼できないため、tooltip / dropdown / popover / cascader と同様にパネルはそのまま表示・非表示を切り替えます。
:::
