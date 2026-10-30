# Avatar (صورة رمزية)

يعرض صورة رمزية لمستخدم أو كيان، ويدعم ثلاث هيئات: الصورة، والأيقونة، والنص.

## الاستخدام الأساسي

```vue
<template>
  <lh-avatar src="https://placeholder.invalid/avatar.png" />
  <lh-avatar icon="user" />
  <lh-avatar text="رسم الحبر" />
</template>
```

## الشكل والحجم

```vue
<template>
  <lh-avatar text="ماء" shape="circle" />
  <lh-avatar text="حبر" shape="square" />
  <lh-avatar text="ص" size="small" />
  <lh-avatar text="ك" size="large" />
</template>
```

## نمط القص

يُخطَّط `fit` إلى `mode` في `<image>` الخاص بـ uni: `fill` → `scaleToFill`، و`contain` → `aspectFit`،
و`cover` → `aspectFill`، و`none` → `center`.

```vue
<template>
  <lh-avatar src="https://placeholder.invalid/avatar.png" fit="cover" />
  <lh-avatar src="https://placeholder.invalid/avatar.png" fit="contain" />
</template>
```

::: tip scale-down تقريبي
لا يوجد في uni وضع مكافئ لـ `scale-down`، فيُؤخَذ الأقرب دلالةً وهو `aspectFit` (عرض كامل مع الحفاظ
على النسبة دون تكبير).
:::

## التراجع عند فشل التحميل

عند فشل تحميل الصورة يُتراجَع وفق الترتيب «أيقونة ← نص ← فارغ»، ويُطلَق حدث `error`.

```vue
<template>
  <lh-avatar
    src="https://placeholder.invalid/broken.png"
    icon="user"
    alt="صورة رمزية"
    @error="onError"
  />
</template>

<script setup lang="ts">
const onError = () => console.log('فشل تحميل الصورة')
</script>
```

## Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| src | عنوان الصورة؛ يُتراجَع عند الغياب إلى الأيقونة ثم النص | `string` | — |
| alt | النص البديل عند فشل تحميل الصورة، ويُستخدم أيضًا اسمًا لإمكانية الوصول | `string` | — |
| icon | اسم الأيقونة (تُعرَض عندما يكون src فارغًا أو يفشل تحميله) | `LhIconName` | — |
| text | محتوى الصورة الرمزية النصية (يُؤخَذ أول حرف للعرض عند غياب src وicon) | `string` | — |
| shape | الشكل | `'circle' \| 'square'` | `'circle'` |
| size | الحجم | `'small' \| 'medium' \| 'large'` | `'medium'` |
| fit | نمط قص الصورة (تخطيط إلى mode الخاص بـ uni image) | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'cover'` |
| customClass | صنف مخصّص | `string` | — |
| sx | خصائص تخطيط سريعة | `LhSxProps` | — |

## Events

| الحدث | الوصف | معامل الاستدعاء |
| --- | --- | --- |
| error | فشل تحميل الصورة | `(e: Event)` |
