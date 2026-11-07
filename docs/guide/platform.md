# 平台支持

## 首版平台范围

| 平台 | 状态 | 说明 |
| --- | --- | --- |
| **H5** | ✅ 完整 | 所有组件全功能 |
| **微信小程序** | ✅ 完整（部分降级） | 弹层类组件的桌面级能力降级，见下表 |
| 支付宝小程序 | 🧪 实验性 | 与微信 WXSS / selectorQuery / root-portal 能力基本同构，已加列；已知差异见下「支付宝 / 抖音的具体限制」 |
| 抖音小程序 | 🧪 实验性 | 已加列；不支持 root-portal（弹层走页内 fixed），其余同微信 |
| App（nvue） | 🚫 不做 | nvue 渲染体系与 webview 不同，不在路线内 |

## 各组件能力矩阵

「降级」指**平台不支持的能力被编译期守卫直接移除**（小程序包里没有死代码），不是运行时失败。

| 组件 | H5 | 微信小程序 | 支付宝小程序 | 抖音小程序 | 降级策略 / 说明 |
| --- | --- | --- | --- | --- | --- |
| config-provider | 完整 | 完整 | provide/inject + 内联 CSS 变量全平台可用；暗色靠 `page.dark` 类切换（无 document） |
| button / tag | 完整 | 完整 | — |
| icon | 完整 | 完整 | iconfont 字体方案（web 端是内联 SVG，见下「icon 渲染差异」） |
| input | 完整 | 完整 | 占位样式走 `placeholder-style` prop（MP 不支持 `::placeholder`） |
| checkbox / radio / switch | 完整 | 完整 | **view 自绘**（不用原生组件，统一 lh 视觉语言） |
| form / form-item | 完整 | 完整 | 校验逻辑在 core 纯函数，零平台依赖 |
| select | 完整 | 降级 | 降级 | 降级（页内 fixed） | root-portal + 两帧度量定位；**键盘导航仅 H5**，MP 靠点击 + scroll-view |
| dialog | 完整 | 降级 | 降级 | 降级（页内 fixed） | root-portal；**focus-trap / lockScroll 仅 H5**，MP 由遮罩拦截兜底 |
| tooltip | 完整 | 降级 | 降级 | 降级（页内 fixed） | 两帧度量定位；**无 hover**，MP 端点击 / 触摸触发 |
| message / loading | 完整 | 完整 | 完整 | 完整 | 挂载点模式（小程序无 document，不能 JS 创建 DOM） |
| result / text / link | 完整 | 完整 | 完整 | 完整 | core 零平台依赖；text 复制走 adapter/clipboard（MP 用 `copyText` prop 指定文本）；link 降级为 view + `@click`（导航交业务层） |
| input-tag | 完整 | 降级 | 降级 | 降级 | MP 无键盘事件：触发键提交仅走完成键（`@confirm`），Backspace 删尾与 space / comma 触发仅 H5；× 按钮点删双端可用 |
| autocomplete / mentions | 完整 | 降级 | 降级 | 降级（页内 fixed） | 套 select 的 root-portal + 两帧度量下拉；hover 高亮 / 键盘导航 / Esc 仅 H5；mentions 光标上下文 MP 端近似 |
| color-picker | 完整 | 降级 | 降级 | 降级（页内 fixed） | svpanel / hue / alpha 拖拽照滑块的触摸范式；面板内 hex / rgb 输入与预设色板双端可用 |

| calendar | 完整 | 完整 | 完整 | 完整 | **view 自绘 7 列网格**（无原生日期控件、无 DOM 度量，移动端天然友好全端一致）；**键盘网格导航与 input 模式的点击外部收起仅 H5**（MP 无键盘事件 / 无 document）；禁用日由 `--disabled` 类名承载外观（view 无 `:disabled` 伪类，SFC 内联兜底） |

## 微信小程序的具体限制与替代

| 限制 | 替代方案 |
| --- | --- |
| 不支持 `<svg>` 标签 | 图标编译期转 iconfont 字体（base64 内嵌），`<text class="lh-iconfont">` 渲染 |
| 不支持 `::placeholder` | input 的 `placeholder-style` / `placeholder-class` prop |
| 不支持 `*` 通配 / 属性选择器 / `:not()` / `:nth-*` | 构建期净化：`*` 通配映射成 flex + gap，其余替换为等价类名 |
| 无 `document` / `document.body` | 弹层走 `root-portal`；命令式服务走挂载点模式 |
| 无键盘焦点语义 | focus-trap / 键盘导航由 `LH_IS_H5` 守卫不调用；aria 属性仍输出供读屏 |
| `transitionend` 不可靠 | 进出动画用 CSS transition + setTimeout 对齐时长 |
| `onLoad` 阶段组件未创建完 | 所有 ref / 度量调用须在 `onReady` 之后 |

## 微信基础库版本

- **root-portal 需要基础库 ≥ 2.25.2**（select / dialog / tooltip 的弹层挂载依赖它）。
- 低版本自动降级为**页内 fixed 定位**兜底（`getLhLibVersion()` 判断），弹层仍在，只是层级
  受页面流约束。

## 支付宝 / 抖音的具体限制（实验性加列）

支付宝与抖音的能力与微信基本同构（WXSS / ACSS 选择器限制一致，复用同一份净化管线与
verify-wxss 门禁），差异集中在：

| 限制 | 影响 / 替代 |
| --- | --- |
| 支付宝 `selectorQuery.in(component)` 无效 | 组件内度量按 scope 限定在该端不生效——**同页放多个同类组件时，度量可能串到第一个匹配节点**。规避：同页多实例时给度量节点套不同父级，或回归确认单实例场景 |
| 抖音不支持 root-portal | 弹层一律走页内 fixed 兜底（select / dialog / tooltip / autocomplete / mentions / color-picker 同），层级受页面流约束 |
| `uni.pageScrollTo({ selector })` 支持度不一 | anchor 的 scroll-view 内定位请用 `update:scrollIntoView` 事件契约绑到 scroll-view，不要依赖 pageScrollTo(selector) |
| 剪贴板提示 | `uni.setClipboardData` 各端均会弹系统提示，text 的复制反馈文案仍会切换（复制能力本身可用） |

## root-portal 与钉钉等端

`lh-root-portal` 内部用条件编译三分：H5 走 `<teleport to="body">`，微信 / 支付宝按基础库版本走
`<root-portal>`（不达标时降级），抖音 / 钉钉等不支持 root-portal 的端走页内 fixed。
**这是内部组件，使用者不需要关心**，
列在这里是为了说明弹层行为的平台差异来源。
