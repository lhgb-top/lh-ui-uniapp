# Result 结果页

反馈流程终点的结果展示，自带状态图标与配色。

## 基础用法

```vue
<template>
  <lh-result
    status="success"
    title="提交成功"
    sub-title="工单已进入下一环节"
  />
</template>
```

四种状态：`success` / `warning` / `error` / `info`（默认 `info`），各带默认图标与配色；非法状态值兜底为 `info`。

## 自定义图标

```vue
<template>
  <lh-result
    icon="like"
    :icon-size="48"
    title="点赞收藏"
  />
</template>
```

`icon` 传空串 `""` 时不渲染图标；未传时取状态默认图标。

## 插槽

```vue
<template>
  <lh-result status="success">
    <template #subTitle> 自定义副标题 </template>
    <template #extra>
      <lh-button type="primary" size="small">返回首页</lh-button>
    </template>
  </lh-result>
</template>
```

`title` / `subTitle` / `extra` 三个插槽均会覆盖同名 prop。

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| status | 结果状态 | `'success' \| 'warning' \| 'info' \| 'error'` | `'info'` |
| icon | 自定义图标名（覆盖状态默认图标；空串不渲染） | `string` | — |
| iconSize | 图标尺寸 | `string \| number` | `64` |
| title | 标题 | `string` | — |
| subTitle | 副标题 | `string` | — |
| customClass | 自定义类名 | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## Slots

| 插槽 | 说明 |
| --- | --- |
| title | 标题（覆盖 title prop） |
| subTitle | 副标题（覆盖 subTitle prop） |
| extra | 底部操作区 |
