---
'@lh-ui/uniapp': patch
---

修复 lh-select 弹层定位串台与点击穿透

- 弹层 trigger / popper 的 DOM id 原为硬编码 `lh-select-trigger` / `lh-select-popper`，同页多实例时 id 全部重复，`useLhPopper` 的 `querySelector` 永远只命中第一个实例，导致所有弹层都定位到第一个 select 下方。改为按组件实例 uid 生成唯一 id。
- 弹层恢复 `pointer-events: auto` 的适配样式选择器写成了 `.lh-select__popper`，与模板真实类名 `.lh-select__dropdown` 不匹配，规则是死代码；在 `pointer-events: none` 的 `lh-root-portal` 容器内未恢复，真实点击选项会穿透到页面。选择器改为 `.lh-select__dropdown`。
