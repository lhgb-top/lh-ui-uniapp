---
'@lh-ui/uniapp': patch
---

# 滚动锁引用计数：dialog 等 H5 弹层

`adapter/lock-scroll.ts` 的 `lockLhBodyScroll` 原为自实现的单层锁（restore 直接把 overflow / paddingRight 写回空串）。改为复用 share 新模块 `lockScrollTarget` / `unlockScrollTarget` 的引用计数——与 plus / vue2 / react 的弹层族共用同一把 body 锁，多弹层叠加时先关者不提前解锁、后关者不按过期快照锁死。滚动条宽度补偿只在首个锁（计数 0→1）写入、归零时清除，避免多弹层重复补偿错位。
