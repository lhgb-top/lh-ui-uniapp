# وسم Tag

## الاستخدام الأساسي

```vue
<template>
  <lh-tag>افتراضي</lh-tag>
  <lh-tag type="primary">رئيسي</lh-tag>
  <lh-tag type="success">نجاح</lh-tag>
  <lh-tag type="warning">تحذير</lh-tag>
  <lh-tag type="danger">خطر</lh-tag>
</template>
```

## الأنماط والإغلاق

```vue
<template>
  <lh-tag round>دائري</lh-tag>
  <lh-tag hit>محدد</lh-tag>
  <lh-tag closable @close="onClose">قابل للإغلاق</lh-tag>
</template>

<script setup lang="ts">
const onClose = () => console.log('أُغلق')
</script>
```

## Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| type | النوع | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| size | الحجم | `'small' \| 'medium' \| 'large'` | — |
| closable | قابل للإغلاق | `boolean` | `false` |
| disabled | معطّل | `boolean` | `false` |
| round | زوايا دائرية | `boolean` | `false` |
| hit | محدد (بدون تعبئة) | `boolean` | `false` |
| customClass | صنف مخصّص | `string` | — |
| sx | خصائص تخطيط سريعة | `LhSxProps` | — |

## Events

| الحدث | الوصف | معامل الاستدعاء |
| --- | --- | --- |
| close | النقر على زر الإغلاق | — |

::: tip الفروق عن نسخة Vue3
يُستبدل SVG المضمّن داخل زر الإغلاق بـ lh-icon (حل iconfont).
:::
