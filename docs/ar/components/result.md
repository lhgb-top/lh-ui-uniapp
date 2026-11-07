# Result نتيجة

عرض نتيجة نهاية تدفق التغذية الراجعة، مع أيقونة حالة وألوان مطابقة.

## الاستخدام الأساسي

```vue
<template>
  <lh-result
    status="success"
    title="تم الإرسال بنجاح"
    sub-title="انتقل أمر العمل إلى المرحلة التالية"
  />
</template>
```

أربع حالات: `success` / `warning` / `error` / `info` (`info` افتراضيًا)، لكل منها أيقونة ولون افتراضيان؛ وتُختزَل القيمة غير الصالحة إلى `info`.

## أيقونة مخصصة

```vue
<template>
  <lh-result
    icon="like"
    :icon-size="48"
    title="إعجاب وحفظ"
  />
</template>
```

تمرير سلسلة فارغة `""` في `icon` يلغي عرض الأيقونة؛ وعند عدم التمرير تُؤخَذ أيقونة الحالة الافتراضية.

## الفتحات

```vue
<template>
  <lh-result status="success">
    <template #subTitle> عنوان فرعي مخصص </template>
    <template #extra>
      <lh-button type="primary" size="small">العودة إلى الرئيسية</lh-button>
    </template>
  </lh-result>
</template>
```

تفتحتا `title` / `subTitle` / `extra` الثلاثة جميعها تحلّ محل prop بنفس الاسم.

## Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| status | حالة النتيجة | `'success' \| 'warning' \| 'info' \| 'error'` | `'info'` |
| icon | اسم أيقونة مخصصة (تحلّ محل أيقونة الحالة الافتراضية؛ السلسلة الفارغة لا تُعرَض) | `string` | — |
| iconSize | حجم الأيقونة | `string \| number` | `64` |
| title | العنوان | `string` | — |
| subTitle | العنوان الفرعي | `string` | — |
| customClass | صنف مخصّص | `string` | — |
| sx | خصائص التخطيط السريع | `LhSxProps` | — |

## Slots

| الفتحة | الوصف |
| --- | --- |
| title | العنوان (يحلّ محل prop الخاص بـ title) |
| subTitle | العنوان الفرعي (يحلّ محل prop الخاص بـ subTitle) |
| extra | منطقة الإجراءات السفلية |
