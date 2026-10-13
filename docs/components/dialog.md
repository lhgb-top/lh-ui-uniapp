# Dialog 对话框

## 基础用法

```vue
<template>
  <lh-button @click="visible = true">打开对话框</lh-button>

  <lh-dialog v-model="visible" title="标题" width="80%">
    <view>这是对话框内容</view>
    <template #footer>
      <lh-button @click="visible = false">取消</lh-button>
      <lh-button type="primary" @click="visible = false">确定</lh-button>
    </template>
  </lh-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
</script>
```

## 定位

```vue
<template>
  <lh-dialog v-model="visible" position="bottom" title="底部弹层">
    <view>底部内容</view>
  </lh-dialog>

  <lh-dialog v-model="visible" fullscreen title="全屏">
    <view>全屏内容</view>
  </lh-dialog>
</template>
```

底部弹层会自动带 `env(safe-area-inset-bottom)` 适配全面屏。

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue (v-model) | 是否显示 | `boolean` | `false` |
| title | 标题 | `string` | — |
| width | 宽度 | `string \| number` | — |
| top | 顶部距离 | `string \| number` | — |
| fullscreen | 全屏 | `boolean` | `false` |
| position | 定位 | `'center' \| 'top' \| 'bottom'` | `'center'` |
| closeOnClickModal | 点击遮罩关闭 | `boolean` | `true` |
| closeOnPressEscape | Esc 关闭（**MP 无键盘事件，无效**） | `boolean` | `true` |
| lockScroll | 锁定背景滚动（**仅 H5 有效**） | `boolean` | `true` |
| zIndex | 层级；不传时自增分配 | `number` | — |
| customClass | 自定义类名 | `string` | — |
| themeVars | 组件级主题变量 | `Record<string, string>` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## Slots

| 插槽 | 说明 |
| --- | --- |
| default | 内容 |
| footer | 底部按钮区 |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 显隐变化 | `(visible: boolean)` |
| open | 打开 | — |
| close | 关闭 | — |

::: tip 与 Vue3 版的差异
- 弹层挂载走 `root-portal`（H5 是 teleport，MP 是 root-portal 或页内 fixed 降级）。
- **focus-trap 在 MP 端不可用**：由 `LH_IS_H5` 编译期守卫直接返回 false，不调用 focus-trap。
- **lockScroll 在 MP 端无效**：小程序无 body 滚动锁定，由遮罩拦截点击兜底。
- `closeOnPressEscape` 在 MP 端无效（无键盘事件）。
:::
