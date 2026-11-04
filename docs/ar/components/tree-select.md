# TreeSelect (محدد الشجرة)

محدد الشجرة للبيانات ذات البنية الهرمية، مثل الهياكل التنظيمية وشجرات الفئات. يؤدي النقر على المشغل إلى فتح لوحة شجرة؛ في التحديد الفردي يؤدي النقر على عقدة إلى تحديدها وإغلاق اللوحة، وفي التحديد المتعدد تتم الاجتماع عبر مربعات الاختيار (تسلسل الأب-الابن).

## الاستخدام الأساسي

```vue
<template>
  <lh-tree-select v-model="value" :data="data" placeholder="请选择节点" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<string | undefined>(undefined)
const data = [
  {
    key: 'zhinan',
    label: '指南',
    children: [
      {
        key: 'sheji',
        label: '设计指南',
        children: [
          { key: 'yuansze', label: '颜色' },
          { key: 'fuziyuanze', label: '字体' },
        ],
      },
      { key: 'shejiguize', label: '设计规则' },
    ],
  },
  {
    key: 'zujian',
    label: '组件',
    children: [
      { key: 'jiben', label: '基础' },
      { key: 'fankui', label: '反馈' },
    ],
  },
]
</script>
```

النقر على عقدة يحددها (بما في ذلك العقد غير الطرفية) ويغلق اللوحة؛ النقر على سهم التوسيع يسار العقدة يوسعها / يطويها فقط دون تغيير قيمة التحديد. يعرض المشغل `label` للعقدة المحددة.

## التحديد المتعدد

```vue
<template>
  <lh-tree-select v-model="value" :data="data" multiple placeholder="请选择多个节点" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<string[]>(['jiben', 'fankui'])
const data = [
  {
    key: 'zujian',
    label: '组件',
    children: [
      { key: 'jiben', label: '基础' },
      { key: 'fankui', label: '反馈' },
    ],
  },
]
</script>
```

في التحديد المتعدد يربط `v-model` مصفوفة المفاتيح المحددة (`string[]`) مع تسلسل الأب-الابن: تحديد عقدة أب يحدد تلقائيًا جميع السلالات القابلة للاجتماع، وتصبح العقدة الأم محددة بالكامل عندما يكون جميع سلالاتها محددة ومحددة جزئيًا (indeterminate) عند بعضها. النقر على تسمية العقدة يوسعها فقط، والاجتماع يتم عبر مربع الاختيار (كما في نسخة Vue3). يعرض المشغل تسميات جميع المفاتيح المحددة مفصولة بـ「、」.

## التعطيل

`disabled: true` في بيانات العقدة يعطل هذه العقدة (النقر لا يوسعها ولا يحددها، ومربع اختيارها غير قابل للنقر)؛ أما prop الخاص بـ `disabled` فيعطل المحدد بأكمله.

```vue
<template>
  <lh-tree-select v-model="value" :data="disabledData" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<string | undefined>(undefined)
const disabledData = [
  {
    key: 'zhinan',
    label: '指南',
    children: [
      {
        key: 'sheji',
        label: '设计指南',
        disabled: true,
        children: [{ key: 'yuansze', label: '颜色' }],
      },
      { key: 'shejiguize', label: '设计规则' },
    ],
  },
]
</script>
```

## TreeSelect API

### Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| modelValue | القيمة المرتبطة (فردي `string` / متعدد `string[]`، v-model محكوم) | `string \| string[] \| undefined` | — |
| data | بيانات الشجرة | `LhTreeNode[]` | `() => []` |
| multiple | تفعيل التحديد المتعدد (إظهار مربعات الاختيار، القيمة هي مصفوفة المفاتيح المحددة، تسلسل الأب-الابن) | `boolean` | `false` |
| disabled | تعطيل المحدد بأكمله | `boolean` | `false` |
| placeholder | نص مؤقت (عند عدم تمريره يؤخذ من حزمة اللغة `select.placeholder`) | `string` | — |
| customClass | فئة مخصصة (تمرر إلى العقدة الجذر) | `string` | — |
| themeVars | متغيرات السمة على مستوى المكوّن | `Record<string, string>` | — |
| sx | خصائص sx للتخطيط السريع (تُطبَّق على العنصر الجذر للمشغل، ولا تؤثر على اللوحة العائمة) | `LhSxProps` | — |

### Events

| الحدث | الوصف | المعاملات |
| --- | --- | --- |
| update:modelValue | يُطلق عند تغير القيمة المرتبطة | `(value: string \| string[] \| undefined)` |
| change | يُطلق عند تغير قيمة التحديد | `(value: string \| string[] \| undefined)` |

### بنية البيانات

تعريف نوع `LhTreeNode` (المصدر الحقيقي في `@lh-ui/share/core/tree`):

```ts
interface LhTreeNode {
  /** مفتاح فريد */
  key: string
  /** نص العرض */
  label: string
  /** العقد الفرعية */
  children?: LhTreeNode[]
  /** معطّلة */
  disabled?: boolean
  /** هل هي عقدة طرفية (تُستنتج من children عند عدم التمرير) */
  isLeaf?: boolean
}
```

### إمكانية الوصول

- يحمل المشغل `aria-haspopup="tree"` / `aria-expanded` / `aria-label` (مأخوذ من حزمة اللغة `treeSelect.triggerLabel`)
- اللوحة `role="listbox"`، والشجرة المضمّنة `role="tree"`، والعقد `role="treeitem` مع `aria-level` / `aria-expanded` / `aria-selected` / `aria-disabled`؛ في التحديد المتعدد تحمل اللوحة `aria-multiselectable` ومربعات الاختيار `role="checkbox"` مع `aria-checked` (`mixed` للتحديد الجزئي)
- المسافات الهرمية، ودوران سهم التوسيع، ومظهر مربع الاختيار ثلاثي الحالات تأتي جميعها من مصدر أنماط share (`@lh-ui/share/styles/tree`) دون تكرار للأنماط في هذا الطرف

::: tip اختلافات المنصات (الفروق عن نسخة Vue3)
- **تركيب لاصق بدل core مخصص**: لا يوجد وحدة tree-select في share core، وهذا الطرف يتبع شكل تطبيق plus ويجمع «مشغل select + لوحة lh-tree» — تضم اللوحة `lh-tree`، ويستهلك منطق الشجرة (التوسيع / التحديد / الاجتماع المتسلسل) دوال `core/tree` النقية (`flattenTree` / `toggleCheckKeys` / `getNodeCheckState` وغيرها) دون نسخ أي منطق. تتطابق API والأحداث مع plus دون إضافات من هذا الطرف.
- **لوحة عائمة**: يثبّت plus اللوحة تحت `Teleport to="body"`؛ أمّا على uni-app فتحملها `lh-root-portal` (تراجع إلى fixed داخل الصفحة على الإصدارات القديمة) ويتم التموضع بقياستين غير متزامنتين (رسم مخفي للقياس → `computePosition` للتموضع → العرض لمنع الوميض). حساب التموضع غير متزامن، فلا تفترض الحصول على نتيجة متزامنة.
- **تمرير لوحة الشجرة**: يستخدم `.lh-tree-select__panel` في scss الخاص بـ share الخاصية `overflow: auto`، لكن `view` في MP لا يملك تمريرًا موثوقًا للتجاوز، لذلك يتم لف الشجرة داخل اللوحة بطبقة `scroll-view` (`scroll-y`) للتمرير العمودي مع مطابقة الارتفاع الأقصى لقيمة shareوهي 320px.
- **لا يوجد تنقّل بلوحة المفاتيح**: يعتمد إغلاق Escape والاستماع على مستوى المستند في plus على أحداث لوحة المفاتيح التي لا توفرها البرامج المصغّرة، لذلك يُغلق هذا الطرف اللوحة بالنقر على قناع شفاف داخل الصفحة (مثل select / cascader) دون تقليل عبر الترجمة الشرطية.
- **`teleported` prop غير منقول**: يستخدمه plus للتحكم في تثبيت اللوحة على body؛ التراكبات على uni-app تمر دائمًا عبر `lh-root-portal` فلا وجود لهذه الدلالة.
- **الإغلاق عند النقر خارجها**: يستمع plus إلى نقرات document عبر `useLhClickOutside`؛ بينما يستخدم uni-app قناعًا شفافًا داخل الصفحة (النقر على القناع يغلق).
- **تصحيح حالة الاجتماع المحكومة**: لا يمرر plus قيمة `checked-keys` إلى الشجرة المضمّنة، لذلك لا تنعكس القيمة المسبقة في التحديد المتعدد على مربعات الاختيار؛ يمرر هذا الطرف `v-model` كـ `checked-keys` أيضًا فيتحرك مربعا الاختيار وعرض المشغل بكليهما عبر `v-model` دون تغيير API.
- **لا يوجد إغلاق تلقائي عند تمرير المشغل خارج إطار العرض**: لا يملك uni-app قناة موحَّدة لمراقبة التمرير / تغيير الحجم، لذلك لم يُنقل.
:::
