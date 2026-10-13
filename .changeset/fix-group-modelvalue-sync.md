---
'@lh-ui/uniapp': patch
---

# 修复 CheckboxGroup / RadioGroup 外部改 modelValue 不传导给子项（全选/反选、重置失效）

## 问题

`<lh-checkbox-group v-model="list">` 与 `<lh-radio-group v-model="value">` 存在**单向通路**：

- 子项点击 → 更新内部数组 → `emit('update:modelValue')` → 父组件更新：**正常**；
- 父组件整体改 `modelValue`（全选赋值、反选清空、上一步/下一步重置）→ 子项勾选态：**不更新**。

实测 Checkbox demo 的「全选与反选」区：点「全选」后全选框自己选中，但「一、二、三」纹丝不动，再点也只切换全选框自身。

根因是 group 胶水把 props **存成了初始快照**：

```ts
const values = ref(props.modelValue ?? [])   // 只取初始值，后续 props 变化不同步
```

provide 给子项的是这个内部 ref，子项的 `isChecked` 读的是 `group.values.value`，所以外部怎么改都传不进去。RadioGroup 的 `modelValue` 是同一个毛病。

顺带发现 `disabled` / `size` / `name` 也被存成快照 `ref(...)`——而 `types.ts` 的 `LhCheckboxGroupContext` 注释明确写着「红线 #6：provide 的是 computed ref 本体，禁止 props 快照（动态禁用/改尺寸需传导）」，实现与设计意图相悖，动态改 group 的 `disabled` / `size` 同样不生效。

## 修复

- `values` / `modelValue` 保留为可写 ref（`toggle` / `onChange` 要改它），补 `watch(() => props.modelValue)` 同步外部变更。`toggle` 内部先改 ref 再 `emit`，父组件 v-model 回写的是同一份数组/同一原始值，watch 触发时为同值赋值，不引发额外渲染，无环。
- `disabled` / `name` / `size` 改为 `computed` 直接引用 props，对齐红线 #6 的设计意图。

## 验证

- `pnpm vitest run`：15 文件 97 用例全过（新增 2 条回归用例，覆盖「外部整体赋值 → 子项同步」的全选 / 反选 / 重置场景）
- 浏览器回归（H5 dev）：
  - Checkbox「全选与反选」：全选 → 一二三全选；再点 → 全部取消；只选一个 → 全选框进不确定态；不确定态点全选 → 全选（含不确定态过渡全部正确）
  - Radio 单选组：水墨 → 留白 → 丹青来回切换，每次严格互斥、回显同步
  - 禁用项点击无响应（`cursor: not-allowed`），已选禁用保持原选中态
