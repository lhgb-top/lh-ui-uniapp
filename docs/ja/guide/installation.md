# インストール

## 依存関係

- `@lh-ui/share` は自動的にインストールされます（本ライブラリ唯一のランタイム依存）。
- uni-app Vue3 プロジェクト（`@dcloudio/uni-app` 3.x）。
- WeChat ミニプログラムは**基礎ライブラリ ≥ 2.25.2**（root-portal）が必要です。低いバージョンではページ内 fixed のフォールバックに降格します。

## 方法 1：easycom によるオンデマンド導入（推奨）

インストール後、`pages.json` に easycom ルールを 1 行追加します：

```json
{
  "easycom": {
    "autoscan": false,
    "custom": {
      "^lh-(.*)": "@lh-ui/uniapp/src/components/lh-$1/lh-$1.vue"
    }
  }
}
```

あとはテンプレートにタグを直接書くだけで、**import も登録も不要**です：

```vue
<template>
  <lh-button type="primary" @click="onTap">ボタン</lh-button>
</template>
```

::: warning easycom 設定は即時反映されません
uni-app はコンパイル性能の都合上、**`pages.json` の easycom を変更しても再コンパイルがトリガーされません**。ルールを変更した後は、
ページの内容を少しいじる（または dev server を再起動する）と反映されます。これは uni-app の既存挙動であり、本ライブラリの問題ではありません。
:::

## 方法 2：一括登録

easycom を使わない場合（例：H5 プロジェクトで一括導入したい場合）は `app.use` を使います：

```ts
// main.ts
import { createSSRApp } from 'vue'
import lhUiUniapp from '@lh-ui/uniapp'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  app.use(lhUiUniapp)
  return { app }
}
```

## スタイルのインポート

**どちらの方法でも 2 つの CSS 成果物をインポートする必要があります**（利用側の sass 依存はゼロで、スタイルはビルド時に自足 CSS へ精製済み）：

```ts
// main.ts
import '@lh-ui/uniapp/src/theme/index.css' // テーマ変数（page { --lh-* } + page.dark ダークモード）
import '@lh-ui/uniapp/src/icon/iconfont.css' // アイコンフォント（lh-icon コンポーネントが依存）
```

::: tip なぜ scss ソースではなくビルド時の成果物なのか
uni-app プロジェクトの sass `loadPaths` には `node_modules` が含まれず、`@use '@lh-ui/share/...'` のような
bare specifier は解決できないため、直接参照するとコンパイルが必ず失敗します。そこで本ライブラリはビルド時に自足 CSS を出力し、
コンポーネント SFC は `<style src="./style.css">` でインポートします。これはつまり、**利用側が sass をインストールする必要がない**ということでもあります。
:::

## 命令的サービスにはマウントポイントが必要

Message / Loading はミニプログラムでは JS で DOM を作成できないため、**マウントポイントパターン**を採用しています。使用したいページ
（またはルートコンポーネント）にマウントポイントコンポーネントを置きます：

```vue
<template>
  <lh-config-provider :theme="theme">
    <view class="content"><!-- ページの内容 --></view>

    <!-- 命令的サービスのマウントポイント -->
    <lh-message />
    <lh-loading />
  </lh-config-provider>
</template>

<script setup lang="ts">
import { useLhMessage } from '@lh-ui/uniapp'

const { success } = useLhMessage()
const onTap = () => success('操作が完了しました')
</script>
```

::: danger マウントポイントがないと警告が出ます
`useLhMessage()` を呼び出したのにページに `<lh-message />` がない場合、開発時に `console.error` で明確な警告が出ます。
**無言のフォールバックは行いません**。これは意図的な設計です。無言のフォールバックは「呼び出しは効いているように見えて実際には何も起きない」という
隠れた bug を生むからです。
:::

## TypeScript

本ライブラリは型を同梱しており、コンポーネントの Props / イベントには完全な型推論が付きます。easycom 形態では、テンプレート内のタグの型は
`uni-app` のコンポーネント型システムが提供します（プロジェクトでグローバルコンポーネント型を設定していない場合は、`LhXxxProps` で明示的に注記すれば十分です）。
