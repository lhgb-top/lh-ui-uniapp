# Message (رسالة)

خدمة الرسائل الفورية العامة. **تعتمد نمط نقطة التركيب** — لا يستطيع البرنامج المصغر إنشاء DOM عبر JS،
فلابد من وجود مكوّن نقطة التركيب في الصفحة أولًا.

## وضع نقطة التركيب

ضعها مرة واحدة في الصفحات التي تحتاج رسائل فورية (أو في مكوّن جذر دائم):

```vue
<template>
  <lh-config-provider>
    <view><!-- محتوى الصفحة --></view>
    <lh-message />
  </lh-config-provider>
</template>
```

## الاستدعاء

```ts
import { useLhMessage } from '@lh-ui/uniapp'

const message = useLhMessage()

message.success('تم الحفظ بنجاح')
message.info('رسالة معلومات')
message.warning('رسالة تحذير')
message.danger('رسالة خطأ')
message.error('رسالة خطأ (مرادف danger)')

// رسالة تحميل لا تُغلق تلقائيًا (duration: 0)، تُغلق يدويًا
const handle = message.loading('جارٍ التحميل...')
// ... بعد اكتمال العملية غير المتزامنة
handle.close()

// إغلاق الكل
message.closeAll()
```

::: danger بدون نقطة تركيب يُعطى تحذير
إذا استدعيت `useLhMessage()` دون وجود `<lh-message />` في الصفحة، فسيُصدر `console.error` تحذيرًا
صريحًا في وقت التطوير، **دون تخفيض صامت**. هذا تصميم مقصود: فالتخفيض الصامت يحوّل «الاستدعاء الذي
يبدو ناجحًا، لكن دون أي استجابة» إلى خطأ خفي.
:::

## الدوال

| الدالة | الوصف | المعاملات |
| --- | --- | --- |
| (النداء المباشر) | `message('xxx')` يكافئ `message.info('xxx')` | `(options: LhMessageOptions \| string)` |
| success / info / warning / danger / error | يُظهر رسالة من النوع المقابل | `(content: string, options?: Partial<LhMessageOptions>)` |
| loading | يُظهر رسالة تحميل لا تُغلق تلقائيًا (`duration: 0`)، ويُرجع handle للإغلاق اليدوي | نفس ما سبق |
| close | يُغلق الرسالة ذات المعرّف id | `(id: number)` |
| closeAll | يُغلق الكل | — |

## LhMessageOptions

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| content | النص (مطلوب) | `string` | — |
| type | النوع | `'success' \| 'info' \| 'warning' \| 'danger' \| 'loading'` | `'info'` |
| duration | مدة العرض (بالملي ثانية)، 0 يعني عدم الإغلاق التلقائي | `number` | `3000` |
| showClose | إظهار زر الإغلاق | `boolean` | `false` |
| offset | الإزاحة عن الأعلى (px) | `number` | — |
| onClose | استدعاء الإغلاق | `() => void` | — |

## الإعداد العام

```ts
const message = useLhMessage()
message.config({ duration: 2000, max: 5, offset: 20 })
```

| الإعداد | الوصف | الافتراضي |
| --- | --- | --- |
| duration | مدة العرض الافتراضية (بالملي ثانية) | `3000` |
| max | أقصى عدد للرسائل في الشاشة الواحدة | — |
| offset | الإزاحة عن الأعلى | — |

::: tip الفروق عن نسخة Vue3
- **لا يوجد `appendTo`**: في الويب يُركَّب على `document.body` وهذا المفهوم غير موجود في البرنامج
  المصغر، فيحدّد موضع التركيب مكان `<lh-message />` داخل الصفحة.
- تُحاذاة مدة حركتي الدخول والخروج عبر CSS transition + setTimeout (`transitionend` غير موثوق في
  البرنامج المصغر).
- لاحتياجات الإشعارات استخدم خدمة Notification (انظر مجموعة «الخدمات»).
:::
