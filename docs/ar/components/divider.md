# فاصل Divider

خط فاصل يميّز بين المحتوى المختلف، ويدعم دلالة التجميع مع نص.

## الاستخدام الأساسي

```vue
<template>
  <view>نص سابق</view>
  <lh-divider />
  <view>نص لاحق</view>
</template>
```

## مع نص

```vue
<template>
  <lh-divider>رسم الحبر</lh-divider>
  <lh-divider label-position="left">محاذاة لليسار</lh-divider>
  <lh-divider label-position="right">محاذاة لليمين</lh-divider>
</template>
```

## الخط المتقطع ونمط الحدود

```vue
<template>
  <lh-divider dashed />
  <lh-divider border-style="dotted" />
</template>
```

يتقدّم `borderStyle` على `dashed`؛ ولا توجد أنماط مقابلة إلا `dashed` / `dotted`، وتُعرَض بقية القيم
كخط متصل افتراضي.

## الاتجاه العمودي

```vue
<template>
  <lh-space>
    <span>رسم الحبر</span>
    <lh-divider direction="vertical" />
    <span>مساحة فارغة</span>
  </lh-space>
</template>
```

::: tip ارتفاع الاتجاه العمودي
الفاصل العمودي عنصر `inline-block`، ويمتد بكامل ارتفاع العنصر الأب داخل صف flex عبر
`align-self: stretch`؛ أما منفردًا في حاوية كتلية فلا يزيد عن `1em`، والاستخدام العمودي داخل صف flex
هو الأكثر توافقًا مع المتوقع.
:::

## عمودي مع نص

يدعم الاتجاه العمودي النص أيضًا: يُرتَّب الخط فوق النص وتحته، وترتفع دلالة العنصر إلى `role="separator"`
مع التصريح بـ `aria-orientation="vertical"`.

```vue
<template>
  <view class="vertical-text-row">
    <text>أعلى</text>
    <lh-divider direction="vertical">رسم الحبر</lh-divider>
    <text>أسفل</text>
  </view>
</template>

<style>
.vertical-text-row {
  display: flex;
  align-items: center;
  height: 120px;
}
</style>
```

::: tip ارتفاع النص العمودي مستمد من صف الأب
يحصل الفاصل العمودي مع النص على ارتفاعه عبر `align-self: stretch` من صف الأب لتنفتح الخطوط — ويجب أن
يكون الأب صف flex بارتفاع محدد (مثل `height: 120px` في المثال أعلاه). أما في حاوية كتلية فلا يتبقى
من الخط إلا الحد الأدنى للطول 12px.
:::

::: tip labelPosition لا يعمل في الاتجاه العمودي
يمثّل `label-position` دلالة محاذاة النص يمينًا ويسارًا في الاتجاه الأفقي؛ أما نص الاتجاه العمودي
فيكون دائمًا في المنتصف ولا تُنتَج أصناف تنسيق له.
:::

## Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| direction | الاتجاه | `'horizontal' \| 'vertical'` | `'horizontal'` |
| dashed | خط متقطع | `boolean` | `false` |
| labelPosition | موضع المحاذاة مع النص (ساري في الاتجاه الأفقي، أما العمودي فهو دائمًا في المنتصف) | `'left' \| 'center' \| 'right'` | `'center'` |
| borderStyle | نمط الحدود (يتقدّم على dashed) | `string` | — |
| customClass | صنف مخصّص | `string` | — |
| sx | خصائص تخطيط سريعة | `LhSxProps` | — |

## Slots

| الفتحة | الوصف |
| --- | --- |
| default | نص الفاصل (أفقيًا يُرتَّب يمينًا ويسارًا، وعموديًا فوق وتحت) |
