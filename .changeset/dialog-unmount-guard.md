---
'@lh-ui/uniapp': patch
---

Dialog 卸载守卫：`close()` 的 300ms 退场定时器（MP 端 transitionend 不可靠的 setTimeout 替代）此前未随组件卸载清理——组件在关闭动画期间被销毁后，定时器回调仍会向父组件发射 `update:modelValue` / `close`。现在 `onBeforeUnmount` 清理定时器并置卸载标记，回调内双层守卫；同时新增 locale 使用键门禁用例（本仓 `t()` / `tm()` 字面量键 ⊆ share zh-CN 叶子键，防漏键回退中文；经 `createRequire` 加载兄弟仓脚本绕开 vite 模块图拦截）。
