import { afterEach, describe, expect, it } from 'vitest'
import { computed, nextTick } from 'vue'

/**
 * adapter/locale.ts 的补键回归测试。
 *
 * 历史：share 的 zh-CN / en-US 曾缺少 dialog.confirm / dialog.cancel / input.clear /
 * select.clear / select.filter / select.empty，组件 `t('dialog.confirm', '确定')`
 * 永远走中文 fallback。昔日 share 只读（红线 1）之下曾用 adapter 的 lhlocale.add()
 * 补齐作为过渡；现已在 share 十语言包中根治补齐，adapter 副本已拆除，本测试随之
 * 转变为「share 语言包持续收录这些键」的回归守护（漏键会让非中文语言回显中文）。
 */
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { lhlocale, zhCN } from '@/adapter/locale'

const ZH_EXTRA = {
  'dialog.confirm': '确定',
  'dialog.cancel': '取消',
  'input.clear': '清空',
  'select.clear': '清空',
  'select.filter': '搜索',
  'select.empty': '无匹配项',
}
const EN_EXTRA = {
  'dialog.confirm': 'OK',
  'dialog.cancel': 'Cancel',
  'input.clear': 'Clear',
  'select.clear': 'Clear',
  'select.filter': 'Search',
  'select.empty': 'No matches',
}

describe('adapter/locale 本地补键', () => {
  // 单例语言状态会跨测试泄漏，每例结束复位回默认中文
  afterEach(() => {
    lhlocale.setLocale('zh-CN')
  })

  it('zh-CN 下 6 个补键均按中文文案解析（不走 fallback）', () => {
    lhlocale.setLocale('zh-CN')
    for (const [path, text] of Object.entries(ZH_EXTRA)) {
      expect(lhlocale.t(path, `fallback:${path}`)).toBe(text)
    }
  })

  it('en-US 下 6 个补键均按英文文案解析（不走 fallback）', () => {
    lhlocale.setLocale('en-US')
    for (const [path, text] of Object.entries(EN_EXTRA)) {
      expect(lhlocale.t(path, `fallback:${path}`)).toBe(text)
    }
  })

  it('语言来回切换后补键仍然生效（add 持久化进 userLocales）', () => {
    lhlocale.setLocale('en-US')
    lhlocale.setLocale('zh-CN')
    expect(lhlocale.t('dialog.confirm')).toBe('确定')
    expect(lhlocale.t('select.empty')).toBe('无匹配项')

    lhlocale.setLocale('en-US')
    expect(lhlocale.t('dialog.confirm')).toBe('OK')
    expect(lhlocale.t('select.empty')).toBe('No matches')
  })

  it('补键是深合并，不覆盖同命名空间下的既有键', () => {
    lhlocale.setLocale('zh-CN')
    expect(lhlocale.t('input.placeholder')).toBe('请输入')
    expect(lhlocale.t('select.placeholder')).toBe('请选择')

    lhlocale.setLocale('en-US')
    expect(lhlocale.t('input.placeholder')).not.toBe('请输入')
  })

  it('补键文案随 setLocale 响应式更新（computed 依赖 version）', async () => {
    const label = computed(() => lhlocale.t('dialog.confirm'))
    expect(label.value).toBe('确定')

    lhlocale.setLocale('en-US')
    await nextTick()
    expect(label.value).toBe('OK')

    lhlocale.setLocale('zh-CN')
    await nextTick()
    expect(label.value).toBe('确定')
  })
})

/**
 * locale 使用键门禁：本仓源码里 t()/tm() 字面量键 ⊆ share zh-CN 叶子键。
 * S-23 类漏键的根本防线（漏键会让非中文语言回显中文 fallback）。
 * 兄弟仓脚本经 createRequire 加载——绕开 vite 模块图（仓外绝对路径会被
 * 改写成 `/id/D:\...` 外部 id，fs.allow 也救不回）；家族布局下存在、
 * CI 单仓 clone 时不存在则跳过（与 local-share-alias 存在性守卫同口径）。
 */
const SHARE_SCRIPT = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../../lh-ui-share/scripts/collect-used-locale-keys.mjs',
)

describe('locale 使用键门禁', () => {
  it.skipIf(!existsSync(SHARE_SCRIPT))(
    '本仓 t()/tm() 字面量键都在 share zh-CN 语言包内（防漏键回退中文）',
    () => {
      const req = createRequire(import.meta.url)
      const { collectUsedLocaleKeys, collectLocaleLeafKeys, findMissingKeys } = req(SHARE_SCRIPT)
      const used = collectUsedLocaleKeys({
        sourceDir: join(dirname(fileURLToPath(import.meta.url)), '../../src'),
      })
      const leaves = collectLocaleLeafKeys(zhCN)
      expect(findMissingKeys(used, leaves)).toEqual([])
    },
  )
})
