---
'@lh-ui/uniapp': minor
---

# 补齐 Form 的 resetFields API，并修正 reset 语义为「恢复初始值 + 清错误」

## 问题（回归实测发现）

两处都只在端到端回归时才暴露：

1. **缺 `resetFields()` API**：plus 仓 expose 了 `resetFields()`（整体重置），本仓只有 `resetField(prop)`（单个）。demo 的「重置」按钮只能写 `formRef.value?.resetField()`——无参调用在 `prop.split('.')` 处抛 `TypeError`，导致 `onReset` 中断，**重置按钮完全失效**（值不清、错误不清、结果文本不回到「未校验」）。

2. **reset 语义错位**：本仓的 `resetField` 把值置为 `''` 后**还调了一次 `validateField`**。于是必填字段重置后必然重新触发校验失败、错误文案又挂回来——用户点「重置」想回到干净初始态，却得到一屏报错。plus 仓的语义是恢复到**初始值快照**且**不重新校验**（与 Element Plus 一致）。

## 修复

对齐 plus 仓契约：

- `useLhForm` 新增 `resetFields()`：遍历字段注册表逐个 `resetField`（用注册表而非 `props.rules`，只重置实际渲染的 form-item）；
- 字段注册表从 `Map<prop, validate>` 升级为 `Map<prop, { validate, reset }>`——form-item 原本就有 `reset()`（清错误文案），只是没注册给 form；
- 新增 `initialValues` 快照：form-item 挂载注册时用 share 的 `getFormFieldValue` 拍下初始值，`resetField` 恢复到这里（无快照时保持空串兜底）；
- `resetField` 去掉末尾的 `validateField` 调用，改为调字段的 `reset()` 清除错误文案；
- `LhFormContext.registerField` 签名加 `reset` 参数；
- demo 页改用 `resetFields()`，`formRef` 类型同步更新；
- 移除 `isEmptyValue` 未使用导入。

## 验证

- `pnpm vitest run`：15 文件 98 用例全过（form 单测更新为「恢复初始值 + 清错误」语义，新增 `resetFields` 用例）
- `pnpm lint`：无报错、无警告
- 浏览器回归（H5 dev）端到端：空值校验 → 报「请输入姓名 / 请输入邮箱」；填合法值 → 通过并弹出成功 message；重置 → 值恢复初始空串、错误清除、结果回到「（未校验）」；**重置后必填字段不再重新报错**（关键回归点）；top / left 标签位置类名正确

## 已知平台特性（非 bug）

重置后输入框 DOM 值不是立即清空——uni-input 对外部 `value` prop 的同步是异步的（约 1 秒内自动追平，任何触发重渲染的操作都会立即纠正）。数据层（model）在 reset 调用时就已正确更新，校验结果可证。
