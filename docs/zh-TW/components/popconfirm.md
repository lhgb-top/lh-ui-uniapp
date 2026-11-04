# Popconfirm 氣泡確認

輕量二次確認：在觸發器附近彈出確認氣泡，不需要打開對話框。語義為阻斷式確認（`role="alertdialog"`）：Escape 視為取消。確認內容透過 `content` 插槽或 `title` 屬性傳入，觸發器包裹在預設插槽裡。

## 基礎用法

```vue
<template>
  <lh-popconfirm title="確定刪除這條記錄嗎？" @confirm="onConfirm" @cancel="onCancel">
    <lh-button type="danger">刪除</lh-button>
  </lh-popconfirm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const action = ref('')
function onConfirm() {
  action.value = '已確認'
}
function onCancel() {
  action.value = '已取消'
}
</script>
```

::: warning 小程式沒有 hover / focus 語義
`trigger` 預設是 `click`（全端可用）。`hover` / `focus` 僅 H5 有效——
小程式端自動降級為點擊 / 觸摸切換（首次點擊展開、再次點擊收起）。
:::

## 三種語氣

`type` 決定語氣圖示與修飾類：`info`（資訊）/ `warning`（警告，預設）/ `danger`（危險）。

```vue
<template>
  <lh-popconfirm type="info" title="查看該記錄的存取日誌？">
    <lh-button>資訊</lh-button>
  </lh-popconfirm>
  <lh-popconfirm type="warning" title="該操作會通知所有成員。">
    <lh-button type="warning">警告</lh-button>
  </lh-popconfirm>
  <lh-popconfirm type="danger" title="刪除後無法復原。">
    <lh-button type="danger">危險</lh-button>
  </lh-popconfirm>
</template>
```

## 自訂文案與方位

```vue
<template>
  <lh-popconfirm
    title="封存後可在回收站復原。"
    confirm-text="封存"
    cancel-text="再想想"
    placement="right"
  >
    <lh-button>自訂文案</lh-button>
  </lh-popconfirm>

  <!-- 懸停觸發（僅 H5 生效，小程式端降級為點擊切換） -->
  <lh-popconfirm title="懸停即可確認。" trigger="hover" :show-after="0" placement="bottom">
    <lh-button>懸停觸發</lh-button>
  </lh-popconfirm>
</template>
```

> 按鈕文案預設取語言包 `popconfirm.confirm` / `popconfirm.cancel`，可用 `confirm-text` / `cancel-text` 覆寫。

## 受控顯隱與圖示

```vue
<template>
  <!-- 受控：顯隱完全由外部 v-model:visible 控制 -->
  <lh-popconfirm v-model:visible="pcVisible" trigger="manual" title="受控氣泡">
    <lh-button @click="pcVisible = !pcVisible">{{ pcVisible ? '收起' : '展開' }}</lh-button>
  </lh-popconfirm>

  <!-- 圖示開關與確認按鈕類型 -->
  <lh-popconfirm title="確定刪除這條記錄嗎？" :show-icon="false" confirm-button-type="primary">
    <lh-button type="danger">無圖示</lh-button>
  </lh-popconfirm>

  <!-- 停用 -->
  <lh-popconfirm title="該操作不可用。" disabled>
    <lh-button disabled>停用</lh-button>
  </lh-popconfirm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const pcVisible = ref(false)
</script>
```

## Popconfirm API

### Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| type | 確認語氣：`info` / `warning` / `danger` | `'info' \| 'warning' \| 'danger'` | `'warning'` |
| placement | 顯示位置（12 種方位） | `LhPopconfirmPlacement` | `'top'` |
| trigger | 觸發方式：`click`（全端）/ `hover`、`focus`（僅 H5，MP 降級為點擊）/ `manual`（受控） | `'click' \| 'hover' \| 'focus' \| 'manual'` | `'click'` |
| title | 確認內容（也可用 content 插槽） | `string` | — |
| confirmText | 確認按鈕文案（未傳時取語言包 popconfirm.confirm） | `string` | — |
| cancelText | 取消按鈕文案（未傳時取語言包 popconfirm.cancel） | `string` | — |
| confirmButtonType | 確認按鈕類型 | `'default' \| 'primary'` | `'primary'` |
| visible | 手動控制的顯示狀態（v-model:visible） | `boolean` | — |
| disabled | 是否停用 | `boolean` | `false` |
| showIcon | 是否顯示語氣圖示 | `boolean` | `true` |
| popperClass | 彈出層自訂類別名稱 | `string` | — |
| showAfter | 延遲顯示時間（ms，僅 H5 的 hover / focus 生效） | `number` | — |
| hideAfter | 延遲隱藏時間（ms，僅 H5 的 hover / focus 生效） | `number` | — |
| themeVars | 元件級主題變數 | `Record<string, string>` | — |
| bgPattern | 元件級背景花紋，覆寫 ConfigProvider 設定 | `string` | — |
| sx | sx 快速版面屬性（作用於觸發器根元素） | `LhSxProps` | — |

### Events

| 事件 | 說明 | 參數 |
| --- | --- | --- |
| confirm | 點擊確認按鈕後觸發 | — |
| cancel | 點擊取消按鈕或按 Escape 後觸發 | — |
| update:visible | 顯隱變化（v-model） | `(value: boolean)` |
| show | 顯示後觸發 | — |
| hide | 隱藏後觸發 | — |

### Slots

| 插槽 | 說明 |
| --- | --- |
| default | 觸發器內容 |
| content | 自訂確認內容 |

### Methods

| 方法 | 說明 |
| --- | --- |
| show | 程式化顯示 |
| hide | 程式化隱藏 |
| toggle | 程式化切換 |

### 無障礙

- 彈出層為 `role="alertdialog"` + `aria-modal="true"`，確認內容透過 `aria-labelledby` 關聯；觸發器帶 `aria-haspopup` / `aria-expanded` / `aria-controls`（屬性包由 share 純函式產出）
- Escape 視為取消（對齊 WAI-ARIA alertdialog：Escape 關閉並視為否定）；多彈層疊加時 Esc 只關堆疊頂層（僅 H5）
- 點擊取消按鈕、確認按鈕外部的透明遮罩均會收起；語氣圖示為裝飾性（`aria-hidden`）
- 定位引擎為自研純函式（flip / shift 防溢出），零第三方執行時依賴

::: tip 平台差異（與 Vue3 版的差異）
- **觸發方式**：小程式無 hover / focus 語義，`trigger="hover"` / `trigger="focus"` 在 MP 端降級為點擊 / 觸摸切換；顯隱延遲（`showAfter` / `hideAfter`）僅在 H5 的 hover / focus 模式生效，`click` 與 `manual` 立即回應。
- **彈層承載與定位**：無 `teleportTarget` prop——小程式無 DOM teleport，彈出層統一由 `root-portal`（低版本頁內 fixed 兜底）承載；popper 定位走兩幀非同步度量（先隱藏渲染量尺寸 → `computePosition` 定位 → 顯示，防閃爍），定位計算是非同步的，不能假設同步拿到結果；箭頭偏移由元件膠水把定位結果的 `arrowOffset` 寫入 `--lh-arrow-offset`。
- **鍵盤行為僅 H5**：Esc = 取消走文件級監聽（多彈層疊加時只關頂層）；小程式無鍵盤事件，整段由條件編譯裁剪。
- **焦點圈未移植**：plus 開啟時把焦點落「確定」按鈕、Tab 在兩按鈕間循環並圈進彈出層（focus-trap）、關閉後歸還焦點；MP 無鍵盤焦點語義，與本倉 Dialog / Popover 同款整體不移植。
- **進出過渡未實現**：plus 用 `Transition` 淡入淡出（`lh-popconfirm-fade`），MP 端 `Transition` 不可靠，與 tooltip / dropdown / popover 一致不綁過渡。
- **觸發器滾出視口不自動收起**：plus 的 `useLhPopper` 有 scroll-out 回呼，uni-app 無統一的滾動 / 尺寸變化監聽通道，未移植。
- **aria-haspopup 取值**：plus 模板寫死 `aria-haspopup="dialog"`，本倉觸發器屬性包統一由 share 的 `getPopconfirmTriggerAria` 產出（取值 `'true'`），契約以 share 純函式為準。
:::
