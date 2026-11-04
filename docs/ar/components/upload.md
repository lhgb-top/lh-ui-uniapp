# Upload رفع الملفات

اختيار الملفات ورفعها. تُستهلك عمليات تحقق الاختيار (accept / maxSize /
maxCount) وآلة حالات عنصر الملف (ready → uploading → success / fail) ومنطق
ترقيع القائمة بالكامل من الدوال النقية في نواة `@lh-ui/share`
(`normalizeUploadAccept` / `isFileRejected` / `exceedsMaxSize` /
`exceedsMaxCount` / `patchUploadFile` وغيرها)؛ طبقة المكوّن تتعامل فقط مع
العرض والأحداث وتكييف الاختيار حسب المنصة. لا يحتوي الرفع على عميل HTTP
مدمج: خاصية `request` يملكها المستخدم ويمكن إنشاؤها مباشرة عبر
`createLhUploadRequest` من طبقة التكييف.

## الاستخدام الأساسي

```vue
<template>
  <lh-upload :request="request" accept="image/*" @success="onSuccess" />
</template>

<script setup lang="ts">
import { createLhUploadRequest } from '@lh-ui/uniapp/src/adapter/upload'

// البرنامج المصغر: uni.uploadFile؛ H5: XHR + FormData؛ اسم الحقل الافتراضي
// file. على الجهاز الحقيقي يجب تسجيل النطاق الهدف في إعدادات
// "نطاقات الخادم - uploadFile" لدى WeChat.
const request = createLhUploadRequest('https://upload.example.com/file')

function onSuccess(file: { uid: string; name: string; url?: string }) {
  console.log(file.url)
}
</script>
```

ينقر المستخدم على منطقة المشغل فيفتح أداة الاختيار الأصلية (chooseMedia /
chooseImage / chooseVideo). عند دخول ملف إلى القائمة يُستدعى `request` فورًا:
أثناء الرفع يظهر شريط تقدّم، وعند النجاح يظهر ✓ مع رابط الخادم، وعند الفشل
يُعرض السبب (يحمل حدث `error` الملف الفاشل ونص السبب). دون تمرير `request`
يقوم المكوّن بالاختيار والتحقق محليًا فقط، وتبقى القائمة في الحالة `ready`
ويتولى المستخدم قناة الرفع بنفسه.

تعرف منطقة المشغل نص تلميح افتراضيًا («اختر ملفًا»، أو في وضع السحب
«أفلت الملفات هنا أو انقر للرفع»؛ تُجلب النصوص من مفاتيح `upload.*` في
share locales ومتوفرة بعشر لغات). مرّر slot افتراضيًا لتخصيص محتوى منطقة
المشغل.

## التحديد المتعدد وحدود العدد / الحجم

```vue
<template>
  <lh-upload
    :request="request"
    accept="image/*"
    multiple
    :max-count="3"
    :max-size="2 * 1024 * 1024"
  />
</template>
```

يفعّل `multiple` التحديد المتعدد في أداة الاختيار الأصلية؛ عند بلوغ
`maxCount` تُظهر عمليات الاختيار اللاحقة «تجاوز حد العدد» وتتوقف عن الإضافة؛
وتُتخطى الملفات التي تتجاوز `maxSize` مع رسالة «تجاوز الملف حد الحجم»
(الافتراضي 5 ميغابايت). تُعرض الرسالتان في عقدة نص الخطأ أسفل القائمة
(`role="alert"`).

## تصفية النوع عبر accept

```vue
<template>
  <lh-upload :request="request" accept=".png,.jpg" />
</template>
```

يقبل `accept` مصفوفة `['.png', 'image/*']` أو سلسلة مفصولة بفواصل
`'.png,.jpg'`. راجع «اختلافات المنصة» أدناه لمعرفة كيف تُ map القواعد على
جانب uni: لا يستطيع لوح أداة الاختيار الأصلية التصفية إلا حسب نوع الوسائط،
لذا قواعد الامتداد لا تصل إلى اللوحة ويطبقها `isFileRejected` بعدها كتحقق
احتياطي.

## السحب والإفلات (H5 فقط)

```vue
<template>
  <lh-upload :request="request" accept="image/*" drag multiple />
</template>
```

يحوّل `drag` منطقة المشغل إلى منطقة إفلات (`dragover` / `dragleave` /
`drop` تعمل على H5؛ تُغلَّف ملفات File المُفلتة في `LhUniFile` وتسير في
التدفق ذاته). لا يدعم البرنامج المصغر السحب والإفلات HTML5، لذا لا يعمل
`drag` على MP وتتحول منطقة المشغل إلى رفع بالنقر.

## التعطيل

```vue
<template>
  <lh-upload :request="request" accept="image/*" disabled />
</template>
```

يعطّل `disabled` الرفع بالكامل: يُكبَت النقر على منطقة المشغل والتفعيل بلوحة
المفاتيح (Enter / Space، H5 فقط)، وتُخرج منطقة المشغل `aria-disabled`.

## API

### Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| multiple | السماح بالتحديد المتعدد | `boolean` | `false` |
| drag | منطقة سحب وإفلات (H5 فقط: لا يدعم MP السحب HTML5) | `boolean` | `false` |
| disabled | تعطيل | `boolean` | `false` |
| accept | الامتدادات / MIME المسموح بها: مصفوفة `['.png', 'image/*']` أو سلسلة بفواصل `'.png,.jpg'` | `string[] \| string` | `[]` |
| maxSize | حد حجم الملف الواحد (بايت) | `number` | `5242880` (5 ميغابايت) |
| maxCount | حد العدد (0 = غير محدود) | `number` | `0` |
| request | دالة طلب الرفع (تُحذف للاختيار والتحقق محليًا فقط) | `LhUniUploadRequest` | — |
| customClass | فئة مخصصة (تُمرَّر إلى العقدة الجذرية) | `string` | — |
| sx | خصائص التخطيط السريع sx | `LhSxProps` | — |

### Events

| الحدث | الوصف | المعاملات |
| --- | --- | --- |
| change | تغيّرت قائمة الملفات (بعد الاختيار / إتمام الرفع / الحذف) | `(files: LhUploadFile[])` |
| success | نجاح رفع ملف واحد | `(file: LhUploadFile)` |
| error | فشل رفع ملف واحد | `(file: LhUploadFile, reason: string)` |
| remove | حُذف ملف | `(uid: string)` |

### Slots

| الاسم | الوصف |
| --- | --- |
| default | محتوى منطقة المشغل (افتراضيًا نص التلميح) |

### LhUploadFile

| الحقل | الوصف | النوع |
| --- | --- | --- |
| uid | معرّف فريد (يُولَّد داخليًا) | `string` |
| name | اسم الملف | `string` |
| size | الحجم بالبايت | `number` |
| status | الحالة | `'ready' \| 'uploading' \| 'success' \| 'fail'` |
| percent | تقدّم الرفع 0-100 | `number` |
| url | رابط الخادم (عند النجاح) | `string` |
| error | سبب الفشل | `string` |

### طبقة التكييف (`@lh-ui/uniapp/src/adapter/upload`)

| التصدير | الوصف |
| --- | --- |
| `LhUniFile` | مقبض الملف على جانب uni: `{ path, name, size, type }` (path مسار مؤقت: blob / data URL على H5، ومسار مؤقت wxfile:// على WeChat) |
| `LhUniUploadRequest` | توقيع دالة خاصة request: تستقبل `{ file: LhUniFile, onProgress }` وتُرجع `Promise<LhUploadResult>` |
| `LhUploadResult` | نتيجة الرفع: `{ url?, data? }` (عند غياب url يحمل data نص الاستجابة الخام لتحليله بنفسك) |
| `LhUploadConfig` | إعدادات `createLhUploadRequest`: `{ name?, header?, formData? }` |
| `createLhUploadRequest(action, config?)` | تُنشئ دالة request: `uni.uploadFile` على البرنامج المصغر، و XHR + FormData على H5 |
| `chooseLhFiles(options)` | اختيار ملفات موحَّد (يُستدعى عادة عبر منطقة المشغل ونادرًا ما يستخدمه المستخدم مباشرة) |
| `wrapLhNativeFile(file)` | تغليف File حقيقي أُفلت على H5 في `LhUniFile` |

### إتاحة الوصول

- منطقة المشغل بـ `role="button"` مع `tabindex` (-1 عند التعطيل) وتُخرج
  `aria-disabled` عند التعطيل
- عناصر الرفع تحتوي على شريط تقدّم مدمج بـ `role="progressbar"` +
  `aria-valuenow`
- العناصر الفاشلة تعرض نص الخطأ؛ ورسالة الخطأ أسفل القائمة هي `role="alert"`
- زر الحذف يحمل `aria-label` («إزالة» + اسم الملف)

::: tip اختلافات المنصة (الاختلافات عن نسخة Vue3)
- **اختيار الملفات يتم عبر واجهات أصلية**: تستخدم نسخة Vue3 عنصر
  `<input type="file">`، لكن البرنامج المصغر لا يملك File ولا input. يُوحَّد
  الاختيار عبر `chooseLhFiles` في طبقة التكييف (chooseMedia / chooseImage /
  chooseVideo)، ونتيجته مسار ملف مؤقت (`LhUniFile`) وليس File من DOM.
- **لا يُمكن map سوى أنواع الوسائط**: واجهات اختيار uni لا تفهم سوى image /
  video. القواعد `image/*` (أو امتدادات الصور) → اختيار الصور، و`video/*`
  (أو امتدادات الفيديو) → اختيار الفيديو، والمزيج بينهما أو غياب القاعدة →
  وضع chooseMedia المختلط. قواعد الامتداد (مثل `.png`) لا يمكن تمريرها إلى
  لوح الاختيار الأصلية، لذا يطبقها `isFileRejected` بعدها كتحقق احتياطي؛
  أما القواعد غير الخاصة بالوسائط (مثل `.txt`) فلا مقابل لها في البرنامج
  المصغر، فتُ map إلى اختيار الصور ثم يرفضها التحقق الاحتياطي. chooseMedia
  موجود فقط في المكتبة الأساسية 2.10+ من WeChat، وطبقة التكييف تحتوي حارس
  وجود وتتراجع إلى chooseImage / chooseVideo عند عدم التوفر.
- **تستهلك request مقبض LhUniFile لا File من DOM**: `file` في
  `{ file: LhUniFile, onProgress }` مقبض ملف مؤقت. للرفع مباشرة عبر
  `uni.uploadFile` أنشئ request عبر `createLhUploadRequest(action, config)`
  من طبقة التكييف (H5 تستخدم تلقائيًا XHR + FormData لمواءمة الطرفين).
  **يجب تسجيل النطاق الهدف لـ uploadFile في إعدادات «نطاقات الخادم» لدى
  منصة WeChat**، وإلا تُحظر الطلبات على الجهاز الحقيقي؛ H5 لا يخضع لهذا
  القيد.
- **السحب والإفلات حصري على H5**: لا يدعم البرنامج المصغر السحب HTML5،
  فلا يعمل `drag` على MP (تتحول منطقة المشغل إلى رفع بالنقر)، وتُقصَّ
  معالجات السحب بالترجمة الشرطية (لا يوجد كود ميت في حزمة MP).
- **التفعيل بلوحة المفاتيح حصري على H5**: يعمل Enter / Space لفتح الاختيار
  على H5 فقط؛ البرنامج المصغر لا يملك أحداث لوحة المفاتيح.
- **إلغاء الاختيار صامت**: إلغاء أداة الاختيار الأصلية (يحتوي errMsg على
  cancel) لا يكتب رسالة خطأ ولا يُطلق حدث `error`.
- **يظل نطاق API محاذيًا لمصدر plus**: لم تُضَف قدرات لا يملكها plus مثل
  `action` / `headers` / `fileList` / `before-upload`؛ عنوان الرفع وما
  شابه يعيش في دالة request التي يملكها المستخدم. وأُضيف `customClass`
  (تمرير لعزل الأنماط) وفق اصطلاحات هذه الحزمة.
:::
