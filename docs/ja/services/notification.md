# Notification

グローバル通知サービス。ビューポートの四隅にタイトルと本文のあるカードを表示し、ユーザーの注意が必要な結果フィードバックによく使われます。Message / Loading と同様に**マウントポイント方式**を採用しています——ミニプログラムは JS で DOM を作成できないため、ページに先にマウントポイントコンポーネントを置く必要があります。

## マウントポイントの設置

通知が必要なページ（または常駐するルートラッパーコンポーネント）に一度置きます：

```vue
<template>
  <lh-config-provider>
    <view><!-- ページ内容 --></view>
    <lh-notification />
  </lh-config-provider>
</template>
```

::: danger マウントポイント未設置時は警告
`useLhNotification()` を呼び出したのにページに `<lh-notification />` がない場合、開発中に `console.error` で明示的に警告され、**サイレントに劣化しません**。Message と同様：サイレント劣化は「呼び出しは成功したように見えるが何も起きない」という見えないバグになります。
:::

## 呼び出し

```ts
import { useLhNotification } from '@lh-ui/uniapp'

const notification = useLhNotification()

notification.success({ title: '成功通知', content: 'ドキュメントをクラウドに書き込みました' })
notification.info({ title: '情報通知' })
notification.warning({ title: '警告通知' })
notification.danger({ title: '危険通知' })

// 四隅それぞれ独立して表示
notification.info({ title: '左上', position: 'top-left' })

// 自動で閉じない、手動で閉じる
const handle = notification.warning({ title: '常駐警告', duration: 0 })
handle.close()

// すべて閉じる
notification.closeAll()
```

## メソッド

| メソッド | 説明 | 引数 |
| --- | --- | --- |
| （直接呼び出し） | `notification(options)` で通知を開く | `(options: LhNotificationOptions)` |
| success / info / warning / danger | 対応するセマンティック型の通知を開く | `(options: LhNotificationOptions)` |
| close | 指定 id の通知を閉じる | `(id: number)` |
| closeAll | すべて閉じる | — |
| config | グローバルデフォルト設定を変更 | `(config: LhNotificationConfig)` |

## LhNotificationOptions

| プロパティ | 説明 | 型 | デフォルト |
| --- | --- | --- | --- |
| title | タイトル（必須） | `string` | — |
| content | 本文 | `string` | — |
| type | セマンティック型 | `'success' \| 'info' \| 'warning' \| 'danger' \| 'error'` | `'info'` |
| duration | 自動閉じまでのミリ秒、0 は自動閉じなし | `number` | `4500` |
| position | 表示位置 | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` |
| showClose | 閉じるボタンを表示 | `boolean` | `true` |
| sx | sx クイックレイアウト属性 | `LhSxProps` | — |
| onClick | カードクリックコールバック（指定するとカードは button として振る舞う） | `() => void` | — |
| onClose | 閉じた（自動・手動とも）後のコールバック | `() => void` | — |

::: tip error 型について
`error` は `danger` の別名セマンティクスです（share core の `LhNotificationType` に含まれます）。サービスメソッドは plus に合わせて success / info / warning / danger のみを公開しています。error が必要な場合は `notification({ title: '...', type: 'error' })` を直接呼び出してください。
:::

## グローバル設定

```ts
const notification = useLhNotification()
notification.config({ duration: 3000, offset: 24 })
```

| 設定 | 説明 | デフォルト |
| --- | --- | --- |
| duration | デフォルトの自動閉じミリ秒、0 は自動閉じなし | `4500` |
| offset | ビューポート端からのオフセット（px） | `20` |

## 動作仕様

- **四隅の独立コンテナ**：レコードは `position` ごとにグループ化して描画され、同じ隅内では時間順にスタックします（底辺側の 2 か所は `column-reverse` で、新しい通知が下端に寄ります）。スタック間隔はスタイルソースの `--lh-notification-gap`（デフォルト 16px）で制御します。
- **自動閉じ**：`duration` ミリ秒後に自動的に除去され `onClose` が発火します。`duration: 0` は常駐を意味します。
- **カードクリック**：閉じません（plus と同一）。`onClick` を発火するだけです。閉じるのは閉じるボタンか自動タイマーのみです。
- **アクセシビリティ**：四隅のコンテナは `role="region"` + `aria-live="polite"`。`onClick` を渡したカードは `role="button"` として描画されます。閉じるボタンには言語パック `notification.close` のアクセシブルネームが付きます（share 言語パックに収録済み、言語切替で自動更新）。

## プラットフォーム差異（Vue3 版との差異）

- **マウントポイント方式**：plus は `createApp` で host を `document.body` にマウントしますが、ミニプログラムに `document` はありません。「モジュールレベルのシングルトン store + ページに `<lh-notification />` を置く」方式に変更し、API は `useLhNotification()` で公開します（plus は `LhNotification` の直接呼び出し + install 登録）。
- **`appendTo` なし**：web 版はマウント先コンテナを選べますが、ミニプログラムにその概念はなく、表示位置はマウントポイントコンポーネントが描画する四隅の fixed コンテナで決まります。
- **表示/非表示アニメーションの縮退**：plus は `TransitionGroup` でスライドイン / FLIP を行いますが、ミニプログラムでは `transitionend` が信頼できないため、初版はノードの追加・除去のみでアニメーションしません（スタイルソースのトランジションクラス名は残しており、H5 で自前の Transition を包めば再利用できます）。
- **クリック可能カードのキーボードセマンティクスは未移植**：plus は `onClick` を渡したカードに `tabindex` と Enter / Space キー操作を補完しますが、ミニプログラムには DOM フォーカスモデルがないため、クリックと `role="button"` のセマンティクスのみ残します。
