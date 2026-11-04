---
'@lh-ui/uniapp': minor
---

# 新增 Alert 警告（P1 扩展组件）

- 新增 `lh-alert` 组件（easycom 自动引入）：四种语义类型（info / success / warning / danger）、
  title 属性 + title 插槽、默认插槽描述、`show-icon` 语义图标、`closable` 关闭（close 事件）、
  `plain` 朴素样式、`close-label` 自定义无障碍名称。
- 类名 / 无障碍角色 / 图标名全部由 `@lh-ui/share` core 纯函数（`getAlertClassNames` /
  `getAlertRole` / `getAlertIconName`）产出，仓内只写响应式胶水；关闭按钮无障碍名称走
  share locales 的 `alert.close`（九语言齐备，仓内不持有文案）。
- 平台差异（已登记进组件文档「平台差异」）：标签换 `view`（WXSS 禁标签选择器）、
  图标与关闭叉号统一用 `lh-icon`（小程序不支持 svg）、关闭按钮用 `view` + `role="button"`；
  纯展示组件、无度量 / 无弹层 / 无 document 依赖，H5 与微信小程序表现一致。
- 配套：`src/pages/alert` demo 页 + pages.json 路由 + 首页列表（demo-pages 守卫三向对齐）、
  `tests/components/alert.spec.ts` 14 用例、registry 登记、文档 9 语种（zh-CN 真源 + 8 译本）+
  `componentItems` 九语言 labels。
