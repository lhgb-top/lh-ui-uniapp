---
'@lh-ui/uniapp': patch
---

# dev 端口消解冲突 + 依赖声明去重

家族一键 dev 预览（根级 `scripts/dev-all.mjs`）实跑前，先消解跨仓端口冲突：

- 文档站 `docs:dev` 端口 5179 → **5187**（让开 react 文档站的 5179）
- dev:h5 沙箱在 `vite.config.ts` 显式固定 **5176**（原先走默认口，与 plus 沙箱的 5173 撞同段）
- `package.json` 删除 devDependencies 中重复的 `@lh-ui/share` 声明（保留 dependencies，
  与 plus / vue2 / react 三仓的依赖声明口径一致）

端口让开后各仓可同时 `dev`，互不抢占；依赖去重需重新 `pnpm install` 更新 lockfile。
