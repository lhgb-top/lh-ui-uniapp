# Descriptions 描述列表

用于展示对象的属性列表，支持列数、跨列与边框模式。条目数据由 `items` 传入（`LhDescriptionsItem` 为 `@lh-ui/share` core 提供的条目类型），内容可用作用域插槽覆盖。

## 基础用法

```vue
<template>
  <lh-descriptions
    title="藏品档案"
    :column="2"
    :items="[
      { label: '名称', value: '青花缠枝莲纹瓶' },
      { label: '年代', value: '明永乐' },
      { label: '类别', value: '瓷器' },
      { label: '级别', value: '一级文物' },
    ]"
  />
</template>
```

## 列数与跨列

`column` 控制每行列数，条目的 `span` 控制跨列。`span` 超出本行剩余宽度时自动钳制，最后一行不足时会自动补位（补位单元格标记为 `aria-hidden`，纯装饰）。

```vue
<template>
  <lh-descriptions
    :column="3"
    :items="[
      { label: '名称', value: '千里江山图', span: 2 },
      { label: '年代', value: '北宋' },
      { label: '作者', value: '王希孟' },
      { label: '材质', value: '绢本设色' },
      { label: '藏地', value: '北京故宫博物院' },
    ]"
  />
</template>
```

## 边框模式

`border` 开启表格边框（带边框模式下行间距归零、由单元格边线拼接成表格）。

```vue
<template>
  <lh-descriptions
    :column="2"
    border
    :items="[
      { label: '名称', value: '兰亭序' },
      { label: '作者', value: '王羲之' },
      { label: '年代', value: '东晋' },
      { label: '书体', value: '行书' },
    ]"
  />
</template>
```

## 自定义标题与内容

`title` 插槽覆盖标题区；`item-<index>` 作用域插槽覆盖对应条目的内容（`index` 为条目在所在行内的单元格序号，作用域提供 `{ item }`）。

```vue
<template>
  <lh-descriptions :column="2" :items="items">
    <template #title>
      <text>藏品档案（插槽标题）</text>
    </template>
    <template #item-1="{ item }">
      <lh-tag type="success">{{ item.value }}</lh-tag>
    </template>
  </lh-descriptions>
</template>

<script setup lang="ts">
const items = [
  { label: '状态', value: '进行中' },
  { label: '进度', value: '已鉴定' },
]
</script>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 描述列表标题 | `string` | — |
| column | 每行展示的条目列数 | `number` | `3` |
| border | 是否展示边框 | `boolean` | `false` |
| items | 条目列表；label / value / span 三元组 | `[LhDescriptionsItem](#lhdescriptionsitem-类型)`[] | `() => []` |
| customClass | 自定义类名 | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## LhDescriptionsItem（类型）

来自 `@lh-ui/share` core（`LhDescriptionsItem`），本仓不重复定义。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 条目标签 | `string` | — |
| value | 条目内容（也可用作用域插槽传入） | `string \| number` | — |
| span | 占据的列数，超出会钳制 | `number` | `1` |

## Slots

| 插槽 | 说明 | 作用域 |
| --- | --- | --- |
| title | 自定义标题 | — |
| item-\<index\> | 覆盖条目的内容（index 为所在行内的单元格序号） | `{ item }` |

## 平台差异

- 纯展示组件，不触及任何平台 API，H5 与微信小程序表现完全一致；`items` / `column` / `border` / `span` 行为与 Vue3 版对齐。
- Vue3 版用 `<dl>/<dt>/<dd>` 语义标签，本仓换成 `<view>`（WXSS 标签选择器禁用，靠类名生效）；行布局由内联 `flex` + 百分比 `flex-basis` 承载，宽度计算与 Vue3 版同一套公式。
- border 模式的表格线由 `@lh-ui/share` 的 styles 源提供，经 `build-styles` 净化后在小程序端可用（净化产物只含类选择器与属性，符合 WXSS 白名单）。
- 行结构聚合（span 归一化、钳制、换行、补位）全部由 `@lh-ui/share` 的 `buildDescriptionRows` 纯函数产出，本仓只写响应式胶水，不复制 core 实现。
