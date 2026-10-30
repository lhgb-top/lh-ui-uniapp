# شريط التقدم Progress

يعرض تقدّم المهمة، ويدعم ألوان الحالات والألوان المخصصة وتنسيق النص.

## الاستخدام الأساسي

```vue
<template>
  <lh-progress :percentage="42" />
</template>
```

## الحالات

```vue
<template>
  <lh-progress :percentage="70" status="success" />
  <lh-progress :percentage="70" status="warning" />
  <lh-progress :percentage="70" status="exception" />
  <lh-progress :percentage="100" />
</template>
```

عندما يكون `status` هو `normal` وتصل النسبة إلى 100 يُعامَل تلقائيًا كـ `success`.

## سُمك الخط وإخفاء النص

```vue
<template>
  <lh-progress :percentage="60" :stroke-width="12" />
  <lh-progress :percentage="60" :show-text="false" />
</template>
```

## لون مخصص

تُستخدم السلسلة مباشرةً كلون للشريط، أما الدالة فتُرجع اللون وفقًا للنسبة المئوية.

```vue
<template>
  <lh-progress :percentage="60" color="#C4A35A" />
  <lh-progress :percentage="60" :color="gradient" />
</template>

<script setup lang="ts">
const gradient = (p: number) => `rgb(${p}, 0, 0)`
</script>
```

## تنسيق مخصص وفتحة النص

```vue
<template>
  <lh-progress :percentage="42" :format="format" />
  <lh-progress :percentage="42">
    <template #text="{ percentage }">
      <text>{{ percentage }} / 100</text>
    </template>
  </lh-progress>
</template>

<script setup lang="ts">
const format = (p: number) => `تقدم ${p}`
</script>
```

## Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| percentage | نسبة التقدم 0-100 (تُحصَر تلقائيًا عند تجاوز النطاق) | `number` | `0` |
| type | النوع | `'line' \| 'circle'` | `'line'` |
| status | الحالة | `'normal' \| 'success' \| 'warning' \| 'exception'` | `'normal'` |
| color | لون شريط التقدم: سلسلة أو دالة تُرجع اللون وفق النسبة | `string \| ((percentage: number) => string)` | — |
| strokeWidth | سُمك الخط px | `number` | `6` |
| width | عرض لوح وضع الدائرة px | `number` | `126` |
| showText | إظهار النص | `boolean` | `true` |
| format | تنسيق النص المخصص | `(percentage: number) => string` | — |
| customClass | صنف مخصّص | `string` | — |
| sx | خصائص تخطيط سريعة | `LhSxProps` | — |

## Slots

| الفتحة | الوصف | معاملات النطاق |
| --- | --- | --- |
| text | نص التقدم المخصص | `{ percentage: number }` |

::: tip النوع circle غير مطبَّق بعد
دعم svg في البرنامج المصغر محدود، فلم يُطبَّق في الإصدار الأول سوى النوع line. ويمرير `type="circle"`
يُعرَض كـ line مع تحذير واحد في وقت التطوير (دون تخفيض صامت)، على أن يُضاف circle في الإصدار الثاني.
:::
