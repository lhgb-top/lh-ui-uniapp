# Tabs 標籤頁

在同一區塊內切換不同頁籤的內容，頁籤頭支援橫向捲動、卡片外觀與可關閉新增。

## 基礎用法

`v-model` 綁定啟用頁籤的 `name`；未傳時預設啟用首個可用頁籤。

```vue
<template>
  <lh-tabs v-model="active">
    <lh-tab-pane
      name="ink"
      label="水墨"
    >
      水墨：焦、濃、重、淡、清。
    </lh-tab-pane>
    <lh-tab-pane
      name="danqing"
      label="丹青"
    >
      丹青：丹砂與青雘，指代繪畫。
    </lh-tab-pane>
    <lh-tab-pane
      name="liubai"
      label="留白"
    >
      留白：計白當黑，氣韻生動。
    </lh-tab-pane>
  </lh-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref('ink')
</script>
```

## 卡片式

`type="card"` 切換為卡片外觀。

```vue
<template>
  <lh-tabs
    v-model="active"
    type="card"
  >
    <lh-tab-pane
      name="spring"
      label="春"
    >
      春：草木萌動。
    </lh-tab-pane>
    <lh-tab-pane
      name="summer"
      label="夏"
    >
      夏：萬物華實。
    </lh-tab-pane>
  </lh-tabs>
</template>
```

## 頁籤位置

`tab-position="bottom"` 讓頁籤頭置於內容區下方。

```vue
<template>
  <lh-tabs
    v-model="active"
    tab-position="bottom"
  >
    <lh-tab-pane
      name="poem"
      label="詩"
    >
      詩：言志。
    </lh-tab-pane>
    <lh-tab-pane
      name="painting"
      label="畫"
    >
      畫：寫意。
    </lh-tab-pane>
  </lh-tabs>
</template>
```

## 停用頁籤

給 `lh-tab-pane` 傳 `disabled` 後該頁籤無法啟用（點擊無反應，`modelValue` 指向它時回退到首個可用頁籤）。

```vue
<template>
  <lh-tabs v-model="active">
    <lh-tab-pane
      name="first"
      label="可用"
    >
      第一個頁籤可用。
    </lh-tab-pane>
    <lh-tab-pane
      name="second"
      label="停用"
      disabled
    >
      該頁籤已停用，無法啟用。
    </lh-tab-pane>
  </lh-tabs>
</template>
```

## 可關閉與新增

`closable` 讓頁籤渲染關閉按鈕（點擊拋出 `tab-remove`）；`addable` 渲染新增按鈕（點擊拋出 `tab-add`）。
元件只負責拋出事件，頁籤節點的新增與刪除由業務層自行維護，與 Vue3 版一致。

```vue
<template>
  <lh-tabs
    v-model="active"
    closable
    addable
    @tab-remove="handleRemove"
    @tab-add="handleAdd"
  >
    <lh-tab-pane
      v-for="pane in panes"
      :key="pane.name"
      :name="pane.name"
      :label="pane.label"
    >
      {{ pane.label }}：頁籤內容。
    </lh-tab-pane>
  </lh-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref('one')
const panes = ref([
  { name: 'one', label: '標籤一' },
  { name: 'two', label: '標籤二' },
])

function handleRemove(name: string) {
  panes.value = panes.value.filter((pane) => pane.name !== name)
}

function handleAdd() {
  panes.value.push({ name: `new-${panes.value.length + 1}`, label: '新標籤' })
}
</script>
```

## Tabs Props

| 屬性 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| modelValue | 當前啟用頁籤的 name（v-model） | `string` | — |
| type | 外觀：`'line'` 線條 / `'card'` 卡片 | `'line' \| 'card'` | `'line'` |
| closable | 頁籤是否可關閉 | `boolean` | `false` |
| addable | 是否顯示新增按鈕 | `boolean` | `false` |
| tabPosition | 頁籤位置：`'top'` / `'bottom'` | `'top' \| 'bottom'` | `'top'` |
| customClass | 自訂類別名稱 | `string` | — |
| sx | 快速佈局屬性 | `LhSxProps` | — |

## TabPane Props

| 屬性 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| name | 頁籤唯一識別（作為穩定鍵，不建議動態修改） | `string` | — |
| label | 頁籤標題 | `string` | `''` |
| disabled | 是否停用 | `boolean` | `false` |
| customClass | 自訂類別名稱（透傳到面板根節點） | `string` | — |

## Events

| 事件 | 說明 | 回呼參數 |
| --- | --- | --- |
| update:modelValue | 啟用頁籤變化（v-model） | `(name: string)` |
| tab-change | 啟用頁籤變化（使用者互動切換） | `(name: string)` |
| tab-remove | 關閉頁籤按鈕被點擊；元件本身不移除子節點，由業務層維護 | `(name: string)` |
| tab-add | 新增按鈕被點擊；元件本身不新增子節點，由業務層維護 | — |

## Slots

| 插槽 | 說明 |
| --- | --- |
| Tabs default | 頁籤面板節點（只收集 `lh-tab-pane`，可包在 `v-for` / `template` 內） |
| TabPane default | 面板內容 |

## 平台差異

- 頁籤頭由 `scroll-view` 承載（橫向捲動導覽列）：微信小程式端加 `enable-flex` 讓捲動容器成為 flex 佈局，頁籤不縮排不換行；H5 端由類別名稱 `display: flex` 生效。
- **選中態底線為純 CSS 過渡**（啟用頁籤的 `::after` 墨線），不依賴 `transitionend`。若後續需要 JS 聯動的滑動指示條：小程式端 `transitionend` 不可靠，動畫收尾須用 `setTimeout` 對齊時長（與 message / loading 的進出動畫同款處理）。
- **鍵盤導覽（方向鍵 / Home / End / Delete 關閉）僅 H5**：小程式無鍵盤事件，由編譯期常數守衛直接不進入導覽分支，MP 包內無死程式碼；roving tabindex 的 `tabindex` 屬性在 MP 端保留但無鍵盤語義。
- 無障礙 `role="tablist" / "tab" / "tabpanel"` 與 `aria-selected` / `aria-controls` / `aria-labelledby` 兩端皆輸出；小程式讀屏支援以平台能力為準。
- 頁籤與面板的 `id` 由實例唯一前綴生成（`generateId`），一頁多個 tabs 不會衝突。
- **移植決策（與 Vue3 版對齊，未引入未定義 API）**：本次移植時 plus 真源與 `@lh-ui/share` core 尚未提供 `lazy` 懶渲染、`before-leave` 離開攔截、`editable`（= closable + addable 的語義糖）與 `border-card` 外觀，故本倉同樣不提供；面板內容始終渲染，由 `v-show` 控制顯隱。後續真源補齊後跟隨升級。
