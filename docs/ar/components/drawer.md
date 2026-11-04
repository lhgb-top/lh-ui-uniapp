# Drawer (لوحة منزلقة)

لوحة تنزلق من حافة الشاشة، مناسبة للمهام المؤقتة التي تحتاج مساحة أوسع من Dialog (التفاصيل، التصفية، خطوات المعالج). مثل Dialog تستخدم `role="dialog"` + `aria-modal="true"`، ويمكن إغلاقها بنقرة القناع أو Esc (H5).

## الاستخدام الأساسي

```vue
<template>
  <lh-button @click="visible = true">فتح الدرج</lh-button>

  <lh-drawer v-model="visible" title="تفاصيل الطلب">
    <view>ضع هنا محتوى متن الدرج.</view>
    <view>يتحكم size في عرض اللوحة، والافتراضي 30% من عرض منفذ العرض.</view>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
</script>
```

## أربعة اتجاهات

`direction` يقبل `right` (الافتراضي) / `left` / `top` / `bottom`، وتنزلق اللوحة من الحافة المقابلة.

```vue
<template>
  <!-- فتح الدرج الأيمن -->
  <lh-button @click="openDir('right')">right</lh-button>
  <!-- فتح الدرج الأيسر -->
  <lh-button @click="openDir('left')">left</lh-button>
  <!-- فتح الدرج العلوي -->
  <lh-button @click="openDir('top')">top</lh-button>
  <!-- فتح الدرج السفلي -->
  <lh-button @click="openDir('bottom')">bottom</lh-button>

  <!-- ينزلق في الاتجاه المحدد -->
  <lh-drawer v-model="dirVisible" :title="`درج ${direction}`" :direction="direction" size="40%">
    <view>الاتجاه الحالي: {{ direction }}</view>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhDrawerDirection } from '@lh-ui/uniapp'

const dirVisible = ref(false)
const direction = ref<LhDrawerDirection>('right')
function openDir(d: LhDrawerDirection) {
  direction.value = d
  dirVisible.value = true
}
</script>
```

## حجم مخصص

`size` الرقمي بالبكسل، والنصوص تدعم النسب المئوية (مثل `'40%'`). الاتجاهات الأفقية تطبقه على العرض والعمودية على الارتفاع.

```vue
<template>
  <!-- فتح درج بعرض 480px -->
  <lh-button @click="sized = true">درج بعرض 480px</lh-button>

  <!-- درج بحجم ثابت مع شريط إجراءات سفلي -->
  <lh-drawer v-model="sized" title="شروط التصفية" :size="480">
    <view>صفِّ البيانات حسب الاسم أو الوسم.</view>
    <template #footer>
      <lh-button @click="sized = false">إلغاء</lh-button>
      <lh-button type="primary" @click="sized = false">تطبيق التصفية</lh-button>
    </template>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const sized = ref(false)
</script>
```

## مفاتيح السلوك

يتحكم `mask-closable` في الإغلاق بنقرة القناع، و`show-close` في زر الإغلاق أعلى اليمين، و`close-on-esc` في الإغلاق بـ Esc (H5 فقط)، و`lock-scroll` في تثبيت تمرير الصفحة أثناء الفتح (H5 فقط).

```vue
<template>
  <!-- فتح درج «يُغلق بالزر فقط» -->
  <lh-button @click="locked = true">يُغلق بالزر فقط</lh-button>

  <!-- نقرات القناع وEsc لا تغلقانه؛ الزر فقط -->
  <lh-drawer
    v-model="locked"
    title="يُغلق بالزر فقط"
    :mask-closable="false"
    :show-close="false"
    :close-on-esc="false"
  >
    <view>لا تغلقه نقرات القناع ولا Esc (H5).</view>
    <template #footer>
      <lh-button type="primary" @click="locked = false">إغلاق</lh-button>
    </template>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const locked = ref(false)
</script>
```

## Drawer API

### Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| modelValue (v-model) | هل يظهر | `boolean` | `false` |
| title | العنوان (أو استخدم فتحة header) | `string` | — |
| direction | الاتجاه | `'right' \| 'left' \| 'top' \| 'bottom'` | `'right'` |
| size | الحجم: الأرقام بالبكسل، والنصوص تدعم النسب | `string \| number` | `'30%'` |
| maskClosable | الإغلاق عند نقر القناع | `boolean` | `true` |
| showClose | إظهار زر الإغلاق | `boolean` | `true` |
| lockScroll | تثبيت تمرير الصفحة أثناء الفتح (**H5 فقط**) | `boolean` | `true` |
| closeOnEsc | الاستجابة لـ Esc (**H5 فقط**) | `boolean` | `true` |
| customClass | اسم فئة مخصص (يُمرر إلى العقدة الجذرية) | `string` | — |
| themeVars | متغيرات السمة على مستوى المكوّن | `Record<string, string>` | — |
| bgPattern | نمط الخلفية على مستوى المكوّن، يتجاوز إعداد ConfigProvider | `string` | — |
| sx | خصائص التنسيق السريع sx (تطبق على اللوحة) | `LhSxProps` | — |

### Events

| الحدث | الوصف | المعاملات |
| --- | --- | --- |
| update:modelValue | تغيّرت حالة الظهور (بعد الانتهاء من الحركة) | `(visible: boolean)` |
| open | فُتح | — |
| close | أُغلق (بعد الانتهاء من الحركة) | — |

### Slots

| الفتحة | الوصف |
| --- | --- |
| default | محتوى المتن |
| header | منطقة عنوان الرأس المخصصة (تستبدل نص العنوان) |
| footer | شريط الإجراءات السفلي |

### Methods

| الطريقة | الوصف |
| --- | --- |
| open | فتح برمجي |
| close | إغلاق برمجي |

### إمكانية الوصول

- العقدة الجذرية `role="dialog"` + `aria-modal="true"`؛ مع عنوان يرتبط عبر `aria-labelledby`، وبدونه يُستخدم `drawer.title` من حزمة اللغة كـ `aria-label` احتياطي
- القناع عقدة زخرفية (`aria-hidden="true"`)
- زر الإغلاق يحمل `role="button"` و`aria-label` من حزمة اللغة `drawer.close`
- الإغلاق بـ Esc (يمكن تعطيله بـ `close-on-esc`، H5 فقط)

::: tip فروق المنصة (الفروق عن نسخة Vue3)
- **حامل الطبقة العائمة**: لا توجد خاصية `teleportTarget` — التطبيق المصغر بلا DOM teleport، فتحمل الطبقة العائمة عبر `root-portal` (وفي H5 teleport). **في WeChat يتطلب `root-portal` مكتبة أساس ≥ 2.25.2**؛ الإصدارات الأقدم تتراجع تلقائيًا إلى `fixed` داخل الصفحة (تبقى داخل شجرة عقد الصفحة، لكن التراكب ما زال مضمونًا بزيادة z-index التلقائية، فلا يتأثر السلوك).
- **حركة الدخول والخروج**: يشغّل plus انزلاق الحركة عبر `<Transition name="lh-drawer-fade">`؛ أما التطبيق المصغر فلا يملك مكوّن `<Transition>` وحدث `transitionend` غير موثوق، لذا يعيد هذا التنفيذ تسلسل فئات Vue Transition يدويًا (إزالة حالة البداية بعد إطار → الحالة النشطة → فك التركيب عند الانتهاء) ويوائم مدة 300ms من SCSS الخاص بـ share عبر `setTimeout` — القناع يتلاشى واللوحة تنزلق حسب الاتجاه، بمظهر واحد على الطرفين.
- **حصر التركيز (focus-trap): دلالات تركيز لوحة المفاتيح في H5 فقط، وغير مُطبّق هنا**: يحبس plus تسلسل Tab داخل اللوحة أثناء الفتح؛ التطبيق المصغر لا يملك دلالات تركيز لوحة المفاتيح (تُقتطع shouldDrawerTrapFocus في share بحارس التجميع LH_IS_H5)، ومثل Dialog لا يستدعي هذا التنفيذ focus-trap من share — يبقى الإغلاق بـ Esc فقط.
- **lockScroll يعمل في H5 فقط**: التطبيق المصغر لا يستطيع تثبيت تمرير body؛ القناع كامل الشاشة الذي يعترض النقرات هو البديل.
- **closeOnEsc يعمل في H5 فقط**: Esc عبر مستمع لوحة مفاتيح على مستوى المستند، وعند تراكب عدة طبقات يستجيب الأعلى فقط؛ التطبيق المصغر بلا أحداث لوحة مفاتيح ويُقتطع الجزء كله بالتجميع الشرطي.
- **teleportTarget غير منفّذ**: التزامًا بسابقة select / tooltip / dropdown (لا DOM teleport في التطبيقات المصغرة).
- **المنطقة الآمنة للدرج السفلي**: مع `direction="bottom"` تضيف اللوحة تلقائيًا حاشية `env(safe-area-inset-bottom)` لأجهزة الشاشة الكاملة (تخصيص خاص بـ uni-app؛ مصدر أنماط share لا يحتوي هذا التخصص).
:::
