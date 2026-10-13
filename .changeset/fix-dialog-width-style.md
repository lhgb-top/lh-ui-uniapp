---
'@lh-ui/uniapp': patch
---

修复 lh-dialog 的 width 属性完全不生效

模板用 `:style="dialogContentStyle"` 给对话框本体设置宽度，但 SFC 解构 `useLhDialog` 返回值时漏取了 `dialogContentStyle`，渲染期访问未定义属性（Vue warn），用户传入的 `width` 被丢弃。补上解构，并新增 width 生效 / fullscreen 优先两条回归用例。

同时补全 demo：居中弹层区文案写「点击遮罩不会关闭」但未传 `:close-on-click-modal="false"`，与默认行为相反；新增「自定义宽度」区覆盖 width 属性。
