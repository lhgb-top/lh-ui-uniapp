---
'@lh-ui/uniapp': minor
---

# M4.9：补齐 plus 对齐缺口 7 组件 + 平台矩阵加列（支付宝 / 抖音小程序，实验性）

- 对照 plus 注册清单补齐此前计划未登记的 7 个组件（easycom 自动引入，登记进
  registry + 命名导出 + `registry.spec` 有序断言同步）：
  - `lh-result`：四态结果页（success / warning / error / info），状态图标与类名走
    share core，三插槽（title / subTitle / extra）+ 自定义图标。
  - `lh-text`：标题级别 / 语义色 / 修饰 / 省略 / 复制。复制收口到新增
    `src/adapter/clipboard.ts`（H5 `navigator.clipboard` / MP `uni.setClipboardData`）；
    MP 端读不到插槽文本，新增 `copy-text` prop 作为唯一文本来源。
  - `lh-link`：语义类型 / 下划线形态 / 禁用 / 前后缀插槽。`<a>` 降级为 view + `@click`
    （导航交业务层）；aria 属性包按坑 16 摊开绑定。
  - `lh-input-tag`：触发键 / 上限 / 去重 / 点删。MP 端无键盘事件：提交走 `@confirm`
    （完成键），Backspace 删尾与 space / comma 触发守 H5-only；× 按钮点删为 MP 主路径。
  - `lh-autocomplete`：输入即过滤的建议输入框。弹层套 lh-select 的 root-portal +
    两帧度量范式（plus 是手搓 Teleport + fixed）；键盘导航 / Esc 守 H5-only。
  - `lh-mentions`：`@` 触发提及。光标上下文 H5 读原生 `selectionStart`，MP 端以文本
    末尾近似（在已输入文本中间触发提及的场景失效，平台矩阵已登记）。
  - `lh-color-picker`：饱和度板 / 色相 / 透明度三拖拽轴照 lh-slider 的元素级
    touchstart/move/end 范式（H5 另走 document 级鼠标监听，条件编译守卫）；
    面板内 hex/rgb 输入走 `@confirm` / `@blur` 提交；颜色数学全部复用 share 纯函数。
- **平台加列（支付宝 + 抖音小程序，🧪 实验性——编译期门禁可过，真机回归待使用者）**：
  `platform.ts` 新增 `LH_IS_MP_ALIPAY` / `LH_IS_MP_TOUTIAO` 编译期常量；**修复既有缺陷**
  `getLhLibVersion()` 只覆盖微信（支付宝端 root-portal 恒渲染空节点，现按基础库版本
  正确降级）；manifest.json / package.json 加两端平台段与构建脚本。已知限制登记：
  支付宝 `selectorQuery.in()` 无效（同页多实例度量串节点风险）、抖音无 root-portal
  （弹层页内 fixed）、`uni.pageScrollTo({ selector })` 两端支持度不一。
- 样式净化管线（`scripts/build-styles.mjs`）新增 `:has()` 整规则 H5-only
  （input-tag 的聚焦边框 `:has(...input:focus)`，WXSS 完全不支持），
  `verify-wxss.mjs` 同步加禁。依赖 share 仓补 `.lh-color-picker__clear` 样式段
  （plus 此前同样裸奔，share 仓已留 changeset）。
- 配套：7 个演示页 + pages.json + 首页列表（demo-pages 守卫三向对齐）、7 份组件 spec、
  平台矩阵 / 回归清单 / 计划文档 §二矩阵加两列 + §十四 M4.9 里程碑 + §二十 D-11
  偏离登记、`componentItems` 九语言 labels、文档 9 语种 × 7 组件
  （见 `docs/guide/platform.md` 的支付宝 / 抖音限制速查）。
