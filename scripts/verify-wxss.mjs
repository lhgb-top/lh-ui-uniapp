/**
 * WXSS 白名单门禁（CI 硬卡）
 *
 * 净化后的产物（src/theme/index.css 与各组件的 style.css）要进微信小程序，
 * 必须满足 WXSS 选择器白名单。本脚本做**违规扫描**（而非全量白名单判定），
 * 命中即报错并列出文件:行号，便于定位是净化脚本漏了规则，还是 share 源新增了非法选择器。
 *
 * 规则（计划 §3.3）：
 *   - 禁用：`*` 通配、属性选择器 `[...]`、`:not()`、`:nth-*`、标签选择器（page 除外）、
 *     `html` / `body`、`:hover` / `:focus*` / `::placeholder`、`@media (prefers-*)`、
 *     裸 `&`（SCSS 残留；2026-11-06 三仓同步增）
 *   - 上述 H5-only 项若被 `#ifdef H5` 包裹则放行（uni 编译链在 MP 端会整体剔除）
 *
 * 【覆盖端】白名单按 WXSS 取最严口径，支付宝小程序 ACSS 与抖音小程序 WXSS 的
 * 选择器能力与微信基本同构（均不支持通配 / 属性 / 结构性伪类），同一份门禁
 * 覆盖 H5 / 微信 / 支付宝 / 抖音四端产物（M4.9 加列后生效）。
 *
 * 用法：pnpm verify:wxss（build:styles 之后跑）
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const resolvePath = (p) => path.resolve(root, p)

const targets = [resolvePath('src/theme/index.css'), resolvePath('src/icon/iconfont.css')]

function collectComponentStyles() {
  const dir = resolvePath('src/components')
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((name) => fs.statSync(path.join(dir, name)).isDirectory())
    .map((name) => path.join(dir, name, 'style.css'))
    .filter((file) => fs.existsSync(file))
}

/**
 * 命令式服务宿主样式（2026-11-04 三仓同步）：挂载点组件若在 src/{message,loading}/
 * （wxapp 形态），其 lh-*-host.wxss 与组件产物同级进门禁；uniapp 侧自动 no-op。
 */
function collectHostStyles() {
  const HOSTS = [
    ['src/message', 'lh-message-host'],
    ['src/loading', 'lh-loading-host'],
  ]
  return HOSTS.map(([dir, name]) => resolvePath(`${dir}/${name}.wxss`)).filter((file) =>
    fs.existsSync(file),
  )
}

// 每条违规规则：[正则, 说明]
const RULES = [
  [/\*(?![\w-])/g, '通配符选择器（WXSS 不支持）'],
  [/\[[^\]]*=/g, '属性选择器（WXSS 不支持）'],
  [/:not\(/g, ':not() 伪类（WXSS 不支持）'],
  [/:has\(/g, ':has() 伪类（WXSS 不支持，share 的 input-tag 用它做聚焦边框）'],
  [/:nth-/g, ':nth-* 伪类（WXSS 不支持）'],
  [/(?:^|[\s,+~>])(?:html|body)(?=[\s.+~,#>{]|$)/g, 'html/body 标签选择器（WXSS 不支持）'],
  [/::placeholder/g, '::placeholder 伪元素（MP 不支持，应走 placeholder-style）'],
  [/:hover\b/g, ':hover 伪类（仅 H5）'],
  [/:focus(?:-visible)?\b/g, ':focus 伪类（仅 H5）'],
  [/@media\s*\(\s*prefers-/g, '@media prefers-* 查询（仅 H5）'],
  [/&/g, '裸 & 父选择器（SCSS 残留，顶层 & 会被 sass 透传进产物；2026-11-06 三仓同步增）'],
]

// 标签选择器：除 page 外的裸标签（div/span/svg 等）
const TAG_SELECTOR = /(?:^|[\s,+~>])([a-zA-Z][\w-]*)(?=[\s.+~,#>{]|$)/g
const ALLOWED_TAGS = new Set(['page'])

// 条件编译：#ifdef H5 ... #endif 之间的行豁免
const CONDITIONAL = /^\s*\/\*\s*#(ifdef|ifndef|endif)/

/**
 * 剥离 CSS 文本中的注释，保留 uni 条件编译注释（#ifdef / #ifndef / #endif）。
 * 不剥离会把注释里的星号-斜杠、`<lh-input>` 这类文字误判为选择器违规。
 */
function stripComments(text) {
  const out = []
  let i = 0
  while (i < text.length) {
    if (text.startsWith('/*', i)) {
      const end = text.indexOf('*/', i + 2)
      const stop = end === -1 ? text.length : end + 2
      const seg = text.slice(i, stop)
      // 条件编译注释整段保留（扫描器要靠它识别 H5 豁免区）
      if (CONDITIONAL.test(seg)) out.push(seg)
      i = stop
    } else if (text.startsWith('//', i)) {
      const nl = text.indexOf('\n', i)
      i = nl === -1 ? text.length : nl
    } else {
      out.push(text[i])
      i += 1
    }
  }
  return out.join('')
}

function analyze(file, rawText, problems) {
  // url() 里可能内联 data-URI（含 svg 源码），不能当选择器扫
  const text = stripComments(rawText).replace(/url\([^)]*\)/g, 'url()')
  const lines = text.split(/\r?\n/)
  const rawLines = rawText.split(/\r?\n/)

  let inH5 = false
  lines.forEach((line, index) => {
    const cond = line.match(CONDITIONAL)
    if (cond) {
      if (cond[1] === 'ifdef' && /H5/.test(line)) inH5 = true
      else if (cond[1] === 'endif') inH5 = false
      return
    }
    if (inH5) return

    // 跳过不含选择器的行：声明、@font-face/@keyframes 头、关键帧的 to/from/百分比、
    // @import、空行等（@keyframes 块内不是选择器，否则会把 to / 动画名误判为标签）
    if (/^\s*([-\w]+\s*:|@[\w-]+|to\s*\{|from\s*\{|[\d.]+%\s*\{|source\s*:|}|$)/.test(line)) return

    const raw = rawLines[index] ?? line
    for (const [re, desc] of RULES) {
      re.lastIndex = 0
      if (re.test(line)) {
        problems.push(`${file}:${index + 1} ${desc}\n    ${raw.trim()}`)
      }
    }

    TAG_SELECTOR.lastIndex = 0
    let match
    while ((match = TAG_SELECTOR.exec(line))) {
      if (!ALLOWED_TAGS.has(match[1])) {
        problems.push(`${file}:${index + 1} 标签选择器 <${match[1]}>（WXSS 仅支持 page）\n    ${raw.trim()}`)
      }
    }
  })
}

function main() {
  const files = [...targets, ...collectComponentStyles(), ...collectHostStyles()]
  const problems = []

  for (const file of files) {
    if (!fs.existsSync(file)) {
      problems.push(`${file} 不存在（先跑 pnpm build:styles）`)
      continue
    }
    analyze(file, fs.readFileSync(file, 'utf-8'), problems)
  }

  if (problems.length > 0) {
    console.error(`\n❌ WXSS 门禁失败：${problems.length} 处违规\n`)
    problems.forEach((p) => console.error(p + '\n'))
    process.exit(1)
  }

  console.log(`✅ WXSS 门禁通过：${files.length} 个产物文件零违规`)
}

main()
