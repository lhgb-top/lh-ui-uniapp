# Calendar التقويم

مكوّن تقويم يعرض الأيام في شبكة شهرية، يدعم ثلاثة أوضاع اختيار — مفرد / فترة (بداية ونهاية) / متعدد — مع إمكانية تقييد النطاق القابل للاختيار عبر `range`. تأتي كل النصوص (رؤوس أيام الأسبوع وأسماء الشهور وعنوان اللوحة) من مفاتيح اللغة `datepicker.weeks.*` / `datepicker.month1~12` / `datepicker.panelTitle`. التقويم شبكة مرسومة بالكامل بواسطة `view` دون أي منشئ تاريخ أصلي، لذا فهو ملائم بطبيعته للجوال ومتاح على كل المنصات.

## الاستخدام الأساسي

```vue
<template>
  <lh-calendar v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date>()
</script>
```

عند عدم تمرير `modelValue` يحتفظ المكوّن بحالة الاختيار داخليًا، وعند تمريره يصبح مُتحكَمًا فيه (مثل جميع مكوّنات النماذج).

## اختيار فترة

مع `selection="range"`، تحدّد النقرة الأولى تاريخ البداية (تصبح القيمة `[البداية, البداية]`) وتحدّد النقرة الثانية النهاية مع تطبيع تلقائي (النقر بالترتيب العكسي يعطي أيضًا `[الأقدم, الأحدث]`):

```vue
<template>
  <lh-calendar v-model="span" selection="range" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const span = ref<Date[]>([])
</script>
```

يأخذ الطرفان نمط `--selected`، أما الأيام بينهما فتأخذ خلفية النطاق `--in-range` (باستثناء الطرفين).

## تقييد النطاق القابل للاختيار

يقبل `range` صفًّا `[البداية, النهاية]`؛ الأيام خارج النطاق تكون معطلة (الحكم على التعطيل من دالة نقية في share، والنطاقات المعكوسة تُطبَّع تلقائيًا):

```vue
<template>
  <lh-calendar v-model="value" :range="[start, end]" />
</template>

<script setup lang="ts">
const start = new Date(2026, 10, 1)
const end = new Date(2026, 10, 30)
</script>
```

## الاختيار المتعدد

مع `selection="multiple"`، إعادة النقر على يوم محدد مسبقًا تلغي اختياره، وتبقى النتيجة مرتبة زمنيًا:

```vue
<template>
  <lh-calendar v-model="dates" selection="multiple" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const dates = ref<Date[]>([])
</script>
```

## وضع المُشغِّل input

مع `mode="input"` لا يُرسم سوى صندوق مُشغِّل؛ انقر عليه لتوسيع اللوحة أو طيّها، وتُطوى اللوحة تلقائيًا بعد الاختيار (`close-on-select` مفعّل افتراضيًا، ووضع الفترة يحتاج نقرتين):

```vue
<template>
  <lh-calendar v-model="value" mode="input" placeholder="اختر تاريخًا" />

  <!-- فترة + دون طي تلقائي -->
  <lh-calendar v-model="span" mode="input" selection="range" :close-on-select="false" />
</template>
```

نص الصندوق افتراضيًا `YYYY-MM-DD` (للفترة `الأقدم ~ الأحدث`)، والنص البديل يأتي من مفتاح اللغة `select.placeholder`.

## عدة لوحات ومحتوى مخصص

يتحكم `panels` في عدد اللوحات الشهرية المعروضة معًا (مرتبة في صفوف flex)، بينما يخصص slotا `header` و`cell` عنوان اللوحة وخلايا الأيام:

```vue
<template>
  <lh-calendar v-model="value" :panels="2">
    <template #header="{ year, month }">
      <view class="my-title">{{ year }} / {{ month + 1 }}</view>
    </template>
    <template #cell="{ date }">
      <view class="my-cell">{{ date.getDate() }}</view>
    </template>
  </lh-calendar>
</template>
```

::: tip ملاءمة الجوال
لوحة التقويم شبكة `view` صافية (سبعة أعمدة متساوية)، بلا منتقي أصلي وبلا قياس DOM؛
يرسمها H5 وبرنامج WeChat المصغر بشكل متطابق، وتتكيّف مع عرض الحاوية على الشاشات الصغيرة.
:::

## Calendar API

### Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| modelValue | الاختيار الحالي (v-model مُتحكَم فيه، حالة داخلية عند الحذف) | `Date \| Date[]` | — |
| selection | وضع الاختيار: مفرد / فترة / متعدد | `'single' \| 'range' \| 'multiple'` | `'single'` |
| range | نطاق التواريخ القابلة للاختيار (خارجه معطّل، والمعكوس يُطبَّع) | `[Date, Date]` | — |
| mode | شكل العرض: لوحة دائمة / صندوق مُشغِّل قابل للتوسيع | `'panel' \| 'input'` | `'panel'` |
| panels | عدد اللوحات الشهرية المعروضة معًا | `number` | `1` |
| placeholder | النص البديل في وضع input (افتراضيًا مفتاح اللغة select.placeholder) | `string` | — |
| closeOnSelect | ما إذا تُطوى اللوحة بعد الاختيار في وضع input | `boolean` | `true` |
| customClass | صنف مخصص يُمرَّر إلى العقدة الجذرية | `string` | — |
| sx | خصائص التخطيط السريعة (تُطبَّق على العقدة الجذرية) | `LhSxProps` | — |

### Events

| الحدث | الوصف | المعاملات |
| --- | --- | --- |
| update:modelValue | تغيّر الاختيار (v-model) | `(value: Date \| Date[])` |
| change | تغيّر الاختيار (نفس حمولة update:modelValue) | `(value: Date \| Date[])` |
| select | عند النقر على يوم (الأيام المعطّلة تُتجاهل) | `(date: Date)` |

### Slots

| Slot | الوصف | معاملات النطاق |
| --- | --- | --- |
| header | تخصيص عنوان اللوحة | `{ year: number, month: number }` (month يبدأ من 0) |
| cell | تخصيص خلية اليوم | `{ date: Date }` |

### إمكانية الوصول

- الشبكة `role="grid"`، وكل صف `role="row"`، وخلايا الأيام `role="gridcell"`، والرؤوس `role="columnheader"`، مع `aria-selected` / `aria-current="date"` (اليوم) / `aria-disabled` (المعطّل)
- `aria-label` لكل خلية بصيغة `YYYY-MM-DD` ليعرفها قارئ الشاشة
- أزرار التنقل بين الشهور `role="button"` + `aria-label` (مفتاحا اللغة `datepicker.prevMonth` / `datepicker.nextMonth`)
- التنقل باللوحة عبر لوحة المفاتيح (الأسهم، Home / End، PageUp / PageDown) يعمل في H5 فقط، انظر اختلافات المنصات أدناه

::: tip اختلافات المنصات (الفروق عن نسخة Vue3)
- **حامل الشبكة**: التقويم شبكة `view` من سبعة أعمدة (WXSS `grid-template-columns: repeat(7, 1fr)`) دون أي منشئ تاريخ أصلي؛ يرسمه H5 وبرنامج WeChat المصغر ويتصرفان بصورة متطابقة، وهو ملائم للجوال بطبيعته.
- **تعيين عناصر DOM**: كل من `<div>` / `<button>` / `<input>` في plus يُستبدل بـ`<view>`؛ وفي وضع input يُرسم الصندوق المُشغِّل عبر `view` لعرض النص البديل والقيمة المختارة (لا يدعم MP خاصية `::placeholder`، واستخدام `<input>` أصلي يتطلب إضافة `placeholder-style`). الخلايا المعطّلة تحمل الصنف `--disabled` (لا تملك `view` فئة `:disabled` الزائفة، فيوفّر SFC بديلًا مضمَّنًا بالشمولة نفسها).
- **التنقل بلوحة المفاتيح في H5 فقط**: تنقّل الأسهم / Home / End / PageUp / PageDown وتنقّل التركيز (roving tabindex) لا يجد أحداث لوحة مفاتيح في MP، لذا لا يُستدعى أصلًا بفضل حراسة الترجمة الشرطية؛ لا يحتوي حزمة MP على كود ميت.
- **الطي عند النقر خارج اللوحة في H5 فقط**: يستمع plus إلى mousedown على مستوى المستند لطيّ اللوحة؛ ولا يوجد document في MP، فتُطوى اللوحة بالنقر على الصندوق المُشغِّل.
- **ربط سمات aria كلًّا على حدة**: لا يمكن نشر حزمة `LhAriaAttrs` من share عبر `v-bind` (برنامج ترجمة قوالب MP لا يدعمها)، فتوسّع طبقة الترابط مفاتيح `aria-*` إلى روابط صريحة، ولا يزال العهد تحدّده الدوال النقية في share.
:::
