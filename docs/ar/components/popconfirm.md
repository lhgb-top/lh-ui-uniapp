# Popconfirm (فقاعة التأكيد)

تأكيد ثانٍ خفيف: تُظهر فقاعة تأكيد بجانب المُشغِّل دون الحاجة إلى فتح مربع حوار. الدلالة هي تأكيد حاجز (`role="alertdialog"`): يُعَدّ Escape إلغاءً. يُمرَّر محتوى التأكيد عبر خانة `content` أو خاصية `title`، ويُغلَّف المُشغِّل في الخانة الافتراضية.

## الاستخدام الأساسي

```vue
<template>
  <lh-popconfirm title="هل تريد حذف هذا السجل؟" @confirm="onConfirm" @cancel="onCancel">
    <lh-button type="danger">حذف</lh-button>
  </lh-popconfirm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const action = ref('')
function onConfirm() {
  action.value = 'تم التأكيد'
}
function onCancel() {
  action.value = 'تم الإلغاء'
}
</script>
```

::: warning لا يدعم البرنامج المصغّر دلالات hover / focus
`trigger` الافتراضي هو `click` (متاح في جميع المنصات). `hover` / `focus` صالحان في H5 فقط — في البرنامج المصغّر يتحولان تلقائيًا إلى تبديل بالنقر (النقرة الأولى تفتح، والثانية تغلق).
:::

## ثلاث نبرات

تحدد `type` أيقونة النبرة والفئة المعدِّلة: `info` (معلومات) / `warning` (تحذير، الافتراضي) / `danger` (خطر).

```vue
<template>
  <lh-popconfirm type="info" title="هل تريد عرض سجل الوصول لهذا العنصر؟">
    <lh-button>معلومات</lh-button>
  </lh-popconfirm>
  <lh-popconfirm type="warning" title="سيُبلِغ هذا الإجراء جميع الأعضاء.">
    <lh-button type="warning">تحذير</lh-button>
  </lh-popconfirm>
  <lh-popconfirm type="danger" title="لا يمكن التراجع بعد الحذف.">
    <lh-button type="danger">خطر</lh-button>
  </lh-popconfirm>
</template>
```

## نصوص مخصصة والموضع

```vue
<template>
  <lh-popconfirm
    title="يمكن الاستعادة من سلة المحذوفات بعد الأرشفة."
    confirm-text="أرشفة"
    cancel-text="فكِّر مرة أخرى"
    placement="right"
  >
    <lh-button>نصوص مخصصة</lh-button>
  </lh-popconfirm>

  <!-- مُشغِّل بالتمرير (H5 فقط؛ يتحول إلى تبديل بالنقر في البرنامج المصغّر) -->
  <lh-popconfirm title="مرِّر المؤشر للتأكيد." trigger="hover" :show-after="0" placement="bottom">
    <lh-button>مُشغِّل التمرير</lh-button>
  </lh-popconfirm>
</template>
```

> تأخذ نصوص الأزرار افتراضيًا مفتاحي اللغة `popconfirm.confirm` / `popconfirm.cancel`، ويمكن تجاوزهما بـ `confirm-text` / `cancel-text`.

## التحكم بالظهور والأيقونة

```vue
<template>
  <!-- مُتحكَّم به: يدير الظهورَ بالكامل v-model:visible الخارجي -->
  <lh-popconfirm v-model:visible="pcVisible" trigger="manual" title="فقاعة مُتحكَّم بها">
    <lh-button @click="pcVisible = !pcVisible">{{ pcVisible ? 'إخفاء' : 'إظهار' }}</lh-button>
  </lh-popconfirm>

  <!-- مفتاح الأيقونة ونوع زر التأكيد -->
  <lh-popconfirm title="هل تريد حذف هذا السجل؟" :show-icon="false" confirm-button-type="primary">
    <lh-button type="danger">بلا أيقونة</lh-button>
  </lh-popconfirm>

  <!-- معطَّل -->
  <lh-popconfirm title="هذا الإجراء غير متاح." disabled>
    <lh-button disabled>معطَّل</lh-button>
  </lh-popconfirm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const pcVisible = ref(false)
</script>
```

## Popconfirm API

### Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| type | نبرة التأكيد: `info` / `warning` / `danger` | `'info' \| 'warning' \| 'danger'` | `'warning'` |
| placement | موضع الطبقة (12 موضعًا) | `LhPopconfirmPlacement` | `'top'` |
| trigger | طريقة التشغيل: `click` (كل المنصات) / `hover`، `focus` (H5 فقط، يتحول إلى نقر في MP) / `manual` (متحكَّم به) | `'click' \| 'hover' \| 'focus' \| 'manual'` | `'click'` |
| title | محتوى التأكيد (متاح أيضًا كخانة content) | `string` | — |
| confirmText | نص زر التأكيد (يأخذ مفتاح popconfirm.confirm إذا لم يُمرَّر) | `string` | — |
| cancelText | نص زر الإلغاء (يأخذ مفتاح popconfirm.cancel إذا لم يُمرَّر) | `string` | — |
| confirmButtonType | نوع زر التأكيد | `'default' \| 'primary'` | `'primary'` |
| visible | حالة الظهور المُتحكَّم بها يدويًا (v-model:visible) | `boolean` | — |
| disabled | معطَّل | `boolean` | `false` |
| showIcon | إظهار أيقونة النبرة | `boolean` | `true` |
| popperClass | اسم فئة مخصص للطبقة العائمة | `string` | — |
| showAfter | تأخير الظهور (ms، لـ hover / focus في H5 فقط) | `number` | — |
| hideAfter | تأخير الإخفاء (ms، لـ hover / focus في H5 فقط) | `number` | — |
| themeVars | متغيرات السمة على مستوى المكوّن | `Record<string, string>` | — |
| bgPattern | نمط الخلفية على مستوى المكوّن، يتجاوز إعداد ConfigProvider | `string` | — |
| sx | خصائص التخطيط السريع (تُطبَّق على العنصر الجذر للمُشغِّل) | `LhSxProps` | — |

### Events

| الحدث | الوصف | المعاملات |
| --- | --- | --- |
| confirm | يُطلَق بعد النقر على زر التأكيد | — |
| cancel | يُطلَق بعد النقر على زر الإلغاء أو الضغط على Escape | — |
| update:visible | تغيّر الظهور (v-model) | `(value: boolean)` |
| show | يُطلَق بعد الظهور | — |
| hide | يُطلَق بعد الإخفاء | — |

### Slots

| الخانة | الوصف |
| --- | --- |
| default | محتوى المُشغِّل |
| content | محتوى تأكيد مخصص |

### Methods

| الطريقة | الوصف |
| --- | --- |
| show | إظهار برمجي |
| hide | إخفاء برمجي |
| toggle | تبديل برمجي |

### إمكانية الوصول

- الطبقة العائمة هي `role="alertdialog"` + `aria-modal="true"`؛ يرتبط محتوى التأكيد عبر `aria-labelledby`؛ يحمل المُشغِّل `aria-haspopup` / `aria-expanded` / `aria-controls` (حزمة الخصائص تنتجها دوال نقية من share)
- يُعَدّ Escape إلغاءً (متوافق مع نمط alertdialog في WAI-ARIA: يغلق ويُعَدّ رفضًا)؛ عند تراكب عدة طبقات يغلق Esc العليا فقط (H5 فقط)
- النقر على زر الإلغاء أو القناع الشفاف خارج الأزرار يغلق الفقاعة؛ أيقونة النبرة زخرفية (`aria-hidden`)
- محرك التموضع دالة نقية مكتوبة داخليًا (حماية من الفائض flip / shift) بلا اعتماديات تشغيل من أطراف ثالثة

::: tip فروق المنصة (الفروق عن نسخة Vue3)
- **طرق التشغيل**: لا دلالات hover / focus في البرنامج المصغّر؛ يتحول `trigger="hover"` / `trigger="focus"` في MP إلى تبديل بالنقر/اللمس؛ تأخيرات الظهور والإخفاء (`showAfter` / `hideAfter`) تسري فقط في وضعي hover / focus على H5، بينما يستجيب `click` و`manual` فورًا.
- **حامل الطبقة وتموضعها**: لا خاصية `teleportTarget` — لا يوجد DOM teleport في البرنامج المصغّر، فتحمل الطبقة عبر `root-portal` (مع بديل fixed داخل الصفحة في الإصدارات الأقدم)؛ يتموضع الـ popper بقياس غير متزامن من إطارين (يُعرض مخفيًا للقياس → `computePosition` للتموضع → العرض، لمنع الوميض)، والحساب غير متزامن فلا تفترض نتيجة متزامنة؛ يكتب غراء المكوّن إزاحة السهم من `arrowOffset` في النتيجة إلى `--lh-arrow-offset`.
- **سلوك لوحة المفاتيح في H5 فقط**: Escape = إلغاء عبر مستند على مستوى الوثيقة (يغلق الطبقة العليا فقط عند التراكب)؛ لا أحداث لوحة مفاتيح في البرنامج المصغّر وتُقتطع الشيفرة كلها بالتجميع الشرطي.
- **حصر التركيز غير منقول**: يضع plus التركيز على زر «تأكيد» عند الفتح ويُبقي Tab يدور بين الزرين داخل حصر تركيز (focus-trap) ويعيد التركيز عند الإغلاق؛ لا دلالات تركيز لوحة مفاتيح في MP، فلم يُنقل الإطلاقًا مثل Dialog / Popover في هذا المستودع.
- **لا انتقال للدخول والخروج**: يُحرِّك plus الانتقال بـ `Transition` (`lh-popconfirm-fade`)؛ `Transition` غير موثوق في MP، وكما في tooltip / dropdown / popover لا يُربط انتقال.
- **لا إغلاق تلقائي عند خروج المُشغِّل من نافذة العرض**: لـ `useLhPopper` في plus رد نداء scroll-out؛ لا توجد قناة موحدة لمراقبة التمرير/تغيير الحجم في uni-app، فلم يُنقل.
- **قيمة aria-haspopup**: تُثبِّت plus القيمة `aria-haspopup="dialog"` في قالبها؛ يُنتج هذا المستودع حزمة خصائص المُشغِّل من `getPopconfirmTriggerAria` في share (القيمة `'true'`)، والعقد يتبع الدالة النقية في share.
:::
