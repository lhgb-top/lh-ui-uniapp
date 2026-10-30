import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'

// 语言切换不入历史栈：默认主题语言菜单是原生 <a href>，点击整页载入并 push 一条历史；
// 同一页面试 N 种语言就堆 N 条，back 只能逐语言退。捕获阶段拦截语言菜单内的同源链接改用
// location.replace——同样整页载入，但不留历史条目，back 直达切换前的页面（2026-10-15）
function setupLocaleReplaceNavigation() {
  if (typeof document === 'undefined') return
  document.addEventListener(
    'click',
    (e) => {
      const link = (e.target as HTMLElement | null)?.closest('a')
      if (!link) return
      if (!link.closest('.VPNavBarTranslations, .VPNavScreenTranslations')) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || link.target === '_blank') return
      let url: URL
      try {
        url = new URL(link.href, window.location.href)
      } catch {
        return
      }
      if (url.origin !== window.location.origin) return
      e.preventDefault()
      window.location.replace(url.href)
    },
    true,
  )
}

// 本站是纯静态文档站（不做活渲染：uni-app 组件需要 uni 编译链），零主题定制，
// theme 目录存在的唯一目的是挂语言切换拦截器
export default {
  extends: DefaultTheme,
  enhanceApp() {
    setupLocaleReplaceNavigation()
  },
} satisfies Theme
