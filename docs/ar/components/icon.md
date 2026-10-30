# أيقونة Icon

::: tip على طرف البرنامج المصغر يُعرَض بخط
في الويب (plus) يُستخدم `<svg><path>` مضمّن، أما البرنامج المصغر **فلا يدعم وسم `<svg>`**.
يحوّل هذا المسجل في وقت البناء مجموعة مسارات SVG من share إلى خط iconfont (مضمّن base64 في
`iconfont.css`)، ويعرض المكوّن `<text class="lh-iconfont lh-iconfont--<name>">`.
يُضبط اللون عبر `color` في CSS (**ولا يمكن استخدام `fill` / `stroke`**)، ليكون بديلًا كاملًا
 لدلالة `currentColor` في الويب.
:::

## الاستخدام الأساسي

```vue
<template>
  <lh-icon name="search" />
  <lh-icon name="loading" size="24" color="#1677ff" />
  <lh-icon name="star" size="1.5em" />
</template>
```

## Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| name | اسم الأيقونة (مفتاح من `LH_ICON_SVGS_CONST` في share) | `LhIconName` | — |
| size | الحجم (رقم يُفسَّر px؛ سلسلة تُمرَّر كما هي مثل `'1.5em'`) | `string \| number` | — |
| color | اللون (بديل `currentColor` في الويب) | `string` | — |
| customClass | صنف مخصّص (يُمرَّر إلى العقدة الجذرية) | `string` | — |
| themeVars | متغيّرات سمة خاصة بالمكوّن | `Record<string, string>` | — |
| bgPattern | نقش خلفية خاص بالمكوّن | `string` | — |

## قائمة الأيقونات

37 أيقونة إجمالًا (24×24 بلون واحد ومسار مفرد)، كلها من `LH_ICON_SVGS_CONST` في `@lh-ui/share`.
ويعيد أمر البناء `pnpm build:iconfont` توليد الخط وتخطيط المخططات (`src/icon/icon-map.ts`).

::: warning لا تنسَ إدراج نمط الخط
على المستخدم إدراج `@lh-ui/uniapp/src/icon/iconfont.css`، وإلا ستظهر الأيقونات كمربعات فارغة.
:::
