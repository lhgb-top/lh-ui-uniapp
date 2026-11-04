---
'@lh-ui/uniapp': patch
---

# C2 批次验证修复（组件 bug + 测试基建）

> 本批次为 M4.6/M4.7 三十件补齐后的验证修复：单测 59 文件 626 用例全过、verify:wxss 55 产物零违规、typecheck / lint 零错误（2026-11-03，用户授权 AI 代跑）。

**组件真 bug（7 项）**
- **dialog**：MP 端 `handleEsc` 悬空引用——函数声明整体在 `#ifdef H5` 块内、返回对象无条件引用，MP setup 执行即 ReferenceError；改为「函数体双端存在、仅语句裁剪」范式（同 popover / dropdown / drawer）。
- **date-picker**：面板永远渲染年份视图——logic 未返回 `viewMode` 且 SFC 解构缺失，模板取值恒 undefined；补齐两处。
- **date-picker / cascader / time-picker**：遮罩点击关闭后被根节点 `@click="toggleOpen"` 冒泡重新打开（面板打开状态下点遮罩无效）；遮罩改 `@click.stop`。
- **notification**：share 分组函数为契约完整性保留全部 4 个方位空位，模板未过滤空组导致渲染 4 个空 region 容器；胶水层过滤空组。
- **sub-menu**：飞出方位判定死代码——`childDepth > 0` 恒真（childDepth = 父 depth + 1），横向根子菜单错误走 right-start；改为判父级 depth（与 plus 同口径）。另 Enter 展开后同步查询焦点目标，面板 v-if 尚未渲染致焦点落空，改 nextTick 后查询。
- **transfer**：模板引用 `checkedKeys` 但 logic 未返回、SFC 未解构（渲染即 TypeError）；两处补齐。
- **menu**：ASI 陷阱——`event.preventDefault()` 下一行紧跟圆括号表达式，无分号风格下被解析为链式调用，Home / End 键盘导航运行时崩溃（undefined is not callable）；提取 target 变量。

**脚本与类型（4 项）**
- **vitest.config**：条件编译预处理器的平台解析未剥注释尾（`<!-- #ifdef H5 -->` 的 `-->` 被吃进平台名），`'H5 -->'` 永不命中导致模板 ifdef 分支被反转删除；补 `-->` / `*/` 剥离。
- **build-styles**：补 block 轴逻辑属性降级映射（`margin-block-*` / `padding-block-*` 起止边与轴简写），calendar / menu 的 share scss 使用后 build:styles 抛错。
- **upload**：chooseImage 调用补存在性守卫（明确报错不静默）；`Function` 宽类型改显式调用契约 `LhChooseFn`。
- 全仓 aria 值域收窄：`aria-haspopup` 收窄到 Vue 字面量联合、slider `aria-disabled` 改布尔、tree `checkedAria` 收窄字面量、calendar 私有接口上移导出、timeline token 类型 `object[]` → `symbol[]`。

**测试时序经验（沉淀给后续波次）**
- 受控组件（date-picker / cascader / time-picker / transfer）的清除 / 穿梭断言前需 `setProps` 回写。
- VTU `trigger('scroll')` 创建的 UIEvent `detail` 只读恒 0，uni 载荷事件须 CustomEvent 直派（pagination jumper / tree 虚拟滚动同款）。
- 程序化 focus 断言需 `attachTo: document.body`；jsdom 对 tabindex 翻回 -1 的已聚焦元素会强制 blur（真实浏览器不会），此类断言用 focus 间谍。
- 父子注册类组件（breadcrumb / timeline / steps）的末项判定收敛跨两拍，断言前 `await nextTick()` × 2。
