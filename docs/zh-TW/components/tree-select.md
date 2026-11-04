# TreeSelect 樹形選擇器

樹形選擇器用於帶層級結構資料的場景，例如組織架構、目錄分類。觸發器點擊後彈出樹狀面板，單選點擊節點即選中並關閉，多選透過勾選框選擇（父子級聯）。

## 基礎用法

```vue
<template>
  <lh-tree-select v-model="value" :data="data" placeholder="請選擇節點" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<string | undefined>(undefined)
const data = [
  {
    key: 'zhinan',
    label: '指南',
    children: [
      {
        key: 'sheji',
        label: '設計指南',
        children: [
          { key: 'yuansze', label: '顏色' },
          { key: 'fuziyuanze', label: '字體' },
        ],
      },
      { key: 'shejiguize', label: '設計規則' },
    ],
  },
  {
    key: 'zujian',
    label: '組件',
    children: [
      { key: 'jiben', label: '基礎' },
      { key: 'fankui', label: '反饋' },
    ],
  },
]
</script>
```

點擊節點即選中（含非葉節點）並關閉面板；點擊節點左側的展開箭頭只展开 / 收起，不改變選中值。觸發器回顯已選節點的 `label`。

## 多選模式

```vue
<template>
  <lh-tree-select v-model="value" :data="data" multiple placeholder="請選擇多個節點" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<string[]>(['jiben', 'fankui'])
const data = [
  {
    key: 'zujian',
    label: '組件',
    children: [
      { key: 'jiben', label: '基礎' },
      { key: 'fankui', label: '反饋' },
    ],
  },
]
</script>
```

多選模式下 `v-model` 綁定勾選鍵陣列（`string[]`），勾選父子級聯：勾選父節點自動帶上全部可勾選後代，後代全部勾選時父節點為全選、部分勾選時為半選。點擊節點標籤只展開，勾選走勾選框（與 Vue3 版一致）。觸發器回顯全部勾選鍵的 `label`，以「、」拼接。

## 節點禁用

節點資料中的 `disabled: true` 禁用該節點（點擊不展開也不選中，勾選框不可點擊）；`disabled` prop 禁用整個選擇器。

```vue
<template>
  <lh-tree-select v-model="value" :data="disabledData" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<string | undefined>(undefined)
const disabledData = [
  {
    key: 'zhinan',
    label: '指南',
    children: [
      {
        key: 'sheji',
        label: '設計指南',
        disabled: true,
        children: [{ key: 'yuansze', label: '顏色' }],
      },
      { key: 'shejiguize', label: '設計規則' },
    ],
  },
]
</script>
```

## TreeSelect API

### Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| modelValue | 綁定值（單選 `string` / 多選 `string[]`，受控 v-model） | `string \| string[] \| undefined` | — |
| data | 樹狀資料 | `LhTreeNode[]` | `() => []` |
| multiple | 是否多選（顯示勾選框，值為勾選鍵陣列，父子級聯） | `boolean` | `false` |
| disabled | 是否禁用整個選擇器 | `boolean` | `false` |
| placeholder | 佔位符（未傳時取語言包 `select.placeholder`，繁體中文「請選擇」） | `string` | — |
| customClass | 自訂類名（透傳到根節點） | `string` | — |
| themeVars | 元件級主題變數 | `Record<string, string>` | — |
| sx | sx 快速佈局屬性（作用於觸發器根元素，浮層面板不受影響） | `LhSxProps` | — |

### Events

| 事件 | 說明 | 參數 |
| --- | --- | --- |
| update:modelValue | 綁定值變化時觸發 | `(value: string \| string[] \| undefined)` |
| change | 選中值變化時觸發 | `(value: string \| string[] \| undefined)` |

### 資料結構

`LhTreeNode` 類型定義（真源在 `@lh-ui/share/core/tree`）：

```ts
interface LhTreeNode {
  /** 唯一鍵 */
  key: string
  /** 顯示文字 */
  label: string
  /** 子節點 */
  children?: LhTreeNode[]
  /** 禁用 */
  disabled?: boolean
  /** 是否葉節點（不傳按 children 推斷） */
  isLeaf?: boolean
}
```

### 無障礙

- 觸發器帶 `aria-haspopup="tree"` / `aria-expanded` / `aria-label`（取語言包 `treeSelect.triggerLabel`）
- 面板為 `role="listbox"`，內嵌樹為 `role="tree"`，節點為 `role="treeitem"` 並帶 `aria-level` / `aria-expanded` / `aria-selected` / `aria-disabled`；多選時面板帶 `aria-multiselectable`，勾選框為 `role="checkbox"` 並帶 `aria-checked`（半選輸出 `mixed`）
- 層級縮排、展開箭頭旋轉、勾選框三態外觀全部來自 share 樣式源（`@lh-ui/share/styles/tree`），無端內重複樣式

::: tip 平台差異（與 Vue3 版的差異）
- **膠水組合而非獨立 core**：share core 沒有 tree-select 模組，本端按 plus 的實現形態做「select 觸發器 + lh-tree 面板」的組合——面板內嵌 `lh-tree`，樹狀展開 / 選中 / 勾選級聯全部由 `lh-tree` 消費 `core/tree` 純函式（`flattenTree` / `toggleCheckKeys` / `getNodeCheckState` 等），本元件不拷貝任何樹邏輯。API 與事件按 plus 對齊，未私自新增能力。
- **彈層面板化**：plus 的面板掛在 `Teleport to="body"` 下；uni-app 端由 `lh-root-portal` 承載（低版本頁內 fixed 兜底），定位走兩帧非同步度量（先隱藏渲染量尺寸 → `computePosition` 定位 → 顯示，防閃爍），定位計算是非同步的，不能假設同步拿到結果。
- **樹狀面板捲動**：share scss 的 `.lh-tree-select__panel` 用 `overflow: auto`，MP 的 `view` 沒有可靠的溢出捲動，面板內再包一層 `scroll-view`（`scroll-y`）承載縱向捲動，最大高度與 share 的 320px 對齊。
- **鍵盤導覽不啟用**：plus 的觸發器 Escape 關閉與文件級鍵盤監聯依賴鍵盤事件，小程式無鍵盤事件，本端由點擊頁內透明遮罩關閉面板（與 select / cascader 同款），未做條件編譯降級。
- **`teleported` prop 未移植**：plus 用它控制面板是否掛到 body，uni-app 端彈層一律走 `lh-root-portal`，無此語義。
- **點擊外部關閉**：plus 用 `useLhClickOutside` 監聽 document 點擊；uni-app 端由頁內透明遮罩承載（點擊遮罩即關閉）。
- **多選勾選狀態受控修正**：plus 沒有把 `checked-keys` 傳給內嵌的樹，多選預設值不會回顯到勾選框；本端把 `v-model` 同時作為 `checked-keys` 傳入，勾選框與觸發器回顯都由 `v-model` 驅動，API 不變。
- **觸發器捲出視口不自動收起**：uni-app 無統一的捲動 / 尺寸變更監聽通道，未移植。
:::
