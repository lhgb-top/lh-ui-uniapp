# Affix 固定

将内容固定在视口顶部或底部。固定判定（`isAffixFixed`）与固定样式
（`getAffixFixedStyle`）来自 `@lh-ui/share` 的 core 纯函数，组件层
只负责滚动订阅、占位度量与响应式胶水。

## 平台差异（重要）

H5 与微信小程序的滚动语义不同，本组件采用双端方案：

- **H5**：组件自行监听 `window`（或 `target` 选择器指向的容器）的
  `scroll` 事件，用占位节点的 `getBoundingClientRect` 判定固定态。
- **微信小程序**：`scroll` 事件只能绑在 `scroll-view` 标签上，组件
  无法自行订阅。需将组件置于 `scroll-view` 内，把滚动事件
  `detail.scrollTop` 通过 `scrollTop` prop 注入：

```vue
<template>
  <scroll-view
    class="my-scroll"
    :scroll-y="true"
    :scroll-top="scrollTop"
    @scroll="onScroll"
  >
    <lh-affix :scroll-top="scrollTop" :offset-top="20">
      <view class="my-bar">吸顶栏</view>
    </lh-affix>
    <!-- 长内容 -->
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

H5 端若不传 `scrollTop`，组件会自动监听 `window`；传了 `target`
选择器时监听对应容器。

## 基础用法

```vue
<template>
  <lh-affix :offset-top="20">
    <lh-button type="primary">吸顶按钮</lh-button>
  </lh-affix>
</template>
```

内容滚动越过 `offset-top` 后固定在视口顶部；固定后占位元素以原高度
撑住文档位置，后文内容不跳变。

## 吸底模式

```vue
<template>
  <lh-affix :offset-bottom="24">
    <view class="my-bar">吸底栏</view>
  </lh-affix>
</template>
```

`offset-bottom` 优先于 `offset-top`：占位底边越过「视口高 - offset-bottom」
时固定到底部。

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| offset-top | 距视口顶部多少像素触发吸顶 | `number` | `0` |
| offset-bottom | 距视口底部多少像素触发吸底（优先于 offset-top） | `number` | `0` |
| target | H5 滚动容器选择器（默认视口；MP 端不生效） | `string` | `-` |
| scrollTop | 滚动位置注入（MP：scroll-view 的 `detail.scrollTop`） | `number` | `-` |
| sx | 快速布局属性（间距 / 尺寸 / flex） | `LhSxProps` | `-` |

### Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 固定态变化时触发 | `(fixed: boolean)` |

### 插槽

| 插槽 | 说明 |
| --- | --- |
| default | 需要固定的内容 |
