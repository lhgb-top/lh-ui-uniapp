# Tree (عنصر الشجرة)

عرض بيانات هرمية والتفاعل معها. كل المنطق النقي — التوسيع / الطي، وتتالي مربعات الاختيار،
ودمج التحميل الكسول — يُستهلك مباشرةً من الدوال النقية في نواة `@lh-ui/share`
(`flattenTree` / `toggleCheckKeys` / `mergeLoadedChildren` وغيرها)؛ طبقة المكوّن مسؤولة فقط
عن العرض والأحداث والتنقل بلوحة المفاتيح.

## الاستخدام الأساسي

```vue
<template>
  <lh-tree :data="treeData" :default-expanded-keys="['a']" />
</template>

<script setup lang="ts">
import type { LhTreeNode } from '@lh-ui/share/core/tree'

const treeData: LhTreeNode[] = [
  {
    key: 'a',
    label: 'الواجهة الأمامية',
    children: [
      { key: 'a-1', label: 'Vue' },
      { key: 'a-2', label: 'React' },
    ],
  },
  { key: 'b', label: 'الواجهة الخلفية', children: [{ key: 'b-1', label: 'Node' }] },
  { key: 'c', label: 'DevOps', disabled: true },
]
</script>
```

`data` هي `LhTreeNode[]`: `key` فريد، و`label` نص العرض، و`children` العقد الفرعية،
و`disabled` للتعطيل، و`isLeaf` تدل على كونها طرفية (تُستنتج من `children` عند الحذف).
يُحمل انزياح المستوى بنمط مضمّن `level * 18 + 8` بكسل. النقر على الصف بالكامل يحدد العقدة
(`update:selectedKeys` / `select`)؛ مع `expandOnClickNode` مفعّلاً (افتراضياً)، نقر عقدة غير
طرفية يوسّعها / يطويها أيضاً؛ أما نقر السهم فيبدّل التوسيع فقط.

## قابلة للاختيار (تتالي)

`show-checkbox` يعرض مربعات الاختيار. اختيار الأصل يتتالى إلى كل الأبناء؛ عند تحديد كل
الأبناء يُحدد الأصل تلقائياً، والتحديد الجزئي يُظهر حالة وسيطة (indeterminate).

```vue
<template>
  <lh-tree :data="treeData" show-checkbox :default-expanded-keys="['a', 'b']" />
</template>
```

تُحمل مجموعة التحديد عبر `default-checked-keys` (غير مُتحكم بها) أو
`v-model:checked-keys` (مُتحكم بها)، وتُمرَّر التغييرات عبر حدثي `update:checkedKeys` /
`check`. مع `checkStrictly` يؤثر التحديد على العقدة نفسها فقط: بلا تتالي للأبناء، وبلا
رجوع للأصول، وبلا حالة وسيطة.

## التحميل الكسول

مع تفعيل `lazy`، يؤدي توسيع عقدة غير مُحمّلة إلى استدعاء دالة `load`
(`resolve` تسلّم العقد الفرعية وتُوسّع، و`reject` أو استثناء يُلغي)؛ أثناء التحميل يدور السهم.

```vue
<template>
  <lh-tree :data="lazyData" lazy :load="loadNodes" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhTreeNode } from '@lh-ui/share/core/tree'

const lazyData = ref<LhTreeNode[]>([{ key: 'lazy', label: 'انقر للتحميل', isLeaf: false }])

function loadNodes(
  node: LhTreeNode,
  resolve: (children: LhTreeNode[]) => void,
  reject: (reason?: unknown) => void,
) {
  // محاكاة طلب غير متزامن
  setTimeout(() => {
    if (node.key === 'lazy') {
      resolve([
        { key: 'lazy-1', label: 'عقدة فرعية 1', isLeaf: true },
        { key: 'lazy-2', label: 'عقدة فرعية 2', isLeaf: true },
      ])
    } else {
      reject(new Error('nothing to load'))
    }
  }, 600)
}
</script>
```

يجب أن تُصرّح العقدة القابلة للتحميل بـ `isLeaf: false` صراحةً (وإلا فالعقدة بلا `children`
تُستنتج كطرفية ولا يظهر لها سهم توسيع)؛ إذا كانت العقد الفرعية المحمّلة فروعاً تنتظر التحميل
أيضاً فصرّح لها بـ `isLeaf: false`، وللأوراق الحقيقية بـ `isLeaf: true`. تُدمج نتائج التحميل
بشكل غير قابل للتغيير في `props.data` عبر `mergeLoadedChildren` من share — لا تُعدَّل بيانات
المستخدم أبداً؛ ويُرافق وصول العقد الفرعية حدث `nodeLoad`.

## التحديد والمفاتيح المُتحكم بها

`multiple` يسمح بالتحديد المتعدد (نقر العقدة يبدّل التحديد بدل الاستبدال)؛
`default-selected-keys` / `v-model:selected-keys` للتحكم بالتحديد؛
`default-expanded-keys` / `v-model:expanded-keys` للتحكم بالتوسيع؛
`disabled` يُعطّل الشجرة بأكملها (لا يستجيب للنقر ولا للضغط على المفاتيح).

```vue
<template>
  <lh-tree
    v-model:selected-keys="selKeys"
    v-model:checked-keys="chkKeys"
    :data="ctrlData"
    multiple
    :default-expanded-keys="['x']"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhTreeNode } from '@lh-ui/share/core/tree'

const selKeys = ref(['x'])
const chkKeys = ref(['x-1'])
const ctrlData: LhTreeNode[] = [
  {
    key: 'x',
    label: 'التصميم',
    children: [{ key: 'x-1', label: 'اللون' }, { key: 'x-2', label: 'الخط' }],
  },
  { key: 'y', label: 'الهندسة' },
]
</script>
```

## التخيّل للبيانات الضخمة (حصري لـ uni-app)

لمئات أو آلاف العقد فعّل `virtual`: تُحمل قائمة العقد في `scroll-view` وتُعرض بالنوافذ
بارتفاع صف ثابت 34 بكسل (القيمة الافتراضية لـ `--lh-tree-node-height`)، فلا تُرسم سوى
المنطقة المرئية مع هامش علوي وسفلي؛ يحدد `virtualHeight` ارتفاع scroll-view
(الأرقام بالبكسل، والنصوص تُكتب كما هي، افتراضياً 300 بكسل).

```vue
<template>
  <lh-tree :data="bigData" virtual :virtual-height="320" />
</template>
```

يلزم ألا يلتف محتوى العقدة إلى أكثر من سطر (نمط share `.lh-tree-node__label` يفرض `nowrap`
مع علامة الحذف). بدون `virtual` تُعرض العقد مباشرةً تحت الحاوية الجذر، بنفس بنية نسخة Vue3.

## المنافذ (Slots)

منفذ `node` ذو النطاق يستقبل `{ node, level, expanded, selected }` لتخصيص محتوى العقدة؛
منفذ `empty` يخصّص حالة الفراغ (افتراضياً مفتاح اللغة `tree.empty`، العربية «لا توجد بيانات»).

```vue
<template>
  <lh-tree :data="treeData">
    <template #node="{ node, level }">
      <text>{{ level > 0 ? '· ' : '' }}{{ node.label }}</text>
    </template>
  </lh-tree>
</template>
```

## API

### Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| data | بيانات الشجرة | `LhTreeNode[]` | — |
| showCheckbox | إظهار مربعات الاختيار | `boolean` | `false` |
| multiple | تحديد متعدد (تبديل بدل الاستبدال) | `boolean` | `false` |
| expandOnClickNode | توسيع / طي العقد غير الطرفية عند نقر الصف | `boolean` | `true` |
| defaultExpandedKeys | مفاتيح التوسيع الافتراضية (غير مُتحكم بها) | `string[]` | `[]` |
| expandedKeys | مفاتيح التوسيع المُتحكم بها | `string[]` | — |
| defaultSelectedKeys | مفاتيح التحديد الافتراضية (غير مُتحكم بها) | `string[]` | `[]` |
| selectedKeys | مفاتيح التحديد المُتحكم بها | `string[]` | — |
| defaultCheckedKeys | مفاتيح الاختيار الافتراضية (غير مُتحكم بها) | `string[]` | `[]` |
| checkedKeys | مفاتيح الاختيار المُتحكم بها | `string[]` | — |
| checkStrictly | عدم تأثير الأصل والابن (العقدة نفسها فقط، بلا تتالي وحالة وسيطة) | `boolean` | `false` |
| lazy | الوضع الكسول (استدعاء load عند توسيع عقدة غير محمّلة) | `boolean` | `false` |
| load | دالة الكسول (resolve تسلّم الأبناء وتُوسّع، reject تُلغي) | `(node: LhTreeNode, resolve: (children: LhTreeNode[]) => void, reject: (reason?: unknown) => void) => void` | — |
| disabled | تعطيل الشجرة بالكامل | `boolean` | `false` |
| virtual | التخيّل للبيانات الضخمة (حصري لـ uni-app) | `boolean` | `false` |
| virtualHeight | ارتفاع scroll-view الوهمي (رقم بالبكسل / نص كما هو) | `number \| string` | `300` |
| sx | خصائص التخطيط السريع sx | `LhSxProps` | — |

### Events

| الحدث | الوصف | المعاملات |
| --- | --- | --- |
| update:expandedKeys | تغيّرت قائمة مفاتيح التوسيع (لـ v-model:expanded-keys) | `(keys: string[])` |
| update:selectedKeys | تغيّرت قائمة مفاتيح التحديد (لـ v-model:selected-keys) | `(keys: string[])` |
| update:checkedKeys | تغيّرت قائمة مفاتيح الاختيار (لـ v-model:checked-keys) | `(keys: string[])` |
| select | عند تحديد / تبديل عقدة بالنقر | `(key: string, node: LhTreeNode)` |
| check | بعد تغيّر مجموعة الاختيار | `(keys: string[], node: LhTreeNode)` |
| expand | بعد توسيع / طي عقدة | `(key: string, expanded: boolean)` |
| nodeLoad | بعد وصول العقد الفرعية للتحميل الكسول | `(node: LhTreeNode, children: LhTreeNode[])` |

### Slots

| المنفذ | الوصف |
| --- | --- |
| node | محتوى العقدة (بنطاق `{ node, level, expanded, selected }`) |
| empty | حالة الفراغ (افتراضياً مفتاح اللغة `tree.empty`) |

### LhTreeNode

| الحقل | الوصف | النوع |
| --- | --- | --- |
| key | المفتاح الفريد | `string` |
| label | نص العرض | `string` |
| children | العقد الفرعية | `LhTreeNode[]` |
| disabled | معطّل | `boolean` |
| isLeaf | هل هي طرفية (تُستنتج من children عند الحذف) | `boolean` |

### إمكانية الوصول

- `role="tree"` + `role="treeitem"`، مع تعريض `aria-level` / `aria-expanded` / `aria-selected` / `aria-disabled` بالكامل
- مربعات الاختيار تحمل `role="checkbox"` + `aria-checked` (`mixed` للحالة الوسيطة)

::: tip فروقات المنصة (الفروقات عن نسخة Vue3)
- **التخيّل قدرة حصرية في هذه الحزمة**: للبيانات الضخمة (مئات أو آلاف العقد) يُوصى بـ
  `virtual`؛ تُحمل قائمة العقد في `scroll-view` وتُعرض بالنوافذ بارتفاع صف ثابت 34 بكسل
  (المنطقة المرئية + هامش)، ويتحكم `virtualHeight` في ارتفاع إطار العرض. يجب أن يبقى محتوى
  العقدة في سطر واحد؛ بدون `virtual` تُعرض العقد مباشرةً تحت الحاوية الجذر.
- **التنقل بلوحة المفاتيح في H5 فقط**: مفاتيح نمط APG tree — ↑/↓ للتنقل بين العناصر (تخطّي
  المعطّلة، تكرار دوري)، → لتوسيع عقدة أو الانتقال إلى أول ابن، ← للطي أو الصعود إلى الأب،
  Home/End إلى الطرفين، Enter/Space للتنشيط — تعمل في H5 فقط؛ لا يتمتع البرنامج المصغر
  بأحداث لوحة مفاتيح وتُستأصل الكتلة بالكامل عبر الترجمة الشرطية (لا كود ميت في حزمة MP)،
  وكذلك لا يُنتج roving tabindex إلا في H5.
- **انزياه RTL**: يستخدم انزياح المستوى النمط المادي `padding-left` في كلا الوجهتين
  (يتسق مع قرار المستودع القائم «RTL ثابت في MP»)؛ إذا احتجت إلى انعكاس RTL في H5 فتجاوزه
  عند جهة الاستهلاك.
- **السهم مرسوم ذاتياً**: سهم التوسيع هو المحرف `▸` محمولاً على `view` (الدوران ودوران
  التحميل من تحويلات CSS الصرفة)، دون الاعتماد على خط أيقونات.
:::
