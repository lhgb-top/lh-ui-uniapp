# InputTag إدخال الوسوم

مجموعة وسوم تُرسَل عند الكتابة، مع مفاتيح الإطلاق والحد الأقصى ومنع التكرار والحذف بالنقر.

## الاستخدام الأساسي

```vue
<script setup>
import { ref } from 'vue'
const tags = ref(['حبر', 'فراغ'])
</script>

<template>
  <lh-input-tag v-model="tags" placeholder="اكتب ثم اضغط Enter للإرسال" />
</template>
```

## مفاتيح الإطلاق

يدعم `trigger` القيم `enter` (افتراضي) / `space` / `comma`. وعند الإطلاق بـ `space` / `comma` لا يدخل الفراغ إلى حقل الإدخال.

```vue
<template>
  <lh-input-tag v-model="tags" trigger="comma" placeholder="اكتب فاصلة للإرسال" />
</template>
```

## الحد الأقصى ومنع التكرار

```vue
<template>
  <lh-input-tag v-model="tags" :max="3" allow-duplicate />
</template>
```

عندما يكون `max` موجبًا يمثل حدًا أعلى (تجاوزه يُلغي الإرسال ويُفرَغ الحقل)؛ والافتراض يمنع التكرار (الوسم المكرر لا يُرسَل).

## للقراءة فقط والتعطيل

```vue
<template>
  <lh-input-tag v-model="tags" readonly />
  <lh-input-tag v-model="tags" disabled />
</template>
```

## Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| modelValue | قائمة الوسوم (v-model) | `string[]` | `[]` |
| trigger | مفتاح إرسال الإطلاق (على البرنامج المصغر دائمًا مفتاح الإتمام) | `'enter' \| 'space' \| 'comma'` | `'enter'` |
| placeholder | تلميح الإدخال (يظهر فقط عند غياب الوسوم) | `string` | `''` |
| placeholderStyle | نمط التلميح (بديل `::placeholder`) | `string` | — |
| max | حد الوسوم (القيمة غير الموجبة تعني بلا حد) | `number` | `0` |
| allowDuplicate | السماح بالوسوم المكررة | `boolean` | `false` |
| readonly | للقراءة فقط | `boolean` | `false` |
| disabled | معطّل | `boolean` | `false` |
| ariaLabel | اسم الإتاحة | `string` | — |
| customClass | صنف مخصّص | `string` | — |
| sx | خصائص التخطيط السريع | `LhSxProps` | — |

## Events

| الحدث | الوصف | معاملات الاستدعاء |
| --- | --- | --- |
| update:modelValue | تغيّر قائمة الوسوم | `(value: string[])` |
| change | تغيّر قائمة الوسوم (مثل modelValue) | `(value: string[])` |
| add | إرسال وسم واحد | `(tag: string)` |
| remove | حذف وسم واحد | `(tag: string)` |

## طرق (defineExpose)

| الطريقة | الوصف |
| --- | --- |
| focus | تركيز حقل الإدخال |
| commit | إرسال المُدخل الحالي |

## اختلافات المنصة

| القدرة | H5 | البرنامج المصغر |
| --- | --- | --- |
| مفتاح إرسال الإطلاق | دعم `trigger` كاملًا (أحداث لوحة المفاتيح Enter / Space / Comma) | دائمًا **مفتاح الإتمام** (`@confirm`)؛ ومفهوم مفتاحَي `space` / `comma` حصري على H5 |
| الحذف بمفتاح Backspace | عند فراغ الحقل يحذف Backspace آخر وسم | لا أحداث للوحة المفاتيح، والحذف عبر **زر ×** على كل وسم (متاح على الطرفين) |
| الإرسال عند فقد التركيز | نعم | نعم |
| حد التركيز | نمط التركيز بـ `:has()` يعمل | لا حد للتركيز (WXSS لا يدعم `:has()`)، والإدخال يعمل بشكل طبيعي |
