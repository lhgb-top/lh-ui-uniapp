# Popover 弹出框

富内容弹出层：比 Tooltip 承载更多信息（标题、正文、交互节点）。触发器包裹在默认插槽里，弹出内容通过 `content` 插槽传入；弹出层为 `role="dialog"`，箭头始终指向触发器。

## 基础用法

```vue
<template>
  <lh-popover title="水墨提示" placement="top">
    <lh-button>点击弹出</lh-button>
    <template #content>
      <text>这是一段富内容，可以放置任意节点。</text>
    </template>
  </lh-popover>
</template>
```

::: warning 小程序没有 hover / focus 语义
`trigger` 默认是 `click`（全端可用）。`hover` / `focus` 仅 H5 有效——
小程序端自动降级为点击 / 触摸切换（首次点击展开、再次点击收起）。
:::

## 触发方式

```vue
<template>
  <!-- 悬停触发（仅 H5 生效，小程序端降级为点击切换） -->
  <lh-popover trigger="hover" title="悬停触发">
    <lh-button>悬停我</lh-button>
    <template #content><text>指针移进弹出层不会触发关闭。</text></template>
  </lh-popover>

  <!-- 聚焦触发（仅 H5 生效） -->
  <lh-popover trigger="focus" title="聚焦触发">
    <lh-input placeholder="聚焦输入框" />
    <template #content><text>输入框获得焦点时展示。</text></template>
  </lh-popover>

  <!-- 手动控制：显隐完全由外部 v-model:visible 控制 -->
  <lh-popover v-model:visible="manualVisible" trigger="manual" title="手动控制">
    <lh-button @click="manualVisible = !manualVisible">外部开关</lh-button>
    <template #content><text>显隐完全由外部状态控制。</text></template>
  </lh-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const manualVisible = ref(false)
</script>
```

> 延迟 `showAfter` / `hideAfter` 只用于防误触的 hover / focus（H5）；`click` 与 `manual` 立即响应。

## 十二种方位

```vue
<template>
  <lh-popover
    v-for="p in placements"
    :key="p"
    :placement="p"
    :title="p"
  >
    <lh-button size="small">{{ p }}</lh-button>
    <template #content><text>方位：{{ p }}</text></template>
  </lh-popover>
</template>

<script setup lang="ts">
const placements = [
  'top', 'top-start', 'top-end',
  'bottom', 'bottom-start', 'bottom-end',
  'left', 'left-start', 'left-end',
  'right', 'right-start', 'right-end',
] as const
</script>
```

> 视口空间不足时弹出层会自动翻转方向（flip）并夹回交叉轴（shift），箭头位置随之切换。

## 宽度、箭头与禁用

```vue
<template>
  <!-- 固定宽度 -->
  <lh-popover title="固定宽度" width="240">
    <lh-button>固定宽度</lh-button>
    <template #content><text>通过 width 指定弹出层宽度。</text></template>
  </lh-popover>

  <!-- 无箭头 -->
  <lh-popover title="无箭头" :arrow="false">
    <lh-button>无箭头</lh-button>
    <template #content><text>arrow 为 false 时不渲染指向箭头。</text></template>
  </lh-popover>

  <!-- 禁用 -->
  <lh-popover title="已禁用" disabled>
    <lh-button disabled>禁用触发器</lh-button>
    <template #content><text>disabled 时触发器与弹出层均不响应。</text></template>
  </lh-popover>
</template>
```

## Popover API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| placement | 展示位置（12 种方位） | `LhPopoverPlacement` | `'top'` |
| trigger | 触发方式：`click`（全端）/ `hover`、`focus`（仅 H5，MP 降级为点击）/ `manual`（受控） | `'click' \| 'hover' \| 'focus' \| 'manual'` | `'click'` |
| title | 标题（也可用 title 插槽） | `string` | — |
| visible | 手动控制的显示状态（v-model:visible） | `boolean` | — |
| disabled | 是否禁用 | `boolean` | `false` |
| arrow | 是否显示箭头 | `boolean` | `true` |
| width | 弹出层宽度（数字为 px） | `string \| number` | — |
| popperClass | 弹出层自定义类名 | `string` | — |
| showAfter | 延迟显示时间（ms，仅 H5 的 hover / focus 生效） | `number` | — |
| hideAfter | 延迟隐藏时间（ms，仅 H5 的 hover / focus 生效） | `number` | — |
| themeVars | 组件级主题变量 | `Record<string, string>` | — |
| bgPattern | 组件级背景花纹，覆盖 ConfigProvider 配置 | `string` | — |
| sx | sx 快速布局属性（作用于触发器根元素） | `LhSxProps` | — |

### Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| update:visible | 显隐变化（v-model） | `(value: boolean)` |
| show | 显示后触发 | — |
| hide | 隐藏后触发 | — |

### Slots

| 插槽 | 说明 |
| --- | --- |
| default | 触发器内容 |
| title | 自定义标题 |
| content | 弹出内容 |

### Methods

| 方法 | 说明 |
| --- | --- |
| show | 编程式显示 |
| hide | 编程式隐藏 |
| toggle | 编程式切换 |

### 无障碍

- 触发器带 `aria-haspopup="true"` 与 `aria-expanded` / `aria-controls`；弹出层为 `role="dialog"`，有标题时通过 `aria-labelledby` 关联
- Esc 关闭、点击弹出层外部（页内透明遮罩）关闭；多弹层叠加时 Esc 只关栈顶（均仅 H5）
- 定位引擎为自研纯函数（flip / shift 防溢出），零第三方运行时依赖

::: tip 平台差异（与 Vue3 版的差异）
- **触发方式**：小程序无 hover / focus 语义，`trigger="hover"` / `trigger="focus"` 在 MP 端降级为点击 / 触摸切换；显隐延迟（`showAfter` / `hideAfter`）仅在 H5 的 hover / focus 模式生效，`click` 与 `manual` 立即响应。
- **弹层承载与定位**：无 `teleportTarget` prop——小程序无 DOM teleport，弹出层统一由 `root-portal`（低版本页内 fixed 兜底）承载；popper 定位走两帧异步度量（先隐藏渲染量尺寸 → `computePosition` 定位 → 显示，防闪烁），定位计算是异步的，不能假设同步拿到结果；箭头偏移由组件胶水把定位结果的 `arrowOffset` 写入 `--lh-arrow-offset`。
- **键盘行为仅 H5**：Esc 关闭走文档级监听（多弹层叠加时只关栈顶）；小程序无键盘事件，整段由条件编译裁剪。
- **焦点圈未移植**：plus 点击触发会把焦点圈进弹出层（focus-trap）并在关闭时归还；MP 无键盘焦点语义，与本仓 Dialog 同款整体不移植。
- **进出过渡未实现**：plus 用 `Transition` 淡入淡出，MP 端 `Transition` 不可靠，与 tooltip / dropdown 一致不绑过渡。
- **触发器滚出视口不自动收起**：plus 的 `useLhPopper` 有 scroll-out 回调，uni-app 无统一的滚动 / 尺寸变化监听通道，未移植。
:::
