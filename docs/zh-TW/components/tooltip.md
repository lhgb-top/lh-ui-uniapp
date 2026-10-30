# Tooltip 文字提示

## 基礎用法

```vue
<template>
  <lh-tooltip content="这是提示文案">
    <lh-button>点击查看提示</lh-button>
  </lh-tooltip>
</template>
```

::: warning 小程序沒有 hover 語義
`trigger` 預設是 `click`（全端可用）。`hover` 僅 H5 有效——
小程序端請用 `trigger="click"`，透過點選 / 觸碰觸發與關閉。
:::

## 位置與寬度

```vue
<template>
  <lh-tooltip content="底部提示" placement="bottom">
    <lh-button>bottom</lh-button>
  </lh-tooltip>

  <lh-tooltip content="长文案会自动换行" :max-width="200" placement="top">
    <lh-button>限制宽度</lh-button>
  </lh-tooltip>
</template>
```

## Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| content | 提示文案 | `string` | — |
| placement | 彈層位置（12 種方位） | `LhTooltipPlacementCore` | `'top'` |
| trigger | 觸發方式：`click`（全端）/ `hover`（僅 H5） | `'click' \| 'hover'` | `'click'` |
| showDelay | 顯示延遲（毫秒） | `number` | — |
| hideDelay | 隱藏延遲（毫秒） | `number` | — |
| maxWidth | 最大寬度（內容自動換行） | `string \| number` | — |
| disabled | 停用 | `boolean` | `false` |
| customClass | 自訂類別名 | `string` | — |
| themeVars | 元件級主題變數 | `Record<string, string>` | — |
| sx | 快速版面配置屬性 | `LhSxProps` | — |

## Events

| 事件 | 說明 | 回呼參數 |
| --- | --- | --- |
| update:modelValue | 顯隱變化（受控用法） | `(visible: boolean)` |
| show | 顯示 | — |
| hide | 隱藏 | — |

::: tip 與 Vue3 版的差異
- 彈層走 `root-portal` + 兩幀非同步度量定位（先透明渲染量尺寸 → 定位 → 顯示，防閃爍）。
- MP 端 `showDelay` / `hideDelay` 僅 click 模式下保留立即行為。
- 定位計算是非同步的（`getLhRect` 傳回 Promise），不能假設同步拿到結果。
:::
