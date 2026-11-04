---
'@lh-ui/uniapp': minor
---

# 新增 Transfer 穿梭框组件

- 新增 `lh-transfer` 组件：双栏列表 + 勾选移动，`v-model` 绑定左侧（源）键列表，
  `data` 全量数据（`LhTransferItem`：key / label / disabled），`disabled` 整体禁用，
  事件 update:modelValue / change（附带移动方向 left-to-right / right-to-left）。
  每侧面板顶部常驻搜索框（与 plus 一致，不可关闭），面板头部含全选框（半选态由
  indeterminate 承载）与「当前侧数量 / 全量数量」计数。
- 【移植决策】API 严格对齐 plus 真源（data / modelValue / disabled / sx 四个 props）。
  任务备注里提到的 titles / filterable / props（key/label/disabled 自定义字段名）/
  left-right-default-checked 在 plus 真源（`packages/components/transfer/src/types.ts`
  与 docs）中均不存在，按「plus 没有的不私自新增」原则未新增上述 props；
  搜索框沿用 plus 的常驻形态（无 filterable 开关），面板标题取 share locales 的
  transfer.sourceTitle / targetTitle 键（十语言齐备，本仓无需补键）。
- 【uni-app 差异】双列列表由 `<ul>` / `<li>` 换成 `<scroll-view scroll-y>` + `<view>`
  （MP 端 view 无可靠溢出滚动，列表样式仍取 share 的 `.lh-transfer-panel__list`）；
  全选框与列表项勾选框不用原生 checkbox（MP 样式不可控），改用本仓 `lh-checkbox`
  （view 自绘 + lh-icon，受控写入）；穿梭按钮是 uni 内置 `<button>`，两端通用；
  键盘导航（roving tabindex + 方向键列表内移动 / 跨面板跳焦 + Enter / Space 勾选 +
  Escape 重置）仅 H5，处理函数体由条件编译裁剪、函数本身双端存在，MP 包内无死代码。
- 配套：`src/pages/transfer` demo 页（基础用法 / 过滤（搜索）/ 禁用 / 空数据，
  未含「自定义渲染」——plus 真源无任何插槽与渲染函数，不在本端补）+ pages.json 路由 +
  首页列表（demo-pages 守卫三向对齐）、`tests/components/transfer.spec.ts`
  （14 例：双面板分区与计数、行点击勾选、勾选框 click.stop 单次切换、禁用项与
  全选跳过、半选态、搜索过滤与空态、双向穿梭与勾选集合清空、按钮禁用态、
  整体禁用、空数据、roving tabindex、键盘导航、禁用态键盘失效）、
  文档 9 语种（zh-CN 真源 + 8 译本，含「平台差异」：双列表 scroll-view、
  按钮穿梭全端可用、键盘导航仅 H5、勾选框自绘）+ `componentItems` 九语言 labels。
