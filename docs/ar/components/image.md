# Image صورة

صورة مع عنصر بديل عند فشل التحميل ومعاينة اختيارية عند النقر (عبر واجهة `uni.previewImage`
الأصلية، المتاحة على جميع المنصات). يُربط وضع القص بـ `mode` لعنصر `<image>` في uni،
والتحميل الكسول يستخدم خاصية `lazy-load` المدمجة في المكوّن. أما تطبيع قائمة المعاينة
وأسماء فئات الحالة فتأتي من الدوال النقية في نواة `@lh-ui/share`.

## الاستخدام الأساسي

```vue
<template>
  <lh-image src="https://picsum.photos/240/140" alt="صورة نموذجية" :sx="{ w: '240px', h: '140px' }" />
</template>
```

`alt` إلزامي على مستوى TS، فلا تصل أي صورة بلا نص بديل. الحجم الافتراضي لـ `<image>` في uni
هو 320×240، فحدّد الأبعاد صراحة عبر `w` / `h` في `sx` (أو style)؛ أما استدارة الحواف فمدمجة
من مصدر أنماط share (`--lh-border-radius-small`) بلا أي إعداد.

## أنماط الملء

يصف `fit` دلالات object-fit في CSS ويُربط بـ `mode` لعنصر `<image>` في uni:
`contain` ← `aspectFit`، `cover` ← `aspectFill`، `fill` ← `scaleToFill`.

```vue
<template>
  <lh-image src="https://picsum.photos/240/140" alt="قص للتغطية" fit="cover" :sx="{ w: '110px', h: '80px' }" />
  <lh-image src="https://picsum.photos/240/140" alt="عرض كامل" fit="contain" :sx="{ w: '110px', h: '80px' }" />
  <lh-image src="https://picsum.photos/240/140" alt="تمديد للتغطية" fit="fill" :sx="{ w: '110px', h: '80px' }" />
</template>
```

::: tip أنماط none / scale-down تقريبية
`none` يُربط بـ `center` (بلا تحجيم، تُعرض المنطقة الوسطى فقط — بنفس دلالات object-fit: none)؛
لا يوجد في uni نمط مكافئ لـ `scale-down`، فيُستخدم `aspectFit` الأقرب دلاليًا
(نفس الانحراف المسجَّل في lh-avatar).
:::

## التحميل الكسول

`lazy` يفعّل خاصية `lazy-load` المدمجة في `<image>` في uni (تُحمَّل الصورة عند دخولها مجال الرؤية).

```vue
<template>
  <scroll-view scroll-y style="height: 140px; width: 100%">
    <lh-image
      v-for="i in 4"
      :key="i"
      :src="`https://picsum.photos/240/120?random=${i}`"
      :alt="`صورة كسولة ${i}`"
      lazy
      :sx="{ w: '240px', h: '120px', mb: 1 }"
    />
  </scroll-view>
</template>
```

على WeChat تعمل خاصية `lazy-load` فقط مع الصور الموجودة داخل page و scroll-view.

## فشل التحميل

عند فشل التحميل يتحول المكوّن إلى العنصر البديل (تُضاف الفئة `lh-image--error` إلى عقدة الجذر)،
والنص الافتراضي يأتي من مفتاح اللغة `image.error` (بتسع لغات)، ويمكن تخصيصه عبر فتحة `error`؛
كما يُطلق حدث `error` في الوقت نفسه.

```vue
<template>
  <lh-image src="https://invalid.example.com/not-found.png" alt="عنصر بديل افتراضي" :sx="{ w: '240px', h: '140px' }" />
  <lh-image src="https://invalid.example.com/not-found.png" alt="عنصر بديل مخصص" :sx="{ w: '240px', h: '140px' }">
    <template #error>عنصر بديل مخصص</template>
  </lh-image>
</template>
```

## النقر للمعاينة

مع تفعيل `preview` يفتح النقر على الصورة المعاينة الأصلية عبر `uni.previewImage` (المتاحة
على جميع المنصات)؛ تُمرَّر قائمة الصور المتعددة عبر `preview-src-list`، وعند غيابها تتراجع
القائمة إلى `[src]` (نفس آلية التطبيع في plus، والفهرس الابتدائي مثبت على 0).

```vue
<template>
  <lh-image
    src="https://picsum.photos/240/140"
    alt="معاينة متعددة الصور"
    preview
    :preview-src-list="[
      'https://picsum.photos/600/400?random=1',
      'https://picsum.photos/600/400?random=2',
      'https://picsum.photos/600/400?random=3',
    ]"
    :sx="{ w: '240px', h: '140px' }"
  />
  <lh-image src="https://picsum.photos/240/140" alt="معاينة صورة واحدة" preview :sx="{ w: '140px', h: '140px' }" />
</template>
```

## Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| src | رابط الصورة | `string` | — |
| alt | النص البديل (اشتراط a11y صارم، إلزامي على مستوى TS) | `string` | — |
| fit | وضع القص (يُربط بـ mode لعنصر image في uni) | `'contain' \| 'cover' \| 'fill' \| 'none' \| 'scale-down'` | `'cover'` |
| preview | هل يفتح النقر المعاينة | `boolean` | `false` |
| preview-src-list | قائمة صور المعاينة (تتراجع إلى [src] عند غيابها) | `string[]` | — |
| lazy | التحميل الكسول (خاصية lazy-load الأصلية لعنصر image في uni) | `boolean` | `false` |
| customClass | اسم فئة مخصص (يُمرَّر إلى عقدة الجذر) | `string` | — |
| sx | خصائص التخطيط السريع | `LhSxProps` | — |

## Events

| اسم الحدث | الوصف | معاملات الدالة |
| --- | --- | --- |
| load | يُطلق عند نجاح تحميل الصورة | `(event: Event)` |
| error | يُطلق عند فشل تحميل الصورة (مع التحوّل إلى العنصر البديل) | `(event: Event)` |

## Slots

| الفتحة | الوصف |
| --- | --- |
| error | محتوى العنصر البديل عند الفشل (الافتراضي من مفتاح اللغة image.error) |

## اختلافات المنصات

- **المعاينة تمر عبر واجهة `uni.previewImage` الأصلية** (المتاحة على جميع المنصات): معاينة
  plus هي طبقة عارض مرسومة ذاتيًا (teleport إلى body، تكبير / تدوير / تنقّل بين صور متعددة /
  إغلاق بـ Esc / حصر التركيز)، ولا يمكن نقلها إلى البرنامج المصغّر لعدم وجود document. يستدعي
  إصدار uniapp بدلًا من ذلك `uni.previewImage` — على H5 توفر منطقة uni العائمة، وعلى WeChat
  تُستخدم صفحة المعاينة الأصلية، وتوفر المنصة إمكانيات التفاعل **دون قدرة على التخصيص**
  (شفافية القناع / زر الإغلاق / شريط الأدوات). مكوّن `LhImageViewer` المستقل في plus ليس
  ضمن نطاق التسليم في هذا المستودع.
- **ربط fit بـ mode**: `contain` / `cover` / `fill` تُربط بـ `aspectFit` / `aspectFill` /
  `scaleToFill`؛ و`none` تُربط بـ `center`؛ أما `scale-down` فلا مكافئ لها، فتُستخدم
  `aspectFit` الأقرب دلاليًا (نفس الانحراف المسجَّل في lh-avatar). تنفيذ object-fit عبر CSS
  لا يعمل إلا مع `<img>` الحقيقية على H5، بينما `<image>` في uni يتحكم فيها `mode` على
  المنصات كلها.
- **التحميل الكسول**: `<image>` في uni يأتي بـ `lazy-load` مدمجة (بديلًا عن `loading="lazy"`
  في plus)؛ وعلى WeChat تعمل فقط مع الصور داخل page و scroll-view.
- **الأبعاد والاستدارة**: الحجم الافتراضي لـ `<image>` في uni هو 320×240، وتُحدَّد الأبعاد عبر
  `sx` / style؛ والاستدارة مدمجة من مصدر أنماط share (`--lh-border-radius-small`). كما أن plus
  لا يملك خصائص width / height / radius (الأبعاد عبر sx والاستدارة من مصدر الأنماط)، فلا
  يُضاف هنا شيئًا من تلقاء نفسه.
- **alt**: لا مفهوم لـ alt في `<image>` على البرامج المصغّرة (تُمرَّر كخاصية على H5)، فتبقى
  قدرة الاحتياط لإمكانية الوصول أضعف من `<img alt>` في الويب؛ ويبقى اشتراط الإلزام على
  مستوى TS قائمًا.
- **بقايا أنماط العارض**: مصدر أنماط share يحوي قواعد `.lh-image-viewer*` (أنماط العارض
  المرسوم ذاتيًا في plus)، وهي تدخل ضمن منتج style.css لهذا المكوّن بموجب اشتراط مصدر
  الأنماط الوحيد، دون عقد مقابلة على أيٍّ من المنصتين (ازدواجية غير مؤذية، وما زالت ملتزمة
  بالقائمة البيضاء لـ WXSS: قواعد `:hover` / `:focus` ملفوفة بالترجمة الشرطية لتعمل على H5 فقط).

::: tip الاختلافات عن إصدار Vue 3
- دلالات المنطق (تطبيع قائمة المعاينة، حالة التحميل، أسماء الفئات) مطابقة تمامًا لـ plus
  (نفس نواة share).
- المعاينة انتقلت من طبقة العارض المرسومة ذاتيًا إلى واجهة `uni.previewImage` الأصلية
  (انظر «اختلافات المنصات»).
- أُضيفت خاصية `customClass`: لا يمكن لأسماء الفئات المخصصة اختراق styleIsolation في uni-app،
  فتُمرَّر عبر خاصية موحدة.
- `none` / `scale-down` ربطان تقريبيان على البرامج المصغّرة (انظر «اختلافات المنصات»).
:::
