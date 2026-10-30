# تباعد Space

يُستخدم لترتيب التباعد بين العناصر المتجاورة، بديلًا عن كتابة margin يدويًا. ويعتمد التباعد كليًا على
`gap` في CSS، وكلا المنصتين تدعمه أصليًا.

## الاستخدام الأساسي

```vue
<template>
  <lh-space>
    <lh-tag>رسم الحبر</lh-tag>
    <lh-tag>مساحة فارغة</lh-tag>
    <lh-tag>النمط الصيني</lh-tag>
  </lh-space>
</template>
```

## الاتجاه

```vue
<template>
  <lh-space direction="vertical">
    <lh-tag>رسم الحبر</lh-tag>
    <lh-tag>مساحة فارغة</lh-tag>
  </lh-space>
</template>
```

## درجات التباعد

تشير الدرجات المسبقة إلى رموز المسافات (قابلة للتخصيص عبر `--lh-spacing-*`)؛ وتُعامل الأرقام كـ px؛
وتتحكم المصفوفة في التباعد الأفقي والعمودي على التوالي.

```vue
<template>
  <lh-space size="small">
    <lh-tag>صغير</lh-tag>
    <lh-tag>صغير</lh-tag>
  </lh-space>
  <lh-space size="medium">
    <lh-tag>متوسط</lh-tag>
    <lh-tag>متوسط</lh-tag>
  </lh-space>
  <lh-space size="large">
    <lh-tag>كبير</lh-tag>
    <lh-tag>كبير</lh-tag>
  </lh-space>
  <lh-space :size="24">
    <lh-tag>24px</lh-tag>
    <lh-tag>24px</lh-tag>
  </lh-space>
  <lh-space :size="[8, 16]">
    <lh-tag>أفقي 8</lh-tag>
    <lh-tag>عمودي 16</lh-tag>
  </lh-space>
</template>
```

## المحاذاة والتفاف

```vue
<template>
  <lh-space alignment="center">
    <lh-tag>وسط</lh-tag>
    <lh-button type="primary" size="small">زر</lh-button>
  </lh-space>
  <lh-space :wrap="true">
    <lh-tag v-for="i in 20" :key="i">وسم {{ i }}</lh-tag>
  </lh-space>
</template>
```

::: tip الالتفاف يعمل في الاتجاه الأفقي فقط
ليس لـ `wrap` معنى إلا مع `direction="horizontal"`، ويُهمَل تمريره في الاتجاه العمودي.
:::

## Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| direction | اتجاه الترتيب | `'horizontal' \| 'vertical'` | `'horizontal'` |
| size | التباعد: درجة مسبقة / رقم بالبكسل / [أفقي، عمودي] | `'small' \| 'medium' \| 'large' \| number \| [number, number]` | `'medium'` |
| wrap | السماح بالالتفاف (الاتجاه الأفقي فقط) | `boolean` | `true` |
| alignment | طريقة المحاذاة | `'start' \| 'center' \| 'end' \| 'baseline'` | `'start'` |
| customClass | صنف مخصّص | `string` | — |
| sx | خصائص تخطيط سريعة | `LhSxProps` | — |

## Slots

| الفتحة | الوصف |
| --- | --- |
| default | العناصر الفرعية التي يُرتب التباعد بينها |
