# Space 間距

用於版面配置相鄰元素的間距，替代手寫 margin。間距完全依賴 CSS `gap`，兩端均原生支援。

## 基礎用法

```vue
<template>
  <lh-space>
    <lh-tag>水墨</lh-tag>
    <lh-tag>留白</lh-tag>
    <lh-tag>国风</lh-tag>
  </lh-space>
</template>
```

## 方向

```vue
<template>
  <lh-space direction="vertical">
    <lh-tag>水墨</lh-tag>
    <lh-tag>留白</lh-tag>
  </lh-space>
</template>
```

## 間距檔位

預設檔位引用 spacing token（可透過 `--lh-spacing-*` 自訂）；數字視為 px；陣列分別控制水平與垂直間距。

```vue
<template>
  <lh-space size="small">
    <lh-tag>小</lh-tag>
    <lh-tag>小</lh-tag>
  </lh-space>
  <lh-space size="medium">
    <lh-tag>中</lh-tag>
    <lh-tag>中</lh-tag>
  </lh-space>
  <lh-space size="large">
    <lh-tag>大</lh-tag>
    <lh-tag>大</lh-tag>
  </lh-space>
  <lh-space :size="24">
    <lh-tag>24px</lh-tag>
    <lh-tag>24px</lh-tag>
  </lh-space>
  <lh-space :size="[8, 16]">
    <lh-tag>水平 8</lh-tag>
    <lh-tag>垂直 16</lh-tag>
  </lh-space>
</template>
```

## 對齊與換行

```vue
<template>
  <lh-space alignment="center">
    <lh-tag>置中</lh-tag>
    <lh-button type="primary" size="small">按钮</lh-button>
  </lh-space>
  <lh-space :wrap="true">
    <lh-tag v-for="i in 20" :key="i">标签{{ i }}</lh-tag>
  </lh-space>
</template>
```

::: tip 換行僅在水平方向生效
`wrap` 只對 `direction="horizontal"` 有意義，垂直方向傳入會被忽略。
:::

## Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| direction | 排列方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| size | 間距：預設檔位 / 像素數字 / [水平, 垂直] | `'small' \| 'medium' \| 'large' \| number \| [number, number]` | `'medium'` |
| wrap | 是否允許換行（僅水平方向） | `boolean` | `true` |
| alignment | 對齊方式 | `'start' \| 'center' \| 'end' \| 'baseline'` | `'start'` |
| customClass | 自訂類別名 | `string` | — |
| sx | 快速版面配置屬性 | `LhSxProps` | — |

## Slots

| 插槽 | 說明 |
| --- | --- |
| default | 需要排布間距的子元素 |
