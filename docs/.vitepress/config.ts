/**
 * lh-ui-uniapp 文档站配置（VitePress，轻量 v1）
 *
 * 与家族其他 VitePress 站一致：显式 loadEnv 读 DOCS_BASE。
 * v1 不做活渲染（uni-app 组件需要 uni 编译链，浏览器里跑不起来），
 * demo 一律单围栏代码块；交互演示留给各端 demo 工程（pnpm dev:h5）。
 */
import { defineConfig, loadEnv } from 'vitepress'
import { resolve } from 'node:path'

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
const env = loadEnv(mode, resolve(__dirname, '..'), 'DOCS_')

const base = env.DOCS_BASE || '/'

export default defineConfig({
  lang: 'zh-CN',
  title: 'lh-ui uniapp',
  description: 'lh-ui 家族 uni-app 组件库（H5 + 微信小程序）',
  base,
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    siteTitle: 'lh-ui uniapp',
    sidebar: [
      {
        text: '指南',
        items: [
          { text: '安装', link: '/guide/installation' },
          { text: '平台支持', link: '/guide/platform' },
          { text: '与 Vue3 版的 API 差异', link: '/guide/differences' },
          { text: '常见问题', link: '/guide/faq' },
          { text: '微信小程序人工回归清单', link: '/guide/mp-regression' },
        ],
      },
      {
        text: '组件',
        items: [
          { text: 'ConfigProvider 全局配置', link: '/components/config-provider' },
          { text: 'Button 按钮', link: '/components/button' },
          { text: 'Icon 图标', link: '/components/icon' },
          { text: 'Space 间距', link: '/components/space' },
          { text: 'Divider 分割线', link: '/components/divider' },
          { text: 'Input 输入框', link: '/components/input' },
          { text: 'Select 选择器', link: '/components/select' },
          { text: 'Checkbox 复选框', link: '/components/checkbox' },
          { text: 'Radio 单选框', link: '/components/radio' },
          { text: 'Switch 开关', link: '/components/switch' },
          { text: 'Tag 标签', link: '/components/tag' },
          { text: 'Badge 徽标', link: '/components/badge' },
          { text: 'Avatar 头像', link: '/components/avatar' },
          { text: 'Progress 进度条', link: '/components/progress' },
          { text: 'Skeleton 骨架屏', link: '/components/skeleton' },
          { text: 'Empty 空状态', link: '/components/empty' },
          { text: 'Card 卡片', link: '/components/card' },
          { text: 'Form 表单', link: '/components/form' },
          { text: 'Dialog 对话框', link: '/components/dialog' },
          { text: 'Tooltip 文字提示', link: '/components/tooltip' },
        ],
      },
      {
        text: '服务',
        items: [
          { text: 'Message 消息提示', link: '/services/message' },
          { text: 'Loading 加载', link: '/services/loading' },
        ],
      },
    ],
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一页', next: '下一页' },
    lastUpdated: { text: '最后更新于' },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    socialLinks: [{ icon: 'github', link: 'https://github.com/lhgb-top/lh-ui-uniapp' }],
  },
  vite: {
    resolve: {
      alias: [
        // 文档站只做展示，不引库源码；样式直接引构建产物 CSS
        { find: '@', replacement: resolve(__dirname, '..') },
      ],
    },
  },
})
