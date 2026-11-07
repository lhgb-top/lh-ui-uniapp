# 微信小程序人工回归清单

> 给使用者（或维护者）在微信开发者工具里走查用。构建冒烟只保证 WXSS 合法、能编译过；
> **行为正确性必须人工回归**——vitest 跑的是 H5 语义，MP 端的事件与渲染差异测不出来。
>
> 构建：`pnpm dev:mp-weixin`（或 `pnpm build:mp-weixin`），产物在 `dist/dev/mp-weixin`
> （或 `dist/build/mp-weixin`），用微信开发者工具打开该目录。
>
> 前置：微信基础库 **≥ 2.25.2**（root-portal 依赖；低版本走页内 fixed 降级分支，
> 若专门验降级路径可把基础库调到 2.25.2 以下再跑一遍「弹层类」三项）。

## 通用基线（每页都查）

| # | 项 | 通过标准 |
| --- | --- | --- |
| G1 | 打开 | 页面渲染不白屏、不报「组件未注册」 |
| G2 | 暗色 | 入口切暗色，页面内组件颜色全部跟随（不是只变背景） |
| G3 | 中英 | 入口切语言，组件内文案（如 form 校验消息、按钮文案）跟随切换 |
| G4 | 控制台 | 全程无 `console.error`（特别注意 message/loading 的「未放挂载点」告警不该出现） |

## 组件清单

| 页面路径 | 组件 | 关键交互（除通用基线外） |
| --- | --- | --- |
| `pages/button/button` | button | 点击有回弹态；loading / disabled / plain / round / circle / block 全渲染；图标按钮的 iconfont 正常出图 |
| `pages/icon/icon` | icon | 37 个图标全部出图（不是空白方块）；size / color 生效；loading 图标转动 |
| `pages/tag/tag` | tag | 各 type 颜色正确；round / hit 切换；closable 点击触发关闭且回调到 |
| `pages/input/input` | input | v-model 双向；占位样式经 `placeholder-style` 生效（**不查 `::placeholder`**）；textarea 自适应高度；字数统计；clearable 清空；error 状态描边变红 |
| `pages/switch/switch` | switch | 点击切换有滑块动画；loading / disabled 不响应点击；activeText/inactiveText 显示 |
| `pages/checkbox/checkbox` | checkbox / checkbox-group | 单选点击勾选；group 内多选互不影响；disabled 项不响应；indeterminate 半选态 |
| `pages/radio/radio` | radio / radio-group | 选项互斥（点另一项取消前项）；disabled 项不响应 |
| `pages/form/form` | form / form-item | blur / input 触发校验；错误文案 `<text>` 正常显示；`validate()` 返回的 Promise 在「提交」按钮里正确 resolve；必填星号显示 |
| `pages/select/select` | select | 点击弹出 listbox（**root-portal，层级在遮罩之上**）；选项点击选中并关闭；clearable 清空；filterable 弹层内输入框可用；**无键盘导航属正常**（MP 移除） |
| `pages/tooltip/tooltip` | tooltip | 点击 trigger 弹出气泡；位置与 placement 一致（两帧度量后定位，**首帧不应看到闪烁或错位**）；点击外部关闭；trigger="hover" 在 MP 无效应视为正常 |
| `pages/dialog/dialog` | dialog | 打开有遮罩与过渡；点击遮罩按 `closeOnClick-modal` 关闭；bottom 定位在全面屏下 `safe-area-inset-bottom` 生效；**Esc 与 lockScroll 在 MP 无效属正常**；全屏模式铺满 |
| `pages/services/services` | message / loading | 见下节 |
| `pages/result/result` | result | 四态图标颜色正确；自定义图标出图；title / subTitle / extra 插槽渲染 |
| `pages/text/text` | text | 级别排版（h1~caption）字号层级正确；省略两行折叠生效；复制按钮点击后切「已复制」并弹系统提示（**MP 端复制内容须传 `copy-text`，否则不写入**） |
| `pages/link/link` | link | 各类型颜色正确；下划线 always / none 可见（hover 态无）；禁用态不可点击；点击触发事件 |
| `pages/input-tag/input-tag` | input-tag | 输入后点**完成键**提交标签；× 按钮点删生效；上限 / 去重不提交只清空输入；只读 / 禁用无交互 |


## message / loading 专项

| # | 项 | 通过标准 |
| --- | --- | --- |
| S1 | 各类型消息 | success / info / warning / danger / loading 五种类型弹出，图标与颜色对 |
| S2 | 自动关闭 | 默认 3 秒后消失，消失有过渡动画（**不是瞬间消失**） |
| S3 | 手动关闭 | loading 类型不自动关闭，`handle.close()` 后才消失 |
| S4 | 多条堆叠 | 连续调用多条时纵向堆叠不重叠；超过 max 条数时旧的被挤掉 |
| S5 | 全屏遮罩 | loading.show 出现全屏遮罩，遮罩期间下层不可点击 |
| S6 | 关闭回调 | onClose 回调在消息消失时触发 |
| S7 | 未挂载告警 | （专门验：删掉页面里的 `<lh-message />` 再调用）控制台应 `console.error` 明确告警，**不静默** |

## 已知的 MP 端「非缺陷」（验到了别报 bug）

- select / dialog / tooltip **无键盘导航 / Esc / focus-trap / lockScroll**——编译期移除，见
  [平台支持](/guide/platform)。
- tooltip 的 `trigger="hover"` 在 MP 端不触发——无 hover 语义，用 click。
- message / loading 必须先放挂载点，这是设计，不是 bug。
- icon 是字体渲染，CSS 里 `fill` / `stroke` 无效，只能 `color`。
- input-tag 的 **Backspace 删尾 / space / comma 触发提交**在 MP 端不存在——MP 无键盘事件，提交走完成键（`@confirm`），删除走 × 按钮。
- text 的复制在 MP 端读不到插槽文本，必须传 `copy-text` prop，这是平台限制不是 bug。
- link 的 `href` 在 MP 端无导航语义（view 承载），跳转由业务层在 `@click` 里处理。
- color-picker 的三条拖拽轴在 MP 端走触摸拖拽（与滑块同范式），**桌面端 hover 预览无**。

## 回归结果记录

在表格右侧补列「通过 / 失败（现象）」，失败项先贴开发者工具的 Console 与 WXML 面板截图，
再对照 `docs/uniapp/uniapp组件库计划.md` 的平台能力矩阵判断是「预期降级」还是真缺陷。

---

## 支付宝 / 抖音小程序回归（实验性加列，M4.9）

两端的组件行为与微信一致（条件编译同走 `#ifndef H5` 分支），回归以**编译冒烟 + 差异点走查**为主：

- 构建：`pnpm build:mp-alipay` / `pnpm build:mp-toutiao`，产物在
  `dist/build/mp-alipay` / `dist/build/mp-toutiao`，分别用各端开发者工具打开。
- 通用基线（上方 G1–G4）逐页过一遍；组件清单重点验**弹层类**（select / dialog /
  tooltip / autocomplete / mentions / color-picker）与**滚动类**（affix / backtop /
  anchor）——这两类集中了两端的已知差异：
  - 支付宝：弹层按基础库版本决定 root-portal 或页内 fixed；同页多实例的弹层组件重点确认定位不串节点（`selectorQuery.in()` 无效）。
  - 抖音：弹层一律页内 fixed，确认弹层不被页面流遮挡（z-index 生效）。
- 差异点速查见 [平台支持 — 支付宝 / 抖音的具体限制](/guide/platform)。
