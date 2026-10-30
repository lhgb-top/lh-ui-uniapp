# منتقي Select

## الاستخدام الأساسي

```vue
<template>
  <lh-select v-model="value" :options="options" placeholder="اختر" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref()
const options = [
  { label: 'الخيار الأول', value: 'a' },
  { label: 'الخيار الثاني', value: 'b' },
  { label: 'خيار معطّل', value: 'c', disabled: true },
]
</script>
```

## قابل للمسح / قابل للتصفية

```vue
<template>
  <lh-select v-model="value" :options="options" clearable />
  <lh-select v-model="value" :options="options" filterable placement="bottom" />
</template>
```

## Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| modelValue (v-model) | القيمة المرتبطة | `unknown` | — |
| options | قائمة الخيارات | `LhSelectOption[]` | — |
| size | الحجم | `'small' \| 'medium' \| 'large'` | — |
| disabled | معطّل | `boolean` | `false` |
| clearable | قابل للمسح | `boolean` | `false` |
| placeholder | النص النائب | `string` | — |
| filterable | قابل للتصفية (يوفر طرف MP حقل إدخال داخل الطبقة المنبثقة) | `boolean` | `false` |
| placement | موضع الطبقة المنبثقة (12 موضعًا) | `LhPlacement` | `'bottom'` |
| customClass | صنف مخصّص | `string` | — |
| themeVars | متغيّرات سمة خاصة بالمكوّن | `Record<string, string>` | — |
| sx | خصائص تخطيط سريعة | `LhSxProps` | — |

### LhSelectOption

| الخاصية | الوصف | النوع |
| --- | --- | --- |
| label | النص الظاهر | `string` |
| value | القيمة | `unknown` |
| disabled | معطّل | `boolean` |

## Events

| الحدث | الوصف | معامل الاستدعاء |
| --- | --- | --- |
| update:modelValue | تغيّر القيمة | `(value)` |
| change | تغيّر القيمة (يشمل المسح إلى `undefined`) | `(value)` |
| visible-change | ظهور/اختفاء الطبقة المنبثقة | `(visible: boolean)` |

::: tip الفروق عن نسخة Vue3
- تركيب الطبقة المنبثقة عبر `root-portal` + القياس غير المتزامن بإطارين (وليس تموضعًا absolute).
- **التنقل بلوحة المفاتيح (↑↓ / Home / End) في H5 فقط**، إذ لا توجد أحداث للوحة المفاتيح في
  البرنامج المصغر، فتُزال في وقت الترجمة — ولا يمكن في طرف MP سوى النقر على الخيارات.
- يُعرَض حقل تصفية `filterable` في طرف MP داخل الطبقة المنبثقة.
:::
