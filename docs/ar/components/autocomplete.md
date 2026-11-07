# Autocomplete الإكمال التلقائي

حقل إقتراحات يُصفّي أثناء الكتابة: حقل نصي (combobox) بالإضافة إلى قائمة اقتراحات منسدلة (listbox).

## الاستخدام الأساسي

```vue
<script setup>
import { ref } from 'vue'
const value = ref('')
const options = [
  { label: 'حبر' },
  { label: 'مساحة فارغة' },
  { label: 'ختم', value: 'seal' },
]
</script>

<template>
  <lh-autocomplete v-model="value" :options="options" />
</template>
```

عندما يحمل الخيار `label` فقط تكون القيمة المُرسَلة هي label نفسها؛ أضِف `value` عند الحاجة إلى مُعرّف قابل للقراءة آليًا. تُبقى الخيارات المعطّلة في القائمة معتمةً وغير قابلة للتحديد.

## التصفية

افتراضيًا، تُصفّى الاقتراحات وفق احتواء `label` على نص الاستعلام (دون تمييز الأحرف الكبيرة، ولا تُحتسَم المسافات في البداية والنهاية ضمن المطابقة):

```vue
<template>
  <lh-autocomplete v-model="value" :options="options" case-sensitive />
</template>
```

يُفعّل `case-sensitive` المطابقة الحساسة لحالة الأحرف؛ مرّر `trim` كـ `false` للاحتفاظ بالمسافات في المطابقة.

## رد النداء عند التحديد

```vue
<template>
  <lh-autocomplete v-model="value" :options="options" @select="onSelect" />
</template>
```

يستقبل حدث `select` القيمة المُرسَلة وكائن الخيار الأصلي.

## Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| modelValue | قيمة الإدخال (v-model) | `string` | `''` |
| options | خيارات الاقتراح | `LhAutocompleteOption[]` | `[]` |
| caseSensitive | مطابقة حساسة لحالة الأحرف | `boolean` | `false` |
| trim | إزالة مسافات بداية ونهاية نص الاستعلام قبل المطابقة | `boolean` | `true` |
| placeholder | نص التحديد المؤقت | `string` | — |
| placeholderStyle | نمط النص التحديد المؤقت (بديل `::placeholder`) | `string` | — |
| disabled | تعطيل المكوّن | `boolean` | `false` |
| openOnFocus | فتح لوحة الاقتراحات عند التركيز | `boolean` | `true` |
| ariaLabel | اسم إمكانية الوصول | `string` | — |
| customClass | صنف مخصّص | `string` | — |
| sx | خصائص التخطيط السريع | `LhSxProps` | — |

## Slots

| الفتحة | الوصف |
| --- | --- |
| empty | الحالة الفارغة عند عدم وجود تطابق (النص الافتراضي مأخوذ من رسالة اللغة autocomplete.noMatch) |

## Events

| الحدث | الوصف | معاملات الاستدعاء |
| --- | --- | --- |
| update:modelValue | يُعيد الكتابة بعد الإدخال أو التحديد | `(value: string)` |
| change | تغيّرت قيمة الإدخال | `(value: string)` |
| select | تم اختيار اقتراح | `(value: string \| number, option: LhAutocompleteOption)` |

## طرق (defineExpose)

| الطريقة | الوصف |
| --- | --- |
| open / close | فتح / إغلاق اللوحة يدويًا |
| isOpen | حالة الفتح/الإغلاق الحالية (للقراءة فقط) |

## اختلافات المنصة

| القدرة | H5 | البرنامج المصغر |
| --- | --- | --- |
| تموضع القائمة المنسدلة | root-portal + قياس بإطارين (مثل select) | Alipay تستخدم root-portal أو fixed داخل الصفحة حسب إصدار المكتبة الأساسية؛ Douyin تستخدم fixed داخل الصفحة |
| التنقل بلوحة المفاتيح / Esc | مفاتيح الأسهم تنقل التمييز، Enter تحدّد، Esc تغلق | لا أحداث للوحة المفاتيح؛ التحديد بالنقر فقط |
| تمييز التمرير (hover) | موجود | غير موجود (النقر يحدّد مباشرة) |
| openOnFocus | يُفتح عند التركيز | يُفتح عند التركيز |
