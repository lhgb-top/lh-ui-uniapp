# مفتاح Switch

::: tip مرسوم عبر view على طرف البرنامج المصغر
أنماط مكوّن switch الأصلي غير قابلة للتحكم في البرنامج المصغر، لذا يُرسَم المزلج عبر view لضمان
التوافق البصري.
:::

## الاستخدام الأساسي

```vue
<template>
  <lh-switch v-model="on" />
  <lh-switch v-model="on" active-text="تشغيل" inactive-text="إيقاف" />
  <lh-switch v-model="on" loading />
  <lh-switch v-model="on" disabled />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const on = ref(true)
</script>
```

## Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| modelValue (v-model) | مفعّل أم لا | `boolean` | `false` |
| disabled | معطّل | `boolean` | `false` |
| loading | جارٍ التحميل | `boolean` | `false` |
| name | name الأصلي | `string` | — |
| size | الحجم | `'small' \| 'medium' \| 'large'` | — |
| activeText | نص التفعيل | `string` | — |
| inactiveText | نص الإيقاف | `string` | — |
| customClass | صنف مخصّص | `string` | — |
| sx | خصائص تخطيط سريعة | `LhSxProps` | — |

## Events

| الحدث | الوصف | معامل الاستدعاء |
| --- | --- | --- |
| update:modelValue | تغيّر القيمة | `(value: boolean)` |
| change | تغيّر القيمة | `(value: boolean)` |
