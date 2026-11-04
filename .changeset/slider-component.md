---
'@lh-ui/uniapp': minor
---

# 新增 Slider 滑块组件

- 新增 `lh-slider` 组件：轨道自绘滑块，`modelValue`（单滑块标量 / 范围模式二元组）、
  `min` / `max` / `step`（步长吸附）、`range`（双滑块范围选择，拖动交叉时两端自动交换，
  值始终保持 `[早, 晚]`）、`disabled`、`showInput`（轨道右侧回显数值）、
  `size`、`marks`（刻度标记，按数值排序）、事件 update:modelValue / change
  （拖动松手或键盘步进时触发）。
- 取值 / 钳制 / 步长吸附 / 刻度排序 / 类名 / 无障碍契约完全消费 `@lh-ui/share` core
  纯函数（clampValue / getValueFromPosition / getPositionFromValue / buildMarksList /
  getSliderClassNames / getSliderThumbAria / getNextRangeValue），零拷贝；
  thumb 的 aria-label 走 share locales 的 `slider.thumb` / `slider.thumbStart` /
  `slider.thumbEnd` 键，九语言齐备，无需本仓补键。
- 【uni-app 差异】拖动载体：plus 在 thumb 上挂 mousedown / touchstart 后把 move / up
  监听接到 document；MP 没有 document，touch 事件改为直接挂在 thumb wrapper 上
  （MP 的 touchmove / touchend 沿 touchstart 目标节点派发），H5 保留 document 级鼠标
  监听（startMouseDrag 内条件编译守卫，MP 包无死代码）。位移计算：plus 用同步
  getBoundingClientRect；MP 只有异步 SelectorQuery，改走 adapter 的 getSingleLhRect
  ——度量按拖拽会话缓存（touchstart 预热），但语义上值更新比触碰晚一帧
  （已在文档「平台差异」登记异步语义）。键盘步进（方向键 / Home / End /
  PageUp / PageDown）仅 H5（SFC 侧条件编译守卫）；aria 属性包按本仓惯例摊开逐项
  显式绑定（MP 模板编译器不支持 v-bind 对象）。
- 严格对齐 plus 真源，不私自新增能力：plus 无 `vertical`（竖向轨道）与 tooltip 气泡，
  本仓同样不提供（需要竖向可旋转外层容器、需要数值提示可用 show-input 常显），
  已在文档「平台差异」登记决策。
- 配套：`src/pages/slider` demo 页（基础 / 范围 / 步长与刻度 / 禁用 /
  显示数值 / 自定义范围与尺寸）+ pages.json 路由 + 首页列表（demo-pages 三处对齐）、
  `tests/components/slider.spec.ts`（15 例：渲染、受控回显、范围与交换、
  步长吸附、touch 与鼠标拖动提交、禁用、键盘步进、aria 契约）、
  文档 9 语种（zh-CN 真源 + 8 译本）+ `componentItems` 九语言 labels。
