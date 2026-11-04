# Cascader الاختيار المتسلسل

مُنتقٍ متسلسل للبيانات متعددة المستويات، كاختيار المقاطعة / المدينة / الحي. النقر على المُشغِّل يفتح لوحة متعددة الأعمدة؛ يتوسّط المستوى تلو الآخر، ويكتمل الاختيار باختيار عقدة طرفية (أو أي مستوى مع `check-strictly`).

## الاستخدام الأساسي

```vue
<template>
  <lh-cascader v-model="value" :options="options" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>([])
const options = [
  {
    value: 'zhinan',
    label: '指南',
    children: [
      {
        value: 'sheji',
        label: '设计指南',
        children: [
          { value: 'yuansze', label: '颜色' },
          { value: 'fuziyuanze', label: '字体' },
        ],
      },
      { value: 'shejiguize', label: '设计规则' },
    ],
  },
  {
    value: 'zujian',
    label: '组件',
    children: [
      { value: 'jiben', label: '基础' },
      { value: 'fankui', label: '反馈' },
    ],
  },
]
</script>
```

النقر على عنصر له أبناء يوسّع العمود التالي أولًا، ثم النقر على عقدة طرفية يختارها (في الاختيار الفردي تُغلق اللوحة تلقائيًا).

## الاختيار المتعدد

```vue
<template>
  <lh-cascader v-model="value" :options="options" multiple />
  <!-- وسوم مطوية: أول عنصر مختار فقط + عدّاد -->
  <lh-cascader v-model="value2" :options="options" multiple collapse-tags />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>([])
const value2 = ref<(string | number)[]>(['yuansze', 'fuziyuanze'])
const options = [
  {
    value: 'zhinan',
    label: '指南',
    children: [
      { value: 'sheji', label: '设计指南' },
      { value: 'shejiguize', label: '设计规则' },
    ],
  },
  {
    value: 'zujian',
    label: '组件',
    children: [
      { value: 'jiben', label: '基础组件' },
      { value: 'fankui', label: '反馈组件' },
    ],
  },
]
</script>
```

في وضع الاختيار المتعدد يُربَط `v-model` بمصفوفة **قيم المستوى الأخير** لكل مسار مختار، وتُعرَض العناصر المختارة على هيئة وسوم داخل المُشغِّل.

## خيارات معطّلة

`disabled: true` في بيانات العقدة تعطّل تلك العقدة (النقر عليها لا يوسّع ولا يختار)؛ والprop المُسمى `disabled` يعطّل المُنتقي بأكمله؛ و`readonly` يعرض القيمة دون فتح اللوحة.

```vue
<template>
  <lh-cascader v-model="value" :options="disabledOptions" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>([])
const disabledOptions = [
  {
    value: 'zhinan',
    label: '指南',
    disabled: true,
    children: [{ value: 'sheji', label: '设计指南' }],
  },
  {
    value: 'zujian',
    label: '组件',
    children: [
      { value: 'jiben', label: '基础组件' },
      { value: 'fankui', label: '反馈组件', disabled: true },
    ],
  },
]
</script>
```

## عرض المسار وقيمة الإرجاع

```vue
<template>
  <!-- المسار الكامل (افتراضي) -->
  <lh-cascader v-model="value" :options="options" placeholder="المسار الكامل (افتراضي)" />
  <!-- المستوى الأخير فقط -->
  <lh-cascader v-model="value" :options="options" :show-all-levels="false" placeholder="المستوى الأخير فقط" />
  <!-- فاصل مخصص -->
  <lh-cascader v-model="value" :options="options" separator=" > " placeholder="فاصل >" />
  <!-- يُربَط v-model بقيمة المستوى الأخير فقط (يبقى الصدى المسار الكامل) -->
  <lh-cascader v-model="leafValue" :options="options" :emit-path="false" placeholder="قيمة المستوى الأخير فقط" />
  <!-- أي مستوى قابل للاختيار (النقر على عقدة غير طرفية يختارها مباشرة) -->
  <lh-cascader v-model="anyValue" :options="options" check-strictly placeholder="أي مستوى قابل للاختيار" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>(['zhinan', 'sheji', 'yuansze'])
const leafValue = ref<(string | number)[]>(['yuansze'])
const anyValue = ref<(string | number)[]>(['zhinan', 'sheji'])
const options = [
  {
    value: 'zhinan',
    label: '指南',
    children: [
      { value: 'sheji', label: '设计指南', children: [{ value: 'yuansze', label: '颜色' }] },
    ],
  },
]
</script>
```

> النص البديل الافتراضي يأتي من مفتاح اللغة `cascader.placeholder` («请选择» بالصينية)، ويمكن تغطيته عبر `placeholder`.

## قابل للترشيح

يفعّل `filterable` البحث: صندوق الترشيح داخل اللوحة (لا يوجد في برنامج WeChat المصغر دلالة لتركيز الإدخال داخل المُشغِّل)؛ وعند إدخال كلمة مفتاحية تُعرَض النتائج وفق المسار الكامل، والنقر على نتيجة يختارها مباشرة.

```vue
<template>
  <lh-cascader v-model="value" :options="options" filterable placeholder="أدخل كلمة مفتاحية للبحث" />
</template>
```

حين لا تطابق أي نتيجة يُعرَض مفتاح اللغة `cascader.noMatch` («无匹配数据» بالصينية)، ويمكن تخصيصه عبر slot باسم `no-match`.

## أسماء الحقول البديلة

يعلن `item-config` أسماء الحقول البديلة للعقدة (`value` / `label` / `children` / `disabled` / `leaf`)، فلا تحتاج البيانات غير المتزامنة أو بنية الخادم إلى تحويل يدوي:

```vue
<template>
  <lh-cascader
    v-model="value"
    :options="aliasedOptions"
    :item-config="{ value: 'id', label: 'name', children: 'sub' }"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>(['zhejiang', 'hangzhou', 'xihu'])
const aliasedOptions = [
  {
    id: 'zhejiang',
    name: '浙江省',
    sub: [{ id: 'hangzhou', name: '杭州市', sub: [{ id: 'xihu', name: '西湖区' }] }],
  },
]
</script>
```

## Cascader API

### Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| modelValue | القيمة المربوطة (عند `emitPath` بقيمة `false` تكون المستوى الأخير فقط) | `(string \| number)[]` | `() => []` |
| options | قائمة الخيارات (بنية شجرية) | `LhCascaderNode[]` | `() => []` |
| size | الحجم | `LhCascaderSize` | `'medium'` |
| disabled | تعطيل المُنتقي بأكمله | `boolean` | `false` |
| clearable | هل يمكن المسح | `boolean` | `true` |
| placeholder | النص البديل (عند عدم التمرير يُؤخَذ من مفتاح اللغة `cascader.placeholder`) | `string` | — |
| readonly | للقراءة فقط (لا يفتح اللوحة) | `boolean` | `false` |
| showAllLevels | هل يُعرِض المُشغِّل المسار الكامل | `boolean` | `true` |
| checkStrictly | إمكانية اختيار أي مستوى من العقدة | `boolean` | `false` |
| emitPath | هل تتضمن القيمة المُعادة المسار الكامل | `boolean` | `true` |
| multiple | اختيار متعدد | `boolean` | `false` |
| cascading | اقتران تسلسلي (توسيع الأبناء عند مرور المؤشر، يعمل في H5 فقط) | `boolean` | `true` |
| separator | فاصل المسار | `string` | `'/'` |
| collapseTags | هل تُطوى الوسوم في وضع الاختيار المتعدد | `boolean` | `false` |
| filterable | هل يمكن البحث | `boolean` | `false` |
| itemConfig | أسماء الحقول البديلة للعقدة | `LhCascaderItemConfig` | `() => ({})` |
| customClass | صنف مخصص (يُمرَّر إلى العقدة الجذرية) | `string` | — |
| themeVars | متغيّرات السمة على مستوى المكوّن | `Record<string, string>` | — |
| sx | خصائص التخطيط السريعة (تُطبَّق على جذر المُشغِّل، ولا تتأثر لوحة الطبقة العائمة) | `LhSxProps` | — |

### Events

| الحدث | الوصف | المعاملات |
| --- | --- | --- |
| update:modelValue | عند تغيّر القيمة المربوطة | `(value: (string \| number)[])` |
| change | عند تغيّر القيمة المختارة | `(value: (string \| number)[], path: LhCascaderNode[] \| null)` |

### Slots

| Slot | الوصف |
| --- | --- |
| no-match | محتوى مخصص حين لا يجد الترشيح تطابقًا |

### بنية البيانات

تعريف النوع `LhCascaderNode`:

```ts
interface LhCascaderNode {
  value: string | number
  label: string
  disabled?: boolean
  leaf?: boolean
  children?: LhCascaderNode[]
}
```

### إمكانية الوصول

- يحمل المُشغِّل `aria-haspopup="listbox"` / `aria-expanded` / `aria-controls` (تُنتِج حزمة السمات دالة share النقية `getCascaderTriggerAria`، وتُربَط مفتاحًا بمفتاح بصورة صريحة)
- لوحة الطبقة العائمة هي `role="dialog"`، وكل عمود `role="listbox"` (يأتي `aria-label` من مفتاح اللغة `cascader.columnLabel` أي «第 N 级»)، وعناصر العمود `role="option"` وتحمل `aria-selected` / `aria-disabled` / `aria-expanded`
- محرّك التموضع تنفيذ ذاتي من دوال نقية (flip / shift لمنع التجاوز)، بلا تبعيات طرف ثالث وقت التشغيل

::: tip اختلافات المنصات (الفروق عن نسخة Vue3)
- **تحويل اللوحة إلى طبقة عائمة**: لوحة plus معلّقة ضمن `Teleport to="body"` وتتلاشى عبر `Transition`؛ أما في جهة uni-app فيحمِلها `lh-root-portal` (مع احتياطي `fixed` داخل الصفحة للإصدارات القديمة من المكتبة الأساسية)، ويمر التموضع بقياس غير متزامن على إطارَين (تُرسم مخفية للقياس → يتموضع `computePosition` → تُعرَض، لتفادي الوميض). حساب التموضع غير متزامن، فلا يُفترَض الحصول على النتيجة بصورة متزامنة. ولم تُربَط حركة دخول وخروج (`Transition` غير موثوق في MP، مثل tooltip / dropdown / popover).
- **تمرير الأعمدة**: كل عمود `scroll-view` (`scroll-y`) بتمرير عمودي مستقل — فليس لـ`view` في MP تمرير فيض موثوق، وتغطّي حاوية العمود ذات `overflow-y: auto` في scss الخاص بـ share في H5 تنفيذ `scroll-view` المكافئ.
- **التنقل بلوحة المفاتيح في H5 فقط**: Enter/Space على المُشغِّل يفتح ويغلق، ومفاتيح الأسهم تنقل التركيز إلى اللوحة؛ وداخل اللوحة يتنقّل ↑↓ داخل العمود (متخطيًا المعطّل)، و←→ بين الأعمدة، وEnter/Space تكافئ النقر؛ ويُغلق Escape عبر استماع على مستوى المستند (مع طبقات عائمة متعددة لا يُغلق إلا الطبقة العليا). جسم دالة المعالجة بالكامل مقصوص بالترجمة الشرطية، ولا يحتوي حزمة MP على كود ميت.
- **التوسيع عند مرور المؤشر في H5 فقط**: توسيع الأبناء عند مرور المؤشر الخاص بـ `cascading` يعتمد على دلالة hover، وهي غير موجودة في برنامج WeChat المصغر؛ هناك لا تتوسّع الأبناء إلا بالنقر (يكافئ `cascading` في MP تعطيل التوسيع بالمرور).
- **موضع صندوق الترشيح**: في plus يكون صندوق `filterable` هو المُشغِّل نفسه؛ أما جهة uni-app فتضعه داخل اللوحة العائمة (مثل select)، لأنه ليس في MP دلالة لتركيز الإدخال داخل المُشغِّل.
- **الإغلاق عند النقر خارجها**: يستمع plus إلى نقرات document عبر `useLhClickOutside`؛ وتتحمّل جهة uni-app قناعًا شفافًا داخل الصفحة (النقر على القناع يُغلق).
- **لا يُطوى المُشغِّل عند خروجه من إطار العرض**: لا يتيح uni-app قناة موحّدة لاستماع التمرير وتغيّر المقاسات، لذا لم يُنقَل.
- **دائرة التركيز وتنقّل tabindex (roving) في H5 فقط**: ليس في MP دلالة لتركيز لوحة المفاتيح، فلا تترك رابطة `tabindex` أثرًا في جهة MP.
:::
