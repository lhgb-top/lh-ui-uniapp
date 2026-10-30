---
'@lh-ui/uniapp': patch
---

修复文档站 locale 内容门禁路径错误：`buildLocales()` 的检查 `resolve(__dirname, l.key)` 漏了「..」，永远解析到不存在的 `docs/.vitepress/<key>`，导致除 root 外所有 locale 被静默过滤——locale 页丢失 nav/sidebar/lang/lastUpdated 等 themeConfig，`<html lang>` 回退中文。修正为 `resolve(__dirname, '..', l.key)`。
