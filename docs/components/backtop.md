# BackTop 返回顶部

滚动超过阈值后出现的返回顶部按钮。可见性判定（`isBackTopVisible`）
与滚动命令（`backToTop`）来自 `@lh-ui/share` 的 core 纯函数。

## 平台差异（重要）

- **H5**：组件自行监听 `window`（或 `target` 容器）的 `scroll` 事件；
  点击回顶直接滚动目标容器。
- **微信小程序**：需把 `scroll-view` 的滚动事件 `detail.scrollTop`
  通过 `scrollTop` prop 注入驱动显隐；点击回顶时组件抛出
  `update:scrollTop`（值为 0），绑定到 `scroll-view` 的 `scroll-top`
  属性即可回顶。未传 `target` 时是页面级滚动，组件直接调
  `uni.pageScrollTo`。

```vue
<template>
  <scroll-view
    class="my-scroll"
    :scroll-y="true"
    :scroll-top="scrollTop"
    @scroll="onScroll"
  >
    <!-- 长内容 -->
    <lh-backtop :scroll-top="scrollTop" @update:scroll-top="scrollTop = $event" />
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const scrollTop = ref(0)
function onScroll(event: { detail?: { scrollTop?: number } }) {
  scrollTop.value = event.detail?.scrollTop ?? 0
}
</script>
```

## 基础用法

```vue
<template>
  <lh-backtop :visibility-height="200" />
</template>
```

页面或容器滚动超过 `visibility-height`（默认 200px）后按钮以淡入过渡
出现；点击平滑回顶。

## 自定义内容与位置

```vue
<template>
  <lh-backtop :right="24" :bottom="80">
    <view class="my-backtop">顶部</view>
  </lh-backtop>
</template>
```

默认渲染一个圆形按钮（内置 `arrow-up` 图标）；`right` / `bottom`
控制距视口右下角的偏移；默认插槽自定义按钮内容。

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| target | H5 滚动容器选择器（默认视口；MP 端仅用于区分页面级 / scroll-view 级回顶） | `string` | `-` |
| scrollTop | 滚动位置注入（MP：scroll-view 的 `detail.scrollTop`） | `number` | `-` |
| visibility-height | 滚动多少像素后出现 | `number` | `200` |
| right | 距右侧偏移（px） | `number` | `40` |
| bottom | 距底部偏移（px） | `number` | `40` |
| smooth | 平滑滚动 | `boolean` | `true` |
| sx | 快速布局属性 | `LhSxProps` | `-` |

### Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击按钮时触发（先于滚动命令） | `(event: Event)` |
| scrollend | 滚动停止后触发（防抖 150ms） | `(scrollTop: number)` |
| update:scrollTop | MP 回顶契约：值为 0，绑定到 scroll-view 的 scroll-top | `(scrollTop: number)` |

### 插槽

| 插槽 | 说明 |
| --- | --- |
| default | 按钮内容（默认 arrow-up 图标） |
