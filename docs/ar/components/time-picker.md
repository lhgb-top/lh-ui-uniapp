# TimePicker منتقي الوقت

منتقي لاختيار الساعة والدقائق والثواني. عند الضغط على المُطلق يفتح لوح: كل عمود (ساعة / دقيقة / ثانية) قائمة تُمرَّر عموديًا بشكل مستقل، والضغط على عنصر عمود يضعه في موضعه، وأزرار «الآن / موافق» في الأسفل تؤكد الاختيار.

## الاستخدام الأساسي

```vue
<template>
  <lh-time-picker v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

الصيغة الافتراضية هي `HH:mm:ss`، فيعرض اللوح ثلاثة أعمدة (ساعة / دقيقة / ثانية). الضغط على عنصر عمود يحدده فورًا (يبقى اللوح مفتوحًا)، و«موافق» يؤكد قيمة `Date` ويغلق اللوح، و«الآن» يملأ الأعمدة بالوقت الحالي.

## صيغة الساعة والدقيقة

عند عدم احتواء `format` على `ss` يعرض اللوح عمودي الساعة والدقيقة فقط، ويُولَّد النص النائب من `format` أيضًا:

```vue
<template>
  <lh-time-picker v-model="value" format="HH:mm" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## نطاق الوقت

يحدِّدان `start` / `end` نطاق العمود القابل للاختيار (تقاطع مع 0~23). تُعاد القيمة المخزنة خارج النطاق إلى داخله، و«الآن» يُعاد أيضًا:

```vue
<template>
  <lh-time-picker v-model="value" :start="8" :end="20" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## الخطوات

تخصِّص `step-hour` / `step-minute` / `step-second` خطوة خيارات كل عمود:

```vue
<template>
  <lh-time-picker v-model="value" :step-hour="2" :step-minute="5" :step-second="10" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## التعطيل

يعطِّل `disabled` المنتقي بالكامل (لا يفتح اللوح ولا يُعرض أيقونة المسح):

```vue
<template>
  <lh-time-picker v-model="value" disabled />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## النص النائب والمسح

يتجاوز `placeholder` نص النائب (عند عدم تمريره يُولَّد من `format` باستخدام مفاتيح اللغة `timepicker.hour/minute/second`). عند وجود قيمة تظهر أيقونة المسح يمين المُطلق، والضغط عليها يفرغ القيمة (`clearable` افتراضيًا `true`):

```vue
<template>
  <lh-time-picker v-model="value" placeholder="اختر وقت التذكير" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(null)
</script>
```

## TimePicker API

### Props

| الخاصية | الوصف | النوع | القيمة الافتراضية |
| --- | --- | --- | --- |
| modelValue | الوقت المربوط | `Date \| null` | `null` |
| size | الحجم | `LhTimePickerSize` | `'medium'` |
| disabled | تعطيل المنتقي بالكامل | `boolean` | `false` |
| clearable | إظهار زر المسح | `boolean` | `true` |
| placeholder | النص النائب (عند عدم تمريره يُولَّد من format بمفاتيح اللغة `timepicker.hour/minute/second`) | `string` | — |
| format | صيغة الوقت (عمود الثواني يظهر فقط مع `ss`) | `string` | `'HH:mm:ss'` |
| readonly | علامة القراءة فقط (المُطلق view مرسوم ذاتيًا بلا حالة إدخال، لذا فهو للقراءة فقط دائمًا) | `boolean` | `false` |
| arrowControl | إظهار أزرار الأسهم (يُعرض على H5 فقط، مع الخطو بلوحة المفاتيح) | `boolean` | `false` |
| start | ساعة البداية (تقاطع مع 0~23) | `number` | `0` |
| end | ساعة النهاية (تقاطع مع 0~23) | `number` | `24` |
| stepHour | خطوة عمود الساعات | `number` | `1` |
| stepMinute | خطوة عمود الدقائق | `number` | `1` |
| stepSecond | خطوة عمود الثواني | `number` | `1` |
| customClass | صنف مخصص (يُمرَّر إلى العقدة الجذرية) | `string` | — |
| themeVars | متغيرات السمة على مستوى المكوّن | `Record<string, string>` | — |
| sx | خصائص التخطيط السريع (تُطبَّق على جذر المُطلق؛ اللوح المنبثق غير متأثر) | `LhSxProps` | — |

### Events

| الحدث | الوصف | المعاملات |
| --- | --- | --- |
| update:modelValue | يُطلق عند تغيّر القيمة المربوطة | `(value: Date \| null)` |
| change | يُطلق عند الضغط على «موافق» أو أيقونة المسح | `(value: Date \| null)` |

### الوصول

- يحمل المُطلق `aria-haspopup="dialog"` / `aria-expanded` / `aria-controls` (حزمة السمات تنتجها `getTimePickerTriggerAria` من share وتُربط مفتاحًا بمفتاح)
- اللوح هو `role="dialog"`، وكل عمود `role="listbox"` (يأتي `aria-label` من مفاتيح اللغة `timepicker.hourLabel/minuteLabel/secondLabel`)، وكل عنصر `role="option"` مع `aria-selected` / `aria-disabled`
- محرّك التموضع دالة نقية مكتوبة يدويًا (flip / shift لمنع الخروج عن الحدود) بصفر تبعات تشغيل من طرف ثالث

::: tip اختلافات المنصة (الاختلافات عن نسخة Vue3)
- **تحويل العجلة إلى ألواح أعمدة scroll-view**: تستخدم plus حاويات `div` بـ `overflow-y: auto` وتعترض العجلة عبر `@wheel.prevent` للتقدم بالخطوة وتجلب العنصر المختار إلى العرض بـ `scrollIntoView`؛ في uni-app أصبح كل عمود `scroll-view` عموديًا مستقلًا (`scroll-y`) — فلا تملك الـ view في البرنامج المصغر تمريرًا موثوقًا للخروج عن الحدود — ويُجلب العنصر المختار إلى العرض عبر `scroll-into-view` (لا يوجد API `scrollIntoView` في البرنامج المصغر). تفاعل الاختيار كما هو: الضغط على عنصر عمود للاختيار، والأزرار «الآن / موافق» في الأسفل للتأكيد.
- **لم يُنقل خطو العجلة**: تُرك التمرير داخل العمود للتمرير الأصلي لـ `scroll-view` (على H5 تمرر العجلة القائمة الطويلة بشكل طبيعي)، ولم يعد يجري اعتراض حدث wheel للقفز بالخطوة. توليد الخيارات بالخطوة (`step-hour` وغيرها) مطابق لـ plus.
- **التنقل بلوحة المفاتيح على H5 فقط**: يفتح المُطلق اللوح بـ Enter/Space/سهم لأسفل وينقل التركيز إلى العمود الأول؛ داخل اللوح تتحرك ↑↓ وفق الخطوة المضبوطة (تُلفّ الساعة ثم تُعاد إلى نطاق start/end)، و←→ تنقل التركيز بين الأعمدة، وEnter/Space تؤكد وتغلق، وEscape يغلق عبر مستمع على مستوى المستند (عند تراكب عدة ألواح يُغلق العلوي فقط). تُقصَّ معالجة هذا المستخدمة بالكامل بالترجمة الشرطية فلا شيفرة ميتة في حزمة البرنامج المصغر.
- **arrowControl على H5 فقط**: أزرار الأسهم تعتمد على دلالات الخطو بلوحة المفاتيح ولا تُعرض على البرنامج المصغر (يحرس `v-if` في القالب ثابت الترجمة `LH_IS_H5`).
- **الإغلاق بالضغط الخارجي**: تستمع plus إلى نقرات document؛ بينما يستخدم uni-app قناعًا شفافًا داخل الصفحة (الضغط على القناع يُغلق دون إطلاق change).
- **مُطلق مرسوم ذاتيًا**: مُطلق plus هو `<input>` قابل للتعديل؛ أما في uni-app فالمُطلق مرسوم بـ `<view>` + `<text>` (لا يوجد دلالة تركيز input داخل المُطلق في البرنامج المصغر، ولون النص النائي يأتي من صنف معدِّل، و`readonly` فعليًا دائم التفعيل).
- **أيقونة المُطلق**: تستخدم plus أيقونة `date`، بينما تستخدم هذه المكتبة أيقونة `clock` الأنسب دلالةً.
- **بدون انتقال الدخول/الخروج**: `Transition` غير موثوق في البرنامج المصغر — يظهر اللوح ويختفي مباشرةً، بما يتسق مع tooltip / dropdown / popover / cascader.
:::
