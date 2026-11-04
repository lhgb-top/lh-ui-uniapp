# Rate レーティング

星評価：クリックで星を選択、半星とスコアテキストも任意に表示でき、読み取り専用状態では星評価テキストをスクリーンリーダー向けに出力します。充填段位・クランプ・ステップのアルゴリズムは `@lh-ui/share` core の純関数が产出します。

## 基本的な使い方

```vue
<template>
  <lh-rate v-model="value" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const value = ref(3)
</script>
```

## 半星

`allow-half` で半星を有効化：H5 では星の左半分をクリックすると 0.5 として記録されます（クリックの横方向オフセットで判定）。

```vue
<template>
  <lh-rate v-model="value" allow-half />
</template>
```

## 読み取り専用とスコアテキスト

`readonly` で純表示ブランチに入ります（`role="img"`、星評価テキストは `aria-label` 経由）；`show-score` でスコアテキストを追尾表示し、`score-template` でテンプレートをカスタマイズできます（`{n}` プレースホルダー）。

```vue
<template>
  <lh-rate :model-value="3.5" readonly allow-half show-score />
  <lh-rate :model-value="4" readonly show-score score-template="{n} 点" />
</template>
```

## 星数と文字のカスタマイズ

`max` で星数の上限を調整（[0, max] にクランプ）；`character` で既定の `★` を置き換えます。

```vue
<template>
  <lh-rate :model-value="5" :max="8" character="墨" />
</template>
```

## 無効化

`disabled` でグループ全体を無効化：クリックは反映されず、ルートに `lh-rate--disabled` と `aria-disabled` が付きます。

## Props

| Prop | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| modelValue / v-model | 現在の評価 | `number` | `0` |
| max | 星数の上限 | `number` | `5` |
| allow-half | 半星を許可 | `boolean` | `false` |
| readonly | 読み取り専用（純表示） | `boolean` | `false` |
| disabled | 無効化 | `boolean` | `false` |
| character | カスタム文字 | `string` | — |
| show-score | スコアテキストを表示 | `boolean` | `false` |
| score-template | スコアテンプレート（`{n}` プレースホルダー） | `string` | — |
| customClass | カスタムクラス（ルートノードへ転送） | `string` | — |
| sx | sx ショートハンドレイアウトプロパティ | `LhSxProps` | — |

## Events

| イベント | 説明 | 引数 |
| --- | --- | --- |
| update:modelValue / change | 評価が変化（同一値は再発火しません） | `(value: number)` |

## プラットフォームの違い

- **半星の判定は H5 のみ**：クリックイベントの横方向オフセット（`offsetX`）に依存しますが、**ミニプログラムのイベントにはこのフィールドがなく**、クリックは全星に退化管理されます。ミニプログラムで半星の精度が必要な場合は、touch イベント + `uni.createSelectorQuery` の非同期オフセット計算で自前実装してください（SelectorQuery は非同期である点に注意）。
- **星の要素**：plus の `<button>` 星は `<view role="radio">` になります（MP の button はデフォルトスタイルを reset できません）。無効化はクリックガード + `--disabled` 修飾クラス + `aria-disabled` で表現します。
- **キーボードステップは H5 のみ**：矢印キーで ±1（半星モードは ±0.5）、Home で 0、End で上限。ミニプログラムにはキーボードイベントがないため、挙動差は生じません。
- **スコアテキスト**：share locales の `rate.stars`（`{n} 星`、9 言語完備）を使用し、`score-template` で上書き可能です。

::: tip Vue3 版との違い
- ロジックの仕様（クランプ・充填段位・ステップ・aria）は plus と完全に一致します（同一の share core）。
- `customClass` prop が追加されています：uni-app ではカスタムクラスが `styleIsolation` を貫通できないため、prop 経由で転送します。
- 半星の判定はミニプログラムで全星に退化します（「プラットフォームの違い」参照）。
:::
