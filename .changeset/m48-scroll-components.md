---
'@lh-ui/uniapp': minor
---

# 补齐 M4.8 低可行 5 组件：Affix / BackTop / Anchor / VirtualList / Table（scroll-view 变体专项）

- 新增 5 个组件（easycom 自动引入，登记进 registry + 命名导出 + `registry.spec` 有序断言同步）：
  - `lh-affix`：吸顶 / 吸底，固定判定与样式走 share core（`isAffixFixed` / `getAffixFixedStyle`）。
  - `lh-backtop`：返回顶部，可见性走 share core（`isBackTopVisible`），阶段类过渡两端通用。
  - `lh-anchor`：锚点导航，扁平化与活动判定走 share core（`flattenAnchorItems` / `resolveActiveAnchor`）。
  - `lh-virtual-list`：定高 / 动态高度双模式（`computeVirtualRange` / `buildVirtualItems` + `findVirtualRange`），万条渲染。
  - `lh-table`：多级表头、排序、筛选、虚拟滚动、自定义单元格插槽、空态；列宽拖拽与固定列仅 H5。
- **scroll-view 变体（计划 M4.8 登记的「下轮专项」）**：新增 `src/adapter/scroll.ts`
  滚动适配层（订阅 / 回顶 / 滚到锚点的双端收口）。H5 走 DOM 监听与 scrollIntoView；
  MP 端滚动位置经 `scrollTop` prop 注入、滚动词走事件契约
  （`update:scrollTop` / `update:scrollIntoView` 绑到 scroll-view 属性）或
  `uni.pageScrollTo`。首个全组件双端 scroll-view 化的批次。
- 样式净化管线（`scripts/build-styles.mjs`）三条新登记：`:nth-*` 整规则 H5-only
  （table 斑马纹 MP 端由模板按行索引补 `--alt` 类 + SFC 内联兜底）、
  `position: sticky` 与固定列修饰类规则 H5-only（WXSS 对表格单元格 sticky 不可靠）、
  块轴 inset / 尺寸类逻辑属性降级映射（`border-block-*-color` / `inset-block` /
  `inline-size` / `min-inline-size` / `max-block-size` 等）。
  顺手修复预存 bug：头注释里的 `*/` 提前终结块注释导致 `pnpm build:styles` 语法错误。
- 配套：6 个演示页（5 组件 + 补齐唯一的无演示页登记组件 config-provider）+ pages.json +
  首页列表（demo-pages 守卫三向对齐）、5 份组件 spec（32 用例）+ `tests/unit/adapter.spec.ts`
  （adapter 层直测空档填补，15 用例：getRect / platform / scroll / lock-scroll）、
  文档 9 语种 × 5（zh 真源 + 8 译本）+ `componentItems` 九语言 labels。
- 测试基建：新增 `@vitest/coverage-v8` devDependency 支撑覆盖率报告。
