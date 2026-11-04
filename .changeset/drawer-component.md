---
'@lh-ui/uniapp': minor
---

# 新增 Drawer 抽屉（弹层组件）

- 新增 `lh-drawer` 弹层组件（easycom 自动引入），API 与 plus 仓真源完全一致：
  `v-model`（modelValue）、`direction`（right / left / top / bottom 四方向，默认 `right`）、
  `size`（数字 px / 字符串百分比，左右方向作用于宽度、上下方向作用于高度，默认 `30%`）、
  `title`、`maskClosable`（遮罩点击关闭，默认 true）、`showClose`、`lockScroll`（仅 H5）、
  `closeOnEsc`（仅 H5，默认 true）、`themeVars` / `bgPattern` / `sx`；插槽 default / header /
  footer，`open` / `close` 事件与 defineExpose 暴露的 `isVisible` / `open` / `close` 同 plus。
  未新增 plus 没有的行为 API（`teleportTarget` 按 select / tooltip / dropdown 先例不实现，
  见平台差异）。
- 纯逻辑全部复用 `@lh-ui/share` core：`getDrawerClass` / `getDrawerPanelStyle` /
  `canDrawerClose` / `getDrawerAria` / `LH_DRAWER_DIRECTION_DEFAULT` 与 `isEscapeKey`、
  `generateId`，文案走 share locales 的 `drawer.title` / `drawer.close`（九语言齐备，
  仓内不持有任何 core / 文案副本）；aria 属性包按本仓约定逐键摊开绑定
  （MP 模板编译器不支持 `v-bind` 对象）。
- 弹层走已跑通的 lh-root-portal 弹层范式（H5 teleport / 微信基础库 ≥2.25.2 走 root-portal、
  低版本降级页内 fixed），层级由 root-portal 自增 z-index 管理；遮罩点击 / Esc 与 Dialog /
  Tooltip / Dropdown 共用 overlay 顺序栈，只关栈顶。
- 进出过渡为本仓首个手工复刻 Vue Transition 类名时序的弹层组件：MP 端无 `<Transition>`
  组件且 transitionend 不可靠，起始态类隔帧移除驱动 CSS transition（遮罩淡入淡出 +
  面板按方向滑入滑出，复用 share 的 `lh-drawer-fade-*` 过渡类），用 setTimeout 对齐
  300ms SCSS 时长，双端表现一致（对齐 message / loading 的「CSS transition +
  setTimeout」既有约定）。
- 平台差异（已登记进组件文档「平台差异」小节）：root-portal 依赖微信基础库 ≥2.25.2、
  低版本降级页内 fixed；focus-trap 不接入（MP 无键盘焦点语义，对齐 dialog 先例整段
  编译期裁剪）；lockScroll / closeOnEsc 仅 H5；底部抽屉自动带
  `env(safe-area-inset-bottom)` 安全区（uni-app 端适配，share 无此端特化）。
- Esc 关闭照 dropdown 的安全写法：函数体双端存在（MP 构建后为空函数），文档级监听注册
  整段条件编译裁剪——避免 dialog logic 现存的「`#ifdef` 内函数声明被裁掉后返回对象
  引用悬空」隐患。
- 配套：`src/pages/drawer` demo 页（基础 / 四方向 / 自定义尺寸 / 行为开关）+ pages.json
  路由 + 首页列表、`tests/components/drawer.spec.ts`（开合时序与过渡类 / 四方向与尺寸
  归一化 / 遮罩与关闭按钮 / Esc 与 closeOnEsc / expose / aria / customClass 等 14 用例）、
  registry 有序数组登记、文档 9 语种（zh-CN 真源 + 8 译本，含「平台差异」小节）+
  `componentItems` 九语言 labels。
- 组件 `style.css` 为构建产物（`pnpm build:styles` 生成，未手写；share 的 drawer scss 含
  `:hover` / `:focus-visible` / prefers-reduced-motion，均在既有净化规则覆盖范围内）。
