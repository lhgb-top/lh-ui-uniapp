# Notification 通知

全局通知服务。在视口四角弹出带标题与正文的卡片，常用于需要用户留意的结果反馈。
与 Message / Loading 一样是**挂载点模式**——小程序无法 JS 创建 DOM，页面里需要先放挂载点组件。

## 放置挂载点

在需要通知的页面（或一个常驻的根包裹组件）里放一次：

```vue
<template>
  <lh-config-provider>
    <view><!-- 页面内容 --></view>
    <lh-notification />
  </lh-config-provider>
</template>
```

::: danger 未放挂载点会告警
若调用了 `useLhNotification()` 但页面没有 `<lh-notification />`，开发期会 `console.error`
明确告警，**不会静默降级**。同 Message：静默降级会让「调用看似生效、实际没反应」
变成隐蔽 bug。
:::

## 调用

```ts
import { useLhNotification } from '@lh-ui/uniapp'

const notification = useLhNotification()

notification.success({ title: '成功通知', content: '文档已写入云端' })
notification.info({ title: '信息通知' })
notification.warning({ title: '警告通知' })
notification.danger({ title: '危险通知' })

// 四个角独立弹出
notification.info({ title: '左上角', position: 'top-left' })

// 不自动关闭，手动收尾
const handle = notification.warning({ title: '常驻警告', duration: 0 })
handle.close()

// 关闭全部
notification.closeAll()
```

## 方法

| 方法 | 说明 | 参数 |
| --- | --- | --- |
| （直接调用） | `notification(options)` 打开一条通知 | `(options: LhNotificationOptions)` |
| success / info / warning / danger | 打开对应语义类型的通知 | `(options: LhNotificationOptions)` |
| close | 关闭指定 id 的通知 | `(id: number)` |
| closeAll | 关闭全部 | — |
| config | 修改全局默认配置 | `(config: LhNotificationConfig)` |

## LhNotificationOptions

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题（必填） | `string` | — |
| content | 正文内容 | `string` | — |
| type | 语义类型 | `'success' \| 'info' \| 'warning' \| 'danger' \| 'error'` | `'info'` |
| duration | 自动关闭毫秒数，0 为不自动关闭 | `number` | `4500` |
| position | 弹出位置 | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` |
| showClose | 显示关闭按钮 | `boolean` | `true` |
| sx | sx 快速布局属性 | `LhSxProps` | — |
| onClick | 点击卡片回调（传入后卡片以 button 语义呈现） | `() => void` | — |
| onClose | 关闭（含自动与手动）后的回调 | `() => void` | — |

::: tip error 类型
`error` 是 `danger` 的别名语义（share core 的 `LhNotificationType` 包含它），
服务方法与 plus 一致只暴露 success / info / warning / danger；需要 error 时
直接调用 `notification({ title: '...', type: 'error' })`。
:::

## 全局配置

```ts
const notification = useLhNotification()
notification.config({ duration: 3000, offset: 24 })
```

| 配置 | 说明 | 默认值 |
| --- | --- | --- |
| duration | 默认自动关闭毫秒数，0 为不自动关闭 | `4500` |
| offset | 距视口边缘偏移（px） | `20` |

## 行为说明

- **四角独立容器**：记录按 `position` 分组渲染，同一角内按时间正序堆叠
  （贴底两角为 `column-reverse`，新通知贴近底边）；堆叠间距由样式源
  `--lh-notification-gap`（默认 16px）控制。
- **自动关闭**：`duration` 毫秒后自动移除并触发 `onClose`；`duration: 0` 表示常驻。
- **点击卡片**：不关闭（与 plus 一致），只触发 `onClick`；关闭只走关闭按钮或自动计时。
- **无障碍**：四角容器 `role="region"` + `aria-live="polite"`；
  传入 `onClick` 后卡片以 `role="button"` 呈现；关闭按钮带语言包 `notification.close`
  的无障碍名称（share 语言包已收录，切语言自动更新）。

## 平台差异（与 Vue3 版的差异）

- **挂载点模式**：plus 用 `createApp` 把 host 挂到 `document.body`；小程序没有 `document`，
  改为「模块级单例 store + 页面放 `<lh-notification />` 挂载点组件」，
  API 通过 `useLhNotification()` 暴露（plus 是 `LhNotification` 直接调用 + install 注册）。
- **没有 `appendTo`**：web 端可选挂载容器，小程序没这个概念，弹出位置由挂载点组件渲染的
  四角 fixed 容器决定。
- **进出动画降级**：plus 用 `TransitionGroup` 做滑入 / FLIP 让位；小程序端
  `transitionend` 不可靠，首版直接增删节点不做动画（样式源里的过渡类名保留，
  H5 使用方如自行包 Transition 可复用）。
- **可点击卡片的键盘语义不移植**：plus 对传入 `onClick` 的卡片补 `tabindex` 与
  回车 / 空格键触发；小程序无 DOM 焦点模型，仅保留点击与 `role="button"` 语义。
