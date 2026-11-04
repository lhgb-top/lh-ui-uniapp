---
'@lh-ui/uniapp': minor
---

# 新增 Menu 导航菜单

- 新增 `lh-menu` / `lh-menu-item` / `lh-sub-menu` / `lh-menu-item-group` 组件：
  页面与功能导航菜单，支持竖向（默认）与横向两种布局，子菜单可递归嵌套；
  选中态由 `v-model` 承载，展开态可受控（`openeds`）也可非受控（`default-openeds`）。
- Props 概括：`modelValue` 当前激活项、`mode` 布局模式（horizontal / vertical）、
  `collapse` 竖向折叠为图标条、`defaultOpeneds` 默认展开（非受控）、`openeds` 受控展开、
  `uniqueOpened` 手风琴（同时只展开一个子菜单）；MenuItem 的 `index` 唯一标识与
  `disabled` 禁用（保留 aria-disabled 语义）、SubMenu 的 `title` 标题、
  MenuItemGroup 的 `title` 分组标题（仅视觉分组，不参与展开逻辑）；
  事件 select / open / close / update:modelValue / update:openeds，
  SubMenu 另有后代选中 select（路径含本级 index），MenuItem 另有 click。
- 【uni-app 差异】竖向模式（含子菜单内联展开、手风琴、受控 v-model / openeds）
  为纯 CSS + provide/inject 实现，H5 与微信小程序行为一致；
  横向模式超出容器时滚动由自身 `overflow-x` 承载（不套 `scroll-view`，
  避免内层 `uni-scroll-view-content` 破坏 share scss 的 flex 直系子结构）；
  横向 / 折叠模式的飞出面板由 plus 的 `<teleport to="body">` 改为 `lh-root-portal`
  承载（低版本页内 fixed 兜底），定位走两帧异步度量，嵌套层级从右侧飞出；
  hover 展开与键盘导航（APG menu 模式）仅 H5，由条件编译守卫不调用，MP 包无死代码；
  进出过渡未绑定（内联面板展开动画为纯 CSS grid-template-rows 0fr/1fr）。
- 配套：文档 9 语种（zh-CN 真源 + 8 译本）+ `componentItems` 九语言 labels。
