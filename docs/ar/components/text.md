# Text نص

مكوّن تنسيق شامل للعناوين والنصوص والاقتطاع والنسخ، حيث يستقر كل تعديل دلالي على أصناف BEM التعديلية.

## المستوى

```vue
<template>
  <lh-text level="h1">العنوان الأول</lh-text>
  <lh-text level="p">فقرة نصية</lh-text>
  <lh-text level="caption">ملاحظة مساعدة</lh-text>
</template>
```

يدعم `level` القيم `h1` ~ `h6` / `p` (افتراضي) / `caption`، وتُختزَل القيمة غير الصالحة إلى `p`.

## الدلالات والتعديلات

```vue
<template>
  <lh-text type="success" strong>ناجح وعريض</lh-text>
  <lh-text mark>تمييز</lh-text>
  <lh-text code>أسلوب برمجي</lh-text>
</template>
```

`type`: `default` (افتراضي) / `secondary` / `success` / `warning` / `danger`؛ خصائص التعديل: `strong` / `italic` / `underline` / `mark` / `code` / `disabled`.

## الاقتطاع

```vue
<template>
  <lh-text :ellipsis="true">اقتطاع سطر واحد</lh-text>
  <lh-text :ellipsis="2">اقتطاع سطرين</lh-text>
</template>
```

`ellipsis` بقيمة `true` يقتطع لسطر واحد، والأرقام تقتطع بحسب عدد الأسطر (الحد الأقصى 10، ويستخدم الاقتطاع متعدد الأسطر `-webkit-line-clamp` مضمّنًا).

## النسخ

```vue
<template>
  <lh-text copyable copy-text="نص ثابت">انقر الزر التالي للنسخ</lh-text>
</template>
```

يضيف `copyable` زر نسخ: النقر يكتب في الحافظة ويبدّل مؤقتًا إلى «تم النسخ»، ويُطلق حدث `copy` في الوقت نفسه (المعامل هو النص المكتوب فعلًا).

::: tip النسخ على طرف البرنامج المصغر
في H5 وعند عدم تمرير `copy-text` يُؤخَذ نص الفتحة تلقائيًا؛ **والبرنامج المصغر لا يستطيع قراءة نص الفتحة فيجب تمرير `copy-text`**، وإلا فلن يكتب الزر شيئًا (لكن النقر يُطلق حدث `copy` أيضًا). تأتي العناوين من حزمة اللغة `text.copy` / `text.copied` ويمكن تغطيتها عبر `copy-label`.
:::

## Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| level | مستوى العنوان وشكل الفقرة | `'h1' \| ... \| 'h6' \| 'p' \| 'caption'` | `'p'` |
| type | اللون الدلالي | `'default' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | `'default'` |
| strong / italic / underline / mark / code / disabled | تعديلات بوليانية | `boolean` | `false` |
| ellipsis | الاقتطاع: `true` لسطر واحد، ورقم لعدد الأسطر | `boolean \| number` | `false` |
| copyable | يضيف زر النسخ | `boolean` | `false` |
| copyLabel | اسم إتاحة زر النسخ | `string` | — |
| copyText | النص المراد نسخه (إجباري على البرنامج المصغر) | `string` | — |
| customClass | صنف مخصّص | `string` | — |
| sx | خصائص التخطيط السريع | `LhSxProps` | — |

## Events

| الحدث | الوصف | معاملات الاستدعاء |
| --- | --- | --- |
| copy | النقر على زر النسخ | `(text: string)` |

## اختلافات المنصة

| القدرة | H5 | البرنامج المصغر |
| --- | --- | --- |
| حامل العرض | view (يتحمل التنسيق أصناف `lh-text--<level>`) | مثل H5 |
| النسخ | أخذ نص الفتحة تلقائيًا دون `copy-text` (`navigator.clipboard`) | `copy-text` إجباري، عبر `uni.setClipboardData` (مع تنبيه النظام) |
