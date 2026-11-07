# Result 結果頁

回饋流程終點的結果展示，自帶狀態圖示與配色。

## 基礎用法

```vue
<template>
  <lh-result
    status="success"
    title="提交成功"
    sub-title="工單已進入下一環節"
  />
</template>
```

四種狀態：`success` / `warning` / `error` / `info`（預設 `info`），各帶預設圖示與配色；非法狀態值兜底為 `info`。

## 自訂圖示

```vue
<template>
  <lh-result
    icon="like"
    :icon-size="48"
    title="點讚收藏"
  />
</template>
```

`icon` 傳空字串 `""` 時不渲染圖示；未傳時取狀態預設圖示。

## 插槽

```vue
<template>
  <lh-result status="success">
    <template #subTitle> 自訂副標題 </template>
    <template #extra>
      <lh-button type="primary" size="small">返回首頁</lh-button>
    </template>
  </lh-result>
</template>
```

`title` / `subTitle` / `extra` 三個插槽均會覆蓋同名 prop。

## Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| status | 結果狀態 | `'success' \| 'warning' \| 'info' \| 'error'` | `'info'` |
| icon | 自訂圖示名（覆蓋狀態預設圖示；空字串不渲染） | `string` | — |
| iconSize | 圖示尺寸 | `string \| number` | `64` |
| title | 標題 | `string` | — |
| subTitle | 副標題 | `string` | — |
| customClass | 自訂類別名 | `string` | — |
| sx | 快速版面配置屬性 | `LhSxProps` | — |

## Slots

| 插槽 | 說明 |
| --- | --- |
| title | 標題（覆蓋 title prop） |
| subTitle | 副標題（覆蓋 subTitle prop） |
| extra | 底部操作區 |
