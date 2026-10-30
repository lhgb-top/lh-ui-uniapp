# مربع اختيار Checkbox

::: tip مرسوم عبر view على طرف البرنامج المصغر
لا يُستخدم مكوّن checkbox الأصلي (لأن أنماطه غير قابلة للتحكم في MP)، بل يُرسَم مربع العلامة عبر view
مع أيقونة lh-icon، بما يضمن التوافق البصري مع بقية منصات العائلة.
:::

## الاستخدام الأساسي

```vue
<template>
  <lh-checkbox v-model="checked" label="الموافقة على الاتفاقية" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const checked = ref(false)
</script>
```

## مجموعة مربعات الاختيار

```vue
<template>
  <lh-checkbox-group v-model="values">
    <lh-checkbox value="a" label="الخيار الأول" />
    <lh-checkbox value="b" label="الخيار الثاني" />
    <lh-checkbox value="c" label="الخيار الثالث" disabled />
  </lh-checkbox-group>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const values = ref(['a'])
</script>
```

## حالة نصف التحديد

```vue
<lh-checkbox v-model="checked" indeterminate label="تحديد الكل (محدد جزئيًا)" />
```

## Checkbox Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| modelValue (v-model) | محدد أم لا | `boolean` | `false` |
| value | القيمة المعرّفة داخل group | `unknown` | — |
| label | النص | `string` | — |
| disabled | معطّل | `boolean` | `false` |
| indeterminate | حالة غير محدد (نصف التحديد) | `boolean` | `false` |
| name | name الأصلي | `string` | — |
| size | الحجم | `'small' \| 'medium' \| 'large'` | — |
| customClass | صنف مخصّص | `string` | — |
| sx | خصائص تخطيط سريعة | `LhSxProps` | — |

## CheckboxGroup Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| modelValue (v-model) | مصفوفة القيم المحددة | `unknown[]` | `[]` |
| disabled | تعطيل كل العناصر الفرعية | `boolean` | `false` |
| name | name الأصلي | `string` | — |
| size | الحجم (يُمرَّر إلى العناصر الفرعية) | `'small' \| 'medium' \| 'large'` | — |

## Events

| الحدث | الوصف | معامل الاستدعاء |
| --- | --- | --- |
| update:modelValue | تغيّر القيمة | `(value)` |
| change | تغيّر القيمة | `(value)` |
