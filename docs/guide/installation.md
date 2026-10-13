# 安装

## 依赖

- `@lh-ui/share` 会被自动安装（本库唯一运行时依赖）。
- uni-app Vue3 项目（`@dcloudio/uni-app` 3.x）。
- 微信小程序要求**基础库 ≥ 2.25.2**（root-portal）；低版本会降级为页内 fixed 兜底。

## 方式一：easycom 按需引入（推荐）

安装后，在 `pages.json` 加一条 easycom 规则：

```json
{
  "easycom": {
    "autoscan": false,
    "custom": {
      "^lh-(.*)": "@lh-ui/uniapp/src/components/lh-$1/lh-$1.vue"
    }
  }
}
```

之后模板里直接写标签即可，**不需要 import 与注册**：

```vue
<template>
  <lh-button type="primary" @click="onTap">按钮</lh-button>
</template>
```

::: warning easycom 配置不实时生效
uni-app 为编译性能考虑，**改动 `pages.json` 的 easycom 不会触发重新编译**。改完规则后要改动一下
页面内容（或重启 dev server）才会生效。这是 uni-app 的既有行为，不是本库的问题。
:::

## 方式二：全量注册

不用 easycom 时（例如 H5 工程想全量引入），走 `app.use`：

```ts
// main.ts
import { createSSRApp } from 'vue'
import lhUiUniapp from '@lh-ui/uniapp'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  app.use(lhUiUniapp)
  return { app }
}
```

## 引入样式

**两种方式都要引两个 CSS 产物**（使用方零 sass 依赖，样式已在构建期净化为自足 CSS）：

```ts
// main.ts
import '@lh-ui/uniapp/src/theme/index.css' // 主题变量（page { --lh-* } + page.dark 暗色）
import '@lh-ui/uniapp/src/icon/iconfont.css' // 图标字体（lh-icon 组件依赖）
```

::: tip 为什么是构建期产物而不是 scss 源
uni-app 工程的 sass `loadPaths` 不含 `node_modules`，`@use '@lh-ui/share/...'` 这类
bare specifier 解析不了，直接引用必然编译失败。所以本库构建期输出自足 CSS，
组件 SFC 用 `<style src="./style.css">` 引入。这也意味着**使用方不需要装 sass**。
:::

## 命令式服务要放挂载点

Message / Loading 在小程序里无法 JS 创建 DOM，采用**挂载点模式**。在你需要用的页面
（或根组件）里放一个挂载点组件：

```vue
<template>
  <lh-config-provider :theme="theme">
    <view class="content"><!-- 页面内容 --></view>

    <!-- 命令式服务的挂载点 -->
    <lh-message />
    <lh-loading />
  </lh-config-provider>
</template>

<script setup lang="ts">
import { useLhMessage } from '@lh-ui/uniapp'

const { success } = useLhMessage()
const onTap = () => success('操作成功')
</script>
```

::: danger 未放挂载点会告警
若调用了 `useLhMessage()` 但页面没有 `<lh-message />`，开发期会 `console.error` 明确告警，
**不会静默降级**。这是刻意设计：静默降级会让「调用看似生效、实际没反应」变成隐蔽 bug。
:::

## TypeScript

本库自带类型，组件 Props / 事件都有完整类型推导。easycom 形态下模板内标签的类型由
`uni-app` 的组件类型系统提供（若工程未配置全局组件类型，用 `LhXxxProps` 显式标注即可）。
