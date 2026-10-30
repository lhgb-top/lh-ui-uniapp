# ConfigProvider (إعداد عام)

مكوّن الإعداد العام، يوفّر للمكوّنات الناشئة الحجم واللغة ووضع السمة ومتغيّرات السمة.

::: tip تنفيذ الوضع الداكن على طرف البرنامج المصغر
في الويب (plus) يتم تبديل الوضع الداكن بالتعامل مع `document.documentElement`، لكن البرنامج المصغر
لا يوجد فيه document. يُنفَّذ الوضع الداكن في هذا المسجل **بإضافة الفئة `dark` إلى العقدة المغلّفة**
— فمحدِّد كتلة الوضع الداكن في الأنماط المنقّاة هو `page.dark, .dark`، ولذا يتبع نطاق الوضع الداكن
نطاق تغليف ConfigProvider.
:::

## الاستخدام الأساسي

```vue
<template>
  <lh-config-provider :size="size" :locale="locale" :theme="theme" :theme-vars="themeVars">
    <view class="app">
      <lh-button type="primary">زر</lh-button>
    </view>
  </lh-config-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const size = ref<'small' | 'medium' | 'large'>('medium')
const locale = ref<'zh-CN' | 'en-US'>('zh-CN')
const theme = ref<'light' | 'dark'>('light')
const themeVars = ref({
  'primary-color': '#1677ff',
  'bg-pattern': 'var(--lh-pattern-willow)',
})
</script>
```

## Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| size | الحجم العام | `'small' \| 'medium' \| 'large'` | — |
| locale | اللغة العامة | `'zh-CN' \| 'en-US'` | — |
| theme | وضع السمة (جديد في طرف uni-app) | `'light' \| 'dark'` | `'light'` |
| themeVars | متغيّرات السمة العامة (تُضاف تلقائيًا البادئة `--lh-` للمفاتيح) | `Record<string, string>` | — |
| componentTheme | إعداد متغيّرات السمة لكل مكوّن على حدة، ويغطّي themeVars العامة | `Partial<Record<LhThemeableComponent, Record<string, string>>>` | — |

### المفاتيح التي يدعمها themeVars

- ألوان السمة: `primary-color` / `success-color` / `warning-color` / `danger-color` / `info-color`
- ألوان النمط الصيني: `gold-color` / `vermilion-color` / `jade-color`
- الألوان المحايدة: `bg-color` / `text-color` / `border-color`
- النقوش: `bg-pattern` (مثل `var(--lh-pattern-willow)`) / `bg-pattern-opacity` / `bg-pattern-color`
- الزخرفة: `decoration-color`

### الأولوية

props الخاصة بالمكوّن > `componentTheme[اسم المكوّن]` > `themeVars` العامة.
