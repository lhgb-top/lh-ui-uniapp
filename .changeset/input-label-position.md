---
'@lh-ui/uniapp': minor
---

# Input 首次真正渲染 label，新增 labelPosition / labelWidth

- **Input label 渲染修复**：`label` prop 此前只在类型里声明、组件未接线（从不渲染），本次首次真正渲染
  label——wrapper 内前置 `lh-input__label` 节点，类名与浮动判定由 `@lh-ui/share` core 纯函数产出。
- **Input 新增 prop**：`labelPosition`（`'float' | 'top' | 'left' | 'right' | 'bottom'`，默认 `'float'`
  浮动标签——聚焦/有值浮到左上缺口）与 `labelWidth`（仅 left / right 生效，数字按 px、字符串原样）。
  【uni-app 差异】float 的 size 档位垂直微调依赖 `:has`（WXSS 不支持），小程序端仅 medium 档精确、
  其余档位 label 垂直位置略偏；静态位置（top / left / right / bottom）全端可用；textarea + float
  已由内联样式兜底，全端可用。
- **Form labelPosition 扩为 `'left' | 'right' | 'top' | 'bottom'`**：left / right = 控件左侧标签的
  文字对齐（Element Plus 口径），top = 上方，bottom 为新增（控件下方）；位置类名与 share 样式源对齐
  （`lh-form-item--top` / `--bottom` / `--left` / `--right`）。
- 文档：input.md 新增「标签位置」小节（五档 vue 示例 + uni-app 差异提示）、Props 表补
  labelPosition / labelWidth 两行；form.md 更新 labelPosition 行并补类名对齐说明；9 语种
  （zh-CN + en/zh-TW/ja/ko/es/fr/ar/ru）同步。

依赖 `@lh-ui/share` 的 input label 类名/样式与 form 位置类名同步改动（本地联动直接生效）。
