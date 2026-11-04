# Statistic إحصائي

يعرض قيمًا إحصائية مع دعم الدقة، وفواصل الآلاف، والبادئات/اللواحق، والأرقام الضخمة كسلاسل نصية.

## الاستخدام الأساسي

```vue
<template>
  <lh-statistic
    title="الزيارات السنوية"
    :value="2384712"
  />
</template>
```

## الدقة والفاصل

`precision` يتحكم في المنازل العشرية (مع تقريب)، و`separator` يتحكم في فصل الآلاف (مرر سلسلة فارغة لإيقافه).

```vue
<template>
  <lh-statistic
    title="التقييم"
    :value="4.8471"
    :precision="2"
  />
  <lh-statistic
    title="الرقم"
    :value="8899001"
    separator=""
  />
</template>
```

## البادئة واللاحقة

```vue
<template>
  <lh-statistic
    title="حجم المعاملات"
    :value="128600"
    prefix="¥"
    suffix="يين"
  />
  <lh-statistic
    title="معدل النمو"
    :value="12.6"
    :precision="1"
    suffix="%"
  />
</template>
```

## الأرقام الضخمة والنصوص غير الرقمية

قيمة `value` كسلسلة نصية يمكن أن تحمل أرقامًا ضخمة: سلاسل الأعداد الصحيحة التي تتجاوز `Number.MAX_SAFE_INTEGER` تمر عبر مسار تنسيق سلسلة نصية دون تحويل إلى Number ودون فقدان الدقة؛ أما السلاسل التي لا يمكن تحليلها كأرقام فتُعرض كما هي.

```vue
<template>
  <lh-statistic
    title="النجوم"
    value="لا تُحصى"
  />
  <lh-statistic
    title="المسافة بين النجوم"
    value="9007199254740993"
  />
</template>
```

## المنحنات (Slots)

المنحنيات `title` / `prefix` / `suffix` تتجاوز خصائص (props) تحمل الأسماء نفسها.

```vue
<template>
  <lh-statistic :value="1024">
    <template #title>
      <text>عنوان مخصص</text>
    </template>
    <template #prefix>
      <text>¥</text>
    </template>
    <template #suffix>
      <text>يين</text>
    </template>
  </lh-statistic>
</template>
```

## Props

| الخاصية | الوصف | النوع | القيمة الافتراضية |
| --- | --- | --- | --- |
| title | عنوان القيمة (يُعرض فوق القيمة) | `string` | — |
| value | القيمة الإحصائية؛ السلسلة النصية يمكن أن تحمل أرقامًا ضخمة أو نصًا يحمل إشارة | `string \| number` | `0` |
| precision | المنازل العشرية | `number` | `0` |
| separator | فاصل الآلاف؛ السلسلة الفارغة توقفه | `string` | `','` |
| prefix | بادئة القيمة، مثل رمز العملة | `string` | — |
| suffix | لاحقة القيمة، مثل الوحدة | `string` | — |
| customClass | اسم فئة مخصص | `string` | — |
| sx | خصائص التخطيط السريع | `LhSxProps` | — |

## Slots

| المنحنى | الوصف |
| --- | --- |
| title | عنوان مخصص |
| prefix | بادئة مخصصة |
| suffix | لاحقة مخصصة |

## اختلافات المنصة

- مكوّن عرض بحت لا يستخدم أي واجهة برمجية للمنصة، ويتصرف بشكل متطابق في H5 وبرنامج WeChat المصغر.
- يأتي كامل منطق التنسيق (الدقة، فصل الآلاف، مسار سلاسل الأرقام الضخمة) من الدالة النقية `formatStatisticValue` في `@lh-ui/share`؛ يضيف هذا المستودع الغراء التفاعلي فقط ولا ينسخ تنفيذ الـ core.
- تحمل منطقة القيمة `aria-live="polite"`: في H5 يعلن قارئ الشاشة عن القيمة الجديدة بلطف عند تغيّر `value`؛ أما دعم قراءة الشاشة في البرنامج المصغر فيعتمد على قدرات المنصة.
- لا يتضمن هذا المكوّن رسومًا متحركة للعد التصاعدي (count-up). عند إضافتها لاحقًا: يتوفر كل من `setInterval` و`requestAnimationFrame` في البرنامج المصغر، لكن `transitionend` غير موثوق هناك، لذا يجب محاذاة نهاية الرسوم المتحركة مع `setTimeout` (النهج نفسه المتبع في انتقالات message / loading).
