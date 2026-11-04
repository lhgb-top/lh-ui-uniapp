# Cascader 級聯選擇器

級聯選擇器用於多層級資料的場景，例如：省市地區選擇。點擊觸發器後彈出多列面板，逐級展開子級，選中葉節點（或 `check-strictly` 下任意層級）完成選擇。

## 基礎用法

```vue
<template>
  <lh-cascader v-model="value" :options="options" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>([])
const options = [
  {
    value: 'zhinan',
    label: '指南',
    children: [
      {
        value: 'sheji',
        label: '設計指南',
        children: [
          { value: 'yuansze', label: '顏色' },
          { value: 'fuziyuanze', label: '字體' },
        ],
      },
      { value: 'shejiguize', label: '設計規則' },
    ],
  },
  {
    value: 'zujian',
    label: '組件',
    children: [
      { value: 'jiben', label: '基礎' },
      { value: 'fankui', label: '反饋' },
    ],
  },
]
</script>
```

點擊含子級的項先展開下一列，再點擊葉節點選中（單選選中後自動關閉面板）。

## 多選模式

```vue
<template>
  <lh-cascader v-model="value" :options="options" multiple />
  <!-- 摺疊標籤：只顯示首個已選項 + 計數 -->
  <lh-cascader v-model="value2" :options="options" multiple collapse-tags />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>([])
const value2 = ref<(string | number)[]>(['yuansze', 'fuziyuanze'])
const options = [
  {
    value: 'zhinan',
    label: '指南',
    children: [
      { value: 'sheji', label: '設計指南' },
      { value: 'shejiguize', label: '設計規則' },
    ],
  },
  {
    value: 'zujian',
    label: '組件',
    children: [
      { value: 'jiben', label: '基礎組件' },
      { value: 'fankui', label: '反饋組件' },
    ],
  },
]
</script>
```

多選模式下 `v-model` 綁定各選中路徑的**末級值**陣列，已選項以標籤形式展示在觸發器內。

## 選項禁用

節點資料中的 `disabled: true` 禁用該節點（點擊不展開也不選中）；`disabled` prop 禁用整個選擇器；`readonly` 唯讀不彈層。

```vue
<template>
  <lh-cascader v-model="value" :options="disabledOptions" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>([])
const disabledOptions = [
  {
    value: 'zhinan',
    label: '指南',
    disabled: true,
    children: [{ value: 'sheji', label: '設計指南' }],
  },
  {
    value: 'zujian',
    label: '組件',
    children: [
      { value: 'jiben', label: '基礎組件' },
      { value: 'fankui', label: '反饋組件', disabled: true },
    ],
  },
]
</script>
```

## 路徑顯示與返回值

```vue
<template>
  <!-- 完整路徑（預設） -->
  <lh-cascader v-model="value" :options="options" placeholder="完整路徑（預設）" />
  <!-- 只顯示末級 -->
  <lh-cascader v-model="value" :options="options" :show-all-levels="false" placeholder="只顯示末級" />
  <!-- 自訂分隔符 -->
  <lh-cascader v-model="value" :options="options" separator=" > " placeholder="分隔符 >" />
  <!-- v-model 只綁定末級值（回顯仍是完整路徑） -->
  <lh-cascader v-model="leafValue" :options="options" :emit-path="false" placeholder="僅返回末級值" />
  <!-- 任意層級可選（點擊非葉節點直接選中） -->
  <lh-cascader v-model="anyValue" :options="options" check-strictly placeholder="任意層級可選" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>(['zhinan', 'sheji', 'yuansze'])
const leafValue = ref<(string | number)[]>(['yuansze'])
const anyValue = ref<(string | number)[]>(['zhinan', 'sheji'])
const options = [
  {
    value: 'zhinan',
    label: '指南',
    children: [
      { value: 'sheji', label: '設計指南', children: [{ value: 'yuansze', label: '顏色' }] },
    ],
  },
]
</script>
```

> 佔位符預設取語言包 `cascader.placeholder`，可用 `placeholder` 覆蓋。

## 可過濾

`filterable` 開啟搜尋：過濾輸入框位於彈層內（小程式無觸發器內輸入聚焦語義），輸入關鍵字後搜尋結果按完整路徑展示，點擊結果直接選中。

```vue
<template>
  <lh-cascader v-model="value" :options="options" filterable placeholder="輸入關鍵字搜尋" />
</template>
```

無匹配結果時展示語言包 `cascader.noMatch`，可用 `no-match` 插槽自訂。

## 欄位別名

`item-config` 宣告節點欄位別名（`value` / `label` / `children` / `disabled` / `leaf`），非同步資料或後端結構無需手工轉換：

```vue
<template>
  <lh-cascader
    v-model="value"
    :options="aliasedOptions"
    :item-config="{ value: 'id', label: 'name', children: 'sub' }"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>(['zhejiang', 'hangzhou', 'xihu'])
const aliasedOptions = [
  {
    id: 'zhejiang',
    name: '浙江省',
    sub: [{ id: 'hangzhou', name: '杭州市', sub: [{ id: 'xihu', name: '西湖區' }] }],
  },
]
</script>
```

## Cascader API

### Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| modelValue | 綁定值（`emitPath` 為 `false` 時僅末級值） | `(string \| number)[]` | `() => []` |
| options | 選項列表（樹狀結構） | `LhCascaderNode[]` | `() => []` |
| size | 尺寸 | `LhCascaderSize` | `'medium'` |
| disabled | 是否禁用整個選擇器 | `boolean` | `false` |
| clearable | 是否可清除 | `boolean` | `true` |
| placeholder | 佔位符（未傳時取語言包 cascader.placeholder） | `string` | — |
| readonly | 是否唯讀（不彈層） | `boolean` | `false` |
| showAllLevels | 觸發器是否顯示完整路徑 | `boolean` | `true` |
| checkStrictly | 任意層級節點可選 | `boolean` | `false` |
| emitPath | 返回值是否包含完整路徑 | `boolean` | `true` |
| multiple | 是否多選 | `boolean` | `false` |
| cascading | 是否級聯關聯（懸停展開子級，僅 H5 有效） | `boolean` | `true` |
| separator | 路徑分隔符 | `string` | `'/'` |
| collapseTags | 多選模式下是否摺疊標籤 | `boolean` | `false` |
| filterable | 是否可搜尋 | `boolean` | `false` |
| itemConfig | 節點欄位別名 | `LhCascaderItemConfig` | `() => ({})` |
| customClass | 自訂類名（透傳到根節點） | `string` | — |
| themeVars | 組件級主題變數 | `Record<string, string>` | — |
| sx | sx 快速佈局屬性（作用於觸發器根元素，浮層面板不受影響） | `LhSxProps` | — |

### Events

| 事件 | 說明 | 參數 |
| --- | --- | --- |
| update:modelValue | 綁定值變化時觸發 | `(value: (string \| number)[])` |
| change | 選中值變化時觸發 | `(value: (string \| number)[], path: LhCascaderNode[] \| null)` |

### Slots

| 插槽 | 說明 |
| --- | --- |
| no-match | 過濾無匹配結果時的自訂內容 |

### 資料結構

`LhCascaderNode` 類型定義：

```ts
interface LhCascaderNode {
  value: string | number
  label: string
  disabled?: boolean
  leaf?: boolean
  children?: LhCascaderNode[]
}
```

### 無障礙

- 觸發器帶 `aria-haspopup="listbox"` / `aria-expanded` / `aria-controls`（屬性包由 share 的 `getCascaderTriggerAria` 產出，逐鍵攤開綁定）
- 彈層面板為 `role="dialog"`，每列為 `role="listbox"`（`aria-label` 走語言包 `cascader.columnLabel`），列項為 `role="option"` 並帶 `aria-selected` / `aria-disabled` / `aria-expanded`
- 定位引擎為自研純函數（flip / shift 防溢出），零第三方執行時依賴

::: tip 平台差異（與 Vue3 版的差異）
- **浮層面板化**：plus 的面板掛在 `Teleport to="body"` 下、`Transition` 淡入淡出；uni-app 端由 `lh-root-portal` 承載（低版本頁內 fixed 兜底），定位走兩幀非同步度量（先隱藏渲染量尺寸 → `computePosition` 定位 → 顯示，防閃爍）。定位計算是非同步的，不能假設同步拿到結果。進出過渡未綁定（MP 的 `Transition` 不可靠，與 tooltip / dropdown / popover 一致）。
- **列滾動**：每列是一個 `scroll-view`（`scroll-y`）獨立縱向滾動——MP 的 `view` 沒有可靠的溢出滾動，share scss 裡 `overflow-y: auto` 的列容器在 H5 端由 `scroll-view` 的 H5 實作等價兜底。
- **鍵盤導航僅 H5**：觸發器 Enter/Space 開合、方向鍵把焦點送進面板；面板內 ↑↓ 列內移動（跳過禁用項）、←→ 跨列、Enter/Space 等價點擊；Escape 經文件級監聽關閉（多彈層疊加時只關棧頂）。整段處理函數體由條件編譯裁剪，MP 包內無死程式碼。
- **懸停展開僅 H5**：`cascading` 的懸停展開子級依賴 hover 語義，小程式端無 hover，子級只能點擊展開（`cascading` 在 MP 端等效於關閉懸停展開）。
- **過濾輸入框位置**：plus 的 `filterable` 輸入框就是觸發器本身；uni-app 端把過濾輸入框放進彈層內（與 select 同款），MP 端無觸發器內 input 聚焦語義。
- **點擊外部關閉**：plus 用 `useLhClickOutside` 監聽 document 點擊；uni-app 端由頁內透明遮罩承載（點擊遮罩即關閉）。
- **觸發器滾出視口不自動收起**：uni-app 無統一的滾動 / 尺寸變化監聽通道，未移植。
- **焦點圈 / roving tabindex 僅 H5**：MP 無鍵盤焦點語義，`tabindex` 綁定在 MP 端不落值。
:::
