# InputNumber

حقل إدخال رقمي: غيّر القيمة بالكتابة أو عبر أزرار الزيادة والنقصان، مع تقييد النطاق والخطوة والدقة والخطوة الصارمة. تسوية المعاملات والخطوات وتقييد القيمة عند الإرسال كلها تأتي من الدوال النقية في نواة `@lh-ui/share`.

## الاستخدام الأساسي

```vue
<template>
  <lh-input-number v-model="value" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const value = ref<number | null>(1)
</script>
```

## حدود النطاق

يقيد `min` / `max` خطوات الأزرار وإرسال القيمة المكتوبة معًا (تُعاد القيم الخارجة عن النطاق إلى حدوده).

```vue
<template>
  <lh-input-number v-model="level" :min="1" :max="10" />
</template>
```

## الخطوة والدقة

`step` يضبط حجم الخطوة؛ `precision` يثبت عدد المنازل العشرية (يُطبق قبل التقييد)؛ `step-strictly` يلف القيمة المكتوبة إلى شبكة الخطوة (مع التقريب).

```vue
<template>
  <lh-input-number v-model="value" :step="2" />
  <lh-input-number v-model="value" :precision="2" placeholder="منزلتان عشريتان" />
  <lh-input-number v-model="value" :step="10" step-strictly placeholder="مضاعفات 10 فقط" />
</template>
```

## الأحجام وأزرار التحكم

`size` يبدّل بين small / medium / large؛ `controls` يخفي أزرار الزيادة والنقصان (إدخال فقط).

```vue
<template>
  <lh-input-number v-model="value" size="small" />
  <lh-input-number v-model="value" size="large" />
  <lh-input-number v-model="value" :controls="false" placeholder="بدون أزرار" />
</template>
```

## التعطيل واسم النموذج

`disabled` يعطّل المكوّن بالكامل (الأزرار غير قابلة للنقر والإدخال معطّل)؛ `name` هو اسم النموذج الأصلي.

```vue
<template>
  <lh-input-number :model-value="5" disabled />
  <lh-input-number v-model="value" name="quantity" />
</template>
```

## Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| modelValue / v-model | القيمة الحالية (null تعني فارغة) | `number \| null` | `null` |
| min | الحد الأدنى | `number` | `-Infinity` |
| max | الحد الأقصى | `number` | `Infinity` |
| step | حجم الخطوة | `number` | `1` |
| step-strictly | قبول مضاعفات الخطوة فقط | `boolean` | `false` |
| precision | دقة القيمة (المنازل العشرية) | `number` | — |
| disabled | تعطيل | `boolean` | `false` |
| size | الحجم | `"small" \| "medium" \| "large" \| "mini" \| "x-large"` | `'medium'` |
| controls | إظهار أزرار التحكم | `boolean` | `true` |
| placeholder | النص الإرشادي | `string` | `''` |
| name | اسم النموذج الأصلي | `string` | `''` |
| customClass | اسم فئة مخصص (يُمرر إلى العقدة الجذر) | `string` | — |
| sx | خصائص التخطيط المختصرة sx | `LhSxProps` | — |

## Events

| الحدث | الوصف | المعاملات |
| --- | --- | --- |
| update:modelValue / change | إرسال القيمة (الأزرار ترسل فورًا؛ القيمة المكتوبة تُرسل عند فقدان التركيز / التأكيد، بتوقيت change الأصلي في plus) | `(value: number \| null)` |

## فروق المنصات

- **توقيت الإرسال (نموذج المسودة)**: مكوّن input في uni لا يملك حدث change أصليًا (البرامج المصغرة تملك input / blur / confirm فقط)، لذا لا تُرسل القيمة أثناء الكتابة بل تُزامن مسودة داخلية وتُرسل دفعة واحدة عند فقدان التركيز أو عند confirm (Enter في H5 / زر «تم» في لوحة المفاتيح في البرامج المصغرة) — وهو ما يعادل دلالة change الأصلية في plus التي لا تُطلق إلا عند الإرسال (النهج نفسه المتبع في حزمة react). لا تُطلق القيمة نفسها مرتين (في MP يلي confirm حدث blur آخر؛ إزالة التكرار تمنع الإرسال المزدوج).
- **أزرار الزيادة والنقصان هي view ذاتية الرسم**: أزرار `<button>` في plus تُستبدل بـ `<view role="button">` (أزرار MP لا يمكن تصفير أنماطها الافتراضية)، والنقر يعمل على جميع المنصات. لا تملك view الفئة الزائفة `:disabled`، لذا توفر قاعدة احتياطية داخلية داخل المكوّن مظهر التعطيل بنفس الرموز.
- **الخطوات بمفاتيح الأسهم في H5 فقط**: ↑ للزيادة / ↓ للنقصان (إرسال Enter غير مُوصول بـ keydown — في H5 يُطلق حدثا keydown وconfirm معًا، لذا يمر الإرسال عبر confirm فقط لتفادي الإرسال المزدوج)؛ البرامج المصغرة بلا أحداث لوحة مفاتيح فلا فرق سلوكي.
- **نمط الـ placeholder**: قاعدة `::placeholder` في share تدخل حزمة H5 فقط؛ في البرامج المصغرة تُستخدم الخاصية `placeholder-style` (بلون رمزي احتياطي).
- **الربط بالتحقق من النماذج غير متصل**: يُخرج plus الخاصية `aria-invalid` على الحقل عبر سياق النموذج؛ عائلة input في هذه الحزمة غير متصلة بتمرير aria من سياق النموذج، دون تأثير على القيم أو سلوك التحقق.

::: tip الاختلافات عن إصدار Vue 3
- دلالات المنطق (تسوية المعاملات، الخطوات، التقييد بـ precision / min/max / stepStrictly) مطابقة تمامًا لـ plus (نواة share نفسها).
- أُضيفت الخاصية `customClass`: في uni-app لا يمكن للفئات المخصصة اختراق `styleIsolation`، لذا تُمرر عبر خاصية.
- توقيت إرسال القيمة المكتوبة: انظر البند الأول في «فروق المنصات» (نموذج المسودة، مكافئ لدلالة change في plus).
:::
