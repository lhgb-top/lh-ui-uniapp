# Tabs 标签页

在同一区块内切换不同页签的内容，页签头支持横向滚动、卡片外观与可关闭新增。

## 基础用法

`v-model` 绑定激活页签的 `name`；未传时默认激活首个可用页签。

```vue
<template>
  <lh-tabs v-model="active">
    <lh-tab-pane
      name="ink"
      label="水墨"
    >
      水墨：焦、浓、重、淡、清。
    </lh-tab-pane>
    <lh-tab-pane
      name="danqing"
      label="丹青"
    >
      丹青：丹砂与青雘，指代绘画。
    </lh-tab-pane>
    <lh-tab-pane
      name="liubai"
      label="留白"
    >
      留白：计白当黑，气韵生动。
    </lh-tab-pane>
  </lh-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref('ink')
</script>
```

## 卡片式

`type="card"` 切换为卡片外观。

```vue
<template>
  <lh-tabs
    v-model="active"
    type="card"
  >
    <lh-tab-pane
      name="spring"
      label="春"
    >
      春：草木萌动。
    </lh-tab-pane>
    <lh-tab-pane
      name="summer"
      label="夏"
    >
      夏：万物华实。
    </lh-tab-pane>
  </lh-tabs>
</template>
```

## 页签位置

`tab-position="bottom"` 让页签头置于内容区下方。

```vue
<template>
  <lh-tabs
    v-model="active"
    tab-position="bottom"
  >
    <lh-tab-pane
      name="poem"
      label="诗"
    >
      诗：言志。
    </lh-tab-pane>
    <lh-tab-pane
      name="painting"
      label="画"
    >
      画：写意。
    </lh-tab-pane>
  </lh-tabs>
</template>
```

## 禁用页签

给 `lh-tab-pane` 传 `disabled` 后该页签不可激活（点击无反应，`modelValue` 指向它时回退到首个可用页签）。

```vue
<template>
  <lh-tabs v-model="active">
    <lh-tab-pane
      name="first"
      label="可用"
    >
      第一个页签可用。
    </lh-tab-pane>
    <lh-tab-pane
      name="second"
      label="禁用"
      disabled
    >
      该页签被禁用，不可激活。
    </lh-tab-pane>
  </lh-tabs>
</template>
```

## 可关闭与新增

`closable` 让页签渲染关闭按钮（点击抛出 `tab-remove`）；`addable` 渲染新增按钮（点击抛出 `tab-add`）。
组件只负责抛事件，页签节点的增删由业务层自行维护，与 Vue3 版一致。

```vue
<template>
  <lh-tabs
    v-model="active"
    closable
    addable
    @tab-remove="handleRemove"
    @tab-add="handleAdd"
  >
    <lh-tab-pane
      v-for="pane in panes"
      :key="pane.name"
      :name="pane.name"
      :label="pane.label"
    >
      {{ pane.label }}：页签内容。
    </lh-tab-pane>
  </lh-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref('one')
const panes = ref([
  { name: 'one', label: '标签一' },
  { name: 'two', label: '标签二' },
])

function handleRemove(name: string) {
  panes.value = panes.value.filter((pane) => pane.name !== name)
}

function handleAdd() {
  panes.value.push({ name: `new-${panes.value.length + 1}`, label: '新标签' })
}
</script>
```

## Tabs Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 当前激活页签的 name（v-model） | `string` | — |
| type | 外观：`'line'` 线条 / `'card'` 卡片 | `'line' \| 'card'` | `'line'` |
| closable | 页签是否可关闭 | `boolean` | `false` |
| addable | 是否显示新增按钮 | `boolean` | `false` |
| tabPosition | 页签位置：`'top'` / `'bottom'` | `'top' \| 'bottom'` | `'top'` |
| customClass | 自定义类名 | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## TabPane Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 页签唯一标识（作为稳定键，不建议动态修改） | `string` | — |
| label | 页签标题 | `string` | `''` |
| disabled | 是否禁用 | `boolean` | `false` |
| customClass | 自定义类名（透传到面板根节点） | `string` | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 激活页签变化（v-model） | `(name: string)` |
| tab-change | 激活页签变化（用户交互切换） | `(name: string)` |
| tab-remove | 关闭页签按钮被点击；组件本身不移除子节点，由业务层维护 | `(name: string)` |
| tab-add | 新增按钮被点击；组件本身不新增子节点，由业务层维护 | — |

## Slots

| 插槽 | 说明 |
| --- | --- |
| Tabs default | 页签面板节点（只收集 `lh-tab-pane`，可包在 `v-for` / `template` 内） |
| TabPane default | 面板内容 |

## 平台差异

- 页签头由 `scroll-view` 承载（横向滚动导航栏）：微信小程序端加 `enable-flex` 让滚动容器成为 flex 布局，页签不收缩不换行；H5 端由类名 `display: flex` 生效。
- **选中态下划线为纯 CSS 过渡**（激活页签的 `::after` 墨线），不依赖 `transitionend`。若后续实现需要 JS 联动的滑动指示条：小程序端 `transitionend` 不可靠，动画收尾须用 `setTimeout` 对齐时长（与 message / loading 的进出动画同款处理）。
- **键盘导航（方向键 / Home / End / Delete 关闭）仅 H5**：小程序无键盘事件，由编译期常量守卫直接不进入导航分支，MP 包内无死代码；roving tabindex 的 `tabindex` 属性在 MP 端保留但无键盘语义。
- 无障碍 `role="tablist" / "tab" / "tabpanel"` 与 `aria-selected` / `aria-controls` / `aria-labelledby` 两端均输出；小程序读屏支持以平台能力为准。
- 页签与面板的 `id` 由实例唯一前缀生成（`generateId`），一页多 tabs 不会冲突。
- **移植决策（与 Vue3 版对齐，未引入未定义 API）**：本次移植时 plus 真源与 `@lh-ui/share` core 尚未提供 `lazy` 懒渲染、`before-leave` 离开拦截、`editable`（= closable + addable 的语义糖）与 `border-card` 外观，故本仓同样不提供；面板内容始终渲染，由 `v-show` 控制显隐。后续真源补齐后跟随升级。
