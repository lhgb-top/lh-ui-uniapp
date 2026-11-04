---
'@lh-ui/uniapp': minor
---

# 新增 Grid 栅格（Row / Col 24 列栅格）

- 新增 `lh-row` + `lh-col` 父子组件（easycom 直接写标签）：gutter（数字或
  `[横向, 纵向]`）、justify / align（两轴独立修饰类，align 的 center 为 middle 兼容别名）、
  wrap、span / offset / push / pull（映射到 `grid-column` 定位，起点钳制在 24 列坐标系内）、
  响应式 xs/sm/md/lg/xl 与 sizes 批量声明。
- 类名与定位算法全部由 `@lh-ui/share` core 纯函数（`getGridRowClassNames` /
  `getGridColClassNames` / `getColStyle` / `resolveResponsiveSize`）产出，仓内只写
  computed 胶水 + customClass/sx 透传；col 复用 row 的净化样式产物（照 lh-breadcrumb-item 先例）。
- 【uni-app 差异】`<div>` 换 `<view>`；断点来源换本仓 `useLhBreakpoint`——H5 走 matchMedia，
  小程序无 matchMedia 固定降级 xs（回退规则仍由 share core 决定），文档「平台差异」已登记。
- 配套：`src/pages/grid` demo 页（7 个 demo block）+ pages.json 路由 + 首页列表
  （demo-pages 守卫三向对齐）、`tests/components/grid.spec.ts` 13 用例、
  registry 有序数组登记、文档 9 语种（zh-CN 真源 + 8 译本）+ `componentItems` 九语言 labels。
