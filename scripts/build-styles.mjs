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
 *      - `svg {}` 后代选择器 → `.lh-iconfont`（iconfont 方案，§五）
 *      - `img {}` 后代选择器 → `.lh-img`（uni 端走 `<image>`，SFC 需写 class="lh-img"）
 *      - 通配符：`PREFIX > * + *` → 父规则 flex + gap；`PREFIX > *` → 丢弃并告警
 *        （WXSS 无通配等价物，后者由使用者在子节点上自行写样式）
 *   3. 输出 components/<name>/style.css（自足 CSS，禁止手改）
 *
 * 主题变量产物：src/theme/index.css —— share 的 theme/index.scss 做上述选择器替换生成，
 * 含 `page { --lh-* }` 明色 + `page.dark, .dark { … }` 暗色。
 *
 * 组件清单按 components/ 扫描（与 plus 同款「只有本库真实存在的组件才出产物」）。
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
 * - @media (prefers-*) 查询
 */
function isH5Only(selector) {
  return /:(?:hover|focus|focus-visible)|::placeholder/.test(selector)
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
  if (decls.length !== 1 || decls[0].prop !== 'margin-left') {
    throw new Error(
      `[build-styles] 未支持的通配规则：${ruleNode.selector}（仅支持单条 margin-left 的 > * + *）`,
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

    // ③ 仅 H5 的规则条件编译包裹（打标记防 walk 重新访问时无限递归）
    if (isH5Only(ruleNode.selector)) {
      wrapH5ConditionalNode(ruleNode)
    }
  },

  // ⑤ prefers-* 媒体查询整体包裹
  AtRule(atRuleNode) {
    if (atRuleNode[WRAPPED]) return
    if (atRuleNode.name === 'media' && isPrefersMedia(atRuleNode.params)) {
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
    const input = path.join(shareStyles, `${name}/index.scss`)
    if (!fs.existsSync(input)) continue
    const css = await purify(await compileScss(input))
    writeFile(resolvePath(`src/components/lh-${name}/style.css`), `${AUTOGEN_HEADER}${css}`)
    built += 1
  }

  console.log(`styles built: theme + ${built} components -> src/theme/, components/*/style.css`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
