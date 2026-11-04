# مقوّم Segmented

تبديل الخيارات الحصرية بشكل متبادل، يُستخدم غالبًا في سيناريوهات تبديل العرض. مدفوع بالبيانات: تُمرَّر الخيارات مباشرة كمصفوفة `options` دون الحاجة لتجميع مكوّنات أبناء يدويًا.

## الاستخدام الأساسي

يقبل `options` الصيغة المختصرة بالنصوص؛ و`modelValue` (أي `v-model`) هو القيمة المحددة حاليًا.

```vue
<template>
  <lh-segmented v-model="view" :options="['قائمة', 'بطاقة', 'جدول']" />
</template>

<script setup>
import { ref } from 'vue'
const view = ref('قائمة')
</script>
```

## خيارات الكائنات

صيغة الكائن توفّر `label` / `value` وتناسب الحالات التي يختلف فيها النص المعروض عن القيمة.

```vue
<template>
  <lh-segmented
    v-model="mode"
    :options="[
      { label: 'يوم', value: 'day' },
      { label: 'أسبوع', value: 'week' },
      { label: 'شهر', value: 'month' },
    ]"
  />
</template>

<script setup>
import { ref } from 'vue'
const mode = ref('day')
</script>
```

## خيارات معطّلة وتعطيل المجموعة كلها

عند وضع `disabled: true` في كائن خيار لا يمكن تحديد ذلك الخيار؛ أما `disabled` على مستوى المكوّن فتعطّل المقوّم المجزّأ بأكمله.

```vue
<template>
  <lh-segmented
    v-model="seg"
    :options="[
      { label: 'بداية الربيع', value: 'lichun' },
      { label: 'ماء المطر', value: 'yushui' },
      { label: 'استيقاظ الحشرات', value: 'jingzhe', disabled: true },
    ]"
  />
  <lh-segmented v-model="all" disabled :options="['أ', 'ب', 'ج']" />
</template>

<script setup>
import { ref } from 'vue'
const seg = ref('lichun')
const all = ref('أ')
</script>
```

## عرض الكتلة

يجعل `block` المقوّم يملأ الحاوية وتتقاسم الخيارات العرض بالتساوي (شائع في أشرطة تبديل العروض).

```vue
<template>
  <lh-segmented v-model="block" block :options="['شي', 'تسو', 'تشو', 'فو']" />
</template>

<script setup>
import { ref } from 'vue'
const block = ref('شي')
</script>
```

## الخصائص (Props)

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| modelValue (v-model) | القيمة الحالية (متحكَّم بها، تُستخدم مع حدث `update:modelValue`) | `string \| number` | — |
| options | الخيارات (الصيغة المختصرة بالنصوص أو كائنات `{ label, value, disabled }`) | `[LhSegmentedInput](#ملاحظات-الأنواع)[]` | — |
| disabled | تعطيل المجموعة كلها | `boolean` | `false` |
| block | ملء الحاوية (تتقاسم الخيارات العرض) | `boolean` | `false` |
| customClass | صنف مخصّص (يُمرَّر إلى العقدة الجذرية) | `string` | — |
| sx | خصائص تخطيط سريعة | `LhSxProps` | — |

### ملاحظات الأنواع

```ts
/** نوع قيمة الخيار */
type LhSegmentedValue = string | number

/** شكل كائن الخيار */
interface LhSegmentedOption {
  label: string
  value: LhSegmentedValue
  disabled?: boolean
}

/** خيار الإدخال (الصيغة المختصرة بالنصوص أو كائن) */
type LhSegmentedInput = LhSegmentedValue | LhSegmentedOption
```

## الأحداث (Events)

| اسم الحدث | الوصف | معامل الاستدعاء |
| --- | --- | --- |
| update:modelValue | يُطلق عند تغيّر التحديد، يُستخدم مع v-model | `(value: string \| number)` |
| change | يُطلق عند تغيّر التحديد (بالنقر وبمفاتيح الأسهم) | `(value: string \| number)` |

## فروقات المنصة

- **تفاعل لمسي مرسوم عبر view ومتاح على كل المنصات**: حُلّت `<div>` + `<button>` من نسخة Vue 3 محل `<view>` (WXSS يمنع منتقي العلامات وتُطبَّق الأنماط عبر الأصناف)؛ ويحدث تبديل التحديد عبر `@click` ويتصرّف بشكل متماثل على H5 وفي WeChat Mini Program دون أي اعتماد على واجهات برمجة خاصة بالمنصة.
- **المزلق المحدد هو انتقال CSS صرف**: يُدار لون الخلفية / الظل للخيار المحدد بتبديل الصنف، ويدعم WXSS انتقالات `transition` البسيطة، فيظهر التلاشي على كلا الطرفين؛ **ولا يعتمد على `transitionend`** (هذا الحدث غير موثوق في Mini Program — مكوّنات الحركة في هذا المستودع مثل message / loading تضبط التوقيتات عبر setTimeout، أما المقوّم المجزّأ فلا يحتاج حتى إلى تنسيق JS: يكفي CSS الصرف دون عبء مزامنة).
- **التنقل بمفاتيح الأسهم مقتصر على H5**: لا توجد أحداث لوحة مفاتيح في Mini Program لآلية roving tabindex (مفاتيح الأسهم تنقل التحديد مع التفاف عند الطرفين وتخطّي الخيارات المعطّلة، بإعادة استخدام `getNextListIndex` / `getRovingTabIndex` من نواة `@lh-ui/share`)؛ ومعالج `@keydown` في SFC محمي بالتجميع الشرطي ولا يُستدعى داخل حزمة MP — وفي MP لا يكون التحديد إلا باللمس.
- **مظهر الخيارات المعطّلة يعتمد على صنف بديل**: أنماط التعطيل في مصدر share مكتوبة على الفئة الزائفة `&:disabled` (تطابق عناصر button فقط)، ولا تمتلك view هذه الفئة، لذلك يضيف المكوّن قاعدة `lh-segmented__option--disabled` مضمّنة في SFC بنفس الرمز (`--lh-disabled-text-color`)، على نهج البديل المضمّن في lh-spinner / lh-empty (ولا تدخل ضمن المخرجات المنقاة).
- **تُربط سمات الوصول كلٌّ على حدة**: لا يزال عقد `role="radiogroup"` / `role="radio"` + `aria-checked` / `aria-disabled` تحدّده `getSegmentedAria` / `getSegmentedItemAria` من share؛ ولأن مترجم قوالب Mini Program لا يدعم `v-bind` للكائنات، فإن طبقة الغراء تفرّد حزمة السمات إلى روابط صريحة مفردة.
- **خلاصة النقل**: Segmented مكوّن تبديل صرف بلا قياس ولا طبقات عائمة ولا اعتماد على document؛ وتنتج تطبيع الخيارات وأسماء الأصناف وسمات الوصول كلها عبر الدوال النقية في نواة `@lh-ui/share`، ولا يكتب هذا المستودع سوى الغراء التفاعلي. ويتطابق الـAPI تمامًا مع نسخة Vue 3 (`modelValue` / `options` / `disabled` / `block` / `sx`).
