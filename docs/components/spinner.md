# Spinner 加载圈

基础旋转图形，表示进行中的状态。加载遮罩（LhLoading 服务）内部同样由它呈现。

## 基础用法

五种尺寸：`mini` / `small` / `medium` / `large` / `x-large`，直径由 `@lh-ui/share` core 的 `LH_SPINNER_SIZE_PX` 常量统一映射（12 / 16 / 24 / 32 / 40 px）。

```vue
<template>
  <lh-spinner />
  <lh-spinner size="mini" />
  <lh-spinner size="small" />
  <lh-spinner size="medium" />
  <lh-spinner size="large" />
  <lh-spinner size="x-large" />
</template>
```

## 自定义颜色

`color` 接收任意 CSS color 值；未传时继承当前文本色（`currentColor`）。

```vue
<template>
  <lh-spinner color="#C4A35A" />
  <lh-spinner color="#5B8C5A" />
  <lh-spinner color="#B5462F" />
</template>
```

## 继承文本色

不传 `color` 时图形跟随所在容器的文本色，适合与文字混排。

```vue
<template>
  <view class="row">
    <text>加载中…</text>
    <lh-spinner size="small" />
  </view>
</template>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 尺寸 | `'mini' \| 'small' \| 'medium' \| 'large' \| 'x-large'` | `'medium'` |
| color | 旋转颜色（CSS color 值，未传时继承 currentColor） | `string` | — |
| customClass | 自定义类名 | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## 平台差异

- **旋转动效是纯 CSS animation**，不依赖任何平台 API，全端可用，H5 与微信小程序表现一致。
- **图形载体分端渲染**：H5 端是 svg 描边环（`stroke-dasharray` 双动画，与 Vue3 版逐像素同构）；小程序不支持 svg 模板标签，改用 `view` + `border` 圆环——三边着色构成约四分之三圆弧（与 Vue3 版 72% 弧视觉同构），描边宽度按直径的 10% 内联计算（最小 1px）。两端旋转动画同为 CSS animation，不触及 `transitionend` 等小程序不可靠的能力。
- **颜色走 currentColor**：`color` prop 写入根节点 `color` 内联样式，图形继承之，与 Vue3 版一致。
- **无障碍**：图形为纯装饰，`aria-hidden="true"` 移出无障碍树；进行中状态应由外层容器（如 `role="status"`）承担语义。
- **动效降级**：`prefers-reduced-motion` 降级为静态半环由 `@lh-ui/share` 的 scss 源提供，该媒体查询块在小程序端构建时被整体剔除（WXSS 不支持），所以降级仅 H5 生效。
- **移植结论**：spinner 是纯展示组件（无度量 / 无弹层 / 无 document 依赖），尺寸映射与类名由 `@lh-ui/share` core 纯函数（`getSpinnerClassNames` / `LH_SPINNER_SIZE_PX`）产出，仓内只写响应式胶水。
