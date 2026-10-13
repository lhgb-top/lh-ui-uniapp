---
layout: home

hero:
  name: lh-ui uniapp
  text: uni-app 组件库
  tagline: 一套代码，H5 + 微信小程序；组件逻辑与样式源与 Vue3 / Vue2 / React 端同源
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/installation
    - theme: alt
      text: 平台支持
      link: /guide/platform

features:
  - title: 一个 core，多端复用
    details: 组件逻辑（状态机、校验、popper 计算、i18n）是 @lh-ui/share 的纯函数，本库只写响应式胶水；与 Vue3 / Vue2 / React 端行为一致。
  - title: H5 + 微信小程序
    details: 首版覆盖两端。小程序的样式限制（WXSS 白名单、无 svg、无 document）在构建期净化层统一处理，使用方零 sass 依赖。
  - title: easycom 按需
    details: npm 安装 + pages.json 一条规则，模板里直接写标签即用；也可全量 app.use 注册。
  - title: 命令式服务可用
    details: Message / Loading 采用挂载点模式，小程序里也能用命令式调用；未挂载时开发期明确告警，不静默降级。
---

::: tip 与家族其他端的关系
本库是 lh-ui 家族 web 血脉的 uni-app 端，与 `@lh-ui/vue3`（plus）、`@lh-ui/vue2`、`@lh-ui/react`
共享 `@lh-ui/share` 的 core 纯函数与样式源。Props 命名与 Vue3 版基本一致，平台差异见
[与 Vue3 版的 API 差异](/guide/differences)。
:::
