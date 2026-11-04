# Tabs

التبديل بين الأجزاء داخل نفس المنطقة. يدعم رأس التبويبات التمرير الأفقي ومظهر البطاقات والتبويبات القابلة للإغلاق / الإضافة.

## الاستخدام الأساسي

اربط `name` للجزء النشط عبر `v-model`؛ عند عدم تمريره يتم تفعيل أول جزء متاح.

```vue
<template>
  <lh-tabs v-model="active">
    <lh-tab-pane
      name="ink"
      label="الحبر"
    >
      الحبر: مُحرَّق، كثيف، ثقيل، فاتح، خفيف.
    </lh-tab-pane>
    <lh-tab-pane
      name="danqing"
      label="الرسم"
    >
      دانتشينغ: الزنجفر واللازورد، مصطلح كلاسيكي للرسم.
    </lh-tab-pane>
    <lh-tab-pane
      name="liubai"
      label="الفراغ"
    >
      الفراغ: معاملة الأبيض كالحبر، وإفساح المجال للروح.
    </lh-tab-pane>
  </lh-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref('ink')
</script>
```

## نمط البطاقات

يُحوِّل `type="card"` إلى مظهر البطاقات.

```vue
<template>
  <lh-tabs
    v-model="active"
    type="card"
  >
    <lh-tab-pane
      name="spring"
      label="الربيع"
    >
      الربيع: تتفجَّر النباتات.
    </lh-tab-pane>
    <lh-tab-pane
      name="summer"
      label="الصيف"
    >
      الصيف: يزهر كل شيء.
    </lh-tab-pane>
  </lh-tabs>
</template>
```

## موضع التبويبات

يضع `tab-position="bottom"` رأس التبويبات أسفل المحتوى.

```vue
<template>
  <lh-tabs
    v-model="active"
    tab-position="bottom"
  >
    <lh-tab-pane
      name="poem"
      label="الشعر"
    >
      الشعر: التعبير عن الشغف.
    </lh-tab-pane>
    <lh-tab-pane
      name="painting"
      label="الرسم"
    >
      الرسم: نقل الفكرة.
    </lh-tab-pane>
  </lh-tabs>
</template>
```

## تبويبات معطلة

جزء `lh-tab-pane` يحمل `disabled` لا يمكن تفعيله (يتجاهل النقرات، ويعود `modelValue` الذي يشير إليه إلى أول جزء متاح).

```vue
<template>
  <lh-tabs v-model="active">
    <lh-tab-pane
      name="first"
      label="متاح"
    >
      الجزء الأول متاح.
    </lh-tab-pane>
    <lh-tab-pane
      name="second"
      label="معطّل"
      disabled
    >
      هذا الجزء معطّل ولا يمكن تفعيله.
    </lh-tab-pane>
  </lh-tabs>
</template>
```

## قابل للإغلاق والإضافة

يُ/render `closable` زر إغلاق لكل تبويب (يُطلِق `tab-remove` عند النقر)؛ ويُrender `addable` زر الإضافة (يُطلِق `tab-add`). المكوِّن يطلق الأحداث فقط — إضافة عقد الأجزاء وحذفها مسؤولية طبقة العمل، تمامًا كما في إصدار Vue 3.

```vue
<template>
  <lh-tabs
    v-model="active"
    closable
    addable
    @tab-remove="handleRemove"
    @tab-add="handleAdd"
  >
    <lh-tab-pane
      v-for="pane in panes"
      :key="pane.name"
      :name="pane.name"
      :label="pane.label"
    >
      {{ pane.label }}: محتوى الجزء.
    </lh-tab-pane>
  </lh-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref('one')
const panes = ref([
  { name: 'one', label: 'تبويب ١' },
  { name: 'two', label: 'تبويب ٢' },
])

function handleRemove(name: string) {
  panes.value = panes.value.filter((pane) => pane.name !== name)
}

function handleAdd() {
  panes.value.push({ name: `new-${panes.value.length + 1}`, label: 'تبويب جديد' })
}
</script>
```

## Tabs Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| modelValue | اسم الجزء النشط (v-model) | `string` | — |
| type | المظهر: `'line'` تسطير / `'card'` بطاقات | `'line' \| 'card'` | `'line'` |
| closable | هل يمكن إغلاق التبويبات | `boolean` | `false` |
| addable | هل يُعرض زر الإضافة | `boolean` | `false` |
| tabPosition | موضع التبويبات: `'top'` / `'bottom'` | `'top' \| 'bottom'` | `'top'` |
| customClass | فئة مخصّصة | `string` | — |
| sx | خصائص تخطيط سريعة | `LhSxProps` | — |

## TabPane Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| name | معرِّف فريد للجزء (مفتاح ثابت، يُفضَّل عدم تغييره ديناميكيًا) | `string` | — |
| label | عنوان التبويب | `string` | `''` |
| disabled | هل الجزء معطّل | `boolean` | `false` |
| customClass | فئة مخصّصة (تُطبَّق على عقدة جذر الجزء) | `string` | — |

## Events

| الحدث | الوصف | وسائط الاستدعاء |
| --- | --- | --- |
| update:modelValue | تغيَّر الجزء النشط (v-model) | `(name: string)` |
| tab-change | تغيَّر الجزء النشط بتفاعل المستخدم | `(name: string)` |
| tab-remove | نُقر زر الإغلاق؛ المكوِّن نفسه لا يحذف العقد الفرعية — تحتفظ بها طبقة العمل | `(name: string)` |
| tab-add | نُقر زر الإضافة؛ المكوِّن نفسه لا يضيف العقد الفرعية — تحتفظ بها طبقة العمل | — |

## Slots

| الفتحة | الوصف |
| --- | --- |
| Tabs default | عقد الأجزاء (يُجمع `lh-tab-pane` فقط؛ يمكن تغليفها بـ `v-for` / `template`) |
| TabPane default | محتوى الجزء |

## اختلافات المنصة

- رأس التبويبات هو `scroll-view` (شريط تنقل قابل للتمرير الأفقي): في WeChat Mini Program يجعل `enable-flex` حاوية التمرير تخطيط flex حتى لا تتقلص التبويبات أو تلتف؛ وفي H5 تطبَّق فئة `display: flex`.
- **تسطير التبويب النشط هو انتقال CSS نقي** (خط الحبر `::after` للتبويب النشط) ولا يعتمد على `transitionend`. إذا أُضيف لاحقًا مؤشر منزلق مُدار بالـ JS: فإن `transitionend` غير موثوق في Mini Program، لذا يجب محاذاة نهاية الحركة بـ `setTimeout` (نفس نهج حركات message / loading).
- **التنقل بلوحة المفاتيح (الأسهم / Home / End / Delete للإغلاق) هوام H5 فقط**: فلا توجد أحداث لوحة مفاتيح في Mini Program، وثابت وقت الترجمة يمنع فرع التنفيذ من الدخول إلى حزمة MP (لا كود ميت). تُحتفظ سمة `tabindex` (roving tabindex) في MP لكن بلا دلالة لوحة مفاتيح هناك.
- أدوار الوصول `role="tablist" / "tab" / "tabpanel"` و`aria-selected` / `aria-controls` / `aria-labelledby` تُخرَج على المنصتين؛ أما دعم قارئ الشاشة في Mini Program فيعتمد على قدرات المنصة.
- تُولَّد معرِّفات `id` للتبويبات والأجزاء ببادئة فريدة لكل مثيل (`generateId`)، فلا تتعارض عدة tabs في صفحة واحدة أبدًا.
- **قرار النقل (محاذاة مع إصدار Vue 3، دون اختراع أي API)**: وقت النقل لم يكُن المصدر المرجعي لـ plus ونواة `@lh-ui/share` يوفِّران بعدُ `lazy` و`before-leave` و`editable` (= اختصار closable + addable) ومظهر `border-card`، ولذا لا توفِّرها هذه المكتبة أيضًا. يُعرَض محتوى الأجزاء دائمًا ويُبدَّل عبر `v-show`. وستُتبَع فور إضافتها إلى المصدر المرجعي.
