---
'@lh-ui/uniapp': patch
---

文档站语言切换体验改进：

- 切换语言由整页 `<a>` 跳转（push）改为拦截后 `location.replace()`：语言切换被视为「同一页换语言」而非新页面，浏览器回退不再逐语言回退堆积历史条目，back 直达切换前页面。新增 `docs/.vitepress/theme/index.ts`（extends DefaultTheme，enhanceApp 仅挂拦截器）承载该行为；拦截器限定在导航栏语言切换菜单 `.VPNavBarTranslations` / `.VPNavScreenTranslations` 内的同源链接，修饰键（ctrl/meta/shift/alt）与 `target="_blank"` 不拦截，保留原行为。
- `buildLocales()` 加内容门禁：目标语言内容目录 `docs/<locale>/` 尚不存在时跳过该语言（切换器不展示空内容语言，避免点到无翻译的语言），目录出现后守卫自动失效，无需手工撤销。
