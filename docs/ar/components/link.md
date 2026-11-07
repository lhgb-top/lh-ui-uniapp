# Link رابط

وصلة نصية تدعم الأنواع الدلالية وشكل التسطير ومواضع أيقونات البادئة واللاحقة.

## الاستخدام الأساسي

```vue
<template>
  <lh-link>رابط افتراضي</lh-link>
  <lh-link type="primary">رابط رئيسي</lh-link>
</template>
```

`type`: `default` (افتراضي) / `primary` / `success` / `warning` / `danger` / `info`.

## التسطير

```vue
<template>
  <lh-link underline="always">دائم</lh-link>
  <lh-link underline="none">بلا</lh-link>
</template>
```

`underline`: `always` دائم / `hover` يظهر عند المرور (افتراضي) / `none` بلا.

## التعطيل والبادئة واللاحقة

```vue
<template>
  <lh-link disabled>رابط معطّل</lh-link>
  <lh-link>
    <template #prefix><lh-icon name="left" /></template>
    الصفحة السابقة
  </lh-link>
</template>
```

## Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| href | عنوان الوصلة (لا يُعرَض href عند التعطيل) | `string` | — |
| target | النافذة الهدف (H5 فقط) | `string` | — |
| type | النوع الدلالي للوصلة | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| underline | شكل التسطير | `'always' \| 'hover' \| 'none'` | `'hover'` |
| disabled | معطّل | `boolean` | `false` |
| current | وسم الصفحة الحالية (يُخرِج `aria-current`) | `'page' \| 'location' \| true` | — |
| customClass | صنف مخصّص | `string` | — |
| sx | خصائص التخطيط السريع | `LhSxProps` | — |

## Slots

| الفتحة | الوصف |
| --- | --- |
| default | نص الوصلة |
| prefix | موضع أيقونة البادئة |
| suffix | موضع أيقونة اللاحقة |

## Events

| الحدث | الوصف | معاملات الاستدعاء |
| --- | --- | --- |
| click | النقر | `(event: Event)` |

## اختلافات المنصة

| القدرة | H5 | البرنامج المصغر |
| --- | --- | --- |
| الحامل | view + `@click` | مثل H5 (`href` / `target` بلا دلالة تنقّل، والانتقال يعالجه جانب العمل في حدث `click`) |
| تسطير المرور | موجود | غير موجود (`underline="always"` / `"none"` يظهران؛ وتسطير VIEW يخضع للنتيجة الفعلية) |
