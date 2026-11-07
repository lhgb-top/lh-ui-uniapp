# BackTop العودة إلى الأعلى

زر "العودة إلى الأعلى" يظهر عند تجاوز التمرير عتبةً معيّنة. يأتي حكم الظهور
(`isBackTopVisible`) وأمر التمرير (`backToTop`) من الدوال النقية في core الخاص
بـ `@lh-ui/share`.

## اختلافات المنصات (مهم)

- **H5**: يستمع المكوّن بنفسه إلى حدث `scroll` الخاص بـ `window` (أو الحاوية
  `target`)؛ وعند النقر تُمرَّر الحاوية الهدف مباشرةً.
- **برنامج WeChat المصغر**: يجب تمرير `detail.scrollTop` لحدث التمرير الخاص
  بـ `scroll-view` عبر الـ prop `scrollTop` لقيادة الإظهار والإخفاء؛ وعند النقر
  يُطلِق المكوّن `update:scrollTop` (قيمته 0)، فإذا ربطته بخاصية `scroll-top`
  الخاصة بـ `scroll-view` يعود إلى الأعلى. عند عدم تمرير `target` يكون التمرير
  على مستوى الصفحة ويدعو المكوّن `uni.pageScrollTo` مباشرةً.

```vue
<template>
  <scroll-view
    class="my-scroll"
    :scroll-y="true"
    :scroll-top="scrollTop"
    @scroll="onScroll"
  >
    <!-- محتوى طويل -->
    <lh-backtop :scroll-top="scrollTop" @update:scroll-top="scrollTop = $event" />
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const scrollTop = ref(0)
function onScroll(event: { detail?: { scrollTop?: number } }) {
  scrollTop.value = event.detail?.scrollTop ?? 0
}
</script>
```

## الاستخدام الأساسي

```vue
<template>
  <lh-backtop :visibility-height="200" />
</template>
```

عندما تتجاوز الصفحة أو الحاوية `visibility-height` (200px افتراضيًا)، يظهر الزر
بانتقال تلاشيًا؛ وعند النقر يعود إلى الأعلى بتمرير سلس.

## المحتوى والموضع المخصّصان

```vue
<template>
  <lh-backtop :right="24" :bottom="80">
    <view class="my-backtop">الأعلى</view>
  </lh-backtop>
</template>
```

افتراضيًا يُعرَض زر دائري (مع أيقونة `arrow-up` مدمجة)؛ ويتحكم `right` /
`bottom` في الإزاحة من الزاوية السفلية اليمنى لإطار العرض؛ ويفصّل الـ slot
الافتراضي محتوى الزر.

## API

### Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| target | محدِّد حاوية التمرير في H5 (إطار العرض افتراضيًا؛ في MP يُستخدم فقط للتمييز بين العودة إلى الأعلى على مستوى الصفحة أو على مستوى scroll-view) | `string` | `-` |
| scrollTop | حقن موضع التمرير (MP: `detail.scrollTop` الخاص بـ scroll-view) | `number` | `-` |
| visibility-height | عدد البكسلات التي يُتجاوَزها في التمرير قبل الظهور | `number` | `200` |
| right | الإزاحة من الجهة اليمنى (px) | `number` | `40` |
| bottom | الإزاحة من الأسفل (px) | `number` | `40` |
| smooth | تمرير سلس | `boolean` | `true` |
| sx | خصائص تخطيط سريعة | `LhSxProps` | `-` |

### Events

| الحدث | الوصف | معامل الاستدعاء |
| --- | --- | --- |
| click | يُطلَق عند النقر على الزر (قبل أمر التمرير) | `(event: Event)` |
| scrollend | يُطلَق بعد توقّف التمرير (مضاد ارتداد 150ms) | `(scrollTop: number)` |
| update:scrollTop | عقد العودة إلى الأعلى في MP: القيمة 0، يُربط بـ scroll-top الخاص بـ scroll-view | `(scrollTop: number)` |

### Slots

| الاسم | الوصف |
| --- | --- |
| default | محتوى الزر (افتراضيًا أيقونة arrow-up) |
