/**
 * locale 响应式适配层 —— 给 share 的纯事件发射器包一层 ref
 *
 * share 的 LhLocale 是框架无关的纯事件发射器（version getter + subscribe()），
 * 本模块用模块级 ref 订阅它，恢复 Vue 响应式：组件里 `void lhlocale.version.value`
 * 建立依赖，setLocale → share bump → subscribe 回调 → version.value 自增 → 重渲染。
 *
 * 【设计决策】订阅机制照搬 vue2 仓（模块级 ref + subscribe，不解除订阅——
 * 单例与应用同生命周期）；导出形态对齐 plus 仓的对象包（lhlocale.version/t/setLocale …），
 * 因为 message/loading 等组件消费点是 `void lhlocale.version.value`，对象包写法一处统一。
 * 计划文档原文写「逐行照搬 vue2」，此处按上述理由调整，已在本仓 AGENTS.md 登记。
 */
import { ref } from 'vue'
import {
  lhlocale as shareLhlocale,
  zhCN,
  enUS,
} from '@lh-ui/share/locales'
import type {
  LhLocaleType,
  LhLocaleMessages,
  LhLocalePath,
  LhTranslate,
} from '@lh-ui/share/locales'

// 模块级 ref：订阅 share 单例，locale 变化时自增触发依赖更新
const version = ref(shareLhlocale.version)
shareLhlocale.subscribe((v) => {
  version.value = v
})

/**
 * 本库组件用到、但 share 语言包尚未收录的文案键。
 *
 * share 的 zh-CN / en-US 没有 dialog.confirm / dialog.cancel / input.clear /
 * select.clear / select.filter / select.empty，组件里 `t('dialog.confirm', '确定')`
 * 会永远走中文 fallback —— 切到英文后对话框按钮仍显示「确定/取消」。
 * share 只读（红线 1），在此用 share 的 add() 按语言深合并补齐（add 会持久化进
 * userLocales，setLocale 切换语言后仍生效）。其他语言未内置，沿用各自的 fallback。
 */
const LH_LOCALE_EXTRA_ZH_CN = {
  dialog: { confirm: '确定', cancel: '取消' },
  input: { clear: '清空' },
  select: { clear: '清空', filter: '搜索', empty: '无匹配项' },
}
const LH_LOCALE_EXTRA_EN_US = {
  dialog: { confirm: 'OK', cancel: 'Cancel' },
  input: { clear: 'Clear' },
  select: { clear: 'Clear', filter: 'Search', empty: 'No matches' },
}
shareLhlocale.add('zh-CN', LH_LOCALE_EXTRA_ZH_CN)
shareLhlocale.add('en-US', LH_LOCALE_EXTRA_EN_US)

/**
 * 响应式版 lhlocale：读 t() 前先 void version.value 建立响应式依赖，
 * setLocale 后依赖本 t() 的 computed / 模板会自动重算。
 */
export const lhlocale = {
  version,
  t: ((path: LhLocalePath, fallbackOrParams?: string | Record<string, unknown>) => {
    void version.value
    return shareLhlocale.t(path, fallbackOrParams)
  }) as LhTranslate,
  tm: (path: LhLocalePath, fallback?: string[]) => {
    void version.value
    return shareLhlocale.tm(path, fallback ?? [])
  },
  getLocale: () => shareLhlocale.getLocale(),
  use: (options: { locale: LhLocaleType; messages: LhLocaleMessages }) =>
    shareLhlocale.use(options),
  setLocale: (locale: LhLocaleType) => shareLhlocale.setLocale(locale),
  add: (locale: LhLocaleType, messages: LhLocaleMessages) =>
    shareLhlocale.add(locale, messages),
}

export { zhCN, enUS }
export type {
  LhLocaleType,
  LhLocaleMessages,
  LhLocalePath,
  LhTranslate,
}
