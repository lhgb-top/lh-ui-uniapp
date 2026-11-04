# Timeline

تدفق أحداث عمودي. ترتيب الوقت هو ترتيب المستند. يدعم الطوابع الزمنية والأنواع الدلالية والنقاط المجوفة وتخطيط التناوب يميناً ويساراً.

> مكوّن عرض بحت: لا أحداث ولا حالة مُتحكَم بها، ويتصرف كل من H5 وبرنامج WeChat المصغر بشكل متطابق تماماً (انظر «اختلافات المنصة» في النهاية).

## الاستخدام الأساسي

يُعيّن `timestamp` نص الطابع الزمني؛ ويمنح `type` نقطة العقدة لوناً دلالياً (`'primary'` / `'success'` / `'warning'` / `'danger'`).

```vue
<template>
  <lh-timeline>
    <lh-timeline-item timestamp="2026-09-01">
      مراجعة انطلاق المشروع
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="2026-09-15"
      type="success"
    >
      تسليم المرحلة الأولى
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="2026-09-25"
      type="warning"
    >
      الاستلام جارٍ
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## التناوب يميناً ويساراً

يجعل `mode="alternate"` الخط الزمني يدور حول محور مركزي للحاوية، حيث تتناوب العناصر يميناً ويساراً حسب الفهرس (الفهارس الزوجية يساراً، والفردية يميناً).

```vue
<template>
  <lh-timeline mode="alternate">
    <lh-timeline-item timestamp="Q1">
      التخطيط
    </lh-timeline-item>
    <lh-timeline-item timestamp="Q2">
      التطوير
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="Q3"
      type="danger"
    >
      اختبار الحمل
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="Q4"
      type="success"
    >
      الإطلاق
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## النقاط المجوفة

يُصيّر `hollow` العقدة كنقطة مجوفة، ويُستخدم غالباً للحالات غير المكتملة.

```vue
<template>
  <lh-timeline>
    <lh-timeline-item
      timestamp="Q1"
      hollow
    >
      لم يبدأ
    </lh-timeline-item>
    <lh-timeline-item timestamp="Q2">
      قيد التقدم
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="Q3"
      type="success"
    >
      مكتمل
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## طابع زمني ونقطة مخصصان

كل من `timestamp` و`dot` عبارة عن فتحات (slots): استخدم فتحة `#timestamp` بدلاً من الخاصية لوضع أي محتوى تريده؛ وتستبدل فتحة `#dot` النقطة الافتراضية (بأيقونة مثلاً).

```vue
<template>
  <lh-timeline>
    <lh-timeline-item type="primary">
      <template #timestamp>
        سبتمبر 2026
      </template>
      محتوى طابع زمني مخصص
    </lh-timeline-item>
    <lh-timeline-item type="success">
      <template #dot>
        <lh-icon
          name="check"
          :size="12"
        />
      </template>
      نقطة مخصصة (أيقونة lh-icon)
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## Timeline Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| mode | التخطيط: `'left'` جانب واحد / `'alternate'` تناوب يمين ويسار | `'left' \| 'alternate'` | `'left'` |
| customClass | اسم صنف مخصص | `string` | — |
| sx | خصائص تخطيط سريعة | `LhSxProps` | — |

## TimelineItem Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| timestamp | نص الطابع الزمني (يقبل فتحة `#timestamp` أيضاً) | `string` | — |
| type | النوع الدلالي للعقدة (يُلوَّن إطار النقطة وفق التوكنز) | `'primary' \| 'success' \| 'warning' \| 'danger'` | — |
| hollow | عقدة مجوفة (تُستخدم غالباً للحالات غير المكتملة) | `boolean` | `false` |
| customClass | اسم صنف مخصص (يُمرَّر إلى العقدة الجذرية للعنصر) | `string` | — |
| sx | خصائص تخطيط سريعة | `LhSxProps` | — |

## Slots

| الفتحة | الوصف |
| --- | --- |
| Timeline default | عُقَد العناصر (`lh-timeline-item`) |
| TimelineItem default | محتوى نص العنصر |
| TimelineItem timestamp | محتوى الطابع الزمني (لا تُصيَّر هذا السطر إذا لم تُمرَّر الخاصية أو الفتحة) |
| TimelineItem dot | نقطة مخصصة (النقطة الافتراضية زخرفية بحتة وتبقى خارج شجرة الوصول) |

## اختلافات المنصة

- الخط الزمني **مكوّن عرض بحت**: لا أحداث ولا حالة مُتحكَم بها ولا قياسات ولا استدعاءات لـ APIs خاصة بالمنصة؛ كل من H5 وبرنامج WeChat المصغر مدعوم بالكامل ويُصيَّران بشكل متطابق.
- القائمة الدلالية `<ol>` / `<li>` يقلّلها `<view>` على كلا المنصتين (WXSS يحظر محددات الأسماء، والتنسيقات تطبَّق عبر الأصناف)، مع الحفاظ على دلالة القائمة عبر `role="list"` / `role="listitem"`؛ دعم قارئ الشاشة في البرنامج المصغر يعتمد على قدرة المنصة.
- خطوط الاتصال والمحور المركزي كلها عناصر CSS زائفة (`::before`) دون قياس عبر JS؛ والتناوب يميناً ويساراً في الوضع `alternate` يتحقق عبر زوجية الفهرس مع اتجاه flex، بشكل متطابق على المنصتين.
- **تنقية WXSS**: مُحدِّد `.lh-timeline__item:not(.lh-timeline__item--last)` من مصدر أنماط share يُتجرد من مُعدِّل `:not()` وقت البناء (WXSS لا يدعم `:not()`). إظهار خط الاتصال للعناصر غير الأخيرة تتولّاه قاعدة `.lh-timeline__item--last::before` التي لا تقلّ في الخصوصية،تبقى نتيجة التصيير كما هي على المنصتين.
- الوصول: نقاط العقدة زخرفية بحتة (`aria-hidden="true"`)، وفتحة النقطة المخصصة تبقى خارج شجرة الوصول أيضاً، تماماً كما في نسخة Vue 3.
- **قرار النقل (متوافق مع نسخة Vue 3، دون إدخال APIs غير معرَّفة)**: وقت النقل لم يكن مصدر الحقيقة في plus ونواة `@lh-ui/share` يوفّران بعدُ `placement` (موضع الطابع الزمني) أو `center` (تخطيط مركزي)، لذا لا توفّرهما هذه المكتبة أيضاً؛ ويقدم `mode` حالياً `'left'` / `'alternate'` فقط. وستُضاف متى أضافها مصدر الحقيقة.
