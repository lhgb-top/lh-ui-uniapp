---
'@lh-ui/uniapp': minor
---

# 新增 Dropdown 下拉菜单（父子组件）

- 新增 `lh-dropdown` + `lh-dropdown-item` 父子组件（easycom 自动引入），API 与 plus 仓真源
  完全一致：`trigger`（hover / click / contextmenu）、`placement`（12 方位，默认
  `bottom-start`）、`visible`（v-model:visible 受控，含 vnode props 受控判定）、`disabled`、
  `hide-on-click`、`popper-class`、`max-height`、`theme-vars` / `bg-pattern` / `sx`；
  菜单项走 `#dropdown` 具名插槽 + `lh-dropdown-item`（`command` / `disabled` / `divided`），
  点击后父级以 `command` 事件抛出；`update:visible` / `visible-change` 双事件，
  defineExpose 暴露 `show` / `hide` / `toggle`。未新增 plus 没有的 API（`teleportTarget`
  按 select / tooltip 先例不实现，见平台差异）。
- 纯逻辑全部复用 `@lh-ui/share` core：`getDropdownClass` / `getDropdownItemClass` /
  `getDropdownMenuStyle` / `getDropdownTriggerAria` / `getDropdownMenuAria` /
  `getDropdownItemAria` / `LH_DROPDOWN_PLACEMENT_DEFAULT` 与键盘常量 `LH_KEYS` /
  `isEscapeKey` / `focusFirst` / `sxToStyle`，仓内不持有任何 core / 文案副本。
- 弹层走已跑通的 root-portal + adapter/popper 两帧度量范式（measure → 定位 → 显示，
  防闪烁），定位修饰类跟随 `computePosition` 的实际落位（主轴溢出自动翻转、交叉轴夹回）。
- 平台差异（已登记进组件文档「平台差异」小节）：MP 端无 hover —— `trigger="hover"`
  降级为点击 / 触摸切换，`trigger="contextmenu"` 由长按 longpress 承载（H5 亦走长按，
  不阻止默认右键菜单）；键盘导航（方向键循环 / Home / End / Enter / Space / Esc 归还焦点）
  仅 H5，Esc 走文档级监听 + overlay 顺序栈只关栈顶，MP 包内整段条件编译裁剪；
  点击外部关闭由页内透明遮罩承载；进出过渡未实现（MP 端 Transition 不可靠，
  同 tooltip / select 先例）；触发器滚出视口不自动收起（plus 的 onScrollOut 未移植）。
- 子项 `lh-dropdown-item` 无独立样式源，复用 `lh-dropdown` 的净化产物
  （照 lh-breadcrumb-item / lh-skeleton-item 先例）；aria 属性包由 share 纯函数产出，
  按本仓约定逐键摊开绑定（MP 模板编译器不支持 `v-bind` 对象）。
- 配套：`src/pages/dropdown` demo 页（基础 / 触发方式 / 禁用项与分割线 / 位置与最大高度 /
  受控显隐）+ pages.json 路由 + 首页列表、`tests/components/dropdown.spec.ts`
  （显隐时序 / 定位与方位类 / command 与 hideOnClick / 禁用与分割线 / 遮罩关闭 /
  受控 visible / 长按触发 / hover 延迟与菜单保持 / 键盘导航 / Esc 栈顶 / expose
  等 16 用例）、registry 有序数组登记、文档 9 语种（zh-CN 真源 + 8 译本，含
  「平台差异」小节）+ `componentItems` 九语言 labels。
- 组件 `style.css` 为构建产物（`pnpm build:styles` 生成，未手写；share 的 dropdown
  scss 含 `:hover:not(同族修饰类)` / `:focus-visible` / prefers-reduced-motion，
  均在既有净化规则覆盖范围内）。
