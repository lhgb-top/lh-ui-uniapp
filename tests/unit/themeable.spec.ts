import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * themeable 名单守卫
 *
 * 组件胶水里 useLhComponent('<name>') / useLhComponentTheme('<name>') 传入的组件名
 * 必须在 LhThemeableComponent 联合类型里登记，否则 componentTheme[name] 的键名
 * 永远无法对上（类型层报错，运行时静默失效）。
 * 名单本身从 config-provider/types.ts 源码提取，保持单一事实源。
 */
const src = join(dirname(fileURLToPath(import.meta.url)), '../../src')

function readThemeableNames(): Set<string> {
  const text = readFileSync(join(src, 'config-provider/types.ts'), 'utf-8')
  const start = text.indexOf('export type LhThemeableComponent')
  const end = text.indexOf('\n}', start)
  const block = text.slice(start, end)
  return new Set([...block.matchAll(/^\s*\|\s*'([^']+)'/gm)].map((match) => match[1]))
}

function collectUsedNames(): Map<string, string[]> {
  const componentsDir = join(src, 'components')
  const used = new Map<string, string[]>()
  const re = /useLhComponent(?:Theme)?\(\s*'([^']+)'/g

  for (const dir of readdirSync(componentsDir, { withFileTypes: true })) {
    if (!dir.isDirectory() || !dir.name.startsWith('lh-')) continue
    for (const file of readdirSync(join(componentsDir, dir.name))) {
      if (!file.endsWith('.ts')) continue
      const text = readFileSync(join(componentsDir, dir.name, file), 'utf-8')
      // 去掉行注释再匹配，避免注释里的示例调用被误当作真实调用点
      const code = text.replace(/^\s*\/\/.*$/gm, '')
      for (const match of code.matchAll(re)) {
        const name = match[1]
        const where = `${dir.name}/${file}`
        used.set(name, [...(used.get(name) ?? []), where])
      }
    }
  }

  return used
}

describe('themeable 名单', () => {
  it('every useLhComponent(name) call site uses a registered name', () => {
    const declared = readThemeableNames()
    const used = collectUsedNames()
    expect(used.size, '没有组件调用 useLhComponent，扫描逻辑可能失效了').toBeGreaterThan(0)

    for (const [name, where] of used) {
      expect(
        declared.has(name),
        `${where.join(', ')} 调用 useLhComponent('${name}')，但 LhThemeableComponent 未登记该名字`,
      ).toBe(true)
    }
  })
})
