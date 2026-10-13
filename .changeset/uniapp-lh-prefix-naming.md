---
'@lh-ui/uniapp': minor
---

命名规范整改：本仓第一方符号补齐 LH 前缀（家族 D20，对齐 plus 金标准）

与 `sync-share-lh-prefix.md` 是两件事：那份跟随 share 仓改名做消费侧同步；
本份整改**本仓自有符号**。包名维持 `@lh-ui/uniapp` 不变——npm 包名不允许点号，
反域名 `top.lhgb` 只落 `homepage` / `author` 等元信息与原生端包名（总纲 D20）。

**公开 API**

- 全部改名都在仓内模块（`src/adapter/`、`src/message/`、`src/loading/` 等），不进公共入口
  `src/index.ts`，**外部无感**；公共入口导出的组件、`useLhMessage` / `useLhLoading`、
  `lhlocale` / `zhCN` / `enUS` 等签名不变。

**模块内部改名（约 30 个导出）**

- 平台适配 `src/adapter/platform.ts`：`isH5` / `isMpWeixin` → `LH_IS_H5` / `LH_IS_MP_WEIXIN`；
  `getWindowInfo` → `getLhWindowInfo`、`getLibVersion` → `getLhLibVersion`、
  `compareVersion` → `compareLhVersion`、`ROOT_PORTAL_MIN_VERSION` → `LH_ROOT_PORTAL_MIN_VERSION`、
  `supportsRootPortal` → `supportsLhRootPortal`。
- 节点度量 `src/adapter/getRect.ts`：`getRect` → `getLhRect`、`getSingleRect` → `getSingleLhRect`、
  `GetRectOptions` → `LhGetRectOptions`。
- 弹层定位 `src/adapter/popper.ts`：`usePopper` → `useLhPopper`（与 plus 同名）、
  `UsePopperOptions` → `UseLhPopperOptions`、`UsePopperReturn` → `UseLhPopperReturn`。
- 主题上下文 `src/config-provider/types.ts`：`CONFIG_PROVIDER_KEY` → `LH_CONFIG_PROVIDER_KEY`
  （与 plus / vue2 同名）。
- message store 全套 → `lhMessageConfig` / `lhMessageRecords` / `setLhMessageConfig` /
  `openLhMessage` / `closeLhMessage` / `closeAllLhMessages` / `setLhMessageMounted`。
- loading store 全套 → `LhLoadingInstance` / `lhLoadingInstances` / `showLhLoading` /
  `closeLhLoading` / `closeAllLhLoading` / `getLhLoadingClass` / `setLhLoadingMounted`。
- 杂项：`useHasClickListener` → `useLhHasClickListener`（lh-button 胶水）；
  `useDarkTheme` → `useLhDarkTheme`（演示工程脚手架，发包已排除）。

**工具链**

- 新增 `scripts/gen-dev-tsconfig.mjs`：`pnpm typecheck` 先生成派生 `tsconfig.dev.json`，
  把 `@lh-ui/share/*` 映射到同级 `lh-ui-share` 源码。此前 vue-tsc 不吃 vite alias，
  只能解析 `node_modules` 里的 npm 已发产物，share 改名未发版时会误报「share 没有这个导出」。
  兄弟仓不存在时（CI 单仓 clone）不追加映射，回退 npm 包类型。新增 `pnpm typecheck:npm`
  保留纯 npm 解析路径用于校验发包态；根 `tsconfig.json` 与构建链逐字节不动。

**规范条文**：见 `AGENTS.md`「命名规范（top.lhgb / LH 前缀）」小节；豁免不加前缀的是
框架契约（`createApp` / `install`）、share 与第三方符号、以及 share 的同名透传再导出
（`zhCN` / `enUS` / `lhlocale`）。
