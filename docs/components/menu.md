# Menu 导航菜单

页面与功能导航菜单。支持竖向（默认）与横向两种布局模式，子菜单可递归嵌套；
选中态由 `v-model` 承载，展开态可受控（`openeds`）也可非受控（`default-openeds`）。

## 基础用法

```vue
<template>
  <lh-menu v-model="active">
    <lh-menu-item index="1">首页</lh-menu-item>
    <lh-menu-item index="2">作品</lh-menu-item>
    <lh-menu-item index="3">关于</lh-menu-item>
  </lh-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('1')
</script>
```

`index` 是项的唯一标识，点击叶子项时随 `select` 事件抛出（`update:modelValue` 同步抛出，可用 `v-model` 接收）。

## 子菜单与默认展开

```vue
<template>
  <lh-menu v-model="active" :default-openeds="['2']" @select="onSelect">
    <lh-menu-item index="1">首页</lh-menu-item>
    <lh-sub-menu index="2" title="我的创作">
      <lh-menu-item index="2-1">水墨画</lh-menu-item>
      <lh-menu-item index="2-2">工笔画</lh-menu-item>
    </lh-sub-menu>
  </lh-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('')
function onSelect(index: string, indexPath: string[]) {
  console.log(index, indexPath)
}
</script>
```

嵌套子菜单可递归多层：`select` 事件的 `indexPath` 是从最外层子菜单到被选项的完整路径（如 `['2', '2-1', '2-1-1']`）。

## 手风琴

`unique-opened` 让同一时间最多展开一个子菜单（再次点击已展开的标题会收起，允许全部收起）。

```vue
<template>
  <lh-menu v-model="active" unique-opened>
    <lh-sub-menu index="1" title="第一组">
      <lh-menu-item index="1-1">选项 1-1</lh-menu-item>
    </lh-sub-menu>
    <lh-sub-menu index="2" title="第二组">
      <lh-menu-item index="2-1">选项 2-1</lh-menu-item>
    </lh-sub-menu>
  </lh-menu>
</template>
```

## 受控展开

传 `openeds` 即为受控模式：组件内部不再自行维护展开态，由 `update:openeds` 事件回调驱动。

```vue
<template>
  <lh-menu v-model="active" :openeds="openeds" @update:openeds="openeds = $event">
    <lh-sub-menu index="1" title="受控子菜单">
      <lh-menu-item index="1-1">选项 1-1</lh-menu-item>
    </lh-sub-menu>
  </lh-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('')
const openeds = ref<string[]>(['1'])
</script>
```

## 分组

`lh-menu-item-group` 把同类项归组（仅视觉分组，不参与展开逻辑）。

```vue
<template>
  <lh-menu v-model="active">
    <lh-menu-item-group title="基础内容">
      <lh-menu-item index="1">文章</lh-menu-item>
      <lh-menu-item index="2">图片</lh-menu-item>
    </lh-menu-item-group>
    <lh-menu-item-group title="高级功能">
      <lh-menu-item index="3">数据分析</lh-menu-item>
    </lh-menu-item-group>
  </lh-menu>
</template>
```

## 横向模式

```vue
<template>
  <lh-menu v-model="active" mode="horizontal">
    <lh-menu-item index="1">首页</lh-menu-item>
    <lh-sub-menu index="2" title="作品集">
      <lh-menu-item index="2-1">水墨画</lh-menu-item>
      <lh-menu-item index="2-2">工笔画</lh-menu-item>
    </lh-sub-menu>
    <lh-menu-item index="3">关于</lh-menu-item>
  </lh-menu>
</template>
```

横向模式下子菜单从标题下方飞出（`bottom-start`），嵌套层级的子菜单从右侧飞出（`right-start`）。

## 折叠模式

竖向模式搭配 `collapse` 收起为窄条，此时子菜单改为右侧飞出面板。

```vue
<template>
  <lh-menu v-model="active" collapse>
    <lh-sub-menu index="1" title="收发">
      <lh-menu-item index="1-1">收件箱</lh-menu-item>
      <lh-menu-item index="1-2">已发送</lh-menu-item>
    </lh-sub-menu>
    <lh-menu-item index="2">草稿</lh-menu-item>
  </lh-menu>
</template>
```

## Menu API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 当前激活项（v-model；未传时组件内部维护） | `string` | — |
| mode | 布局模式 | `'horizontal' \| 'vertical'` | `'vertical'` |
| collapse | 垂直模式折叠为图标条（子菜单改为飞出面板） | `boolean` | `false` |
| defaultOpeneds | 默认展开的子菜单键（非受控） | `string[]` | `[]` |
| openeds | 受控展开的子菜单键 | `string[]` | — |
| uniqueOpened | 手风琴：同时只展开一个子菜单 | `boolean` | `false` |
| sx | sx 快速布局属性 | `LhSxProps` | — |

### Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| select | 选中叶子项时触发 | `(index: string, indexPath: string[])` |
| open | 子菜单展开时触发 | `(index: string, indexPath: string[])` |
| close | 子菜单收起时触发 | `(index: string, indexPath: string[])` |
| update:modelValue | 激活项变化（v-model） | `(value: string)` |
| update:openeds | 展开集合变化 | `(value: string[])` |

### Slots

| 插槽 | 说明 |
| --- | --- |
| default | 菜单内容（`LhMenuItem` / `LhSubMenu` / `LhMenuItemGroup` 组合） |

## MenuItem API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| index | 唯一标识（必填） | `string` | — |
| disabled | 是否禁用（保留 aria-disabled 语义，点击与键盘激活均不触发） | `boolean` | `false` |
| sx | sx 快速布局属性 | `LhSxProps` | — |

### Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| click | 叶子项被点击时触发（禁用项不触发） | `(index: string)` |

## SubMenu API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| index | 唯一标识（必填） | `string` | — |
| title | 标题（也可用 title 插槽） | `string` | — |
| disabled | 是否禁用 | `boolean` | `false` |
| sx | sx 快速布局属性 | `LhSxProps` | — |

### Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| select | 后代叶子项被选中时触发（路径含本级 index） | `(index: string, indexPath: string[])` |

### Slots

| 插槽 | 说明 |
| --- | --- |
| default | 子菜单内容（可继续嵌套 `LhMenuItem` / `LhSubMenu`） |
| title | 自定义标题内容 |

## MenuItemGroup API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 分组标题（也可用 title 插槽） | `string` | — |
| sx | sx 快速布局属性 | `LhSxProps` | — |

### Slots

| 插槽 | 说明 |
| --- | --- |
| default | 分组内容 |
| title | 自定义分组标题 |

### 无障碍

- 容器为 `role="menu"`（横向模式 `role="menubar"`）；叶子项与子菜单标题为 `role="menuitem"`，禁用项输出 `aria-disabled`，子菜单标题另带 `aria-expanded` / `aria-haspopup` / `aria-controls`
- 键盘遵循 APG menu 模式（仅 H5）：竖向模式 ↑/↓ 在可见项间循环（跳过禁用项与收起面板内的项）、Home/End 跳首尾；叶子项 Enter/Space 激活；子菜单标题 Enter/Space/→ 展开并把焦点移入面板，←/Esc 收起
- 水平模式标题的 ←/→ 语义保留给各标题自身，根容器不接管方向键

::: tip 平台差异（与 Vue3 版的差异）
- **竖向与手风琴全端可用**：竖向模式（含子菜单内联展开、手风琴、受控 v-model / openeds）为纯 CSS + provide/inject 实现，H5 与微信小程序行为一致。
- **横向滚动**：横向模式项目总宽超出容器时，滚动由容器自身的 `overflow-x` 承载（WXSS 下 view 支持溢出滚动），不套 `scroll-view`——后者在 H5 端会把插槽内容包进内层 `uni-scroll-view-content`，破坏 share scss 的 flex 直系子结构（与 lh-tabs 的横向头不同，menu 项是块级 flex，无法像页签那样靠 inline-flex 规避）。
- **弹层子菜单走 root-portal**：横向 / 折叠模式的飞出面板由 plus 的 `<teleport to="body">` 改为 `lh-root-portal` 承载（低版本基础库页内 fixed 兜底）；定位走两帧异步度量（先隐藏渲染量尺寸 → `computePosition` 定位 → 显示，防闪烁），定位计算是异步的，不能假设同步拿到结果；嵌套层级从右侧飞出（`right-start`）。
- **hover 仅 H5**：标题悬停展开只在 H5 生效；小程序无 hover 语义，飞出面板的打开 / 收起均由标题点击承载，点击外部区域由页内透明遮罩收起（等价 plus 的 mouseleave 收起语义）。
- **键盘导航仅 H5**：↑/↓ / Home / End / Enter / Space / ←/→ / Esc 只在 H5 端生效；小程序无键盘事件，整段由条件编译裁剪（MP 包内无死代码）。
- **进出过渡未实现**：plus 用 `Transition` 淡入淡出，MP 端 `Transition` 不可靠，与 tooltip / select 等一致不绑过渡；内联面板展开动画为纯 CSS（grid-template-rows 0fr/1fr），不监听 transitionend（MP 不可靠），即使 MP 端过渡不支持最终态仍然正确。
:::
