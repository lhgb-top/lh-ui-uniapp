# بطاقة Card

حاوية تجميع للمعلومات، تدعم الغلاف والرأس والمتن والتذييل وعنصر نائب للتحميل.

## الاستخدام الأساسي

```vue
<template>
  <lh-card title="رسم الحبر">
    <view>محتوى البطاقة</view>
  </lh-card>
</template>
```

## الغلاف والتذييل

```vue
<template>
  <lh-card title="ألبوم مناظر طبيعية">
    <template #cover>
      <image class="cover" src="https://placeholder.invalid/cover.png" mode="aspectFill" />
    </template>
    <view>محتوى البطاقة</view>
    <template #footer>
      <view>إجراءات سفلية</view>
    </template>
  </lh-card>
</template>
```

::: tip يحتاج العنصر الفرعي داخل الغلاف إلى عرض صريح
قاعدة «يمتد العنصر الفرعي للغلاف لكامل العرض» في share (`.lh-card__cover > *`) تعتمد على محدّد
البدل غير المدعوم في WXSS، فتتجاهله طبقة التنقية. على طرف البرنامج المصغر اكتب عرضًا صريحًا للعناصر
الفرعية داخل الغلاف مثل `<image>` (مثل `width: 100%`).
:::

## منطقة الإجراءات بجوار العنوان

تُعرَض فتحة `extra` بجوار العنوان، وتظهر فقط عند وجود `title` أو فتحة `header`.

```vue
<template>
  <lh-card title="طلب">
    <template #extra>
      <lh-button size="small" text>عرض المزيد</lh-button>
    </template>
    <view>محتوى البطاقة</view>
  </lh-card>
</template>
```

## الظل والقابلية للنقر

```vue
<template>
  <lh-card shadow="hover" clickable @click="onClick">
    <view>يرتفع عند المرور، ويطلق حدثًا عند النقر</view>
  </lh-card>
</template>

<script setup lang="ts">
const onClick = () => console.log('نقر على البطاقة')
</script>
```

## عنصر نائب للتحميل

```vue
<template>
  <lh-card title="رسم الحبر" loading>
    <view>لا يُعرَض أثناء تحميل المحتوى</view>
  </lh-card>
</template>
```

## Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| title | عنوان البطاقة (يمكن استخدام فتحة header أيضًا) | `string` | — |
| shadow | وقت ظهور الظل | `'always' \| 'hover' \| 'never'` | `'always'` |
| clickable | قابلة للنقر بالكامل (تتولّى دلالات زر لوحة المفاتيح) | `boolean` | `false` |
| loading | حالة التحميل: يحل الهيكل محل منطقة المحتوى | `boolean` | `false` |
| themeVars | متغيّرات سمة خاصة بالمكوّن (تُضاف تلقائيًا البادئة `--lh-` للمفاتيح) | `Record<string, string>` | — |
| bgPattern | عنوان URL لنقش الخلفية (مثل `var(--lh-pattern-willow)`)، لا يخضع للقائمة البيضاء العامة | `string` | — |
| customClass | صنف مخصّص | `string` | — |
| sx | خصائص تخطيط سريعة | `LhSxProps` | — |

## Events

| الحدث | الوصف | معامل الاستدعاء |
| --- | --- | --- |
| click | النقر على البطاقة كاملة (يُطلَق فقط مع `clickable`) | `(e: Event)` |

## Slots

| الفتحة | الوصف |
| --- | --- |
| cover | الغلاف |
| header | الرأس (يتقدّم على title) |
| extra | منطقة الإجراءات بجوار الرأس (تعتمد على وجود الرأس) |
| default | المحتوى الرئيسي |
| footer | التذييل |

::: tip التنشيط بلوحة المفاتيح في H5 فقط
تدعم البطاقة القابلة للنقر (`clickable`) في H5 التنشيط عبر مفتاحَي Enter / Space (موافقًا لنمط الزر
في APG)؛ ولا توجد أحداث للوحة المفاتيح في البرنامج المصغر، فيُزال هذا المعالج في طرف MP عبر الترجمة
الشرطية.
:::
