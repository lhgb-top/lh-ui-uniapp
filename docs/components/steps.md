# Steps 步骤条

引导用户按流程完成任务，支持横向 / 纵向、图标、描述与点击导航；纯展示 + 状态类组件，H5 与微信小程序全端可用。

## 基础用法

`current` 指定当前步骤索引（0 起，可用 `v-model:current` 双向绑定）。索引小于当前步为 `finish`、等于为 `process`、大于为 `wait`。

```vue
<template>
  <lh-steps :current="current">
    <lh-step
      title="研墨"
      description="墨分五色"
    />
    <lh-step
      title="起稿"
      description="经营位置"
    />
    <lh-step
      title="落墨"
      description="骨法用笔"
    />
    <lh-step
      title="题款"
      description="画龙点睛"
    />
  </lh-steps>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const current = ref(1)
</script>
```

## 竖向步骤

`direction="vertical"` 切换为纵向布局（由 CSS 控制，无平台差异）。

```vue
<template>
  <lh-steps
    :current="1"
    direction="vertical"
  >
    <lh-step
      title="提交订单"
      description="2026-10-01 10:00"
    />
    <lh-step
      title="付款成功"
      description="2026-10-01 10:05"
    />
    <lh-step
      title="商家发货"
      description="预计 10-03 送达"
    />
    <lh-step title="确认收货" />
  </lh-steps>
</template>
```

## 带图标

给 `lh-step` 传 `icon` 使用内置图标字体（图标名见 Icon 文档）；不传时 `finish` 显示勾、`error` 显示叉，其余显示序号。

```vue
<template>
  <lh-steps :current="1">
    <lh-step
      title="注册"
      icon="user"
    />
    <lh-step
      title="验证"
      icon="email"
    />
    <lh-step
      title="完成"
      icon="check"
    />
  </lh-steps>
</template>
```

`icon` 插槽可完全覆盖默认回退（自定义图形、文字皆可）：

```vue
<template>
  <lh-steps :current="2">
    <lh-step title="第一步">
      <template #icon>
        <text class="step-badge">壹</text>
      </template>
    </lh-step>
    <lh-step title="第二步">
      <template #icon>
        <text class="step-badge">贰</text>
      </template>
    </lh-step>
    <lh-step title="第三步">
      <template #icon>
        <text class="step-badge">叁</text>
      </template>
    </lh-step>
  </lh-steps>
</template>
```

## 可点击导航

`clickable` 开启后，「已完成」与「进行中」的步骤渲染为可点击头部，点击抛出 `update:current`（v-model）与 `change`；等待中的后续步骤不引导跳转。

```vue
<template>
  <lh-steps
    v-model:current="active"
    clickable
  >
    <lh-step title="第一步" />
    <lh-step title="第二步" />
    <lh-step title="第三步" />
  </lh-steps>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref(1)
</script>
```

## 整体状态覆盖

`status` 传入后覆盖所有步骤的派生状态（`wait` / `process` / `finish` / `error`），用于自定义展示。

```vue
<template>
  <lh-steps
    :current="2"
    status="error"
  >
    <lh-step title="第一步" />
    <lh-step title="第二步" />
    <lh-step title="第三步" />
  </lh-steps>
</template>
```

## Steps Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| current | 当前步骤索引（v-model:current，0 起） | `number` | `0` |
| direction | 方向：`'horizontal'` / `'vertical'` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| clickable | 步骤是否可点击导航（仅已完成 / 进行中步骤可点） | `boolean` | `false` |
| status | 整体覆盖所有步骤的状态（用于自定义展示） | `'wait' \| 'process' \| 'finish' \| 'error'` | — |
| customClass | 自定义类名（透传到根节点） | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## Step Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 步骤标题（也可用 title 插槽） | `string` | `''` |
| description | 步骤描述（也可用 description 插槽） | `string` | `''` |
| icon | 自定义图标名称（未传时 finish/error 用勾叉，其余显示序号） | `LhIconName` | — |
| customClass | 自定义类名（透传到项根节点） | `string` | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:current | 当前步骤变化（v-model:current） | `(index: number)` |
| change | 点击可点击步骤导航 | `(index: number)` |

## Slots

| 插槽 | 说明 |
| --- | --- |
| Steps default | 步骤项节点（只收集 `lh-step`） |
| Step icon | 圆圈内容（覆盖 icon prop 与序号回退） |
| Step title | 标题（覆盖 title prop） |
| Step description | 描述（覆盖 description prop） |

## 平台差异

- **纯展示 + 状态类组件，H5 与微信小程序全端可用**；横纵向由 CSS 控制，两端一致。
- `<ol>/<li>` 换成 `<view>`（WXSS 禁标签选择器）；可点击头部用 `view` + `role="button"`（小程序 `<button>` 自带原生样式无法 reset），点击无障碍名称走 share locales 的 `steps.step` / `steps.finish` / `steps.error`（九语言齐备，仓内不持有文案）。
- **连接线「末项不画」机制两端不同**：share 源里连接线（横向 `::after` / 纵向 `::before`）靠结构性 `:not(:last-child)` 只画非末项；WXSS 不支持 `:not()`，构建期净化时剥离（连接线改为所有项都画），末项 / 行末项的隐藏全部交给 `--line-last` 类：
  - 横向：折行度量逻辑与 Vue3 版同源（`getStepsLineLastIndices`），度量改走适配层 `getLhRect`（H5 走 document 查询、MP 走异步 `createSelectorQuery`，必须 onMounted 之后）；
  - 纵向：无折行，直接标记全局末项，由组件 SFC 的 uni-app 适配样式补一条 `--line-last::before` 隐藏规则（share 无此规则）。
- **容器宽度变化重算折行仅 H5**：H5 用 `ResizeObserver`；MP 无此 API，步骤增删与方向切换会重算，但尺寸动态变化场景需换页重进（接受降级，保证 MP 包无死代码）。
- **移植决策（与 Vue3 版对齐，未引入未定义 API）**：本次移植时 plus 真源尚未提供 `simple` 简洁模式、`process-status` / `finish-status` 自定义状态、`space` 间距等 API（真源 Props 为 `current` / `direction` / `clickable` / `status` / `themeVars` / `sx`），故本仓同样不提供；本仓也不含 `themeVars`（本仓 ConfigProvider 的 `componentTheme` 名单未含 steps），后续真源补齐后跟随升级。
