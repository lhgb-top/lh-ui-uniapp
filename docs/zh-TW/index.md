---
layout: home

hero:
  name: lh-ui uniapp
  text: uni-app 元件庫
  tagline: 一套程式碼，H5 + 微信小程序；元件邏輯與樣式源與 Vue3 / Vue2 / React 端同源
  actions:
    - theme: brand
      text: 快速開始
      link: /zh-TW/guide/installation
    - theme: alt
      text: 平台支援
      link: /zh-TW/guide/platform

features:
  - title: 一個 core，多端複用
    details: 元件邏輯（狀態機、驗證、popper 計算、i18n）是 @lh-ui/share 的純函式，本庫只寫響應式膠水；與 Vue3 / Vue2 / React 端行為一致。
  - title: H5 + 微信小程序
    details: 首版涵蓋兩端。微信小程序的樣式限制（WXSS 白名單、無 svg、無 document）在構建期淨化層統一處理，使用方零 sass 依賴。
  - title: easycom 按需
    details: npm 安裝 + pages.json 一條規則，範本裡直接寫標籤即用；也可全量 app.use 註冊。
  - title: 命令式服務可用
    details: Message / Loading 採用掛載點模式，微信小程序裡也能用命令式呼叫；未掛載時開發期明確告警，不靜默降級。
---

::: tip 與家族其他端的關係
本庫是 lh-ui 家族 web 血脈的 uni-app 端，與 `@lh-ui/vue3`（plus）、`@lh-ui/vue2`、`@lh-ui/react`
共用 `@lh-ui/share` 的 core 純函式與樣式源。Props 命名與 Vue3 版基本一致，平台差異見
[與 Vue3 版的 API 差異](/zh-TW/guide/differences)。
:::
