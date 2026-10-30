# 與 Vue3 版的 API 差異

本庫與 `@lh-ui/vue3`（plus）共用 `@lh-ui/share` 的 core 純函式，**Props 命名與事件命名基本一致**。
以下是 uni-app 目標平台帶來的必然差異；凡未列出的 API，行為與 Vue3 版相同。

## icon：字型渲染而非內聯 SVG

| | Vue3 版（plus） | 本庫 |
| --- | --- | --- |
| 渲染方式 | 內聯 `<svg><path>` | `<text class="lh-iconfont lh-iconfont--<name>">` |
| 顏色 | `currentColor`（繼承父級 color） | 明確 `color` prop / 父級 color（CSS 字型顏色，語義等價） |
| 尺寸 | `size` prop | `size` prop（設 font-size） |

微信小程序不支援 `<svg>` 標籤，圖示在構建期由 share 的 SVG path 集合轉成 iconfont 字型
（base64 內嵌在 `iconfont.css`，37 個圖示，24×24 單色）。視覺上是同字形，但本質是字型，
所以 CSS 裡**不能**用 `fill` / `stroke`，只能用 `color`。

## input：佔位樣式走 prop

MP 不支援 `::placeholder` 偽元素。佔位樣式請用 prop：

```vue
<lh-input placeholder="请输入" placeholder-style="color: #999" />
```

| prop | 說明 |
| --- | --- |
| `placeholder-style` | 佔位文字的內聯樣式字串 |
| `placeholder-class` | 佔位文字的類別名（與 style 二選一） |

其餘 API（`v-model`、`maxlength`、字數統計 `show-word-limit`、`type`）與 Vue3 版一致。

## select / dialog / tooltip：桌面級能力僅 H5

| 能力 | H5 | 微信小程序 |
| --- | --- | --- |
| 鍵盤導覽（方向鍵 / Enter / Esc） | ✅ | ❌ 編譯期移除 |
| focus-trap（對話框焦點圈） | ✅ | ❌ 編譯期不呼叫 |
| lockScroll（鎖背景捲動） | ✅ | ❌（遮罩攔截兜底） |
| hover 觸發（tooltip） | ✅ | ❌，改 click / touchstart |

**tooltip 的 `trigger`**：仍支援 `'click' | 'hover'`，但小程序裡 `hover` 無語義——
小程序端請用 `trigger="click"`（或預設值），透過點選 / 觸碰觸發。

**select 的事件**不變（`update:modelValue` / `change` / `visible-change`），
但「清空」「選中」在 MP 端只能透過點選 listbox 項，沒有鍵盤路徑。

## message / loading：掛載點模式

這是**最大的使用方式差異**。Vue3 版是 `createApp + mount 到 document.body`，
呼叫即彈；小程序沒有 document，必須**先放掛載點元件**：

```vue
<!-- 頁面裡放一次 -->
<lh-message />
<lh-loading />
```

```ts
const { success, closeAll } = useLhMessage()
const loading = useLhLoading()

loading.show({ text: '加载中...' })
// ...
loading.close()
```

詳見[安裝 - 命令式服務要放掛載點](/zh-TW/guide/installation#命令式服務要放掛載點)。

::: tip Notification 元件首版缺席
Vue3 版有 `lh-notification`，本庫首版**不做**（小程序端價值低，通知一般走系統能力）。
需要通知類提示時用 `lh-message` 替代。
:::

## config-provider：暗色靠類別名而非 document

| | Vue3 版 | 本庫 |
| --- | --- | --- |
| 暗色切換 | 操作 `document.documentElement` 加 class | 在包裹節點加 `dark` 類別（小程序無 document） |
| `theme` prop | `'light' \| 'dark'` | 同（內部實作不同） |

用法不變，都是 `<lh-config-provider :theme="dark">`。本庫的 `theme/index.css` 裡
暗色變數掛在 `page.dark, .dark` 上，所以暗色作用域跟著 ConfigProvider 的包裹節點走。

## 單位：px 直出

本庫**不做 px→rpx 轉換**，樣式源是 px 基準直出——與 wot-design-uni / uview-plus /
uni-ui / TDesign 等主流 uni 元件庫一致（uni 官方編譯期也不會自動轉 px→rpx）。
若專案設了 `postcss-px-to-rpx` 之類的外掛，本庫產物會一起被轉，無需特別處理。

## 元件 SFC 自帶的小程序選項

每個元件的 SFC 都宣告了：

```ts
defineOptions({
  name: 'LhXxx',
  options: { virtualHost: true, addGlobalClass: true, styleIsolation: 'shared' },
})
```

- `virtualHost: true` —— 元件不產生多餘包裹節點，custom-class / customStyle 能落到目標元素。
- `addGlobalClass: true` —— 元件內可使用全域樣式（`app.wxss` / 頁面樣式）。
- `styleIsolation: 'shared'` —— 樣式隔離為共享模式，元件樣式與頁面樣式互相可見。

**使用者不需要在 pages.json 或專案裡額外設定這三項**——它們已在元件自身的 json 裡宣告。
若元件樣式異常（類別名全在但樣式沒生效），先檢查是不是專案的 `styleIsolation` 覆蓋設定覆蓋了元件級宣告。
