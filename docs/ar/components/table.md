# Table جدول البيانات

جدول بيانات: ترويسات متعددة المستويات، وفرز، وتصفية، وتمرير افتراضي،
وخلايا مخصصة. بناء الترويسات (`buildHeaderCells`) والفرز (`sortTableRows`)
والتصفية (`filterTableRows`) والنطاق الافتراضي (`computeVisibleRange`)
وحساب أسماء الصفوف / إزاحات sticky كلها من الدوال النقية في نواة
`@lh-ui/share`.

## اختلافات المنصة (مهم)

- **التمرير الأفقي**: في H5 الترويسة والجسم حاولا تمرير مستقلتان وتتم
  مزامنة `scrollLeft` في الاتجاهين؛ أما في جهة WeChat فإن `scroll-view`
  الخارجي (scroll-x) يحرّك الجدول بأكمله أفقيًا، فتشترك الترويسة والجسم في
  محور تمرير واحد ولا حاجة لآلية مزامنة.
- **الأعمدة الثابتة (H5 فقط)**: تعتمد الأعمدة الثابتة على دعم
  `position: sticky` لخلايا الجدول وهو غير موثوق تحت WXSS، لذا تُستبعد
  أنماط الأعمدة الثابتة في MP وقت البناء (تغليف `#ifdef H5` في
  `build-styles`) وتتحول إلى أعمدة تمرير أفقي عادية.
- **سحب عرض العمود (H5 فقط)**: `mousedown` ودلالات لوحة المفاتيح غير
  موجودة في MP، لذا تُعرض مقابض السحب في H5 فقط.
- **خطوط التخطيط (stripe)**: قاعدة `:nth-child(even)` في share خاصة بـ H5
  (WXSS لا يدعم الفئات الكاذبة nth)، وفي MP يضيف القالب صنف `--alt` وفق
  فهرس الصف.
- **التمرير الافتراضي**: يستخدم H5 `clientHeight` + `ResizeObserver`،
  بينما يستخدم MP `detail.scrollTop` الخاص بـ `scroll-view` +
  `createSelectorQuery`.

## الاستخدام الأساسي

```vue
<template>
  <lh-table :data="rows" :columns="columns" />
</template>

<script setup lang="ts">
const rows = [
  { id: 1, name: 'المستخدم 1', age: 28, city: 'بكين' },
  { id: 2, name: 'المستخدم 2', age: 34, city: 'شنغهاي' },
]
const columns = [
  { prop: 'name', label: 'الاسم', width: 140 },
  { prop: 'age', label: 'العمر', width: 120, align: 'right' },
  { prop: 'city', label: 'المدينة', width: 160 },
]
</script>
```

## خطوط التخطيط والحدود

```vue
<template>
  <lh-table :data="rows" :columns="columns" stripe border />
</template>
```

## الفرز والتصفية

```vue
<template>
  <lh-table
    :data="rows"
    :columns="columns"
    @sort-change="onSort"
    @filter-change="onFilter"
  />
</template>

<script setup lang="ts">
const columns = [
  { prop: 'age', label: 'العمر', width: 120, sortable: true },
  {
    prop: 'city',
    label: 'المدينة',
    width: 160,
    filters: [
      { text: 'بكين', value: 'بكين' },
      { text: 'شنغهاي', value: 'شنغهاي' },
    ],
  },
]

function onSort(payload: { prop: string; order?: 'asc' | 'desc' }) {}
function onFilter(payload: { prop: string; values: (string | number)[] }) {}
</script>
```

يُبدّل النقر على ترويسة العمود القابل للفرز بين `لا شيء → تصاعدي → تنازلي`
(`cycleSortOrder`)؛ تحمل ترويسة العمود القابل للتصفية مُطلِق تصفية، وعند
تحديد العناصر في اللوحة وتأكيدها تُصفّى الصفوف (يمر منطق التصفية عبر
`filterTableRows` من share). تدعم حالة التصفية وضعَين: مُتحكم به
(`filtered-values`) وغير مُتحكم به (`default-filtered-values`).

## الأعمدة الثابتة والتمرير الأفقي (H5 فقط)

```vue
<template>
  <lh-table :data="rows" :columns="columns" />
</template>

<script setup lang="ts">
const columns = [
  { prop: 'name', label: 'الاسم', width: 140, fixed: 'left' },
  { prop: 'age', label: 'العمر', width: 120 },
  { prop: 'city', label: 'المدينة', width: 160 },
  { prop: 'status', label: 'الحالة', width: 120, fixed: 'right' },
]
</script>
```

يتطلب `fixed: 'left' / 'right'` عرضًا رقميًا؛ بالنسبة إلى MP راجع اختلافات
المنصة أعلاه.

## التمرير الافتراضي (عشرات الآلاف من الصفوف)

```vue
<template>
  <lh-table :data="hugeRows" :columns="columns" :height="360" />
</template>
```

يُفعّل ضبط `height` التمرير الافتراضي: يأخذ جسم الجدول ارتفاعًا ثابتًا ولا
يُعرض سوى النافذة المرئية زائد المنطقة الإضافية (`LH_TABLE_OVERSCAN = 3`)؛
ويجب أن يطابق `row-height` ارتفاع الصف الفعلي (الافتراضي 48).

## الخلايا المخصصة

```vue
<template>
  <lh-table :data="rows" :columns="columns">
    <template #status="{ row }">
      <lh-tag :type="row.status === 'active' ? 'success' : 'danger'">
        {{ row.status === 'active' ? 'مفعّل' : 'معطّل' }}
      </lh-tag>
    </template>
  </lh-table>
</template>

<script setup lang="ts">
const columns = [
  { prop: 'name', label: 'الاسم', width: 140 },
  { prop: 'status', label: 'الحالة', width: 140, slot: 'status' },
]
</script>
```

يُصرّح حقل `slot` في إعداد العمود عن منفذ مُسمّى ذي نطاق؛ ومعاملات المنفذ هي
`{ row, column, index, value }`.

## الترويسات متعددة المستويات

```vue
<script setup lang="ts">
const columns = [
  { prop: 'name', label: 'الاسم', width: 140 },
  {
    label: 'مجموعة',
    children: [
      { prop: 'age', label: 'العمر', width: 120 },
      { prop: 'city', label: 'المدينة', width: 160 },
    ],
  },
]
</script>
```

يُصرّح حقل `children` في إعداد العمود عن الأعمدة الفرعية؛ تُقسَّم صفوف
الترويسة تلقائيًا حسب المستوى وتُوضع عبر شبكة (`buildHeaderCells` يحسب
colspan / rowspan).

## API

### Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| data | بيانات الصفوف | `LhTableRow[]` | `[]` |
| columns | إعداد الأعمدة | `LhTableColumn[]` | `[]` |
| height | ارتفاع جسم الجدول (يُفعّل التمرير الافتراضي عند ضبطه) | `number \| string` | `-` |
| max-height | أقصى ارتفاع في وضع التمرير غير الافتراضي | `number \| string` | `-` |
| row-height | ارتفاع الصف في التمرير الافتراضي | `number` | `48` |
| stripe | خطوط التخطيط | `boolean` | `false` |
| border | حدود الخلايا | `boolean` | `false` |
| size | الحجم | `'small' \| 'default' \| 'large'` | `'default'` |
| row-key | اسم حقل مفتاح الصف | `string` | `'id'` |
| default-sort-prop | عمود الفرز الافتراضي | `string` | `-` |
| default-sort-order | اتجاه الفرز الافتراضي | `'asc' \| 'desc'` | `-` |
| sorter | دالة فرز مخصصة | `(a, b) => number` | `-` |
| resizable | تفعيل سحب عرض العمود (H5 فقط) | `boolean` | `false` |
| default-filtered-values | حالة التصفية الافتراضية (غير مُتحكم بها) | `Record<string, (string \| number)[]>` | `{}` |
| filtered-values | حالة التصفية المُتحكم بها | `Record<string, (string \| number)[]>` | `-` |
| sx | خصائص التخطيط السريع | `LhSxProps` | `-` |

### LhTableColumn

| الخاصية | الوصف | النوع |
| --- | --- | --- |
| prop | اسم الحقل | `string` |
| label | نص الترويسة | `string` |
| width | عرض العمود (الأرقام بوحدة px) | `number \| string` |
| align | المحاذاة | `'left' \| 'center' \| 'right'` |
| fixed | عمود ثابت (H5 فقط) | `'left' \| 'right'` |
| sortable | قابل للفرز | `boolean` |
| resizable | قابل للسحب (يتطلب التفعيل على مستوى العمود و`width` رقمي، H5 فقط) | `boolean` |
| filters | عناصر التصفية | `{ text, value }[]` |
| filter-multiple | تصفية متعددة الاختيار (true افتراضيًا) | `boolean` |
| formatter | تنسيق الخلية | `(row, value) => string` |
| slot | اسم المنفذ المُسمّى للخلايا المخصصة | `string` |
| children | الأعمدة الفرعية (ترويسات متعددة المستويات) | `LhTableColumn[]` |

### Events

| الحدث | الوصف | معاملات الاستدعاء |
| --- | --- | --- |
| sort-change | تغيّر الفرز | `(payload: { prop, order })` |
| row-click | النقر على صف | `(row, index)` |
| filter-change | تغيّرت التصفية | `(payload: { prop, values })` |
| update:filtered-values | تحديث التصفية المُتحكم بها | `(values)` |
| column-resize | تعديل عرض العمود (H5 فقط) | `(payload: { prop, width })` |

### المنافذ (Slots)

| المنفذ | الوصف | معاملات النطاق |
| --- | --- | --- |
| [منفذ العمود] | خلية مخصصة (الاسم يحدده `slot` في إعداد العمود) | `{ row, column, index, value }` |
| empty | محتوى البيانات الفارغة (افتراضيًا «لا توجد بيانات») | `-` |
