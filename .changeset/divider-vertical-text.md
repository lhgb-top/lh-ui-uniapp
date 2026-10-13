---
'@lh-ui/uniapp': minor
---

# Divider 竖向支持文案

此前 `hasContent` 锁死为 `direction === 'horizontal' && !!slots.default`，导致 share 的
`needsAriaOrientation(direction, hasContent)` 要求的「有文案且竖向」恒不可达，
`aria-orientation="vertical"` 从未输出。本次放开横向门控：

- 竖向分割线传入默认插槽时渲染文案，升级为 `role="separator"` 并声明 `aria-orientation="vertical"`
  （横向是 separator 的默认方向，仍不声明）
- 竖向文案恒居中——`labelPosition` 是横向语义，不产出 `--label-*` 修饰类
- 竖向文案的纵向布局（线段排在文案上下）由 `@lh-ui/share` 的 scss 承载，经 build-styles
  净化进 `lh-divider/style.css`（复合类 + 伪元素 + 纵向渐变，WXSS 白名单内）
- 演示页补「垂直带文案」示例：竖向文案高度来自父级行的 `align-self: stretch`，
  需放在固定高度的 flex 行里线段才撑得开
- 文档页 tip「垂直方向不支持文案」整段改写为新行为

依赖 `@lh-ui/share` 的 divider scss 与 `getDividerClassNames` 同步改动（本地联动直接生效）。
