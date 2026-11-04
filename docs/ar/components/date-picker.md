# DatePicker (منتقي التاريخ)

منتقي التاريخ: انقر على صندوق المشغل لفتح لوحة تقويم تدعم ثلاثة أوضاع اختيار (تاريخ / شهر / سنة)، وتنسيق عرض مخصص، وعرض قيم النطاق. خوارزميات شبكة التقويم وتنسيق التاريخ وتحقق التعطيل كلها دوال نقية من `@lh-ui/share` core، واللوحة شبكة `view` مرسومة يدوياً، بحيث يكون الرَّفْع في H5 وبرنامج WeChat المصغر متطابقاً.

## عقد نوع القيمة

القيمة المرتبطة **دائماً كائن `Date`** (النطاق هو صف `[Date, Date]`)؛ لا يقبل المكوّن سلاسل تاريخ ISO ولا يُصدرها:

```vue
<template>
  <lh-date-picker v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
// ✅ صحيح: كائن Date
const value = ref<Date | null>(new Date(2026, 10, 3))
// ❌ خطأ: '2026-11-03' لا يُعرض ولا يُحلَّل
</script>
```

خاصية `format` تؤثر فقط على **العرض في المشغل واللوحة** (رموز ثابتة العرض `yyyy` / `MM` / `dd` / `HH` / `mm` / `ss`) ولا تغيّر شكل القيمة المرتبطة أبداً. ما تتلقاه هو `Date`؛ إن احتجت سلسلة ISO للتخزين فاستدعِ `formatDate` أو `toISOString()` بنفسك.

## الاستخدام الأساسي

```vue
<template>
  <lh-date-picker v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3))
</script>
```

في وضع التاريخ، النقر على يوم يُخزَّن **مؤقتاً** فقط؛ انقر「موافق」في أسفل اللوحة للتأكيد (إرسال بخطوتين، مثل نسخة Vue3). زرّ「اليوم」يعيد اللوحة إلى الشهر الحالي ويخزّن اليوم مؤقتاً.

## وضعا الشهر والسنة

مع `mode="month"` / `mode="year"` تُفتح اللوحة مباشرة على الشبكة المقابلة، والنقر على خلية يختار ويغلق فوراً (بدون أزرار سفلية). في وضع التاريخ يمكن النقر على عنوان اللوحة للتنقل بسلسلة المستويات: تاريخ → شهر → سنة، وفي عرض السنة يعود النقر على العنوان إلى الأشهر.

```vue
<template>
  <lh-date-picker v-model="month" mode="month" />
  <lh-date-picker v-model="year" mode="year" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const month = ref<Date | null>(new Date(2026, 5, 1))
const year = ref<Date | null>(new Date(2024, 0, 1))
</script>
```

## تنسيق التاريخ

```vue
<template>
  <lh-date-picker v-model="value" format="MM/dd/yyyy" />
  <lh-date-picker v-model="value" format="yyyy-MM-dd" />
</template>
```

عند حذف `placeholder` يُولَّد النص البديل من `format` (`yyyy` →「سنة」من حزمة اللغة، `MM` →「شهر」， `dd` →「يوم」).

## التعطيل والقراءة فقط

```vue
<template>
  <lh-date-picker v-model="value" disabled />
  <lh-date-picker :model-value="value" readonly />
</template>
```

`disabled` يُعطّل المنتقي بأكمله (لا تُفتح اللوحة عند النقر)؛ `readonly` للقراءة فقط (يقبل القيم البرمجية ولكنه لا يفتح اللوحة أبداً).

## الأحجام والمسح

```vue
<template>
  <lh-date-picker v-model="value" size="small" />
  <lh-date-picker v-model="value" size="medium" />
  <lh-date-picker v-model="value" size="large" />
  <lh-date-picker v-model="value" :clearable="false" />
</template>
```

يعود `size` إلى الحجم العام لـ ConfigProvider ثم في النهاية إلى `medium`. `clearable` مفعّل افتراضياً ويعرض أيقونة مسح على يمين المشغل.

## عرض قيم النطاق

عندما تكون القيمة المرتبطة `[Date, Date]`، يعرض المشغل الطرفين مفصولين بـ `range-separator` (افتراضياً `~`):

```vue
<template>
  <lh-date-picker v-model="span" range-separator=" إلى " />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const span = ref<[Date, Date]>([new Date(2026, 10, 1), new Date(2026, 10, 7)])
</script>
```

::: warning واجهة اختيار النطاق / التاريخ-الوقت غير مُنفَّذة بعد
كما في نسخة Vue3، فإن `mode="datetime"` واختيار النطاق **مجرد حجز نوعي بدون واجهة اختيار** (أعمدة الوقت ولوحة النطاق غير منفذة، سجل العائلة P-08). يمكن عرض قيمة النطاق، لكن النقر على「موافق」داخل اللوحة لا يستبدل نطاقاً مرتبطاً بقيمة `Date` واحدة.
:::

## تخصيص الخلايا واللوحة

```vue
<template>
  <lh-date-picker v-model="value" :cell-class-name="cellClassName" popper-class="my-popper" />
</template>

<script setup lang="ts">
const cellClassName = (date: Date) => (date.getDay() === 0 || date.getDay() === 6 ? 'my-weekend' : '')
</script>
```

`cell-class-name` يضيف فئة مخصصة لكل يوم (القيم الفارغة تُتخطى)؛ `popper-class` يُمرَّر إلى جذر اللوحة لتنسيقها على مستوى اللوحة.

## DatePicker API

### Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| modelValue | القيمة المرتبطة (Date / صف نطاق / null، **بدون سلاسل ISO**) | `Date \| [Date, Date] \| null` | `null` |
| mode | وضع الاختيار | `'date' \| 'month' \| 'year' \| 'datetime' \| 'range'` | `'date'` |
| size | الحجم (يعود إلى الحجم العام لـ ConfigProvider ثم medium) | `'small' \| 'medium' \| 'large' \| 'mini' \| 'x-large'` | `'medium'` |
| disabled | تعطيل المنتقي بأكمله | `boolean` | `false` |
| clearable | إظهار زر المسح | `boolean` | `true` |
| placeholder | النص البديل (يُولَّد من format عند الحذف) | `string` | `''` |
| format | تنسيق العرض (رموز ثابتة العرض، عرض فقط) | `string` | `'yyyy-MM-dd'` |
| readonly | للقراءة فقط (لا يفتح اللوحة أبداً) | `boolean` | `true` |
| rangeSeparator | فاصل النطاق (يصل عرض النطاق) | `string` | `'~'` |
| cellClassName | نداء الفئة المخصصة لخلية اليوم | `(date: Date) => string` | — |
| popperClass | فئة مخصصة للوحة | `string` | — |
| customClass | فئة مخصصة للعقدة الجذر | `string` | — |
| themeVars | متغيرات السمة على مستوى المكوّن، تتجاوز ConfigProvider | `Record<string, string>` | — |
| sx | خصائص التخطيط السريع (العقدة الجذر؛ اللوحة العائمة لا تتأثر) | `LhSxProps` | — |

::: tip قيم mode
`'datetime'` و `'range'` **حجز نوعي**: يضمّهما `LhDatePickerMode` (share core)، لكن أعمدة الوقت ولوحة النطاق غير منفذة (سجل P-08)؛ يُرجى حالياً استخدام `'date'` / `'month'` / `'year'` فقط.
:::

### Events

| الحدث | الوصف | المعاملات |
| --- | --- | --- |
| update:modelValue | تغيّر القيمة (v-model) | `(value: Date \| [Date, Date] \| null)` |
| change | تأكيد القيمة (نفس حمولة update:modelValue) | `(value: Date \| [Date, Date] \| null)` |

### إمكانية الوصول

- المشغل هو `role="combobox"` (`aria-expanded` / `aria-haspopup="dialog"` / `aria-controls` يشير إلى اللوحة)؛ حزمة السمات تُنتجها دالة share `getDatePickerTriggerAria`
- اللوحة هي `role="dialog"`؛ التقويم `role="grid"` وخلايا الأيام `role="gridcell` وتحمل `aria-selected` / `aria-current="date"` (اليوم) / `aria-disabled` (معطّل)
- `aria-label` لخلية اليوم هي صيغة كاملة「السنة YYYY، الشهر M، اليوم D، يوم الأسبوع X」ليتعرف عليها قارئ الشاشة
- أزرار تنقّل الأشهر هي `role="button"` + `aria-label` (مفتاحا اللغة `datepicker.prevMonth` / `datepicker.nextMonth`)
- التنقل بلوحة المفاتيح في الشبكة وسلوك المشغل لوحده H5 فقط — راجع فروقات المنصة أدناه

::: tip فروقات المنصة (الفروق عن نسخة Vue3)
- **اختيار عبر لوحة**: لوحة تقويم plus أصلها لوحية (وليست منتقي عجلة)، وقد أبقى هذا النقل على نفس التفاعل؛ حامل الطبقة العائمة هو `lh-root-portal` بدلاً من `Teleport to="body"` (مع تراجع إلى `fixed` داخل الصفحة للإصدارات القديمة)، ويُحسب الموضع بالقياس غير المتزامن على إطارين (تصيير مخفي للقياس → `computePosition` للتحديد → الإظهار، بدون وميض)، ولم تُربط انتقالات الدخول والخروج.
- **تعيين العناصر**: حُوِّلت `<div>` / `<button>` / `<input>` في plus كلها إلى `<view>`؛ عرض المشغل والنص البديل مرسومان بـ `<text>` يدوياً (MP لا يدعم `::placeholder`، ولون النص البديل تأتي به فئة معدِّلة داخل الـ SFC بنفس التوكن)، وحالات التعطيل لأزرار الأشهر / اليوم / موافق تُحمل بالفئات (عنصر `view` ليست له pseudoclass `:disabled`).
- **الإغلاق عند النقر خارج**: يصغي plus إلى نقرة على مستوى المستند؛ أما هذا النقل فيُغلق عند النقر على قناع شفاف داخل الصفحة (نفس الدلالة، فلا `document` في MP)، والنقر على القناع يُغلق فقط دون إصدار change.
- **التنقل بلوحة المفاتيح H5 فقط**: Enter / Space على المشغل، وتحريك الأسهم داخل الشبكة (شامل تقليب الأشهر) / Home / End / PageUp / PageDown، وroving tabindex، وEscape لإغلاق الطبقة العلوية — ليس للوحة المفاتيح أحداث في MP، فلا يُستدعى الكود المحمي بالتجميع الشرطي إطلاقاً ولا يحتوي حزمة MP على كود ميت.
- **تُربط سمات aria واحدة تلو الأخرى**: لا يمكن نشر حزمة share `LhAriaAttrs` عبر `v-bind` (مصرّف قوالب MP لا يدعمها)، لذا توسّع طبقة الغراء مفاتيح `aria-*` إلى روابط صريحة؛ وما زال العقد تحدده دوال share النقية.
- **عقد نوع القيمة**: مطابق لـ plus — القيمة المرتبطة هي `Date` / `[Date, Date]`، وليست سلسلة تاريخ ISO في أي اتجاه؛ و`format` يؤثر على طبقة العرض فقط.
:::
