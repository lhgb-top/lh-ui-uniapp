# Steps 步驟條

引導使用者按流程完成任務，支援橫向 / 縱向、圖示、描述與點擊導航；純展示 + 狀態類元件，H5 與微信小程式全端可用。

## 基礎用法

`current` 指定當前步驟索引（0 起，可用 `v-model:current` 雙向綁定）。索引小於當前步為 `finish`、等於為 `process`、大於為 `wait`。

```vue
<template>
  <lh-steps :current="current">
    <lh-step
      title="研墨"
      description="墨分五色"
    />
    <lh-step
      title="起稿"
      description="經營位置"
    />
    <lh-step
      title="落墨"
      description="骨法用筆"
    />
    <lh-step
      title="題款"
      description="畫龍點睛"
    />
  </lh-steps>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const current = ref(1)
</script>
```

## 縱向步驟

`direction="vertical"` 切換為縱向版面（由 CSS 控制，無平台差異）。

```vue
<template>
  <lh-steps
    :current="1"
    direction="vertical"
  >
    <lh-step
      title="提交訂單"
      description="2026-10-01 10:00"
    />
    <lh-step
      title="付款成功"
      description="2026-10-01 10:05"
    />
    <lh-step
      title="商家出貨"
      description="預計 10-03 送達"
    />
    <lh-step title="確認收貨" />
  </lh-steps>
</template>
```

## 帶圖示

給 `lh-step` 傳 `icon` 使用內建圖示字體（圖示名見 Icon 文件）；不傳時 `finish` 顯示勾、`error` 顯示叉，其餘顯示序號。

```vue
<template>
  <lh-steps :current="1">
    <lh-step
      title="註冊"
      icon="user"
    />
    <lh-step
      title="驗證"
      icon="email"
    />
    <lh-step
      title="完成"
      icon="check"
    />
  </lh-steps>
</template>
```

`icon` 插槽可完全覆蓋預設回退（自訂圖形、文字皆可）：

```vue
<template>
  <lh-steps :current="2">
    <lh-step title="第一步">
      <template #icon>
        <text class="step-badge">壹</text>
      </template>
    </lh-step>
    <lh-step title="第二步">
      <template #icon>
        <text class="step-badge">貳</text>
      </template>
    </lh-step>
    <lh-step title="第三步">
      <template #icon>
        <text class="step-badge">參</text>
      </template>
    </lh-step>
  </lh-steps>
</template>
```

## 可點擊導航

`clickable` 開啟後，「已完成」與「進行中」的步驟渲染為可點擊頭部，點擊拋出 `update:current`（v-model）與 `change`；等待中的後續步驟不引導跳轉。

```vue
<template>
  <lh-steps
    v-model:current="active"
    clickable
  >
    <lh-step title="第一步" />
    <lh-step title="第二步" />
    <lh-step title="第三步" />
  </lh-steps>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref(1)
</script>
```

## 整體狀態覆蓋

`status` 傳入後覆蓋所有步驟的衍生狀態（`wait` / `process` / `finish` / `error`），用於自訂展示。

```vue
<template>
  <lh-steps
    :current="2"
    status="error"
  >
    <lh-step title="第一步" />
    <lh-step title="第二步" />
    <lh-step title="第三步" />
  </lh-steps>
</template>
```

## Steps Props

| 屬性 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| current | 當前步驟索引（v-model:current，0 起） | `number` | `0` |
| direction | 方向：`'horizontal'` / `'vertical'` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| clickable | 步驟是否可點擊導航（僅已完成 / 進行中步驟可點） | `boolean` | `false` |
| status | 整體覆蓋所有步驟的狀態（用於自訂展示） | `'wait' \| 'process' \| 'finish' \| 'error'` | — |
| customClass | 自訂類名（透傳到根節點） | `string` | — |
| sx | 快速版面屬性 | `LhSxProps` | — |

## Step Props

| 屬性 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| title | 步驟標題（也可用 title 插槽） | `string` | `''` |
| description | 步驟描述（也可用 description 插槽） | `string` | `''` |
| icon | 自訂圖示名稱（未傳時 finish/error 用勾叉，其餘顯示序號） | `LhIconName` | — |
| customClass | 自訂類名（透傳到項根節點） | `string` | — |

## Events

| 事件 | 說明 | 回呼參數 |
| --- | --- | --- |
| update:current | 當前步驟變化（v-model:current） | `(index: number)` |
| change | 點擊可點擊步驟導航 | `(index: number)` |

## Slots

| 插槽 | 說明 |
| --- | --- |
| Steps default | 步驟項節點（只收集 `lh-step`） |
| Step icon | 圓圈內容（覆蓋 icon prop 與序號回退） |
| Step title | 標題（覆蓋 title prop） |
| Step description | 描述（覆蓋 description prop） |

## 平台差異

- **純展示 + 狀態類元件，H5 與微信小程式全端可用**；橫縱向由 CSS 控制，兩端一致。
- `<ol>/<li>` 換成 `<view>`（WXSS 禁標籤選擇器）；可點擊頭部用 `view` + `role="button"`（小程式 `<button>` 自帶原生樣式無法 reset），點擊無障礙名稱走 share locales 的 `steps.step` / `steps.finish` / `steps.error`（九語言齊備，倉內不持有文案）。
- **連接線「末項不畫」機制兩端不同**：share 原始碼裡連接線（橫向 `::after` / 縱向 `::before`）靠結構性 `:not(:last-child)` 只畫非末項；WXSS 不支援 `:not()`，建構期淨化時剝離（連接線改為所有項都畫），末項 / 行末項的隱藏全部交給 `--line-last` 類：
  - 橫向：折行度量邏輯與 Vue3 版同源（`getStepsLineLastIndices`），度量改走介接層 `getLhRect`（H5 走 document 查詢、MP 走非同步 `createSelectorQuery`，必須在 onMounted 之後）；
  - 縱向：無折行，直接標記全域末項，由元件 SFC 的 uni-app 適配樣式補一條 `--line-last::before` 隱藏規則（share 無此規則）。
- **容器寬度變化重算折行僅 H5**：H5 用 `ResizeObserver`；MP 無此 API，步驟增刪與方向切換會重算，但尺寸動態變化場景需換頁重進（接受降級，保證 MP 包內無死程式碼）。
- **移植決策（與 Vue3 版對齊，未引入未定義 API）**：本次移植時 plus 真源尚未提供 `simple` 簡潔模式、`process-status` / `finish-status` 自訂狀態、`space` 間距等 API（真源 Props 為 `current` / `direction` / `clickable` / `status` / `themeVars` / `sx`），故本倉同樣不提供；本倉也不含 `themeVars`（本倉 ConfigProvider 的 `componentTheme` 名單未含 steps），後續真源補齊後跟隨升級。
