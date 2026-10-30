# تحميل Loading

خدمة قناع التحميل الشاملة. مثل Message تعتمد **نمط نقطة التركيب**.

## وضع نقطة التركيب

```vue
<template>
  <lh-config-provider>
    <view><!-- محتوى الصفحة --></view>
    <lh-loading />
  </lh-config-provider>
</template>
```

## الاستدعاء

```ts
import { useLhLoading } from '@lh-ui/uniapp'

const loading = useLhLoading()

// يقبل show كائن خيارات أو سلسلة نصية صرفة، ويُرجع handle
const handle = loading.show({ text: 'جارٍ التحميل...' })
handle.close()

// إغلاق الكل
loading.closeAll()
```

::: danger بدون نقطة تركيب يُعطى تحذير
مثل Message: عند استدعاء `useLhLoading()` دون وجود `<lh-loading />` في الصفحة،
يُصدر `console.error` تحذيرًا صريحًا في وقت التطوير، دون تخفيض صامت.
:::

## LhLoadingOptions

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| target | العقدة المستهدفة (**في H5 فقط**؛ وفي طرف MP دائمًا شامل الشاشة) | `string` | — |
| text | نص التحميل | `string` | — |
| background | لون قناع الخلفية | `string` | — |
| lock | قفل التمرير (**في H5 فقط**) | `boolean` | `false` |
| zIndex | الترتيب الطبقي؛ يُخصَّص تلقائيًا عند عدم التمرير | `number` | — |

## الدوال

| الدالة | الوصف | المعاملات |
| --- | --- | --- |
| show | يُظهر قناع التحميل ويُرجع handle (`{ close }`) | `(options: LhLoadingOptions \| string)` |
| close | يُغلق التحميل ذا المعرّف id | `(id: number)` |
| closeAll | يُغلق الكل | — |

## الفروق عن نسخة Vue3

- يدعم `target` في طرف البرنامج المصغر **القناع الشامل فقط** — فلا يمكن اختيار عقدة عشوائية لتعليق
  القناع داخل البرنامج المصغر، ويتجاهل طرف MP الحقل `target` في الإصدار الأول (يُحتفظ بالحقل
  ويُوثَّق).
- `lock` فعّال في H5 فقط؛ ولا يوجد قفل لتمرير body في البرنامج المصغر.
- عند تكديس عدة مثيلات، يضمن `useLhZIndex` أن القناع المفتوح لاحقًا في الطبقة العليا.
