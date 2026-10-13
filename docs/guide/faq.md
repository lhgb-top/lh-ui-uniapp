# 常见问题

## 1. easycom 配置改了不生效

**现象**：在 `pages.json` 加了 easycom 规则，或改了规则，但模板里的 `<lh-xxx>` 还是报「组件未注册」。

**原因**：uni-app 为编译性能考虑，**改动 `pages.json` 的 easycom 不会触发重新编译**。

**解法**：改动规则后，改动一下任一页面内容（敲个空格保存即可）触发重编译；或直接重启 dev server。

## 2. ref 拿不到组件 / 度量返回空

**现象**：`onLoad` 里调组件 ref 方法，或调 `getLhRect` / `useLhPopper` 相关能力，拿到 undefined 或空矩形。

**原因**：`onLoad` 阶段组件尚未创建完毕，子组件实例与节点都还没就绪。

**解法**：所有 ref 调用与节点度量放在 **`onReady` 之后**（`onReady` 对应页面首次渲染完成）：

```ts
import { onReady } from '@dcloudio/uni-app'

onReady(() => {
  // 这里才能安全访问子组件 ref / 度量节点
})
```

## 3. 命令式服务（message / loading）调用后没反应

**现象**：`useLhMessage().success(...)` 调了，控制台有 `console.error` 告警，但页面没出现消息。

**原因**：小程序无法 JS 创建 DOM，命令式服务采用**挂载点模式**——页面里必须先放
`<lh-message />` / `<lh-loading />`，调用只是往单例 store 里推记录，由挂载点组件渲染。

**解法**：在需要的页面（或一个常驻的根包裹组件）里放挂载点：

```vue
<lh-config-provider>
  <view><!-- 内容 --></view>
  <lh-message />
  <lh-loading />
</lh-config-provider>
```

告警是刻意设计的——不静默降级，避免「调用看似生效、实际没反应」的隐蔽 bug。

## 4. 样式没生效 / 类名在但样式缺失

**排查顺序**：

1. 确认引了两个 CSS 产物：`@lh-ui/uniapp/src/theme/index.css` 与 `@lh-ui/uniapp/src/icon/iconfont.css`。
   漏引主题变量时，所有 `var(--lh-*)` 会回退到默认值（颜色、圆角全不对）。
2. 确认没有覆盖组件级的 `styleIsolation`。组件 SFC 自带 `styleIsolation: 'shared'` +
   `addGlobalClass: true`；若工程级配置强制了更严格的隔离，组件样式会互相不可见。
3. 自定义样式请通过 `custom-class` / `custom-style` prop 传入，不要在页面里直接写
   组件内部 BEM 类名（`.lh-button__text` 之类的内部类名不属于公开 API）。

## 5. 小程序包体积里怎么有 iconfont 的 base64

那是图标字体（约几十 KB），内嵌在 CSS 里随包发布。小程序不支持 `<svg>` 标签，
图标必须走字体方案；base64 内嵌是因为小程序的 `@font-face` 不允许引本地字体文件
（wxss 里 `url(...)` 只支持网络地址或 base64）。这是 uni-app 图标方案的主流做法。

## 6. H5 里弹层位置正常，小程序里偏了

弹层定位走「两帧度量 → 定位 → 显示」时序（先透明渲染量尺寸，再定位，最后显示防闪烁）。
如果偏了，通常是**调用时序**问题：确认定位触发在 `onReady` 之后，且 trigger 节点已经布局完成。
另外注意小程序的 `getLhRect` 是异步的，不能假设同步拿到结果。

## 7. 暗色模式不生效

暗色变量挂在 `page.dark, .dark` 上，由 ConfigProvider 的包裹节点加 `dark` 类切换。
确认 `<lh-config-provider :theme="dark">` 确实包裹住了需要暗色的内容范围
（不像 web 端挂在 document.documentElement 上是全局的，本库的作用域跟着包裹节点走）。
