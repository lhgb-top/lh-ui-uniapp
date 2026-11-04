# Collapse 折疊面板

折疊 / 展開內容區塊，支援多面板並存與手風琴（同時僅展開一項）模式。

## 基礎用法

不傳 `v-model` 即非受控：元件自管展開態，點擊標題欄切換，`change` 事件攜帶最新展開面板。

```vue
<template>
  <lh-collapse>
    <lh-collapse-item
      name="a"
      title="一致性和多樣性"
    >
      與頁面整體保持一致的視覺與互動。
    </lh-collapse-item>
    <lh-collapse-item
      name="b"
      title="回饋"
    >
      操作後給予清楚及時的狀態回饋。
    </lh-collapse-item>
  </lh-collapse>
</template>
```

## 手風琴

`accordion` 模式下同時最多展開一項，再次點擊已開面板允許全部收起。

```vue
<template>
  <lh-collapse accordion>
    <lh-collapse-item
      name="a"
      title="只開一個"
    >
      同時最多展開一項。
    </lh-collapse-item>
    <lh-collapse-item
      name="b"
      title="再次點擊收起"
    >
      允許全部收起。
    </lh-collapse-item>
  </lh-collapse>
</template>
```

## 受控 v-model 與停用項

`v-model` 綁定展開面板（單值或陣列；手風琴模式下常傳單值）；`disabled` 停用單一面板。

```vue
<template>
  <lh-collapse v-model="activeNames">
    <lh-collapse-item
      name="a"
      title="面板 A"
    >
      受控內容 A
    </lh-collapse-item>
    <lh-collapse-item
      name="b"
      title="面板 B（停用）"
      disabled
    >
      停用內容
    </lh-collapse-item>
    <lh-collapse-item
      name="c"
      title="面板 C"
    >
      受控內容 C
    </lh-collapse-item>
  </lh-collapse>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const activeNames = ref(['a'])
</script>
```

## Collapse Props

| 屬性 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| modelValue | 目前作用中的面板（受控 v-model，單值或陣列） | `LhCollapseKey \| LhCollapseKey[]` | — |
| accordion | 手風琴模式：同時僅展開一個 | `boolean` | `false` |
| customClass | 自訂類名（透傳至根節點） | `string` | — |
| sx | 快速佈局屬性 | `LhSxProps` | — |

## CollapseItem Props

| 屬性 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| name | 面板唯一識別（必填） | `string \| number` | — |
| title | 標題（也可用 title 插槽） | `string` | — |
| disabled | 是否停用 | `boolean` | `false` |
| customClass | 自訂類名（透傳至項根節點） | `string` | — |
| sx | 快速佈局屬性 | `LhSxProps` | — |

## Events

| 事件 | 說明 | 回呼參數 |
| --- | --- | --- |
| update:modelValue | 展開面板變化（受控 v-model，元件不留內部狀態） | `(value: LhCollapseKey \| LhCollapseKey[])` |
| change | 展開面板變化（非受控；accordion 下為單值，全部收起時為 `undefined`） | `(value: LhCollapseKey \| LhCollapseKey[])` |

## Slots

| 插槽 | 說明 |
| --- | --- |
| Collapse default | 面板項節點（`lh-collapse-item`） |
| CollapseItem default | 面板內容 |
| CollapseItem title | 面板標題（覆蓋 `title` prop） |

## 平台差異

- **展開 / 收起動畫為純 CSS**（`grid-template-rows` 在 `0fr / 1fr` 之間過渡 + 箭頭 `transform` 旋轉），整個過程不監聽 `transitionend`（微信小程式端該事件不可靠，本倉統一不依賴它）。類名切換即落位：即使個別 MP 渲染核心對 grid 過渡支援不全，最終展開態仍然正確，只是沒有過渡過程。
- **內容區始終渲染**（不做 `v-if` 直切）：`lh-collapse__wrap` 由 `--active` 類別切換顯示，若後續有「展開時才渲染內容」的需求，由使用者在內容側用 `v-if` 自行控制。
- `<h3>` / `<button>` 全部換成 `<view>` / `<text>`（WXSS 禁標籤選擇器）；停用不再依賴原生 `<button disabled>`，改由點擊守衛 + `--disabled` 類別 + `aria-disabled` 表達。
- 無障礙語意兩端均輸出：標題 `role="button"` + `aria-expanded` / `aria-controls`，內容區 `role="region"` + `aria-labelledby`；MP 讀屏支援以平台能力為準。H5 端標題天然支援 Enter / Space（聚焦在可點擊節點上）。
- 頭 / 內容關聯 `id` 由 `generateId` 生成本地唯一值（不用 Vue 3.5 的 `useId`，相容 uni-app 各端核心版本），一頁多個折疊面板不會衝突。
- **移植決策（與 Vue3 版對齊，未引入未定義 API）**：本次移植嚴格對齊 plus 真源，僅提供 `v-model`（單值 / 陣列）、`accordion`、面板 `name` / `title` / `disabled` 與 `title` 插槽；真源未提供的巢狀折疊、圖示插槽、懶載入等一律不私自新增，後續真源補齊後跟隨升級。
- 本倉膠水層另有受控取值修正（登記在 changeset）：受控時展開態改為 computed 訂閱 `props.modelValue`，父組件非同步更新 v-model 時面板能立即跟隨，core 純函式與 props 契約與 plus 完全一致。
