---
'@lh-ui/uniapp': minor
---

# 新增 TreeSelect 树形选择器组件

- 新增 `lh-tree-select` 组件：select 触发器 + 树面板，`v-model` 绑定值
  （单选 `string` / 多选 `string[]`），`data` 树数据（`LhTreeNode`：key / label /
  children / disabled / isLeaf），`multiple` 多选（显示勾选框、父子级联），
  `disabled` / `placeholder` / `customClass` / `themeVars` / `sx`，
  事件 update:modelValue / change。单选点节点即选中并关闭面板（非叶节点同时展开，
  expandOnClickNode 语义与 plus 一致）；多选点节点只展开，勾选走勾选框。
- 【移植决策】share core 没有 tree-select 模块，本端按 plus 的实现形态做胶水组合：
  面板内嵌本仓 `lh-tree`（同波交付），树的展开 / 选中 / 勾选级联全部由 lh-tree 消费
  `core/tree` 纯函数（flattenTree / toggleCheckKeys / getNodeCheckState 等），
  本组件零拷贝、不私自新增 plus 没有的能力；`teleported` prop（控制挂 body）
  在小程序无对应语义，未移植。
- 【uni-app 差异】弹层走 `lh-root-portal` + useLhPopper 两帧异步度量
  （先隐藏渲染量尺寸 → computePosition 定位 → 显示，防闪烁）；
  树面板包一层 `scroll-view`（MP 的 view 无可靠溢出滚动，最大高度与 share 的
  320px 对齐）；键盘导航 / 文档级 Escape 不启用（MP 无键盘事件），点击页内透明遮罩关闭；
  多选勾选态由 v-model 受控驱动（plus 未把 checked-keys 传给内嵌树，预设值不会回显到
  勾选框，本端修正该回显缺口，API 不变）。
- 配套：`src/pages/tree-select` demo 页（基础 / 多选级联 / 预设值回显 / 禁用 /
  自定义占位符 / 空数据）+ pages.json 路由 + 首页列表（demo-pages 守卫三向对齐）、
  `tests/components/tree-select.spec.ts`（11 例：渲染与开合、箭头展开与节点选中、
  非叶节点选中关闭、预设值回显、多选级联勾选 / 取消、禁用节点跳过、整体禁用、
  遮罩关闭、空数据文案、自定义占位符）、文档 9 语种（zh-CN 真源 + 8 译本，
  含「平台差异」与「与 Vue3 版的差异」：core 无 tree-select 模块、本端为
  tree + select 胶水组合）+ `componentItems` 九语言 labels。
