# Input 入力フィールド

## 基本的な使い方

```vue
<template>
  <lh-input v-model="text" placeholder="入力してください" />
  <lh-input v-model="text" type="textarea" :rows="3" autosize placeholder="複数行" />
  <lh-input v-model="text" type="password" placeholder="パスワード" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>
```

## プレースホルダースタイル（MP では必須）

::: warning ミニプログラムは `::placeholder` 非対応
WeChat ミニプログラムの WXSS は `::placeholder` 疑似要素に対応していません。プレースホルダースタイルは prop で渡し、
CSS に `::placeholder` を**書かない**でください（ビルド時のゲートでもブロックされます）。
:::

```vue
<lh-input placeholder="入力してください" placeholder-style="color: #999; font-size: 13px" />
<!-- またはクラス名を使う -->
<lh-input placeholder="入力してください" placeholder-class="my-placeholder" />
```

## アイコン付きと状態

```vue
<template>
  <lh-input v-model="text" prefix-icon="search" placeholder="検索" clearable />
  <lh-input v-model="text" suffix-icon="close" placeholder="サフィックスアイコン" />
  <lh-input v-model="text" state="error" placeholder="バリデーション失敗の状態" />
  <lh-input v-model="text" :maxlength="20" show-word-limit placeholder="文字数カウント" />
</template>
```

## Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| modelValue (v-model) | バインディング値 | `string` | — |
| type | タイプ | `'text' \| 'textarea' \| 'password' \| 'number' \| 'email' \| 'url' \| 'tel' \| 'date' \| 'time'` | `'text'` |
| size | サイズ | `'small' \| 'medium' \| 'large'` | — |
| disabled | 無効 | `boolean` | `false` |
| readonly | 読み取り専用 | `boolean` | `false` |
| placeholder | プレースホルダーのテキスト | `string` | — |
| placeholderStyle | プレースホルダーのインラインスタイル（`::placeholder` を代替） | `string` | — |
| placeholderClass | プレースホルダーのクラス名（placeholderStyle といずれか一方） | `string` | — |
| maxlength | 最大長 | `number` | — |
| minlength | 最小長 | `number` | — |
| showWordLimit | 文字数カウントを表示 | `boolean` | `false` |
| clearable | クリア可能 | `boolean` | `false` |
| prefixIcon | プレフィックスアイコン | `LhIconName` | — |
| suffixIcon | サフィックスアイコン | `LhIconName` | — |
| state | バリデーション状態 | `'error' \| 'success' \| 'warning'` | — |
| name | ネイティブ name（フォーム収集用） | `string` | — |
| password | パスワードモード | `boolean` | `false` |
| rows | textarea の行数 | `number` | — |
| autosize | textarea の高さ自動調整（MP の auto-height） | `boolean` | `false` |
| label | ラベルの文言 | `string` | — |
| customClass | カスタムクラス名 | `string` | — |
| themeVars | コンポーネントレベルのテーマ変数 | `Record<string, string>` | — |
| sx | クイックレイアウトプロパティ | `LhSxProps` | — |

## Events

| イベント | 説明 | コールバックパラメータ |
| --- | --- | --- |
| update:modelValue | 値の変化 | `(value: string)` |
| input | 入力（`event.detail.value` を取得） | `(value: string)` |
| blur | フォーカス外れ | — |
| focus | フォーカス | — |
| clear | クリア | — |

::: tip Vue3 版との差異
`autocomplete` / `autofocus` / `resize` / `form` / `tabindex` / `nativeType` /
`inputStyle` はミニプログラムに対応する機能がないため、本ライブラリでは**実装しません**。`autosize` はミニプログラムの textarea
の `auto-height` 属性を使います。
:::
