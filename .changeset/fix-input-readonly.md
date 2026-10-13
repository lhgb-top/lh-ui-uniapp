---
'@lh-ui/uniapp': patch
---

# 修复 readonly 输入框可被编辑（uni-app 平台缺口补丁）

## 问题

`<lh-input readonly>` 在 H5 与小程序端**均可正常输入并改掉 modelValue**，只读语义完全失效。

根因是 uni-app 平台缺口：

- uni 的 `input` / `textarea` 组件**不支持 readonly 属性**。H5 端 `uni-input` 只在 `disabled` 分支内部给原生 `<input>` 绑 `readonly`（条件 `props.disabled && fixDisabledColor`），组件本身不接收外部 readonly——外层传的 `:readonly` 落到根容器 `uni-view` 上，对内层输入框无效；
- 微信小程序原生 `input` 组件同样只有 `disabled`、没有 `readonly`；
- share 的样式源也没有任何 `.lh-input--readonly` 规则，CSS 层无拦截。

对照：plus 仓 web 端在 `<input>` / `<textarea>` 上直接绑 `:readonly="props.readonly"`（`index.vue:29 / :75`），靠原生属性在 DOM 层禁止输入，uniapp 仓此前两个元素都漏绑了这一行，且平台也不支持。

## 修复

uni-app 端无法复用 web 的 DOM 级拦截，改用**逻辑层拦截 + 模板对齐**双管：

- `logic.ts` 的 `handleInput` / `handleBlur` 开头 `if (props.readonly) return`：拦截 uni 输入事件，不更新 `modelValue`、不触发 `input` / `blur`，保住「可聚焦、可选中复制、参与表单提交，但值不可改」的只读语义；
- `lh-input.vue` 的 `<input>` / `<textarea>` 补绑 `:readonly="props.readonly"`：与 plus 契约对齐，平台将来支持时自动在 DOM 层生效；
- `types.ts` 的 `readonly` prop 补注释，登记平台局限与「瞬态字符下次渲染回弹」的行为说明。

## 已知局限（非本次能修）

用户在只读框里敲入的字符会**瞬态留在原生框里**，直到下一次渲染被受控的 `value` 回弹——这是 uni-app input 组件不支持 readonly 的直接后果。彻底修到「完全敲不进去」需要把 readonly 降级为 disabled（微信小程序生态通用做法），但那会改变只读框的视觉与表单提交语义，且 `.lh-input--readonly` 的区分样式在 share 仓（本仓不可改），故登记为平台局限，未强行降级。

## 验证

- `pnpm vitest run`：15 文件 95 用例全过
- `pnpm lint`：无报错
- 浏览器回归（H5 dev）：基础框输入回显正常（`水墨江南`）；只读框敲入字符后 `modelValue` 不变（拦截生效）；禁用框 `disabled=true`、`cursor: not-allowed`；字数统计超 20 字被 `maxlength` 硬截断并显示 `20/20`；清除按钮点击后值清空、计数回 `0/20`、按钮按条件消失
