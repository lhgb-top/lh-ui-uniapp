# Anchor 锚点导航

锚点导航：点击跳转到对应区块，滚动时联动高亮当前区块。扁平化
（`flattenAnchorItems`）与活动锚点判定（`resolveActiveAnchor`）来自
`@lh-ui/share` 的 core 纯函数。

## 平台差异（重要）

- **H5**：组件自行监听 `window`（或 `target` 容器）滚动，锚点定位走
  原生 `scrollIntoView`。
- **微信小程序**：滚动联动需把 `scroll-view` 的 `detail.scrollTop`
  通过 `scrollTop` prop 注入；点击锚点时组件抛出
  `update:scrollIntoView`（目标区块 id），绑定到 `scroll-view` 的
  `scroll-into-view` 属性完成定位。未传 `target` 时是页面级定位，
  组件直接调 `uni.pageScrollTo({ selector })`。

```vue
<template>
  <scroll-view
    class="my-scroll"
    :scroll-y="true"
    :scroll-into-view="anchorTarget"
    @scroll="onScroll"
  >
    <view id="section-a" class="my-section">区块 A</view>
    <view id="section-b" class="my-section">区块 B</view>
    <lh-anchor
      :items="items"
      :scroll-top="scrollTop"
      @update:scroll-into-view="anchorTarget = $event"
    />
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const items = [
  { id: 'section-a', title: '区块 A' },
  { id: 'section-b', title: '区块 B' },
]
const scrollTop = ref(0)
const anchorTarget = ref('')
function onScroll(event: { detail?: { scrollTop?: number } }) {
  scrollTop.value = event.detail?.scrollTop ?? 0
}
</script>
```

## 基础用法

```vue
<template>
  <lh-anchor :items="items" />
</template>

<script setup lang="ts">
const items = [
  { id: 'section-a', title: '区块 A' },
  {
    id: 'group-b',
    title: 'B 组',
    children: [
      { id: 'section-b', title: '区块 B' },
      { id: 'section-c', title: '区块 C' },
    ],
  },
]
</script>
```

`items` 支持子级（`children`），渲染时按深度优先扁平化并自动加缩进。
活动锚点判定规则：最后一个「区块顶边滚动越过 `offset` 阈值线」的
锚点为活动项。

## 横向排列

```vue
<template>
  <lh-anchor :items="items" direction="horizontal" />
</template>
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 锚点数据（支持 children 子级） | `LhAnchorItem[]` | `[]` |
| target | H5 滚动容器选择器（默认 window） | `string` | `-` |
| scrollTop | 滚动位置注入（MP：scroll-view 的 `detail.scrollTop`） | `number` | `-` |
| offset | 活动判定的阈值（区块顶边距容器顶部的距离） | `number` | `0` |
| direction | 排列方向 | `'vertical' \| 'horizontal'` | `'vertical'` |
| smooth | 平滑滚动 | `boolean` | `true` |
| sx | 快速布局属性 | `LhSxProps` | `-` |

### Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 活动锚点变化时触发 | `(id: string)` |
| click | 点击锚点项时触发（先于滚动定位） | `(id: string)` |
| update:scrollIntoView | MP 定位契约：目标区块 id，绑定到 scroll-into-view | `(id: string)` |
