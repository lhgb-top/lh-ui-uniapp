# Grid 柵格

24 列柵格佈局：`lh-row` 搭配 `lh-col`（easycom 可直接寫標籤；按需引入時元件名為 `LhRow` / `LhCol`）。底層是 CSS Grid，`span` / `offset` / `push` / `pull` 直接映射到 `grid-column` 定位，類別與定位演算法全部由 `@lh-ui/share` core 純函式產出。

## 基礎佈局

```vue
<template>
  <lh-row>
    <lh-col :span="12"><view class="cell">12</view></lh-col>
    <lh-col :span="12"><view class="cell">12</view></lh-col>
  </lh-row>
</template>
```

## 列間距 gutter

`gutter` 支援 `number`（僅橫向）或 `[橫向, 縱向]` 陣列；Row 以負外邊距抵消列內邊距。

```vue
<template>
  <lh-row :gutter="16">
    <lh-col :span="8"><view class="cell">8</view></lh-col>
    <lh-col :span="8"><view class="cell">8</view></lh-col>
    <lh-col :span="8"><view class="cell">8</view></lh-col>
  </lh-row>
  <lh-row :gutter="[16, 24]">
    <lh-col :span="12"><view class="cell">12</view></lh-col>
    <lh-col :span="12"><view class="cell">12</view></lh-col>
  </lh-row>
</template>
```

## 主軸排列 justify / 交叉軸對齊 align

`justify` 的 `center` 與 `align` 的 `middle` 各自映射到獨立修飾類（兩軸不撞類）；`align='center'` 是 `middle` 的相容別名。

```vue
<template>
  <lh-row justify="center" align="middle">
    <lh-col :span="6"><view class="cell">6</view></lh-col>
    <lh-col :span="6"><view class="cell">6</view></lh-col>
  </lh-row>
</template>
```

## 偏移與平移

- `offset`：左側偏移 N 列（顯式起點 `offset + 1`）
- `push` / `pull`：在 offset 基礎上右移 / 左移起點

```vue
<template>
  <lh-row>
    <lh-col :span="6" :offset="6"><view class="cell">6 / offset 6</view></lh-col>
    <lh-col :span="9" :push="6"><view class="cell">9 / push 6</view></lh-col>
  </lh-row>
</template>
```

## 響應式斷點

`xs` / `sm` / `md` / `lg` / `xl` 分別在 `<640 / ≥640 / ≥768 / ≥1024 / ≥1280px` 生效，未宣告時向下回退到最近的已定義檔（`xs` 恆兜底）。也可用 `sizes` 批次宣告。

```vue
<template>
  <lh-row>
    <lh-col :xs="24" :sm="12" :md="8" :lg="6">
      <view class="cell">xs=24 sm=12 md=8 lg=6</view>
    </lh-col>
  </lh-row>
</template>
```

## Row Props

| 屬性 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| gutter | 列間距（px，或 `[橫向, 縱向]`） | `number \| [number, number]` | `0` |
| justify | 主軸排列 | `'start' \| 'center' \| 'end' \| 'space-between' \| 'space-around'` | `'start'` |
| align | 交叉軸對齊 | `'top' \| 'middle' \| 'bottom'` | `'top'` |
| wrap | 是否換行 | `boolean` | `true` |
| customClass | 自訂類別（透傳到根節點） | `string` | — |
| sx | sx 快速佈局屬性 | `LhSxProps` | — |

## Col Props

| 屬性 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| span | 佔據列數（24 柵格制） | `number` | — |
| offset | 左側偏移列數 | `number` | — |
| push | 向右平移列數 | `number` | — |
| pull | 向左平移列數 | `number` | — |
| xs / sm / md / lg / xl | 各斷點下的尺寸（`number` 或 `{ span, offset }`） | `LhColSize` | — |
| sizes | 依斷點批次宣告（與 xs~xl 等價，擇一使用） | `LhBreakpointSizes` | — |
| customClass | 自訂類別（透傳到根節點） | `string` | — |
| sx | sx 快速佈局屬性 | `LhSxProps` | — |

## Slots

| 插槽 | 說明 |
| --- | --- |
| default | 柵格內容（Row 與 Col 均為預設插槽） |

## 平台差異

- **純佈局元件**：無彈層、無度量、無 document 依賴，H5 與微信小程式表現一致。
- **斷點來源**：H5 走 `matchMedia` 監聽視埠變化；**小程式無 matchMedia**，固定降級為 `xs` 檔（規則與回退演算法仍由 share core 的 `resolveResponsiveSize` 決定，僅當前斷點恆為 `xs`）。若小程式端需要依螢幕寬度分檔，可自行把 `uni.getSystemInfoSync().windowWidth` 接入 `useLhBreakpoint` 提供的注入介面，或為小程式固定一套佈局。
- **標籤替換**：plus 的 `<div>` 換成 `<view>`（WXSS 禁標籤選擇器，樣式靠 `lh-row*` / `lh-col*` 類別生效）。
- **`grid-column` 定位**：純 span 走 auto-placement（`span N`），帶 offset / push / pull 時顯式定位起點並鉗制在 24 列座標系內，防止越界組合撐破容器。

::: tip 與 Vue3 版的差異
- 元件結構、props 口徑、類別與定位演算法與 plus 完全一致（同一 share core）。
- 子元件標籤按 easycom 約定為 `lh-row` / `lh-col`（按需引入對應元件名 `LhRow` / `LhCol`）。
- 增加了 `customClass` prop：uni-app 端自訂類別無法穿透 `styleIsolation`，統一走 prop 透傳（plus 端靠 class 直傳）。
:::
