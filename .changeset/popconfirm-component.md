---
'@lh-ui/uniapp': minor
---

# 新增 Popconfirm 气泡确认框

- 新增 `lh-popconfirm` 组件：`title` / `description`（或 content 插槽）确认内容、
  `type` 三档语气图标（info / warning / danger 默认）、`placement` 12 方位、
  `trigger`（click 全端 / hover / focus 仅 H5、MP 降级点击切换 / manual 受控 v-model:visible）、
  `confirm-text` / `cancel-button-text` 文案覆盖、`disabled` / `show-icon` /
  `confirm-button-type`，事件 confirm / cancel / update:visible / show / hide，
  编程式 show / hide / toggle。
- 弹层走 `lh-root-portal` + 两帧异步度量（先隐藏量尺寸 → computePosition 定位 → 显示，
  防闪烁），定位/触发/类名/aria 全部由 `@lh-ui/share` core 纯函数产出，零拷贝；
  按钮文案走 share locales 的 `popconfirm.confirm` / `popconfirm.cancel`（九语言齐备）。
- 【uni-app 差异】MP 无 hover / focus 语义，降级为点击切换；`teleportTarget` 不支持
  （统一由 root-portal 承载）；Esc / focus-trap / 进出过渡 / scroll-out 收起仅 H5 或未移植，
  与 Dialog / Popover / Dropdown 同款；语义为 `role="alertdialog"`（Escape 视为取消）。
- 配套：`src/pages/popconfirm` demo 页（基础 / 三种语气 / 自定义文案与方位 / 受控显隐）+
  pages.json 路由 + 首页列表（demo-pages 守卫三向对齐）、
  `tests/components/popconfirm.spec.ts`、文档 9 语种（zh-CN 真源 + 8 译本）+
  `componentItems` 九语言 labels。
