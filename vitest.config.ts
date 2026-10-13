import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { createLocalShareAliases } from './scripts/local-share-alias.mjs'

/**
 * uni 条件编译预处理（测试环境专用）
 *
 * esbuild / @vitejs/plugin-vue 不认 uni 的 `#ifdef` 条件编译注释，
 * 没有这一步，`// #ifdef H5` 与 `// #ifndef H5` 两段都会保留，
 * platform.ts 里就会出现重复的 const 声明直接编译失败。
 * 这里按 uni 的语义把非目标平台的分支删掉，与真实构建链一致。
 *
 * 测试目标平台固定为 H5（与 jsdom 环境匹配：getWindowInfo 走 window.innerWidth）。
 */
/** uni 的平台名大小写不敏感（H5 / MP-WEIXIN），统一大写比较 */
const TEST_PLATFORM = 'H5'

const CONDITIONAL_RE = /^\s*(?:\/\/|\/\*|<!--)\s*#(ifdef|ifndef|endif)\b(.*)/

function stripConditional(code: string): string {
  const lines = code.split(/\r?\n/)
  const out: string[] = []
  /** 每层是否保留：嵌套时全部层都保留才输出该行 */
  const keepStack: boolean[] = []

  for (const line of lines) {
    const match = line.match(CONDITIONAL_RE)
    if (match) {
      const [, kind, rest] = match
      if (kind === 'ifdef' || kind === 'ifndef') {
        const platforms = rest
          .trim()
          .split(/\s*\|\|\s*/)
          .filter(Boolean)
        const hit = platforms.some((p) => p.toUpperCase() === TEST_PLATFORM)
        keepStack.push(kind === 'ifdef' ? hit : !hit)
        out.push('')
        continue
      }
      // endif
      keepStack.pop()
      out.push('')
      continue
    }

    if (keepStack.length > 0 && !keepStack.every(Boolean)) {
      out.push('')
      continue
    }
    out.push(line)
  }

  return out.join('\n')
}

function uniConditionalPlugin() {
  return {
    name: 'lh-uni-conditional-test',
    enforce: 'pre',
    transform(code: string, id: string) {
      if (id.includes('node_modules')) return null
      if (!/\.(?:ts|tsx|js|mjs|vue)$/.test(id)) return null
      if (!code.includes('#ifdef') && !code.includes('#ifndef')) return null
      return stripConditional(code)
    },
  }
}

/**
 * uni 内置组件（scroll-view / picker 等）在 H5 目标下没有 Vue 实现，
 * 声明为自定义元素后 Vue 会原样渲染标签并保留子节点，断言能照常深入。
 * lh-* 由 tests/mount.ts 全局注册，不能被当成自定义元素。
 */
const UNI_BUILT_IN_TAGS = new Set([
  'scroll-view',
  'swiper',
  'swiper-item',
  'picker',
  'web-view',
  'rich-text',
  'progress',
  'slider',
  'navigator',
  'image',
  'video',
  'camera',
  'live-player',
  'live-pusher',
  'map',
  'canvas',
  'ad',
  'open-data',
  'official-account',
])

export default defineConfig({
  plugins: [
    uniConditionalPlugin(),
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag: string) => UNI_BUILT_IN_TAGS.has(tag),
        },
      },
    }),
  ],
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
      // 本地联动：家族布局下解析到同级 share 仓源码，无则回退 npm 包（见 scripts/local-share-alias.mjs）
      ...createLocalShareAliases(__dirname),
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.spec.ts'],
    // core 单测唯一一份在 @lh-ui/share，本仓库只覆盖 uni-app 专属层（组件胶水 / 适配 / 服务）
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'clover'],
      include: ['src/components/**', 'src/adapter/**', 'src/message/**', 'src/loading/**'],
    },
  },
})
