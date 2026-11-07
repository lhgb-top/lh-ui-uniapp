# ColorPicker منتقي الألوان

انقر على المُشغِّل ليَنبثق لوح مزج الألوان: سحب على لوح الإشباع / الإضاءة + شريطا درجة اللون /
الشفافية + إدخال hex / rgb + لوحة ألوان معرّفة مسبقًا. كل تحويلات الألوان تأتي من الدوال النقية
في `@lh-ui/share/core/color-picker` (تحويل ذهاباً وإياباً بين فضاءَي hex/rgb وHSV، مع قصر القنوات
على مداها طوال الوقت)، والتصيير متطابق بين H5 وبرنامج WeChat المصغّر.

## الاستخدام الأساسي

```vue
<template>
  <lh-color-picker v-model="color" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const color = ref('#2B4C7C')
</script>
```

## الشفافية ولوحة الألوان المعرّفة مسبقًا

```vue
<template>
  <lh-color-picker
    v-model="color"
    show-alpha
    :predefine="predefine"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const color = ref('rgba(43, 76, 124, 0.6)')
// بعد تفعيل showAlpha يُخرَج hex بثماني خانات (#2b4c7c99) ويُخرَج rgb بصيغة rgba() — لن تُفقد قيمة alpha بصمت أبداً
const predefine = ['#2B4C7C', '#5B8C5A', '#C4A35A', '#B23A3A']
</script>
```

## تنسيق الإخراج

```vue
<lh-color-picker v-model="color" format="rgb" />
```

`format` يؤثر فقط على شكل مخرجات `v-model` (`hex` أو `rgb`)، والقيم غير الصالحة تتراجع إلى `hex`.

## الحجم / المسح / التعطيل

```vue
<lh-color-picker v-model="color" size="small" />
<lh-color-picker v-model="color" clearable />
<lh-color-picker v-model="color" disabled />
```

عند تفعيل `clearable` يظهر زر مسح داخل المُشغِّل ما دامت هناك قيمة، والنقر عليه يُفرِّغ القيمة ويُرسل حدث `clear`.

## الفتح والإغلاق البرمجي

```vue
<template>
  <lh-color-picker ref="pickerRef" v-model="color" />
  <lh-button size="small" @click="pickerRef?.open()">فتح اللوحة</lh-button>
</template>
```

يُكشف المكوّن عبر ref كل من `open` / `close` / `isOpen`.

## ColorPicker API

### Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| model-value | القيمة المرتبطة (v-model مُتحكَّم به؛ سلسلة hex أو rgb()، وتُخرَج وفق format) | string | `''` |
| format | تنسيق الإخراج (القيم غير الصالحة تتراجع إلى hex) | `'hex' \| 'rgb'` | `hex` |
| show-alpha | قناة الشفافية (بعد التفعيل يُخرَج hex بثماني خانات / rgba()) | boolean | `false` |
| predefine | لوحة ألوان معرّفة مسبقًا | string[] | `[]` |
| size | الحجم | `'mini' \| 'small' \| 'medium' \| 'large' \| 'x-large'` | `medium` |
| disabled | التعطيل | boolean | `false` |
| clearable | زر المسح (إفراغ القيمة) | boolean | `false` |
| placeholder | نص العنصر النائب (عند فراغ القيمة؛ وإن لم يُمرَّر يؤخذ من حزمة اللغة colorPicker.placeholder) | string | `''` |
| aria-label | اسم إمكانية الوصول (إن لم يُمرَّر يؤخذ من حزمة اللغة colorPicker.label) | string | — |
| custom-class | صنف مخصّص (يُمرَّر إلى العقدة الجذر) | string | — |
| sx | خصائص التخطيط السريعة (sx) | LhSxProps | — |

### Events

| الحدث | الوصف | المعاملات |
| --- | --- | --- |
| update:model-value | تغيّر اللون (v-model) | `(value: string)` |
| change | تأكيد تغيّر اللون (نفس حمولة update:model-value) | `(value: string)` |
| clear | النقر على زر المسح | — |

### Expose

| الدالة | الوصف |
| --- | --- |
| open | فتح اللوحة |
| close | إغلاق اللوحة |
| isOpen | هل اللوحة مفتوحة (ref) |

### إمكانية الوصول

- المُشغِّل يحمل `role="button"` + `aria-expanded` + `aria-label` (حزمة اللغة colorPicker.label).
- شريطا درجة اللون / الشفافية يحملان `role="slider"` + `aria-valuenow/min/max`، مع الضبط الدقيق بمفاتيح الأسهم (وShift للتسريع).
- كل خانة من خانات لوحة الألوان المعرّفة مسبقًا قابلة للنقر، واسمها المتاح هو سلسلة قيمة اللون نفسها.

::: tip اختلافات المنصّة (الاختلافات عن إصدار Vue3)
- **محور السحب**: يُرسَل touchmove / touchend إلى هدف اللمس نفسه في MP (دون حاجة إلى مستمعات
  document)، ويستخدم H5 إضافةً مستمع فأرة على مستوى document (يمكن متابعة السحب بعد الخروج من
  المكوّن)، والنمط مطابق لما في Slider.
- **إدخالا hex / rgb داخل اللوحة** يستخدمان `<input>` الخاص بـ uni: الإرسال بنقرة Enter يمر عبر
  `@confirm` (زر «تم» في لوحة المفاتيح)، والإرسال عند فقدان التركيز يمر عبر `@blur`
  (لا يملك MP حدث keydown.enter).
- **تفاعل لوحة المفاتيح** (الضبط الدقيق بالأسهم، وEnter / Space للفتح والإغلاق، وEsc للإغلاق) يعمل في H5 فقط؛ فليس لدى MP أحداث لوحة مفاتيح.
- **تموضع اللوحة** يتم عبر root-portal + قياس بإطارين (قياس → تموضع → إظهار، لمنع الوميض).
:::
