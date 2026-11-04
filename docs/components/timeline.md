# Timeline 时间线

纵向事件流。时间顺序即文档顺序，支持时间戳、语义类型、空心节点与左右交替布局。

> 纯展示组件：无事件、无受控状态，H5 与微信小程序两端表现完全一致（详见文末「平台差异」）。

## 基础用法

`timestamp` 设定时间戳文本；`type` 给节点圆点附加语义颜色（`'primary'` / `'success'` / `'warning'` / `'danger'`）。

```vue
<template>
  <lh-timeline>
    <lh-timeline-item timestamp="2026-09-01">
      立项评审
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="2026-09-15"
      type="success"
    >
      一期交付
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="2026-09-25"
      type="warning"
    >
      验收进行中
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## 左右交替

`mode="alternate"` 让时间线以容器中轴为界，条目按序号左右交替（偶数序号在左，奇数序号在右）。

```vue
<template>
  <lh-timeline mode="alternate">
    <lh-timeline-item timestamp="Q1">
      规划
    </lh-timeline-item>
    <lh-timeline-item timestamp="Q2">
      开发
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="Q3"
      type="danger"
    >
      压测
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="Q4"
      type="success"
    >
      上线
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## 空心节点

`hollow` 让节点显示为空心圆点，常用于未完成的状态。

```vue
<template>
  <lh-timeline>
    <lh-timeline-item
      timestamp="Q1"
      hollow
    >
      未开始
    </lh-timeline-item>
    <lh-timeline-item timestamp="Q2">
      进行中
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="Q3"
      type="success"
    >
      已完成
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## 自定义时间戳与圆点

`timestamp` 与 `dot` 均为插槽：不传 `timestamp` prop 而用 `#timestamp` 插槽可放任意内容；`#dot` 插槽替换默认圆点（可放图标等）。

```vue
<template>
  <lh-timeline>
    <lh-timeline-item type="primary">
      <template #timestamp>
        2026 年 9 月
      </template>
      自定义时间戳内容
    </lh-timeline-item>
    <lh-timeline-item type="success">
      <template #dot>
        <lh-icon
          name="check"
          :size="12"
        />
      </template>
      自定义圆点（lh-icon 图标）
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## Timeline Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| mode | 布局模式：`'left'` 左侧时间线 / `'alternate'` 左右交替 | `'left' \| 'alternate'` | `'left'` |
| customClass | 自定义类名 | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## TimelineItem Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| timestamp | 时间戳文本（也可用 `#timestamp` 插槽） | `string` | — |
| type | 节点语义类型（圆点边框按令牌着色） | `'primary' \| 'success' \| 'warning' \| 'danger'` | — |
| hollow | 空心节点（常用于未完成状态） | `boolean` | `false` |
| customClass | 自定义类名（透传到条目根节点） | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## Slots

| 插槽 | 说明 |
| --- | --- |
| Timeline default | 条目节点（`lh-timeline-item`） |
| TimelineItem default | 条目正文内容 |
| TimelineItem timestamp | 时间戳内容（不传 prop 与插槽时不渲染该行） |
| TimelineItem dot | 自定义圆点（默认圆点为纯装饰，不进入无障碍树） |

## 平台差异

- 时间线是**纯展示组件**：无事件、无受控状态、无度量与平台 API 调用，H5 与微信小程序两端完全可用且表现一致。
- `<ol>` / `<li>` 语义列表在两端均改由 `<view>` 承载（WXSS 标签选择器禁用，靠类名生效），并以 `role="list"` / `role="listitem"` 保留列表语义；小程序读屏支持以平台能力为准。
- 连接线与中央轴线全部是 CSS 伪元素（`::before`），不依赖 JS 度量；`alternate` 模式的左右交替由序号奇偶 + flex 方向实现，两端一致。
- **WXSS 净化**：share 样式源的 `.lh-timeline__item:not(.lh-timeline__item--last)` 在构建期剥离 `:not()` 修饰（WXSS 不支持 `:not()`），非末项连接线的显隐由同块内特异度不低于它的 `.lh-timeline__item--last::before` 规则接管，两端渲染结果不变。
- 无障碍：节点圆点为纯装饰（`aria-hidden="true"`），自定义圆点插槽同样不进入无障碍树，与 Vue3 版一致。
- **移植决策（与 Vue3 版对齐，未引入未定义 API）**：本次移植时 plus 真源与 `@lh-ui/share` core 尚未提供 `placement`（时间戳位置）、`center`（居中布局）等 API，本仓同样不提供，严格对齐真源；`mode` 目前仅 `'left'` / `'alternate'` 两种。后续真源补齐后跟随升级。
