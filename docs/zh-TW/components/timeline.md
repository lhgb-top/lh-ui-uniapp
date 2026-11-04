# Timeline 時間線

縱向事件流。時間順序即文件順序，支援時間戳、語意類型、空心節點與左右交替版面。

> 純展示元件：無事件、無受控狀態，H5 與微信小程式兩端表現完全一致（見文末「平台差異」）。

## 基礎用法

`timestamp` 設定時間戳文字；`type` 為節點圓點附加語意顏色（`'primary'` / `'success'` / `'warning'` / `'danger'`）。

```vue
<template>
  <lh-timeline>
    <lh-timeline-item timestamp="2026-09-01">
      立項評審
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="2026-09-15"
      type="success"
    >
      一期交付
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="2026-09-25"
      type="warning"
    >
      驗收進行中
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## 左右交替

`mode="alternate"` 讓時間線以容器中軸為界，條目依序號左右交替（偶數序號在左，奇數序號在右）。

```vue
<template>
  <lh-timeline mode="alternate">
    <lh-timeline-item timestamp="Q1">
      規劃
    </lh-timeline-item>
    <lh-timeline-item timestamp="Q2">
      開發
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="Q3"
      type="danger"
    >
      壓測
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="Q4"
      type="success"
    >
      上線
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## 空心節點

`hollow` 讓節點顯示為空心圓點，常用於未完成的狀態。

```vue
<template>
  <lh-timeline>
    <lh-timeline-item
      timestamp="Q1"
      hollow
    >
      未開始
    </lh-timeline-item>
    <lh-timeline-item timestamp="Q2">
      進行中
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="Q3"
      type="success"
    >
      已完成
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## 自訂時間戳與圓點

`timestamp` 與 `dot` 皆為插槽：不傳 `timestamp` prop 而改用 `#timestamp` 插槽可放置任意內容；`#dot` 插槽替換預設圓點（可放圖示等）。

```vue
<template>
  <lh-timeline>
    <lh-timeline-item type="primary">
      <template #timestamp>
        2026 年 9 月
      </template>
      自訂時間戳內容
    </lh-timeline-item>
    <lh-timeline-item type="success">
      <template #dot>
        <lh-icon
          name="check"
          :size="12"
        />
      </template>
      自訂圓點（lh-icon 圖示）
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## Timeline Props

| 屬性 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| mode | 版面模式：`'left'` 單側時間線 / `'alternate'` 左右交替 | `'left' \| 'alternate'` | `'left'` |
| customClass | 自訂類別名稱 | `string` | — |
| sx | 快速版面屬性 | `LhSxProps` | — |

## TimelineItem Props

| 屬性 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| timestamp | 時間戳文字（也可用 `#timestamp` 插槽） | `string` | — |
| type | 節點語意類型（圓點邊框依權杖上色） | `'primary' \| 'success' \| 'warning' \| 'danger'` | — |
| hollow | 空心節點（常用於未完成狀態） | `boolean` | `false` |
| customClass | 自訂類別名稱（透傳至條目根節點） | `string` | — |
| sx | 快速版面屬性 | `LhSxProps` | — |

## Slots

| 插槽 | 說明 |
| --- | --- |
| Timeline default | 條目節點（`lh-timeline-item`） |
| TimelineItem default | 條目正文內容 |
| TimelineItem timestamp | 時間戳內容（未傳 prop 與插槽時不渲染該行） |
| TimelineItem dot | 自訂圓點（預設圓點為純裝飾，不進入無障礙樹） |

## 平台差異

- 時間線是**純展示元件**：無事件、無受控狀態、無量測與平台 API 呼叫，H5 與微信小程式兩端完全可用且表現一致。
- `<ol>` / `<li>` 語意清單在兩端皆改由 `<view>` 乘載（WXSS 標籤選擇器禁用，靠類別名稱生效），並以 `role="list"` / `role="listitem"` 保留清單語意；小程式讀屏支援視平台能力而定。
- 連接線與中軸線全部是 CSS 偽元素（`::before`），不依賴 JS 量測；`alternate` 模式的左右交替由序號奇偶 + flex 方向實現，兩端一致。
- **WXSS 淨化**：share 樣式來源的 `.lh-timeline__item:not(.lh-timeline__item--last)` 在建構期剝離 `:not()` 修飾（WXSS 不支援 `:not()`），非末項連接線的顯隱由同塊內特異度不低於它的 `.lh-timeline__item--last::before` 規則接管，兩端渲染結果不變。
- 無障礙：節點圓點為純裝飾（`aria-hidden="true"`），自訂圓點插槽同樣不進入無障礙樹，與 Vue3 版一致。
- **移植決策（與 Vue3 版對齊，未引入未定義 API）**：本次移植時 plus 真源與 `@lh-ui/share` core 尚未提供 `placement`（時間戳位置）、`center`（置中版面）等 API，本倉同樣不提供，嚴格對齊真源；`mode` 目前僅 `'left'` / `'alternate'` 兩種。後續真源補齊後跟隨升級。
