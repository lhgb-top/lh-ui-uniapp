# Popover 彈出框

富內容彈出層：比 Tooltip 承載更多資訊（標題、正文、互動節點）。觸發器包裹在預設插槽裡，彈出內容透過 `content` 插槽傳入；彈出層為 `role="dialog"`，箭頭始終指向觸發器。

## 基礎用法

```vue
<template>
  <lh-popover title="水墨提示" placement="top">
    <lh-button>點擊彈出</lh-button>
    <template #content>
      <text>這是一段富內容，可以放置任意節點。</text>
    </template>
  </lh-popover>
</template>
```

::: warning 小程式沒有 hover / focus 語義
`trigger` 預設是 `click`（全端可用）。`hover` / `focus` 僅 H5 有效——
小程式端自動降級為點擊 / 觸摸切換（首次點擊展開、再次點擊收起）。
:::

## 觸發方式

```vue
<template>
  <!-- 懸停觸發（僅 H5 生效，小程式端降級為點擊切換） -->
  <lh-popover trigger="hover" title="懸停觸發">
    <lh-button>懸停我</lh-button>
    <template #content><text>指標移進彈出層不會觸發關閉。</text></template>
  </lh-popover>

  <!-- 聚焦觸發（僅 H5 生效） -->
  <lh-popover trigger="focus" title="聚焦觸發">
    <lh-input placeholder="聚焦輸入框" />
    <template #content><text>輸入框獲得焦點時展示。</text></template>
  </lh-popover>

  <!-- 手動控制：顯隱完全由外部 v-model:visible 控制 -->
  <lh-popover v-model:visible="manualVisible" trigger="manual" title="手動控制">
    <lh-button @click="manualVisible = !manualVisible">外部開關</lh-button>
    <template #content><text>顯隱完全由外部狀態控制。</text></template>
  </lh-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const manualVisible = ref(false)
</script>
```

> 延遲 `showAfter` / `hideAfter` 只用於防誤觸的 hover / focus（H5）；`click` 與 `manual` 立即回應。

## 十二種方位

```vue
<template>
  <lh-popover
    v-for="p in placements"
    :key="p"
    :placement="p"
    :title="p"
  >
    <lh-button size="small">{{ p }}</lh-button>
    <template #content><text>方位：{{ p }}</text></template>
  </lh-popover>
</template>

<script setup lang="ts">
const placements = [
  'top', 'top-start', 'top-end',
  'bottom', 'bottom-start', 'bottom-end',
  'left', 'left-start', 'left-end',
  'right', 'right-start', 'right-end',
] as const
</script>
```

> 視口空間不足時彈出層會自動翻轉方向（flip）並夾回交叉軸（shift），箭頭位置隨之切換。

## 寬度、箭頭與禁用

```vue
<template>
  <!-- 固定寬度 -->
  <lh-popover title="固定寬度" width="240">
    <lh-button>固定寬度</lh-button>
    <template #content><text>透過 width 指定彈出層寬度。</text></template>
  </lh-popover>

  <!-- 無箭頭 -->
  <lh-popover title="無箭頭" :arrow="false">
    <lh-button>無箭頭</lh-button>
    <template #content><text>arrow 為 false 時不渲染指向箭頭。</text></template>
  </lh-popover>

  <!-- 禁用 -->
  <lh-popover title="已禁用" disabled>
    <lh-button disabled>禁用觸發器</lh-button>
    <template #content><text>disabled 時觸發器與彈出層均不回應。</text></template>
  </lh-popover>
</template>
```

## Popover API

### Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| placement | 展示位置（12 種方位） | `LhPopoverPlacement` | `'top'` |
| trigger | 觸發方式：`click`（全端）/ `hover`、`focus`（僅 H5，MP 降級為點擊）/ `manual`（受控） | `'click' \| 'hover' \| 'focus' \| 'manual'` | `'click'` |
| title | 標題（也可用 title 插槽） | `string` | — |
| visible | 手動控制的顯示狀態（v-model:visible） | `boolean` | — |
| disabled | 是否禁用 | `boolean` | `false` |
| arrow | 是否顯示箭頭 | `boolean` | `true` |
| width | 彈出層寬度（數字為 px） | `string \| number` | — |
| popperClass | 彈出層自訂類別名稱 | `string` | — |
| showAfter | 延遲顯示時間（ms，僅 H5 的 hover / focus 生效） | `number` | — |
| hideAfter | 延遲隱藏時間（ms，僅 H5 的 hover / focus 生效） | `number` | — |
| themeVars | 元件級主題變數 | `Record<string, string>` | — |
| bgPattern | 元件級背景花紋，覆寫 ConfigProvider 設定 | `string` | — |
| sx | sx 快速佈局屬性（作用於觸發器根元素） | `LhSxProps` | — |

### Events

| 事件 | 說明 | 參數 |
| --- | --- | --- |
| update:visible | 顯隱變化（v-model） | `(value: boolean)` |
| show | 顯示後觸發 | — |
| hide | 隱藏後觸發 | — |

### Slots

| 插槽 | 說明 |
| --- | --- |
| default | 觸發器內容 |
| title | 自訂標題 |
| content | 彈出內容 |

### Methods

| 方法 | 說明 |
| --- | --- |
| show | 程式化顯示 |
| hide | 程式化隱藏 |
| toggle | 程式化切換 |

### 無障礙

- 觸發器帶 `aria-haspopup="true"` 與 `aria-expanded` / `aria-controls`；彈出層為 `role="dialog"`，有標題時透過 `aria-labelledby` 關聯
- Esc 關閉、點擊彈出層外部（頁內透明遮罩）關閉；多彈層疊加時 Esc 只關栈頂（均僅 H5）
- 定位引擎為自研純函式（flip / shift 防溢出），零第三方執行時依賴

::: tip 平台差異（與 Vue3 版的差異）
- **觸發方式**：小程式無 hover / focus 語義，`trigger="hover"` / `trigger="focus"` 在 MP 端降級為點擊 / 觸摸切換；顯隱延遲（`showAfter` / `hideAfter`）僅在 H5 的 hover / focus 模式生效，`click` 與 `manual` 立即回應。
- **彈層承載與定位**：無 `teleportTarget` prop——小程式無 DOM teleport，彈出層統一由 `root-portal`（低版本頁內 fixed 兜底）承載；popper 定位走兩幀非同步度量（先隱藏渲染量尺寸 → `computePosition` 定位 → 顯示，防閃爍），定位計算是非同步的，不能假設同步拿到結果；箭頭偏移由元件膠水把定位結果的 `arrowOffset` 寫入 `--lh-arrow-offset`。
- **鍵盤行為僅 H5**：Esc 關閉走文件級監聽（多彈層疊加時只關栈頂）；小程式無鍵盤事件，整段由條件編譯裁剪。
- **焦點圈未移植**：plus 點擊觸發會把焦點圈進彈出層（focus-trap）並在關閉時歸還；MP 無鍵盤焦點語義，與本倉 Dialog 同款整體不移植。
- **進出過渡未實現**：plus 用 `Transition` 淡入淡出，MP 端 `Transition` 不可靠，與 tooltip / dropdown 一致不綁過渡。
- **觸發器滾出視口不自動收起**：plus 的 `useLhPopper` 有 scroll-out 回呼，uni-app 無統一的滾動 / 尺寸變化監聽通道，未移植。
:::
