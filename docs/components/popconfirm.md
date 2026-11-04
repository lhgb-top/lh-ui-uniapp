# Popconfirm 气泡确认

轻量二次确认：在触发器附近弹出确认气泡，不需要打开对话框。语义为阻断式确认（`role="alertdialog"`）：Escape 视为取消。确认内容通过 `content` 插槽或 `title` 属性传入，触发器包裹在默认插槽里。

## 基础用法

```vue
<template>
  <lh-popconfirm title="确定删除这条记录吗？" @confirm="onConfirm" @cancel="onCancel">
    <lh-button type="danger">删除</lh-button>
  </lh-popconfirm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const action = ref('')
function onConfirm() {
  action.value = '已确认'
}
function onCancel() {
  action.value = '已取消'
}
</script>
```

::: warning 小程序没有 hover / focus 语义
`trigger` 默认是 `click`（全端可用）。`hover` / `focus` 仅 H5 有效——
小程序端自动降级为点击 / 触摸切换（首次点击展开、再次点击收起）。
:::

## 三种语气

`type` 决定语气图标与修饰类：`info`（信息）/ `warning`（警告，默认）/ `danger`（危险）。

```vue
<template>
  <lh-popconfirm type="info" title="查看该记录的访问日志？">
    <lh-button>信息</lh-button>
  </lh-popconfirm>
  <lh-popconfirm type="warning" title="该操作会通知所有成员。">
    <lh-button type="warning">警告</lh-button>
  </lh-popconfirm>
  <lh-popconfirm type="danger" title="删除后不可恢复。">
    <lh-button type="danger">危险</lh-button>
  </lh-popconfirm>
</template>
```

## 自定义文案与方位

```vue
<template>
  <lh-popconfirm
    title="归档后可在回收站恢复。"
    confirm-text="归档"
    cancel-text="再想想"
    placement="right"
  >
    <lh-button>自定义文案</lh-button>
  </lh-popconfirm>

  <!-- 悬停触发（仅 H5 生效，小程序端降级为点击切换） -->
  <lh-popconfirm title="悬停即可确认。" trigger="hover" :show-after="0" placement="bottom">
    <lh-button>悬停触发</lh-button>
  </lh-popconfirm>
</template>
```

> 按钮文案默认取语言包 `popconfirm.confirm` / `popconfirm.cancel`，可用 `confirm-text` / `cancel-text` 覆盖。

## 受控显隐与图标

```vue
<template>
  <!-- 受控：显隐完全由外部 v-model:visible 控制 -->
  <lh-popconfirm v-model:visible="pcVisible" trigger="manual" title="受控气泡">
    <lh-button @click="pcVisible = !pcVisible">{{ pcVisible ? '收起' : '展开' }}</lh-button>
  </lh-popconfirm>

  <!-- 图标开关与确认按钮类型 -->
  <lh-popconfirm title="确定删除这条记录吗？" :show-icon="false" confirm-button-type="primary">
    <lh-button type="danger">无图标</lh-button>
  </lh-popconfirm>

  <!-- 禁用 -->
  <lh-popconfirm title="该操作不可用。" disabled>
    <lh-button disabled>禁用</lh-button>
  </lh-popconfirm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const pcVisible = ref(false)
</script>
```

## Popconfirm API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 确认语气：`info` / `warning` / `danger` | `'info' \| 'warning' \| 'danger'` | `'warning'` |
| placement | 展示位置（12 种方位） | `LhPopconfirmPlacement` | `'top'` |
| trigger | 触发方式：`click`（全端）/ `hover`、`focus`（仅 H5，MP 降级为点击）/ `manual`（受控） | `'click' \| 'hover' \| 'focus' \| 'manual'` | `'click'` |
| title | 确认内容（也可用 content 插槽） | `string` | — |
| confirmText | 确认按钮文案（未传时取语言包 popconfirm.confirm） | `string` | — |
| cancelText | 取消按钮文案（未传时取语言包 popconfirm.cancel） | `string` | — |
| confirmButtonType | 确认按钮类型 | `'default' \| 'primary'` | `'primary'` |
| visible | 手动控制的显示状态（v-model:visible） | `boolean` | — |
| disabled | 是否禁用 | `boolean` | `false` |
| showIcon | 是否显示语气图标 | `boolean` | `true` |
| popperClass | 弹出层自定义类名 | `string` | — |
| showAfter | 延迟显示时间（ms，仅 H5 的 hover / focus 生效） | `number` | — |
| hideAfter | 延迟隐藏时间（ms，仅 H5 的 hover / focus 生效） | `number` | — |
| themeVars | 组件级主题变量 | `Record<string, string>` | — |
| bgPattern | 组件级背景花纹，覆盖 ConfigProvider 配置 | `string` | — |
| sx | sx 快速布局属性（作用于触发器根元素） | `LhSxProps` | — |

### Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| confirm | 点击确认按钮后触发 | — |
| cancel | 点击取消按钮或按 Escape 后触发 | — |
| update:visible | 显隐变化（v-model） | `(value: boolean)` |
| show | 显示后触发 | — |
| hide | 隐藏后触发 | — |

### Slots

| 插槽 | 说明 |
| --- | --- |
| default | 触发器内容 |
| content | 自定义确认内容 |

### Methods

| 方法 | 说明 |
| --- | --- |
| show | 编程式显示 |
| hide | 编程式隐藏 |
| toggle | 编程式切换 |

### 无障碍

- 弹出层为 `role="alertdialog"` + `aria-modal="true"`，确认内容通过 `aria-labelledby` 关联；触发器带 `aria-haspopup` / `aria-expanded` / `aria-controls`（属性包由 share 纯函数产出）
- Escape 视为取消（对齐 WAI-ARIA alertdialog：Escape 关闭并视为否定）；多弹层叠加时 Esc 只关栈顶（仅 H5）
- 点击取消按钮、确认按钮外部的透明遮罩均会收起；语气图标为装饰性（`aria-hidden`）
- 定位引擎为自研纯函数（flip / shift 防溢出），零第三方运行时依赖

::: tip 平台差异（与 Vue3 版的差异）
- **触发方式**：小程序无 hover / focus 语义，`trigger="hover"` / `trigger="focus"` 在 MP 端降级为点击 / 触摸切换；显隐延迟（`showAfter` / `hideAfter`）仅在 H5 的 hover / focus 模式生效，`click` 与 `manual` 立即响应。
- **弹层承载与定位**：无 `teleportTarget` prop——小程序无 DOM teleport，弹出层统一由 `root-portal`（低版本页内 fixed 兜底）承载；popper 定位走两帧异步度量（先隐藏渲染量尺寸 → `computePosition` 定位 → 显示，防闪烁），定位计算是异步的，不能假设同步拿到结果；箭头偏移由组件胶水把定位结果的 `arrowOffset` 写入 `--lh-arrow-offset`。
- **键盘行为仅 H5**：Esc = 取消走文档级监听（多弹层叠加时只关栈顶）；小程序无键盘事件，整段由条件编译裁剪。
- **焦点圈未移植**：plus 打开时把焦点落「确定」按钮、Tab 在两按钮间循环并圈进弹出层（focus-trap）、关闭后归还焦点；MP 无键盘焦点语义，与本仓 Dialog / Popover 同款整体不移植。
- **进出过渡未实现**：plus 用 `Transition` 淡入淡出（`lh-popconfirm-fade`），MP 端 `Transition` 不可靠，与 tooltip / dropdown / popover 一致不绑过渡。
- **触发器滚出视口不自动收起**：plus 的 `useLhPopper` 有 scroll-out 回调，uni-app 无统一的滚动 / 尺寸变化监听通道，未移植。
- **aria-haspopup 取值**：plus 模板硬编码 `aria-haspopup="dialog"`，本仓触发器属性包统一由 share 的 `getPopconfirmTriggerAria` 产出（取值 `'true'`），契约以 share 纯函数为准。
:::
