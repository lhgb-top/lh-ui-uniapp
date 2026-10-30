# شارة Badge

شارة في زاوية الأيقونة، تُستخدم لأعداد التنبيهات أو نقاط الحالة أو نص مخصص.

## الاستخدام الأساسي

```vue
<template>
  <lh-badge :value="8">
    <lh-button size="small">رسالة</lh-button>
  </lh-badge>
  <lh-badge :value="8" type="primary">
    <lh-button size="small">رئيسي</lh-button>
  </lh-badge>
</template>
```

## معالجة الأعداد

```vue
<template>
  <lh-badge :value="200" :max="99">
    <lh-button size="small">تجاوز max يعرض 99+</lh-button>
  </lh-badge>
  <lh-badge :value="0" show-zero>
    <lh-button size="small">عرض 0</lh-button>
  </lh-badge>
  <lh-badge :value="0">
    <lh-button size="small">إخفاء 0</lh-button>
  </lh-badge>
  <lh-badge content="جديد">
    <lh-button size="small">نص مخصص</lh-button>
  </lh-badge>
</template>
```

## النقطة الحمراء

```vue
<template>
  <lh-badge is-dot>
    <lh-button size="small">رسالة جديدة</lh-button>
  </lh-badge>
</template>
```

## الإزاحة والحجم

```vue
<template>
  <lh-badge :value="8" :offset="[6, 4]">
    <lh-button size="small">إزاحة</lh-button>
  </lh-badge>
  <lh-badge :value="8" size="small">
    <lh-button size="small">صغير</lh-button>
  </lh-badge>
</template>
```

## Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| type | النوع | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'default'` | `'danger'` |
| value | القيمة العددية الظاهرة | `string \| number` | — |
| size | الحجم | `'small' \| 'medium' \| 'large'` | `'medium'` |
| max | القيمة العظمى، يتجاوزها ليعرض `${max}+` | `number` | `99` |
| isDot | نقطة حمراء (دون عرض القيمة) | `boolean` | `false` |
| hidden | مخفي أم لا | `boolean` | `false` |
| offset | الإزاحة عن الموضع الافتراضي `[x, y]`، تُنفَّذ بقيم margin سالبة | `[number, number]` | — |
| showZero | العرض عندما تكون القيمة 0 | `boolean` | `false` |
| content | نص مخصص (يتقدّم على value) | `string` | — |
| customClass | صنف مخصّص | `string` | — |
| sx | خصائص تخطيط سريعة | `LhSxProps` | — |

## Slots

| الفتحة | الوصف |
| --- | --- |
| default | المحتوى الذي تلتصق به الشارة |

::: tip الفروق عن نسخة Vue3
لا تعتمد حركتا الدخول والخروج على `<transition>` المدمج في Vue (لأن حدث انتهاء الانتقال غير موثوق في
البرنامج المصغر)، بل تُستبدل بتبديل الأصناف + مؤقّت لمحاذاة مدة الحركة 0.15 ثانية، والأداء البصري
مطابق لـ plus.
:::
