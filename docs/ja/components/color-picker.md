# ColorPicker カラーピッカー

トリガーをクリックするとカラーパネルが開きます：彩度 / 明度ボードのドラッグ + 色相 / 透明度スライダー + hex / rgb 入力 + プリセットカラーパレット。色の変換はすべて `@lh-ui/share/core/color-picker` の純粋関数で行い（hex/rgb と HSV の双空間を往復、各チャネルは常にクランプ）、H5 とミニプログラムで描画が一致します。

## 基本的な使い方

```vue
<template>
  <lh-color-picker v-model="color" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const color = ref('#2B4C7C')
</script>
```

## 透明度とプリセットカラーパレット

```vue
<template>
  <lh-color-picker
    v-model="color"
    show-alpha
    :predefine="predefine"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const color = ref('rgba(43, 76, 124, 0.6)')
// showAlpha を有効にすると hex 出力は 8 桁（#2b4c7c99）、rgb 出力は rgba() になります。alpha に値があれば黙って失われることはありません
const predefine = ['#2B4C7C', '#5B8C5A', '#C4A35A', '#B23A3A']
</script>
```

## 出力フォーマット

```vue
<lh-color-picker v-model="color" format="rgb" />
```

`format` は `v-model` の出力形式（`hex` または `rgb`）にのみ影響し、不正な値は `hex` にフォールバックします。

## サイズ / クリア / 無効化

```vue
<lh-color-picker v-model="color" size="small" />
<lh-color-picker v-model="color" clearable />
<lh-color-picker v-model="color" disabled />
```

`clearable` を有効にすると、値があるときにトリガー内にクリアボタンが表示され、クリックで値を空にして `clear` イベントを送出します。

## プログラムによる開閉

```vue
<template>
  <lh-color-picker ref="pickerRef" v-model="color" />
  <lh-button size="small" @click="pickerRef?.open()">パネルを開く</lh-button>
</template>
```

コンポーネントは ref 経由で `open` / `close` / `isOpen` を公開します。

## ColorPicker API

### Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| model-value | バインド値（制御付き v-model。hex または rgb() の文字列。format に従って出力） | string | `''` |
| format | 出力形式（不正な値は hex にフォールバック） | `'hex' \| 'rgb'` | `hex` |
| show-alpha | 透明度チャネル（有効にすると 8 桁の hex / rgba() を出力） | boolean | `false` |
| predefine | プリセットカラーパレット | string[] | `[]` |
| size | サイズ | `'mini' \| 'small' \| 'medium' \| 'large' \| 'x-large'` | `medium` |
| disabled | 無効化 | boolean | `false` |
| clearable | クリア（値を空にする）ボタン | boolean | `false` |
| placeholder | プレースホルダー（空値時。未指定時は言語パックの colorPicker.placeholder を使用） | string | `''` |
| aria-label | アクセシビリティ名（未指定時は言語パックの colorPicker.label を使用） | string | — |
| custom-class | カスタムクラス名（ルートノードに透過） | string | — |
| sx | sx クイックレイアウトプロパティ | LhSxProps | — |

### Events

| イベント | 説明 | コールバックパラメータ |
| --- | --- | --- |
| update:model-value | 色の変化（v-model） | `(value: string)` |
| change | 色の確定による変化（update:model-value と同じペイロード） | `(value: string)` |
| clear | クリアボタンをクリック | — |

### Expose

| メソッド | 説明 |
| --- | --- |
| open | パネルを開く |
| close | パネルを閉じる |
| isOpen | パネルが開いているかどうか（ref） |

### アクセシビリティ

- トリガーには `role="button"` + `aria-expanded` + `aria-label`（言語パックの colorPicker.label）が付きます
- 色相 / 透明度スライダーには `role="slider"` + `aria-valuenow/min/max` が付き、方向キーで微調整できます（Shift で加速）
- プリセットカラーパレットの各マスはクリック可能で、アクセシブルな名前は色値の文字列そのものです

::: tip プラットフォーム差異（Vue3 版との差異）
- ドラッグ軸：MP はタッチターゲットに沿って touchmove / touchend を送出し（document 監視は不要）、H5 は別途 document レベルのマウス監視を行います（コンポーネント外に出てもドラッグを継続）。パラダイムは Slider と同じです。
- パネル内の hex / rgb 入力は uni の `<input>` を使用します：Enter での送信は `@confirm`（キーボードの「完了」）、フォーカスアウトでの送信は `@blur` で行います（MP には keydown.enter がありません）。
- キーボード操作（方向キーでの微調整、Enter / Space での開閉、Esc で閉じる）は H5 のみ有効で、MP 端にはキーボードイベントがありません。
- パネルの位置決めは root-portal + 2 フレーム計測で行います（measure → 位置決め → 表示、点滅防止）。
:::
