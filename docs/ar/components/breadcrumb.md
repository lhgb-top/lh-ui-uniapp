# مسار التنقل (Breadcrumb)

يعرض مسار الصفحة الحالية للعودة سريعًا إلى أي مستوى سابق.

## الاستخدام الأساسي

```vue
<template>
  <lh-breadcrumb separator="/">
    <lh-breadcrumb-item>الرئيسية</lh-breadcrumb-item>
    <lh-breadcrumb-item>المكوّنات</lh-breadcrumb-item>
    <lh-breadcrumb-item>مسار التنقل</lh-breadcrumb-item>
  </lh-breadcrumb>
</template>
```

## عناصر قابلة للنقر

العناصر غير الأخيرة التي تُمرَّر لها `to` تُعرض بنمط رابط، وعند النقر عليها تنتقل عبر `uni.navigateTo` (يجب أن يكون الرابط مسار صفحة يبدأ بـ `/`).

```vue
<template>
  <lh-breadcrumb>
    <lh-breadcrumb-item to="/pages/index/index">الرئيسية</lh-breadcrumb-item>
    <lh-breadcrumb-item to="/pages/component/index">المكوّنات</lh-breadcrumb-item>
    <lh-breadcrumb-item>مسار التنقل</lh-breadcrumb-item>
  </lh-breadcrumb>
</template>
```

## الطي

يتحكم `maxItems` في أقصى عدد للعناصر الظاهرة (شاملاً علامة الحذف): عند تجاوزه يُحتفظ بالعنصر الأول + علامة الحذف + العناصر الأخيرة، والنقر على علامة الحذف يوسّع الكل.

```vue
<template>
  <lh-breadcrumb :max-items="3">
    <lh-breadcrumb-item>الرئيسية</lh-breadcrumb-item>
    <lh-breadcrumb-item>الفعاليات</lh-breadcrumb-item>
    <lh-breadcrumb-item>القائمة</lh-breadcrumb-item>
    <lh-breadcrumb-item>التفاصيل</lh-breadcrumb-item>
    <lh-breadcrumb-item>التقييمات</lh-breadcrumb-item>
  </lh-breadcrumb>
</template>
```

## Breadcrumb Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| separator | حرف الفاصل | `string` | `'/'` |
| maxItems | أقصى عدد للعناصر الظاهرة (العنصر الأول + علامة الحذف + العناصر الأخيرة)؛ عند التجاوز يُطوى؛ `0` يلغي الطي | `number` | `0` |
| customClass | اسم صنف مخصص | `string` | — |
| sx | خصائص التخطيط السريعة | `LhSxProps` | — |

## BreadcrumbItem Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| to | عنوان الوجهة؛ عند تعيينه وعدم كون العنصر أخيرًا يُعرض كرابط وينتقل عبر `uni.navigateTo` عند النقر | `string` | — |
| customClass | اسم صنف مخصص | `string` | — |

## Slots

| Slot | الوصف |
| --- | --- |
| default | المحتوى النصي لعنصر مسار التنقل |

::: tip الاختلافات عن نسخة Vue 3
- `to` لا يستخدم vue-router (مشروع uni-app لا يحوي موجّهًا): الانتقال دائمًا عبر `uni.navigateTo`؛ وعلى H5 يتبع استراتيجية توجيه uni الخاصة بـ H5.
- تُستبدل `<nav>/<ol>/<li>` بـ `<view>` (WXSS يمنع محددات الوسوم) مع الاحتفاظ بـ `aria-current="page"` و`aria-label`.
- منطق الطي/علامة الحذف يعيد استخدام نفس الدوال النقية في share core، ومطابق لسلوك plus.
:::
