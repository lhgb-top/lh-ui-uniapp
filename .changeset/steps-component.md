---
'@lh-ui/uniapp': minor
---

# 新增 Steps 步骤条（P1 扩展组件）

- 新增 `lh-steps` + `lh-step` 父子组件（easycom 自动引入）：`v-model:current` 当前步骤、
  `direction` 横纵向、`status` 整体状态覆盖、`clickable` 可点击导航（已完成 / 进行中步骤
  可点、等待中步骤不可点）、`icon` 自定义图标与图标插槽、标题 / 描述 prop 与插槽。
- 状态派生、类名与 aria 属性全部由 `@lh-ui/share` core 纯函数（`getStepStatus` /
  `getStepClassNames` / `getStepsLineLastIndices` / `getStepAria`）产出，仓内只写响应式
  胶水；无障碍名称走 share locales 的 `steps.step` / `steps.finish` / `steps.error`
  （九语言齐备，仓内不持有文案）。
- **连接线机制平台适配（已登记进 build-styles 与两处文档「平台差异」）**：share 源的连接线
  靠结构性 `:not(:last-child)` 只画非末项，WXSS 不支持 `:not()`，`scripts/build-styles.mjs`
  新增显式剥离规则（`:not(:last-child)` → 删除），末项 / 行末项的隐藏交给 `--line-last`
  类：横向经 `getLhRect` 适配层度量折行（H5 document 查询 / MP 异步 createSelectorQuery），
  纵向直接标记全局末项并由 `lh-steps` SFC 适配样式补一条 `::before` 隐藏规则。
- 配套：`src/pages/steps` demo 页 + pages.json 路由 + 首页列表（demo-pages 守卫三向对齐）、
  `tests/components/steps.spec.ts` 15 用例、registry 登记、文档 9 语种（zh-CN 真源 + 8 译本）+
  `componentItems` 九语言 labels + `docs/guide/differences.md` 平台差异登记。
