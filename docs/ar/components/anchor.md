# Anchor تنقّل المراسي

تنقّل المراسي: النقر يقفز إلى القسم المقابل، ومع التمرير يُبرز القسم الحالي تلقائيًا.
يأتي التسطيح (`flattenAnchorItems`) وحساب المرساة النشطة (`resolveActiveAnchor`) من
الدوال النقية في core الخاص بـ `@lh-ui/share`.

## فروقات المنصة (مهم)

- **H5**: يستمع المكوّن بنفسه إلى تمرير `window` (أو حاوية `target`)، ويتم تحديد
  موقع المرساة عبر `scrollIntoView` الأصلي.
- **برنامج WeChat المصغر**: يحتاج ربط التمرير إلى حقن `detail.scrollTop` الخاص بـ
  `scroll-view` عبر خاصية `scrollTop`؛ وعند النقر على مرساة يُطلق المكوّن
  `update:scrollIntoView` (معرّف القسم المستهدف)، الذي يُربط بخاصية
  `scroll-into-view` الخاصة بـ `scroll-view` لإتمام تحديد الموقع. عند عدم تمرير
  `target` يكون التحديد على مستوى الصفحة، ويستدعي المكوّن
  `uni.pageScrollTo({ selector })` مباشرة.

```vue
<template>
  <scroll-view
    class="my-scroll"
    :scroll-y="true"
    :scroll-into-view="anchorTarget"
    @scroll="onScroll"
  >
    <view id="section-a" class="my-section">区块 A</view>
    <view id="section-b" class="my-section">区块 B</view>
    <lh-anchor
      :items="items"
      :scroll-top="scrollTop"
      @update:scroll-into-view="anchorTarget = $event"
    />
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const items = [
  { id: 'section-a', title: '区块 A' },
  { id: 'section-b', title: '区块 B' },
]
const scrollTop = ref(0)
const anchorTarget = ref('')
function onScroll(event: { detail?: { scrollTop?: number } }) {
  scrollTop.value = event.detail?.scrollTop ?? 0
}
</script>
```

## الاستخدام الأساسي

```vue
<template>
  <lh-anchor :items="items" />
</template>

<script setup lang="ts">
const items = [
  { id: 'section-a', title: '区块 A' },
  {
    id: 'group-b',
    title: 'B 组',
    children: [
      { id: 'section-b', title: '区块 B' },
      { id: 'section-c', title: '区块 C' },
    ],
  },
]
</script>
```

يدعم `items` العناصر الفرعية (`children`)، وتُسطَّح بترتيب العمق أولًا عند العرض
مع إضافة مسافة بادئة تلقائيًا. قاعدة حساب المرساة النشطة: العنصر النشط هو آخر
مرساة "تجاوز حافتها العلوية خط عتبة `offset`" عند التمرير.

## الترتيب الأفقي

```vue
<template>
  <lh-anchor :items="items" direction="horizontal" />
</template>
```

## API

### الخصائص (Props)

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| items | بيانات المراسي (تدعم العناصر الفرعية children) | `LhAnchorItem[]` | `[]` |
| target | محدد حاوية التمرير في H5 (window افتراضيًا) | `string` | — |
| scrollTop | حقن موضع التمرير (MP: `detail.scrollTop` الخاص بـ scroll-view) | `number` | — |
| offset | عتبة الحساب النشط (المسافة من الحافة العلوية للقسم إلى أعلى الحاوية) | `number` | `0` |
| direction | اتجاه الترتيب | `'vertical' \| 'horizontal'` | `'vertical'` |
| smooth | تمرير سلس | `boolean` | `true` |
| sx | خصائص تخطيط سريعة | `LhSxProps` | — |

### الأحداث (Events)

| الحدث | الوصف | وسائط الاستدعاء |
| --- | --- | --- |
| change | يُطلق عند تغيّر المرساة النشطة | `(id: string)` |
| click | يُطلق عند النقر على عنصر المرساة (قبل تحديد موضع التمرير) | `(id: string)` |
| update:scrollIntoView | عقد تحديد الموقع في MP: معرّف القسم المستهدف، يُربط بـ scroll-into-view | `(id: string)` |
