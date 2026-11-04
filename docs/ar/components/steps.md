# Steps (شريط الخطوات)

يوجّه المستخدم خلال سير مهمة. يدعم التخطيط الأفقي / العمودي، والأيقونات، والأوصاف، والتنقل بالنقر. مكوّن عرضي بحت يعتمد على الحالات، متاح بالكامل على كل من H5 وبرنامج WeChat المصغر.

## الاستخدام الأساسي

يحدّد `current` فهرس الخطوة الحالية (يبدأ من 0، ويمكن ربطه ثنائي الاتجاه عبر `v-model:current`). الخطوات السابقة هي `finish`، والخطوة الحالية هي `process`، واللاحقة هي `wait`.

```vue
<template>
  <lh-steps :current="current">
    <lh-step
      title="طحن الحبر"
      description="الحبر بخمسة درجات"
    />
    <lh-step
      title="المسودة"
      description="ترتيب التكوين"
    />
    <lh-step
      title="وضع الحبر"
      description="الفرشاة كبنيةٍ أساسية"
    />
    <lh-step
      title="التوقيع"
      description="اللمسة الأخيرة"
    />
  </lh-steps>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const current = ref(1)
</script>
```

## الخطوات العمودية

`direction="vertical"` يبدّل إلى تخطيط عمودي (محكوم بـ CSS، لا اختلاف بين المنصات).

```vue
<template>
  <lh-steps
    :current="1"
    direction="vertical"
  >
    <lh-step
      title="تم استلام الطلب"
      description="2026-10-01 10:00"
    />
    <lh-step
      title="تم استلام الدفع"
      description="2026-10-01 10:05"
    />
    <lh-step
      title="تم الشحن"
      description="التوصيل المتوقع 10-03"
    />
    <lh-step title="تأكيد الاستلام" />
  </lh-steps>
</template>
```

## مع أيقونات

مرّر `icon` إلى `lh-step` لاستخدام أيقونات الخط المدمجة (راجع وثائق Icon للأسماء). بدونه، تعرض حالة `finish` علامة صح و`error` علامة خطأ،بينما تعرض الباقي ترتيبها الرقمي.

```vue
<template>
  <lh-steps :current="1">
    <lh-step
      title="التسجيل"
      icon="user"
    />
    <lh-step
      title="التحقق"
      icon="email"
    />
    <lh-step
      title="تم"
      icon="check"
    />
  </lh-steps>
</template>
```

يوفر slot باسم `icon` بديلاً كاملاً عن القيمة الافتراضية (رسومات أو نصوص مخصصة):

```vue
<template>
  <lh-steps :current="2">
    <lh-step title="الخطوة الأولى">
      <template #icon>
        <text class="step-badge">١</text>
      </template>
    </lh-step>
    <lh-step title="الخطوة الثانية">
      <template #icon>
        <text class="step-badge">٢</text>
      </template>
    </lh-step>
    <lh-step title="الخطوة الثالثة">
      <template #icon>
        <text class="step-badge">٣</text>
      </template>
    </lh-step>
  </lh-steps>
</template>
```

## التنقل بالنقر

مع `clickable`، تُعرض الخطوات في حالة `finish` أو `process` كرأس قابل للنقر، ويُصدر النقر `update:current` (v-model) و`change`. الخطوات اللاحقة في حالة `wait` لا يمكن التنقل إليها.

```vue
<template>
  <lh-steps
    v-model:current="active"
    clickable
  >
    <lh-step title="الخطوة الأولى" />
    <lh-step title="الخطوة الثانية" />
    <lh-step title="الخطوة الثالثة" />
  </lh-steps>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref(1)
</script>
```

## تجاوز الحالة الإجمالي

يحل `status` محل الحالة المشتقّة لجميع الخطوات (`wait` / `process` / `finish` / `error`) لعرض مخصّص.

```vue
<template>
  <lh-steps
    :current="2"
    status="error"
  >
    <lh-step title="الخطوة الأولى" />
    <lh-step title="الخطوة الثانية" />
    <lh-step title="الخطوة الثالثة" />
  </lh-steps>
</template>
```

## خصائص Steps

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| current | فهرس الخطوة الحالية (v-model:current، يبدأ من 0) | `number` | `0` |
| direction | الاتجاه: `'horizontal'` / `'vertical'` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| clickable | إمكانية النقر على الخطوات (المكتملة / الجارية فقط) | `boolean` | `false` |
| status | تحل محل حالة جميع الخطوات (لعرض مخصّص) | `'wait' \| 'process' \| 'finish' \| 'error'` | — |
| customClass | صنف مخصّص (يُمرّر إلى العقدة الجذرية) | `string` | — |
| sx | خصائص تخطيط سريعة | `LhSxProps` | — |

## خصائص Step

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| title | عنوان الخطوة (يعمل slot بعنوان title أيضاً) | `string` | `''` |
| description | وصف الخطوة (يعمل slot باسم description أيضاً) | `string` | `''` |
| icon | اسم أيقونة مخصّصة (بدونه تستخدم finish/error علامة صح/خطأ وغيرها يعرض الرقم الترتيبي) | `LhIconName` | — |
| customClass | صنف مخصّص (يُمرّر إلى العقدة الجذرية للعنصر) | `string` | — |

## الأحداث

| الحدث | الوصف | وسائط الاستدعاء |
| --- | --- | --- |
| update:current | تغيّرت الخطوة الحالية (v-model:current) | `(index: number)` |
| change | التنقل بالنقر على خطوة قابلة للنقر | `(index: number)` |

| Slot | الوصف |
| --- | --- |
| Steps default | عُقد الخطوات (يُجمَع `lh-step` فقط) |
| Step icon | محتوى الدائرة (يحل محل خاصية icon والقيمة الرقمية الافتراضية) |
| Step title | العنوان (يحل محل خاصية title) |
| Step description | الوصف (يحل محل خاصية description) |

## اختلافات المنصات

- **مكوّن عرضي بحت يعتمد على الحالات، متاح بالكامل على H5 وبرنامج WeChat المصغر**؛ التحكم في الاتجاه أفقي/عمودي يتم عبر CSS ومتطابق على المنصتين.
- حُلّ `<ol>/<li>` محل `<view>` (يحظر WXSS محددات الوسوم)؛ الروؤس القابلة للنقر تستخدم `view` + `role="button"` (لأن `<button>` في البرنامج المصغر يحمل أنماطاً أصلية لا يمكن إعادة ضبطها). تأتي الأسماء الدلالية من مفاتيح `steps.step` / `steps.finish` / `steps.error` في حزم اللغات الخاصة بـ share (تسع لغات كاملة، دون الاحتفاظ بنسخة في هذا المستودع).
- **آلية «الخطوة الأخيرة لا ترسم خطاً واصلاً» تختلف بين المنصتين**: في مصدر تعتمد الخطوط الواصلة (أفقية `::after` / عمودية `::before`) على المحدد البنيوي `:not(:last-child)` لتجاوز العنصر الأخير؛ WXSS لا يدعم `:not()`، لذا تزيله مرحلة البناء (يرسم كل عنصر الخط الواصل)، ويُفوَّض إخفاء العنصر الأخير / نهاية السطر إلى الصنف `--line-last`:
  - أفقي: منطق قياس التفاف الأسطر هو نفسه في نسخة Vue 3 (`getStepsLineLastIndices`)، لكن القياس يمر عبر المحوّل `getLhRect` (يستخدم H5 استعلامات document، بينما يستخدم MP `createSelectorQuery` غير المتزامن الذي يجب تشغيله بعد onMounted).
  - عمودي: لا يكون هناك التفاف، لذا يُعلَّم العنصر الأخير مباشرة، ويضيف SFC الخاص بالمكوّن قاعدة تكيّف uni-app واحدة لإخفاء `--line-last::before` (لا توجد مثل هذه القاعدة في مصدر share).
- **إعادة حساب الالتفاف عند تغيّر عرض الحاوية هي H5 فقط**: يستخدم H5 `ResizeObserver`؛ ليس لدى MP مثل هذا الAPI، كما أن إضافة/حذف الخطوات وتبديل الاتجاه يعيدان الحساب دائماً، أما تغيّر الأحجام ديناميكياً فيتطلب إعادة الدخول إلى الصفحة (انهيار مقبول يبقي حزمة MX خالية من الشيفرة الميتة).
- **قرار النقل (موازٍ لنسخة Vue 3، دون اختراع أي API)**: وقت النقل لم يوفّر مصدر plus وضع `simple`، ولا الحالات المخصّصة `process-status` / `finish-status`، ولا تباعد `space` وما شابه (خصائص المصدر هي `current` / `direction` / `clickable` / `status` / `themeVars` / `sx`)، ولن توفّرها هذه المكتبة أيضاً. كما لا يشمل `themeVars` (قائمة `componentTheme` الخاصة بـ ConfigProvider في هذا المستودع لا تزال لا تشمل steps). وستُتبع بمجرد إضافتها إلى المصدر.
