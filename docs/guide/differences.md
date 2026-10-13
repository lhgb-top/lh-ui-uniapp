# 与 Vue3 版的 API 差异

本库与 `@lh-ui/vue3`（plus）共享 `@lh-ui/share` 的 core 纯函数，**Props 命名与事件命名基本一致**。
以下是 uni-app 目标平台带来的必然差异；凡未列出的 API，行为与 Vue3 版相同。

## icon：字体渲染而非内联 SVG

| | Vue3 版（plus） | 本库 |
| --- | --- | --- |
| 渲染方式 | 内联 `<svg><path>` | `<text class="lh-iconfont lh-iconfont--<name>">` |
| 颜色 | `currentColor`（继承父级 color） | 显式 `color` prop / 父级 color（CSS 字体颜色，语义等价） |
| 尺寸 | `size` prop | `size` prop（设 font-size） |

小程序不支持 `<svg>` 标签，图标在构建期由 share 的 SVG path 集合转成 iconfont 字体
（base64 内嵌在 `iconfont.css`，37 个图标，24×24 单色）。视觉上是同字形，但本质是字体，
所以 CSS 里**不能**用 `fill` / `stroke`，只能用 `color`。

## input：占位样式走 prop

MP 不支持 `::placeholder` 伪元素。占位样式请用 prop：

```vue
<lh-input placeholder="请输入" placeholder-style="color: #999" />
```

| prop | 说明 |
| --- | --- |
| `placeholder-style` | 占位文本的内联样式字符串 |
| `placeholder-class` | 占位文本的类名（与 style 二选一） |

其余 API（`v-model`、`maxlength`、字数统计 `show-word-limit`、`type`）与 Vue3 版一致。

## select / dialog / tooltip：桌面级能力仅 H5

| 能力 | H5 | 微信小程序 |
| --- | --- | --- |
| 键盘导航（方向键 / 回车 / Esc） | ✅ | ❌ 编译期移除 |
| focus-trap（对话框焦点圈） | ✅ | ❌ 编译期不调用 |
| lockScroll（锁背景滚动） | ✅ | ❌（遮罩拦截兜底） |
| hover 触发（tooltip） | ✅ | ❌，改 click / touchstart |

**tooltip 的 `trigger`**：仍支持 `'click' | 'hover'`，但小程序里 `hover` 无语义——
小程序端请用 `trigger="click"`（或默认值），通过点击 / 触摸触发。

**select 的事件**不变（`update:modelValue` / `change` / `visible-change`），
但「清空」「选中」在 MP 端只能通过点击 listbox 项，没有键盘路径。

## message / loading：挂载点模式

这是**最大的使用方式差异**。Vue3 版是 `createApp + mount 到 document.body`，
调用即弹；小程序没有 document，必须**先放挂载点组件**：

```vue
<!-- 页面里放一次 -->
<lh-message />
<lh-loading />
```

```ts
const { success, closeAll } = useLhMessage()
const loading = useLhLoading()

loading.show({ text: '加载中...' })
// ...
loading.close()
```

详见 [安装 - 命令式服务要放挂载点](/guide/installation#命令式服务要放挂载点)。

::: tip Notification 组件首版缺席
Vue3 版有 `lh-notification`，本库首版**不做**（小程序端价值低，通知一般走系统能力）。
需要通知类提示时用 `lh-message` 替代。
:::

## config-provider：暗色靠类名而非 document

| | Vue3 版 | 本库 |
| --- | --- | --- |
| 暗色切换 | 操作 `document.documentElement` 加 class | 在包裹节点加 `dark` 类（小程序无 document） |
| `theme` prop | `'light' \| 'dark'` | 同（内部实现不同） |

用法不变，都是 `<lh-config-provider :theme="dark">`。本库的 `theme/index.css` 里
暗色变量挂在 `page.dark, .dark` 上，所以暗色作用域跟着 ConfigProvider 的包裹节点走。

## 单位：px 直出

本库**不做 px→rpx 转换**，样式源是 px 基准直出——与 wot-design-uni / uview-plus /
uni-ui / TDesign 等主流 uni 组件库一致（uni 官方编译期也不会自动转 px→rpx）。
若工程配了 `postcss-px-to-rpx` 之类的插件，本库产物会一起被转，无需特别处理。

## 组件 SFC 自带的小程序选项

每个组件的 SFC 都声明了：

```ts
defineOptions({
  name: 'LhXxx',
  options: { virtualHost: true, addGlobalClass: true, styleIsolation: 'shared' },
})
```

- `virtualHost: true` —— 组件不产生多余包裹节点，custom-class / customStyle 能落到目标元素。
- `addGlobalClass: true` —— 组件内可使用全局样式（`app.wxss` / 页面样式）。
- `styleIsolation: 'shared'` —— 样式隔离为共享模式，组件样式与页面样式互相可见。

**使用者不需要在 pages.json 或工程里额外配置这三项**——它们已在组件自身的 json 里声明。
若组件样式异常（类名全在但样式没生效），先检查是不是工程的 `styleIsolation` 覆盖设置覆盖了组件级声明。
