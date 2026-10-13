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

## 回归结果记录

在表格右侧补列「通过 / 失败（现象）」，失败项先贴开发者工具的 Console 与 WXML 面板截图，
再对照 `docs/uniapp/uniapp组件库计划.md` 的平台能力矩阵判断是「预期降级」还是真缺陷。
