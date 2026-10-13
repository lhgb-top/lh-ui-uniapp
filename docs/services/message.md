# Message 消息提示

全局消息提示服务。**采用挂载点模式**——小程序无法 JS 创建 DOM，页面里需要先放挂载点组件。

## 放置挂载点

在需要消息提示的页面（或一个常驻的根包裹组件）里放一次：

```vue
<template>
  <lh-config-provider>
    <view><!-- 页面内容 --></view>
    <lh-message />
  </lh-config-provider>
</template>
```

## 调用

```ts
import { useLhMessage } from '@lh-ui/uniapp'

const message = useLhMessage()

message.success('保存成功')
message.info('提示信息')
message.warning('警告信息')
message.danger('错误信息')
message.error('错误信息（danger 别名）')

// 不自动关闭的加载提示（duration: 0），手动关闭
const handle = message.loading('加载中...')
// ...异步完成后
handle.close()

// 关闭全部
message.closeAll()
```

::: danger 未放挂载点会告警
若调用了 `useLhMessage()` 但页面没有 `<lh-message />`，开发期会 `console.error`
明确告警，**不会静默降级**。这是刻意设计：静默降级会让「调用看似生效、实际没反应」
变成隐蔽 bug。
:::

## 方法

| 方法 | 说明 | 参数 |
| --- | --- | --- |
| （直接调用） | `message('xxx')` 等价于 `message.info('xxx')` | `(options: LhMessageOptions \| string)` |
| success / info / warning / danger / error | 弹出对应类型的消息 | `(content: string, options?: Partial<LhMessageOptions>)` |
| loading | 弹出不自动关闭的加载提示（`duration: 0`），返回 handle 手动关闭 | 同上 |
| close | 关闭指定 id 的消息 | `(id: number)` |
| closeAll | 关闭全部 | — |

## LhMessageOptions

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 文案（必填） | `string` | — |
| type | 类型 | `'success' \| 'info' \| 'warning' \| 'danger' \| 'loading'` | `'info'` |
| duration | 显示时长（毫秒），0 为不自动关闭 | `number` | `3000` |
| showClose | 显示关闭按钮 | `boolean` | `false` |
| offset | 距顶偏移（px） | `number` | — |
| onClose | 关闭回调 | `() => void` | — |

## 全局配置

```ts
const message = useLhMessage()
message.config({ duration: 2000, max: 5, offset: 20 })
```

| 配置 | 说明 | 默认值 |
| --- | --- | --- |
| duration | 默认显示时长（毫秒） | `3000` |
| max | 同屏最大条数 | — |
| offset | 距顶偏移 | — |

::: tip 与 Vue3 版的差异
- **没有 `appendTo`**：web 端往 `document.body` 挂，小程序没这个概念，挂载点位置由
  `<lh-message />` 在页面里的位置决定。
- 进出动画用 CSS transition + setTimeout 对齐时长（`transitionend` 在小程序不可靠）。
- 通知类组件（Notification）首版缺席，用 Message 替代。
:::
