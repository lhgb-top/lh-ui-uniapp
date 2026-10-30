# Dialog ダイアログ

## 基本的な使い方

```vue
<template>
  <lh-button @click="visible = true">ダイアログを開く</lh-button>

  <lh-dialog v-model="visible" title="タイトル" width="80%">
    <view>これはダイアログの内容です</view>
    <template #footer>
      <lh-button @click="visible = false">キャンセル</lh-button>
      <lh-button type="primary" @click="visible = false">確定</lh-button>
    </template>
  </lh-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
</script>
```

## 位置指定

```vue
<template>
  <lh-dialog v-model="visible" position="bottom" title="下部ポップアップ">
    <view>下部の内容</view>
  </lh-dialog>

  <lh-dialog v-model="visible" fullscreen title="全画面">
    <view>全画面の内容</view>
  </lh-dialog>
</template>
```

下部ポップアップは自動的に `env(safe-area-inset-bottom)` を伴い、全画面デバイスに適応します。

## Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| modelValue (v-model) | 表示するか | `boolean` | `false` |
| title | タイトル | `string` | — |
| width | 幅 | `string \| number` | — |
| top | 上部からの距離 | `string \| number` | — |
| fullscreen | 全画面 | `boolean` | `false` |
| position | 位置指定 | `'center' \| 'top' \| 'bottom'` | `'center'` |
| closeOnClickModal | オーバーレイのクリックでクローズ | `boolean` | `true` |
| closeOnPressEscape | Esc でクローズ（**MP にはキーボードイベントがなく、無効**） | `boolean` | `true` |
| lockScroll | 背景スクロールのロック（**H5 のみ有効**） | `boolean` | `true` |
| zIndex | 階層。渡さない場合は自動でインクリメントして割り当て | `number` | — |
| customClass | カスタムクラス名 | `string` | — |
| themeVars | コンポーネントレベルのテーマ変数 | `Record<string, string>` | — |
| sx | クイックレイアウトプロパティ | `LhSxProps` | — |

## Slots

| スロット | 説明 |
| --- | --- |
| default | 内容 |
| footer | 下部のボタンエリア |

## Events

| イベント | 説明 | コールバックパラメータ |
| --- | --- | --- |
| update:modelValue | 表示 / 非表示の変化 | `(visible: boolean)` |
| open | 開く | — |
| close | 閉じる | — |

::: tip Vue3 版との差異
- ポップアップのマウントは `root-portal` 経由です（H5 は teleport、MP は root-portal またはページ内 fixed への降格）。
- **focus-trap は MP 端では使用できません**：`LH_IS_H5` のコンパイル期ガードが直接 false を返し、focus-trap を呼び出しません。
- **lockScroll は MP 端では無効です**：ミニプログラムには body のスクロールロックがなく、オーバーレイによるクリック遮断でフォールバックします。
- `closeOnPressEscape` は MP 端では無効です（キーボードイベントがないため）。
:::
