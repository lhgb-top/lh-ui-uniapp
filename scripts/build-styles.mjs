/**
 * 样式构建（uni-app 净化管线）
 *
 * 样式唯一源是 @lh-ui/share（红线 2）：本库不持有任何组件 scss 源。与 plus / vue2 不同，
 * uni-app 使用方工程的 sass 无法解析 `@use '@lh-ui/share/...'` 这类 bare specifier
 * （loadPaths 不含 node_modules，见计划 §3.2），所以本库必须**构建期输出自足 CSS 产物**，
 * 组件 SFC 用 `<style src="./style.css">` 引入，使用方零 sass 依赖。
 *
 * 管线（确定性机械变换，全部可 diff 抽查）：
 *   1. sass modern API 编译 share 的 styles/<name>/index.scss（同 share/plus 的编译方式）
 *   2. postcss 净化：
 *      - `:root` → `page`（小程序无 html 根，page 是页面根选择器，H5 / 微信均支持）
 *      - `[data-theme='dark'], .dark` → `page.dark, .dark`（保留 .dark 类供 ConfigProvider 内联模式）
 *      - 仅 H5 的规则用 uni 条件编译注释包裹（#ifdef H5 / #endif）：
 *        :hover / :focus / :focus-visible / ::placeholder / @media (prefers-*)
 *        （prefers-* 块内的规则整体跳过净化：MP 端随条件编译整块剔除）
 *        [dir='rtl'] 方向覆盖块与仅其引用的 `*-rtl` keyframes 同样只进 H5
 *        （WXSS 无属性选择器，MP 端亦无 dir 语义）
 *      - 逻辑属性双发：WXSS 不识别 margin/padding/border/inset 的 inline/start/end
 *        系列与 block-start/block-end（border-block-*）与 text-align: start|end。
 *        物理兜底声明插在逻辑声明之前（MP/H5 均可见），
 *        原逻辑声明用 #ifdef H5 夹住（H5 下覆盖兜底，RTL 自动镜像；MP 固定 LTR）
 *      - `svg {}` 后代选择器 → `.lh-iconfont`（iconfont 方案，§五）
 *      - `img {}` 后代选择器 → `.lh-img`（uni 端走 `<image>`，SFC 需写 class="lh-img"）
 *      - 其余裸标签选择器（WXSS 仅支持 page）：整规则用 #ifdef H5 夹住
 *        （plus 为文档宿主压覆盖写的 nav/ol/li、svg 图形的 circle 等；
 *        H5 分支才渲染标签节点，MP 端随条件编译剔除，不塞死代码）
 *      - `:not(同族修饰类)` 剥离（WXSS 不支持 :not()）：参数为同基类修饰类时剥到基类
 *        （如 timeline 的 `.lh-timeline__item:not(.lh-timeline__item--last)`），
 *        遮蔽语义由同块内更靠后的修饰类规则接管；其余 :not() 形态不处理、不静默吞掉
 *      - 通配符：`PREFIX > * + *` → 父规则 flex + gap；`PREFIX > *` → 丢弃并告警
 *        （WXSS 无通配等价物，后者由使用者在子节点上自行写样式）
 *   3. 输出 components/<name>/style.css（自足 CSS，禁止手改）
 *
 * 主题变量产物：src/theme/index.css —— share 的 theme/index.scss 做上述选择器替换生成，
 * 含 `page { --lh-* }` 明色 + `page.dark, .dark { … }` 暗色。
 *
 * 组件清单按 components/ 扫描（与 plus 同款「只有本库真实存在的组件才出产物」）。
 *
 * 命令式服务宿主样式（2026-11-04 三仓同步）：wxapp 的挂载点组件在
 * src/{message,loading}/，不在组件扫描范围；本段按目录存在性守卫映射
 * share styles/{message,loading}，uniapp 侧自动 no-op（宿主即组件本体）。
 *
 * 【同步登记 2026-11-04】wxapp 同源脚本头注释里的「使用方 app.wxss @import 主题」
 * 指引修正为相对 miniprogram_npm 的路径（WXSS @import 不解析 npm 包名）；该文案为
 * wxapp 端专属，本仓无对应段，仅登记不改。
 *
 * 【同步登记 2026-11-05（M-w6）】wxapp 同源脚本新增两处端专属逻辑，本仓不需要、
 * 未同步代码：① SCSS_NAME_ALIASES 增 timeline-item / skeleton-item → 父级 scss
 * 别名（本仓子组件走 SFC style src 引父级 style.css 复用样式，无需别名）；
 * ② COMPONENT_WXSS_PATCHES 构建期组件内联 wxss 补丁机制，目前仅 spinner 一条
 * （小程序端 view+border 圆环 .lh-spinner__ring——本仓该样式在 lh-spinner SFC
 * 内联 `<style>` 里，不经本脚本）。
 *
 * 【同步登记 2026-11-05（M-w7）】wxapp 同源脚本继续端专属扩展，本仓不需要、
 * 未同步代码：① SCSS_NAME_ALIASES 增 breadcrumb-item / step / tab-pane /
 * menu-item / sub-menu / dropdown-item → 父级 scss 别名（同 M-w6 子组件口径）；
 * ② COMPONENT_WXSS_PATCHES 增 root-portal 纯补丁条目（弹层承载容器样式，本仓
 * 的 lh-root-portal 样式在 SFC 内联 `<style>`，不进本脚本）；③ 主循环支持
 * 「无 share 源 + 纯补丁」组件产物（仅 root-portal 走该路径）。
 *
 * 【同步登记 2026-11-05（M-w9）】wxapp 同源脚本继续端专属扩展，本仓不需要、
 * 未同步代码：COMPONENT_WXSS_PATCHES 增 cascader / date-picker / time-picker
 * 页内透明遮罩 __mask 等条目（本仓弹层点击外部关闭走文档级监听，遮罩类
 * 写在各 SFC 内联 `<style>`，不进本脚本）。
 *
 * 【同步登记 2026-11-06（M-w10）】wxapp 同源脚本继续端专属扩展，本仓不需要、
 * 未同步代码：COMPONENT_WXSS_PATCHES 增 table 筛选面板遮罩与 calendar
 * 面板 / 网格布局补丁条目（同 M-w9 口径，本仓这些类均写在各 SFC 内联
 * `<style>`，不进本脚本）。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as sass from 'sass'
import postcss, { Comment } from 'postcss'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const resolvePath = (p) => path.resolve(root, p)

function writeFile(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, content, 'utf-8')
}

async function compileScss(input) {
  const result = await sass.compileAsync(input, {
    style: 'expanded',
    loadPaths: [resolvePath('node_modules')],
    silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin'],
  })
  return result.css
}

// ============================== 净化规则 ==============================

/** 条件编译注释包裹（SCSS 里用 /* *\/ 形式，uni 编译链在两端都能识别） */
/**
 * 条件编译包裹：把规则/媒体查询用 uni 条件编译注释夹住。
 *
 * 【关键 1】不能用 node.replaceWith([before, node, after])：
 * postcss 8.5 的 replaceWith 会把传入数组里的 node 自身从父节点摘掉
 * （normalize 对数组元素逐个 removeChild），被包裹的规则会凭空消失，
 * 只留下孤立的 #endif，uni 预处理器随即报「#endif 缺少配对的 #ifdef」。
 * 必须用显式的 insertBefore / insertAfter。
 *
 * 【关键 2】打 WRAPPED 标记而非依赖 walk 顺序：postcss 的 walk 是动态的，
 * 插入的新节点会被重新访问，若新节点仍命中 isH5Only 就会无限递归包裹。
 */
const WRAPPED = Symbol('lh-wrapped')

function wrapH5ConditionalNode(node) {
  const before = new Comment({ text: '#ifdef H5' })
  const after = new Comment({ text: '#endif' })
  node[WRAPPED] = true
  node.parent.insertBefore(node, before)
  node.parent.insertAfter(node, after)
}

/**
 * 判断该规则是否只服务于 H5（小程序无鼠标焦点 / 无 prefers 媒体查询 / 无 placeholder 伪元素）
 * - 选择器含 :hover / :focus / :focus-visible / ::placeholder
 * - 选择器含 [dir='rtl']：方向覆盖块，WXSS 无属性选择器且 MP 无 dir 语义
 * - 选择器含 :nth-*：WXSS 不支持结构性伪类。share 的 table 斑马纹用它，
 *   MP 端由模板按行索引补 --alt 类 + SFC 内联兜底样式（同 lh-pagination
 *   的禁用兜底先例），见 lh-table 组件文档「平台差异」
 * - 选择器含 :has()：WXSS 不支持。share 的 input-tag 用
 *   `.lh-input-tag:has(.lh-input-tag__input:focus)` 做聚焦边框，
 *   MP 端聚焦边框不可用（输入仍正常工作）
 * - @media (prefers-*) 查询
 */
function isH5Only(selector) {
  return /:(?:hover|focus|focus-visible)|::placeholder|\[dir=|:nth-|:has\(/.test(selector)
}

/**
 * 规则是否声明了 position: sticky。
 * WXSS 对表格单元格的 sticky 定位支持不可靠（share 的 table 固定列依赖它），
 * 整规则只进 H5——MP 端固定列降级为普通横向滚动列（已登记的平台限制）。
 * sticky 在普通块级容器上两端都可用，此处的 wrapping 只为剔除表格单元格
 * 这一无同构场景；share 若新增依赖 sticky 的非表格规则，应改由 share 源
 * 或在此重新评估。
 */
function declaresSticky(ruleNode) {
  let sticky = false
  ruleNode.walkDecls((decl) => {
    if (decl.prop === 'position' && decl.value.trim() === 'sticky') sticky = true
  })
  return sticky
}

/**
 * 选择器是否命中固定列修饰类（--fixed-left / --fixed-right 及其边缘阴影变体）。
 * 固定列整体是 H5-only 能力（sticky 的同构问题），相关规则（定位、背景、
 * 边缘阴影）一并只进 H5；MP 端单元格仍带 --fixed-* 类名但无对应样式，
 * 表现为普通滚动列，模板侧无需条件编译。
 */
function isFixedColumnSelector(selector) {
  return /--fixed-(?:left|right)/.test(selector)
}

/**
 * 判断 @media 参数是否为 prefers-* 查询。
 *
 * 【关键】AtRule.params 只含括号部分（如 `(prefers-reduced-motion: reduce)`），
 * 不含 `@media` 前缀，正则不能要求 @media 前缀，否则永远不匹配，
 * prefers 查询会原样漏进 MP 产物（WXSS 不支持 prefers-* 媒体查询）。
 */
function isPrefersMedia(params) {
  return /\(\s*prefers-/.test(params)
}

/**
 * 裸标签选择器判断（除 page 外）：WXSS 只支持 page 一个标签选择器。
 *
 * 与 verify-wxss.mjs 的 TAG_SELECTOR 同构。plus 仓为压制文档宿主样式泄漏
 * （`.vp-doc` 的 nav / ol / li）以及描述 svg 图形（spinner 的 circle）写了
 * 若干裸标签规则，在 uni-app 模板（一律 view / text / svg 内联节点）里本就
 * 匹配不到：svg / img 已由上方规则改写成类名，page 由 `:root` 映射而来，
 * 剩余裸标签（nav / ol / li / circle …）整规则只进 H5——既保住 verify-wxss
 * 门禁，又不往 MP 产物塞死代码。H5 端不受影响（标签节点在 H5 分支渲染）。
 */
const TAG_SELECTOR_RE = /(?:^|[\s,+~>])([a-zA-Z][\w-]*)(?=[\s.+~,#>{]|$)/g
const ALLOWED_TAGS = new Set(['page'])

function hasBareTagSelector(selector) {
  TAG_SELECTOR_RE.lastIndex = 0
  let match
  while ((match = TAG_SELECTOR_RE.exec(selector))) {
    if (!ALLOWED_TAGS.has(match[1])) return true
  }
  return false
}

/**
 * 节点是否位于 @keyframes 内部。
 *
 * @keyframes 的关键帧块（to / from / 0%）在 postcss 里也是 Rule 节点，
 * 选择器形如 `to` / `from`，会被 hasBareTagSelector 误判为裸标签——
 * 它们不是选择器，必须跳过（与 verify-wxss 的「非选择器行跳过」同构）。
 */
function isInsideKeyframes(node) {
  let parent = node.parent
  while (parent) {
    if (parent.type === 'atrule' && parent.name === 'keyframes') return true
    parent = parent.parent
  }
  return false
}

// ============================== 逻辑属性降级（RTL 支持） ==============================

/**
 * share 样式源为支持 RTL（阿拉伯语）已全面改用逻辑属性；WXSS 不识别这些属性，
 * 原样进 MP 产物等同于布局丢失。这里做**双发**而非二选一：
 *
 *   margin-left: 4px;          ← 物理兜底，MP / H5 均可见
 *   /* #ifdef H5 *\/
 *   margin-inline-start: 4px;  ← 逻辑覆盖，仅 H5
 *   /* #endif *\/
 *
 * 物理兜底在前、逻辑覆盖在后：H5 端同优先级后者胜出，LTR 下两者同值、
 * RTL 下逻辑属性自动镜像；MP 端条件编译段被 uni 编译链剔除，只剩物理兜底
 * （MP 无 dir 文档方向，固定按 LTR 渲染）。
 *
 * 未登记映射的逻辑属性（block 轴等）直接抛错，强制新增组件时显式决定降级方式，
 * 沿用本管线「未覆盖形态抛错、不被静默吞掉」的设计。
 */

/** 1:1 映射的逻辑属性（inline 轴起止边） */
const INLINE_LOGICAL_PROPS = {
  'margin-inline-start': 'margin-left',
  'margin-inline-end': 'margin-right',
  'padding-inline-start': 'padding-left',
  'padding-inline-end': 'padding-right',
  'border-inline-start': 'border-left',
  'border-inline-end': 'border-right',
  'border-inline-start-width': 'border-left-width',
  'border-inline-start-style': 'border-left-style',
  'border-inline-start-color': 'border-left-color',
  'border-inline-end-width': 'border-right-width',
  'border-inline-end-style': 'border-right-style',
  'border-inline-end-color': 'border-right-color',
  'inset-inline-start': 'left',
  'inset-inline-end': 'right',
}

/** 轴简写：一份值拆成起止两条物理声明 */
const INLINE_SHORTHANDS = {
  'margin-inline': ['margin-left', 'margin-right'],
  'padding-inline': ['padding-left', 'padding-right'],
  'inset-inline': ['left', 'right'],
}

/** block 轴简写：一份值拆成上下两条物理声明（MP 固定 LTR） */
const BLOCK_SHORTHANDS = {
  'margin-block': ['margin-top', 'margin-bottom'],
  'padding-block': ['padding-top', 'padding-bottom'],
  'inset-block': ['top', 'bottom'],
}

/** block 轴（垂直）逻辑属性：WXSS 不识别，LTR 下映射到固定物理边（top / bottom） */
const BLOCK_LOGICAL_PROPS = {
  'margin-block-start': 'margin-top',
  'margin-block-end': 'margin-bottom',
  'padding-block-start': 'padding-top',
  'padding-block-end': 'padding-bottom',
  'border-block-start': 'border-top',
  'border-block-end': 'border-bottom',
  'border-block-start-width': 'border-top-width',
  'border-block-start-style': 'border-top-style',
  'border-block-start-color': 'border-top-color',
  'border-block-end-width': 'border-bottom-width',
  'border-block-end-style': 'border-bottom-style',
  'border-block-end-color': 'border-bottom-color',
  'inset-block-start': 'top',
  'inset-block-end': 'bottom',
}

/** 尺寸逻辑属性：inline 轴 → 宽度，block 轴 → 高度（WXSS 不识别 axis 尺寸） */
const LOGICAL_SIZES = {
  'inline-size': 'width',
  'block-size': 'height',
  'min-inline-size': 'min-width',
  'min-block-size': 'min-height',
  'max-inline-size': 'max-width',
  'max-block-size': 'max-height',
}

/** 角圆角逻辑属性（block 轴 + inline 轴组合），LTR 下映射到固定物理角 */
const LOGICAL_RADII = {
  'border-start-start-radius': 'border-top-left-radius',
  'border-start-end-radius': 'border-top-right-radius',
  'border-end-start-radius': 'border-bottom-left-radius',
  'border-end-end-radius': 'border-bottom-right-radius',
}

/** text-align 的逻辑值（值级降级，prop 本身 WXSS 支持） */
const LOGICAL_TEXT_ALIGN = { start: 'left', end: 'right' }

/** 命中即视为需要降级处理的逻辑属性名（含未登记者，用于抛错） */
const LOGICAL_PROP_RE =
  /^(?:margin|padding|inset)-(?:inline|block|inline-start|inline-end|block-start|block-end)$|^(?:margin|padding|border|inset)-(?:inline|block)-(?:start|end)(?:-(?:width|style|color))?$|^(?:min-|max-)?(?:inline|block)-size$|^border-(?:start|end)-(?:start|end)-radius$/

function physicalDecl(prop, value, important) {
  return postcss.decl({ prop, value, important })
}

/**
 * 双发插入：物理兜底声明插到逻辑声明之前，逻辑声明用 #ifdef H5 / #endif 夹住。
 * 顺序很关键——物理在前、逻辑在后，H5 端逻辑属性才能覆盖兜底。
 */
function dualEmit(logicalNode, physicalNodes) {
  const parent = logicalNode.parent
  const ifdef = new Comment({ text: '#ifdef H5' })
  const endif = new Comment({ text: '#endif' })
  parent.insertAfter(logicalNode, endif)
  parent.insertBefore(logicalNode, ifdef)
  for (const physical of physicalNodes) {
    parent.insertBefore(ifdef, physical)
  }
}

/** 规则内的逻辑声明逐条降级；返回是否有规则被改写（仅用于日志） */
function rewriteLogicalDeclarations(ruleNode) {
  const decls = (ruleNode.nodes ?? []).filter((n) => n.type === 'decl')
  for (const node of decls) {
    const { prop, value, important } = node

    if (prop === 'text-align' && LOGICAL_TEXT_ALIGN[value.trim()]) {
      dualEmit(node, [physicalDecl(prop, LOGICAL_TEXT_ALIGN[value.trim()], important)])
      continue
    }

    if (LOGICAL_RADII[prop]) {
      dualEmit(node, [physicalDecl(LOGICAL_RADII[prop], value, important)])
      continue
    }

    if (INLINE_SHORTHANDS[prop]) {
      dualEmit(node, INLINE_SHORTHANDS[prop].map((p) => physicalDecl(p, value, important)))
      continue
    }

    if (BLOCK_SHORTHANDS[prop]) {
      dualEmit(node, BLOCK_SHORTHANDS[prop].map((p) => physicalDecl(p, value, important)))
      continue
    }

    if (INLINE_LOGICAL_PROPS[prop]) {
      dualEmit(node, [physicalDecl(INLINE_LOGICAL_PROPS[prop], value, important)])
      continue
    }

    // block 轴（垂直）逻辑属性：物理兜底在前（MP / H5 均可见），逻辑覆盖仅 H5；
    // 与 inline 轴同款双发，WXSS 端固定按 top / bottom 渲染
    if (BLOCK_LOGICAL_PROPS[prop]) {
      dualEmit(node, [physicalDecl(BLOCK_LOGICAL_PROPS[prop], value, important)])
      continue
    }

    // 尺寸逻辑属性（inline-size / block-size 及 min/max 变体）：
    // WXSS 不识别轴尺寸，物理兜底 + H5 逻辑覆盖同款双发
    if (LOGICAL_SIZES[prop]) {
      dualEmit(node, [physicalDecl(LOGICAL_SIZES[prop], value, important)])
      continue
    }

    if (LOGICAL_PROP_RE.test(prop)) {
      throw new Error(
        `[build-styles] 未支持的逻辑属性：${prop}（WXSS 不识别，请在 build-styles.mjs 补登记降级映射）`,
      )
    }
  }
}

/**
 * 裸标签选择器改写（WXSS 无标签选择器，只有 page 被放行）。
 * - `svg` → `.lh-iconfont`：iconfont 方案下图标改用字体类渲染（计划 §五）。
 * - `img` → `.lh-img`：uni 端图片走 `<image>`，SFC 的图片节点需写 class="lh-img"
 *   才能命中改写后的选择器（同 svg 的机制，share 的 empty 组件有此用法）。
 * 只改「标签选择器」，不动 class 里的同名片段（如 .lh-avatar__img 不受影响）。
 */
function rewriteTagSelector(selector, tag, className) {
  const re = new RegExp(`(^|[\\s>+~,])${tag}(?=[\\s.+~,#:[\\s]|$)`, 'g')
  return selector.replace(re, `$1.${className}`)
}

/**
 * 通配符选择器映射（WXSS 不支持 `*`，计划 §3.3「逐一映射或剔除」）
 *
 * `PREFIX > * + * { margin-left: Npx }` 是「相邻兄弟间距」的通用写法，
 * MP 端改为在父节点上用 flex + gap 表达等价间距，并删除通配规则本身：
 *   - 父规则没有 display: flex/inline-flex/grid 时补 display: flex
 *   - 父规则有 text-align: right/center/left 时同步映射到 justify-content
 *     （dialog 底栏就是 block + text-align: right 的横向布局）
 * 未覆盖的通配形态（如 `> *`、纵向 margin-top 兄弟间距）在此直接抛错，
 * 强制后续新增组件时显式决定映射方式，不被静默吞掉。
 */
const SIBLING_GAP_SELECTOR = /^(.*?)\s*>\s*\*\s*\+\s*\*$/
const FLEX_DISPLAYS = new Set(['flex', 'inline-flex', 'grid', 'inline-grid'])
const TEXT_ALIGN_TO_JUSTIFY = {
  left: 'flex-start',
  right: 'flex-end',
  center: 'center',
}

function mapUniversalSelector(ruleNode) {
  const match = SIBLING_GAP_SELECTOR.exec(ruleNode.selector.trim())
  if (!match) return false
  const prefix = match[1].trim()

  const decls = ruleNode.nodes?.filter((n) => n.type === 'decl') ?? []
  if (decls.length !== 1) {
    throw new Error(
      `[build-styles] 未支持的通配规则：${ruleNode.selector}（仅支持单条 margin 声明的 > * + *）`,
    )
  }
  // 兄弟间距声明：margin-left（物理）或 margin-inline-start/end（逻辑，RTL 提交引入）。
  // 映射目标是父节点的 flex gap——间距值与方向无关；MP 端固定按 LTR 渲染，
  // inline-start 即 left，直接取值注入 gap，无需方向判断
  const GAP_PROP_ALIASES = new Set(['margin-left', 'margin-inline-start', 'margin-inline-end'])
  if (!GAP_PROP_ALIASES.has(decls[0].prop)) {
    throw new Error(
      `[build-styles] 未支持的通配规则：${ruleNode.selector}（仅支持单条 margin-left / margin-inline-* 的 > * + *）`,
    )
  }
  const gapValue = decls[0].value

  const parent = ruleNode.parent
  const sibling =
    parent && parent.nodes
      ? parent.nodes.find((n) => n.type === 'rule' && n.selector === prefix)
      : undefined
  if (!sibling) {
    throw new Error(
      `[build-styles] 通配规则 ${ruleNode.selector} 找不到父规则 ${prefix}，无法注入 gap`,
    )
  }

  const existing = sibling.nodes?.filter((n) => n.type === 'decl') ?? []
  const hasFlex = existing.some((n) => n.prop === 'display' && FLEX_DISPLAYS.has(n.value))
  const textAlign = existing.find((n) => n.prop === 'text-align')

  const injects = []
  if (!hasFlex) injects.push(postcss.decl({ prop: 'display', value: 'flex' }))
  if (textAlign && TEXT_ALIGN_TO_JUSTIFY[textAlign.value]) {
    injects.push(
      postcss.decl({ prop: 'justify-content', value: TEXT_ALIGN_TO_JUSTIFY[textAlign.value] }),
    )
  }
  injects.push(postcss.decl({ prop: 'gap', value: gapValue }))
  sibling.append(injects)

  ruleNode.remove()
  console.warn(`[build-styles] 通配映射：${ruleNode.selector} -> ${prefix} { display:flex; gap:${gapValue} }`)
  return true
}

/**
 * 子代通配映射（WXSS 不支持 `*`）：`PREFIX > *` 无任何等价表达。
 *
 * 与 `> * + *` 不同，子代通配没法映射到父节点上的 flex/gap —— 它描述的是
 * 「所有直接子节点的通用样式」（share 的 card 用它让封面插槽内容撑满宽度）。
 * 显式决定：删除该规则并告警，由使用者在子节点上自行写样式。
 * （沿用本管线「未覆盖的通配形态抛错/告警，不被静默吞掉」的设计）
 */
const CHILD_WILDCARD_SELECTOR = /^(.*?)\s*>\s*\*$/

function mapChildWildcardSelector(ruleNode) {
  if (!CHILD_WILDCARD_SELECTOR.test(ruleNode.selector.trim())) return false
  const selector = ruleNode.selector
  ruleNode.remove()
  console.warn(
    `[build-styles] 子代通配丢弃：${selector.trim()}（WXSS 不支持 *，请在使用者侧给子节点写样式）`,
  )
  return true
}

/**
 * 节点是否位于 `@media (prefers-*)` 块内。
 *
 * prefers 查询本身会被 AtRule 访问器整体用 `#ifdef H5` 包裹，MP 端由 uni 编译链
 * 整体剔除，所以块内的规则（含 `.lh-progress *` 这类通配、`:hover` 等）无需净化，
 * 直接跳过即可——净化它们反而会触发 mapUniversalSelector 的「未支持通配」抛错。
 */
function isInsidePrefersMedia(node) {
  let parent = node.parent
  while (parent) {
    if (parent.type === 'atrule' && parent.name === 'media' && isPrefersMedia(parent.params)) {
      return true
    }
    parent = parent.parent
  }
  return false
}

// ============================== postcss 插件 ==============================

const purifyPlugin = () => ({
  postcssPlugin: 'lh-purify-wxss',

  // ①②④ 选择器级改写（postcss 无 Selector 访问器，统一在 Rule 里改字符串）
  Rule(ruleNode) {
    if (ruleNode[WRAPPED]) return

    // prefers-* 媒体查询内的规则整体跳过：这些块会被 #ifdef H5 包裹，MP 端整体剔除
    // （块内可能含 `.lh-progress *` 这类通配，净化它们只会触发未支持通配的抛错）
    if (isInsidePrefersMedia(ruleNode)) return

    // ⑥ 通配符映射（WXSS 不支持 *）：> * + * → 父规则 flex + gap；> * → 丢弃并告警
    if (mapUniversalSelector(ruleNode)) return
    if (mapChildWildcardSelector(ruleNode)) return

    ruleNode.selector = ruleNode.selector
      // :root → page（小程序无 html 根，page 是页面根选择器）
      .replace(/(^|[\s,+~])::?root(?=[\s,+~.#[\s]|$)/g, '$1page')
      // [data-theme='dark'] / [data-theme=dark] → page.dark（暗色块根选择器位置）
      // 注意：sass 会把引号属性选择器规范化为无引号形式，两种都要匹配；
      // 属性选择器本身也是 WXSS 禁用项，必须在这里消灭
      .replace(/\[data-theme=(["']?)(dark)\1\]/g, 'page.dark')

    // 标签选择器 → 类名（iconfont / image 方案，见 rewriteTagSelector）
    if (/\bsvg\b/.test(ruleNode.selector)) {
      ruleNode.selector = rewriteTagSelector(ruleNode.selector, 'svg', 'lh-iconfont')
    }
    if (/\bimg\b/.test(ruleNode.selector)) {
      ruleNode.selector = rewriteTagSelector(ruleNode.selector, 'img', 'lh-img')
    }

    // ③ 仅 H5 的规则条件编译包裹（打标记防 walk 重新访问时无限递归）。
    //    含 [dir='rtl'] 的规则整块只进 H5——WXSS 无属性选择器，内部声明无需降级
    //   【连体规则按分片过滤（2026-11-05 修，与 wxapp / alipay 同步）】share 常见形态
    //   `.lh-pagination__page--active, .lh-pagination__page--active:hover:not(:disabled) { … }`：
    //   早期整串判定把干净分片一并包进 #ifdef H5（MP 端激活态基样式丢失）。
    //   混合时拆成两条：干净分片留在 MP+H5，H5 分片克隆后包裹条件编译。
    const selectorFragments = ruleNode.selector.split(',')
    const h5OnlyFragments = selectorFragments.filter((s) => isH5Only(s))
    const keptFragments = selectorFragments.filter((s) => !isH5Only(s))
    if (h5OnlyFragments.length > 0 && keptFragments.length > 0) {
      const h5Rule = ruleNode.clone()
      h5Rule.selector = h5OnlyFragments.join(',')
      ruleNode.selector = keptFragments.join(',')
      ruleNode.parent.insertAfter(ruleNode, h5Rule)
      wrapH5ConditionalNode(h5Rule)
    } else if (isH5Only(ruleNode.selector)) {
      wrapH5ConditionalNode(ruleNode)
      return
    }

    // ③b position: sticky / 固定列修饰类规则只进 H5（table 固定列降级，
    //     见 declaresSticky 与 isFixedColumnSelector 的注释）
    if (declaresSticky(ruleNode) || isFixedColumnSelector(ruleNode.selector)) {
      wrapH5ConditionalNode(ruleNode)
      return
    }

    // ⑧ 剩余裸标签选择器（svg / img 已改写、page 已放行）整规则只进 H5：
    //    WXSS 仅支持 page 标签选择器（见上方 hasBareTagSelector 注释）。
    //    @keyframes 内部的 to / from 不是选择器，跳过。
    if (!isInsideKeyframes(ruleNode) && hasBareTagSelector(ruleNode.selector)) {
      wrapH5ConditionalNode(ruleNode)
      return
    }

    // ⑨ `:not(同族修饰类)` 剥离（WXSS 不支持 :not()，verify-wxss 硬卡）
    //    仅处理「:not() 的参数本身是同基类的修饰类」这一种形态：
    //      `.lh-timeline__item:not(.lh-timeline__item--last)` → `.lh-timeline__item`
    //    安全性：剥离后该规则特异度下降，但同块内的修饰类规则（--last）在其之后声明、
    //    特异度不低于剥后规则，遮蔽语义由后者接管（timeline 的末项连线隐藏本就靠
    //    `.lh-timeline__item--last::before { display: none }`）。
    //    注意：含 :hover / :focus / [dir= 的规则已在上方整块进 H5，不会走到这里；
    //    参数为结构性伪类（如 steps 的 `:not(:last-child)`）或禁用态（`:not(:disabled)`）
    //    的形态**不处理**——禁止静默吞掉，由对应组件按需显式登记映射。
    const notStripped = ruleNode.selector.replace(
      /(\.[A-Za-z_][\w-]*):not\((\.[A-Za-z_][\w-]*)\)/g,
      (match, base, modifier) => (modifier.startsWith(`${base}--`) ? base : match),
    )
    if (notStripped !== ruleNode.selector) {
      console.warn(
        `[build-styles] :not() 同族修饰类剥离：${ruleNode.selector.trim()} -> ${notStripped.trim()}`,
      )
      ruleNode.selector = notStripped
    }

    // ⑩ steps 的结构性 `:not(:last-child)` 剥离（与 ⑨ 同为 WXSS 不支持 :not() 的显式登记）
    //    `.lh-steps__item:not(:last-child)::after` → `.lh-steps__item::after`
    //    即连接线改为「所有步骤项都画」，末项 / 行末项的隐藏全部交给 `--line-last` 类：
    //    - 横向：share 本就有 `.lh-steps__item--line-last::after { display: none }`
    //      （剥离后特异度不变、语义等价），行末项索引由组件胶水层度量折行产出
    //      （getStepsLineLastIndices 的结果恒含全局末项）
    //    - 纵向：share 无 --line-last 的 ::before 隐藏规则，由 lh-steps SFC 的
    //      uni-app 适配样式补一条（`.lh-steps--vertical .lh-steps__item--line-last::before`）
    //    安全性：剥离不影响声明，只放宽选择器；遮蔽语义由名中带 --line-last 的规则接管。
    const lastChildStripped = ruleNode.selector.replace(/:not\(:last-child\)/g, '')
    if (lastChildStripped !== ruleNode.selector) {
      console.warn(
        `[build-styles] :not(:last-child) 结构性剥离：${ruleNode.selector.trim()} -> ${lastChildStripped.trim()}`,
      )
      ruleNode.selector = lastChildStripped
    }

    // ⑦ 逻辑属性双发（WXSS 不识别 inline/start/end：物理兜底 + #ifdef H5 逻辑覆盖）
    rewriteLogicalDeclarations(ruleNode)
  },

  // ⑤ prefers-* 媒体查询整体包裹；仅 RTL 引用的 @keyframes *-rtl 同样只进 H5
  AtRule(atRuleNode) {
    if (atRuleNode[WRAPPED]) return
    if (atRuleNode.name === 'media' && isPrefersMedia(atRuleNode.params)) {
      wrapH5ConditionalNode(atRuleNode)
    }
    if (atRuleNode.name === 'keyframes' && /-rtl$/.test(atRuleNode.params)) {
      wrapH5ConditionalNode(atRuleNode)
    }
  },
})

purifyPlugin.postcss = true

async function purify(css) {
  const result = await postcss([purifyPlugin]).process(css, { from: undefined })
  return result.css
}

// ============================== 主流程 ==============================

/**
 * 组件目录名 → share scss 目录名别名（不一致时在此登记）
 *
 * `row`：plus 真源把 grid 拆成 row / col 两个组件，share 的样式源仍是
 * `styles/grid/index.scss`（lh-row 与 lh-col 规则在同一份 scss 里）。
 * lh-row 出净化产物，lh-col 照父子组件先例复用 `../lh-row/style.css`，
 * 所以只需给 row 一个别名；col 无产物（share 无 col/ 目录，自然跳过）。
 */
const SCSS_NAME_ALIASES = { row: 'grid' }

function getComponentNames() {
  const dir = resolvePath('src/components')
  return fs
    .readdirSync(dir)
    .filter((name) => fs.statSync(path.join(dir, name)).isDirectory() && name.startsWith('lh-'))
    .map((name) => name.replace(/^lh-/, ''))
    .sort()
}

const AUTOGEN_HEADER = `/**
 * 自动生成（scripts/build-styles.mjs）：@lh-ui/share 样式源经 uni-app 净化后的自足 CSS。
 * 禁止手改——改样式请改 share 仓的 styles/<name>/index.scss 后重跑 pnpm build:styles。
 */\n`

async function main() {
  // 样式源：本地联动优先（家族布局下取同级 share 仓源码），否则取已安装的 npm 包
  const localShare = resolvePath('../lh-ui-share/styles')
  const shareStyles = fs.existsSync(localShare) ? localShare : resolvePath('node_modules/@lh-ui/share/styles')
  console.log(`样式源：${shareStyles}`)

  // 1. 主题变量产物（page 选择器版）
  const themeScss = path.join(shareStyles, 'theme/index.scss')
  const themeCss = await purify(await compileScss(themeScss))
  writeFile(resolvePath('src/theme/index.css'), `${AUTOGEN_HEADER}${themeCss}`)
  console.log('theme -> src/theme/index.css')

  // 2. 单组件自足 CSS（share 有对应 scss 才生成；form-item / *-group 复用父样式，
  //    root-portal 是纯内部适配组件无 share 样式，自然跳过不产生孤儿产物）
  const names = getComponentNames()
  let built = 0
  for (const name of names) {
    // 组件目录名与 share scss 目录名不一致时走别名（如 lh-row -> grid）
    const scssName = SCSS_NAME_ALIASES[name] ?? name
    const input = path.join(shareStyles, `${scssName}/index.scss`)
    if (!fs.existsSync(input)) continue
    const css = await purify(await compileScss(input))
    writeFile(resolvePath(`src/components/lh-${name}/style.css`), `${AUTOGEN_HEADER}${css}`)
    built += 1
  }

  // 3. 命令式服务宿主样式（2026-11-04 三仓同步）：挂载点组件若在 src/{message,loading}/
  //    （wxapp 形态，非组件扫描范围），单独映射 share styles/{message,loading} 落
  //    lh-*-host.wxss。uniapp 的宿主是 src/components/lh-message 组件本体（走上方
  //    组件扫描），本段目录存在性守卫下自动 no-op，仅为三仓同源保留。
  const HOST_SCSS = [
    { dir: 'src/message', name: 'lh-message-host', scss: 'message' },
    { dir: 'src/loading', name: 'lh-loading-host', scss: 'loading' },
  ]
  let hosts = 0
  for (const { dir, name, scss } of HOST_SCSS) {
    if (!fs.existsSync(resolvePath(dir))) continue
    const input = path.join(shareStyles, `${scss}/index.scss`)
    if (!fs.existsSync(input)) continue
    const css = await purify(await compileScss(input))
    writeFile(resolvePath(`${dir}/${name}.wxss`), `${AUTOGEN_HEADER}${css}`)
    hosts += 1
  }

  console.log(`styles built: theme + ${built} components + ${hosts} hosts -> src/theme/, components/*/style.css`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
