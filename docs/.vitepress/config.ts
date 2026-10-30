/**
 * lh-ui-uniapp 文档站配置（VitePress，轻量 v1）
 *
 * 与家族其他 VitePress 站一致：显式 loadEnv 读 DOCS_BASE。
 * v1 不做活渲染（uni-app 组件需要 uni 编译链，浏览器里跑不起来），
 * demo 一律单围栏代码块；交互演示留给各端 demo 工程（pnpm dev:h5）。
 *
 * 九语言 i18n：结构同 android 等站（LOCALES + labels + buildLocales），
 * 侧边栏文案、页脚、主题切换等 UI 文案每语言一份。
 */
import { defineConfig, loadEnv } from 'vitepress'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { beianCopyright } from './beian'

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
const env = loadEnv(mode, resolve(__dirname, '..'), 'DOCS_')

const base = env.DOCS_BASE || '/'

// 规范主机（sitemap / og:url / robots 用）：未配 DOCS_HOSTNAME 时默认主站
const hostname = (env.DOCS_HOSTNAME || 'https://www.lhgb.top').replace(/\/$/, '')

// ── locale 清单 ──────────────────────────────────────────────
// key  = URL 前缀与 docs/ 下的内容目录名（root 除外，root 是中文真源）
// lang = <html lang> 值，同时是 @lh-ui/share 语言包名
// label= 语言切换器的显示名（一律用各语言的自称）
// dir  = 仅 ar 填 'rtl'，由 VitePress 注入 <html dir="rtl">
const LOCALES = [
  { key: 'root', lang: 'zh-CN', label: '简体中文' },
  { key: 'en', lang: 'en-US', label: 'English' },
  { key: 'zh-TW', lang: 'zh-TW', label: '繁體中文' },
  { key: 'ja', lang: 'ja-JP', label: '日本語' },
  { key: 'ko', lang: 'ko-KR', label: '한국어' },
  { key: 'es', lang: 'es', label: 'Español' },
  { key: 'ar', lang: 'ar', label: 'العربية', dir: 'rtl' },
  { key: 'fr', lang: 'fr-FR', label: 'Français' },
  { key: 'ru', lang: 'ru', label: 'Русский' },
] as const

type Lang = (typeof LOCALES)[number]['lang']
type Labels = Record<Lang, string>

// ── UI 文案（每语言一份，术语按 docs/i18n/glossary.md）──────────────
const UI = {
  outline: {
    'zh-CN': '本页目录',
    'en-US': 'On this page',
    'zh-TW': '本頁目錄',
    'ja-JP': 'このページの内容',
    'ko-KR': '이 페이지 목차',
    es: 'En esta página',
    ar: 'في هذه الصفحة',
    'fr-FR': 'Sur cette page',
    ru: 'Содержание страницы',
  },
  prev: {
    'zh-CN': '上一页',
    'en-US': 'Previous',
    'zh-TW': '上一頁',
    'ja-JP': '前へ',
    'ko-KR': '이전 페이지',
    es: 'Anterior',
    ar: 'السابق',
    'fr-FR': 'Précédent',
    ru: 'Назад',
  },
  next: {
    'zh-CN': '下一页',
    'en-US': 'Next',
    'zh-TW': '下一頁',
    'ja-JP': '次へ',
    'ko-KR': '다음 페이지',
    es: 'Siguiente',
    ar: 'التالي',
    'fr-FR': 'Suivant',
    ru: 'Далее',
  },
  lastUpdated: {
    'zh-CN': '最后更新于',
    'en-US': 'Last updated',
    'zh-TW': '最後更新於',
    'ja-JP': '最終更新',
    'ko-KR': '최근 업데이트',
    es: 'Última actualización',
    ar: 'آخر تحديث',
    'fr-FR': 'Dernière mise à jour',
    ru: 'Последнее обновление',
  },
  returnToTop: {
    'zh-CN': '回到顶部',
    'en-US': 'Return to top',
    'zh-TW': '回到頂部',
    'ja-JP': '上に戻る',
    'ko-KR': '맨 위로',
    es: 'Volver arriba',
    ar: 'العودة للأعلى',
    'fr-FR': 'Retour en haut',
    ru: 'Наверх',
  },
  menu: {
    'zh-CN': '菜单',
    'en-US': 'Menu',
    'zh-TW': '選單',
    'ja-JP': 'メニュー',
    'ko-KR': '메뉴',
    es: 'Menú',
    ar: 'القائمة',
    'fr-FR': 'Menu',
    ru: 'Меню',
  },
  theme: {
    'zh-CN': '主题',
    'en-US': 'Theme',
    'zh-TW': '主題',
    'ja-JP': 'テーマ',
    'ko-KR': '테마',
    es: 'Tema',
    ar: 'السمة',
    'fr-FR': 'Thème',
    ru: 'Тема',
  },
  toLight: {
    'zh-CN': '切换到浅色模式',
    'en-US': 'Switch to light mode',
    'zh-TW': '切換到淺色模式',
    'ja-JP': 'ライトモードに切り替え',
    'ko-KR': '라이트 모드로 전환',
    es: 'Cambiar a modo claro',
    ar: 'التبديل إلى الوضع الفاتح',
    'fr-FR': 'Passer en mode clair',
    ru: 'Переключить на светлую тему',
  },
  toDark: {
    'zh-CN': '切换到深色模式',
    'en-US': 'Switch to dark mode',
    'zh-TW': '切換到深色模式',
    'ja-JP': 'ダークモードに切り替え',
    'ko-KR': '다크 모드로 전환',
    es: 'Cambiar a modo oscuro',
    ar: 'التبديل إلى الوضع الداكن',
    'fr-FR': 'Passer en mode sombre',
    ru: 'Переключить на тёмную тему',
  },
  description: {
    'zh-CN': 'lh-ui 家族 uni-app 组件库（H5 + 微信小程序）',
    'en-US': 'lh-ui family uni-app component library (H5 + WeChat Mini Program)',
    'zh-TW': 'lh-ui 家族 uni-app 元件庫（H5 + 微信小程式）',
    'ja-JP': 'lh-ui ファミリー uni-app コンポーネントライブラリ（H5 + WeChat ミニプログラム）',
    'ko-KR': 'lh-ui 패밀리 uni-app 컴포넌트 라이브러리(H5 + WeChat 미니프로그램)',
    es: 'Biblioteca de componentes uni-app de la familia lh-ui (H5 + Mini Programa de WeChat)',
    ar: 'مكتبة مكوّنات uni-app لعائلة lh-ui (H5 + برنامج WeChat المصغر)',
    'fr-FR': 'Bibliothèque de composants uni-app de la famille lh-ui (H5 + Mini Programme WeChat)',
    ru: 'Библиотека компонентов uni-app семейства lh-ui (H5 + WeChat Mini Program)',
  },
  // 站点标题（SEO <title> 用，描述性文案利于搜索「lh ui」「国风组件库」等关键词；
  // 导航栏显示短品牌名走 themeConfig.siteTitle）。文案与 docs/部署/seo-meta.json 保持一致
  siteTitle: {
    'zh-CN': 'lh-ui-uniapp · uni-app 跨端国风组件库',
    'en-US': 'lh-ui-uniapp · Cross-platform Chinese-style UI Library for uni-app',
    'zh-TW': 'lh-ui-uniapp · uni-app 跨端國風元件庫',
    'ja-JP': 'lh-ui-uniapp · uni-app 向け中国風 UI ライブラリ',
    'ko-KR': 'lh-ui-uniapp · uni-app용 중국풍 UI 라이브러리',
    es: 'lh-ui-uniapp · Biblioteca de UI de estilo chino para uni-app',
    ar: 'lh-ui-uniapp · مكتبة واجهة صينية الطراز لـ uni-app',
    'fr-FR': 'lh-ui-uniapp · Bibliothèque d\'UI au style chinois pour uni-app',
    ru: 'lh-ui-uniapp · Библиотека UI в китайском стиле для uni-app',
  },
}

// ── 侧边栏数据：新增组件只需在此加一条 ─────────────────────
// labels 按 LOCALES 的 lang 一一填写；link 后缀（slug）决定所有语言下的 URL（不译）
const guideGroup: Labels = {
  'zh-CN': '指南',
  'en-US': 'Guide',
  'zh-TW': '指南',
  'ja-JP': 'ガイド',
  'ko-KR': '가이드',
  es: 'Guía',
  ar: 'دليل',
  'fr-FR': 'Guide',
  ru: 'Руководство',
}
const componentGroup: Labels = {
  'zh-CN': '组件',
  'en-US': 'Components',
  'zh-TW': '元件',
  'ja-JP': 'コンポーネント',
  'ko-KR': '컴포넌트',
  es: 'Componentes',
  ar: 'المكوّنات',
  'fr-FR': 'Composants',
  ru: 'Компоненты',
}
const serviceGroup: Labels = {
  'zh-CN': '服务',
  'en-US': 'Services',
  'zh-TW': '服務',
  'ja-JP': 'サービス',
  'ko-KR': '서비스',
  es: 'Servicios',
  ar: 'الخدمات',
  'fr-FR': 'Services',
  ru: 'Сервисы',
}

const guideItems: { slug: string; labels: Labels }[] = [
  {
    slug: 'installation',
    labels: { 'zh-CN': '安装', 'en-US': 'Installation', 'zh-TW': '安裝', 'ja-JP': 'インストール', 'ko-KR': '설치', es: 'Instalación', ar: 'التثبيت', 'fr-FR': 'Installation', ru: 'Установка' },
  },
  {
    slug: 'platform',
    labels: { 'zh-CN': '平台支持', 'en-US': 'Platform Support', 'zh-TW': '平台支援', 'ja-JP': 'プラットフォームサポート', 'ko-KR': '플랫폼 지원', es: 'Soporte de plataformas', ar: 'دعم المنصات', 'fr-FR': 'Prise en charge des plateformes', ru: 'Поддержка платформ' },
  },
  {
    slug: 'differences',
    labels: { 'zh-CN': '与 Vue3 版的 API 差异', 'en-US': 'API Differences from the Vue3 Version', 'zh-TW': '與 Vue3 版的 API 差異', 'ja-JP': 'Vue3 版との API 差異', 'ko-KR': 'Vue3 버전과의 API 차이', es: 'Diferencias de API frente a la versión Vue3', ar: 'اختلافات API عن نسخة Vue3', 'fr-FR': "Différences d'API avec la version Vue3", ru: 'Отличия API от версии Vue3' },
  },
  {
    slug: 'faq',
    labels: { 'zh-CN': '常见问题', 'en-US': 'FAQ', 'zh-TW': '常見問題', 'ja-JP': 'よくある質問', 'ko-KR': '자주 묻는 질문', es: 'Preguntas frecuentes', ar: 'الأسئلة الشائعة', 'fr-FR': 'FAQ', ru: 'Частые вопросы' },
  },
  {
    slug: 'mp-regression',
    labels: { 'zh-CN': '微信小程序人工回归清单', 'en-US': 'WeChat Mini Program Manual Regression Checklist', 'zh-TW': '微信小程序人工回歸清單', 'ja-JP': 'WeChat ミニプログラム手動回帰チェックリスト', 'ko-KR': 'WeChat 미니프로그램 수동 회귀 체크리스트', es: 'Lista de regresión manual del Mini Programa de WeChat', ar: 'قائمة التحقق اليدوي لبرنامج WeChat المصغر', 'fr-FR': 'Liste de régression manuelle du Mini Programme WeChat', ru: 'Контрольный список ручного регрессионного тестирования WeChat Mini Program' },
  },
]

const componentItems: { slug: string; labels: Labels }[] = [
  {
    slug: 'config-provider',
    labels: { 'zh-CN': 'ConfigProvider 全局配置', 'en-US': 'ConfigProvider', 'zh-TW': 'ConfigProvider 全域配置', 'ja-JP': 'ConfigProvider グローバル設定', 'ko-KR': 'ConfigProvider 전역 설정', es: 'ConfigProvider (configuración global)', ar: 'ConfigProvider (إعداد عام)', 'fr-FR': 'ConfigProvider (configuration globale)', ru: 'ConfigProvider (глобальная настройка)' },
  },
  {
    slug: 'button',
    labels: { 'zh-CN': 'Button 按钮', 'en-US': 'Button', 'zh-TW': 'Button 按鈕', 'ja-JP': 'Button ボタン', 'ko-KR': 'Button 버튼', es: 'Botón', ar: 'زر Button', 'fr-FR': 'Bouton', ru: 'Кнопка' },
  },
  {
    slug: 'icon',
    labels: { 'zh-CN': 'Icon 图标', 'en-US': 'Icon', 'zh-TW': 'Icon 圖示', 'ja-JP': 'Icon アイコン', 'ko-KR': 'Icon 아이콘', es: 'Icono', ar: 'أيقونة Icon', 'fr-FR': 'Icône', ru: 'Значок' },
  },
  {
    slug: 'space',
    labels: { 'zh-CN': 'Space 间距', 'en-US': 'Space', 'zh-TW': 'Space 間距', 'ja-JP': 'Space 間隔', 'ko-KR': 'Space 간격', es: 'Espaciado', ar: 'تباعد Space', 'fr-FR': 'Espacement', ru: 'Интервал' },
  },
  {
    slug: 'divider',
    labels: { 'zh-CN': 'Divider 分割线', 'en-US': 'Divider', 'zh-TW': 'Divider 分隔線', 'ja-JP': 'Divider 区切り線', 'ko-KR': 'Divider 구분선', es: 'Divisor', ar: 'فاصل Divider', 'fr-FR': 'Séparateur', ru: 'Разделитель' },
  },
  {
    slug: 'input',
    labels: { 'zh-CN': 'Input 输入框', 'en-US': 'Input', 'zh-TW': 'Input 輸入框', 'ja-JP': 'Input 入力フィールド', 'ko-KR': 'Input 입력 상자', es: 'Campo de entrada', ar: 'حقل إدخال Input', 'fr-FR': 'Champ de saisie', ru: 'Поле ввода' },
  },
  {
    slug: 'select',
    labels: { 'zh-CN': 'Select 选择器', 'en-US': 'Select', 'zh-TW': 'Select 選擇器', 'ja-JP': 'Select セレクト', 'ko-KR': 'Select 셀렉트', es: 'Selector', ar: 'منتقي Select', 'fr-FR': 'Sélecteur', ru: 'Выпадающий список' },
  },
  {
    slug: 'checkbox',
    labels: { 'zh-CN': 'Checkbox 复选框', 'en-US': 'Checkbox', 'zh-TW': 'Checkbox 核取方塊', 'ja-JP': 'Checkbox チェックボックス', 'ko-KR': 'Checkbox 체크박스', es: 'Casilla de verificación', ar: 'مربع اختيار Checkbox', 'fr-FR': 'Case à cocher', ru: 'Флажок' },
  },
  {
    slug: 'radio',
    labels: { 'zh-CN': 'Radio 单选框', 'en-US': 'Radio', 'zh-TW': 'Radio 單選鈕', 'ja-JP': 'Radio ラジオボタン', 'ko-KR': 'Radio 라디오 버튼', es: 'Botón de radio', ar: 'زر اختيار Radio', 'fr-FR': 'Bouton radio', ru: 'Радиокнопка' },
  },
  {
    slug: 'switch',
    labels: { 'zh-CN': 'Switch 开关', 'en-US': 'Switch', 'zh-TW': 'Switch 開關', 'ja-JP': 'Switch スイッチ', 'ko-KR': 'Switch 스위치', es: 'Interruptor', ar: 'مفتاح Switch', 'fr-FR': 'Interrupteur', ru: 'Переключатель' },
  },
  {
    slug: 'tag',
    labels: { 'zh-CN': 'Tag 标签', 'en-US': 'Tag', 'zh-TW': 'Tag 標籤', 'ja-JP': 'Tag タグ', 'ko-KR': 'Tag 태그', es: 'Etiqueta', ar: 'وسم Tag', 'fr-FR': 'Étiquette', ru: 'Тег' },
  },
  {
    slug: 'badge',
    labels: { 'zh-CN': 'Badge 徽标', 'en-US': 'Badge', 'zh-TW': 'Badge 徽標', 'ja-JP': 'Badge バッジ', 'ko-KR': 'Badge 배지', es: 'Insignia', ar: 'شارة Badge', 'fr-FR': 'Badge', ru: 'Бейдж' },
  },
  {
    slug: 'avatar',
    labels: { 'zh-CN': 'Avatar 头像', 'en-US': 'Avatar', 'zh-TW': 'Avatar 頭像', 'ja-JP': 'Avatar アバター', 'ko-KR': 'Avatar 아바타', es: 'Avatar', ar: 'Avatar (صورة رمزية)', 'fr-FR': 'Avatar', ru: 'Аватар' },
  },
  {
    slug: 'progress',
    labels: { 'zh-CN': 'Progress 进度条', 'en-US': 'Progress', 'zh-TW': 'Progress 進度條', 'ja-JP': 'Progress プログレスバー', 'ko-KR': 'Progress 진행률 표시줄', es: 'Barra de progreso', ar: 'شريط التقدم Progress', 'fr-FR': 'Barre de progression', ru: 'Индикатор выполнения' },
  },
  {
    slug: 'skeleton',
    labels: { 'zh-CN': 'Skeleton 骨架屏', 'en-US': 'Skeleton', 'zh-TW': 'Skeleton 骨架屏', 'ja-JP': 'Skeleton スケルトン', 'ko-KR': 'Skeleton 스켈레톤', es: 'Esqueleto', ar: 'هيكل Skeleton', 'fr-FR': 'Squelette', ru: 'Скелетон' },
  },
  {
    slug: 'empty',
    labels: { 'zh-CN': 'Empty 空状态', 'en-US': 'Empty', 'zh-TW': 'Empty 空狀態', 'ja-JP': 'Empty 空の状態', 'ko-KR': 'Empty 빈 상태', es: 'Vacío', ar: 'فارغ Empty', 'fr-FR': 'Vide', ru: 'Пусто' },
  },
  {
    slug: 'card',
    labels: { 'zh-CN': 'Card 卡片', 'en-US': 'Card', 'zh-TW': 'Card 卡片', 'ja-JP': 'Card カード', 'ko-KR': 'Card 카드', es: 'Tarjeta', ar: 'بطاقة Card', 'fr-FR': 'Carte', ru: 'Карточка' },
  },
  {
    slug: 'form',
    labels: { 'zh-CN': 'Form 表单', 'en-US': 'Form', 'zh-TW': 'Form 表單', 'ja-JP': 'Form フォーム', 'ko-KR': 'Form 폼', es: 'Formulario', ar: 'نموذج Form', 'fr-FR': 'Formulaire', ru: 'Форма' },
  },
  {
    slug: 'dialog',
    labels: { 'zh-CN': 'Dialog 对话框', 'en-US': 'Dialog', 'zh-TW': 'Dialog 對話框', 'ja-JP': 'Dialog ダイアログ', 'ko-KR': 'Dialog 대화상자', es: 'Diálogo', ar: 'مربع حوار Dialog', 'fr-FR': 'Boîte de dialogue', ru: 'Диалог' },
  },
  {
    slug: 'tooltip',
    labels: { 'zh-CN': 'Tooltip 文字提示', 'en-US': 'Tooltip', 'zh-TW': 'Tooltip 文字提示', 'ja-JP': 'Tooltip ツールチップ', 'ko-KR': 'Tooltip 툴팁', es: 'Tooltip (información sobre herramientas)', ar: 'Tooltip (تلميح)', 'fr-FR': 'Tooltip (infobulle)', ru: 'Tooltip (подсказка)' },
  },
]

const serviceItems: { slug: string; labels: Labels }[] = [
  {
    slug: 'message',
    labels: { 'zh-CN': 'Message 消息提示', 'en-US': 'Message', 'zh-TW': 'Message 訊息提示', 'ja-JP': 'Message メッセージ', 'ko-KR': 'Message 메시지', es: 'Message (notificación)', ar: 'Message (رسالة)', 'fr-FR': 'Message (notification)', ru: 'Message (сообщение)' },
  },
  {
    slug: 'loading',
    labels: { 'zh-CN': 'Loading 加载', 'en-US': 'Loading', 'zh-TW': 'Loading 載入', 'ja-JP': 'Loading ローディング', 'ko-KR': 'Loading 로딩', es: 'Cargando', ar: 'تحميل Loading', 'fr-FR': 'Chargement', ru: 'Загрузка' },
  },
]

function buildSidebar(prefix: string, lang: Lang) {
  const group = (labels: Labels, items: { slug: string; labels: Labels }[]) => ({
    text: labels[lang],
    items: items.map((item) => ({ text: item.labels[lang], link: `${prefix}/${item.slug}` })),
  })
  return [
    group(guideGroup, guideItems.map((i) => ({ slug: `guide/${i.slug}`, labels: i.labels }))),
    group(componentGroup, componentItems.map((i) => ({ slug: `components/${i.slug}`, labels: i.labels }))),
    group(serviceGroup, serviceItems.map((i) => ({ slug: `services/${i.slug}`, labels: i.labels }))),
  ]
}

// ── 由 LOCALES + UI + 侧边栏数据自动生成九份 locale 配置 ───────────────
function buildLocales() {
  const locales: Record<string, object> = {}
  for (const l of LOCALES) {
    // 内容门禁：目标语言内容目录尚不存在时跳过（切换器不展示该语言），目录出现后自动失效（2026-10-15）
    // 注意 __dirname 是 docs/.vitepress，而内容目录在 docs/<key>/，要上一层；
    // 原实现漏了 '..'，永远解析到 docs/.vitepress/<key>（不存在），
    // 导致除 root 外所有 locale 被静默过滤，locale 页丢失 nav/sidebar/lang 配置
    if (l.key !== 'root' && !existsSync(resolve(__dirname, '..', l.key))) continue
    // root 的内容在 docs/ 根，其余语言在 docs/<key>/
    const prefix = l.key === 'root' ? '' : `/${l.key}`
    const entry: Record<string, unknown> = {
      label: l.label,
      lang: l.lang,
      title: UI.siteTitle[l.lang],
      description: UI.description[l.lang],
      ...(l.dir ? { dir: l.dir } : {}),
      themeConfig: {
        sidebar: buildSidebar(prefix, l.lang),
        outline: { level: [2, 3], label: UI.outline[l.lang] },
        docFooter: { prev: UI.prev[l.lang], next: UI.next[l.lang] },
        lastUpdated: { text: UI.lastUpdated[l.lang] },
        returnToTopLabel: UI.returnToTop[l.lang],
        sidebarMenuLabel: UI.menu[l.lang],
        darkModeSwitchLabel: UI.theme[l.lang],
        lightModeSwitchTitle: UI.toLight[l.lang],
        darkModeSwitchTitle: UI.toDark[l.lang],
        socialLinks: [{ icon: 'github', link: 'https://github.com/lhgb-top/lh-ui-uniapp' }],
        footer: {
          copyright: beianCopyright(l.lang, base),
        },
      },
    }
    if (l.key === 'root') {
      locales.root = entry
    } else {
      locales[l.key] = { ...entry, link: `/${l.key}/` }
    }
  }
  return locales
}

export default defineConfig({
  lang: 'zh-CN',
  title: UI.siteTitle['zh-CN'],
  description: UI.description['zh-CN'],
  base,
  cleanUrls: true,
  lastUpdated: true,
  // sitemap：产物输出 sitemap.xml，robots.txt 指向 https://www.lhgb.top/lhui/uniapp/sitemap.xml
  sitemap: {
    hostname: hostname + base,
  },
  head: [
    // 图标：SVG 主（浏览器现代版）+ ICO fallback（搜索引擎/老浏览器）+ apple-touch-icon
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}logo.svg` }],
    ['link', { rel: 'icon', sizes: '32x32', href: `${base}favicon.ico` }],
    ['link', { rel: 'apple-touch-icon', href: `${base}apple-touch-icon.png` }],
    // 社交分享图（docs/部署/favicon-src/og.png 同源栅格化）
    ['meta', { property: 'og:image', content: `${hostname}${base}og.png` }],
    ['meta', { name: 'twitter:image', content: `${hostname}${base}og.png` }],
    // 中文 meta（SEO 文案与 docs/部署/seo-meta.json 同源）
    ['meta', { name: 'description', content: UI.description['zh-CN'] }],
    [
      'meta',
      {
        name: 'keywords',
        content:
          'lh-ui,lh-ui-uniapp,uniapp,uni-app,小程序,微信小程序,H5,跨端,UI组件库,国风',
      },
    ],
    // Open Graph
    ['meta', { property: 'og:title', content: UI.siteTitle['zh-CN'] }],
    ['meta', { property: 'og:description', content: UI.description['zh-CN'] }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: hostname + base }],
    ['meta', { property: 'og:site_name', content: 'lh-ui-uniapp' }],
    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:title', content: UI.siteTitle['en-US'] }],
    ['meta', { name: 'twitter:description', content: UI.description['en-US'] }],
    // JSON-LD structured data
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'lh-ui-uniapp',
        description: UI.description['zh-CN'],
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        programmingLanguage: 'TypeScript',
        url: hostname + base,
        author: { '@type': 'Organization', name: 'lhgb.top' },
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
      }),
    ],
  ],
  themeConfig: {
    siteTitle: 'lh-ui-uniapp',
  },
  locales: buildLocales(),
  vite: {
    resolve: {
      alias: [
        // 文档站只做展示，不引库源码；样式直接引构建产物 CSS
        { find: '@', replacement: resolve(__dirname, '..') },
      ],
    },
  },
})
