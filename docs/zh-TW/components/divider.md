# Divider 分隔線

區分不同內容的分隔線，支援帶文案的分組語義。

## 基礎用法

```vue
<template>
  <view>上文</view>
  <lh-divider />
  <view>下文</view>
</template>
```

## 帶文案

```vue
<template>
  <lh-divider>水墨</lh-divider>
  <lh-divider label-position="left">左对齐</lh-divider>
  <lh-divider label-position="right">右对齐</lh-divider>
</template>
```

## 虛線與邊框樣式

```vue
<template>
  <lh-divider dashed />
  <lh-divider border-style="dotted" />
</template>
```

`borderStyle` 優先於 `dashed`；僅 `dashed` / `dotted` 有對應樣式，其餘值按預設實線渲染。

## 垂直方向

```vue
<template>
  <lh-space>
    <span>水墨</span>
    <lh-divider direction="vertical" />
    <span>留白</span>
  </lh-space>
</template>
```

::: tip 垂直方向的高度
垂直分隔線是 `inline-block`，在 flex 行內靠 `align-self: stretch` 撐滿父級高度；單獨放在區塊級
容器裡只有 `1em` 高，放在 flex 行裡使用才符合直覺。
:::

## 垂直帶文案

垂直方向同樣支援文案：線段排在文案上下，角色升級為 `role="separator"` 並宣告
`aria-orientation="vertical"`。

```vue
<template>
  <view class="vertical-text-row">
    <text>上</text>
    <lh-divider direction="vertical">水墨</lh-divider>
    <text>下</text>
  </view>
</template>

<style>
.vertical-text-row {
  display: flex;
  align-items: center;
  height: 120px;
}
</style>
```

::: tip 垂直文案的高度來自父級行
垂直帶文案的分隔線靠父級行的 `align-self: stretch` 獲得高度，線段才能撐開——父容器需要是
有確定高度的 flex 行（如上例的 `height: 120px`）。區塊級父容器裡線段只剩 12px 的最小長度。
:::

::: tip labelPosition 在垂直方向不生效
`label-position` 是水平方向的左右對齊語義；垂直方向的文案恆置中，不產出修飾類別。
:::

## Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| direction | 方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| dashed | 是否虛線 | `boolean` | `false` |
| labelPosition | 帶文案時的對齊位置（水平方向生效，垂直恆置中） | `'left' \| 'center' \| 'right'` | `'center'` |
| borderStyle | 邊框樣式（優先於 dashed） | `string` | — |
| customClass | 自訂類別名 | `string` | — |
| sx | 快速版面配置屬性 | `LhSxProps` | — |

## Slots

| 插槽 | 說明 |
| --- | --- |
| default | 分隔線文案（水平方向排在左右，垂直方向排在上下） |
