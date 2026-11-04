---
'@lh-ui/uniapp': patch
---

# 拆除 adapter/locale.ts 的文案过渡副本

share 十语言包已补齐 `dialog.confirm/cancel/ariaLabel`、`input.clear`、`select.clear/filter/empty`、`cascader.filter`，`adapter/locale.ts` 里用 `add()` 注入的 zh-CN/en-US 副本随之删除——本库不再持有文案副本（红线）。此前切到英文后对话框按钮仍显示「确定/取消」的根因已在 share 侧修复；本地开发经 alias 即时生效。
