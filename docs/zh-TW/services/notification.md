# Notification 通知

全域通知服務。在視口四角彈出帶標題與內文的卡片，常用於需要使用者留意的結果回饋。
與 Message / Loading 一樣是**掛載點模式**——小程式無法 JS 建立 DOM，頁面裡需要先放掛載點元件。

## 放置掛載點

在需要通知的頁面（或一個常駐的根包裹元件）裡放一次：

```vue
<template>
  <lh-config-provider>
    <view><!-- 頁面內容 --></view>
    <lh-notification />
  </lh-config-provider>
</template>
```

::: danger 未放掛載點會告警
若呼叫了 `useLhNotification()` 但頁面沒有 `<lh-notification />`，開發期會 `console.error`
明確告警，**不會靜默降級**。同 Message：靜默降級會讓「呼叫看似生效、實際沒反應」
變成隱蔽 bug。
:::

## 呼叫

```ts
import { useLhNotification } from '@lh-ui/uniapp'

const notification = useLhNotification()

notification.success({ title: '成功通知', content: '文件已寫入雲端' })
notification.info({ title: '資訊通知' })
notification.warning({ title: '警告通知' })
notification.danger({ title: '危險通知' })

// 四個角獨立彈出
notification.info({ title: '左上角', position: 'top-left' })

// 不自動關閉，手動收尾
const handle = notification.warning({ title: '常駐警告', duration: 0 })
handle.close()

// 關閉全部
notification.closeAll()
```

## 方法

| 方法 | 說明 | 參數 |
| --- | --- | --- |
| （直接呼叫） | `notification(options)` 開啟一條通知 | `(options: LhNotificationOptions)` |
| success / info / warning / danger | 開啟對應語意類型的通知 | `(options: LhNotificationOptions)` |
| close | 關閉指定 id 的通知 | `(id: number)` |
| closeAll | 關閉全部 | — |
| config | 修改全域預設設定 | `(config: LhNotificationConfig)` |

## LhNotificationOptions

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| title | 標題（必填） | `string` | — |
| content | 內文內容 | `string` | — |
| type | 語意類型 | `'success' \| 'info' \| 'warning' \| 'danger' \| 'error'` | `'info'` |
| duration | 自動關閉毫秒數，0 為不自動關閉 | `number` | `4500` |
| position | 彈出位置 | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` |
| showClose | 顯示關閉按鈕 | `boolean` | `true` |
| sx | sx 快速版局屬性 | `LhSxProps` | — |
| onClick | 點擊卡片回呼（傳入後卡片以 button 語意呈現） | `() => void` | — |
| onClose | 關閉（含自動與手動）後的回呼 | `() => void` | — |

::: tip error 類型
`error` 是 `danger` 的別名語意（share core 的 `LhNotificationType` 包含它），
服務方法與 plus 一致只暴露 success / info / warning / danger；需要 error 時
直接呼叫 `notification({ title: '...', type: 'error' })`。
:::

## 全域設定

```ts
const notification = useLhNotification()
notification.config({ duration: 3000, offset: 24 })
```

| 設定 | 說明 | 預設值 |
| --- | --- | --- |
| duration | 預設自動關閉毫秒數，0 為不自動關閉 | `4500` |
| offset | 距視口邊緣偏移（px） | `20` |

## 行為說明

- **四角獨立容器**：記錄按 `position` 分組渲染，同一角內按時間正序堆疊
  （貼底兩角為 `column-reverse`，新通知貼近底邊）；堆疊間距由樣式源
  `--lh-notification-gap`（預設 16px）控制。
- **自動關閉**：`duration` 毫秒後自動移除並觸發 `onClose`；`duration: 0` 表示常駐。
- **點擊卡片**：不關閉（與 plus 一致），只觸發 `onClick`；關閉只走關閉按鈕或自動計時。
- **無障礙**：四角容器 `role="region"` + `aria-live="polite"`；
  傳入 `onClick` 後卡片以 `role="button"` 呈現；關閉按鈕帶語言包 `notification.close`
  的無障礙名稱（share 語言包已收錄，切語言自動更新）。

## 平台差異（與 Vue3 版的差異）

- **掛載點模式**：plus 用 `createApp` 把 host 掛到 `document.body`；小程式沒有 `document`，
  改為「模組級單例 store + 頁面放 `<lh-notification />` 掛載點元件」，
  API 透過 `useLhNotification()` 暴露（plus 是 `LhNotification` 直接呼叫 + install 註冊）。
- **沒有 `appendTo`**：web 端可選掛載容器，小程式沒這個概念，彈出位置由掛載點元件渲染的
  四角 fixed 容器決定。
- **進出動畫降級**：plus 用 `TransitionGroup` 做滑入 / FLIP 讓位；小程式端
  `transitionend` 不可靠，首版直接增刪節點不做動畫（樣式源裡的過渡類名保留，
  H5 使用方如自行包 Transition 可復用）。
- **可點擊卡片的鍵盤語意不移植**：plus 對傳入 `onClick` 的卡片補 `tabindex` 與
  Enter / Space 鍵觸發；小程式無 DOM 焦點模型，僅保留點擊與 `role="button"` 語意。
