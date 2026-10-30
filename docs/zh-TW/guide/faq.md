# 常見問題

## 1. easycom 設定改了不生效

**現象**：在 `pages.json` 加了 easycom 規則，或改了規則，但範本裡的 `<lh-xxx>` 還是報「元件未註冊」。

**原因**：uni-app 為編譯效能考量，**改動 `pages.json` 的 easycom 不會觸發重新編譯**。

**解法**：改動規則後，改動一下任一頁面內容（敲個空格儲存即可）觸發重編譯；或直接重啟 dev server。

## 2. ref 拿不到元件 / 度量傳回空

**現象**：`onLoad` 裡呼叫元件 ref 方法，或呼叫 `getLhRect` / `useLhPopper` 相關能力，拿到 undefined 或空矩形。

**原因**：`onLoad` 階段元件尚未建立完畢，子元件實例與節點都還沒就緒。

**解法**：所有 ref 呼叫與節點度量放在 **`onReady` 之後**（`onReady` 對應頁面首次渲染完成）：

```ts
import { onReady } from '@dcloudio/uni-app'

onReady(() => {
  // 這裡才能安全存取子元件 ref / 度量節點
})
```

## 3. 命令式服務（message / loading）呼叫後沒反應

**現象**：`useLhMessage().success(...)` 呼叫了，控制台有 `console.error` 告警，但頁面沒出現訊息。

**原因**：小程序無法 JS 建立 DOM，命令式服務採用**掛載點模式**——頁面裡必須先放
`<lh-message />` / `<lh-loading />`，呼叫只是往單例 store 裡推記錄，由掛載點元件渲染。

**解法**：在需要的頁面（或一個常駐的根包裹元件）裡放掛載點：

```vue
<lh-config-provider>
  <view><!-- 頁面內容 --></view>
  <lh-message />
  <lh-loading />
</lh-config-provider>
```

告警是刻意設計的——不靜默降級，避免「呼叫看似生效、實際沒反應」的隱蔽 bug。

## 4. 樣式沒生效 / 類別名在但樣式缺失

**排查順序**：

1. 確認引了兩個 CSS 產物：`@lh-ui/uniapp/src/theme/index.css` 與 `@lh-ui/uniapp/src/icon/iconfont.css`。
   漏引主題變數時，所有 `var(--lh-*)` 會回退到預設值（顏色、圓角全不對）。
2. 確認沒有覆蓋元件級的 `styleIsolation`。元件 SFC 自帶 `styleIsolation: 'shared'` +
   `addGlobalClass: true`；若專案級設定強制了更嚴格的隔離，元件樣式會互相不可見。
3. 自訂樣式請透過 `custom-class` / `custom-style` prop 傳入，不要在頁面裡直接寫
   元件內部 BEM 類別名（`.lh-button__text` 之類的內部類別名不屬於公開 API）。

## 5. 小程序包體積裡怎麼有 iconfont 的 base64

那是圖示字型（約幾十 KB），內嵌在 CSS 裡隨包發布。微信小程序不支援 `<svg>` 標籤，
圖示必須走字型方案；base64 內嵌是因為小程序的 `@font-face` 不允許引本地字型檔
（wxss 裡 `url(...)` 只支援網路位址或 base64）。這是 uni-app 圖示方案的主流做法。

## 6. H5 裡彈層位置正常，小程序裡偏了

彈層定位走「兩幀度量 → 定位 → 顯示」時序（先透明渲染量尺寸，再定位，最後顯示防閃爍）。
如果偏了，通常是**呼叫時序**問題：確認定位觸發在 `onReady` 之後，且 trigger 節點已經布局完成。
另外注意小程序的 `getLhRect` 是非同步的，不能假設同步拿到結果。

## 7. 暗色模式不生效

暗色變數掛在 `page.dark, .dark` 上，由 ConfigProvider 的包裹節點加 `dark` 類別切換。
確認 `<lh-config-provider :theme="dark">` 確實包裹住了需要暗色的內容範圍
（不像 web 端掛在 document.documentElement 上是全域的，本庫的作用域跟著包裹節點走）。
