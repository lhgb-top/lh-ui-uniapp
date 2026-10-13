# 平台支持

## 首版平台范围

| 平台 | 状态 | 说明 |
| --- | --- | --- |
| **H5** | ✅ 完整 | 所有组件全功能 |
| **微信小程序** | ✅ 完整（部分降级） | 弹层类组件的桌面级能力降级，见下表 |
| 支付宝 / 抖音小程序 | 🚫 首版不支持 | 后续按条件编译逐端验证后加列 |
| App（nvue） | 🚫 不做 | nvue 渲染体系与 webview 不同，不在路线内 |

## 各组件能力矩阵

「降级」指**平台不支持的能力被编译期守卫直接移除**（小程序包里没有死代码），不是运行时失败。

| 组件 | H5 | 微信小程序 | 降级策略 / 说明 |
| --- | --- | --- | --- |
| config-provider | 完整 | 完整 | provide/inject + 内联 CSS 变量全平台可用；暗色靠 `page.dark` 类切换（无 document） |
| button / tag | 完整 | 完整 | — |
| icon | 完整 | 完整 | iconfont 字体方案（web 端是内联 SVG，见下「icon 渲染差异」） |
| input | 完整 | 完整 | 占位样式走 `placeholder-style` prop（MP 不支持 `::placeholder`） |
| checkbox / radio / switch | 完整 | 完整 | **view 自绘**（不用原生组件，统一 lh 视觉语言） |
| form / form-item | 完整 | 完整 | 校验逻辑在 core 纯函数，零平台依赖 |
| select | 完整 | 降级 | root-portal + 两帧度量定位；**键盘导航仅 H5**，MP 靠点击 + scroll-view |
| dialog | 完整 | 降级 | root-portal；**focus-trap / lockScroll 仅 H5**，MP 由遮罩拦截兜底 |
| tooltip | 完整 | 降级 | 两帧度量定位；**无 hover**，MP 端点击 / 触摸触发 |
| message / loading | 完整 | 完整 | 挂载点模式（小程序无 document，不能 JS 创建 DOM） |

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

## root-portal 与钉钉等端

`lh-root-portal` 内部用条件编译三分：H5 走 `<teleport to="body">`，微信走 `<root-portal>`，
钉钉等不支持 root-portal 的端走页内 fixed。**这是内部组件，使用者不需要关心**，
列在这里是为了说明弹层行为的平台差异来源。
