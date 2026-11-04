# Collapse (لوحة قابلة للطي)

اطوِ ووسّع كتل المحتوى. يمكن للمحات التعايش أو العمل في وضع الأكورديون (واحد مفتوح فقط في كل مرة).

## الاستخدام الأساسي

بدون `v-model` يكون المكوّن غير مُتحكَّم به: يدير حالة التوسيع بنفسه، وعند النقر على شريط العنوان تبدّل الحالة، ويحمل حدث `change` أحدث اللوحات الموسّعة.

```vue
<template>
  <lh-collapse>
    <lh-collapse-item
      name="a"
      title="الاتساق والتنوع"
    >
      الحفاظ على مظهر وتفاعل متسق مع بقية الصفحة.
    </lh-collapse-item>
    <lh-collapse-item
      name="b"
      title="التغذية الراجعة"
    >
      تقديم تغذية راجعة واضحة وفي وقتها بعد كل عملية.
    </lh-collapse-item>
  </lh-collapse>
</template>
```

## الأكورديون

في وضع `accordion` يكون لواح واحد مفتوح على الأكثر في كل مرة؛ والنقر مرة أخرى على لوح مفتوح يطوي الكل.

```vue
<template>
  <lh-collapse accordion>
    <lh-collapse-item
      name="a"
      title="واحد فقط مفتوح"
    >
      لواح واحد مفتوح على الأكثر في كل مرة.
    </lh-collapse-item>
    <lh-collapse-item
      name="b"
      title="انقر مجددًا للطي"
    >
      يمكن طي الكل.
    </lh-collapse-item>
  </lh-collapse>
</template>
```

## v-model مُتحكَّم به ومحجوب

اربط اللوحات الموسّعة عبر `v-model` (قيمة مفردة أو مصفوفة؛ في وضع الأكورديون غالبًا قيمة مفردة)؛ ويعطّل `disabled` لوحًا واحدًا.

```vue
<template>
  <lh-collapse v-model="activeNames">
    <lh-collapse-item
      name="a"
      title="اللوح A"
    >
      محتوى مُتحكَّم به A
    </lh-collapse-item>
    <lh-collapse-item
      name="b"
      title="اللوح B (معطّل)"
      disabled
    >
      محتوى معطّل
    </lh-collapse-item>
    <lh-collapse-item
      name="c"
      title="اللوح C"
    >
      محتوى مُتحكَّم به C
    </lh-collapse-item>
  </lh-collapse>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const activeNames = ref(['a'])
</script>
```

## Collapse Props

| Prop | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| modelValue | اللوحات النشطة (v-model مُتحكَّم به، قيمة مفردة أو مصفوفة) | `LhCollapseKey \| LhCollapseKey[]` | — |
| accordion | وضع الأكورديون: لواح واحد مفتوح فقط في كل مرة | `boolean` | `false` |
| customClass | صنف مخصّص (يُطبَّق على العقدة الجذرية) | `string` | — |
| sx | خصائص تخطيط سريعة | `LhSxProps` | — |

## CollapseItem Props

| Prop | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| name | معرّف اللوح الفريد (مطلوب) | `string \| number` | — |
| title | العنوان (يتوفّر أيضًا slot باسم title) | `string` | — |
| disabled | ما إذا كان اللوح معطّلاً | `boolean` | `false` |
| customClass | صنف مخصّص (يُطبَّق على العقدة الجذرية للعنصر) | `string` | — |
| sx | خصائص تخطيط سريعة | `LhSxProps` | — |

## الأحداث

| Event | الوصف | وسائط الاستدعاء |
| --- | --- | --- |
| update:modelValue | تغيّر اللوحات الموسّعة (v-model مُتحكَّم به؛ لا يحتفظ المكوّن بحالة داخلية) | `(value: LhCollapseKey \| LhCollapseKey[])` |
| change | تغيّر اللوحات الموسّعة (غير مُتحكَّم به؛ قيمة مفردة في الأكورديون، `undefined` عند طي الكل) | `(value: LhCollapseKey \| LhCollapseKey[])` |

## Slots

| Slot | الوصف |
| --- | --- |
| Collapse default | عقد عناصر اللوحات (`lh-collapse-item`) |
| CollapseItem default | محتوى اللوح |
| CollapseItem title | عنوان اللوح (يتجاوز خاصية `title`) |

## فروقات المنصة

- **حركات الطي / التوسيع هي CSS خالص**: يتنقّل `grid-template-rows` بين `0fr / 1fr` وتدور السهم عبر `transform`، ولا شيء يستمع إلى `transitionend` (غير موثوق في برنامج WeChat المصغّر، لذا لا تعتمد عليه هذه المكتبة إطلاقًا). تبدّل الصنف يستقر فورًا: حتى لو لم يدعم محرك تصيير ما انتقالات grid، تظل حالة التوسيع النهائية صحيحة ويفقد فقط الحركة.
- **يُعرض المحتوى دائمًا** (دون اختصار عبر `v-if`): يُظهر `lh-collapse__wrap` عبر الصنف `--active`. إن احتجت عرض المحتوى عند التوسيع فقط، تحكَّم به بنفسك باستخدام `v-if` في جهة المحتوى.
- `<h3>` / `<button>` كلها مستبدلة بـ `<view>` / `<text>` (WXSS يمنع محددات الوسوم)؛ والتعطيل لا يعتمد على `<button disabled>` أصلي، بل يُعبَّر عنه عبر حارس النقر + الصنف `--disabled` + `aria-disabled`.
- تُخرَج دلالات الوصول في كلا المنصتين: يحمل الترويسة `role="button"` + `aria-expanded` / `aria-controls`، ومنطقة المحتوى `role="region"` + `aria-labelledby`؛ ودعم قارئ الشاشة في MP يعتمد على إمكانيات المنصة. وعلى H5 يستجيب الترويسة المركّز بطبيعته لـ Enter / Space.
- تُولَّد معرّفات الربط بين الترويسة والمحتوى فريدة محليًا عبر `generateId` (لا `useId` الخاص بـ Vue 3.5، لأجل توافق نوى uni-app)، فلا تتعارض مجموعات طيّ متعددة في صفحة واحدة.
- **قرار النقل (محاذاة مع إصدار Vue3، دون اختراع APIs)**: يتّبع النقل مصدر الحقيقة plus بدقة ويوفّر `v-model` (قيمة مفردة / مصفوفة)، `accordion`، و`name` / `title` / `disabled` للوح وslot العنوان فقط؛ وما غير موجود في المصدر (طيّ متداخل، slot لأيقونة، تصيير كسول...) لا يُضاف من تلقاء النفس، ويُتبَع المصدر عند إضافته.
- يوجد في طبقة الغراء في هذا المستودع تصحيح واحد لقراءة الحالة المُتحكَّم بها (مُسجَّل في changeset): في الوضع المُتحكَّم به تصبح حالة التوسيع حسابًا مشتقًا (computed) يشترك في `props.modelValue`، فتتبع اللوحات على الفور أي تحديث غير متزامن لـ v-model، مع بقاء الدوال النقية في core وعقد props مطابقة تمامًا لـ plus.
