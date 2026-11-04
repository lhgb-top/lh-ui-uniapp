# Descriptions قائمة الوصف

لعرض قائمة بسمات عنصر ما، مع دعم عدد الأعمدة وامتداد الأعمدة ووضع الحدود. تُمرَّر العناصر عبر `items` (`LhDescriptionsItem` هو نوع العنصر الذي يوفّره core في `@lh-ui/share`)، ويمكن استبدال المحتوى عبر slots ذي نطاق.

## الاستخدام الأساسي

```vue
<template>
  <lh-descriptions
    title="أرشيف المقتنيات"
    :column="2"
    :items="[
      { label: 'الاسم', value: 'مزهرية أزرق وأبيض' },
      { label: 'الحقبة', value: 'سلالة مينغ' },
      { label: 'الفئة', value: 'خزف' },
      { label: 'الدرجة', value: 'من المستوى الأول' },
    ]"
  />
</template>
```

## الأعمدة والامتداد

يتحكم `column` في عدد العناصر لكل صف، بينما يتحكم `span` الخاص بكل عنصر في عدد الأعمدة التي يشغلها. يتم ضبط `span` تلقائيًا عند تجاوزه العرض المتبقي للصف، ويُملأ الصف الأخير الناقص تلقائيًا (خلايا الحشو تحمل `aria-hidden` وهي زخرفية بحتة).

```vue
<template>
  <lh-descriptions
    :column="3"
    :items="[
      { label: 'الاسم', value: 'ألف لي من الأنهار', span: 2 },
      { label: 'الحقبة', value: 'سلالة سونغ الشمالية' },
      { label: 'الفنان', value: 'وانغ شيمينغ' },
      { label: 'الخامة', value: 'حبر وألوان على حرير' },
      { label: 'الموقع', value: 'متحف القصر، بكين' },
    ]"
  />
</template>
```

## وضع الحدود

يُفعِّل `border` حدود الجدول (في وضع الحدود تُلغى مسافات الصفوف وتشكل حدود الخلايا الجدول).

```vue
<template>
  <lh-descriptions
    :column="2"
    border
    :items="[
      { label: 'الاسم', value: 'مقدمة جناح الأوركيد' },
      { label: 'الكاتب', value: 'وانغ شي تشي' },
      { label: 'الحقبة', value: 'سلالة جين الشرقية' },
      { label: 'الخط', value: 'الخط الجاري' },
    ]"
  />
</template>
```

## تخصيص العنوان والمحتوى

يلغي slot الخاص بـ `title` رأس القائمة، بينما يلغي slot ذو النطاق `item-<index>` محتوى العنصر المطابق (`index` هو فهرس الخلية داخل صفها، ويوفّر النطاق `{ item }`).

```vue
<template>
  <lh-descriptions :column="2" :items="items">
    <template #title>
      <text>أرشيف المقتنيات (عنوان slot)</text>
    </template>
    <template #item-1="{ item }">
      <lh-tag type="success">{{ item.value }}</lh-tag>
    </template>
  </lh-descriptions>
</template>

<script setup lang="ts">
const items = [
  { label: 'الحالة', value: 'قيد التقدم' },
  { label: 'المرحلة', value: 'تم التقييم' },
]
</script>
```

## Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| title | عنوان القائمة | `string` | — |
| column | عدد العناصر لكل صف | `number` | `3` |
| border | إظهار الحدود | `boolean` | `false` |
| items | قائمة العناصر؛ ثلاثيات label / value / span | `[LhDescriptionsItem](#lhdescriptionsitem-النوع)`[] | `() => []` |
| customClass | اسم صنف مخصص | `string` | — |
| sx | خصائص تخطيط سريعة | `LhSxProps` | — |

## LhDescriptionsItem (النوع)

من core في `@lh-ui/share` (`LhDescriptionsItem`)؛ لا يُعاد تعريفه في هذا المستودع.

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| label | تسمية العنصر | `string` | — |
| value | محتوى العنصر (يمكن أيضاً تمريره عبر slot ذي نطاق) | `string \| number` | — |
| span | عدد الأعمدة المراد شغلها؛ يُضبط عند التجاوز | `number` | `1` |

## Slots

| Slot | الوصف | النطاق |
| --- | --- | --- |
| title | عنوان مخصص | — |
| item-\<index\> | يلغي محتوى العنصر (index هو فهرس الخلية داخل صفها) | `{ item }` |

## فروقات المنصة

- مكوّن عرض بحت لا يستخدم أي API خاص بالمنصة، ويتصرف بشكل متطابق تماماً على H5 وبرنامج WeChat المصغر. سلوك `items` / `column` / `border` / `span` مطابق لإصدار Vue 3.
- يستخدم إصدار Vue 3 وسوم `<dl>/<dt>/<dd>` الدلالية، وهنا تُستبدل بـ `<view>` (WXSS يمنع محددات الوسوم، والتنسيق يُطبَّق عبر الأصناف). يعتمد تخطيط الصفوف على `flex` مضمّن و`flex-basis` بالنسب المئوية، بنفس معادلات العرض في إصدار Vue 3.
- خطوط الجدول في وضع الحدود تأتي من مصدر الأنماط في `@lh-ui/share` وتبقى قابلة للاستخدام في البرنامج المصغر بعد تنقية `build-styles` (يحتوي الناتج على محددات الأصناف والخصائص فقط، بما يتوافق مع القائمة البيضاء لـ WXSS).
- تجميع بنية الصفوف (تسوية span والضبط والتفاف والتعبيئة) ينتج بالكامل عن الدالة النقية `buildDescriptionRows` في `@lh-ui/share`؛ يضيف هذا المستودع الغراء التفاعلي فقط ولا ينسخ تطبيق core.
