---
"@lh-ui/uniapp": patch
---

文档站部署 base 对齐家族统一约定：`DOCS_BASE` 由 `/uniapp/` 改为 `/lhui/uniapp/`。

此前本仓是家族中唯一离群的站点（其余七站均为 `/lhui/{库名}/`），且与 `package.json`
的 `homepage`（`https://www.lhgb.top/lhui/uniapp/`）自相矛盾。修正后与 Nginx 的
`/lhui/uniapp/` location 及门户导航页的统一前缀约定一致，本站开了 `cleanUrls: true`，
Nginx 侧的 `try_files` 需含 `$uri.html` 才能服务无后缀 URL（见家族
`docs/部署/nginx-lhui.conf.md`）。

注意：现有 `docs/.vitepress/dist/` 仍是旧 base 的产物，部署前需重新 `pnpm docs:build`。
