# Transfer (قائمة النقل)

قائمة من لوحتين مع تحريك عبر مربعات الاختيار. يتم استهلاك كامل منطق تقسيم البيانات
والتصفية وتحديد الكل والتحريك من الدوال النقية في core الخاص بـ `@lh-ui/share`
(`partitionTransferData` / `filterTransferItems` / `toggleTransferCheckAll` /
`moveTransferKeys` وغيرها)؛ طبقة المكوّن تتولى فقط العرض والأحداث وتنقّل لوحة
المفاتيح. كلتا اللوحتين تحملان `role="listbox"` (نمط APG listbox).

## الاستخدام الأساسي

```vue
<template>
  <lh-transfer v-model="source" :data="items" @change="onChange" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhTransferItem } from '@lh-ui/share/core/transfer'

const source = ref<Array<string | number>>(['a'])
const items: LhTransferItem[] = [
  { key: 'a', label: 'أ' },
  { key: 'b', label: 'ب' },
  { key: 'c', label: 'جـ', disabled: true },
  { key: 'd', label: 'د' },
]

function onChange(keys: Array<string | number>, direction: 'left-to-right' | 'right-to-left') {
  console.log(keys, direction)
}
</script>
```

يرتبط `v-model` بقائمة المفاتيح على اليسار (المصدر): العناصر التي مفاتيحها موجودة في
`modelValue` تُعرض في العمود الأيسر والباقي في الأيمن. حدّد أي عنصر ثم اضغط زرّي › / ‹
في المنتصف لنقله، فتُطلق `update:modelValue` و`change` (مع الاتجاه `'left-to-right'` /
`'right-to-left'`)، ويُفرَّغ مجموعة التحديد بعد كل عملية نقل.

يحتوي كل لوحة على مربع بحث أعلاها (مفعّل دائمًا كنسخة Vue3)، يُصفّي حساسًا لحالة
الأحرف؛ ويعرض ترويسة اللوحة عدّاد «عدد الجهة / المجموع»، ومربع تحديد الكل (تُحمل
الحالة الجزئية عبر `indeterminate`).

`data` هو `LhTransferItem[]`: `key` فريد، و`label` نص العرض (يعود إلى key عند غيابه)،
و`disabled` يعطّل العنصر (لا يقبل التحديد، يُستثنى من تحديد الكل، ولا يُنقل).

## التعطيل

يعطّل `disabled` قائمة النقل بأكملها: يُحظر التحديد وتحديد الكل والبحث والنقل.

```vue
<template>
  <lh-transfer v-model="source" :data="items" disabled />
</template>
```

## API

### Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| data | مجموعة البيانات الكاملة | `LhTransferItem[]` | — |
| modelValue | قائمة المفاتيح اليسرى (المصدر، مُتحكَّم بها عبر v-model) | `Array<string \| number>` | `[]` |
| disabled | تعطيل | `boolean` | `false` |
| sx | خصائص التخطيط السريع sx | `LhSxProps` | — |

### Events

| الحدث | الوصف | المعاملات |
| --- | --- | --- |
| update:modelValue | تغيّر قائمة المفاتيح اليسرى (المصدر) (لـ v-model) | `(keys: Array<string \| number>)` |
| change | يُطلق عند اكتمال عملية النقل | `(keys: Array<string \| number>, direction: 'left-to-right' \| 'right-to-left')` |

### LhTransferItem

| الحقل | الوصف | النوع |
| --- | --- | --- |
| key | مفتاح فريد | `string \| number` |
| label | نص العرض (يعود إلى key عند غيابه) | `string` |
| disabled | معطّل (لا يقبل التحديد / يُستثنى من تحديد الكل / لا يُنقل) | `boolean` |

### إتاحة الوصول

- كلتا اللوحتين تحملان `role="listbox"` + `aria-multiselectable`، والعناصر تحمل
  `role="option` مع `aria-selected` / `aria-disabled`
- لكل لوحة مربع بحث خاص بها يحمل `aria-label`؛ كذلك أزرار النقل تحمل
  `aria-label` («نقل إلى اليمين» / «نقل إلى اليسار»)
- مربع تحديد الكل يحمل الحالة الجزئية عبر `indeterminate`؛ وتُحظر العناصر المعطّلة
  في كل مكان (التحديد، تحديد الكل، النقل)

::: tip اختلافات المنصة (الاختلافات عن نسخة Vue3)
- **يظل نطاق ال API متطابقًا تمامًا مع مصدر نسخة Vue3**: لا يُقدَّم هنا سوى ما تقدمه
  نسخة Vue3: `data` / `modelValue` / `disabled` / `sx`. الإمكانيات الشائعة في
  مكتبات أخرى والمفقودة من مصدر Vue3 — `titles` (عناوين اللوحات) و`filterable`
  (مفتاح تبديل البحث) و`props` (أسماء حقول مخصصة) و`left/right-default-checked`
  (مفاتيح محددة افتراضيًا) — لم تُضَف عمدًا؛ إذ تأتي عناوين اللوحات من مفتاحَي
  locale في share هما `transfer.sourceTitle` / `transfer.targetTitle`
  (متوفرة بعشر لغات)، ويحتفظ مربع البحث بالشكل الدائم لنسخة Vue3 (بلا مفتاح).
- **كلتا القائمتين تحملهما scroll-view**: قائمتا `<ul>` / `<li>` في نسخة Vue3
  تصبحان هنا `<scroll-view scroll-y>` + `<view>` (لأن `view` العادي لا يمكنه
  التمرير عند التجاوز بشكل موثوق في البرنامج المصغّر)، بسلوك متطابق على H5
  وبرنامج WeChat المصغّر؛ وتأتي أنماط القائمة كما هي من
  `.lh-transfer-panel__list` التابعة لـ share.
- **النقل بالأزرار متاح على كل المنصات**: زرّا النقل › / ‹ في المنتصف هما
  `<button>` المدمج من uni، وكلاهما قابل للنقر على H5 والبرنامج المصغّر؛
  لا اختلاف منصة هنا، ويحمل الحالة المعطّلة الخاصية `disabled`.
- **تنقّل لوحة المفاتيح خاص بـ H5 فقط**: مفاتيح نمط APG listbox — ↑/↓ داخل
  القائمة المُصفّاة (تخطّي المعطّل، بدون تكرار)، Enter / Space لتحديد العنصر
  الذي عليه التركيز، ←/→ لنقل التركيز بين اللوحتين، Escape لإعادة تعيين
  التركيز — تعمل على H5 فقط؛ فالبرنامج المصغّر لا أحداث للوحة المفاتيح،
  ويُستأصل هذا المقطع بالكامل عبر الترجمة الشرطية (لا كود ميت في حزمة MP)،
  كذلك roving tabindex لا يُخرج قيمًا إلا على H5.
- **مربعات التحديد مرسومة ذاتيًا**: مربع تحديد الكل ومربعات العناصر لا
  تستخدم `<input type="checkbox">` أصليًا (لا يمكن ضبط تنسيقه في البرنامج
  المصغّر)، بل تستخدم `lh-checkbox` الخاص بهذه الحزمة (مرسوم بـ view +
  lh-icon). لا تزال الحالة تُكتب من المكوّن بشكل مُتحكَّم به، فلا تتغير
  الدلالة.
:::
