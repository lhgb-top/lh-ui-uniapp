import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { createLocalShareAliases } from './scripts/local-share-alias.mjs'

// 本仓 package.json 声明了 "type": "module"，Node 的 ESM→CJS 交互会把整个
// module.exports 当作默认导出（该插件的 module.exports 自身还带一层 default），
// 直接 import uni 拿到的是对象而非函数；用 createRequire 取 CJS 形态最稳
const require = createRequire(import.meta.url)
const uni = require('@dcloudio/vite-plugin-uni').default as () => Plugin[]

export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: [
      // 组件源在 src/components（uni 的 inputDir 内），easycom 规则 "@/components/..."
      // 由 uni 解析到 inputDir；使用者安装后由 npm 解析到包内 src/components/，效果一致
      // 本地联动：家族布局下解析到同级 share 仓源码，无则回退 npm 包（见 scripts/local-share-alias.mjs）
      ...createLocalShareAliases(__dirname),
    ],
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 本库组件不直接 @use share 的 scss（sass bare specifier 在使用方工程解析不了，
        // 见计划 §3.2）；此 loadPaths 只服务 dev 演示工程自身的 scss
        loadPaths: [resolve(__dirname, 'node_modules')],
      },
    },
  },
})
