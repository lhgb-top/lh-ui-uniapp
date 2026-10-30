# Loading 載入

全域載入遮罩服務。與 Message 同樣是**掛載點模式**。

## 放置掛載點

```vue
<template>
  <lh-config-provider>
    <view><!-- 頁面內容 --></view>
    <lh-loading />
  </lh-config-provider>
</template>
```

## 呼叫

```ts
import { useLhLoading } from '@lh-ui/uniapp'

const loading = useLhLoading()

// show 接收選項物件或純文案字串，傳回 handle
const handle = loading.show({ text: '加载中...' })
handle.close()

// 關閉全部
loading.closeAll()
```

::: danger 未放掛載點會告警
同 Message：呼叫了 `useLhLoading()` 但頁面沒有 `<lh-loading />` 時，
開發期 `console.error` 明確告警，不靜默降級。
:::

## LhLoadingOptions

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| target | 目標節點（**僅 H5 生效**；MP 端恆為全螢幕） | `string` | — |
| text | 載入文案 | `string` | — |
| background | 遮罩背景色 | `string` | — |
| lock | 鎖定捲動（**僅 H5 生效**） | `boolean` | `false` |
| zIndex | 層級；不傳時自增分配 | `number` | — |

## 方法

| 方法 | 說明 | 參數 |
| --- | --- | --- |
| show | 顯示載入遮罩，傳回 handle（`{ close }`） | `(options: LhLoadingOptions \| string)` |
| close | 關閉指定 id 的載入 | `(id: number)` |
| closeAll | 關閉全部 | — |

## 與 Vue3 版的差異

- `target` 在小程序端**只支援全螢幕遮罩**——小程序無法選擇任意節點掛遮罩，
  首版 MP 端忽略 `target`（欄位保留，文件宣告）。
- `lock` 僅 H5 有效；小程序無 body 捲動鎖定。
- 多個實例疊加時，`useLhZIndex` 保證後開的遮罩在上層。
