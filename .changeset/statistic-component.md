---
'@lh-ui/uniapp': minor
---

# 新增 Statistic 统计数值（P1 扩展）

- 新增 `lh-statistic` 组件（easycom 自动引入）：title 标题、value 数值、precision 小数精度、
  separator 千位分隔（空串关闭分组）、prefix / suffix 前后缀（含同名插槽）。
- 格式化逻辑由 `@lh-ui/share` core 纯函数（`formatStatisticValue`）产出，超大整数（超出
  `Number.MAX_SAFE_INTEGER`）走字符串路径不丢精度，非数值字符串按原文展示；仓内只写
  响应式胶水，不复制 core 实现，无新增文案键（share locales 无 statistic 相关键）。
- 配套：`src/pages/statistic` demo 页 + pages.json 路由 + 首页列表（demo-pages 守卫三向对齐）、
  `tests/components/statistic.spec.ts` 9 用例、registry 有序数组登记、
  文档 9 语种（zh-CN 真源 + 8 译本，含「平台差异」小节）+ `componentItems` 九语言 labels。
- 【平台差异】纯展示组件，全端可用，不触及平台 API；不含数字滚动动画（count-up），
  若后续引入须以 setTimeout 对齐时长（transitionend 在小程序不可靠）。
- 组件 `style.css` 为构建产物（`pnpm build:styles` 生成，未手写）。
