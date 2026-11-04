# Grid 栅格

24 列栅格布局：`lh-row` 搭配 `lh-col`（easycom 可直接写标签；按需引入时组件名为 `LhRow` / `LhCol`）。底层是 CSS Grid，`span` / `offset` / `push` / `pull` 直接映射到 `grid-column` 定位，类名与定位算法全部由 `@lh-ui/share` core 纯函数产出。

## 基础布局

```vue
<template>
  <lh-row>
    <lh-col :span="12"><view class="cell">12</view></lh-col>
    <lh-col :span="12"><view class="cell">12</view></lh-col>
  </lh-row>
</template>
```

## 列间距 gutter

`gutter` 支持 `number`（仅横向）或 `[横向, 纵向]` 数组；Row 用负外边距抵消列内边距。

```vue
<template>
  <lh-row :gutter="16">
    <lh-col :span="8"><view class="cell">8</view></lh-col>
    <lh-col :span="8"><view class="cell">8</view></lh-col>
    <lh-col :span="8"><view class="cell">8</view></lh-col>
  </lh-row>
  <lh-row :gutter="[16, 24]">
    <lh-col :span="12"><view class="cell">12</view></lh-col>
    <lh-col :span="12"><view class="cell">12</view></lh-col>
  </lh-row>
</template>
```

## 主轴排列 justify / 交叉轴对齐 align

`justify` 的 `center` 与 `align` 的 `middle` 各自映射到独立修饰类（两轴不撞类）；`align='center'` 是 `middle` 的兼容别名。

```vue
<template>
  <lh-row justify="center" align="middle">
    <lh-col :span="6"><view class="cell">6</view></lh-col>
    <lh-col :span="6"><view class="cell">6</view></lh-col>
  </lh-row>
</template>
```

## 偏移与平移

- `offset`：左侧偏移 N 列（显式起点 `offset + 1`）
- `push` / `pull`：在 offset 基础上右移 / 左移起点

```vue
<template>
  <lh-row>
    <lh-col :span="6" :offset="6"><view class="cell">6 / offset 6</view></lh-col>
    <lh-col :span="9" :push="6"><view class="cell">9 / push 6</view></lh-col>
  </lh-row>
</template>
```

## 响应式断点

`xs` / `sm` / `md` / `lg` / `xl` 分别在 `<640 / ≥640 / ≥768 / ≥1024 / ≥1280px` 生效，未声明时向下回退到最近的已定义档（`xs` 恒兜底）。也可用 `sizes` 批量声明。

```vue
<template>
  <lh-row>
    <lh-col :xs="24" :sm="12" :md="8" :lg="6">
      <view class="cell">xs=24 sm=12 md=8 lg=6</view>
    </lh-col>
  </lh-row>
</template>
```

## Row Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| gutter | 列间距（px，或 `[横向, 纵向]`） | `number \| [number, number]` | `0` |
| justify | 主轴排列 | `'start' \| 'center' \| 'end' \| 'space-between' \| 'space-around'` | `'start'` |
| align | 交叉轴对齐 | `'top' \| 'middle' \| 'bottom'` | `'top'` |
| wrap | 是否换行 | `boolean` | `true` |
| customClass | 自定义类名（透传到根节点） | `string` | — |
| sx | sx 快速布局属性 | `LhSxProps` | — |

## Col Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| span | 占据列数（24 栅格制） | `number` | — |
| offset | 左侧偏移列数 | `number` | — |
| push | 向右平移列数 | `number` | — |
| pull | 向左平移列数 | `number` | — |
| xs / sm / md / lg / xl | 各断点下的尺寸（`number` 或 `{ span, offset }`） | `LhColSize` | — |
| sizes | 按断点批量声明（与 xs~xl 等价，任选其一） | `LhBreakpointSizes` | — |
| customClass | 自定义类名（透传到根节点） | `string` | — |
| sx | sx 快速布局属性 | `LhSxProps` | — |

## Slots

| 插槽 | 说明 |
| --- | --- |
| default | 栅格内容（Row 与 Col 均为默认插槽） |

## 平台差异

- **纯布局组件**：无弹层、无度量、无 document 依赖，H5 与微信小程序表现一致。
- **断点来源**：H5 走 `matchMedia` 监听视口变化；**小程序无 matchMedia**，固定降级为 `xs` 档（规则与回退算法仍由 share core 的 `resolveResponsiveSize` 决定，只是当前断点恒为 `xs`）。若小程序端需要按屏幕宽度分档，可自行把 `uni.getSystemInfoSync().windowWidth` 接入 `useLhBreakpoint` 提供的注入接口，或为小程序固定一套 `xs`/`sm` 布局。
- **标签替换**：plus 的 `<div>` 换成 `<view>`（WXSS 禁标签选择器，样式靠 `lh-row*` / `lh-col*` 类名生效）。
- **`grid-column` 定位**：纯 span 走 auto-placement（`span N`），带 offset / push / pull 时显式定位起点并钳制在 24 列坐标系内，防止越界组合撑破容器。

::: tip 与 Vue3 版的差异
- 组件结构、props 口径、类名与定位算法与 plus 完全一致（同一 share core）。
- 子组件标签按 easycom 约定为 `lh-row` / `lh-col`（按需引入对应组件名 `LhRow` / `LhCol`）。
- 增加了 `customClass` prop：uni-app 端自定义类名无法穿透 `styleIsolation`，统一走 prop 透传（plus 端靠 class 直传）。
:::
