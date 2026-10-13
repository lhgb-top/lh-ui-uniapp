import { computed, provide, watch, inject } from 'vue'
import type { ComputedRef } from 'vue'
import type { LhConfigProviderProps, LhConfigContext } from './types'
import { LH_CONFIG_PROVIDER_KEY } from './types'
import { lhlocale } from '@lh-ui/share/locales'
import { cssVars as buildCssVars } from '@lh-ui/share/utils/css-var'

/**
 * ConfigProvider 响应式胶水（逻辑对齐 plus 仓 src/config-provider/index.ts）
 *
 * 与 plus 的差异（uni-app 适配点）：
 * - 暗色不靠 document.documentElement（小程序无 DOM），改为在包裹节点加 `dark` 类，
 *   配合净化产物里的 `page.dark, .dark { ... }` 暗色块
 * - locale 同样走 share 的 lhlocale 发射器，由 src/locale 的 ref 包装层通知视图更新
 */
export function useLhConfigProvider(props: LhConfigProviderProps) {
  /** themeVars → :style 绑定的 CSS 变量对象 */
  const cssVars = computed(() => buildCssVars(props.themeVars ?? {}))

  /** 暗色类名（净化后样式里暗色块选择器为 .dark） */
  const darkClass = computed(() => (props.theme === 'dark' ? 'dark' : ''))

  /**
   * provide 的上下文。必须用 computed 包装：直接 reactive({ ...props }) 只会在 setup 时
   * 拍一次快照，之后父组件改 prop 不会传导给 inject 方。
   */
  const configContext = computed<LhConfigContext>(() => ({
    size: props.size,
    locale: props.locale,
    theme: props.theme,
    themeVars: props.themeVars,
    componentTheme: props.componentTheme,
  }))

  provide(LH_CONFIG_PROVIDER_KEY, configContext)

  // locale 变化时同步更新全局 locale（含首次）
  watch(
    () => props.locale,
    (locale) => {
      if (locale) lhlocale.setLocale(locale)
    },
    { immediate: true },
  )

  return {
    configContext,
    cssVars,
    darkClass,
  }
}

/**
 * 子组件中注入 ConfigProvider 配置
 * @returns 配置上下文的 ComputedRef，未找到 provider 时返回 null
 */
export type LhConfigContextRef = ComputedRef<LhConfigContext> | null

export function useLhConfigContext(): LhConfigContextRef {
  return inject(LH_CONFIG_PROVIDER_KEY, null)
}
