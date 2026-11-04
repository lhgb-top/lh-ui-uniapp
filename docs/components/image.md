# Image 图片

带加载失败占位的图片，可选点击预览（走 `uni.previewImage` 原生 API，全端可用）。
裁切模式映射 uni `<image>` 的 `mode`，懒加载用组件自带的 `lazy-load`；
预览列表归一化与状态类名由 `@lh-ui/share` core 纯函数产出。

## 基础用法

```vue
<template>
  <lh-image src="https://picsum.photos/240/140" alt="示例图片" :sx="{ w: '240px', h: '140px' }" />
</template>
```

`alt` 在 TS 层必填，杜绝无替代文本的图片。uni `<image>` 默认 320×240，
尺寸用 `sx` 的 `w` / `h`（或 style）显式给出；圆角由 share 样式源内置
（`--lh-border-radius-small`），无需配置。

## 填充模式

`fit` 描述 CSS object-fit 的语义，映射到 uni `<image>` 的 `mode`：
`contain` → `aspectFit`、`cover` → `aspectFill`、`fill` → `scaleToFill`。

```vue
<template>
  <lh-image src="https://picsum.photos/240/140" alt="撑满裁切" fit="cover" :sx="{ w: '110px', h: '80px' }" />
  <lh-image src="https://picsum.photos/240/140" alt="完整展示" fit="contain" :sx="{ w: '110px', h: '80px' }" />
  <lh-image src="https://picsum.photos/240/140" alt="拉伸铺满" fit="fill" :sx="{ w: '110px', h: '80px' }" />
</template>
```

::: tip none / scale-down 为近似映射
`none` 映射 `center`（不缩放、只显示中间区域，与 object-fit: none 语义一致）；
uni 无 `scale-down` 等价模式，取语义最接近的 `aspectFit`（与 lh-avatar 同款偏离登记）。
:::

## 懒加载

`lazy` 开启 uni `<image>` 自带的 `lazy-load`（进入视口才加载）。

```vue
<template>
  <scroll-view scroll-y style="height: 140px; width: 100%">
    <lh-image
      v-for="i in 4"
      :key="i"
      :src="`https://picsum.photos/240/120?random=${i}`"
      :alt="`懒加载图片 ${i}`"
      lazy
      :sx="{ w: '240px', h: '120px', mb: 1 }"
    />
  </scroll-view>
</template>
```

微信端 `lazy-load` 只对 page 与 scroll-view 下的 image 生效。

## 加载失败

加载失败时切换为失败占位（根节点追加 `lh-image--error`），默认文案走语言包
`image.error`（九语言齐备），也可用 `error` 插槽自定义；同时发出 `error` 事件。

```vue
<template>
  <lh-image src="https://invalid.example.com/not-found.png" alt="默认失败占位" :sx="{ w: '240px', h: '140px' }" />
  <lh-image src="https://invalid.example.com/not-found.png" alt="自定义失败占位" :sx="{ w: '240px', h: '140px' }">
    <template #error>自定义失败占位</template>
  </lh-image>
</template>
```

## 点击预览

`preview` 开启后点击图片拉起 `uni.previewImage` 原生预览（全端可用）；
`preview-src-list` 传入多图列表，未传时退化为 `[src]`（与 plus 的归一化口径一致，
初始下标固定 0）。

```vue
<template>
  <lh-image
    src="https://picsum.photos/240/140"
    alt="多图预览"
    preview
    :preview-src-list="[
      'https://picsum.photos/600/400?random=1',
      'https://picsum.photos/600/400?random=2',
      'https://picsum.photos/600/400?random=3',
    ]"
    :sx="{ w: '240px', h: '140px' }"
  />
  <lh-image src="https://picsum.photos/240/140" alt="单图预览" preview :sx="{ w: '140px', h: '140px' }" />
</template>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| src | 图片地址 | `string` | — |
| alt | 替代文本（a11y 强约束，TS 层必填） | `string` | — |
| fit | 裁切模式（映射 uni image 的 mode） | `'contain' \| 'cover' \| 'fill' \| 'none' \| 'scale-down'` | `'cover'` |
| preview | 是否可点击预览 | `boolean` | `false` |
| preview-src-list | 预览图列表（未传时退化为 [src]） | `string[]` | — |
| lazy | 懒加载（uni image 原生 lazy-load） | `boolean` | `false` |
| customClass | 自定义类名（透传到根节点） | `string` | — |
| sx | sx 快速布局属性 | `LhSxProps` | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| load | 图片加载成功时触发 | `(event: Event)` |
| error | 图片加载失败时触发（切换为失败占位） | `(event: Event)` |

## Slots

| 插槽 | 说明 |
| --- | --- |
| error | 加载失败占位内容（默认走语言包 image.error） |

## 平台差异

- **预览走 `uni.previewImage` 原生 API**（全端可用）：plus 的预览是自绘 Viewer 弹层
  （teleport 到 body，缩放 / 旋转 / 多图切换 / Esc 关闭 / 焦点圈），小程序没有 document，
  无法照搬。uniapp 端改调 `uni.previewImage`——H5 由 uni 运行时实现浮层、微信端走原生
  预览页面，交互能力由平台提供，**没有遮罩透明度 / 关闭按钮 / 工具栏的自定义能力**。
  plus 的 `LhImageViewer` 独立组件不在本仓交付范围。
- **fit → mode 映射**：`contain` / `cover` / `fill` 映射 `aspectFit` / `aspectFill` /
  `scaleToFill`；`none` 映射 `center`；`scale-down` 无等价模式，取最接近的 `aspectFit`
  （与 lh-avatar 同款偏离登记）。`object-fit` 的 CSS 实现只对 H5 的真实 `<img>` 生效，
  uni `<image>` 跨端统一由 `mode` 控制。
- **懒加载**：uni `<image>` 自带 `lazy-load`（替代 plus 的 `loading="lazy"`）；
  微信端仅 page 与 scroll-view 下的 image 生效。
- **尺寸与圆角**：uni `<image>` 默认 320×240，尺寸用 `sx` / style 显式给出；圆角由
  share 样式源的 `--lh-border-radius-small` 内置。plus 同样没有 width / height / radius
  prop（尺寸走 sx、圆角走样式源），本仓不私自新增。
- **alt**：MP 端 `<image>` 没有 alt 概念（H5 端作为属性透传），无障碍兜底能力弱于
  Web 的 `<img alt>`，TS 层必填的约束保留。
- **viewer 样式残留**：share 样式源含 `.lh-image-viewer*` 规则（plus 自绘弹层样式），
  按样式唯一源约束进入本组件 style.css 产物，两端都无对应节点（无害冗余，
  且仍守 WXSS 白名单：`:hover` / `:focus` 系列已条件编译为 H5-only）。

::: tip 与 Vue3 版的差异
- 逻辑口径（预览列表归一化、加载状态、类名）与 plus 完全一致（同一 share core）。
- 预览由自绘 Viewer 弹层改为 `uni.previewImage` 原生 API（见「平台差异」）。
- 增加了 `customClass` prop：uni-app 端自定义类名无法穿透 styleIsolation，统一走 prop 透传。
- fit 在小程序端的 `none` / `scale-down` 为近似映射（见「平台差异」）。
:::
