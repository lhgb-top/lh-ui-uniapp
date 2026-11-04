# Slider 滑块

滑块组件：在轨道上拖动触点选择数值，支持单滑块与范围（双滑块）两种模式、`step` 步长吸附与 `marks` 刻度标记。轨道、触点与填充条全部 `view` 自绘，值的钳制 / 步长吸附 / 刻度排序 / 无障碍契约全部走 `@lh-ui/share` core 纯函数，零拷贝。

## 基础用法

```vue
<template>
  <lh-slider v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref(30)
</script>
```

未传 `modelValue` 时组件内部以 `min` 初始化；传入即受控（与全部表单类组件一致）。拖动过程中只更新内部态，**松手时才一次性发出 `update:modelValue` / `change`**（与 Vue3 版一致）。

## 范围选择

`range` 开启双滑块模式，`modelValue` 为二元组 `[起始, 结束]`：

```vue
<template>
  <lh-slider v-model="span" range />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const span = ref<[number, number]>([20, 60])
</script>
```

拖动一端越过另一端时两端自动交换（拖动的永远是手指下面的那个滑块），值始终保持 `[早, 晚]`。

## 步长与刻度

`step` 让触点吸附到步长网格；`marks` 以「数值 → 文案」的映射渲染刻度标记（按键值排序）：

```vue
<template>
  <lh-slider v-model="value" :min="0" :max="100" :step="10" :marks="marks" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref(30)
const marks: Record<number, string> = {
  0: '0',
  50: '半程',
  100: '满',
}
</script>
```

## 禁用

`disabled` 禁用拖动与键盘步进，触点移出 Tab 序列：

```vue
<template>
  <lh-slider v-model="value" disabled />
</template>
```

## 显示数值

`show-input` 在轨道右侧回显当前值（范围模式为 `[起始, 结束]` 文本）：

```vue
<template>
  <lh-slider v-model="value" show-input />
</template>
```

## Slider API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 当前值（受控 v-model；范围模式传二元组） | `number \| [number, number]` | — |
| min | 最小值 | `number` | `0` |
| max | 最大值 | `number` | `100` |
| step | 步长（触点吸附的最小单位） | `number` | `1` |
| disabled | 整体禁用 | `boolean` | `false` |
| range | 是否为范围模式（双滑块） | `boolean` | `false` |
| showInput | 是否在轨道右侧显示当前数值 | `boolean` | `false` |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| marks | 刻度标记（键为数值、值为文案，按数值排序展示） | `Record<number, string>` | — |
| customClass | 自定义类名（透传到根节点） | `string` | — |
| sx | sx 快速布局属性（作用于根节点） | `LhSxProps` | — |

### Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 值变化（v-model；拖动松手或键盘步进时触发） | `(value: number \| [number, number])` |
| change | 值变化（与 update:modelValue 同载荷） | `(value: number \| [number, number])` |

### 无障碍

- 触点为 `role="slider"`，带 `aria-valuemin` / `aria-valuemax` / `aria-valuenow` / `aria-valuetext`（契约由 share 的 `getSliderThumbAria` 决定）
- 范围模式下两个触点的 `aria-label` 区分「起始滑块 / 结束滑块」（语言包 `slider.thumbStart` / `slider.thumbEnd`，非范围模式为 `slider.thumb`）
- 键盘步进（方向键按 `step` 增减、PageUp / PageDown 大步进、Home / End 直达极值）仅 H5 生效，见下平台差异

::: tip 平台差异（与 Vue3 版的差异）
- **拖动载体**：plus 在触点上挂 `mousedown` / `touchstart` 后把 move / up 监听接到 `document`；小程序没有 document，拖动改为 `touchstart` / `touchmove` / `touchend` 直接挂在触点上（小程序的 touch 事件沿 touchstart 的目标节点派发，不依赖全局监听）。H5 保留 document 级鼠标监听（mousedown 落点后鼠标移出组件也能继续拖），由条件编译守卫，MP 包内无死代码。
- **位移计算是异步的**：plus 用同步 `getBoundingClientRect` 量轨道矩形；小程序只有异步的 `createSelectorQuery`，本组件改走适配层 `getSingleLhRect`。度量结果按拖拽会话缓存（touchstart 时预热），正常拖动几乎无感；但语义上位移更新比触碰晚一帧——**不要在 move 事件里同步假定值已更新**，提交只在松手时发生。
- **轨道宽度为 0 时跳过**：尚未布局完成（或测试环境）时轨道矩形宽度为 0，位移换算会 0 除产生 NaN，此时跳过本次更新，不污染值。
- **键盘步进仅 H5**：方向键 / Home / End / PageUp / PageDown 的步进在 MP 端无键盘事件，由条件编译守卫直接不调用，MP 包内无死代码。
- **aria 属性逐项显式绑定**：plus 模板里 share 的 `LhAriaAttrs` 属性包不能 `v-bind` 落图（MP 模板编译器不支持），改由胶水层把 `aria-*` 键摊成具体值逐项绑定，契约仍由 share 纯函数决定。
- **不提供 vertical 竖向与 tooltip 气泡**：plus 真源没有 `vertical`（竖向轨道）与 tooltip 提示气泡属性，本仓严格对齐、不私自新增。需要竖向时可用外层容器旋转包裹（自行处理触摸坐标），需要数值提示时用 `show-input` 常显当前值。
:::
