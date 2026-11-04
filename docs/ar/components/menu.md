# Menu قائمة التنقل

قائمة تنقّل للصفحات والوظائف. تدعم وضعَي تخطيط — عمودي (افتراضي) وأفقي — مع إمكانية تعشيش القوائم الفرعية recursively؛ يُحمَل العنصر النشط في `v-model`، ويمكن التحكّم بمجموعة العناصر الموسّعة (`openeds`) أو تركها كحالة داخلية (`default-openeds`).

## الاستخدام الأساسي

```vue
<template>
  <lh-menu v-model="active">
    <lh-menu-item index="1">الرئيسية</lh-menu-item>
    <lh-menu-item index="2">الأعمال</lh-menu-item>
    <lh-menu-item index="3">حول</lh-menu-item>
  </lh-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('1')
</script>
```

`index` هو المُعرِّف الفريد للعنصر، ويُبعث مع حدث `select` عند النقر على عنصر طرفي (ويُبعث حدث `update:modelValue` في الوقت نفسه، فيمكن استقباله عبر `v-model`).

## القوائم الفرعية والتوسيع الافتراضي

```vue
<template>
  <lh-menu v-model="active" :default-openeds="['2']" @select="onSelect">
    <lh-menu-item index="1">الرئيسية</lh-menu-item>
    <lh-sub-menu index="2" title="أعمالي">
      <lh-menu-item index="2-1">رسم الحبر</lh-menu-item>
      <lh-menu-item index="2-2">رسم الغونغبي</lh-menu-item>
    </lh-sub-menu>
  </lh-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('')
function onSelect(index: string, indexPath: string[]) {
  console.log(index, indexPath)
}
</script>
```

يمكن تعشيش القوائم الفرعية عدة مستويات: `indexPath` لحدث `select` هو المسار الكامل من القائمة الفرعية الأكثر خروجًا إلى العنصر المختار (مثل `['2', '2-1', '2-1-1']`).

## الأكورديون

يجعل `unique-opened` موسّعًا كحدٍّ أقصى قائمةً فرعية واحدة في كل مرة (النقر مجددًا على عنوان موسّع يطويه، ويسمح بطيّ الكل).

```vue
<template>
  <lh-menu v-model="active" unique-opened>
    <lh-sub-menu index="1" title="المجموعة الأولى">
      <lh-menu-item index="1-1">خيار 1-1</lh-menu-item>
    </lh-sub-menu>
    <lh-sub-menu index="2" title="المجموعة الثانية">
      <lh-menu-item index="2-1">خيار 2-1</lh-menu-item>
    </lh-sub-menu>
  </lh-menu>
</template>
```

## التوسيع المُتحكَم فيه

تمرير `openeds` ينقل إلى الوضع المُتحكَم: لم يعد المكوّن يحافظ على حالة التوسيع داخليًا، بل تقودها دالة الاستدعاء `update:openeds`.

```vue
<template>
  <lh-menu v-model="active" :openeds="openeds" @update:openeds="openeds = $event">
    <lh-sub-menu index="1" title="قائمة فرعية مُتحكَم بها">
      <lh-menu-item index="1-1">خيار 1-1</lh-menu-item>
    </lh-sub-menu>
  </lh-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('')
const openeds = ref<string[]>(['1'])
</script>
```

## التجميع

يجمع `lh-menu-item-group` العناصر المتشابهة (تجميع بصري فقط، لا يشارك في منطق التوسيع).

```vue
<template>
  <lh-menu v-model="active">
    <lh-menu-item-group title="المحتوى الأساسي">
      <lh-menu-item index="1">المقالات</lh-menu-item>
      <lh-menu-item index="2">الصور</lh-menu-item>
    </lh-menu-item-group>
    <lh-menu-item-group title="الوظائف المتقدمة">
      <lh-menu-item index="3">تحليل البيانات</lh-menu-item>
    </lh-menu-item-group>
  </lh-menu>
</template>
```

## الوضع الأفقي

```vue
<template>
  <lh-menu v-model="active" mode="horizontal">
    <lh-menu-item index="1">الرئيسية</lh-menu-item>
    <lh-sub-menu index="2" title="معرض الأعمال">
      <lh-menu-item index="2-1">رسم الحبر</lh-menu-item>
      <lh-menu-item index="2-2">رسم الغونغبي</lh-menu-item>
    </lh-sub-menu>
    <lh-menu-item index="3">حول</lh-menu-item>
  </lh-menu>
</template>
```

في الوضع الأفقي تنبثق القوائم الفرعية من أسفل عنوانها (`bottom-start`)، أما المستويات المتداخلة فتنبثق من الجهة اليمنى (`right-start`).

## الوضع المطوي

الوضع العمودي مع `collapse` يطوي القائمة إلى شريط ضيّق، وتتحول القوائم الفرعية حينها إلى لوحات منبثقة على اليمين.

```vue
<template>
  <lh-menu v-model="active" collapse>
    <lh-sub-menu index="1" title="البريد">
      <lh-menu-item index="1-1">صندوق الوارد</lh-menu-item>
      <lh-menu-item index="1-2">المرسَلة</lh-menu-item>
    </lh-sub-menu>
    <lh-menu-item index="2">المسودات</lh-menu-item>
  </lh-menu>
</template>
```

## Menu API

### Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| modelValue | العنصر النشط (v-model؛ يُحافَظ عليه داخليًا عند الحذف) | `string` | — |
| mode | وضع التخطيط | `'horizontal' \| 'vertical'` | `'vertical'` |
| collapse | يطوي القائمة العمودية إلى شريط أيقونات (تتحول القوائم الفرعية إلى لوحات منبثقة) | `boolean` | `false` |
| defaultOpeneds | مفاتيح القوائم الفرعية الموسّعة افتراضيًا (غير مُتحكَم بها) | `string[]` | `[]` |
| openeds | مفاتيح القوائم الفرعية الموسّعة (مُتحكَم بها) | `string[]` | — |
| uniqueOpened | أكورديون: توسيع قائمة فرعية واحدة كحد أقصى في كل مرة | `boolean` | `false` |
| sx | خصائص التخطيط السريعة | `LhSxProps` | — |

### Events

| الحدث | الوصف | المعاملات |
| --- | --- | --- |
| select | عند اختيار عنصر طرفي | `(index: string, indexPath: string[])` |
| open | عند توسيع قائمة فرعية | `(index: string, indexPath: string[])` |
| close | عند طيّ قائمة فرعية | `(index: string, indexPath: string[])` |
| update:modelValue | تغيّر العنصر النشط (v-model) | `(value: string)` |
| update:openeds | تغيّر مجموعة التوسيع | `(value: string[])` |

### Slots

| Slot | الوصف |
| --- | --- |
| default | محتوى القائمة (تركيب من `LhMenuItem` / `LhSubMenu` / `LhMenuItemGroup`) |

## MenuItem API

### Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| index | المُعرِّف الفريد (مطلوب) | `string` | — |
| disabled | معطّل (يحتفظ بدلالة aria-disabled؛ لا يُطلِق النقر ولا التنشيط بلوحة المفاتيح) | `boolean` | `false` |
| sx | خصائص التخطيط السريعة | `LhSxProps` | — |

### Events

| الحدث | الوصف | المعاملات |
| --- | --- | --- |
| click | عند النقر على عنصر طرفي (لا يُطلَق للعناصر المعطّلة) | `(index: string)` |

## SubMenu API

### Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| index | المُعرِّف الفريد (مطلوب) | `string` | — |
| title | العنوان (يتوفر أيضًا slot باسم title) | `string` | — |
| disabled | معطّل | `boolean` | `false` |
| sx | خصائص التخطيط السريعة | `LhSxProps` | — |

### Events

| الحدث | الوصف | المعاملات |
| --- | --- | --- |
| select | عند اختيار عنصر طرفي سليل (يضم المسار مفتاح هذا المستوى) | `(index: string, indexPath: string[])` |

### Slots

| Slot | الوصف |
| --- | --- |
| default | محتوى القائمة الفرعية (يمكن تعشيش المزيد من `LhMenuItem` / `LhSubMenu`) |
| title | محتوى العنوان المخصّص |

## MenuItemGroup API

### Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| title | عنوان المجموعة (يتوفر أيضًا slot باسم title) | `string` | — |
| sx | خصائص التخطيط السريعة | `LhSxProps` | — |

### Slots

| Slot | الوصف |
| --- | --- |
| default | محتوى المجموعة |
| title | عنوان المجموعة المخصّص |

### إمكانية الوصول

- الحاوية `role="menu"` (`role="menubar"` في الوضع الأفقي)؛ والعناصر الطرفية وعناوين القوائم الفرعية هي `role="menuitem"`، وتُخرِج العناصر المعطّلة `aria-disabled`، أما عناوين القوائم الفرعية فتحمل أيضًا `aria-expanded` / `aria-haspopup` / `aria-controls`
- يتبع لوحة المفاتيح نمط قوائم APG (في H5 فقط): في الوضع العمودي يتنقّل ↑/↓ بين العناصر المرئية دورانيًا (متخطيًا المعطّل منها والعناصر داخل اللوحات المطوية)، ويقفز Home/End إلى الطرفين؛ وينشّط Enter/Space العنصر الطرفي؛ وعلى عنوان قائمة فرعية يوسّع Enter/Space/→ وينقل التركيز داخل اللوحة، بينما يطوي ←/Esc
- في الوضع الأفقي تُترك دلالة ←/→ لكل عنوان على حدة، ولا تعترض الحاوية الجذرية مفاتيح الأسهم

::: tip اختلافات المنصات (الفروق عن نسخة Vue3)
- **الوضع العمودي والأكورديون متاحان على كل المنصات**: الوضع العمودي (بما فيه توسيع القوائم الفرعية داخل السطر، والأكورديون، والتحكّم عبر v-model / openeds) مطبّق بـ CSS خالص وprovide/inject، ويتصرّف بشكل متطابق في H5 وبرنامج WeChat المصغر.
- **التمرير الأفقي**: حين يتجاوز العرض الكلي لعناصر الوضع الأفقي الحاوية، يتولّى `overflow-x` الخاص بالحاوية نفسها التمرير (تدعم عناصر view التمرير بالفيض تحت WXSS)، دون لفّ المحتوى في `scroll-view` — فهذا الأخير في H5 يلفّ محتوى slot داخل طبقة `uni-scroll-view-content` داخلية فيكسر بنية flex لأبناء share scss المباشرين (على خلاف رأس lh-tabs الأفقي، فإن عناصر القائمة هي flex على مستوى الكتلة ولا يمكنها اللجوء إلى inline-flex كما تفعل علامات التبويب).
- **القوائم المنبثقة عبر root-portal**: لوحات الانبثاق في الوضع الأفقي / المطوي تستبدل `<teleport to="body">` الخاص بـ plus بـ `lh-root-portal` (مع احتياطي `fixed` داخل الصفحة للإصدارات القديمة من المكتبة الأساسية)؛ ويمر التموضع بقياس غير متزامن على إطارَين (تُرسم مخفية للقياس → يتموضع `computePosition` → تُعرَض، لتفادي الوميض)؛ حساب التموضع غير متزامن، فلا يُفترَض الحصول على النتيجة بصورة متزامنة؛ والمستويات المتداخلة تنبثق من اليمين (`right-start`).
- **مرور المؤشر في H5 فقط**: توسيع العنوان عند مرور المؤشر يعمل في H5 فقط؛ وليس لبرنامج WeChat المصغر دلالة hover، فيُكتفى بفتح لوحات الانبثاق وإغلاقها عبر النقر على العنوان، بينما يلتقط النقر خارج اللوحة قناع شفّاف داخل الصفحة (يكافئ دلالة الطيّ عبر mouseleave في plus).
- **التنقل بلوحة المفاتيح في H5 فقط**: لا تعمل ↑/↓ / Home / End / Enter / Space / ←/→ / Esc إلا في H5؛ وليس لبرنامج WeChat المصغر أحداث لوحة مفاتيح، فيُقصّ هذا المقطع كله بالترجمة الشرطية (لا يحتوي حزمة MP على كود ميت).
- **لا توجد حركة دخول وخروج**: يستخدم plus حركة `Transition` وهي غير موثوقة في MP، لذا —كما في tooltip / select— لا تُربط أي حركة؛ وحركة توسيع اللوحة داخل السطر هي CSS خالص (grid-template-rows 0fr/1fr) دون الاستماع إلى transitionend (غير موثوق في MP)؛ حتى حين لا يدعم MP الحركة، تظل الحالة النهائية صحيحة.
:::
