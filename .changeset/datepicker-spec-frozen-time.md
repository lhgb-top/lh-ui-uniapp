---
'@lh-ui/uniapp': patch
---

date-picker 单测时间炸弹修复：`moves the grid focus with arrow keys` 等用例依赖系统当前日期（注释写死「今天 = 2026-11-03」），真实日期跨日后断言自动失效（今日 11-04 复现 1 处失败）。现在所有打开面板的用例如 time-picker.spec 先例统一 `vi.setSystemTime(new Date(2026, 10, 3))` 冻结到基准日，断言不再随真实日期漂移；运行时行为无变化。
