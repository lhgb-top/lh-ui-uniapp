---
'@lh-ui/uniapp': minor
---

# 新增 Tree 树形控件

- 新增 `lh-tree` 组件：树形数据的展示与交互，propsdata、show-checkbox、multiple、
  expand-on-click-node、default/受控 expanded-keys、selected-keys、checked-keys、
  check-strictly、lazy + load、disabled、sx，事件 update:expandedKeys /
  update:selectedKeys / update:checkedKeys / select / check / expand / nodeLoad，
  node / empty 具名插槽（node 插槽接收 `{ node, level, expanded, selected }`）。
  特性范围与 plus 真源 `packages/components/tree/` 严格对齐，不私自新增
  （plus 无 filter / props 字段别名配置，本仓同样不提供）。
- 展开收起、复选框级联（全选回溯祖先、部分选中半选、跳过禁用子树）、懒加载不可变合并、
  扁平化与键盘焦点移动全部消费 `@lh-ui/share` core 纯函数
  （flattenTree / toggleCheckKeys / getNodeCheckState / mergeLoadedChildren /
  isNodeLoadable / moveTreeFocus / getTreeClassNames / getTreeNodeClassNames），零拷贝；
  空态文案走 share locales 的 `tree.empty` 键，九语言齐备，本仓无需补键。
- 【uni-app 差异·虚拟化（本仓独有）】大数据量（成百上千节点）场景新增 `virtual` /
  `virtualHeight` 两个 uni-app 独有 props：开启后节点列表由 `scroll-view` 承载，
  按固定行高 34px（对齐 `--lh-tree-node-height` 默认值）开窗渲染（可见区 + 上下缓冲 4 行），
  等高骨架 + padding-top 偏移保持滚动位置一致；键盘导航把焦点节点滚出可视区时还会
  锚定 scroll-top。要求节点内容单行不换行（share scss 的 `.lh-tree-node__label` 已强制
  nowrap + 省略号）。
- 【uni-app 差异·键盘导航仅 H5】APG tree 模式键盘导航（↑/↓ 项间移动跳过禁用、
  → 展开或进首子、← 收起或回父级、Home/End 首末、Enter/Space 激活，roving tabindex）
  由条件编译守卫，处理函数体双端存在、MP 端裁剪为空体（MP 包无死代码）；
  焦点 DOM 查询限定在组件根内（`data-tree-key`），同页多棵树互不串扰。
- 【uni-app 差异·结构】plus 的 `<div>` / `<span>` 全部换成 `<view>` / `<text>`；
  层级缩进行内样式统一用物理 `padding-left`（与仓内「MP 端固定 LTR」既有决策一致，
  不走 WXSS 支持不稳的逻辑属性）；展开箭头为字符 `▸` 承载在 `view` 上
  （旋转 / 懒加载旋转由 CSS 变换承载），不依赖图标字体。
- 配套：`src/pages/tree` demo 页（基础 / 复选级联 / checkStrictly / 懒加载 /
  受控选中勾选 / 禁用 / node 插槽 / 虚拟化 / 空数据）+ pages.json 路由 +
  首页列表（demo-pages 守卫三向对齐）、`tests/components/tree.spec.ts`
  （共 18 例：渲染与层级缩进、展开收起与事件、选中 / 多选、级联与半选、checkStrictly、
  懒加载 resolve / reject、空态与插槽、aria 契约、roving tabindex、键盘导航、
  虚拟化开窗与滚动跟随、受控键值）、文档 9 语种（zh-CN 真源 + 8 译本，
  含「平台差异」一节）+ `componentItems` 九语言 labels。
