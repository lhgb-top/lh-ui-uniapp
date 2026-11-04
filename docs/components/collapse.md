# Collapse 折叠面板

折叠 / 展开内容区块，支持多面板并存与手风琴（同时只展开一项）模式。

## 基础用法

不传 `v-model` 即非受控：组件自管展开态，点击标题栏切换，`change` 事件携带最新展开面板。

```vue
<template>
  <lh-collapse>
    <lh-collapse-item
      name="a"
      title="一致性和多样性"
    >
      与页面整体保持一致的视觉与交互。
    </lh-collapse-item>
    <lh-collapse-item
      name="b"
      title="反馈"
    >
      操作后给予清晰及时的状态反馈。
    </lh-collapse-item>
  </lh-collapse>
</template>
```

## 手风琴

`accordion` 模式下同时最多展开一项，再次点击已开面板允许全部收起。

```vue
<template>
  <lh-collapse accordion>
    <lh-collapse-item
      name="a"
      title="只开一个"
    >
      同时最多展开一项。
    </lh-collapse-item>
    <lh-collapse-item
      name="b"
      title="再次点击收起"
    >
      允许全部收起。
    </lh-collapse-item>
  </lh-collapse>
</template>
```

## 受控 v-model 与禁用项

`v-model` 绑定展开面板（单值或数组；手风琴模式下常传单值）；`disabled` 禁用单个面板。

```vue
<template>
  <lh-collapse v-model="activeNames">
    <lh-collapse-item
      name="a"
      title="面板 A"
    >
      受控内容 A
    </lh-collapse-item>
    <lh-collapse-item
      name="b"
      title="面板 B（禁用）"
      disabled
    >
      禁用内容
    </lh-collapse-item>
    <lh-collapse-item
      name="c"
      title="面板 C"
    >
      受控内容 C
    </lh-collapse-item>
  </lh-collapse>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const activeNames = ref(['a'])
</script>
```

## Collapse Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 当前激活的面板（受控 v-model，单值或数组） | `LhCollapseKey \| LhCollapseKey[]` | — |
| accordion | 手风琴模式：同时只展开一个 | `boolean` | `false` |
| customClass | 自定义类名（透传到根节点） | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## CollapseItem Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 面板唯一标识（必填） | `string \| number` | — |
| title | 标题（也可用 title 插槽） | `string` | — |
| disabled | 是否禁用 | `boolean` | `false` |
| customClass | 自定义类名（透传到项根节点） | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 展开面板变化（受控 v-model，组件不落内部状态） | `(value: LhCollapseKey \| LhCollapseKey[])` |
| change | 展开面板变化（非受控；accordion 下为单值，全收起时为 `undefined`） | `(value: LhCollapseKey \| LhCollapseKey[])` |

## Slots

| 插槽 | 说明 |
| --- | --- |
| Collapse default | 面板项节点（`lh-collapse-item`） |
| CollapseItem default | 面板内容 |
| CollapseItem title | 面板标题（覆盖 `title` prop） |

## 平台差异

- **展开 / 收起动画为纯 CSS**（`grid-template-rows` 在 `0fr / 1fr` 间过渡 + 箭头 `transform` 旋转），整个过程不监听 `transitionend`（微信小程序端该事件不可靠，本仓统一不依赖它）。类名切换即落位：即使个别 MP 渲染内核对 grid 过渡支持不全，最终展开态仍然正确，只是没有过渡过程。
- **内容区始终渲染**（不做 `v-if` 直切）：`lh-collapse__wrap` 由 `--active` 类切换显示，若后续有「展开时才渲染内容」的需求，由使用方在内容侧用 `v-if` 自行控制。
- `<h3>` / `<button>` 全部换成 `<view>` / `<text>`（WXSS 禁标签选择器）；禁用不再依赖原生 `<button disabled>`，改由点击守卫 + `--disabled` 类名 + `aria-disabled` 表达。
- 无障碍语义两端均输出：标题 `role="button"` + `aria-expanded` / `aria-controls`，内容区 `role="region"` + `aria-labelledby`；MP 读屏支持以平台能力为准。H5 端标题天然支持 Enter / Space（聚焦在可点击节点上）。
- 头 / 内容关联 `id` 由 `generateId` 生成本地唯一值（不用 Vue 3.5 的 `useId`，兼容 uni-app 各端内核版本），一页多个折叠面板不会冲突。
- **移植决策（与 Vue3 版对齐，未引入未定义 API）**：本次移植严格对齐 plus 真源，仅提供 `v-model`（单值 / 数组）、`accordion`、面板 `name` / `title` / `disabled` 与 `title` 插槽；真源未提供的嵌套折叠、图标插槽、懒渲染等一律不私自新增，后续真源补齐后跟随升级。
- 本仓胶水层另有一处受控取值修正（登记在 changeset）：受控时展开态改为 computed 订阅 `props.modelValue`，父组件异步更新 v-model 时面板能立即跟随，core 纯函数与 props 契约与 plus 完全一致。
