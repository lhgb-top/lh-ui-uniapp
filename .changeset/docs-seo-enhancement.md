---
'@lh-ui/uniapp': patch
---

文档站 SEO 增强：补齐此前完全缺失的 head SEO 与 sitemap（家族统一整改，机制见家族 docs/SEO提交与曝光指南.md）：

- `docs/.env.production` 新增 `DOCS_HOSTNAME=https://www.lhgb.top`（sitemap / og:url 用）。
- head 补齐中文 description / keywords、Open Graph、Twitter 卡片与 JSON-LD 结构化数据。
- 新增 `sitemap` 配置（产物输出 sitemap.xml）；robots.txt 由批量构建统一生成注入。
- 首页 `<title>` 描述化为「lh-ui-uniapp · uni-app 跨端国风组件库」（SEO 用），导航栏品牌标走 `themeConfig.siteTitle` 短名，视觉不变。
