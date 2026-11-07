# Mentions الإشارات

حقل إشارة للأعضاء يُفعّل عند كتابة `@`، يدعم التصفية والأسطر المتعدلة ورد نداء التحديد.

## الاستخدام الأساسي

```vue
<script setup>
import { ref } from 'vue'
const value = ref('')
const members = [
  { label: 'حبر', value: 'ink' },
  { label: 'مساحة فارغة', value: 'blank' },
]
</script>

<template>
  <lh-mentions v-model="value" :options="members" />
</template>
```

عند كتابة `@` تُفتح لوحة الاقتراحات، وتُصفّى مع استمرار الكتابة وفق label. ما يُعاد كتابته عند التحديد هو `label` (إشارة `@حبر ` مقروءة بشريًا)، أما المُعرّف القابل للقراءة آليًا `value` فيُسلَّم إلى طبقة الأعمال عبر حدث `select`.

## الأسطر المتعددة

```vue
<template>
  <lh-mentions v-model="value" :options="members" multiline />
</template>
```

يستبدل `multiline` حقل input أحادي السطر بـ textarea.

## محرف الإطلاق

```vue
<template>
  <lh-mentions v-model="value" :options="members" prefix="#" />
</template>
```

قيمة `prefix` الافتراضية `'@'`؛ البادئة الزائفة الملتصقة مباشرة بمحرف كلمة ASCII (مثل `user@` في بريد إلكتروني) لا تُفعّل الإشارة.

## Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| modelValue | محتوى النص (v-model) | `string` | `''` |
| options | الأعضاء المقترحون | `LhMentionOption[]` | `[]` |
| prefix | محرف الإطلاق | `string` | `'@'` |
| placeholder | نص التحديد المؤقت (افتراضيًا من رسالة اللغة mentions.placeholder) | `string` | — |
| placeholderStyle | نمط النص التحديد المؤقت (بديل `::placeholder`) | `string` | — |
| disabled | تعطيل المكوّن | `boolean` | `false` |
| multiline | textarea متعدد الأسطر | `boolean` | `false` |
| ariaLabel | اسم إمكانية الوصول | `string` | — |
| customClass | صنف مخصّص | `string` | — |
| sx | خصائص التخطيط السريع | `LhSxProps` | — |

## Slots

| الفتحة | الوصف |
| --- | --- |
| empty | الحالة الفارغة عند عدم وجود تطابق (النص الافتراضي مأخوذ من رسالة اللغة mentions.noMatch) |

## Events

| الحدث | الوصف | معاملات الاستدعاء |
| --- | --- | --- |
| update:modelValue | يُعيد الكتابة بعد الإدخال أو التحديد | `(value: string)` |
| change | تغيّر النص | `(value: string)` |
| select | تم اختيار إشارة | `(option: LhMentionOption)` |

## طرق (defineExpose)

| الطريقة | الوصف |
| --- | --- |
| updateContext | تحديث سياق المؤشر يدويًا |
| close | إغلاق لوحة الاقتراحات |

## اختلافات المنصة

| القدرة | H5 | البرنامج المصغر |
| --- | --- | --- |
| تموضع القائمة المنسدلة | root-portal + قياس بإطارين (مثل select) | Alipay تستخدم root-portal أو fixed داخل الصفحة حسب إصدار المكتبة الأساسية؛ Douyin تستخدم fixed داخل الصفحة |
| سياق المؤشر | `selectionStart` الأصلي (يمكن إطلاق الإشارة من داخل النص) | **لا يمكن الحصول على موقع المؤشر فيُقرَّب بنهاية النص** — إطلاق الإشارة داخل نص مُدخَل مسبقًا لا يعمل ويتدهور إلى الإدراج في النهاية |
| التنقل بلوحة المفاتيح / Esc | مفاتيح الأسهم تنقل التمييز، Enter تحدّد، Esc تغلق | لا أحداث للوحة المفاتيح؛ التحديد بالنقر فقط |
| موقع المؤشر بعد التحديد | يستقر مباشرة بعد الإشارة | بعد إعادة الكتابة المُتحكَّم بها يكون المؤشر في النهاية |
