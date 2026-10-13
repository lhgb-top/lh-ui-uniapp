---
"@lh-ui/uniapp": minor
---

跟随 share 仓命名规范收敛，同步本仓全部引用（breaking rename，机械替换）

`@lh-ui/share` 已把非第三方公共符号补齐 `LH` 前缀（见 share 的 `lh-prefix-naming` changeset），
本仓同步消费侧改名，本地联动即时生效：

- `SxProps` → `LhSxProps`（`components/lh-*` 全量组件 Props 声明）
- `ComputePositionOptions` → `LhComputePositionOptions`、
  `PopperPosition` → `LhPopperPosition`（`src/adapter/popper.ts`）
- `LocalePath` → `LhLocalePath`（`src/adapter/locale.ts` 再导出）

顺带收掉一处重复声明：`src/adapter/getRect.ts` 原本本地重复声明了 `DOMRectLike`，
share 改名后本仓改为 `export type { LhDOMRectLike } from '@lh-ui/share/core/shared/popper'`
直接复用权威类型，度量结果与 `computePosition` 入参类型同源，不再有两份声明。

用户侧迁移：从 `@lh-ui/uniapp` 引入的类型名按上表改 import 即可；`zhCN` / `enUS` 不变。
