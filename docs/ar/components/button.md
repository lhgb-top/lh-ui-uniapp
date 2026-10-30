# زر Button

مكوّن الزر الأساسي. وسيط العرض هو `<button>` المدمج في uni (يُترجَم إلى زر أصلي على كل منصة)،
ويُترجَم حدث النقر من uni إلى `bindtap`.

## الاستخدام الأساسي

```vue
<template>
  <lh-button>افتراضي</lh-button>
  <lh-button type="primary">رئيسي</lh-button>
  <lh-button type="success">نجاح</lh-button>
  <lh-button type="warning">تحذير</lh-button>
  <lh-button type="danger">خطر</lh-button>
  <lh-button type="info">معلومات</lh-button>
</template>
```

## الحالات والأشكال

```vue
<template>
  <lh-button loading>جارٍ التحميل</lh-button>
  <lh-button disabled>معطّل</lh-button>
  <lh-button plain>بسيط</lh-button>
  <lh-button round>زاوية دائرية</lh-button>
  <lh-button circle icon="search" />
  <lh-button block>كتلة (يشغل صفًا كاملًا)</lh-button>
  <lh-button icon="search" type="primary">بأيقونة</lh-button>
</template>
```

## Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| type | النوع | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| size | الحجم؛ يُكتسَب من ConfigProvider عند عدم التمرير | `'small' \| 'medium' \| 'large'` | — |
| loading | حالة التحميل | `boolean` | `false` |
| disabled | معطّل | `boolean` | `false` |
| plain | نمط بسيط (بحدود) | `boolean` | `false` |
| block | تخطيط كتلي | `boolean` | `false` |
| round | زوايا دائرية | `boolean` | `false` |
| circle | دائري | `boolean` | `false` |
| icon | اسم الأيقونة | `LhIconName` | — |
| customClass | صنف مخصّص (يُمرَّر إلى العقدة الجذرية) | `string` | — |
| themeVars | متغيّرات سمة خاصة بالمكوّن | `Record<string, string>` | — |
| bgPattern | نقش خلفية خاص بالمكوّن | `string` | — |
| sx | خصائص تخطيط سريعة | `LhSxProps` | — |

## Events

| الحدث | الوصف | معامل الاستدعاء |
| --- | --- | --- |
| click | النقر | `(event)` |

::: tip الفروق عن نسخة Vue3
لا يحمل زر البرنامج المصغر دلالات `nativeType` / `href` / `target`، وهذه الخصائص **غير مطبّقة**
في هذا المسجل. وبقية API مطابق.
:::
