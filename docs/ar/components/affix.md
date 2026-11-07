# Affix تثبيت

يثبّت المحتوى في أعلى أو أسفل إطار العرض. يأتي قرار الحالة الثابتة
(`isAffixFixed`) والنمط الثابت (`getAffixFixedStyle`) من الدوال النقية في نواة
`@lh-ui/share`، بينما تتحمل طبقة المكوّن فقط الاشتراك في التمرير وقياس العنصر
النائب والربط التفاعلي.

## اختلافات المنصة (مهم)

تختلف دلالات التمرير بين H5 وبرنامج WeChat المصغر، لذا يعتمد هذا المكوّن
نهجاً مزدوجاً للطرفين:

- **H5**: يستمع المكوّن بنفسه إلى حدث `scroll` الخاص بـ `window` (أو الحاوية
  التي يشير إليها محدد `target`)، ويستخدم `getBoundingClientRect` للعنصر
  النائب لتحديد حالة التثبيت.
- **برنامج WeChat المصغر**: لا يمكن ربط حدث `scroll` إلا بعلامة `scroll-view`،
  لذا لا يمكن للمكوّن الاشتراك بنفسه. ضع المكوّن داخل `scroll-view` ومرّر
  `detail.scrollTop` لحدث التمرير عبر الخاصية `scrollTop`:

```vue
<template>
  <scroll-view
    class="my-scroll"
    :scroll-y="true"
    :scroll-top="scrollTop"
    @scroll="onScroll"
  >
    <lh-affix :scroll-top="scrollTop" :offset-top="20">
      <view class="my-bar">شريط مثبّت علوي</view>
    </lh-affix>
    <!-- محتوى طويل -->
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

في H5، عند عدم تمرير `scrollTop`، يستمع المكوّن تلقائياً إلى `window`؛ وعند
تمرير محدد `target` يستمع إلى الحاوية المقابلة.

## الاستخدام الأساسي

```vue
<template>
  <lh-affix :offset-top="20">
    <lh-button type="primary">زر مثبّت علوي</lh-button>
  </lh-affix>
</template>
```

عندما يتجاوز المحتوى أثناء التمرير `offset-top` يُثبَّت في أعلى إطار العرض؛
وبعد التثبيت يحافظ العنصر النائب على موضع المستند بارتفاعه الأصلي فلا يقفز
المحتوى التالي.

## وضع التثبيت السفلي

```vue
<template>
  <lh-affix :offset-bottom="24">
    <view class="my-bar">شريط مثبّت سفلي</view>
  </lh-affix>
</template>
```

يأخذ `offset-bottom` الأولوية على `offset-top`: عند تجاوز الحافة السفلية
للعنصر النائب لـ "ارتفاع إطار العرض - offset-bottom" يتم التثبيت في الأسفل.

## API

### Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| offset-top | عدد البكسلات من أعلى إطار العرض التي تُفعّل التثبيت العلوي | `number` | `0` |
| offset-bottom | عدد البكسلات من أسفل إطار العرض التي تُفعّل التثبيت السفلي (له الأولوية على offset-top) | `number` | `0` |
| target | محدد حاوية التمرير في H5 (إطار العرض افتراضياً؛ لا أثر له في MP) | `string` | `-` |
| scrollTop | حقن موضع التمرير (MP: `detail.scrollTop` الخاص بـ scroll-view) | `number` | `-` |
| sx | خصائص التخطيط السريع (تباعد / حجم / flex) | `LhSxProps` | `-` |

### Events

| الحدث | الوصف | معاملات الاستدعاء |
| --- | --- | --- |
| change | يُطلق عند تغيّر الحالة الثابتة | `(fixed: boolean)` |

### Slots

| الفتحة | الوصف |
| --- | --- |
| default | المحتوى المطلوب تثبيته |
