# مربع حوار Dialog

## الاستخدام الأساسي

```vue
<template>
  <lh-button @click="visible = true">فتح مربع الحوار</lh-button>

  <lh-dialog v-model="visible" title="عنوان" width="80%">
    <view>هذا محتوى مربع الحوار</view>
    <template #footer>
      <lh-button @click="visible = false">إلغاء</lh-button>
      <lh-button type="primary" @click="visible = false">تأكيد</lh-button>
    </template>
  </lh-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
</script>
```

## التموضع

```vue
<template>
  <lh-dialog v-model="visible" position="bottom" title="طبقة سفلية">
    <view>محتوى سفلي</view>
  </lh-dialog>

  <lh-dialog v-model="visible" fullscreen title="ملء الشاشة">
    <view>محتوى ملء الشاشة</view>
  </lh-dialog>
</template>
```

تحمل الطبقة السفلية تلقائيًا `env(safe-area-inset-bottom)` لتتوافق مع الشاشات الكاملة.

## Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| modelValue (v-model) | ظاهر أم لا | `boolean` | `false` |
| title | العنوان | `string` | — |
| width | العرض | `string \| number` | — |
| top | المسافة عن الأعلى | `string \| number` | — |
| fullscreen | ملء الشاشة | `boolean` | `false` |
| position | التموضع | `'center' \| 'top' \| 'bottom'` | `'center'` |
| closeOnClickModal | الإغلاق عند النقر على القناع | `boolean` | `true` |
| closeOnPressEscape | الإغلاق بـ Esc (**لا توجد أحداث للوحة المفاتيح في MP، فلا أثر له**) | `boolean` | `true` |
| lockScroll | قفل تمرير الخلفية (**في H5 فقط**) | `boolean` | `true` |
| zIndex | الترتيب الطبقي؛ يُخصَّص تلقائيًا عند عدم التمرير | `number` | — |
| customClass | صنف مخصّص | `string` | — |
| themeVars | متغيّرات سمة خاصة بالمكوّن | `Record<string, string>` | — |
| sx | خصائص تخطيط سريعة | `LhSxProps` | — |

## Slots

| الفتحة | الوصف |
| --- | --- |
| default | المحتوى |
| footer | منطقة الأزرار السفلية |

## Events

| الحدث | الوصف | معامل الاستدعاء |
| --- | --- | --- |
| update:modelValue | تغيّر الظهور | `(visible: boolean)` |
| open | الفتح | — |
| close | الإغلاق | — |

::: tip الفروق عن نسخة Vue3
- تركيب الطبقة المنبثقة عبر `root-portal` (في H5 عبر teleport، وفي MP عبر root-portal أو التخفيض
  إلى تموضع fixed داخل الصفحة).
- **focus-trap غير متاح في طرف MP**: يُرجع حارس الترجمة `LH_IS_H5` القيمة false مباشرة دون استدعاء
  focus-trap.
- **lockScroll بلا أثر في طرف MP**: لا يوجد قفل لتمرير body في البرنامج المصغر، ويعتمد الاعتراض
  بالنقر على القناع كحل احتياطي.
- `closeOnPressEscape` بلا أثر في طرف MP (لا توجد أحداث للوحة المفاتيح).
:::
