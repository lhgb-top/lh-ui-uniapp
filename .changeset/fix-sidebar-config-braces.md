---
'@lh-ui/uniapp': patch
---

修复文档站构建失败：`docs/.vitepress/config.ts` 侧边栏 radio、badge 两个条目的 `labels` 行末多了一个 `}`（`} },`），把条目对象提前闭合导致下一行 `},` 成为悬空括号，esbuild 解析配置即报 `Unexpected "}"`。
