# Message 訊息提示

全域訊息提示服務。**採用掛載點模式**——小程序無法 JS 建立 DOM，頁面裡需要先放掛載點元件。

## 放置掛載點

在需要訊息提示的頁面（或一個常駐的根包裹元件）裡放一次：

```vue
<template>
  <lh-config-provider>
    <view><!-- 頁面內容 --></view>
    <lh-message />
  </lh-config-provider>
</template>
```

## 呼叫

```ts
import { useLhMessage } from '@lh-ui/uniapp'

const message = useLhMessage()

message.success('保存成功')
message.info('提示信息')
message.warning('警告信息')
message.danger('错误信息')
message.error('错误信息（danger 别名）')

// 不自動關閉的載入提示（duration: 0），手動關閉
const handle = message.loading('加载中...')
// ...非同步完成後
handle.close()

// 關閉全部
message.closeAll()
```

::: danger 未放掛載點會告警
若呼叫了 `useLhMessage()` 但頁面沒有 `<lh-message />`，開發期會 `console.error`
明確告警，**不會靜默降級**。這是刻意設計：靜默降級會讓「呼叫看似生效、實際沒反應」
變成隱蔽 bug。
:::

## 方法

| 方法 | 說明 | 參數 |
| --- | --- | --- |
| （直接呼叫） | `message('xxx')` 等價於 `message.info('xxx')` | `(options: LhMessageOptions \| string)` |
| success / info / warning / danger / error | 彈出對應類型的訊息 | `(content: string, options?: Partial<LhMessageOptions>)` |
| loading | 彈出不自動關閉的載入提示（`duration: 0`），傳回 handle 手動關閉 | 同上 |
| close | 關閉指定 id 的訊息 | `(id: number)` |
| closeAll | 關閉全部 | — |

## LhMessageOptions

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| content | 文案（必填） | `string` | — |
| type | 類型 | `'success' \| 'info' \| 'warning' \| 'danger' \| 'loading'` | `'info'` |
| duration | 顯示時長（毫秒），0 為不自動關閉 | `number` | `3000` |
| showClose | 顯示關閉按鈕 | `boolean` | `false` |
| offset | 距頂偏移（px） | `number` | — |
| onClose | 關閉回呼 | `() => void` | — |

## 全域設定

```ts
const message = useLhMessage()
message.config({ duration: 2000, max: 5, offset: 20 })
```

| 設定 | 說明 | 預設值 |
| --- | --- | --- |
| duration | 預設顯示時長（毫秒） | `3000` |
| max | 同螢幕最大條數 | — |
| offset | 距頂偏移 | — |

::: tip 與 Vue3 版的差異
- **沒有 `appendTo`**：web 端往 `document.body` 掛，小程序沒這個概念，掛載點位置由
  `<lh-message />` 在頁面裡的位置決定。
- 進出動畫用 CSS transition + setTimeout 對齊時長（`transitionend` 在小程序不可靠）。
- 通知類元件（Notification）首版缺席，用 Message 替代。
:::
