# هيكل Skeleton

عنصر نائب أثناء عدم جهوزية بيانات التحميل، وعندما يكون `loading` هو false يُعرَض المحتوى الحقيقي.

## الاستخدام الأساسي

```vue
<template>
  <lh-skeleton :loading="loading">
    <view>محتوى حقيقي</view>
  </lh-skeleton>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const loading = ref(true)
</script>
```

## عدد الأسطر والصورة الرمزية

```vue
<template>
  <lh-skeleton :loading="true" :rows="4" avatar />
</template>
```

## إيقاف الحركة

```vue
<template>
  <lh-skeleton :loading="true" :animated="false" :rows="3" />
</template>
```

## كتل نائبة مستقلة

يمكن استخدام `lh-skeleton-item` منفردًا لتركيب تخطيط نائب مخصص، ويأخذ `variant` القيم
`text` / `rect` / `circle`.

```vue
<template>
  <view class="custom-skeleton">
    <lh-skeleton-item variant="circle" class="avatar" />
    <lh-skeleton-item variant="text" class="line" />
  </view>
</template>
```

## Props (lh-skeleton)

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| loading | هل هو في حالة تحميل (يُعرَض المحتوى الحقيقي للفتحة default عندما يكون false) | `boolean` | `true` |
| rows | عدد أسطر النص | `number` | `3` |
| avatar | تضمين عنصر نائب دائري للصورة الرمزية | `boolean` | `false` |
| animated | تفعيل الحركة | `boolean` | `true` |
| customClass | صنف مخصّص | `string` | — |
| sx | خصائص تخطيط سريعة | `LhSxProps` | — |

## Props (lh-skeleton-item)

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| variant | شكل الكتلة النائبة | `'text' \| 'rect' \| 'circle'` | `'text'` |
| animated | تفعيل الحركة | `boolean` | `true` |
| customClass | صنف مخصّص | `string` | — |
| sx | خصائص تخطيط سريعة | `LhSxProps` | — |

## Slots (lh-skeleton)

| الفتحة | الوصف |
| --- | --- |
| default | المحتوى الحقيقي الذي يُعرَض عندما يكون `loading` هو false |

::: tip إمكانية الوصول
يُعلَّم الوعاء بـ `aria-busy="true"` و`aria-live="polite"`، وتُخفى الكتل النائبة عن التقنيات المساعدة؛
وبعد جهوزية البيانات يُعرَض المحتوى الحقيقي تلقائيًا على قارئ الشاشة.
:::
