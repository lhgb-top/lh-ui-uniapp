# Loading ローディング

グローバルな読み込み中オーバーレイサービスです。Message と同じく**マウントポイントパターン**です。

## マウントポイントを置く

```vue
<template>
  <lh-config-provider>
    <view><!-- ページの内容 --></view>
    <lh-loading />
  </lh-config-provider>
</template>
```

## 呼び出し

```ts
import { useLhLoading } from '@lh-ui/uniapp'

const loading = useLhLoading()

// show はオプションオブジェクトまたは文言の文字列を受け取り、handle を返す
const handle = loading.show({ text: '読み込み中...' })
handle.close()

// すべてクローズ
loading.closeAll()
```

::: danger マウントポイントがないと警告が出ます
Message と同様：`useLhLoading()` を呼び出したのにページに `<lh-loading />` がない場合、
開発時に `console.error` で明確な警告が出ます。無言のフォールバックは行いません。
:::

## LhLoadingOptions

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| target | 対象ノード（**H5 のみ有効**。MP 端は常に全画面） | `string` | — |
| text | 読み込み中の文言 | `string` | — |
| background | オーバーレイの背景色 | `string` | — |
| lock | スクロールをロック（**H5 のみ有効**） | `boolean` | `false` |
| zIndex | 階層。渡さない場合は自動でインクリメントして割り当て | `number` | — |

## メソッド

| メソッド | 説明 | パラメータ |
| --- | --- | --- |
| show | 読み込み中オーバーレイを表示し、handle（`{ close }`）を返す | `(options: LhLoadingOptions \| string)` |
| close | 指定した id の読み込みをクローズ | `(id: number)` |
| closeAll | すべてクローズ | — |

## Vue3 版との差異

- `target` はミニプログラム端では**全画面オーバーレイのみ対応** —— ミニプログラムは任意のノードにオーバーレイを掛けられないため、
  初版の MP 端は `target` を無視します（フィールドは保持し、ドキュメントで宣言）。
- `lock` は H5 のみ有効。ミニプログラムには body のスクロールロックがありません。
- 複数インスタンスが重なるときは、`useLhZIndex` が後から開いたオーバーレイを上層に保証します。
