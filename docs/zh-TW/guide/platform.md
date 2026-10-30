# 平台支援

## 首版平台範圍

| 平台 | 狀態 | 說明 |
| --- | --- | --- |
| **H5** | ✅ 完整 | 所有元件全功能 |
| **微信小程序** | ✅ 完整（部分降級） | 彈層類元件的桌面級能力降級，見下表 |
| 支付寶 / 抖音小程序 | 🚫 首版不支援 | 後續按條件編譯逐端驗證後加欄 |
| App（nvue） | 🚫 不做 | nvue 渲染體系與 webview 不同，不在路線內 |

## 各元件能力矩陣

「降級」指**平台不支援的能力被編譯期守護直接移除**（小程序包裡沒有死程式碼），不是執行時失敗。

| 元件 | H5 | 微信小程序 | 降級策略 / 說明 |
| --- | --- | --- | --- |
| config-provider | 完整 | 完整 | provide/inject + 內聯 CSS 變數全平台可用；暗色靠 `page.dark` 類別切換（無 document） |
| button / tag | 完整 | 完整 | — |
| icon | 完整 | 完整 | iconfont 字型方案（web 端是內聯 SVG，見下「icon 渲染差異」） |
| input | 完整 | 完整 | 佔位樣式走 `placeholder-style` prop（MP 不支援 `::placeholder`） |
| checkbox / radio / switch | 完整 | 完整 | **view 自繪**（不用原生元件，統一 lh 視覺語言） |
| form / form-item | 完整 | 完整 | 驗證邏輯在 core 純函式，零平台依賴 |
| select | 完整 | 降級 | root-portal + 兩幀度量定位；**鍵盤導覽僅 H5**，MP 靠點選 + scroll-view |
| dialog | 完整 | 降級 | root-portal；**focus-trap / lockScroll 僅 H5**，MP 由遮罩攔截兜底 |
| tooltip | 完整 | 降級 | 兩幀度量定位；**無 hover**，MP 端點選 / 觸碰觸發 |
| message / loading | 完整 | 完整 | 掛載點模式（小程序無 document，不能 JS 建立 DOM） |

## 微信小程序的具體限制與替代

| 限制 | 替代方案 |
| --- | --- |
| 不支援 `<svg>` 標籤 | 圖示編譯期轉 iconfont 字型（base64 內嵌），`<text class="lh-iconfont">` 渲染 |
| 不支援 `::placeholder` | input 的 `placeholder-style` / `placeholder-class` prop |
| 不支援 `*` 萬用 / 屬性選擇器 / `:not()` / `:nth-*` | 構建期淨化：`*` 萬用映射成 flex + gap，其餘替換為等價類別名 |
| 無 `document` / `document.body` | 彈層走 `root-portal`；命令式服務走掛載點模式 |
| 無鍵盤焦點語義 | focus-trap / 鍵盤導覽由 `LH_IS_H5` 守護不呼叫；aria 屬性仍輸出供讀屏 |
| `transitionend` 不可靠 | 進出動畫用 CSS transition + setTimeout 對齊時長 |
| `onLoad` 階段元件未建立完 | 所有 ref / 度量呼叫須在 `onReady` 之後 |

## 微信基礎庫版本

- **root-portal 需要基礎庫 ≥ 2.25.2**（select / dialog / tooltip 的彈層掛載依賴它）。
- 低版本自動降級為**頁內 fixed 定位**兜底（`getLhLibVersion()` 判斷），彈層仍在，只是層級
  受頁面流約束。

## root-portal 與釘釘等端

`lh-root-portal` 內部用條件編譯三分：H5 走 `<teleport to="body">`，微信走 `<root-portal>`，
釘釘等不支援 root-portal 的端走頁內 fixed。**這是內部元件，使用者不需要關心**，
列在這裡是為了說明彈層行為的平台差異來源。
