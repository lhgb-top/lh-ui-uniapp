/**
 * 本地联动 alias（家族布局专用）
 *
 * 家族布局下（lh-ui-uniapp 与 lh-ui-share 同父目录），把 @lh-ui/share 的所有子路径
 * 直接解析到同级 share 仓的**源码**（src/ 与 styles/）：dev / test 不依赖 npm 产物，
 * 改 share 即时热更新，无需构建或发版。share 的 npm 产物只服务终端用户独立引入。
 *
 * 守卫：兄弟仓不存在（CI 单仓 clone、独立下载）时返回空数组，alias 不生效，
 * 自动回退到已安装的 npm 包，保证两种布局都能跑。
 *
 * 顺序：bare `@lh-ui/share` 必须排在子路径正则**之后**——vite 的字符串 alias 是前缀匹配，
 * 裸条目会吞掉所有 @lh-ui/share/* 子路径。
 *
 * 与 lh-ui-plus / lh-ui-vue2 的同名脚本同源，改动需三端同步。
 *
 * @param {string} repoRoot 本仓库根目录（vite / vitest 配置文件的 __dirname）
 * @returns {Array<{ find: RegExp, replacement: string }>}
 */
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'

export function createLocalShareAliases(repoRoot) {
  const shareRoot = resolve(repoRoot, '..', 'lh-ui-share')
  if (!existsSync(resolve(shareRoot, 'src'))) return []

  return [
    // 样式源码。share 的源码布局是 styles/<name>/index.scss（目录），package.json exports
    // 用 "./styles/*": "./styles/*/index.scss" 补了这层；alias 必须逐条对齐 exports 语义，
    // 否则无后缀的 @lh-ui/share/styles/<name> 解析到目录上、vite 报 Failed to resolve。
    //   ① 带扩展名：index.scss / theme/index.scss / theme/common/*.scss …（exports 里的具名条目）
    {
      find: /^@lh-ui\/share\/styles\/(.+\.(?:scss|css))$/,
      replacement: resolve(shareRoot, 'styles/$1'),
    },
    //   ② theme/common 下无后缀 → 补 .scss（exports "./styles/theme/common/*"）
    {
      find: /^@lh-ui\/share\/styles\/theme\/common\/([^/]+)$/,
      replacement: resolve(shareRoot, 'styles/theme/common/$1.scss'),
    },
    //   ③ 组件名无后缀 → <name>/index.scss（exports "./styles/*" → "./styles/*/index.scss"）
    { find: /^@lh-ui\/share\/styles\/([^/]+)$/, replacement: resolve(shareRoot, 'styles/$1/index.scss') },
    // 无头逻辑：@lh-ui/share/core/** → share/src/core/**
    { find: /^@lh-ui\/share\/core\/(.*)$/, replacement: resolve(shareRoot, 'src/core/$1') },
    // 其余顶层模块：@lh-ui/share/{utils,constants,theme,locales,types}/** → share/src/**
    {
      find: /^@lh-ui\/share\/(utils|constants|theme|locales|types)(\/.*)?$/,
      replacement: resolve(shareRoot, 'src/$1$2'),
    },
    // 裸导入：@lh-ui/share → share/src/index.ts（必须排在最后）
    { find: /^@lh-ui\/share$/, replacement: resolve(shareRoot, 'src/index.ts') },
  ]
}
