# Layout 版面容器

頁面級骨架：`lh-layout` 搭配 `lh-header` / `lh-aside` / `lh-main` / `lh-footer` 四個子元件（easycom 可直接寫標籤；按需引入時元件名為 `LhLayout` / `LhHeader` / `LhAside` / `LhMain` / `LhFooter`）。

## 基礎用法（上中下）

容器需要顯式高度：`lh-layout` 自身是 `flex: 1` 的伸縮容器，放在普通流式父級裡需要透過 `sx` 或外層樣式給定高度，子項才能依 header / main / footer 比例鋪開。

```vue
<template>
  <lh-layout direction="vertical" :sx="{ h: '240px' }">
    <lh-header>頁首</lh-header>
    <lh-main>內容區</lh-main>
    <lh-footer>頁尾</lh-footer>
  </lh-layout>
</template>
```

## 排列方向

`direction` 顯式控制子項排列方向：預設 `horizontal`（並排），含 `lh-aside` 時自動切換為 `vertical`，也可手動指定。

```vue
<template>
  <lh-layout direction="horizontal" :sx="{ h: '80px' }">
    <lh-main>水平並排</lh-main>
    <lh-main>水平並排</lh-main>
  </lh-layout>
  <lh-layout direction="vertical" :sx="{ h: '140px', mt: '12px' }">
    <lh-main>垂直堆疊</lh-main>
    <lh-main>垂直堆疊</lh-main>
  </lh-layout>
</template>
```

## 帶側欄版面

含 `lh-aside` 時父級自動切換為垂直方向（header 在上、aside 與 main 並排）。

```vue
<template>
  <lh-layout direction="vertical" :sx="{ h: '240px' }">
    <lh-header>頁首</lh-header>
    <lh-layout :sx="{ flex: '1', minHeight: '0px' }">
      <lh-aside :width="140" aria-label="側邊導覽">側欄</lh-aside>
      <lh-main>內容區</lh-main>
    </lh-layout>
    <lh-footer>頁尾</lh-footer>
  </lh-layout>
</template>
```

`width` 支援 `number`（依 px）與附單位的 `string`（如 `'30%'`）；不傳時取 `--lh-layout-aside-width`（預設 220px）。

## Layout Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| direction | 排列方向（含 Aside 時自動為 vertical） | `'horizontal' \| 'vertical'` | `'horizontal'` |
| customClass | 自訂類名（透傳到根節點） | `string` | — |
| sx | sx 快速版面屬性 | `LhSxProps` | — |

## Header / Main / Footer Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| customClass | 自訂類名（透傳到根節點） | `string` | — |
| sx | sx 快速版面屬性 | `LhSxProps` | — |

## Aside Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| width | 側欄寬度 | `number \| string` | — |
| ariaLabel | 無障礙名稱（landmark 命名） | `string` | — |
| customClass | 自訂類名（透傳到根節點） | `string` | — |
| sx | sx 快速版面屬性 | `LhSxProps` | — |

## Slots

| 插槽 | 說明 |
| --- | --- |
| default | 版面內容（五個元件均為預設插槽） |

## 平台差異

- **純 CSS 版面元件**：share core 無 layout 模組，邏輯層只有 provide/inject 上下文（Aside 登記後父級切換為垂直方向），無度量、無彈層、無 document 依賴，H5 與微信小程式表現一致。
- **標籤替換**：plus 的 `<section>` / `<header>` / `<aside>` / `<main>` / `<footer>` 全部換成 `<view>`（WXSS 禁標籤選擇器，樣式靠 `lh-layout*` 類名生效）。
- **landmark 語意**：語意標籤天然對應的 landmark role 改由 `role` 屬性補回——header 為 `banner`、aside 為 `complementary`、main 為 `main`、footer 為 `contentinfo`；多個 `aside` 時建議用 `ariaLabel` 區分（如「側邊導覽」「相關連結」）。
- **捲動容器**：`lh-main` 與 `lh-aside` 的 `overflow: auto` 在 H5 端即元素自身捲動；**小程式頁面本身沒有可捲動的 body 容器**（頁面捲動由 `page` 根節點承擔），若在小程式裡把整頁內容直接放進 `lh-main`，元素內捲動與頁面捲動可能疊加出現雙捲軸。帶側欄的整頁版面建議外層給定 `h: '100vh'` 讓 `lh-main` 自己捲動；或視需要改用 `scroll-view` 包裹內容。
- **移植結論**：全端可用，行為與 plus 一致；唯一需留意的是小程式端「頁面級捲動 vs 元素級捲動」的容器語意。

::: tip 與 Vue3 版的差異
- 語意標籤換成 `view` + `role` 屬性（WXSS 標籤選擇器禁用），無障礙語意保留。
- 子元件標籤依 easycom 約定為 `lh-header` / `lh-aside` / `lh-main` / `lh-footer`（按需引入對應元件名 `LhHeader` 等）。
- 增加了 `customClass` prop：uni-app 端自訂類名無法穿透 `styleIsolation`，統一走 prop 透傳（plus 端靠 class 直傳）。
- 排列方向、Aside 自動垂直的 provide/inject 機制與 plus 完全一致。
:::
