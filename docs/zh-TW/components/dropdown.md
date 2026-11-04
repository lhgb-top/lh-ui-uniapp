# Dropdown 下拉選單

向下彈出的命令選單。觸發器可以是任意元素，選單項透過 `command` 標識，點選後以 `command` 事件拋出。

## 基礎用法

```vue
<template>
  <lh-dropdown @command="onCommand">
    <lh-button>{{ selectedLabel || '更多操作' }} ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="new">新建</lh-dropdown-item>
      <lh-dropdown-item command="edit">編輯</lh-dropdown-item>
      <lh-dropdown-item command="delete">刪除</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const lastCommand = ref('')
// 觸發器文字由使用者維護：command 事件只拋出命令值，標籤怎麼顯示交給外部決定
const labelMap: Record<string, string> = { new: '新建', edit: '編輯', delete: '刪除' }
const selectedLabel = ref('')
function onCommand(command: string | number | undefined) {
  lastCommand.value = String(command)
  selectedLabel.value = labelMap[String(command)] ?? String(command)
}
</script>
```

## 觸發方式

預設為 `click`，也可改為懸停或長按展開。

```vue
<template>
  <!-- 懸停觸發（僅 H5 有效，小程序端降級為點選切換） -->
  <lh-dropdown trigger="hover" @command="onHoverCommand">
    <lh-button>懸停觸發 ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="ink">水墨</lh-dropdown-item>
      <lh-dropdown-item command="danqing">丹青</lh-dropdown-item>
    </template>
  </lh-dropdown>

  <!-- 右鍵 / 長按觸發 -->
  <lh-dropdown trigger="contextmenu" @command="onContextCommand">
    <lh-button>長按觸發 ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="refresh">重新整理</lh-dropdown-item>
      <lh-dropdown-item command="copy">複製</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>
```

## 禁用與分割線

```vue
<template>
  <!-- 帶禁用項與分割線的操作選單 -->
  <lh-dropdown @command="onActionCommand">
    <lh-button>操作 ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="export">匯出</lh-dropdown-item>
      <lh-dropdown-item command="import">匯入</lh-dropdown-item>
      <lh-dropdown-item divided command="audit">稽核日誌</lh-dropdown-item>
      <lh-dropdown-item disabled command="purge">清空資料</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>
```

> 禁用項帶 `aria-disabled="true"`，螢幕閱讀器能讀出該項；但方向鍵會跳過它，點選與 Enter/Space 均不觸發 `command`。

## 位置與最大高度

```vue
<template>
  <!-- 底部右對齊並限制最大高度（超出捲動） -->
  <lh-dropdown placement="bottom-end" :max-height="160" @command="onItemCommand">
    <lh-button>底部右對齊 ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item v-for="i in 12" :key="i" :command="i">第 {{ i }} 項</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>
```

## 受控顯隱與點選行為

`v-model:visible` 手動控制顯隱；`hide-on-click` 控制選中後是否自動收起；`popper-class` 給彈出層加自訂類別。

```vue
<template>
  <!-- 受控顯隱：選中後不收起 -->
  <lh-dropdown v-model:visible="menuVisible" :hide-on-click="false" popper-class="demo-menu">
    <lh-button>{{ menuVisible ? '收起' : '展開' }} ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="copy">複製（選中後不收起）</lh-dropdown-item>
      <lh-dropdown-item command="paste">貼上</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const menuVisible = ref(false)
</script>
```

## Dropdown API

### Props

| 屬性 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| trigger | 觸發方式：`click`（全端）/ `hover`（僅 H5，MP 降級為點選）/ `contextmenu`（長按承載） | `'hover' \| 'click' \| 'contextmenu'` | `'click'` |
| placement | 展示位置（12 種方位） | `LhDropdownPlacement` | `'bottom-start'` |
| visible | 顯隱狀態（v-model:visible） | `boolean` | — |
| disabled | 是否禁用觸發器 | `boolean` | `false` |
| hideOnClick | 點選選單項後是否自動關閉 | `boolean` | `true` |
| popperClass | 彈出層自訂類別名 | `string` | — |
| maxHeight | 選單最大高度（數字為 px） | `string \| number` | — |
| themeVars | 元件級主題變數 | `Record<string, string>` | — |
| bgPattern | 元件級背景花紋，覆蓋 ConfigProvider 配置 | `string` | — |
| sx | sx 快速佈局屬性（作用於觸發器根元素） | `LhSxProps` | — |

### Events

| 事件 | 說明 | 參數 |
| --- | --- | --- |
| command | 點選選單項時觸發 | `(command: string \| number \| undefined)` |
| visible-change | 顯隱變化 | `(value: boolean)` |
| update:visible | 顯隱變化（v-model） | `(value: boolean)` |

### Slots

| 插槽 | 說明 |
| --- | --- |
| default | 觸發器內容 |
| dropdown | 選單內容（`LhDropdownItem` 列表） |

### Methods

| 方法 | 說明 |
| --- | --- |
| show | 編程式展開 |
| hide | 編程式收起 |
| toggle | 編程式切換 |

## DropdownItem API

### Props

| 屬性 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| command | 命令標識，點選時隨 `command` 事件拋出 | `string \| number` | — |
| disabled | 是否禁用 | `boolean` | `false` |
| divided | 是否在上方顯示分割線 | `boolean` | `false` |

### Events

| 事件 | 說明 | 參數 |
| --- | --- | --- |
| click | 選單項被點選時觸發（禁用項不觸發） | `(command: string \| number \| undefined)` |

### 無障礙

- 觸發器帶 `aria-haspopup="menu"` 與 `aria-expanded` / `aria-controls`；選單為 `role="menu"`，項為 `role="menuitem"`
- 鍵盤遵循 APG menu 模式（僅 H5）：↑/↓ 循環（跳過禁用項）、Home/End 跳首尾、Enter/Space 觸發 `command` 並關閉、Esc 關閉並歸還焦點
- 選單展開時主軸溢出會自動翻轉方向，交叉軸溢出會夾回視口

::: tip 平台差異（與 Vue3 版的差異）
- **觸發方式**：小程序無 hover 語義，`trigger="hover"` 在 MP 端降級為點選 / 觸碰切換；無右鍵語義，`trigger="contextmenu"` 由長按（`longpress`）承載（H5 亦走長按，不阻止瀏覽器預設右鍵選單，plus 會 `preventDefault`）。
- **彈層承載與定位**：無 `teleportTarget` prop——小程序無 DOM teleport，彈層統一由 `root-portal`（低版本頁內 fixed 兜底）承載；定位走兩帧非同步度量（先隱藏渲染量尺寸 → `computePosition` 定位 → 顯示，防閃爍），定位計算是非同步的，不能假設同步拿到結果。
- **鍵盤導航僅 H5**：方向鍵 / Home / End / Enter / Space / Esc 都只在 H5 端生效（Esc 走文件級監聽、多彈層疊加時只關堆疊頂）；小程序無鍵盤事件，整段由條件編譯裁剪。
- **點選外部關閉**由頁內透明遮罩承載（等價 plus 的 document 級 click-outside 監聽）。
- **進出過渡未實現**：plus 用 `Transition` 淡入淡出，MP 端 `Transition` 不可靠，與 tooltip / select 一致不綁過渡。
- **觸發器捲出視口不自動收起**：plus 的 `useLhPopper` 有 scroll-out 回呼，uni-app 無統一的捲動 / 尺寸變化監聽通道，未移植。
:::
