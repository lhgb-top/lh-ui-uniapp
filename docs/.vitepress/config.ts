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
    slug: 'descriptions',
    labels: { 'zh-CN': 'Descriptions 描述列表', 'en-US': 'Descriptions', 'zh-TW': 'Descriptions 描述列表', 'ja-JP': 'Descriptions 説明リスト', 'ko-KR': 'Descriptions 설명 목록', es: 'Descriptions (lista de descripciones)', ar: 'Descriptions (قائمة الوصف)', 'fr-FR': 'Descriptions (liste de descriptions)', ru: 'Descriptions (список описаний)' },
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
    slug: 'layout',
    labels: { 'zh-CN': 'Layout 布局容器', 'en-US': 'Layout', 'zh-TW': 'Layout 版面容器', 'ja-JP': 'Layout レイアウト', 'ko-KR': 'Layout 레이아웃', es: 'Layout (contenedor de diseño)', ar: 'Layout (حاوية التخطيط)', 'fr-FR': 'Layout (conteneur de mise en page)', ru: 'Layout (контейнер разметки)' },
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
    slug: 'input-number',
    labels: { 'zh-CN': 'InputNumber 计数器', 'en-US': 'InputNumber', 'zh-TW': 'InputNumber 計數器', 'ja-JP': 'InputNumber 数値入力', 'ko-KR': 'InputNumber 숫자 입력', es: 'InputNumber (entrada numérica)', ar: 'InputNumber (إدخال رقمي)', 'fr-FR': 'InputNumber (saisie numérique)', ru: 'InputNumber (числовой ввод)' },
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
    slug: 'alert',
    labels: { 'zh-CN': 'Alert 警告', 'en-US': 'Alert', 'zh-TW': 'Alert 警告', 'ja-JP': 'Alert アラート', 'ko-KR': 'Alert 경고', es: 'Alerta', ar: 'تنبيه Alert', 'fr-FR': 'Alerte', ru: 'Предупреждение' },
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
  {
    slug: 'breadcrumb',
    labels: { 'zh-CN': 'Breadcrumb 面包屑', 'en-US': 'Breadcrumb', 'zh-TW': 'Breadcrumb 麵包屑', 'ja-JP': 'Breadcrumb パンくず', 'ko-KR': 'Breadcrumb 이동 경로', es: 'Breadcrumb (insignia de navegación)', ar: 'Breadcrumb (مسار التنقل)', 'fr-FR': 'Breadcrumb (fil d\'Ariane)', ru: 'Breadcrumb (хлебные крошки)' },
  },
  {
    slug: 'statistic',
    labels: { 'zh-CN': 'Statistic 统计数值', 'en-US': 'Statistic', 'zh-TW': 'Statistic 統計數值', 'ja-JP': 'Statistic 統計数値', 'ko-KR': 'Statistic 통계 수치', es: 'Statistic (valor estadístico)', ar: 'Statistic (قيمة إحصائية)', 'fr-FR': 'Statistic (valeur statistique)', ru: 'Statistic (статистика)' },
  },
  {
    slug: 'spinner',
    labels: { 'zh-CN': 'Spinner 加载圈', 'en-US': 'Spinner', 'zh-TW': 'Spinner 載入圈', 'ja-JP': 'Spinner スピナー', 'ko-KR': 'Spinner 스피너', es: 'Spinner (indicador de carga)', ar: 'Spinner (دائرة التحميل)', 'fr-FR': 'Spinner (cercle de chargement)', ru: 'Spinner (кружок загрузки)' },
  },
  {
    slug: 'tabs',
    labels: { 'zh-CN': 'Tabs 标签页', 'en-US': 'Tabs', 'zh-TW': 'Tabs 標籤頁', 'ja-JP': 'Tabs タブ', 'ko-KR': 'Tabs 탭', es: 'Tabs (pestañas)', ar: 'Tabs (تبويبات)', 'fr-FR': 'Tabs (onglets)', ru: 'Tabs (вкладки)' },
  },
  {
    slug: 'segmented',
    labels: { 'zh-CN': 'Segmented 分段器', 'en-US': 'Segmented', 'zh-TW': 'Segmented 分段器', 'ja-JP': 'Segmented セグメントコントロール', 'ko-KR': 'Segmented 세그먼트', es: 'Segmented (control segmentado)', ar: 'Segmented (تحكم مجزّأ)', 'fr-FR': 'Segmented (contrôle segmenté)', ru: 'Segmented (сегментированный переключатель)' },
  },
  {
    slug: 'grid',
    labels: { 'zh-CN': 'Grid 栅格', 'en-US': 'Grid', 'zh-TW': 'Grid 柵格', 'ja-JP': 'Grid グリッド', 'ko-KR': 'Grid 그리드', es: 'Grid (rejilla)', ar: 'Grid (شبكة)', 'fr-FR': 'Grid (grille)', ru: 'Grid (сетка)' },
  },
  {
    slug: 'collapse',
    labels: { 'zh-CN': 'Collapse 折叠面板', 'en-US': 'Collapse', 'zh-TW': 'Collapse 折疊面板', 'ja-JP': 'Collapse 折りたたみ', 'ko-KR': 'Collapse 접기 패널', es: 'Collapse (panel plegable)', ar: 'Collapse (لوحة قابلة للطي)', 'fr-FR': 'Collapse (panneau repliable)', ru: 'Collapse (сворачиваемая панель)' },
  },
  {
    slug: 'timeline',
    labels: { 'zh-CN': 'Timeline 时间线', 'en-US': 'Timeline', 'zh-TW': 'Timeline 時間線', 'ja-JP': 'Timeline タイムライン', 'ko-KR': 'Timeline 타임라인', es: 'Timeline (línea de tiempo)', ar: 'Timeline (الجدول الزمني)', 'fr-FR': 'Timeline (chronologie)', ru: 'Timeline (хронология)' },
  },
  {
    slug: 'steps',
    labels: { 'zh-CN': 'Steps 步骤条', 'en-US': 'Steps', 'zh-TW': 'Steps 步驟條', 'ja-JP': 'Steps ステップバー', 'ko-KR': 'Steps 단계 표시줄', es: 'Steps (pasos)', ar: 'Steps (خطوات)', 'fr-FR': 'Steps (étapes)', ru: 'Steps (этапы)' },
  },
  {
    slug: 'rate',
    labels: { 'zh-CN': 'Rate 评分', 'en-US': 'Rate', 'zh-TW': 'Rate 評分', 'ja-JP': 'Rate レーティング', 'ko-KR': 'Rate 별점', es: 'Rate (valoración)', ar: 'Rate (تقييم)', 'fr-FR': 'Rate (notation)', ru: 'Rate (рейтинг)' },
  },
  {
    slug: 'pagination',
    labels: { 'zh-CN': 'Pagination 分页', 'en-US': 'Pagination', 'zh-TW': 'Pagination 分頁', 'ja-JP': 'Pagination ページネーション', 'ko-KR': 'Pagination 페이지네이션', es: 'Pagination (paginación)', ar: 'Pagination (ترقيم الصفحات)', 'fr-FR': 'Pagination (pagination)', ru: 'Pagination (пагинация)' },
  },
  {
    slug: 'image',
    labels: { 'zh-CN': 'Image 图片', 'en-US': 'Image', 'zh-TW': 'Image 圖片', 'ja-JP': 'Image 画像', 'ko-KR': 'Image 이미지', es: 'Image (imagen)', ar: 'Image (صورة)', 'fr-FR': 'Image (image)', ru: 'Image (изображение)' },
  },
  {
    slug: 'dropdown',
    labels: { 'zh-CN': 'Dropdown 下拉菜单', 'en-US': 'Dropdown', 'zh-TW': 'Dropdown 下拉選單', 'ja-JP': 'Dropdown ドロップダウン', 'ko-KR': 'Dropdown 드롭다운', es: 'Dropdown (menú desplegable)', ar: 'Dropdown (قائمة منسدلة)', 'fr-FR': 'Dropdown (menu déroulant)', ru: 'Dropdown (выпадающее меню)' },
  },
  {
    slug: 'drawer',
    labels: { 'zh-CN': 'Drawer 抽屉', 'en-US': 'Drawer', 'zh-TW': 'Drawer 抽屜', 'ja-JP': 'Drawer ドロワー', 'ko-KR': 'Drawer 드로어', es: 'Drawer (panel deslizante)', ar: 'Drawer (لوحة منزلقة)', 'fr-FR': 'Drawer (panneau coulissant)', ru: 'Drawer (выдвижная панель)' },
  },
  {
    slug: 'popover',
    labels: { 'zh-CN': 'Popover 弹出框', 'en-US': 'Popover', 'zh-TW': 'Popover 彈出框', 'ja-JP': 'Popover ポップオーバー', 'ko-KR': 'Popover 팝오버', es: 'Popover (globo de información)', ar: 'Popover (نافذة منبثقة)', 'fr-FR': 'Popover (fenêtre contextuelle)', ru: 'Popover (всплывающая панель)' },
  },
  {
    slug: 'popconfirm',
    labels: { 'zh-CN': 'Popconfirm 气泡确认框', 'en-US': 'Popconfirm', 'zh-TW': 'Popconfirm 氣泡確認框', 'ja-JP': 'Popconfirm 確認バルーン', 'ko-KR': 'Popconfirm 확인 풍선', es: 'Popconfirm (confirmación emergente)', ar: 'Popconfirm (تأكيد منبثق)', 'fr-FR': 'Popconfirm (confirmation en bulle)', ru: 'Popconfirm (подтверждение во всплывающем окне)' },
  },
  {
    slug: 'menu',
    labels: { 'zh-CN': 'Menu 导航菜单', 'en-US': 'Menu', 'zh-TW': 'Menu 導覽選單', 'ja-JP': 'Menu ナビゲーションメニュー', 'ko-KR': 'Menu 내비게이션 메뉴', es: 'Menu (menú de navegación)', ar: 'Menu (قائمة التنقل)', 'fr-FR': 'Menu (menu de navigation)', ru: 'Menu (меню навигации)' },
  },
  {
    slug: 'calendar',
    labels: { 'zh-CN': 'Calendar 日历', 'en-US': 'Calendar', 'zh-TW': 'Calendar 日曆', 'ja-JP': 'Calendar カレンダー', 'ko-KR': 'Calendar 달력', es: 'Calendar (calendario)', ar: 'Calendar (تقويم)', 'fr-FR': 'Calendar (calendrier)', ru: 'Calendar (календарь)' },
  },
  {
    slug: 'cascader',
    labels: { 'zh-CN': 'Cascader 级联选择', 'en-US': 'Cascader', 'zh-TW': 'Cascader 級聯選擇', 'ja-JP': 'Cascader カスケード', 'ko-KR': 'Cascader 연캐이드', es: 'Cascader (selector en cascada)', ar: 'Cascader (اختيار متسلسل)', 'fr-FR': 'Cascader (sélecteur en cascade)', ru: 'Cascader (каскадный селектор)' },
  },
  {
    slug: 'date-picker',
    labels: { 'zh-CN': 'DatePicker 日期选择器', 'en-US': 'DatePicker', 'zh-TW': 'DatePicker 日期選擇器', 'ja-JP': 'DatePicker 日付選択', 'ko-KR': 'DatePicker 날짜 선택', es: 'DatePicker (selector de fecha)', ar: 'DatePicker (منتقي التاريخ)', 'fr-FR': 'DatePicker (sélecteur de date)', ru: 'DatePicker (выбор даты)' },
  },
  {
    slug: 'time-picker',
    labels: { 'zh-CN': 'TimePicker 时间选择器', 'en-US': 'TimePicker', 'zh-TW': 'TimePicker 時間選擇器', 'ja-JP': 'TimePicker 時間選択', 'ko-KR': 'TimePicker 시간 선택', es: 'TimePicker (selector de hora)', ar: 'TimePicker (منتقي الوقت)', 'fr-FR': 'TimePicker (sélecteur d\'heure)', ru: 'TimePicker (выбор времени)' },
  },
  {
    slug: 'slider',
    labels: { 'zh-CN': 'Slider 滑块', 'en-US': 'Slider', 'zh-TW': 'Slider 滑桿', 'ja-JP': 'Slider スライダー', 'ko-KR': 'Slider 슬라이더', es: 'Slider (control deslizante)', ar: 'Slider (شريط التمرير)', 'fr-FR': 'Slider (curseur)', ru: 'Slider (ползунок)' },
  },
  {
    slug: 'tree',
    labels: { 'zh-CN': 'Tree 树形控件', 'en-US': 'Tree', 'zh-TW': 'Tree 樹形控件', 'ja-JP': 'Tree ツリーコントロール', 'ko-KR': 'Tree 트리 컨트롤', es: 'Tree (vista de árbol)', ar: 'Tree (شجرة)', 'fr-FR': 'Tree (arborescence)', ru: 'Tree (дерево)' },
  },
  {
    slug: 'tree-select',
    labels: { 'zh-CN': 'TreeSelect 树形选择器', 'en-US': 'TreeSelect', 'zh-TW': 'TreeSelect 樹形選擇器', 'ja-JP': 'TreeSelect ツリーセレクター', 'ko-KR': 'TreeSelect 트리 셀렉터', es: 'TreeSelect (selector en árbol)', ar: 'TreeSelect (محدد الشجرة)', 'fr-FR': 'TreeSelect (sélecteur en arbre)', ru: 'TreeSelect (древовидный выбор)' },
  },
  {
    slug: 'transfer',
    labels: { 'zh-CN': 'Transfer 穿梭框', 'en-US': 'Transfer', 'zh-TW': 'Transfer 穿梭框', 'ja-JP': 'Transfer トランスファー', 'ko-KR': 'Transfer 트랜스퍼', es: 'Transfer (lista de transferencia)', ar: 'Transfer (قائمة النقل)', 'fr-FR': 'Transfer (liste de transfert)', ru: 'Transfer (список переноса)' },
  },
  {
    slug: 'upload',
    labels: { 'zh-CN': 'Upload 上传', 'en-US': 'Upload', 'zh-TW': 'Upload 上傳', 'ja-JP': 'Upload アップロード', 'ko-KR': 'Upload 업로드', es: 'Upload (subida de archivos)', ar: 'Upload (رفع الملفات)', 'fr-FR': 'Upload (envoi de fichiers)', ru: 'Upload (загрузка файлов)' },
  },
  {
    slug: 'affix',
    labels: { 'zh-CN': 'Affix 固定', 'en-US': 'Affix', 'zh-TW': 'Affix 固定', 'ja-JP': 'Affix 固定表示', 'ko-KR': 'Affix 고정', es: 'Affix (fijo)', ar: 'Affix (تثبيت)', 'fr-FR': 'Affix (fixe)', ru: 'Affix (фиксация)' },
  },
  {
    slug: 'backtop',
    labels: { 'zh-CN': 'BackTop 返回顶部', 'en-US': 'BackTop', 'zh-TW': 'BackTop 返回頂部', 'ja-JP': 'BackTop トップへ戻る', 'ko-KR': 'BackTop 맨 위로', es: 'BackTop (volver arriba)', ar: 'BackTop (العودة للأعلى)', 'fr-FR': 'BackTop (retour en haut)', ru: 'BackTop (наверх)' },
  },
  {
    slug: 'anchor',
    labels: { 'zh-CN': 'Anchor 锚点导航', 'en-US': 'Anchor', 'zh-TW': 'Anchor 錨點導航', 'ja-JP': 'Anchor アンカーナビ', 'ko-KR': 'Anchor 앵커 내비게이션', es: 'Anchor (navegación de anclas)', ar: 'Anchor (تنقل المراسي)', 'fr-FR': 'Anchor (ancres)', ru: 'Anchor (якорная навигация)' },
  },
  {
    slug: 'virtual-list',
    labels: { 'zh-CN': 'VirtualList 虚拟列表', 'en-US': 'VirtualList', 'zh-TW': 'VirtualList 虛擬列表', 'ja-JP': 'VirtualList 仮想リスト', 'ko-KR': 'VirtualList 가상 리스트', es: 'VirtualList (lista virtual)', ar: 'VirtualList (قائمة افتراضية)', 'fr-FR': 'VirtualList (liste virtuelle)', ru: 'VirtualList (виртуальный список)' },
  },
  {
    slug: 'table',
    labels: { 'zh-CN': 'Table 表格', 'en-US': 'Table', 'zh-TW': 'Table 表格', 'ja-JP': 'Table テーブル', 'ko-KR': 'Table 테이블', es: 'Table (tabla)', ar: 'Table (جدول)', 'fr-FR': 'Table (tableau)', ru: 'Table (таблица)' },
  },
  {
    slug: 'result',
    labels: { 'zh-CN': 'Result 结果页', 'en-US': 'Result', 'zh-TW': 'Result 結果頁', 'ja-JP': 'Result 結果ページ', 'ko-KR': 'Result 결과 페이지', es: 'Result (página de resultado)', ar: 'Result (صفحة النتيجة)', 'fr-FR': 'Result (page de résultat)', ru: 'Result (страница результата)' },
  },
  {
    slug: 'text',
    labels: { 'zh-CN': 'Text 排版文本', 'en-US': 'Text', 'zh-TW': 'Text 排版文本', 'ja-JP': 'Text テキスト', 'ko-KR': 'Text 텍스트', es: 'Text (texto tipográfico)', ar: 'Text (نص)', 'fr-FR': 'Text (texte)', ru: 'Text (текст)' },
  },
  {
    slug: 'link',
    labels: { 'zh-CN': 'Link 链接', 'en-US': 'Link', 'zh-TW': 'Link 連結', 'ja-JP': 'Link リンク', 'ko-KR': 'Link 링크', es: 'Link (enlace)', ar: 'Link (رابط)', 'fr-FR': 'Link (lien)', ru: 'Link (ссылка)' },
  },
  {
    slug: 'input-tag',
    labels: { 'zh-CN': 'InputTag 标签输入', 'en-US': 'InputTag', 'zh-TW': 'InputTag 標籤輸入', 'ja-JP': 'InputTag タグ入力', 'ko-KR': 'InputTag 태그 입력', es: 'InputTag (entrada de etiquetas)', ar: 'InputTag (إدخال الوسوم)', 'fr-FR': 'InputTag (saisie de étiquettes)', ru: 'InputTag (ввод тегов)' },
  },
  {
    slug: 'autocomplete',
    labels: { 'zh-CN': 'Autocomplete 自动补全', 'en-US': 'Autocomplete', 'zh-TW': 'Autocomplete 自動補全', 'ja-JP': 'Autocomplete オートコンプリート', 'ko-KR': 'Autocomplete 자동 완성', es: 'Autocomplete (autocompletado)', ar: 'Autocomplete (الإكمال التلقائي)', 'fr-FR': 'Autocomplete (saisie automatique)', ru: 'Autocomplete (автодополнение)' },
  },
  {
    slug: 'mentions',
    labels: { 'zh-CN': 'Mentions 提及', 'en-US': 'Mentions', 'zh-TW': 'Mentions 提及', 'ja-JP': 'Mentions メンション', 'ko-KR': 'Mentions 멘션', es: 'Mentions (menciones)', ar: 'Mentions (إشارات)', 'fr-FR': 'Mentions (mentions)', ru: 'Mentions (упоминания)' },
  },
  {
    slug: 'color-picker',
    labels: { 'zh-CN': 'ColorPicker 颜色选择器', 'en-US': 'ColorPicker', 'zh-TW': 'ColorPicker 顏色選擇器', 'ja-JP': 'ColorPicker カラーピッカー', 'ko-KR': 'ColorPicker 컬러 피커', es: 'ColorPicker (selector de color)', ar: 'ColorPicker (منتقي الألوان)', 'fr-FR': 'ColorPicker (sélecteur de couleur)', ru: 'ColorPicker (палитра цветов)' },
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
  {
    slug: 'notification',
    labels: { 'zh-CN': 'Notification 通知', 'en-US': 'Notification', 'zh-TW': 'Notification 通知', 'ja-JP': 'Notification 通知', 'ko-KR': 'Notification 알림', es: 'Notification (notificación)', ar: 'Notification (إشعار)', 'fr-FR': 'Notification', ru: 'Notification (уведомление)' },
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
    // 图标：PNG 主（品牌 logo，docs/部署/favicon-src/logo.png 分发）+ ICO fallback（搜索引擎/老浏览器）+ apple-touch-icon
    ['link', { rel: 'icon', type: 'image/png', sizes: '512x512', href: `${base}logo.png` }],
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
    logo: { light: '/logo.png', dark: '/logo-dark.png', alt: 'lh-ui' },
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
