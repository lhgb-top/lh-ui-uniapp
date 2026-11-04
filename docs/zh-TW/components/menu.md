# Menu 導覽選單

頁面與功能導覽選單。支援直向（預設）與橫向兩種版面模式，子選單可遞迴巢狀；
選中態由 `v-model` 承載，展開態可受控（`openeds`）也可非受控（`default-openeds`）。

## 基礎用法

```vue
<template>
  <lh-menu v-model="active">
    <lh-menu-item index="1">首頁</lh-menu-item>
    <lh-menu-item index="2">作品</lh-menu-item>
    <lh-menu-item index="3">關於</lh-menu-item>
  </lh-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('1')
</script>
```

`index` 是項目的唯一識別字，點擊葉子項時隨 `select` 事件拋出（`update:modelValue` 同步拋出，可用 `v-model` 接收）。

## 子選單與預設展開

```vue
<template>
  <lh-menu v-model="active" :default-openeds="['2']" @select="onSelect">
    <lh-menu-item index="1">首頁</lh-menu-item>
    <lh-sub-menu index="2" title="我的創作">
      <lh-menu-item index="2-1">水墨畫</lh-menu-item>
      <lh-menu-item index="2-2">工筆畫</lh-menu-item>
    </lh-sub-menu>
  </lh-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('')
function onSelect(index: string, indexPath: string[]) {
  console.log(index, indexPath)
}
</script>
```

巢狀子選單可遞迴多層：`select` 事件的 `indexPath` 是從最外層子選單到被選項的完整路徑（如 `['2', '2-1', '2-1-1']`）。

## 手風琴

`unique-opened` 讓同一時間最多展開一個子選單（再次點擊已展開的標題會收起，允許全部收起）。

```vue
<template>
  <lh-menu v-model="active" unique-opened>
    <lh-sub-menu index="1" title="第一組">
      <lh-menu-item index="1-1">選項 1-1</lh-menu-item>
    </lh-sub-menu>
    <lh-sub-menu index="2" title="第二組">
      <lh-menu-item index="2-1">選項 2-1</lh-menu-item>
    </lh-sub-menu>
  </lh-menu>
</template>
```

## 受控展開

傳入 `openeds` 即為受控模式：組件內部不再自行維護展開態，由 `update:openeds` 事件回呼驅動。

```vue
<template>
  <lh-menu v-model="active" :openeds="openeds" @update:openeds="openeds = $event">
    <lh-sub-menu index="1" title="受控子選單">
      <lh-menu-item index="1-1">選項 1-1</lh-menu-item>
    </lh-sub-menu>
  </lh-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('')
const openeds = ref<string[]>(['1'])
</script>
```

## 分組

`lh-menu-item-group` 把同類項歸組（僅視覺分組，不參與展開邏輯）。

```vue
<template>
  <lh-menu v-model="active">
    <lh-menu-item-group title="基礎內容">
      <lh-menu-item index="1">文章</lh-menu-item>
      <lh-menu-item index="2">圖片</lh-menu-item>
    </lh-menu-item-group>
    <lh-menu-item-group title="進階功能">
      <lh-menu-item index="3">數據分析</lh-menu-item>
    </lh-menu-item-group>
  </lh-menu>
</template>
```

## 橫向模式

```vue
<template>
  <lh-menu v-model="active" mode="horizontal">
    <lh-menu-item index="1">首頁</lh-menu-item>
    <lh-sub-menu index="2" title="作品集">
      <lh-menu-item index="2-1">水墨畫</lh-menu-item>
      <lh-menu-item index="2-2">工筆畫</lh-menu-item>
    </lh-sub-menu>
    <lh-menu-item index="3">關於</lh-menu-item>
  </lh-menu>
</template>
```

橫向模式下子選單從標題下方飛出（`bottom-start`），巢狀層級的子選單從右側飛出（`right-start`）。

## 折疊模式

直向模式搭配 `collapse` 收起為窄條，此時子選單改為右側飛出面板。

```vue
<template>
  <lh-menu v-model="active" collapse>
    <lh-sub-menu index="1" title="收發">
      <lh-menu-item index="1-1">收件匣</lh-menu-item>
      <lh-menu-item index="1-2">已寄出</lh-menu-item>
    </lh-sub-menu>
    <lh-menu-item index="2">草稿</lh-menu-item>
  </lh-menu>
</template>
```

## Menu API

### Props

| 屬性 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| modelValue | 當前啟動項（v-model；未傳時組件內部維護） | `string` | — |
| mode | 版面模式 | `'horizontal' \| 'vertical'` | `'vertical'` |
| collapse | 直向模式折疊為圖示條（子選單改為飛出面板） | `boolean` | `false` |
| defaultOpeneds | 預設展開的子選單鍵（非受控） | `string[]` | `[]` |
| openeds | 受控展開的子選單鍵 | `string[]` | — |
| uniqueOpened | 手風琴：同時只展開一個子選單 | `boolean` | `false` |
| sx | sx 快速版面屬性 | `LhSxProps` | — |

### Events

| 事件 | 說明 | 參數 |
| --- | --- | --- |
| select | 選中葉子項時觸發 | `(index: string, indexPath: string[])` |
| open | 子選單展開時觸發 | `(index: string, indexPath: string[])` |
| close | 子選單收起時觸發 | `(index: string, indexPath: string[])` |
| update:modelValue | 啟動項變化（v-model） | `(value: string)` |
| update:openeds | 展開集合變化 | `(value: string[])` |

### Slots

| 插槽 | 說明 |
| --- | --- |
| default | 選單內容（`LhMenuItem` / `LhSubMenu` / `LhMenuItemGroup` 組合） |

## MenuItem API

### Props

| 屬性 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| index | 唯一識別字（必填） | `string` | — |
| disabled | 是否停用（保留 aria-disabled 語意，點擊與鍵盤啟動均不觸發） | `boolean` | `false` |
| sx | sx 快速版面屬性 | `LhSxProps` | — |

### Events

| 事件 | 說明 | 參數 |
| --- | --- | --- |
| click | 葉子項被點擊時觸發（停用項不觸發） | `(index: string)` |

## SubMenu API

### Props

| 屬性 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| index | 唯一識別字（必填） | `string` | — |
| title | 標題（也可用 title 插槽） | `string` | — |
| disabled | 是否停用 | `boolean` | `false` |
| sx | sx 快速版面屬性 | `LhSxProps` | — |

### Events

| 事件 | 說明 | 參數 |
| --- | --- | --- |
| select | 後代葉子項被選中時觸發（路徑包含本級 index） | `(index: string, indexPath: string[])` |

### Slots

| 插槽 | 說明 |
| --- | --- |
| default | 子選單內容（可繼續巢狀 `LhMenuItem` / `LhSubMenu`） |
| title | 自訂標題內容 |

## MenuItemGroup API

### Props

| 屬性 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| title | 群組標題（也可用 title 插槽） | `string` | — |
| sx | sx 快速版面屬性 | `LhSxProps` | — |

### Slots

| 插槽 | 說明 |
| --- | --- |
| default | 群組內容 |
| title | 自訂群組標題 |

### 無障礙

- 容器為 `role="menu"`（橫向模式 `role="menubar"`）；葉子項與子選單標題為 `role="menuitem"`，停用項輸出 `aria-disabled`，子選單標題另帶 `aria-expanded` / `aria-haspopup` / `aria-controls`
- 鍵盤遵循 APG menu 模式（僅 H5）：直向模式 ↑/↓ 在可見項間循環（跳過停用項與收起面板內的項）、Home/End 跳首尾；葉子項 Enter/Space 啟動；子選單標題 Enter/Space/→ 展開並把焦點移入面板，←/Esc 收起
- 橫向模式標題的 ←/→ 語意保留給各標題自身，根容器不接管方向鍵

::: tip 平台差異（與 Vue3 版的差異）
- **直向與手風琴全端可用**：直向模式（含子選單內嵌展開、手風琴、受控 v-model / openeds）為純 CSS + provide/inject 實作，H5 與微信小程式行為一致。
- **橫向捲動**：橫向模式項目總寬超出容器時，捲動由容器自身的 `overflow-x` 承載（WXSS 下 view 支援溢出捲動），不套 `scroll-view`——後者在 H5 端會把插槽內容包進內層 `uni-scroll-view-content`，破壞 share scss 的 flex 直系子結構（與 lh-tabs 的橫向標頭不同，menu 項是區塊級 flex，無法像頁籤那樣靠 inline-flex 規避）。
- **飛出子選單走 root-portal**：橫向 / 折疊模式的飛出面板由 plus 的 `<teleport to="body">` 改為 `lh-root-portal` 承載（低版本基礎庫頁內 fixed 備援）；定位走兩幅非同步度量（先隱藏渲染量尺寸 → `computePosition` 定位 → 顯示，防閃爍），定位計算是非同步的，不能假設同步拿到結果；巢狀層級從右側飛出（`right-start`）。
- **hover 僅 H5**：標題懸停展開只在 H5 生效；小程式無 hover 語意，飛出面板的開啟 / 收起均由標題點擊承載，點擊外部區域由頁內透明遮罩收起（等價 plus 的 mouseleave 收起語意）。
- **鍵盤導覽僅 H5**：↑/↓ / Home / End / Enter / Space / ←/→ / Esc 只在 H5 端生效；小程式無鍵盤事件，整段由條件編譯裁剪（MP 包內無死程式碼）。
- **進出轉場未實作**：plus 用 `Transition` 淡入淡出，MP 端 `Transition` 不可靠，與 tooltip / select 等一致不綁轉場；內嵌面板展開動畫為純 CSS（grid-template-rows 0fr/1fr），不監聽 transitionend（MP 不可靠），即使 MP 端轉場不支援最終態仍然正確。
:::
