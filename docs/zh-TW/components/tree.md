# Tree 樹形控件

樹形資料的展示與互動。展開 / 收合、勾選框級聯、懶載入合併等純邏輯全部消費
`@lh-ui/share` 的 core 純函式（`flattenTree` / `toggleCheckKeys` / `mergeLoadedChildren` 等），
元件層只負責渲染、事件與鍵盤導覽。

## 基礎用法

```vue
<template>
  <lh-tree :data="treeData" :default-expanded-keys="['a']" />
</template>

<script setup lang="ts">
import type { LhTreeNode } from '@lh-ui/share/core/tree'

const treeData: LhTreeNode[] = [
  {
    key: 'a',
    label: '前端',
    children: [
      { key: 'a-1', label: 'Vue' },
      { key: 'a-2', label: 'React' },
    ],
  },
  { key: 'b', label: '後端', children: [{ key: 'b-1', label: 'Node' }] },
  { key: 'c', label: '維運', disabled: true },
]
</script>
```

`data` 是 `LhTreeNode[]`：`key` 唯一、`label` 顯示文字、`children` 子節點、
`disabled` 停用、`isLeaf` 是否葉子（不傳則依 `children` 推斷）。節點層級縮排由行內樣式
`level * 18 + 8` px 承載。點擊整列會選中節點（`update:selectedKeys` / `select`），
`expandOnClickNode` 預設開啟時點擊非葉子節點同時展開 / 收合；點擊箭頭只切換展開。

## 可勾選（級聯）

`show-checkbox` 顯示勾選框。勾選父級會級聯全部子代；子代全選時父級自動選中，
部分選中顯示半選狀態（indeterminate）。

```vue
<template>
  <lh-tree :data="treeData" show-checkbox :default-expanded-keys="['a', 'b']" />
</template>
```

勾選狀態可用 `default-checked-keys`（非受控）或 `v-model:checked-keys`（受控）承載，
變化由 `update:checkedKeys` / `check` 事件拋出。`checkStrictly` 開啟後勾選只作用於
節點本身：不級聯子代、不回溯祖先、無半選狀態。

## 懶載入

開啟 `lazy` 後，展開未載入的節點會呼叫 `load` 回呼（`resolve` 提交子節點並展開，
`reject` 或拋錯取消）；載入中箭頭顯示旋轉狀態。

```vue
<template>
  <lh-tree :data="lazyData" lazy :load="loadNodes" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhTreeNode } from '@lh-ui/share/core/tree'

const lazyData = ref<LhTreeNode[]>([{ key: 'lazy', label: '點我載入', isLeaf: false }])

function loadNodes(
  node: LhTreeNode,
  resolve: (children: LhTreeNode[]) => void,
  reject: (reason?: unknown) => void,
) {
  // 模擬非同步請求
  setTimeout(() => {
    if (node.key === 'lazy') {
      resolve([
        { key: 'lazy-1', label: '子節點一', isLeaf: true },
        { key: 'lazy-2', label: '子節點二', isLeaf: true },
      ])
    } else {
      reject(new Error('nothing to load'))
    }
  }, 600)
}
</script>
```

可載入節點須明確宣告 `isLeaf: false`（否則無 `children` 的節點會被推斷為葉子、不顯示展開箭頭）；
載入下來的子節點若仍是待載入分支，同樣宣告 `isLeaf: false`，真葉子宣告 `isLeaf: true`。
載入結果由 share 的 `mergeLoadedChildren` 不可變合併到 `props.data` 上，
不修改使用方持有的資料；子節點返回時附帶 `nodeLoad` 事件。

## 選中與受控鍵值

`multiple` 允許多選（點擊節點切換選中而非取代）；`default-selected-keys` /
`v-model:selected-keys` 受控選中；`default-expanded-keys` /
`v-model:expanded-keys` 受控展開；`disabled` 停用整棵樹（按鍵與點擊均無回應）。

```vue
<template>
  <lh-tree
    v-model:selected-keys="selKeys"
    v-model:checked-keys="chkKeys"
    :data="ctrlData"
    multiple
    :default-expanded-keys="['x']"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhTreeNode } from '@lh-ui/share/core/tree'

const selKeys = ref(['x'])
const chkKeys = ref(['x-1'])
const ctrlData: LhTreeNode[] = [
  {
    key: 'x',
    label: '設計',
    children: [{ key: 'x-1', label: '色彩' }, { key: 'x-2', label: '字體' }],
  },
  { key: 'y', label: '工程' },
]
</script>
```

## 大資料量虛擬化（uni-app 獨有）

成百上千節點時開啟 `virtual`：節點列表改由 `scroll-view` 承載並依固定行高 34px
（對齊 `--lh-tree-node-height` 預設值）開窗渲染，只繪製可視區 + 上下緩衝行；
`virtualHeight` 指定 scroll-view 高度（數字依 px，字串原樣寫入，預設 300px）。

```vue
<template>
  <lh-tree :data="bigData" virtual :virtual-height="320" />
</template>
```

要求節點內容單行不換行（share scss 的 `.lh-tree-node__label` 已有 `nowrap` + 省略符號）。
普通模式（不傳 `virtual`）下節點直接渲染在根容器，與 Vue3 版結構一致。

## 插槽

`node` 作用域插槽接收 `{ node, level, expanded, selected }` 自訂節點內容；
`empty` 插槽自訂空狀態（預設取語言包 `tree.empty`，繁體「暫無資料」）。

```vue
<template>
  <lh-tree :data="treeData">
    <template #node="{ node, level }">
      <text>{{ level > 0 ? '· ' : '' }}{{ node.label }}</text>
    </template>
  </lh-tree>
</template>
```

## API

### Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| data | 樹狀資料 | `LhTreeNode[]` | — |
| showCheckbox | 顯示勾選框 | `boolean` | `false` |
| multiple | 多選（點擊節點切換選中而非取代） | `boolean` | `false` |
| expandOnClickNode | 點擊非葉子節點時展開 / 收合 | `boolean` | `true` |
| defaultExpandedKeys | 預設展開的鍵（非受控） | `string[]` | `[]` |
| expandedKeys | 受控展開的鍵 | `string[]` | — |
| defaultSelectedKeys | 預設選中的鍵（非受控） | `string[]` | `[]` |
| selectedKeys | 受控選中的鍵 | `string[]` | — |
| defaultCheckedKeys | 預設勾選的鍵（非受控） | `string[]` | `[]` |
| checkedKeys | 受控勾選的鍵 | `string[]` | — |
| checkStrictly | 父子勾選不聯動（只作用於本身，無級聯與半選） | `boolean` | `false` |
| lazy | 懶載入模式（展開未載入節點時呼叫 load） | `boolean` | `false` |
| load | 懶載入回呼（resolve 提交子節點並展開，reject 取消） | `(node: LhTreeNode, resolve: (children: LhTreeNode[]) => void, reject: (reason?: unknown) => void) => void` | — |
| disabled | 整體停用 | `boolean` | `false` |
| virtual | 大資料量虛擬化（uni-app 獨有） | `boolean` | `false` |
| virtualHeight | 虛擬化 scroll-view 高度（數字依 px / 字串原樣） | `number \| string` | `300` |
| sx | sx 快速佈局屬性 | `LhSxProps` | — |

### Events

| 事件 | 說明 | 參數 |
| --- | --- | --- |
| update:expandedKeys | 展開鍵列表變化（配合 v-model:expanded-keys） | `(keys: string[])` |
| update:selectedKeys | 選中鍵列表變化（配合 v-model:selected-keys） | `(keys: string[])` |
| update:checkedKeys | 勾選鍵列表變化（配合 v-model:checked-keys） | `(keys: string[])` |
| select | 節點被點擊選中 / 切換選中後觸發 | `(key: string, node: LhTreeNode)` |
| check | 勾選變化後觸發 | `(keys: string[], node: LhTreeNode)` |
| expand | 節點展開 / 收合後觸發 | `(key: string, expanded: boolean)` |
| nodeLoad | 懶載入子節點返回後觸發 | `(node: LhTreeNode, children: LhTreeNode[])` |

### Slots

| 插槽 | 說明 |
| --- | --- |
| node | 節點內容（作用域 `{ node, level, expanded, selected }`） |
| empty | 空狀態內容（預設取語言包 `tree.empty`） |

### LhTreeNode

| 欄位 | 說明 | 類型 |
| --- | --- | --- |
| key | 唯一鍵 | `string` |
| label | 顯示文字 | `string` |
| children | 子節點 | `LhTreeNode[]` |
| disabled | 停用 | `boolean` |
| isLeaf | 是否葉子（不傳依 children 推斷） | `boolean` |

### 無障礙

- `role="tree"` + `role="treeitem"`，`aria-level` / `aria-expanded` / `aria-selected` / `aria-disabled` 全量暴露
- 勾選框 `role="checkbox"` + `aria-checked`（半選為 `mixed`）

::: tip 平台差異（與 Vue3 版的差異）
- **虛擬化為本包獨有能力**：大資料量（成百上千節點）時建議開啟 `virtual`，
  節點列表由 `scroll-view` 承載並依固定行高 34px 開窗渲染（可視區 + 上下緩衝），
  `virtualHeight` 控制可視高度。要求節點內容單行不換行；普通模式下節點直接渲染在根容器。
- **鍵盤導覽僅 H5**：↑/↓ 在項目間移動（跳過停用、循環）、→ 展開或進入首個子項、← 收合或回到父級、
  Home/End 首末、Enter/Space 啟用的 APG tree 模式鍵盤導覽只在 H5 生效；
  小程式無鍵盤事件，整段由條件編譯裁剪（MP 包內無死程式碼），roving tabindex 同樣只在 H5 落值。
- **RTL 縮排差異**：層級縮排行內樣式在兩端統一使用物理 `padding-left`
  （與本包既有「MP 端固定 LTR」決策一致），H5 端如需 RTL 鏡像請在使用方覆寫。
- **箭頭圖示自繪**：展開箭頭是字元 `▸` 承載在 `view` 上（旋轉 / 載入中旋轉狀態由 CSS 變換承載），
  不依賴圖示字體。
:::
