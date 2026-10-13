# Loading 加载

全局加载遮罩服务。与 Message 同样是**挂载点模式**。

## 放置挂载点

```vue
<template>
  <lh-config-provider>
    <view><!-- 页面内容 --></view>
    <lh-loading />
  </lh-config-provider>
</template>
```

## 调用

```ts
import { useLhLoading } from '@lh-ui/uniapp'

const loading = useLhLoading()

// show 接收选项对象或纯文案字符串，返回 handle
const handle = loading.show({ text: '加载中...' })
handle.close()

// 关闭全部
loading.closeAll()
```

::: danger 未放挂载点会告警
同 Message：调用了 `useLhLoading()` 但页面没有 `<lh-loading />` 时，
开发期 `console.error` 明确告警，不静默降级。
:::

## LhLoadingOptions

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| target | 目标节点（**仅 H5 生效**；MP 端恒为全屏） | `string` | — |
| text | 加载文案 | `string` | — |
| background | 遮罩背景色 | `string` | — |
| lock | 锁定滚动（**仅 H5 生效**） | `boolean` | `false` |
| zIndex | 层级；不传时自增分配 | `number` | — |

## 方法

| 方法 | 说明 | 参数 |
| --- | --- | --- |
| show | 显示加载遮罩，返回 handle（`{ close }`） | `(options: LhLoadingOptions \| string)` |
| close | 关闭指定 id 的加载 | `(id: number)` |
| closeAll | 关闭全部 | — |

## 与 Vue3 版的差异

- `target` 在小程序端**只支持全屏遮罩**——小程序无法选择任意节点挂遮罩，
  首版 MP 端忽略 `target`（字段保留，文档声明）。
- `lock` 仅 H5 有效；小程序无 body 滚动锁定。
- 多个实例叠加时，`useLhZIndex` 保证后开的遮罩在上层。
