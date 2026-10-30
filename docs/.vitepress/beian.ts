// ============================================================
// 备案/版权 footer 行（VitePress 适配器，六个 VitePress 站同款复制）
//
// 数据来自 docs/.beian/beian.json —— 由工作区根 scripts/sync-beian.mjs 从
// lh-feng-mo-workspace 的 sharedSite 真源生成（含本站 beian.local.json 覆盖，
// 机制见工作区 docs/备案资源同步方案.md）。本文件只负责渲染格式，
// 不含任何数据副本，改备案号请改真源后重跑同步脚本。
//
// 渲染约定（与 feng-mo 五站的 zhOnly 约定一致）：
// - 中文界面（lang 以 zh 开头）：版权 | ICP 备案 | 公安备案（带徽标图标）。
// - 非中文界面：仅版权（holder 用英文署名）。
// - 结束年份取当前年，禁止硬编码年份造成漂移。
// - VitePress 的 VPFooter 以 v-html 渲染 footer.copyright，故这里返回 HTML 字符串；
//   图标尺寸用内联样式，避免各站额外挂 CSS。
// ============================================================

import beianJson from '../.beian/beian.json'

interface BeianData {
  copyright: {
    holder: string
    holderEn: string
    foundedYear: number
    /** 站点 override 可追加的版权行 HTML（如许可证链接） */
    suffixHtml?: string
  }
  beian?: {
    /** 站点 override 可隐藏整行备案信息 */
    hide?: boolean
    police: { code: string; label: string; labelEn: string; url: string; icon: string }
    icp: { label: string; labelEn: string; url: string }
  }
}

const data = beianJson as BeianData

/** 是否中文界面（root=zh-CN、zh-TW 均算中文） */
const isZh = (lang: string): boolean => lang.startsWith('zh')

/**
 * 生成 footer.copyright 的 HTML 字符串。
 * @param lang locale 的 lang（LOCALES 里的 l.lang）
 * @param base 站点部署 base（首尾带斜杠，如 '/lhui/vue3/'；本地开发为 '/'）
 */
export function beianCopyright(lang: string, base: string): string {
  const year = new Date().getFullYear()
  const cy = data.copyright
  const parts = [`Copyright © ${cy.foundedYear}-${year} ${isZh(lang) ? cy.holder : cy.holderEn}`]
  if (cy.suffixHtml) parts.push(cy.suffixHtml)

  const beian = data.beian
  if (beian && !beian.hide && isZh(lang)) {
    parts.push(`<a href="${beian.icp.url}" target="_blank" rel="noopener">${beian.icp.label}</a>`)
    const icon = `${base.endsWith('/') ? base.slice(0, -1) : base}${beian.police.icon}`
    parts.push(
      `<a href="${beian.police.url}" target="_blank" rel="noopener">` +
        `<img src="${icon}" alt="公安备案徽标" style="height:1em;width:auto;vertical-align:-0.15em;margin:0 2px">` +
        `${beian.police.label}</a>`,
    )
  }
  return parts.join(' | ')
}
