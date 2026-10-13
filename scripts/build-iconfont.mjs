/**
 * iconfont 构建管线 —— share 的 SVG path → 小程序可用字体图标
 *
 * 小程序不支持 <svg> 标签（plus 现状是内联 svg，MP 端标签被丢弃）。
 * 本脚本把 share 的 LH_ICON_SVGS_CONST（37 个 24×24 单色 path）转成 iconfont 字体，
 * 组件改用 <text class="lh-iconfont lh-iconfont--<name>"> 渲染，color 走 style 替代 currentColor。
 *
 * 流程：
 *   1. 从已安装的 @lh-ui/share 取 LH_ICON_SVGS_CONST（{ name: pathString }）
 *   2. 每个图标包成完整 <svg viewBox="0 0 24 24"><path/></svg> 写入临时目录
 *   3. svgtofont 生成 ttf，用 getIconUnicode 回调记录 name → 码点
 *      （不依赖 svgtofont 的 css 模板输出：其 copy-template-dir 依赖与本环境
 *       的 readdirp 版本不兼容，且模板格式不可控，故 css 全部自生成）
 *   4. 读 ttf → base64 内嵌，生成自足的 src/icon/iconfont.css（禁止手改）
 *   5. 输出 src/icon/icon-map.ts（name → 码点），组件层按 name 取 content 值
 *
 * 字形一致性靠构建期人工抽查（计划 §十七 R5）；保留「SVG data-URI + <image>」为备选降级路径。
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import svgtofont from 'svgtofont'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const resolvePath = (p) => path.resolve(root, p)

/** share 的图标数据（{ name: pathString }，24×24 单色） */
async function loadIconSvgs() {
  // 本地联动优先（家族布局下取同级 share 源码编译产物），否则取已安装的 npm 包
  const localEs = resolvePath('../lh-ui-share/es/core/icon/svgs.js')
  const modulePath = fs.existsSync(localEs)
    ? localEs
    : resolvePath('node_modules/@lh-ui/share/es/core/icon/svgs.js')

  const mod = await import(pathToFileURL(modulePath).href)
  const svgs = mod.LH_ICON_SVGS_CONST
  if (!svgs || typeof svgs !== 'object') {
    throw new Error(`无法从 ${modulePath} 取到 LH_ICON_SVGS_CONST`)
  }
  return /** @type {Record<string, string>} */ (svgs)
}

/** path 串包成完整 svg 文档（svgtofont 需要完整文件） */
function pathToSvg(name, d) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="${d}" fill="currentColor"/></svg>`
}

const AUTOGEN_HEADER = `/**
 * 自动生成（scripts/build-iconfont.mjs）：share 的 LH_ICON_SVGS_CONST 转成的 iconfont 字体。
 * 禁止手改——改图标请改 share 仓的 src/core/icon/svgs.ts 后重跑 pnpm build:iconfont。
 */
`

async function main() {
  const svgs = await loadIconSvgs()
  const names = Object.keys(svgs).sort()
  console.log(`图标数：${names.length}（${names.slice(0, 6).join(', ')}…）`)

  // 1. 临时 svg 源目录（系统临时区，跑完清理）
  const workdir = path.join(os.tmpdir(), `lh-iconfont-${Date.now()}`)
  const srcDir = path.join(workdir, 'svg')
  const distDir = path.join(workdir, 'fonts')
  fs.mkdirSync(srcDir, { recursive: true })

  for (const name of names) {
    // svgtofont 用文件名作字形名；文件名必须与图标名一致
    fs.writeFileSync(path.join(srcDir, `${name}.svg`), pathToSvg(name, svgs[name]))
  }

  // 2. 生成 ttf（css: false 绕开 copy-template-dir 的依赖不兼容；
  //    码点由 getIconUnicode 回调记录，与 ttf 内实际编码一致）
  const codepointMap = {}
  await svgtofont({
    src: srcDir,
    dist: distDir,
    fontName: 'lh-iconfont',
    css: false,
    log: false,
    // 回调签名 (name, curUnicode, startUnicode) => [unicode, nextStart]；
    // 返回原值即保持默认递增行为，同时把码点记下来
    getIconUnicode: (name, curUnicode, startUnicode) => {
      codepointMap[name] = startUnicode.toString(16).padStart(4, '0')
      return [curUnicode, startUnicode]
    },
  })

  const mapped = Object.keys(codepointMap).length
  if (mapped !== names.length) {
    throw new Error(`码点映射不完整：期望 ${names.length}，实际 ${mapped}`)
  }

  // 3. 读 ttf base64
  const ttfPath = path.join(distDir, 'lh-iconfont.ttf')
  if (!fs.existsSync(ttfPath)) {
    throw new Error(`svgtofont 未生成 ${ttfPath}`)
  }
  const ttfBase64 = fs.readFileSync(ttfPath).toString('base64')
  console.log(`ttf 大小：${Math.round((ttfBase64.length * 0.75) / 1024)} KB`)

  // 4. 生成自足 iconfont.css（base64 内嵌，使用方零字体文件依赖）
  const rules = names
    .map((name) => `.lh-iconfont--${name}::before { content: '\\${codepointMap[name]}'; }`)
    .join('\n')

  const css = `${AUTOGEN_HEADER}
@font-face {
  font-family: 'lh-iconfont';
  src: url('data:font/ttf;base64,${ttfBase64}') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}

.lh-iconfont {
  font-family: 'lh-iconfont';
  font-style: normal;
  font-weight: normal;
  font-display: block;
}

${rules}
`

  fs.mkdirSync(resolvePath('src/icon'), { recursive: true })
  fs.writeFileSync(resolvePath('src/icon/iconfont.css'), css, 'utf-8')

  // 6. 生成 name → 码点映射（组件层按 name 取类名；类名规则与 css 对齐）
  // 模板里写 \\\\ 产出 TS 源码的 '\\ea01'，求值后是 '\ea01'（CSS content 需要带反斜杠）；
  // 只写 \\ 会得到无效转义 '\ea01'，TS 求值时反斜杠被吞掉
  const mapEntries = names.map((name) => `  '${name}': '\\\\${codepointMap[name]}',`).join('\n')
  const iconMap = `/**
 * 自动生成（scripts/build-iconfont.mjs）：share 的 LH_ICON_SVGS_CONST 的码点映射。
 * 禁止手改——与 src/icon/iconfont.css 同源，二者必须一起重新生成
 * （改图标请改 share 仓的 src/core/icon/svgs.ts 后重跑 pnpm build:iconfont）。
 */
export const LH_ICONFONT_CODEPOINTS: Record<string, string> = {
${mapEntries}
}
`
  fs.writeFileSync(resolvePath('src/icon/icon-map.ts'), iconMap, 'utf-8')

  // 清理临时目录
  fs.rmSync(workdir, { recursive: true, force: true })

  console.log(`iconfont 生成：${names.length} 个图标 -> src/icon/iconfont.css + src/icon/icon-map.ts`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
