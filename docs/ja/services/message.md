# Message メッセージ

グローバルなメッセージ提示サービスです。**マウントポイントパターンを採用** —— ミニプログラムは JS で DOM を作成できないため、ページにまずマウントポイントコンポーネントを置く必要があります。

## マウントポイントを置く

メッセージを表示したいページ（または常駐するルートラップコンポーネント）に 1 回置きます：

```vue
<template>
  <lh-config-provider>
    <view><!-- ページの内容 --></view>
    <lh-message />
  </lh-config-provider>
</template>
```

## 呼び出し

```ts
import { useLhMessage } from '@lh-ui/uniapp'

const message = useLhMessage()

message.success('保存しました')
message.info('お知らせ')
message.warning('警告メッセージ')
message.danger('エラーメッセージ')
message.error('エラーメッセージ（danger の別名）')

// 自動クローズしない読み込み中プロンプト（duration: 0）、手動でクローズ
const handle = message.loading('読み込み中...')
// ...非同期処理の完了後
handle.close()

// すべてクローズ
message.closeAll()
```

::: danger マウントポイントがないと警告が出ます
`useLhMessage()` を呼び出したのにページに `<lh-message />` がない場合、開発時に `console.error` で
明確な警告が出ます。**無言のフォールバックは行いません**。これは意図的な設計です。無言のフォールバックは「呼び出しは効いているように見えて実際には何も起きない」を
隠れた bug にしてしまうからです。
:::

## メソッド

| メソッド | 説明 | パラメータ |
| --- | --- | --- |
| （直接呼び出し） | `message('xxx')` は `message.info('xxx')` と等価 | `(options: LhMessageOptions \| string)` |
| success / info / warning / danger / error | 対応するタイプのメッセージを表示 | `(content: string, options?: Partial<LhMessageOptions>)` |
| loading | 自動クローズしない読み込み中プロンプト（`duration: 0`）を表示し、handle を返して手動でクローズ | 同上 |
| close | 指定した id のメッセージをクローズ | `(id: number)` |
| closeAll | すべてクローズ | — |

## LhMessageOptions

| プロパティ | 説明 | 型 | デフォルト値 |
| --- | --- | --- | --- |
| content | 文言（必須） | `string` | — |
| type | タイプ | `'success' \| 'info' \| 'warning' \| 'danger' \| 'loading'` | `'info'` |
| duration | 表示時間（ミリ秒）。0 は自動クローズしない | `number` | `3000` |
| showClose | クローズボタンを表示 | `boolean` | `false` |
| offset | 上端からのオフセット（px） | `number` | — |
| onClose | クローズコールバック | `() => void` | — |

## グローバル設定

```ts
const message = useLhMessage()
message.config({ duration: 2000, max: 5, offset: 20 })
```

| 設定 | 説明 | デフォルト値 |
| --- | --- | --- |
| duration | デフォルトの表示時間（ミリ秒） | `3000` |
| max | 同一画面の最大件数 | — |
| offset | 上端からのオフセット | — |

::: tip Vue3 版との差異
- **`appendTo` はありません**：Web 版は `document.body` にマウントしますが、ミニプログラムにはこの概念がなく、マウント位置は
  `<lh-message />` がページ内にある位置で決まります。
- 進退アニメーションは CSS transition + setTimeout で時間を合わせます（`transitionend` はミニプログラムでは信頼できません）。
- 通知が必要な場合は Notification サービスを利用してください（「サービス」グループを参照）。
:::
