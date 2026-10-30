# 微信小程序人工回歸清單

> 給使用者（或維護者）在微信開發者工具裡走查用。構建冒煙只保證 WXSS 合法、能編譯過；
> **行為正確性必須人工回歸**——vitest 跑的是 H5 語義，MP 端的事件與渲染差異測不出來。
>
> 構建：`pnpm dev:mp-weixin`（或 `pnpm build:mp-weixin`），產物在 `dist/dev/mp-weixin`
> （或 `dist/build/mp-weixin`），用微信開發者工具開啟該目錄。
>
> 前置：微信基礎庫 **≥ 2.25.2**（root-portal 依賴；低版本走頁內 fixed 降級分支，
> 若專門驗降級路徑可把基礎庫調到 2.25.2 以下再跑一遍「彈層類」三項）。

## 通用基線（每頁都查）

| # | 項 | 通過標準 |
| --- | --- | --- |
| G1 | 開啟 | 頁面渲染不白屏、不報「元件未註冊」 |
| G2 | 暗色 | 入口切暗色，頁面內元件顏色全部跟隨（不是只變背景） |
| G3 | 中英 | 入口切語言，元件內文案（如 form 驗證訊息、按鈕文案）跟隨切換 |
| G4 | 控制台 | 全程無 `console.error`（特別注意 message/loading 的「未放掛載點」告警不該出現） |

## 元件清單

| 頁面路徑 | 元件 | 關鍵互動（除通用基線外） |
| --- | --- | --- |
| `pages/button/button` | button | 點選有回彈態；loading / disabled / plain / round / circle / block 全渲染；圖示按鈕的 iconfont 正常出圖 |
| `pages/icon/icon` | icon | 37 個圖示全部出圖（不是空白方塊）；size / color 生效；loading 圖示轉動 |
| `pages/tag/tag` | tag | 各 type 顏色正確；round / hit 切換；closable 點選觸發關閉且回呼到 |
| `pages/input/input` | input | v-model 雙向；佔位樣式經 `placeholder-style` 生效（**不查 `::placeholder`**）；textarea 自適應高度；字數統計；clearable 清空；error 狀態描邊變紅 |
| `pages/switch/switch` | switch | 點選切換有滑桿動畫；loading / disabled 不回應點選；activeText/inactiveText 顯示 |
| `pages/checkbox/checkbox` | checkbox / checkbox-group | 單選點選勾選；group 內多選互不影響；disabled 項不回應；indeterminate 半選態 |
| `pages/radio/radio` | radio / radio-group | 選項互斥（點另一項取消前項）；disabled 項不回應 |
| `pages/form/form` | form / form-item | blur / input 觸發驗證；錯誤文案 `<text>` 正常顯示；`validate()` 傳回的 Promise 在「提交」按鈕裡正確 resolve；必填星號顯示 |
| `pages/select/select` | select | 點選彈出 listbox（**root-portal，層級在遮罩之上**）；選項點選選中並關閉；clearable 清空；filterable 彈層內輸入框可用；**無鍵盤導覽屬正常**（MP 移除） |
| `pages/tooltip/tooltip` | tooltip | 點選 trigger 彈出氣泡；位置與 placement 一致（兩幀度量後定位，**首幀不應看到閃爍或錯位**）；點選外部關閉；trigger="hover" 在 MP 無效應視為正常 |
| `pages/dialog/dialog` | dialog | 開啟有遮罩與過渡；點選遮罩按 `closeOnClick-modal` 關閉；bottom 定位在全螢幕下 `safe-area-inset-bottom` 生效；**Esc 與 lockScroll 在 MP 無效屬正常**；全螢幕模式鋪滿 |
| `pages/services/services` | message / loading | 見下節 |

## message / loading 專項

| # | 項 | 通過標準 |
| --- | --- | --- |
| S1 | 各類型訊息 | success / info / warning / danger / loading 五種類型彈出，圖示與顏色對 |
| S2 | 自動關閉 | 預設 3 秒後消失，消失有過渡動畫（**不是瞬間消失**） |
| S3 | 手動關閉 | loading 類型不自動關閉，`handle.close()` 後才消失 |
| S4 | 多條堆疊 | 連續呼叫多條時縱向堆疊不重疊；超過 max 條數時舊的被擠掉 |
| S5 | 全螢幕遮罩 | loading.show 出現全螢幕遮罩，遮罩期間下層不可點選 |
| S6 | 關閉回呼 | onClose 回呼在訊息消失時觸發 |
| S7 | 未掛載告警 | （專門驗：刪掉頁面裡的 `<lh-message />` 再呼叫）控制台應 `console.error` 明確告警，**不靜默** |

## 已知的 MP 端「非缺陷」（驗到了別報 bug）

- select / dialog / tooltip **無鍵盤導覽 / Esc / focus-trap / lockScroll**——編譯期移除，見
  [平台支援](/zh-TW/guide/platform)。
- tooltip 的 `trigger="hover"` 在 MP 端不觸發——無 hover 語義，用 click。
- message / loading 必須先放掛載點，這是設計，不是 bug。
- icon 是字型渲染，CSS 裡 `fill` / `stroke` 無效，只能 `color`。

## 回歸結果記錄

在表格右側補欄「通過 / 失敗（現象）」，失敗項先貼開發者工具的 Console 與 WXML 面板截圖，
再對照 `docs/uniapp/uniapp组件库计划.md` 的平台能力矩陣判斷是「預期降級」還是真缺陷。
