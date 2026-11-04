# Dropdown 下拉菜单

向下弹出的命令菜单。触发器可以是任意元素，菜单项通过 `command` 标识，点击后以 `command` 事件抛出。

## 基础用法

```vue
<template>
  <lh-dropdown @command="onCommand">
    <lh-button>{{ selectedLabel || '更多操作' }} ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="new">新建</lh-dropdown-item>
      <lh-dropdown-item command="edit">编辑</lh-dropdown-item>
      <lh-dropdown-item command="delete">删除</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const lastCommand = ref('')
// 触发器文本由使用者维护：command 事件只抛出命令值，标签怎么显示交给外部决定
const labelMap: Record<string, string> = { new: '新建', edit: '编辑', delete: '删除' }
const selectedLabel = ref('')
function onCommand(command: string | number | undefined) {
  lastCommand.value = String(command)
  selectedLabel.value = labelMap[String(command)] ?? String(command)
}
</script>
```

## 触发方式

默认为 `click`，也可改为悬停或长按展开。

```vue
<template>
  <!-- 悬停触发（仅 H5 生效，小程序端降级为点击切换） -->
  <lh-dropdown trigger="hover" @command="onHoverCommand">
    <lh-button>悬停触发 ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="ink">水墨</lh-dropdown-item>
      <lh-dropdown-item command="danqing">丹青</lh-dropdown-item>
    </template>
  </lh-dropdown>

  <!-- 右键 / 长按触发 -->
  <lh-dropdown trigger="contextmenu" @command="onContextCommand">
    <lh-button>长按触发 ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="refresh">刷新</lh-dropdown-item>
      <lh-dropdown-item command="copy">复制</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>
```

## 禁用与分割线

```vue
<template>
  <!-- 带禁用项与分割线的操作菜单 -->
  <lh-dropdown @command="onActionCommand">
    <lh-button>操作 ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="export">导出</lh-dropdown-item>
      <lh-dropdown-item command="import">导入</lh-dropdown-item>
      <lh-dropdown-item divided command="audit">审计日志</lh-dropdown-item>
      <lh-dropdown-item disabled command="purge">清空数据</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>
```

> 禁用项带 `aria-disabled="true"`，屏幕阅读器能读出该项；但方向键会跳过它，点击与 Enter/Space 均不触发 `command`。

## 位置与最大高度

```vue
<template>
  <!-- 底部右对齐并限制最大高度（超出滚动） -->
  <lh-dropdown placement="bottom-end" :max-height="160" @command="onItemCommand">
    <lh-button>底部右对齐 ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item v-for="i in 12" :key="i" :command="i">第 {{ i }} 项</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>
```

## 受控显隐与点击行为

`v-model:visible` 手动控制显隐；`hide-on-click` 控制选中后是否自动收起；`popper-class` 给弹出层加自定义类。

```vue
<template>
  <!-- 受控显隐：选中后不收起 -->
  <lh-dropdown v-model:visible="menuVisible" :hide-on-click="false" popper-class="demo-menu">
    <lh-button>{{ menuVisible ? '收起' : '展开' }} ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="copy">复制（选中后不收起）</lh-dropdown-item>
      <lh-dropdown-item command="paste">粘贴</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const menuVisible = ref(false)
</script>
```

## Dropdown API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| trigger | 触发方式：`click`（全端）/ `hover`（仅 H5，MP 降级为点击）/ `contextmenu`（长按承载） | `'hover' \| 'click' \| 'contextmenu'` | `'click'` |
| placement | 展示位置（12 种方位） | `LhDropdownPlacement` | `'bottom-start'` |
| visible | 显隐状态（v-model:visible） | `boolean` | — |
| disabled | 是否禁用触发器 | `boolean` | `false` |
| hideOnClick | 点击菜单项后是否自动关闭 | `boolean` | `true` |
| popperClass | 弹出层自定义类名 | `string` | — |
| maxHeight | 菜单最大高度（数字为 px） | `string \| number` | — |
| themeVars | 组件级主题变量 | `Record<string, string>` | — |
| bgPattern | 组件级背景花纹，覆盖 ConfigProvider 配置 | `string` | — |
| sx | sx 快速布局属性（作用于触发器根元素） | `LhSxProps` | — |

### Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| command | 点击菜单项时触发 | `(command: string \| number \| undefined)` |
| visible-change | 显隐变化 | `(value: boolean)` |
| update:visible | 显隐变化（v-model） | `(value: boolean)` |

### Slots

| 插槽 | 说明 |
| --- | --- |
| default | 触发器内容 |
| dropdown | 菜单内容（`LhDropdownItem` 列表） |

### Methods

| 方法 | 说明 |
| --- | --- |
| show | 编程式展开 |
| hide | 编程式收起 |
| toggle | 编程式切换 |

## DropdownItem API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| command | 命令标识，点击时随 `command` 事件抛出 | `string \| number` | — |
| disabled | 是否禁用 | `boolean` | `false` |
| divided | 是否在上方显示分割线 | `boolean` | `false` |

### Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| click | 菜单项被点击时触发（禁用项不触发） | `(command: string \| number \| undefined)` |

### 无障碍

- 触发器带 `aria-haspopup="menu"` 与 `aria-expanded` / `aria-controls`；菜单为 `role="menu"`，项为 `role="menuitem"`
- 键盘遵循 APG menu 模式（仅 H5）：↑/↓ 循环（跳过禁用项）、Home/End 跳首尾、Enter/Space 触发 `command` 并关闭、Esc 关闭并归还焦点
- 菜单展开时主轴溢出会自动翻转方向，交叉轴溢出会夹回视口

::: tip 平台差异（与 Vue3 版的差异）
- **触发方式**：小程序无 hover 语义，`trigger="hover"` 在 MP 端降级为点击 / 触摸切换；无右键语义，`trigger="contextmenu"` 由长按（`longpress`）承载（H5 亦走长按，不阻止浏览器默认右键菜单，plus 会 `preventDefault`）。
- **弹层承载与定位**：无 `teleportTarget` prop——小程序无 DOM teleport，弹层统一由 `root-portal`（低版本页内 fixed 兜底）承载；定位走两帧异步度量（先隐藏渲染量尺寸 → `computePosition` 定位 → 显示，防闪烁），定位计算是异步的，不能假设同步拿到结果。
- **键盘导航仅 H5**：方向键 / Home / End / Enter / Space / Esc 都只在 H5 端生效（Esc 走文档级监听、多弹层叠加时只关栈顶）；小程序无键盘事件，整段由条件编译裁剪。
- **点击外部关闭**由页内透明遮罩承载（等价 plus 的 document 级 click-outside 监听）。
- **进出过渡未实现**：plus 用 `Transition` 淡入淡出，MP 端 `Transition` 不可靠，与 tooltip / select 一致不绑过渡。
- **触发器滚出视口不自动收起**：plus 的 `useLhPopper` 有 scroll-out 回调，uni-app 无统一的滚动 / 尺寸变化监听通道，未移植。
:::
