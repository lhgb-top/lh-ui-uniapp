# Tooltip (تلميح)

## الاستخدام الأساسي

```vue
<template>
  <lh-tooltip content="هذا نص التلميح">
    <lh-button>انقر لعرض التلميح</lh-button>
  </lh-tooltip>
</template>
```

::: warning لا توجد دلالة hover في البرنامج المصغر
القيمة الافتراضية لـ `trigger` هي `click` (متاحة على كل المنصات). أما `hover` ففعّال في H5 فقط —
استخدم `trigger="click"` على طرف البرنامج المصغر، ليُطلَق ويُغلَق عبر النقر / اللمس.
:::

## الموضع والعرض

```vue
<template>
  <lh-tooltip content="تلميح سفلي" placement="bottom">
    <lh-button>bottom</lh-button>
  </lh-tooltip>

  <lh-tooltip content="النص الطويل يلتف تلقائيًا" :max-width="200" placement="top">
    <lh-button>تقييد العرض</lh-button>
  </lh-tooltip>
</template>
```

## Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| content | نص التلميح | `string` | — |
| placement | موضع الطبقة المنبثقة (12 موضعًا) | `LhTooltipPlacementCore` | `'top'` |
| trigger | طريقة الإطلاق: `click` (كل المنصات) / `hover` (H5 فقط) | `'click' \| 'hover'` | `'click'` |
| showDelay | تأخير الإظهار (بالملي ثانية) | `number` | — |
| hideDelay | تأخير الإخفاء (بالملي ثانية) | `number` | — |
| maxWidth | أقصى عرض (يلتف المحتوى تلقائيًا) | `string \| number` | — |
| disabled | معطّل | `boolean` | `false` |
| customClass | صنف مخصّص | `string` | — |
| themeVars | متغيّرات سمة خاصة بالمكوّن | `Record<string, string>` | — |
| sx | خصائص تخطيط سريعة | `LhSxProps` | — |

## Events

| الحدث | الوصف | معامل الاستدعاء |
| --- | --- | --- |
| update:modelValue | تغيّر الظهور (الاستخدام المتحكَّم) | `(visible: boolean)` |
| show | الإظهار | — |
| hide | الإخفاء | — |

::: tip الفروق عن نسخة Vue3
- تركيب الطبقة المنبثقة عبر `root-portal` + القياس غير المتزامن بإطارين (عرض شفاف أولًا لقياس
  الأبعاد ← التموضع ← العرض، لمنع الوميض).
- يحتفظ طرف MP بالسلوك الفوري لـ `showDelay` / `hideDelay` في وضع click فقط.
- حساب التموضع غير متزامن (`getLhRect` يُرجع Promise)، فلا تفترض الحصول على النتيجة بشكل متزامن.
:::
