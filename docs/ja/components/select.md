# Select セレクト

## 基本的な使い方

```vue
<template>
  <lh-select v-model="value" :options="options" placeholder="選択してください" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref()
const options = [
  { label: '選択肢 1', value: 'a' },
  { label: '選択肢 2', value: 'b' },
  { label: '無効な項目', value: 'c', disabled: true },
]
</script>
```

## クリア可能 / フィルタ可能

```vue
<template>
  <lh-select v-model="value" :options="options" clearable />
  <lh-select v-model="value" :options="options" filterable placement="bottom" />
</template>
```

## Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| modelValue (v-model) | バインディング値 | `unknown` | — |
| options | 選択肢リスト | `LhSelectOption[]` | — |
| size | サイズ | `'small' \| 'medium' \| 'large'` | — |
| disabled | 無効 | `boolean` | `false` |
| clearable | クリア可能 | `boolean` | `false` |
| placeholder | プレースホルダーのテキスト | `string` | — |
| filterable | フィルタ可能（MP 端はポップアップ内に入力フィールドを提供） | `boolean` | `false` |
| placement | ポップアップの位置（12 種の方位） | `LhPlacement` | `'bottom'` |
| customClass | カスタムクラス名 | `string` | — |
| themeVars | コンポーネントレベルのテーマ変数 | `Record<string, string>` | — |
| sx | クイックレイアウトプロパティ | `LhSxProps` | — |

### LhSelectOption

| プロパティ | 説明 | 型 |
| --- | --- | --- |
| label | 表示文言 | `string` |
| value | 値 | `unknown` |
| disabled | 無効 | `boolean` |

## Events

| イベント | 説明 | コールバックパラメータ |
| --- | --- | --- |
| update:modelValue | 値の変化 | `(value)` |
| change | 値の変化（クリア時は `undefined` を含む） | `(value)` |
| visible-change | ポップアップの表示 / 非表示 | `(visible: boolean)` |

::: tip Vue3 版との差異
- ポップアップは `root-portal` + 2 フレームの非同期計測定位で動作します（absolute 定位ではありません）。
- **キーボードナビゲーション（↑↓ / Home / End）は H5 のみ**。ミニプログラムにはキーボードイベントがなく、コンパイル期に削除されます —— MP 端では選択肢をタップするしかありません。
- `filterable` のフィルタ入力フィールドは MP 端ではポップアップの内部にレンダリングされます。
:::
