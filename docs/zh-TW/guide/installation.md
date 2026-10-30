# 安裝

## 依賴

- `@lh-ui/share` 會被自動安裝（本庫唯一執行時依賴）。
- uni-app Vue3 專案（`@dcloudio/uni-app` 3.x）。
- 微信小程序要求**基礎庫 ≥ 2.25.2**（root-portal）；低版本會降級為頁內 fixed 兜底。

## 方式一：easycom 按需引入（推薦）

安裝後，在 `pages.json` 加一條 easycom 規則：

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

之後範本裡直接寫標籤即可，**不需要 import 與註冊**：

```vue
<template>
  <lh-button type="primary" @click="onTap">按钮</lh-button>
</template>
```

::: warning easycom 設定不即時生效
uni-app 為編譯效能考量，**改動 `pages.json` 的 easycom 不會觸發重新編譯**。改完規則後要改動一下
頁面內容（或重啟 dev server）才會生效。這是 uni-app 的既有行為，不是本庫的問題。
:::

## 方式二：全量註冊

不用 easycom 時（例如 H5 專案想全量引入），走 `app.use`：

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

## 引入樣式

**兩種方式都要引兩個 CSS 產物**（使用方零 sass 依賴，樣式已在構建期淨化為自足 CSS）：

```ts
// main.ts
import '@lh-ui/uniapp/src/theme/index.css' // 主題變數（page { --lh-* } + page.dark 暗色）
import '@lh-ui/uniapp/src/icon/iconfont.css' // 圖示字型（lh-icon 元件依賴）
```

::: tip 為什麼是構建期產物而不是 scss 源
uni-app 專案的 sass `loadPaths` 不含 `node_modules`，`@use '@lh-ui/share/...'` 這類
bare specifier 解析不了，直接引用必然編譯失敗。所以本庫構建期輸出自足 CSS，
元件 SFC 用 `<style src="./style.css">` 引入。這也意味著**使用方不需要安裝 sass**。
:::

## 命令式服務要放掛載點

Message / Loading 在微信小程序裡無法 JS 建立 DOM，採用**掛載點模式**。在你需要用的頁面
（或根元件）裡放一個掛載點元件：

```vue
<template>
  <lh-config-provider :theme="theme">
    <view class="content"><!-- 頁面內容 --></view>

    <!-- 命令式服務的掛載點 -->
    <lh-message />
    <lh-loading />
  </lh-config-provider>
</template>

<script setup lang="ts">
import { useLhMessage } from '@lh-ui/uniapp'

const { success } = useLhMessage()
const onTap = () => success('操作成功')
</script>
```

::: danger 未放掛載點會告警
若呼叫了 `useLhMessage()` 但頁面沒有 `<lh-message />`，開發期會 `console.error` 明確告警，
**不會靜默降級**。這是刻意設計：靜默降級會讓「呼叫看似生效、實際沒反應」變成隱蔽 bug。
:::

## TypeScript

本庫自帶類型，元件 Props / 事件都有完整類型推導。easycom 形態下範本內標籤的類型由
`uni-app` 的元件類型系統提供（若專案未設定全域元件類型，用 `LhXxxProps` 明確標註即可）。
