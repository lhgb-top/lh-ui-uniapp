# Badge 徽標

圖示右上角的角標，用於通知數、狀態點或自訂文案。

## 基礎用法

```vue
<template>
  <lh-badge :value="8">
    <lh-button size="small">消息</lh-button>
  </lh-badge>
  <lh-badge :value="8" type="primary">
    <lh-button size="small">主要</lh-button>
  </lh-badge>
</template>
```

## 數值處理

```vue
<template>
  <lh-badge :value="200" :max="99">
    <lh-button size="small">超出 max 显示 99+</lh-button>
  </lh-badge>
  <lh-badge :value="0" show-zero>
    <lh-button size="small">显示 0</lh-button>
  </lh-badge>
  <lh-badge :value="0">
    <lh-button size="small">隐藏 0</lh-button>
  </lh-badge>
  <lh-badge content="新">
    <lh-button size="small">自定义文案</lh-button>
  </lh-badge>
</template>
```

## 小紅點

```vue
<template>
  <lh-badge is-dot>
    <lh-button size="small">有新消息</lh-button>
  </lh-badge>
</template>
```

## 偏移與尺寸

```vue
<template>
  <lh-badge :value="8" :offset="[6, 4]">
    <lh-button size="small">偏移</lh-button>
  </lh-badge>
  <lh-badge :value="8" size="small">
    <lh-button size="small">小号</lh-button>
  </lh-badge>
</template>
```

## Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| type | 類型 | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'default'` | `'danger'` |
| value | 顯示的數值 | `string \| number` | — |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| max | 最大值，超出顯示 `${max}+` | `number` | `99` |
| isDot | 是否為小紅點（不顯示數值） | `boolean` | `false` |
| hidden | 是否隱藏 | `boolean` | `false` |
| offset | 相對預設位置的偏移 `[x, y]`，取負 margin 實現 | `[number, number]` | — |
| showZero | value 為 0 時是否顯示 | `boolean` | `false` |
| content | 自訂文案（優先於 value） | `string` | — |
| customClass | 自訂類別名 | `string` | — |
| sx | 快速版面配置屬性 | `LhSxProps` | — |

## Slots

| 插槽 | 說明 |
| --- | --- |
| default | 徽標依附的內容 |

::: tip 與 Vue3 版的差異
進出動畫不依賴 Vue 內建 `<transition>`（小程序的過渡結束事件不可靠），改 class 切換 + 計時器對齊 0.15s 動畫時長，視覺表現與 plus 一致。
:::
