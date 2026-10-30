# زر اختيار Radio

::: tip مرسوم عبر view على طرف البرنامج المصغر
لا يُستخدم مكوّن radio الأصلي (لأن أنماطه غير قابلة للتحكم في MP)، بل يُرسَم الرمز النقطي عبر view.
:::

## الاستخدام الأساسي

```vue
<template>
  <lh-radio-group v-model="value">
    <lh-radio value="a" label="الخيار الأول" />
    <lh-radio value="b" label="الخيار الثاني" />
    <lh-radio value="c" label="الخيار الثالث" disabled />
  </lh-radio-group>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref('a')
</script>
```

## Radio Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| modelValue (v-model) | محدد أم لا | `unknown` | — |
| value | قيمة هذا العنصر | `unknown` | — |
| label | النص | `string` | — |
| disabled | معطّل | `boolean` | `false` |
| name | name الأصلي | `string` | — |
| size | الحجم | `'small' \| 'medium' \| 'large'` | — |
| customClass | صنف مخصّص | `string` | — |
| sx | خصائص تخطيط سريعة | `LhSxProps` | — |

## RadioGroup Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| modelValue (v-model) | القيمة المحددة | `unknown` | — |
| disabled | تعطيل كل العناصر الفرعية | `boolean` | `false` |
| name | name الأصلي | `string` | — |
| size | الحجم (يُمرَّر إلى العناصر الفرعية) | `'small' \| 'medium' \| 'large'` | — |

## Events

| الحدث | الوصف | معامل الاستدعاء |
| --- | --- | --- |
| update:modelValue | تغيّر القيمة | `(value)` |
| change | تغيّر القيمة | `(value)` |
