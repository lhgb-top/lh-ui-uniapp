# ConfigProvider グローバル設定

グローバル設定コンポーネントです。子孫コンポーネントにサイズ、言語、テーマモード、テーマ変数を提供します。

::: tip ミニプログラム端のダーク実装
Web 版（plus）のダーク切り替えは `document.documentElement` を操作しますが、ミニプログラムには document がありません。
本ライブラリのダークは**ラップするノードに `dark` クラスを追加する**ことで実装しています —— 精製後のスタイルではダークブロックのセレクタが
`page.dark, .dark` になるため、ダークのスコープは ConfigProvider がラップする範囲に従います。
:::

## 基本的な使い方

```vue
<template>
  <lh-config-provider :size="size" :locale="locale" :theme="theme" :theme-vars="themeVars">
    <view class="app">
      <lh-button type="primary">ボタン</lh-button>
    </view>
  </lh-config-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const size = ref<'small' | 'medium' | 'large'>('medium')
const locale = ref<'zh-CN' | 'en-US'>('zh-CN')
const theme = ref<'light' | 'dark'>('light')
const themeVars = ref({
  'primary-color': '#1677ff',
  'bg-pattern': 'var(--lh-pattern-willow)',
})
</script>
```

## Props

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| size | グローバルサイズ | `'small' \| 'medium' \| 'large'` | — |
| locale | グローバル言語 | `'zh-CN' \| 'en-US'` | — |
| theme | テーマモード（uni-app 端で新規追加） | `'light' \| 'dark'` | `'light'` |
| themeVars | グローバルテーマ変数（キー名には自動で `--lh-` 接頭辞が付く） | `Record<string, string>` | — |
| componentTheme | コンポーネントごとに個別にテーマ変数を設定し、グローバルの themeVars を上書き | `Partial<Record<LhThemeableComponent, Record<string, string>>>` | — |

### themeVars がサポートするキー

- テーマ色：`primary-color` / `success-color` / `warning-color` / `danger-color` / `info-color`
- 中華風の色：`gold-color` / `vermilion-color` / `jade-color`
- ニュートラル色：`bg-color` / `text-color` / `border-color`
- 紋様：`bg-pattern`（例：`var(--lh-pattern-willow)`）/ `bg-pattern-opacity` / `bg-pattern-color`
- 装飾：`decoration-color`

### 優先度

コンポーネント自身の props > `componentTheme[コンポーネント名]` > グローバルの `themeVars`。
