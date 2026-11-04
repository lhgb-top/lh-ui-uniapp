# Drawer 抽屉

从屏幕边缘滑入的侧滑面板，适合比 Dialog 更贴边的临时操作（详情、筛选、向导步骤）。与 Dialog 一致采用 `role="dialog"` + `aria-modal="true"`，遮罩点击与 Esc（H5）均可关闭。

## 基础用法

```vue
<template>
  <lh-button @click="visible = true">打开抽屉</lh-button>

  <lh-drawer v-model="visible" title="订单详情">
    <view>这里放置抽屉主体内容。</view>
    <view>面板宽度由 size 控制，默认 30% 视口宽度。</view>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
</script>
```

## 四个方向

`direction` 支持 `right`（默认）/ `left` / `top` / `bottom`，面板从对应边缘滑入。

```vue
<template>
  <!-- 打开右侧抽屉 -->
  <lh-button @click="openDir('right')">right</lh-button>
  <!-- 打开左侧抽屉 -->
  <lh-button @click="openDir('left')">left</lh-button>
  <!-- 打开顶部抽屉 -->
  <lh-button @click="openDir('top')">top</lh-button>
  <!-- 打开底部抽屉 -->
  <lh-button @click="openDir('bottom')">bottom</lh-button>

  <!-- 按指定方向滑出 -->
  <lh-drawer v-model="dirVisible" :title="`${direction} 抽屉`" :direction="direction" size="40%">
    <view>当前方向：{{ direction }}</view>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhDrawerDirection } from '@lh-ui/uniapp'

const dirVisible = ref(false)
const direction = ref<LhDrawerDirection>('right')
function openDir(d: LhDrawerDirection) {
  direction.value = d
  dirVisible.value = true
}
</script>
```

## 自定义尺寸

`size` 传数字为 px，传字符串支持百分比（如 `'40%'`）。左右方向作用于宽度，上下方向作用于高度。

```vue
<template>
  <!-- 打开 480px 宽抽屉 -->
  <lh-button @click="sized = true">480px 宽抽屉</lh-button>

  <!-- 固定尺寸的抽屉，底部为操作区 -->
  <lh-drawer v-model="sized" title="筛选条件" :size="480">
    <view>按名称、标签筛选数据。</view>
    <template #footer>
      <lh-button @click="sized = false">取消</lh-button>
      <lh-button type="primary" @click="sized = false">应用筛选</lh-button>
    </template>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const sized = ref(false)
</script>
```

## 行为开关

`mask-closable` 控制遮罩点击关闭、`show-close` 控制右上角关闭按钮、`close-on-esc` 控制 Esc 关闭（仅 H5）、`lock-scroll` 控制打开时锁定页面滚动（仅 H5）。

```vue
<template>
  <!-- 打开「仅按钮关闭」抽屉 -->
  <lh-button @click="locked = true">仅按钮关闭</lh-button>

  <!-- 遮罩点击与 Esc 均不关闭，只能通过按钮关闭 -->
  <lh-drawer
    v-model="locked"
    title="仅按钮关闭"
    :mask-closable="false"
    :show-close="false"
    :close-on-esc="false"
  >
    <view>遮罩点击与 Esc（H5）都不关闭。</view>
    <template #footer>
      <lh-button type="primary" @click="locked = false">关闭</lh-button>
    </template>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const locked = ref(false)
</script>
```

## Drawer API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue (v-model) | 是否显示 | `boolean` | `false` |
| title | 标题（也可用 header 插槽） | `string` | — |
| direction | 方向 | `'right' \| 'left' \| 'top' \| 'bottom'` | `'right'` |
| size | 尺寸：数字为 px，字符串支持百分比 | `string \| number` | `'30%'` |
| maskClosable | 点击遮罩是否关闭 | `boolean` | `true` |
| showClose | 是否显示关闭按钮 | `boolean` | `true` |
| lockScroll | 打开时锁定页面滚动（**仅 H5 有效**） | `boolean` | `true` |
| closeOnEsc | 是否响应 Esc 关闭（**仅 H5 有效**） | `boolean` | `true` |
| customClass | 自定义类名（透传到根节点） | `string` | — |
| themeVars | 组件级主题变量 | `Record<string, string>` | — |
| bgPattern | 组件级背景花纹，覆盖 ConfigProvider 配置 | `string` | — |
| sx | sx 快速布局属性（作用于面板） | `LhSxProps` | — |

### Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 显隐变化（动画结束后触发） | `(visible: boolean)` |
| open | 打开 | — |
| close | 关闭（动画结束后触发） | — |

### Slots

| 插槽 | 说明 |
| --- | --- |
| default | 主体内容 |
| header | 自定义头部标题区（替换 title 文案） |
| footer | 底部操作区 |

### Methods

| 方法 | 说明 |
| --- | --- |
| open | 编程式打开 |
| close | 编程式关闭 |

### 无障碍

- 根节点为 `role="dialog"` + `aria-modal="true"`；有标题时通过 `aria-labelledby` 关联标题元素，无标题时用语言包 `drawer.title` 作 `aria-label` 兜底
- 遮罩为装饰性节点（`aria-hidden="true"`）
- 关闭按钮携带 `role="button"` 与语言包 `drawer.close` 的 `aria-label`
- Esc 关闭（可由 `close-on-esc` 关闭该行为，仅 H5）

::: tip 平台差异（与 Vue3 版的差异）
- **弹层承载**：无 `teleportTarget` prop——小程序无 DOM teleport，弹层统一由 `root-portal` 承载（H5 是 teleport）。**微信端 `root-portal` 依赖基础库 ≥ 2.25.2**，低版本自动降级为页内 `fixed`（不脱离页面节点树，层级仍由自增 z-index 保证，功能不受影响）。
- **进出过渡**：plus 用 `<Transition name="lh-drawer-fade">` 驱动滑动动画；小程序端无 `<Transition>` 组件且 `transitionend` 事件不可靠，本端手工复刻 Vue Transition 的类名时序（起始态隔帧移除 → 动画态 → 结束卸载），用 `setTimeout` 对齐 share SCSS 的 300ms transition 时长——遮罩淡入淡出 + 面板按方向滑入滑出，双端表现一致。
- **焦点圈（focus-trap）仅 H5 有键盘焦点语义，本端未接入**：plus 打开时会把 Tab 焦点序列圈在面板内；小程序无键盘焦点语义（share 的 shouldDrawerTrapFocus 被 LH_IS_H5 编译期守卫短路），本端与 Dialog 一致不调用 share 的 focus-trap，仅保留 Esc 关闭。
- **lockScroll 仅 H5 有效**：小程序无 body 滚动锁定能力，由全屏遮罩拦截点击兜底。
- **closeOnEsc 仅 H5 有效**：Esc 走文档级键盘监听，多弹层叠加时只有栈顶响应；小程序无键盘事件，整段由条件编译裁剪。
- **teleportTarget 未实现**：对齐 select / tooltip / dropdown 先例（小程序无 DOM teleport）。
- **底部抽屉安全区**：`direction="bottom"` 时面板自动带 `env(safe-area-inset-bottom)` 内边距，适配全面屏（uni-app 端适配，share 样式源无此端特化）。
:::
