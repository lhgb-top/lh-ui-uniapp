---
'@lh-ui/uniapp': minor
---

# 新增 InputNumber 计数器

- 新增 `lh-input-number` 组件：v-model 计数、`min` / `max` 范围钳制、`step` 步长、
  `step-strictly` 严格步进（四舍五入吸附到 step 网格）、`precision` 精度、`disabled` 禁用、
  `controls` 加减按钮开关、`size` 尺寸、`name` 表单名。
- 归一化参数（stepStrictly 时 min 收敛到 step 网格等）、步进与提交钳制
  （precision → min/max → stepStrictly）全部由 `@lh-ui/share` core 纯函数
  （`incrementValue` / `decrementValue` / `clampValue` / `shouldDisableIncrement` /
  `shouldDisableDecrement` / `getInputNumberAria`）产出，仓内只写 computed 胶水；
  本组件不消费 locale 文案，`src/adapter/locale.ts` 无需补键。
- 【uni-app 差异】加减按钮由 view 自绘点击（MP 的 button 无法 reset 默认样式），全端可用；
  提交走「编辑草稿 + 失焦 / confirm 一次性提交」（uni input 无原生 change 事件，
  H5 回车与 MP 键盘「完成」统一触发 confirm，等价 plus 的 change 时机，同值去重——
  MP 端 confirm 后还会再触发一次 blur）；键盘上下键步进仅 H5（条件编译守卫）；
  plus 无长按连点，不私自新增。
- 配套：`src/pages/input-number` demo 页（基础 / 范围 / 步长与精度 / 尺寸与按钮 / 禁用）+
  pages.json 路由 + 首页列表、`tests/components/input-number.spec.ts` 19 用例、
  registry 有序数组登记、文档 9 语种（zh-CN 真源 + 8 译本）+ `componentItems` 九语言 labels。
