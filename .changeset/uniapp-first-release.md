---
'@lh-ui/uniapp': minor
---

# 首版：P0 十二组件 + message / loading 命令式服务（H5 + 微信小程序）

lh-ui 家族 web 血脉的 uni-app UI 层首版。组件逻辑全部来自 `@lh-ui/share` 的纯函数，
本库只写响应式胶水、SFC 模板与命令式服务；**不含任何 core / 样式 / 文案副本**。

## 组件（easycom 按需引入）

config-provider / button / icon / input / select / checkbox / checkbox-group /
radio / radio-group / switch / tag / form / form-item / dialog / tooltip /
root-portal（弹层挂载内部组件）。

- easycom 规则（npm 安装后）：

  ```json
  "easycom": {
    "autoscan": false,
    "custom": { "^lh-(.*)": "@lh-ui/uniapp/src/components/lh-$1/lh-$1.vue" }
  }
  ```

  配置后模板里直接写 `<lh-button>` 即可，无需 import 与注册。
- 不使用 easycom 时可全量注册：`app.use(lhUiUniapp)`（`import lhUiUniapp from '@lh-ui/uniapp'`）。
- 样式：使用方需引入两个 CSS 产物——`@lh-ui/uniapp/src/theme/index.css`（主题变量）
  与 `@lh-ui/uniapp/src/icon/iconfont.css`（图标字体）。**使用方零 sass 依赖**：
  组件样式已在构建期净化为自足 CSS（见下「平台适配」）。

## 命令式服务（挂载点模式）

`useLhMessage()` / `useLhLoading()`。小程序无法 JS 创建 DOM（plus 的
`createApp + mount 到 body` 在 MP 完全不可用），所以采用**页面放挂载点组件 + hook 操作
模块级单例 store** 的模式：

```vue
<template>
  <lh-config-provider>
    <view><!-- 页面内容 --></view>
    <lh-message />
    <lh-loading />
  </lh-config-provider>
</template>

<script setup>
const { success } = useLhMessage()
const onTap = () => success('操作成功')
</script>
```

**未放置挂载点时开发期 `console.error` 明确告警，不静默降级**——避免「调用看似生效、
实际降级成原生样式」的隐蔽 bug。Notification 首版缺席，用 Message 替代。

## 平台适配（与 Vue3 版的 API 差异）

- 首版平台：**H5 + 微信小程序**。支付宝 / 抖音后续按条件编译逐端验证后加列；
  **nvue / App(nvue) 不做**。
- **暗色模式**：ConfigProvider 通过 `page.dark` / `.dark` 类切换（小程序无 document），
  不靠 `document.documentElement`。
- **icon**：小程序不支持 `<svg>` 标签，改为**编译期把 share 的 SVG path 转成 iconfont
  字体（base64 内嵌）**，组件渲染 `<text class="lh-iconfont lh-iconfont--star">`；
  `color` 完整替代 web 端 `currentColor` 语义。
- **input 占位样式**：MP 不支持 `::placeholder`，走 `placeholder-style` / `placeholder-class` prop。
- **select / dialog / tooltip 弹层**：`root-portal` 挂载 + adapter 层两帧度量定位
  （measure → 定位 → 显示，防闪烁）；**键盘导航 / focus-trap / lockScroll 仅 H5**，
  MP 端由编译期守卫直接不调用（无死代码）。
- **单位 px 直出**，不做 px→rpx 转换（与 wot / uview / TDesign 等主流 uni 组件库一致）。
- **所有 ref 调用须在 `onReady` 之后**（`onLoad` 阶段组件尚未创建完毕）。

## 样式产物与 WXSS 门禁

- 样式唯一源仍是 `@lh-ui/share`；本库**构建期输出自足 CSS 产物**，因为使用方的 uni 工程
  sass 无法解析 `@use '@lh-ui/share/...'` 这类 bare specifier。
- 净化规则（`scripts/build-styles.mjs`）：`:root` → `page`、`svg {}` → `.lh-iconfont`、
  H5-only 规则（`:hover` / `:focus` / `::placeholder` / `@media (prefers-*)`）用
  uni 条件编译注释包裹、`*` 通配映射成 flex + gap。
- `pnpm verify:wxss` 是 WXSS 白名单**硬门禁**：禁用通配 / 属性选择器 / `:not()` /
  `:nth-*` / 非 page 标签选择器 / `:hover` / `::placeholder` 等小程序不支持的选择器，
  命中即报错，保证 MP 端编译不会因样式失败。

## 最低版本要求

- 微信基础库 **≥ 2.25.2**（root-portal）；低版本降级为页内 fixed 兜底。
- `@lh-ui/share` `^0.3.0`；uni-app Vue3 项目（`@dcloudio/uni-app` 3.x）。
