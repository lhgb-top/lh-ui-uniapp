# AGENTS.md

Project guidance for the **lh-ui-uniapp** repository. 总纲见 `../docs/多端组件库规划.md`，
uniapp 细节见 `../docs/uniapp/uniapp组件库计划.md`。

## What this repository is

`@lh-ui/uniapp` —— lh-ui 家族 web 血脉的 **uni-app UI 层**（Vue 3 运行时）。设计本意：
**一个 core（`@lh-ui/share` 的纯函数），各框架只是 UI 层**。本库只写响应式胶水、SFC 模板、
install 与命令式服务；**不持有任何 core / 样式 / 文案副本**。

- 唯一运行时依赖：`@lh-ui/share`（`^0.3.0`）；peer：`vue@^3.3.0`（uni-app 内置，不显式声明）。
- 首版平台范围：**H5 + 微信小程序**。明确不做 nvue、不做 App 端原生渲染、不声明支持
  支付宝/抖音小程序（计划文档已登记，后续按需扩）。
- 组件样式唯一源在 `@lh-ui/share/styles/`；但 uni-app 使用方工程的 sass 无法解析
  bare specifier（见红线 2），所以本库**构建期输出自足 CSS 产物**（`style.css`），
  SFC 用 `<style src="./style.css">` 引入，使用方零 sass 依赖。

## Layout

```
src/
  components/lh-<name>/        组件四件套（见下）
  adapter/                     平台适配层（组件层只调这里，不直接调 uni API）
    platform.ts                LH_IS_H5 / LH_IS_MP_WEIXIN 编译期常量（IIFE + 条件编译）
    getRect.ts                 选择器度量 → LhDOMRectLike（computePosition 的入参形态）
    popper.ts                  useLhPopper：两帧度量 → 定位 → 显示
    lock-scroll.ts             锁滚动适配（H5 改 body 样式 / MP 不可走 body）
    locale.ts                  lhlocale 对象包（订阅 share 的 locale 变更）
  config-provider/             provide/inject 层（LH_CONFIG_PROVIDER_KEY + 主题/暗色/语言注入）
  composables/index.ts         useLhZIndex / useLhComponent / useLhComponentTheme / useLhOverlayStack
  message/                     命令式服务：store（模块级单例队列）+ index（useLhMessage 控制器）+ types
  loading/                     同上（useLhLoading）
  shared/                      演示页辅助组件（demo-page / demo-block），**发包排除**
  icon/                        iconfont.css（构建产物）+ icon-map.ts（图标名 → 码点）
  theme/index.css              主题变量产物（page { --lh-* } 明色 + page.dark 暗色）
  types/emit.ts                LhEmitFn（见「类型模式」）
  pages/                       演示页（每组件一页，不发包）
  App.vue / main.ts / pages.json / manifest.json   uni-app 工程文件（不发包）
scripts/
  build-styles.mjs             share scss → 净化 CSS（postcss）
  build-iconfont.mjs           share 的 LH_ICON_SVGS_CONST → ttf → base64 内嵌 CSS
  verify-wxss.mjs              WXSS 白名单门禁（prepublishOnly 硬卡）
  local-share-alias.mjs        本地联动：vite/vitest alias 解析到同级 share 仓源码
  gen-dev-tsconfig.mjs         本地联动：生成 tsconfig.dev.json，让 typecheck 也走兄弟仓源码
tests/                         Vitest + VTU2（H5 语义）；core 单测不在此仓
  components/                  每组件一个 spec；unit/registry.spec.ts 守登记
docs/                          VitePress 文档站（DOCS_BASE=/lhui/uniapp/）
```

### 组件四件套（easycom 硬约定）

`src/components/lh-<name>/`：

- `lh-<name>.vue` —— SFC。**文件名必须等于标签名**，否则 easycom 自动引入失效。
  模板只用 uni 内置标签（view / text / button / scroll-view / input 等）；
  `defineOptions({ name: 'LhXxx', options: { virtualHost: true, addGlobalClass: true,
  styleIsolation: 'shared' } })`；样式一律 `<style src="./style.css">`。
- `logic.ts` —— `useLh<Name>(props, emit)` 胶水，computed 包 share 纯函数。
- `types.ts` —— Props / Emits（与 plus 同构）。
- `style.css` —— **构建产物，禁止手改**（跑 `pnpm build:styles`）。

### 组件登记（必做）

`src/index.ts` 的 `lhComponents` 数组 + 命名导出块两处都要加；
`tests/unit/registry.spec.ts` 会**反向扫描** `src/components/lh-*` 断言每个 SFC
已命名导出（有序断言 + 反向扫描两个用例），漏登记会直接挂测试。

## 依赖形态

与 plus / vue2 一致：`@lh-ui/share` 以 npm 范围版本 `^0.3.0` 依赖，`pnpm install`
直接从 registry 解析。share 每发新版，本库需 `pnpm up @lh-ui/share` + 全量回归 + 再发版。

本地开发不依赖 npm：`scripts/local-share-alias.mjs` 的 `createLocalShareAliases`
在家族布局下（三仓同父目录）把 `@lh-ui/share/**` 解析到同级 share 仓**源码**，
改 share 即时热更新；兄弟仓不存在时（单仓 clone）守卫返回空、回退 npm 包。
接入点：`vite.config.ts` 与 `vitest.config.ts`。

## 红线

1. **share 只读**：禁止修改 `@lh-ui/share` 任何源。平台差异全部收在本仓
   `src/adapter/` 与组件胶水层；share 缺的能力（如 MP 适配）在本仓补，不改 share。
2. **样式唯一源是 share**：本仓不持有任何组件 scss 源，仓库内出现手写组件样式副本即为违规。
   组件用的 CSS 全部是 `build-styles.mjs` 的**净化产物**（`style.css` / `theme/index.css`）。
   **禁止在使用方工程里 `@use '@lh-ui/share/...'`**：uni-app 工程的 sass loadPaths
   不含 node_modules，bare specifier 解析不了，这是必须构建期出产物的原因。
3. **core 不拷贝**：组件纯逻辑只调 share 纯函数，本仓不复制任何 core 实现。
   core 单测唯一一份在 share 仓，本仓测试只覆盖 uni-app 专属层（胶水 / 适配 / 服务）。
4. **组件层不直接调 uni API**：一律走 `src/adapter/`。一是平台差异集中可审，
   二是 MP 专属 API 在 H5 测试环境（jsdom）不存在，直接调会挂测试。
5. **WXSS 白名单**：净化产物必须过 `pnpm verify:wxss`（见下「WXSS 白名单速查」）。
   share 源若新增非法选择器，要么在 build-styles 加净化规则，要么登记为 H5-only 包裹。
6. **不引第三方 UI 依赖**（uni-ui / uview 等一律不引）。
7. **条件编译指令字面量不得出现在注释正文里**（见下「uni-app 踩坑」第 1 条）。

## uni-app 踩坑（逐条对照，都是真实踩过的）

1. **条件编译指令必须独占一行**：uni 预处理器按行扫描 `#ifdef` / `#ifndef` / `#endif`，
   **注释正文里出现指令字面量也会被当成指令**，然后报「缺少配对的 #endif」。
   写注释时用「条件编译」等描述词，不要敲 `#ifdef` 本身（本文档和 platform.ts 头注释都遵守）。
2. **组件源必须在 inputDir（src/）内**（本仓最重要的架构决策）：
   uni 的 `chunkFileNames`（`@dcloudio/uni-app-vite` 的 build.js）与
   `uni:mp-pages-json` 插件 emit 的 json asset，都用 `path.relative(UNI_INPUT_DIR, id)`
   生成路径；源在 src 外会产生 `../` 前缀，rollup 直接拒绝
   （`patterns can be neither absolute nor relative paths`）。
   打洞补不完（sanitizeChunkNames 修了 chunk 名，json asset 立刻接力报错），
   所以组件源一律放 `src/components/`。**任何被 easycom 引用的源都不能放出 src/**。
3. **easycom 硬约定**：SFC 文件名 = 标签名（`lh-button/lh-button.vue` ↔ `<lh-button>`）。
   本仓 `pages.json` 规则 `"^lh-(.*)": "@/components/lh-$1/lh-$1.vue"`；
   使用方工程（npm 安装后）规则为
   `"^lh-(.*)": "@lh-ui/uniapp/src/components/lh-$1/lh-$1.vue"`。
   easycom 配置改了不实时生效，要重启 dev server。
4. **所有 ref 调用须在 `onReady` 之后**：`onLoad` 阶段组件尚未创建完毕，
   `getLhRect` / `useLhPopper` 这类度量调用拿不到节点。adapter 的注释里写了这个约束。
5. **MP 端能力的守卫原则**：不可用能力（focus-trap / transitionend / hover / document.body）
   由 `LH_IS_H5` 编译期守卫**直接不调用**，不是运行时降级——MP 包里不应该有死代码。
   Dialog 的 `shouldTrapFocus` 由 `LH_IS_H5` 守卫直接返回 false，**不调** share 的 focus-trap；
   `getScrollbarWidth` 在 MP 返回 0。
6. **命令式服务用挂载点模式**：plus 的 `createApp + mount 到 document.body` 在 MP 完全不可用
   （小程序没有 document）。本仓 `message` / `loading` 改成「模块级单例 store +
   页面放挂载点组件 + hook 控制器」：页面里放一个 `<lh-message />` / `<lh-loading />`，
   `useLhMessage()` / `useLhLoading()` 操作 store。**挂载点未放置时开发期
   `console.error` 明确告警，不静默降级**（否则使用者排查不到为什么没反应）。
   进出动画用 CSS transition + setTimeout 对齐时长（`transitionend` 在 MP 不可靠）。
7. **`::placeholder` MP 不支持**：input 的占位样式走 `placeholder-style` /
   `placeholder-class` prop，不要在 CSS 里写 `::placeholder`（verify-wxss 也会拦）。
8. **postcss 8.5 的 replaceWith 陷阱**（build-styles.mjs 已踩过并修复）：
   `node.replaceWith([before, node, after])` 会把数组里的 node 自身从父节点摘掉
   （normalize 对数组元素逐个 removeChild），被包裹的规则凭空消失只剩孤立 `#endif`。
   **必须用 `node.parent.insertBefore(node, before)` + `node.parent.insertAfter(node, after)`**。
9. **postcss AtRule.params 不含 at-rule 名**：`@media (prefers-*)` 的 params 只是
   `(prefers-*)`，匹配正则不能要求 `@media` 前缀（build-styles 的 `isPrefersMedia`）。
10. **vue-tsc 不认条件编译**：platform.ts 里条件编译要包成 IIFE，否则 if/else 两个分支的
    const 会报「重复声明」。
11. **ESM 取 CJS 插件**：本仓 `"type": "module"`，`@dcloudio/vite-plugin-uni` 是 CJS，
    `vite.config.ts` 用 `createRequire(import.meta.url)` 取其 default 形态。
12. **vitest 无 easycom**：`tests/mount.ts` 用 `import.meta.glob` 全局注册全部 SFC；
    uni 内置标签（view/text 等）在 `vitest.config.ts` 的
    `template.compilerOptions.isCustomElement` 里声明。
13. **defineEmits 与 strictFunctionTypes 逆变**：见下「类型模式」。
14. **`@media (prefers-*)` 块内的规则整体跳过净化**（build-styles 的 `isInsidePrefersMedia`）：
    prefers 查询本身会被 `#ifdef H5` 整块包裹、MP 端整体剔除，块内的规则（含
    `.lh-progress, .lh-progress *` 这类通配）无需净化——强行净化只会触发
    「未支持通配」的抛错。判断用 `node.parent` 向上遍历，不依赖 walk 顺序。
15. **`PREFIX > *` 子代通配无任何 WXSS 等价物**（share 的 card 用它让封面插槽内容撑满宽度）：
    与 `> * + *` 不同，它映射不到父节点的 flex/gap，build-styles **直接删除并 console.warn**，
    由使用者在子节点上自写样式（见 card 演示页的 `.card-cover-img`）。share 若新增此类
    规则，要么改源，要么在此登记处理方式。
16. **MP 模板编译器不支持 `v-bind="对象"`**（报 `v-bind="" is not supported`，H5 / vitest
    都正常，只有 `uni build -p mp-weixin` 才会挂）：share 的 `LhAriaAttrs` 属性包不能直接
    `v-bind="aria"` 落图。改由胶水层把包里的键摊成具体值（如
    `ariaHidden = computed(() => Boolean(aria.value['aria-hidden']))`），模板逐项
    `:aria-hidden="ariaHidden"` 显式绑定——契约仍由 share 的 `getXxxAria()` 决定，本仓不重复
    定义。**新组件绑属性包时必须摊开写，不能照搬 plus 的 `v-bind="aria"`。**
    （vue-tsc 对 `aria-*` 属性有 `Booleanish` 类型约束，摊出的值要收窄成布尔。）

## 类型模式

- **`LhEmitFn`**（`src/types/emit.ts`）：defineEmits 产出的是各事件重载的**交集**，
  传给 `(event: T, ...args) => void` 形式参数会因 strictFunctionTypes 的参数逆变报错。
  改用方法签名（call signature）声明：方法参数走双变检查，可兼容任何事件重载，
  同时仍约束事件名（`emit('xxx')` 写错会报错）。logic 保留精确事件名约束，
  SFC 调用处 `emit as LhEmitFn<...>`。
- **`LhXxxResolvedProps`**：withDefaults 之后的 props 类型用交叉类型
  `LhXxxProps & { ... }` 记录运行时默认值契约，供 logic 与测试引用。

## WXSS 白名单速查（verify-wxss.mjs）

净化产物里**禁用**的选择器（命中即报错）：

| 禁用项 | 原因 / 替代 |
| --- | --- |
| `*` 通配 | WXSS 不支持。`PREFIX > * + *` 被 build-styles 映射成父规则 flex + gap（share 的 dialog 底栏）；`PREFIX > *` 无等价物，**直接删除并告警**，使用者侧给子节点写样式（share 的 card 封面） |
| 属性选择器 `[...]` | WXSS 不支持 |
| `:not()` / `:nth-*` | WXSS 不支持 |
| 标签选择器（`page` 除外） | WXSS 只支持 `page`；share 的 `:root` 已映射成 `page`，`svg {}` 映射成 `.lh-iconfont`（SFC 的图标节点须有 `lh-iconfont` 类，lh-icon 已处理），`img {}` 映射成 `.lh-img`（SFC 的 `<image>` 须写 `class="lh-img"`，见 lh-empty） |
| `html` / `body` | 小程序无 |
| `:hover` / `:focus*` | 仅 H5，用 `#ifdef H5` 包裹后放行 |
| `::placeholder` | MP 不支持，走 `placeholder-style` / `placeholder-class` prop |
| `@media (prefers-*)` | 仅 H5，用 `#ifdef H5` 包裹后放行；块内规则整体跳过净化（上面的坑 14） |

被 `#ifdef H5 ... #endif` 夹住的行整体豁免（uni 编译链在 MP 端会整体剔除）。

## Conventions

- BEM `lh` 命名空间；CSS 变量 `--lh-*` 一律来自 share 的 theme 源，组件不得自行声明。
- 暗色模式：ConfigProvider 通过 `page.dark` / `.dark` 类切换（uniapp 独有；
  plus 靠 `document.documentElement`，本仓没有 document）。
- `strict: true`；Prettier 配置见 `.prettierrc.json`（单引号、无分号、2 空格、printWidth 100、
  singleAttributePerLine）。**没有 `pnpm format` 脚本**——要格式化手动跑
  `npx prettier --write <文件>`；`eslint.config.mjs` 已接入 eslint-config-prettier，
  `pnpm lint:fix` 不会与 Prettier 打架。
- eslint 忽略构建产物（`src/theme/index.css` / `src/icon/iconfont.css` /
  `components/**/style.css`），这些文件交 build:assets 生成，不归 lint 管。
- `uni` / `wx` / `plus` / `getCurrentPages` / `getApp` 在 eslint 里声明为 readonly 全局
  （各端运行时注入，不来自任何 import）；但**组件层仍不得直接调 uni API**，走 `src/adapter/`。
- 注释、文档、提交信息一律中文。

### 命名规范（top.lhgb / LH 前缀）

家族总纲决策 **D20**（`docs/多端组件库规划.md` §2.4，用户 2026-10-10 定案）：

- **反域名根 `top.lhgb`**（反写 `www.lhgb.top`）。**npm 端不使用反域名**——npm 包名不允许点号，
  包名维持 `@lh-ui/uniapp` scope 不变；反域名只落 `package.json` 的 `homepage` / `author` 等
  元信息。原生端（android / ios / harmony / windows）的 applicationId / bundleId / package 才用
  `top.lhgb.*` 形态。本仓演示工程若将来开启 App 原生打包，Android packageName / iOS bundleId
  用 `top.lhgb.ui.uniapp`（首版不做 App 原生，此处仅登记备忘，不要往 `manifest.json` 里加字段）。
- **第一方符号必须带 LH 前缀**（与 plus 仓金标准一致，整改后 `src/` 零违规）：
  常量 `LH_XXX_YYY`（`LH_IS_H5`、`LH_CONFIG_PROVIDER_KEY`）；类型 / 接口 `LhXxx`（`LhViewport`；
  组合式配套类型用 `UseLhXxx`，如 `UseLhPopperOptions` / `UseLhPopperReturn`，与 plus 同款）；
  组合式 `useLhXxx`（`useLhPopper`）；服务 / 工具函数 `<动词>Lh<名词>`（`getLhRect`、
  `showLhLoading`、`openLhMessage`）；模块级单例 / 小写对象 `lhXxx`（`lhMessageRecords`、
  `lhComponents`、`lhUiUniapp`、`lhlocale`）。BEM 类名 `lh-xxx`、组件 `name: 'LhXxx'` 同属此规范。
- **豁免不加前缀**（不要误改）：
  - `@lh-ui/share` 与第三方依赖的导出符号（share 仓内部的命名对齐由 share 仓自己的流程处理）；
  - 框架契约名：`createApp`（uni-app 入口约定）、`install`（Vue 插件约定，plus 仓同样不加）；
  - share 符号的**同名透传再导出**：`zhCN` / `enUS` / `lhlocale`，以及 share 已改名为
    `Lh` 前缀的类型（`LhLocalePath` / `LhSxProps` / `LhDOMRectLike` 等）——本仓 `import` +
    原名 `export type` 透传，名字由 share 决定，跟随 share 发版，本仓不另起别名。

## Commands

| Task | Command |
| --- | --- |
| lint / 自动修复 | `pnpm lint` / `pnpm lint:fix` |
| typecheck | `pnpm typecheck`（先 `node scripts/gen-dev-tsconfig.mjs` 生成 `tsconfig.dev.json`，再 `vue-tsc -p tsconfig.dev.json --noEmit`，见下「typecheck 联动」） |
| typecheck（npm 产物） | `pnpm typecheck:npm`（不走兄弟仓源码，解析已安装的 npm 包类型） |
| 全部测试 / 监听 | `pnpm test` / `pnpm test:watch` |
| 单个组件测试 | `pnpm vitest run tests/components/button.spec.ts` |
| 样式构建（净化管线） | `pnpm build:styles` |
| 图标字体构建 | `pnpm build:iconfont` |
| 资产一键重建 | `pnpm build:assets`（iconfont + styles） |
| WXSS 白名单门禁 | `pnpm verify:wxss`（build:styles 之后跑） |
| H5 dev / build | `pnpm dev:h5` / `pnpm build:h5` |
| 微信小程序 dev / build | `pnpm dev:mp-weixin` / `pnpm build:mp-weixin` |
| 文档站 dev / build / preview | `pnpm docs:dev` / `pnpm docs:build` / `pnpm docs:preview` |
| changeset | `pnpm changeset` / `pnpm changeset:status` |

发包形态（`package.json` 的 `files`）：只发 `src`，并用 `!` 排除演示与工程文件
（`!src/App.vue` / `main.ts` / `manifest.json` / `pages.json` / `pages` /
`env.d.ts` / `shared`）。所以 easycom 路径是
`@lh-ui/uniapp/src/components/...`（src 在包内，不在包根）。`prepublishOnly`
会自动跑 `build:assets` + `verify:wxss`。

**typecheck 联动**：vite / vitest 通过 `local-share-alias.mjs` 解析到同级 `lh-ui-share` 源码，
但 vue-tsc 不吃 vite alias——根 `tsconfig.json` 没有 `@lh-ui/share` 映射，会解析到
`node_modules` 里的 **npm 已发产物**。家族布局下 npm 包版本可能滞后于兄弟仓源码（例如 share
改名后尚未发版），typecheck 就会误报「share 没有这个导出」。`pnpm typecheck` 先跑
`scripts/gen-dev-tsconfig.mjs` 生成派生配置 `tsconfig.dev.json`，追加
`@lh-ui/share/* → ../lh-ui-share/src/*` 映射（`paths` 是整体替换，根配置的 `@/*` 原样重声明）。
守卫与 alias 脚本一致：兄弟仓不存在（CI 单仓 clone）时生成的配置不含映射，回退 npm 包类型，
行为与加脚本前完全一致。产物 `tsconfig.dev.json` 已在 `.gitignore` 忽略；根 `tsconfig.json`
与构建链逐字节不动（`pnpm typecheck:npm` 保留纯 npm 解析路径，用于校验发包态）。

## Verification is manual（AI 不自动执行）

单测、构建、typecheck、lint 由**用户**运行；AI 交付后列出命令清单，
未经验证不得标注 ✅（写「已交付（待手动验证）」）。例外：用户在当次请求中明确授权时
方可代跑并如实记录。

## Git 操作红线 — AI 不得自行改动 git 状态

未经用户在当前请求中明确同意，AI 不得执行任何改动 git 状态或历史的指令，包括但不限于
`commit`、`push`、`git add`（含 `--renormalize`/`-A`）、`reset`、`revert`、`restore`、
`checkout -- <file>`、`stash`、`merge`、`rebase`、`tag`、`rm --cached`。只读指令
（`status`、`diff`、`log`、`show`、`branch` 查看）不受限。确需变更操作时：先询问用户，
说明要执行什么、影响范围和理由，得到同意后再执行；工作区/暂存区留给用户自行掌控。

## Read before touching sensitive areas

动下列区域前先读对应文件，里面的决策都是踩坑换来的：

- `scripts/build-styles.mjs` —— 净化管线的全部规则与两个 postcss 陷阱（replaceWith /
  isPrefersMedia）的修复注释。改净化逻辑前必读，否则会重蹈「孤立 #endif」。
- `scripts/verify-wxss.mjs` —— WXSS 白名单规则表与条件编译豁免逻辑。
- `src/adapter/platform.ts` —— 条件编译的写字约束（指令字面量不得入注释正文）。
- `vite.config.ts` —— `createRequire` 取 CJS 插件、alias 接入点。
- `vitest.config.ts` —— `isCustomElement`（uni 内置标签）与 easycom 缺失的测试补偿。
- `src/message/store.ts` / `src/loading/store.ts` —— 挂载点服务模式与未挂载告警。
- `../docs/uniapp/uniapp组件库计划.md` —— 完整计划、决策记录与偏离登记。
