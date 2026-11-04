---
'@lh-ui/uniapp': minor
---

# 新增 Cascader 级联选择器

- 新增 `lh-cascader` 组件：多层级数据级联选择（如省市地区），点击触发器弹出多列面板，
  逐级展开子级，选中叶节点（或 `check-strictly` 下任意层级）完成选择。
- Props 概括：`modelValue`（`emitPath` 为 `false` 时仅末级值）、`options` 树形选项、
  `size` 尺寸、`disabled` 禁用整个选择器、`clearable` 可清除、`placeholder`
  （未传时取语言包 `cascader.placeholder`）、`readonly` 只读不弹层、
  `showAllLevels` 触发器是否显示完整路径、`checkStrictly` 任意层级可选、
  `emitPath` 返回值是否含完整路径、`multiple` 多选（绑定各选中路径末级值数组，
  `collapseTags` 折叠标签）、`cascading` 悬停级联展开、`separator` 路径分隔符、
  `filterable` 可搜索（无匹配时语言包 `cascader.noMatch`，可用 `no-match` 插槽自定义）、
  `itemConfig` 节点字段别名（`value` / `label` / `children` / `disabled` / `leaf`，
  异步 / 后端结构免手工转换），事件 update:modelValue / change，
  数据结构 `LhCascaderNode`。
- 级联展开 / 选中 / 过滤等纯逻辑全部消费 `@lh-ui/share` core 纯函数，零拷贝；
  触发器 aria 属性包由 share 的 `getCascaderTriggerAria` 产出，本仓逐键摊开绑定。
- 【uni-app 差异】面板由 plus 的 `Teleport to="body"` 改为 `lh-root-portal` 承载
  （低版本页内 fixed 兜底），定位走两帧异步度量（先隐藏渲染量尺寸 →
  `computePosition` 定位 → 显示，防闪烁），进出过渡未绑定；
  每列是独立纵向滚动的 `scroll-view`（MP 的 `view` 无可靠溢出滚动）；
  键盘导航（Enter/Space 开合、↑↓ 列内移动、←→ 跨列、Escape 关栈顶）
  与悬停级联展开仅 H5，由条件编译守卫不调用，MP 包无死代码；
  过滤输入框置于弹层内（与 select 同款）；点击外部关闭由页内透明遮罩承载。
- 配套：文档 9 语种（zh-CN 真源 + 8 译本）+ `componentItems` 九语言 labels。
