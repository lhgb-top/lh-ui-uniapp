# Slider スライダー

トラック上のつまみをドラッグして数値を選ぶスライダーです。単一つまみと範囲（つまみ 2 つ）モード、`step` ステップ吸着、`marks` 目盛りラベルをサポートします。トラック・つまみ・塗りつぶしバーはすべて `view` の自描画で、値のクランプ / ステップ吸着 / 目盛りの並び替え / アクセシビリティ契約はすべて `@lh-ui/share` の純粋関数をそのまま利用します（コピーなし）。

## 基本的な使い方

```vue
<template>
  <lh-slider v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref(30)
</script>
```

`modelValue` を渡さないときは `min` で内部状態を初期化します。渡せば制御付きになります（他のフォーム系コンポーネントと同じ）。ドラッグ中は内部状態だけ更新され、**ドロップ時に `update:modelValue` / `change` が一度だけ送出されます**（Vue3 版と同じ）。

## 範囲選択

`range` でつまみ 2 つのモープになり、`modelValue` は `[開始, 終了]` のタプルです：

```vue
<template>
  <lh-slider v-model="span" range />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const span = ref<[number, number]>([20, 60])
</script>
```

片側をもう一方を越えてドラッグすると両端が入れ替わります（指の下にあるつまみが常にドラッグ対象）で、値は常に `[早, 遅]` を保ちます。

## ステップと目盛り

`step` はつまみをステップ格子に吸着させます；`marks` は「数値 → ラベル」のマッピングで目盛りラベルを描画します（数値順にソート）：

```vue
<template>
  <lh-slider v-model="value" :min="0" :max="100" :step="10" :marks="marks" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref(30)
const marks: Record<number, string> = {
  0: '0',
  50: '中間',
  100: '最大',
}
</script>
```

## 無効化

`disabled` はドラッグとキーボード操作を無効化し、つまみをタブ順序から外します：

```vue
<template>
  <lh-slider v-model="value" disabled />
</template>
```

## 数値の表示

`show-input` はトラック右側に現在値を表示します（範囲モードでは `[開始, 終了]` 文字列）：

```vue
<template>
  <lh-slider v-model="value" show-input />
</template>
```

## Slider API

### Props

| Prop | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| modelValue | 現在値（制御付き v-model。範囲モードはタプル） | `number \| [number, number]` | — |
| min | 最小値 | `number` | `0` |
| max | 最大値 | `number` | `100` |
| step | ステップ幅（つまみが吸着する最小単位） | `number` | `1` |
| disabled | 全体を無効化 | `boolean` | `false` |
| range | 範囲モード（つまみ 2 つ） | `boolean` | `false` |
| showInput | トラック右側に現在値を表示 | `boolean` | `false` |
| size | サイズ | `'small' \| 'medium' \| 'large'` | `'medium'` |
| marks | 目盛りラベル（キーが値、昇順ソート） | `Record<number, string>` | — |
| customClass | ルートノードに渡すカスタムクラス名 | `string` | — |
| sx | sx レイアウトショートハンド（ルートノードに適用） | `LhSxProps` | — |

### Events

| Event | 説明 | Parameters |
| --- | --- | --- |
| update:modelValue | 値変化（v-model。ドラッグ終了またはキーボード操作時に送出） | `(value: number \| [number, number])` |
| change | 値変化（update:modelValue と同じペイロード） | `(value: number \| [number, number])` |

### アクセシビリティ

- つまみは `role="slider"` で、`aria-valuemin` / `aria-valuemax` / `aria-valuenow` / `aria-valuetext` を持ちます（契約は share の `getSliderThumbAria` が決定）
- 範囲モードでは 2 つのつまみに異なる `aria-label` を割り当てます（「開始つまみ / 終了つまみ」。ロケールキー `slider.thumbStart` / `slider.thumbEnd`、範囲外は `slider.thumb`）
- キーボード操作（方向キーで `step` 移動、PageUp / PageDown で大幅移動、Home / End で端へジャンプ）は H5 のみです。下記のプラットフォーム差異を参照

::: tip プラットフォーム差異（Vue3 版との差異）
- **ドラッグの仕組み**: plus はつまみに `mousedown` / `touchstart` を付けたあと move / up 監視を `document` に移しますが、ミニプログラムには document がないため、`touchstart` / `touchmove` / `touchend` はそのままつまみに紐づけます（ミニプログラムの touch イベントは touchstart のターゲットに届き続けるため、グローバル監視は不要）。H5 は document レベルのマウス監視を維持し（マウスダウン後、コンポーネント外に出てもドラッグ継続）、条件コンパイルで守ります。MP バンドルにデッドコードはありません。
- **位置計算は非同期**: plus は同期 `getBoundingClientRect` でトラック矩形を測りますが、ミニプログラムには非同期の `createSelectorQuery` しかないため、アダプター層の `getSingleLhRect` を使います。測定結果はドラッグセッションごとにキャッシュされ（touchstart 時に予備測定）、通常のドラッグではほぼ影響ありません。ただし**値の更新はタッチより 1 フレーム遅れる**という意味では非同期です。move イベント内で「值はもう更新された」と同期的に想定しないでください。送出はドラッグ終了時 only です。
- **トラック幅 0 はスキップ**: レイアウト前（またはテスト環境）などトラック矩形の幅が 0 のとき、0 除算で NaN になるのを避け、その更新をスキップします。
- **キーボード操作は H5 のみ**: 方向キー / Home / End / PageUp / PageDown のステップ移動は MP にキーボードイベントがないため、条件コンパイルで呼び出し自体を省きます。MP バンドルにデッドコードはありません。
- **aria 属性は個別に明示バインド**: share の `LhAriaAttrs` パックは `v-bind` で展開できません（MP テンプレートコンパイラが未対応）。グルー層が `aria-*` キーを個別の値に展開してバインドします。契約は引き続き share の純粋関数が決定します。
- **vertical 縦指向とツールチップは非提供**: plus の原本に `vertical`（縦トラック）と tooltip バブルの prop はなく、本ラッパーも厳密に合わせて追加しません。縦が必要なら外側のコンテナを回転させ（タッチ座標は自前で処理）、値の吹き出しが必要なら `show-input` で常時表示してください。
:::
