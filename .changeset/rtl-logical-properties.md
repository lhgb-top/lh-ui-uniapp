---
'@lh-ui/uniapp': patch
---

# build-styles 支持逻辑属性与 RTL 覆盖块

share 样式源为支持 RTL 已全面改用逻辑属性（`@lh-ui/share` 的
`rtl-logical-properties.md` changeset）。WXSS 不识别这些属性，净化管线同步升级：

- **逻辑属性双发**：`build-styles.mjs` 对每条逻辑声明在其前插入物理兜底声明
  （`margin-inline-start` → `margin-left` 等，含轴简写拆分、逻辑角圆角、
  `text-align: start|end` 值级降级），原逻辑声明用 `#ifdef H5` 夹住。
  MP 端只见物理兜底（固定 LTR）；H5 端逻辑属性覆盖兜底，完整 RTL 镜像
- **RTL 覆盖块隔离**：含 `[dir='rtl']` 的规则与仅其引用的 `@keyframes *-rtl`
  整体 `#ifdef H5` 包裹（WXSS 无属性选择器，MP 端不产出）
- 未登记降级映射的新逻辑属性（block 轴等）构建期直接抛错，不被静默吞掉
- `pnpm verify:wxss` 的属性选择器门禁因此继续通过（RTL 规则已条件编译包裹）
