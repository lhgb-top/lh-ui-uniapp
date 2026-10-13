import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import pagesJson from '../../src/pages.json'

/**
 * 演示页一致性守卫
 *
 * pages.json 的路由与 src/pages/<name>/<name>.vue 的目录约定双写，
 * 首页列表又引用了一遍路径：三处任一漏改都会出现「点进去 404」。
 * 这里双向断言，并把首页列表的每条路径都对到 pages.json 上。
 */
const src = join(dirname(fileURLToPath(import.meta.url)), '../../src')
const pagesDir = join(src, 'pages')

const routePaths = new Set(
  (pagesJson.pages as Array<{ path: string }>).map((page) => `/${page.path}`),
)

describe('演示页一致性', () => {
  it('每个 pages/<name>/<name>.vue 都在 pages.json 里登记了路由', () => {
    for (const dir of readdirSync(pagesDir, { withFileTypes: true })) {
      if (!dir.isDirectory()) continue
      const sfc = join(pagesDir, dir.name, `${dir.name}.vue`)
      if (!existsSync(sfc)) continue
      expect(
        routePaths.has(`/pages/${dir.name}/${dir.name}`),
        `src/pages/${dir.name}/${dir.name}.vue 未在 pages.json 登记`,
      ).toBe(true)
    }
  })

  it('pages.json 的每条路由（首页除外）都有同名 SFC', () => {
    for (const route of routePaths) {
      if (route === '/pages/index/index') continue
      const sfc = join(src, `${route.slice(1)}.vue`)
      expect(existsSync(sfc), `pages.json 的路由 ${route} 缺少对应 SFC`).toBe(true)
    }
  })

  it('首页列表的每条路径都在 pages.json 里', () => {
    const source = readFileSync(join(pagesDir, 'index/index.vue'), 'utf-8')
    // 从源码文本里提取 list 条目的 path（避免渲染依赖 uni.navigateTo）
    const paths = [...source.matchAll(/path: '([^']+)'/g)].map((match) => match[1])
    expect(paths.length, '首页列表为空，提取逻辑可能失效了').toBeGreaterThan(0)

    for (const path of paths) {
      expect(routePaths.has(path), `首页列表的 ${path} 未在 pages.json 登记`).toBe(true)
    }
  })
})
