# حقل إدخال Input

## الاستخدام الأساسي

```vue
<template>
  <lh-input v-model="text" placeholder="أدخل النص" />
  <lh-input v-model="text" type="textarea" :rows="3" autosize placeholder="متعدد الأسطر" />
  <lh-input v-model="text" type="password" placeholder="كلمة المرور" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>
```

## أنماط العنصر النائب (ضرورية في MP)

::: warning البرنامج المصغر لا يدعم `::placeholder`
لا يدعم WXSS في برنامج WeChat المصغر العنصر الزائف `::placeholder`. فمرّر أنماط العنصر النائب عبر
prop، **ولا** تكتب `::placeholder` في CSS (فبوابة وقت البناء تعترضها أيضًا).
:::

```vue
<lh-input placeholder="أدخل النص" placeholder-style="color: #999; font-size: 13px" />
<!-- أو باستخدام صنف -->
<lh-input placeholder="أدخل النص" placeholder-class="my-placeholder" />
```

## الأيقونات والحالات

```vue
<template>
  <lh-input v-model="text" prefix-icon="search" placeholder="بحث" clearable />
  <lh-input v-model="text" suffix-icon="close" placeholder="أيقونة لاحقة" />
  <lh-input v-model="text" state="error" placeholder="حالة فشل التحقق" />
  <lh-input v-model="text" :maxlength="20" show-word-limit placeholder="عدّاد الأحرف" />
</template>
```

## موضع التسمية

أصبح `label` يُرسم فعليًا الآن (كانت الخاصية مُعرَّفة سابقًا دون توصيل). القيمة الافتراضية `float` هي تسمية عائمة — ترتفع إلى الفجوة العلوية اليسرى عند التركيز أو عند وجود قيمة؛ و`labelPosition` يبدّل إلى المواضع الثابتة `top` / `bottom` / `left` / `right`:

```vue
<template>
  <!-- الافتراضي: تسمية عائمة (ترتفع إلى الفجوة العلوية اليسرى عند التركيز/وجود قيمة) -->
  <lh-input v-model="text" label="اسم المستخدم" />
  <!-- أعلى -->
  <lh-input v-model="text" label="اسم المستخدم" label-position="top" />
  <!-- أسفل -->
  <lh-input v-model="text" label="اسم المستخدم" label-position="bottom" />
  <!-- يسار بعرض ثابت (لا يعمل labelWidth إلا مع left / right) -->
  <lh-input v-model="text" label="اسم المستخدم" label-position="left" :label-width="80" />
  <!-- يمين -->
  <lh-input v-model="text" label="اسم المستخدم" label-position="right" />
</template>
```

::: warning فروق uni-app
- الضبط الرأسي الدقيق لكل مستوى حجم في `float` يعتمد على المحدد `:has` (غير مدعوم في WXSS)؛ في البرنامج المصغر لا يكون دقيقًا إلا بمستوى `medium`، أما المستويات الأخرى فينحرف موضع التسمية الرأسي قليلًا. المواضع الثابتة (`top` / `left` / `right` / `bottom`) تعمل على جميع المنصات.
- موضع الطفو لـ `textarea` + `float` معالج بالفعل عبر أنماط مضمّنة كحل بديل، ويعمل على جميع المنصات.
:::

## Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| modelValue (v-model) | القيمة المرتبطة | `string` | — |
| type | النوع | `'text' \| 'textarea' \| 'password' \| 'number' \| 'email' \| 'url' \| 'tel' \| 'date' \| 'time'` | `'text'` |
| size | الحجم | `'small' \| 'medium' \| 'large'` | — |
| disabled | معطّل | `boolean` | `false` |
| readonly | للقراءة فقط | `boolean` | `false` |
| placeholder | النص النائب | `string` | — |
| placeholderStyle | أنماط مضمّنة للنص النائب (بديل `::placeholder`) | `string` | — |
| placeholderClass | صنف النص النائب (بديل placeholderStyle) | `string` | — |
| maxlength | أقصى طول | `number` | — |
| minlength | أدنى طول | `number` | — |
| showWordLimit | إظهار عدّاد الأحرف | `boolean` | `false` |
| clearable | قابل للمسح | `boolean` | `false` |
| prefixIcon | أيقونة بادئة | `LhIconName` | — |
| suffixIcon | أيقونة لاحقة | `LhIconName` | — |
| state | حالة التحقق | `'error' \| 'success' \| 'warning'` | — |
| name | name الأصلي (لتجميع بيانات النموذج) | `string` | — |
| password | وضع كلمة المرور | `boolean` | `false` |
| rows | عدد أسطر textarea | `number` | — |
| autosize | تكيّف ارتفاع textarea (auto-height في MP) | `boolean` | `false` |
| label | تسمية عائمة (افتراضي)؛ مع labelPosition يمكن تغيير الموضع | `string` | — |
| labelPosition | موضع التسمية | `'float' \| 'top' \| 'left' \| 'right' \| 'bottom'` | `'float'` |
| labelWidth | عرض ثابت للتسمية (لا يعمل إلا مع left / right؛ الأرقام تُفسَّر بالبكسل والسلاسل تُستخدم كما هي) | `string \| number` | — |
| customClass | صنف مخصّص | `string` | — |
| themeVars | متغيّرات سمة خاصة بالمكوّن | `Record<string, string>` | — |
| sx | خصائص تخطيط سريعة | `LhSxProps` | — |

## Events

| الحدث | الوصف | معامل الاستدعاء |
| --- | --- | --- |
| update:modelValue | تغيّر القيمة | `(value: string)` |
| input | الإدخال (يُؤخَذ من `event.detail.value`) | `(value: string)` |
| blur | فقدان التركيز | — |
| focus | اكتساب التركيز | — |
| clear | المسح | — |

::: tip الفروق عن نسخة Vue3
لا توجد قدرات مقابلة في البرنامج المصغر لـ `autocomplete` / `autofocus` / `resize` / `form` /
`tabindex` / `nativeType` / `inputStyle`، فهي **غير مطبّقة** في هذا المسجل. ويعمل `autosize` عبر
الخاصية `auto-height` في textarea الخاصة بالبرنامج المصغر.
:::
