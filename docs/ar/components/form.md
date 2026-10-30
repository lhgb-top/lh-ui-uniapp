# نموذج Form

جمع البيانات والتحقق منها. منطق التحقق كله دوالّ نقية في `@lh-ui/share`، صفر اعتماد على المنصة،
والسلوك متطابق على الطرفين.

## الاستخدام الأساسي

```vue
<template>
  <lh-form :model="form" :rules="rules" ref="formRef" label-width="80">
    <lh-form-item label="اسم المستخدم" prop="name">
      <lh-input v-model="form.name" placeholder="أدخل اسم المستخدم" />
    </lh-form-item>
    <lh-form-item label="البريد الإلكتروني" prop="email">
      <lh-input v-model="form.email" placeholder="أدخل البريد الإلكتروني" />
    </lh-form-item>
    <lh-button type="primary" @click="onSubmit">إرسال</lh-button>
  </lh-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({ name: '', email: '' })
const formRef = ref()

const rules = {
  name: [{ required: true, message: 'أدخل اسم المستخدم', trigger: 'blur' }],
  email: [{ required: true, message: 'أدخل البريد الإلكتروني', trigger: 'blur' }],
}

const onSubmit = async () => {
  const ok = await formRef.value.validate()
  if (ok) {
    // اجتاز التحقق، إرسال
  }
}
</script>
```

## Form Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| model | كائن بيانات النموذج (مطلوب) | `Record<string, unknown>` | — |
| rules | قواعد التحقق (المفاتيح هي أسماء prop) | `Record<string, LhFormRule[]>` | — |
| labelPosition | موضع التسمية | `'left' \| 'right' \| 'top'` | `'right'` |
| labelWidth | عرض التسمية | `string \| number` | — |
| inline | تخطيط ضمن السطر | `boolean` | `false` |
| customClass | صنف مخصّص | `string` | — |
| sx | خصائص تخطيط سريعة | `LhSxProps` | — |

## Form Methods (تُستدعى عبر ref)

::: warning يجب أن يكون استدعاء ref بعد onReady
لم يكتمل إنشاء المكوّنات الفرعية في مرحلة `onLoad`، لذا فإن `formRef.value` هو undefined.
حدث النقر على زر الإرسال يقع طبيعيًا بعد `onReady` فلا مشكلة فيه؛
أما إن أردت الاستدعاء عند تهيئة الصفحة فضعه داخل `onReady`.
:::

| الدالة | الوصف | القيمة المُرجَعة |
| --- | --- | --- |
| validate | التحقق من جميع الحقول | `Promise<boolean>` (true عند اجتياز الكل) |
| validateField | التحقق من حقل واحد | `Promise<boolean>` |

## FormItem Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| prop | مفتاح الحقل (يقابل مفتاح model ومفتاح rules) | `string` | — |
| label | نص التسمية | `string` | — |
| required | علامة الحقل المطلوب (نجمة؛ التحقق الفعلي تحدده rules) | `boolean` | `false` |
| rules | قواعد خاصة بهذا الحقل (تدمج مع rules الخاصة بـ Form) | `LhFormRule[]>` | — |
| customClass | صنف مخصّص | `string` | — |

::: tip الفروق عن نسخة Vue3
- تشغيل التحقق: لا توجد دلالة change لعناصر التحكم في البرنامج المصغر، فيُخطَّط حدثا blur / input
  في كل عنصر تحكم كمطلق للتحقق.
- إرسال النموذج: تختلف دلالات النموذج في البرنامج المصغر، لذا يُرجع `validate` صيغة `Promise<boolean>`
  للإرسال اليدوي، دون اعتراض حدث `submit` كما في الويب.
:::
