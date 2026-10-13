# Card 卡片

信息聚合容器，支持封面、头部、主体、底部与加载占位。

## 基础用法

```vue
<template>
  <lh-card title="水墨">
    <view>卡片内容</view>
  </lh-card>
</template>
```

## 封面与底部

```vue
<template>
  <lh-card title="山水册页">
    <template #cover>
      <image class="cover" src="https://placeholder.invalid/cover.png" mode="aspectFill" />
    </template>
    <view>卡片内容</view>
    <template #footer>
      <view>底部操作</view>
    </template>
  </lh-card>
</template>
```

::: tip 封面内子元素需自设宽度
share 的「封面子元素撑满宽度」规则（`.lh-card__cover > *`）依赖 WXSS 不支持的通配选择器，净化管线会丢弃它。小程序端请给封面内的 `<image>` 等子元素显式写宽度（如 `width: 100%`）。
:::

## 头部右侧操作区

`extra` 插槽渲染在标题右侧，仅在存在 `title` 或 `header` 插槽时出现。

```vue
<template>
  <lh-card title="订单">
    <template #extra>
      <lh-button size="small" text>查看更多</lh-button>
    </template>
    <view>卡片内容</view>
  </lh-card>
</template>
```

## 阴影与可点击

```vue
<template>
  <lh-card shadow="hover" clickable @click="onClick">
    <view>悬停浮起，点击触发事件</view>
  </lh-card>
</template>

<script setup lang="ts">
const onClick = () => console.log('点击卡片')
</script>
```

## 加载占位

```vue
<template>
  <lh-card title="水墨" loading>
    <view>内容加载中时不渲染</view>
  </lh-card>
</template>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 卡片标题（也可用 header 插槽） | `string` | — |
| shadow | 阴影显示时机 | `'always' \| 'hover' \| 'never'` | `'always'` |
| clickable | 整卡可点击（承担 button 键盘语义） | `boolean` | `false` |
| loading | 加载态：内容区以骨架占位 | `boolean` | `false` |
| themeVars | 组件级主题变量（键自动加 `--lh-` 前缀） | `Record<string, string>` | — |
| bgPattern | 花纹背景 URL（如 `var(--lh-pattern-willow)`），不受全局白名单限制 | `string` | — |
| customClass | 自定义类名 | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击整卡（仅 `clickable` 时触发） | `(e: Event)` |

## Slots

| 插槽 | 说明 |
| --- | --- |
| cover | 封面 |
| header | 头部（优先于 title） |
| extra | 头部右侧操作区（依赖头部存在） |
| default | 主体内容 |
| footer | 底部 |

::: tip 键盘激活仅 H5
`clickable` 的卡片在 H5 支持 Enter / Space 键盘激活（对齐 APG button pattern）；小程序无键盘事件，该处理由条件编译在 MP 端剔除。
:::
