# ColorPicker 颜色选择器

点击触发器弹出调色面板：饱和度 / 明度板拖拽 + 色相 / 透明度滑杆 + hex / rgb
输入 + 预设色板。颜色换算全部来自 `@lh-ui/share/core/color-picker` 纯函数
（hex/rgb 与 HSV 双空间往返，通道全程钳制），H5 与微信小程序渲染一致。

## 基础用法

```vue
<template>
  <lh-color-picker v-model="color" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const color = ref('#2B4C7C')
</script>
```

## 透明度与预设色板

```vue
<template>
  <lh-color-picker
    v-model="color"
    show-alpha
    :predefine="predefine"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const color = ref('rgba(43, 76, 124, 0.6)')
// 开启 showAlpha 后 hex 输出 8 位（#2b4c7c99）、rgb 输出 rgba()——alpha 有值永不静默丢失
const predefine = ['#2B4C7C', '#5B8C5A', '#C4A35A', '#B23A3A']
</script>
```

## 输出格式

```vue
<lh-color-picker v-model="color" format="rgb" />
```

`format` 只影响 `v-model` 的输出形态（`hex` 或 `rgb`），非法值回退 `hex`。

## 尺寸 / 清除 / 禁用

```vue
<lh-color-picker v-model="color" size="small" />
<lh-color-picker v-model="color" clearable />
<lh-color-picker v-model="color" disabled />
```

`clearable` 开启后，已有值时触发器内出现清除按钮，点击置空并抛 `clear` 事件。

## 命令式开合

```vue
<template>
  <lh-color-picker ref="pickerRef" v-model="color" />
  <lh-button size="small" @click="pickerRef?.open()">打开面板</lh-button>
</template>
```

组件通过 ref 暴露 `open` / `close` / `isOpen`。

## ColorPicker API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model-value | 绑定值（受控 v-model，hex 或 rgb() 字符串，按 format 输出） | string | `''` |
| format | 输出格式（非法值回退 hex） | `'hex' \| 'rgb'` | `hex` |
| show-alpha | 透明度通道（开启后输出 8 位 hex / rgba()） | boolean | `false` |
| predefine | 预设色板 | string[] | `[]` |
| size | 尺寸 | `'mini' \| 'small' \| 'medium' \| 'large' \| 'x-large'` | `medium` |
| disabled | 禁用 | boolean | `false` |
| clearable | 清除（置空）按钮 | boolean | `false` |
| placeholder | 占位提示（空值时；未传取语言包 colorPicker.placeholder） | string | `''` |
| aria-label | 无障碍名称（未传取语言包 colorPicker.label） | string | — |
| custom-class | 自定义类名（透传根节点） | string | — |
| sx | sx 快速布局属性 | LhSxProps | — |

### Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| update:model-value | 颜色变化（v-model） | `(value: string)` |
| change | 颜色确认变化（与 update:model-value 同载荷） | `(value: string)` |
| clear | 点击清除按钮 | — |

### Expose

| 方法 | 说明 |
| --- | --- |
| open | 打开面板 |
| close | 关闭面板 |
| isOpen | 面板是否展开（ref） |

### 无障碍

- 触发器 `role="button"` + `aria-expanded` + `aria-label`（语言包 colorPicker.label）。
- 色相 / 透明度滑杆 `role="slider"` + `aria-valuenow/min/max`，方向键微调（Shift 加速）。
- 预设色板每格可点击，可达名称即色值字符串。

::: tip 平台差异（与 Vue3 版的差异）
- 拖拽轴：MP 沿触摸目标派发 touchmove / touchend（无需 document 监听），H5 另走
  document 级鼠标监听（移出组件可继续拖），范式与 Slider 一致。
- 面板内 hex / rgb 输入用 uni `<input>`：回车提交走 `@confirm`（键盘「完成」），
  失焦提交走 `@blur`（MP 无 keydown.enter）。
- 键盘交互（方向键微调、Enter / Space 开合、Esc 关闭）仅 H5 生效，MP 端无键盘事件。
- 面板定位走 root-portal + 两帧度量（measure → 定位 → 显示，防闪烁）。
:::
