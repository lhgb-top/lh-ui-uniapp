---
'@lh-ui/uniapp': minor
---

# 新增 Rate 评分

- 新增 `lh-rate` 组件：v-model 评分、`max` 星数上限（钳制 [0, max]）、`allow-half` 半星、
  `readonly` 只读（role=img + 星级 aria-label）、`show-score` / `score-template` 分数文本、
  `character` 自定义字符、`disabled` 整组禁用。
- 填充档位（full/half/empty）、钳制、步进与类名全部由 `@lh-ui/share` core 纯函数
  （`clampRate` / `getStarFill` / `stepRate` / `getRateClassNames` / `getRateAriaText`）产出，
  仓内只写 computed 胶水；分数文案走 share locales 的 `rate.stars`（九语言齐备）。
- 【uni-app 差异】星星载体 `<button>` 换 `<view role="radio">`（MP 的 button 无法 reset 默认样式），
  禁用由点击守卫 + `--disabled` 修饰类 + `aria-disabled` 表达；半星命中依赖 offsetX 仅 H5 生效，
  小程序点击退化整星；键盘步进仅 H5（方向键 / Home / End，步进算法复用 core 的 stepRate）。
- 配套：`src/pages/rate` demo 页（基础 / 半星 / 只读与分数 / 自定义 / 禁用）+ pages.json 路由 +
  首页列表（demo-pages 守卫三向对齐）、`tests/components/rate.spec.ts` 11 用例、
  registry 有序数组登记、文档 9 语种（zh-CN 真源 + 8 译本）+ `componentItems` 九语言 labels。
