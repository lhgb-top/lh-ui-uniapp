---
'@lh-ui/uniapp': minor
---

# 新增 Spinner 加载圈（P1 扩展组件）

- 新增 `lh-spinner` 组件（easycom 自动引入）：五种尺寸（mini / small / medium / large /
  x-large，直径由 share core 的 `LH_SPINNER_SIZE_PX` 统一映射）、`color` 自定义颜色
  （未传时继承 currentColor）。
- 类名与尺寸映射全部由 `@lh-ui/share` core 纯函数（`getSpinnerClassNames`）产出，
  仓内只写响应式胶水；无新增文案键（share locales 无 spinner 相关键）。
- 【平台差异】旋转动效为纯 CSS animation，全端可用：H5 端渲染 svg 描边环
  （`stroke-dasharray` 双动画，与 plus 同构）；小程序不支持 svg 模板标签，改用
  `view` + `border` 圆环（三边着色约四分之三弧、描边宽度按直径 10% 内联，最小 1px）。
- 配套：`src/pages/spinner` demo 页 + pages.json 路由 + 首页列表（demo-pages 守卫三向对齐）、
  `tests/components/spinner.spec.ts`、registry 有序数组登记、
  文档 9 语种（zh-CN 真源 + 8 译本，含「平台差异」小节）+ `componentItems` 九语言 labels。
- 顺带补 `componentItems` 遗漏的 `descriptions` 侧边栏条目（此前 descriptions 文档九语种
  齐备但未挂侧边栏），并补齐 fr / ru 两语的 descriptions 文档。
- 组件 `style.css` 为构建产物（`pnpm build:styles` 生成，未手写）；小程序端圆环样式为
  SFC 内联（不进净化产物，同 lh-empty 先例）。
