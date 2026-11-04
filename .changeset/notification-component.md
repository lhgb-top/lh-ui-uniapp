---
'@lh-ui/uniapp': minor
---

# 新增 Notification 通知服务

- 新增 notification 命令式服务（挂载点模式，与 message / loading 同款）：`useLhNotification()`
  提供 `success` / `info` / `warning` / `danger` 四个语义方法（error 与 plus 一致不单独暴露）+
  `close` / `closeAll` / `config`，直接调用接收 `LhNotificationOptions`
  （`title` / `content` / `type` / `duration` / `position` / `showClose` / `sx` / `onClick` / `onClose`）。
- 新增 `<lh-notification />` 挂载点组件：按 `position` 把记录分组渲染到视口四角
  （`groupNotificationsByPosition` 等渲染决策全部由 `@lh-ui/share` core 纯函数产出，
  仓内只写 computed 胶水）；未放挂载点时开发期 `console.error` 明确告警，不静默降级；
  挂载点卸载时清空队列并触发各条 `onClose`。
- 【uni-app 差异】无 `appendTo`（MP 无 DOM 挂载概念）；plus 的 `createApp + mount 到 body`
  改为「模块级单例 store + 挂载点组件」；进出动画降级为直接增删节点
  （`transitionend` 在 MP 不可靠）；可点击卡片不移植 tabindex / 键盘触发。
- 配套：`src/pages/notification` demo 页（语义 / 位置 / 定制 + 本页挂载点）+ pages.json 路由 +
  首页列表（demo-pages 守卫三向对齐）、`tests/components/notification.spec.ts` 8 用例、
  `tests/unit/services.spec.ts` 补 3 条服务告警 / 清理用例、registry 命名导出登记
  （挂载点组件不进 lhComponents，照 message / loading 先例）、文档 9 语种
  （zh-CN 真源 + 8 译本）+ `serviceItems` 九语言 labels、message.md 过期的
  「Notification 首版缺席」提示改为指向新服务。
