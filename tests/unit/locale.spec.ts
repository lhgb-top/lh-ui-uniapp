import { afterEach, describe, expect, it } from 'vitest'
import { computed, nextTick } from 'vue'

/**
 * adapter/locale.ts 本地补键的回归测试。
 *
 * share 的 zh-CN / en-US 没有收录 dialog.confirm / dialog.cancel / input.clear /
 * select.clear / select.filter / select.empty，本仓在 adapter 模块初始化时用
 * share 的 lhlocale.add() 按语言深合并补齐。add() 会把合并结果持久化进 share 的
 * userLocales，setLocale 切换语言时 resolve() 优先取 userLocales，故补键在
 * 语言来回切换后仍然生效——本测试覆盖的正是这条链路（切走再切回）。
 */
import { lhlocale } from '@/adapter/locale'

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
