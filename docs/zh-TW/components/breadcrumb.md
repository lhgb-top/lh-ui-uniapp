# Breadcrumb 麵包屑

顯示當前頁面的路徑，快速返回之前的任意頁面。

## 基礎用法

```vue
<template>
  <lh-breadcrumb separator="/">
    <lh-breadcrumb-item>首頁</lh-breadcrumb-item>
    <lh-breadcrumb-item>元件</lh-breadcrumb-item>
    <lh-breadcrumb-item>麵包屑</lh-breadcrumb-item>
  </lh-breadcrumb>
</template>
```

## 可點擊的跳轉項

非末項傳 `to` 後渲染為連結樣式，點擊調用 `uni.navigateTo` 跳轉（url 需為以 `/` 開頭的頁面路徑）。

```vue
<template>
  <lh-breadcrumb>
    <lh-breadcrumb-item to="/pages/index/index">首頁</lh-breadcrumb-item>
    <lh-breadcrumb-item to="/pages/component/index">元件</lh-breadcrumb-item>
    <lh-breadcrumb-item>麵包屑</lh-breadcrumb-item>
  </lh-breadcrumb>
</template>
```

## 摺疊

`maxItems` 控制最大可見項數（含省略號）：超出時保留首項 + 省略號 + 末尾若干項，點擊省略號展開全部。

```vue
<template>
  <lh-breadcrumb :max-items="3">
    <lh-breadcrumb-item>首頁</lh-breadcrumb-item>
    <lh-breadcrumb-item>活動</lh-breadcrumb-item>
    <lh-breadcrumb-item>列表</lh-breadcrumb-item>
    <lh-breadcrumb-item>詳情</lh-breadcrumb-item>
    <lh-breadcrumb-item>評價</lh-breadcrumb-item>
  </lh-breadcrumb>
</template>
```

## Breadcrumb Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| separator | 分隔符字元 | `string` | `'/'` |
| maxItems | 最大可見項數（首項 + 省略號 + 末尾若干項），超出摺疊；`0` 表示不摺疊 | `number` | `0` |
| customClass | 自訂類名 | `string` | — |
| sx | 快速佈局屬性 | `LhSxProps` | — |

## BreadcrumbItem Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| to | 跳轉地址；存在且非末項時渲染為連結樣式，點擊走 `uni.navigateTo` | `string` | — |
| customClass | 自訂類名 | `string` | — |

## Slots

| 插槽 | 說明 |
| --- | --- |
| default | 麵包屑項的文字內容 |

::: tip 與 Vue3 版的差異
- `to` 不走路由（uni-app 工程≠vue-router）：統一 `uni.navigateTo`；H5 端按 uni 的 H5 路由策略跳轉。
- `<nav>/<ol>/<li>` 換成 `<view>`（WXSS 標籤選擇器禁用），無障礙 `aria-current="page"`、`aria-label` 保留。
- 摺疊/省略號邏輯複用同一套 share core 純函式，與 plus 行為一致。
:::
