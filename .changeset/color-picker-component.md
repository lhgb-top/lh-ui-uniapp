---
'@lh-ui/uniapp': minor
---

新增 ColorPicker 颜色选择器组件（对齐 plus 仓同构契约，补齐 M4.9 批次最后缺口）：

- **组件四件套**：`src/components/lh-color-picker/`（types.ts 既有 + 新增 SFC / logic.ts；style.css 由 build:styles 从 share `styles/color-picker` 生成，跑 `pnpm build:assets` 后入库）
- **契约**：modelValue（受控 v-model）/ format（hex | rgb，非法回退 hex）/ showAlpha / predefine / size / disabled / clearable / placeholder / ariaLabel / customClass / sx；事件 update:modelValue / change / clear；defineExpose open / close / isOpen
- **颜色数学零拷贝**：parseColorString / rgbToHsv / hsvToRgb / formatColor / clampColor* 全部消费 `@lh-ui/share/core/color-picker`，内部交互态恒为 HSV，提交态按 format 输出
- **拖拽**（D-11 范式）：饱和度板 / 色相 / 透明度三轴，touch 事件直接挂元素（MP 沿 touchstart 目标派发 move/end），H5 另走 document 级鼠标监听（条件编译，MP 包无死代码，同 lh-slider）；轨道度量走 adapter getSingleLhRect 按拖拽会话缓存预热
- **面板**：lh-root-portal 承载 + adapter useLhPopper 两帧度量定位（bottom-start）+ 透明遮罩点击外部关闭（与 select 同构）；键盘（方向键微调 / Enter / Space / Esc）仅 H5 条件编译
- **面板内输入**：uni `<input>` @confirm / @blur 提交（MP 无 keydown.enter），非法输入回显当前生效值不清空
- **注册**：src/index.ts 四处登记（import / lhComponents / 命名导出 / 类型导出），registry 反向扫描断言通过
- **测试**：tests/components/color-picker.spec.ts（14 用例：渲染 / 受控回显 / format 双格式 / 空值 / 非法值 / 面板开关 / disabled / clear / predefine / showAlpha / 输入提交 / expose）
- **依赖**：share `styles/color-picker` 补 `__clear` 段（见 share 仓 changeset），style.css 需重跑 `pnpm build:styles` 生成
