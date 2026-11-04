---
'@lh-ui/uniapp': minor
---

# 新增 Popover 弹出框

- 新增 `lh-popover` 组件：`placement` 12 方位、`trigger` 四种触发（click / hover / focus / manual）、
  `title`（prop + title 插槽回退）、`content` 富内容插槽、`width` / `popperClass` / `arrow` / `disabled`、
  `showAfter` / `hideAfter` 显隐延迟、`v-model:visible` 受控与 `show` / `hide` / `toggle` 编程式暴露。
- 类名、方位默认值、显隐延迟、宽度样式与触发器 / 弹层 aria 属性包全部由 `@lh-ui/share` core 纯函数
  （`getPopoverClass` / `getPopoverWidthStyle` / `getDefaultDelay` / `getPopoverTriggerAria` /
  `getPopoverPopperAria`）产出，仓内只写 computed 胶水；定位复用 `useLhPopper` 两帧度量，
  箭头偏移由胶水把定位结果的 `arrowOffset` 写入 `--lh-arrow-offset`。
- 【uni-app 差异】无 `teleportTarget`（弹层由 lh-root-portal 承载）；MP 端无 hover / focus 语义，
  两种触发降级为点击 / 触摸切换，显隐延迟仅 H5 的 hover / focus 生效；Esc 关闭仅 H5
  （文档级监听 + 弹层顺序栈，多弹层叠加只关栈顶）；焦点圈（focus-trap）与触发器滚出视口自动收起
  （scroll-out）不移植；aria 属性包逐键摊开绑定（MP 模板不支持 v-bind 对象）。
- 配套：`src/pages/popover` demo 页（基础 / 触发方式 / 方位 / 富内容 / 更多属性）+ pages.json 路由 +
  首页列表（demo-pages 守卫三向对齐）、`tests/components/popover.spec.ts` 13 用例、
  registry 有序数组登记、文档 9 语种（zh-CN 真源 + 8 译本）+ `componentItems` 九语言 labels。
