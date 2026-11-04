# Drawer 抽屜

從螢幕邊緣滑入的側滑面板，適合比 Dialog 更貼邊的臨時操作（詳情、篩選、精靈步驟）。與 Dialog 一致採用 `role="dialog"` + `aria-modal="true"`，遮罩點擊與 Esc（H5）皆可關閉。

## 基礎用法

```vue
<template>
  <lh-button @click="visible = true">打開抽屜</lh-button>

  <lh-drawer v-model="visible" title="訂單詳情">
    <view>這裡放置抽屜主體內容。</view>
    <view>面板寬度由 size 控制，預設 30% 視窗寬度。</view>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
</script>
```

## 四個方向

`direction` 支援 `right`（預設）/ `left` / `top` / `bottom`，面板從對應邊緣滑入。

```vue
<template>
  <!-- 打開右側抽屜 -->
  <lh-button @click="openDir('right')">right</lh-button>
  <!-- 打開左側抽屜 -->
  <lh-button @click="openDir('left')">left</lh-button>
  <!-- 打開頂部抽屜 -->
  <lh-button @click="openDir('top')">top</lh-button>
  <!-- 打開底部抽屜 -->
  <lh-button @click="openDir('bottom')">bottom</lh-button>

  <!-- 依指定方向滑出 -->
  <lh-drawer v-model="dirVisible" :title="`${direction} 抽屜`" :direction="direction" size="40%">
    <view>目前方向：{{ direction }}</view>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhDrawerDirection } from '@lh-ui/uniapp'

const dirVisible = ref(false)
const direction = ref<LhDrawerDirection>('right')
function openDir(d: LhDrawerDirection) {
  direction.value = d
  dirVisible.value = true
}
</script>
```

## 自訂尺寸

`size` 傳數字為 px，傳字串支援百分比（如 `'40%'`）。左右方向作用於寬度，上下方向作用於高度。

```vue
<template>
  <!-- 打開 480px 寬抽屜 -->
  <lh-button @click="sized = true">480px 寬抽屜</lh-button>

  <!-- 固定尺寸的抽屜，底部為操作區 -->
  <lh-drawer v-model="sized" title="篩選條件" :size="480">
    <view>依名稱、標籤篩選資料。</view>
    <template #footer>
      <lh-button @click="sized = false">取消</lh-button>
      <lh-button type="primary" @click="sized = false">套用篩選</lh-button>
    </template>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const sized = ref(false)
</script>
```

## 行為開關

`mask-closable` 控制遮罩點擊關閉、`show-close` 控制右上角關閉按鈕、`close-on-esc` 控制 Esc 關閉（僅 H5）、`lock-scroll` 控制打開時鎖定頁面捲動（僅 H5）。

```vue
<template>
  <!-- 打開「僅按鈕關閉」抽屜 -->
  <lh-button @click="locked = true">僅按鈕關閉</lh-button>

  <!-- 遮罩點擊與 Esc 皆不關閉，只能透過按鈕關閉 -->
  <lh-drawer
    v-model="locked"
    title="僅按鈕關閉"
    :mask-closable="false"
    :show-close="false"
    :close-on-esc="false"
  >
    <view>遮罩點擊與 Esc（H5）都不關閉。</view>
    <template #footer>
      <lh-button type="primary" @click="locked = false">關閉</lh-button>
    </template>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const locked = ref(false)
</script>
```

## Drawer API

### Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| modelValue (v-model) | 是否顯示 | `boolean` | `false` |
| title | 標題（也可用 header 插槽） | `string` | — |
| direction | 方向 | `'right' \| 'left' \| 'top' \| 'bottom'` | `'right'` |
| size | 尺寸：數字為 px，字串支援百分比 | `string \| number` | `'30%'` |
| maskClosable | 點擊遮罩是否關閉 | `boolean` | `true` |
| showClose | 是否顯示關閉按鈕 | `boolean` | `true` |
| lockScroll | 打開時鎖定頁面捲動（**僅 H5 有效**） | `boolean` | `true` |
| closeOnEsc | 是否響應 Esc 關閉（**僅 H5 有效**） | `boolean` | `true` |
| customClass | 自訂類名（穿透到根節點） | `string` | — |
| themeVars | 元件級主題變數 | `Record<string, string>` | — |
| bgPattern | 元件級背景花紋，覆寫 ConfigProvider 設定 | `string` | — |
| sx | sx 快速版面屬性（作用於面板） | `LhSxProps` | — |

### Events

| 事件 | 說明 | 回呼參數 |
| --- | --- | --- |
| update:modelValue | 顯隱變化（動畫結束後觸發） | `(visible: boolean)` |
| open | 打開 | — |
| close | 關閉（動畫結束後觸發） | — |

### Slots

| 插槽 | 說明 |
| --- | --- |
| default | 主體內容 |
| header | 自訂頭部標題區（取代 title 文字） |
| footer | 底部操作區 |

### Methods

| 方法 | 說明 |
| --- | --- |
| open | 程式化打開 |
| close | 程式化關閉 |

### 無障礙

- 根節點為 `role="dialog"` + `aria-modal="true"`；有標題時透過 `aria-labelledby` 關聯標題元素，無標題時用語言包 `drawer.title` 作為 `aria-label` 兜底
- 遮罩為裝飾性節點（`aria-hidden="true"`）
- 關閉按鈕帶有 `role="button"` 與語言包 `drawer.close` 的 `aria-label`
- Esc 關閉（可由 `close-on-esc` 關閉該行為，僅 H5）

::: tip 平台差異（與 Vue3 版的差異）
- **彈層承載**：無 `teleportTarget` prop——小程式無 DOM teleport，彈層統一由 `root-portal` 承載（H5 是 teleport）。**微信端 `root-portal` 依賴基礎庫 ≥ 2.25.2**，低版本自動降級為頁內 `fixed`（不脫離頁面節點樹，層級仍由自增 z-index 保證，功能不受影響）。
- **進出過渡**：plus 用 `<Transition name="lh-drawer-fade">` 驅動滑動動畫；小程式端無 `<Transition>` 元件且 `transitionend` 事件不可靠，本端手工復刻 Vue Transition 的類名時序（起始態隔幀移除 → 動畫態 → 結束卸載），用 `setTimeout` 對齊 share SCSS 的 300ms transition 時長——遮罩淡入淡出 + 面板依方向滑入滑出，雙端表現一致。
- **焦點圈（focus-trap）僅 H5 有鍵盤焦點語義，本端未接入**：plus 打開時會把 Tab 焦點序列圈在面板內；小程式無鍵盤焦點語義（share 的 shouldDrawerTrapFocus 被 LH_IS_H5 編譯期守衛短路），本端與 Dialog 一致不呼叫 share 的 focus-trap，僅保留 Esc 關閉。
- **lockScroll 僅 H5 有效**：小程式無 body 捲動鎖定能力，由全螢幕遮罩攔截點擊兜底。
- **closeOnEsc 僅 H5 有效**：Esc 走文件級鍵盤監聽，多彈層疊加時只有堆疊頂端響應；小程式無鍵盤事件，整段由條件編譯裁剪。
- **teleportTarget 未實現**：對齊 select / tooltip / dropdown 前例（小程式無 DOM teleport）。
- **底部抽屜安全區**：`direction="bottom"` 時面板自動帶 `env(safe-area-inset-bottom)` 內邊距，適配全螢幕裝置（uni-app 端適配，share 樣式源無此端特化）。
:::
