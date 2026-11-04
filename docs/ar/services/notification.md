# Notification

خدمة إشعارات عالمية. تعرض بطاقات بعنوان ومحتوى في زوايا نافذة العرض، وتُستخدم عادةً للتغذية الراجعة عن النتائج التي تحتاج إلى انتباه المستخدم. مثل Message / Loading، تعتمد **نمط نقطة التركيب**——لا يمكن للبرنامج المصغر إنشاء DOM عبر JS، لذا يجب وضع مكوّن نقطة التركيب في الصفحة أولاً.

## وضع نقطة التركيب

ضعها مرة واحدة في الصفحات التي تحتاج إلى إشعارات (أو في مكوّن جذر دائم يغلف الصفحات):

```vue
<template>
  <lh-config-provider>
    <view><!-- محتوى الصفحة --></view>
    <lh-notification />
  </lh-config-provider>
</template>
```

::: danger غياب نقطة التركيب يطلق تحذيرًا
إذا استدعيت `useLhNotification()` لكن الصفحة لا تحتوي على `<lh-notification />`، فسيصدر تحذير صريح عبر `console.error` أثناء التطوير، **ولن يحدث تدهور صامت**. مثل Message: التدهور الصامت يحوّل «يبدو أن الاستدعاء نجح لكن لا يحدث شيء» إلى خطأ خفي.
:::

## الاستدعاء

```ts
import { useLhNotification } from '@lh-ui/uniapp'

const notification = useLhNotification()

notification.success({ title: 'إشعار نجاح', content: 'تمت كتابة المستند في السحابة' })
notification.info({ title: 'إشعار معلومات' })
notification.warning({ title: 'إشعار تحذير' })
notification.danger({ title: 'إشعار خطر' })

// كل زاوية حاوية مستقلة
notification.info({ title: 'أعلى اليسار', position: 'top-left' })

// بدون إغلاق تلقائي، الإغلاق يدوي
const handle = notification.warning({ title: 'تحذير دائم', duration: 0 })
handle.close()

// إغلاق الكل
notification.closeAll()
```

## الدوال

| الدالة | الوصف | المعاملات |
| --- | --- | --- |
| (استدعاء مباشر) | `notification(options)` تفتح إشعارًا | `(options: LhNotificationOptions)` |
| success / info / warning / danger | تفتح إشعارًا بالنوع الدلالي المقابل | `(options: LhNotificationOptions)` |
| close | تغلق الإشعار بالمعرّف المحدد | `(id: number)` |
| closeAll | تغلق الكل | — |
| config | تغيّر الإعدادات الافتراضية العامة | `(config: LhNotificationConfig)` |

## LhNotificationOptions

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| title | العنوان (إلزامي) | `string` | — |
| content | محتوى المتن | `string` | — |
| type | النوع الدلالي | `'success' \| 'info' \| 'warning' \| 'danger' \| 'error'` | `'info'` |
| duration | المللي ثانية قبل الإغلاق التلقائي؛ 0 تعني بلا إغلاق تلقائي | `number` | `4500` |
| position | موضع الظهور | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` |
| showClose | إظهار زر الإغلاق | `boolean` | `true` |
| sx | خصائص التنسيق السريع sx | `LhSxProps` | — |
| onClick | استدعاء النقر على البطاقة (تُعرض البطاقة بدلالة زر) | `() => void` | — |
| onClose | استدعاء بعد الإغلاق (تلقائيًا أو يدويًا) | `() => void` | — |

::: tip النوع error
`error` هو دلالة بديلة لـ `danger` (`LhNotificationType` في share core يتضمنه). دوال الخدمة تعرض success / info / warning / danger فقط، مطابقةً لـ plus؛ عند الحاجة إلى error استدعِ مباشرةً `notification({ title: '...', type: 'error' })`.
:::

## الإعدادات العامة

```ts
const notification = useLhNotification()
notification.config({ duration: 3000, offset: 24 })
```

| الإعداد | الوصف | الافتراضي |
| --- | --- | --- |
| duration | مدة الإغلاق التلقائي الافتراضية بالمللي ثانية؛ 0 تعني بلا إغلاق تلقائي | `4500` |
| offset | الإزاحة من حافة نافذة العرض (px) | `20` |

## سلوك المكوّن

- **أربع حاويات مستقلة للزوايا**: تُجمّع السجلات حسب `position` وتُكدّس زمنيًا داخل كل زاوية (الزاويان السفليان تستخدمان `column-reverse` فتلتصق الإشعارات الجديدة بالحافة السفلية)؛ تتحكم فجوة التكدس في متغير الأنماط `--lh-notification-gap` (16px افتراضيًا).
- **الإغلاق التلقائي**: يُزال الإشعار تلقائيًا بعد `duration` مللي ثانية ويُطلق `onClose`؛ و`duration: 0` تعني البقاء الدائم.
- **النقر على البطاقة**: لا يغلقها (مطابق لـ plus) بل يُطلق `onClick` فقط؛ الإغلاق يتم عبر زر الإغلاق أو المؤقّت التلقائي فقط.
- **إمكانية الوصول**: حاويات الزوايا تحمل `role="region"` + `aria-live="polite"`؛ والبطاقات ذات `onClick` تُعرض بـ `role="button"`؛ وزر الإغلاق يحمل الاسم الودود من مفتاح حزمة اللغة `notification.close` (مضمّن في حزم لغات share، ويُحدّث تلقائيًا عند تبديل اللغة).

## فروق المنصة (مقارنة بنسخة Vue3)

- **نمط نقطة التركيب**: يركّب plus المضيف في `document.body` عبر `createApp`؛ والبرنامج المصغر لا يملك `document`، لذا نعتمد «مخزن أحادي على مستوى الوحدة + مكوّن نقطة تركيب `<lh-notification />` في الصفحة»، مع كشف الواجهة عبر `useLhNotification()` (في plus استدعاء مباشر لـ `LhNotification` + تسجيل عبر install).
- **لا يوجد `appendTo`**: نسخة الويب تتيح اختيار حاوية التركيب؛ والبرنامج المصغر لا يملك هذا المفهوم، ويحدد الموضع حاويات الزوايا الثابتة التي يرسمها مكوّن نقطة التركيب.
- **تدهور حركات الدخول/الخروج**: يستخدم plus `TransitionGroup` للانزلاق / إعادة التموضع FLIP؛ و`transitionend` غير موثوق في البرنامج المصغر، لذا في الإصدار الأول تُضاف العقد وتُزال بلا حركة (أسماء أصناف الانتقال باقية في مصدر الأنماط ويمكن لإعادة استخدامها في H5 تغليف Transition ذاتي).
- **دلالة لوحة المفاتيح للبطاقات القابلة للنقر غير منقولة**: يضيف plus `tabindex` وتشغيل Enter / Space للبطاقات ذات `onClick`؛ والبرنامج المصغر لا يملك نموذج تركيز DOM، فتبقى النقر ودلالة `role="button"` فقط.
