# Popover (نافذة منبثقة)

نافذة منبثقة بمحتوى غني: تحمل معلومات أكثر من Tooltip (عنوان، متن، عقد تفاعلية). يُغلَّف المشغِّل داخل الفتحة الافتراضية ويُمرَّر محتوى النافذة عبر فتحة `content`؛ الطبقة المنبثقة هي `role="dialog"` مع سهم يشير دائمًا إلى المشغِّل.

## الاستخدام الأساسي

```vue
<template>
  <lh-popover title="تلميح الحبر" placement="top">
    <lh-button>انقر للإظهار</lh-button>
    <template #content>
      <text>هذا محتوى غني ويمكن وضع أي عقدة فيه.</text>
    </template>
  </lh-popover>
</template>
```

::: warning لا تدعم البرامج المصغرة دلالات hover / focus
`trigger` هي `click` افتراضيًا (متاحة في جميع المنصات). `hover` / `focus` صالحتان في H5 فقط — في البرنامج المصغر تتحولان تلقائيًا إلى تبديل بالنقر / اللمس (النقر الأول يفتح والثاني يغلق).
:::

## طرق التشغيل

```vue
<template>
  <!-- تشغيل بالتمرير (H5 فقط؛ تتحول إلى تبديل بالنقر في البرنامج المصغر) -->
  <lh-popover trigger="hover" title="تشغيل بالتمرير">
    <lh-button>مرر فوقي</lh-button>
    <template #content><text>تحريك المؤشر إلى الطبقة المنبثقة لا يغلقها.</text></template>
  </lh-popover>

  <!-- تشغيل بالتركيز (H5 فقط) -->
  <lh-popover trigger="focus" title="تشغيل بالتركيز">
    <lh-input placeholder="ركّز على حقل الإدخال" />
    <template #content><text>يظهر عندما يحصل حقل الإدخال على التركيز.</text></template>
  </lh-popover>

  <!-- يدوي: تُدار حالة الظهور بالكامل عبر v-model:visible الخارجي -->
  <lh-popover v-model:visible="manualVisible" trigger="manual" title="تحكم يدوي">
    <lh-button @click="manualVisible = !manualVisible">مفتاح خارجي</lh-button>
    <template #content><text>تُدار حالة الظهور بالكامل من الحالة الخارجية.</text></template>
  </lh-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const manualVisible = ref(false)
</script>
```

> التأخيرات `showAfter` / `hideAfter` تنطبق فقط على hover / focus (H5)؛ أما `click` و`manual` فتستجيبان فورًا.

## اثنا عشر موضعًا

```vue
<template>
  <lh-popover
    v-for="p in placements"
    :key="p"
    :placement="p"
    :title="p"
  >
    <lh-button size="small">{{ p }}</lh-button>
    <template #content><text>الموضع: {{ p }}</text></template>
  </lh-popover>
</template>

<script setup lang="ts">
const placements = [
  'top', 'top-start', 'top-end',
  'bottom', 'bottom-start', 'bottom-end',
  'left', 'left-start', 'left-end',
  'right', 'right-start', 'right-end',
] as const
</script>
```

> عند نقص مساحة منفذ العرض تنقلب الطبقة المنبثقة تلقائيًا (flip) وتُحصر مجددًا على المحور المتقاطع (shift)، ويتغير موضع السهم تبعًا لذلك.

## العرض والسهم والتعطيل

```vue
<template>
  <!-- عرض ثابت -->
  <lh-popover title="عرض ثابت" width="240">
    <lh-button>عرض ثابت</lh-button>
    <template #content><text>يُحدَّد عرض الطبقة المنبثقة عبر width.</text></template>
  </lh-popover>

  <!-- بلا سهم -->
  <lh-popover title="بلا سهم" :arrow="false">
    <lh-button>بلا سهم</lh-button>
    <template #content><text>عندما تكون arrow هي false لا يُرسم سهم.</text></template>
  </lh-popover>

  <!-- معطّل -->
  <lh-popover title="معطّل" disabled>
    <lh-button disabled>مشغِّل معطّل</lh-button>
    <template #content><text>عند التمكين من disabled لا يستجيب المشغِّل ولا الطبقة المنبثقة.</text></template>
  </lh-popover>
</template>
```

## Popover API

### Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| placement | موضع الطبقة (12 موضعًا) | `LhPopoverPlacement` | `'top'` |
| trigger | طريقة التشغيل: `click` (كل المنصات) / `hover`, `focus` (H5 فقط، تتحول إلى نقر في MP) / `manual` (مُدار) | `'click' \| 'hover' \| 'focus' \| 'manual'` | `'click'` |
| title | العنوان (متاح أيضًا كفتحة title) | `string` | — |
| visible | حالة الظهور المُدارة يدويًا (v-model:visible) | `boolean` | — |
| disabled | معطّل | `boolean` | `false` |
| arrow | إظهار السهم | `boolean` | `true` |
| width | عرض الطبقة المنبثقة (الأرقام بالبكسل) | `string \| number` | — |
| popperClass | اسم فئة مخصص للطبقة المنبثقة | `string` | — |
| showAfter | تأخير الإظهار (ms، لـ hover / focus في H5 فقط) | `number` | — |
| hideAfter | تأخير الإخفاء (ms، لـ hover / focus في H5 فقط) | `number` | — |
| themeVars | متغيرات السمة على مستوى المكوّن | `Record<string, string>` | — |
| bgPattern | نمط الخلفية على مستوى المكوّن، يتجاوز إعداد ConfigProvider | `string` | — |
| sx | خصائص التخطيط السريع sx (تُطبَّق على العنصر الجذر للمشغِّل) | `LhSxProps` | — |

### Events

| الحدث | الوصف | المعاملات |
| --- | --- | --- |
| update:visible | تغيّر حالة الظهور (v-model) | `(value: boolean)` |
| show | يُطلق بعد الإظهار | — |
| hide | يُطلق بعد الإخفاء | — |

### Slots

| الفتحة | الوصف |
| --- | --- |
| default | محتوى المشغِّل |
| title | عنوان مخصص |
| content | المحتوى المنبثق |

### Methods

| الطريقة | الوصف |
| --- | --- |
| show | إظهار برمجيًا |
| hide | إخفاء برمجيًا |
| toggle | تبديل برمجيًا |

### إمكانية الوصول

- يحمل المشغِّل `aria-haspopup="true"` مع `aria-expanded` / `aria-controls`؛ الطبقة المنبثقة هي `role="dialog"` وعند وجود عنوان ترتبط عبر `aria-labelledby`
- يغلق بـ Esc وبالنقر خارج الطبقة المنبثقة (قناع شفاف داخل الصفحة)؛ عند تراكب عدة طبقات يغلق Esc الأعلى فقط (كل ذلك في H5 فقط)
- محرك التموضع دالة نقية مكتوبة داخليًا (حماية من الفائض flip / shift) دون أي اعتماديات تشغيل خارجية

::: tip فروق المنصات (الفروق عن نسخة Vue3)
- **طرق التشغيل**: لا تدعم البرامج المصغرة دلالات hover / focus، لذا تتحول `trigger="hover"` / `trigger="focus"` إلى تبديل بالنقر / اللمس في MP؛ تأخيرات الظهور / الإخفاء (`showAfter` / `hideAfter`) تنطبق فقط على وضعي hover / focus في H5، بينما تستجيب `click` و`manual` فورًا.
- **حامل الطبقة وتموضعها**: لا توجد خاصية `teleportTarget` — لا يوجد DOM teleport في البرامج المصغرة، فتُحمل الطبقة عبر `root-portal` (مع بديل ثابت داخل الصفحة في الإصدارات الأقدم)؛ يتم تموضع popper بقياس غير متزامن من إطارين (الرسم مخفيًا لقياس الأبعاد → `computePosition` للتموضع → الإظهار، منعًا للوميض)، والحساب غير متزامن فلا تفترض نتيجة متزامنة. يكتب صِلَاق المكوّن إزاحة السهم من `arrowOffset` للنتيجة في `--lh-arrow-offset`.
- **سلوك لوحة المفاتيح في H5 فقط**: الإغلاق بـ Esc يستخدم مستمعًا على مستوى المستند (يغلق الطبقة العليا فقط عند التراكب)؛ لا أحداث لوحة مفاتيح في البرامج المصغرة وتُقتطع هذه القطعة بالكامل عبر الترجمة الشرطية.
- **حصر التركيز غير منقول**: يُغلق تشغيل النقر في plus التركيز داخل الطبقة (focus-trap) ويعيده عند الإغلاق؛ لا دلالات تركيز لوحة مفاتيح في MP، وهو كـ Dialog في هذا المستودع غير منقول إطلاقًا.
- **لا انتقال للدخول/الخروج**: يحرّك plus الظهور بتلاشٍ عبر `Transition`؛ لكن `Transition` غير موثوقة في MP، وكما في tooltip / dropdown لا تُربط انتقالات.
- **لا إغلاق تلقائي عند خروج المشغِّل من منفذ العرض**: لدى `useLhPopper` في plus استدعاء scroll-out؛ لا يوجد في uni-app قناة موحدة لمراقبة التمرير / تغيّر الأبعاد، فلم يُنقل.
:::
