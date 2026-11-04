# Grid（شبكة）

تخطيط شبكي من 24 عمودًا: يُقرن `lh-row` مع `lh-col`（مع easycom يمكنك كتابة الوسوم مباشرة؛ عند الاستيراد عند الطلب تكون أسماء المكوّنات `LhRow` / `LhCol`）. يقوم على CSS Grid: حيث تتعرّض `span` / `offset` / `push` / `pull` مباشرةً إلى تموضع `grid-column`، بينما تأتي أسماء الأصناف وخوارزمية التموضع بالكامل من دوال نقية في نواة `@lh-ui/share`.

## التخطيط الأساسي

```vue
<template>
  <lh-row>
    <lh-col :span="12"><view class="cell">12</view></lh-col>
    <lh-col :span="12"><view class="cell">12</view></lh-col>
  </lh-row>
</template>
```

## التباعد بين الأعمدة (gutter)

يقبل `gutter` قيمة `number`（أفقي فقط）أو مصفوفة `[أفقي، عمودي]`؛ ويستخدم Row هامشًا سلبيًا لإلغاء الحشو الداخلي للأعمدة.

```vue
<template>
  <lh-row :gutter="16">
    <lh-col :span="8"><view class="cell">8</view></lh-col>
    <lh-col :span="8"><view class="cell">8</view></lh-col>
    <lh-col :span="8"><view class="cell">8</view></lh-col>
  </lh-row>
  <lh-row :gutter="[16, 24]">
    <lh-col :span="12"><view class="cell">12</view></lh-col>
    <lh-col :span="12"><view class="cell">12</view></lh-col>
  </lh-row>
</template>
```

## المحور الرئيسي justify / المحور المتعامد align

يتمتم تعيين `center` الخاص بـ`justify` و`middle` الخاص بـ`align` إلى صنفَين معدِّلَين مستقلَين（لا يتعارض المحوران）；ويمثل `align='center'` اسمًا مستعارًا للتوافق مع `middle`.

```vue
<template>
  <lh-row justify="center" align="middle">
    <lh-col :span="6"><view class="cell">6</view></lh-col>
    <lh-col :span="6"><view class="cell">6</view></lh-col>
  </lh-row>
</template>
```

## الإزاحة والإزاحة الجانبية

- `offset`：إزاحة البداية بمقدار N عمودًا إلى اليمين（بداية صريحة `offset + 1`）
- `push` / `pull`：نقل البداية يمينًا / يسارًا فوق أساس offset

```vue
<template>
  <lh-row>
    <lh-col :span="6" :offset="6"><view class="cell">6 / offset 6</view></lh-col>
    <lh-col :span="9" :push="6"><view class="cell">9 / push 6</view></lh-col>
  </lh-row>
</template>
```

## نقاط القطع الاستجابية

تعمل `xs` / `sm` / `md` / `lg` / `xl` عند `<640 / ≥640 / ≥768 / ≥1024 / ≥1280px` على التوالي، وعند عدم التصريح بها تتراجع إلى أقرب مستوى مُعرَّف（ويبقى `xs` الملاذ الأخير）. ويمكن أيضًا التصريح بها دفعة واحدة عبر `sizes`.

```vue
<template>
  <lh-row>
    <lh-col :xs="24" :sm="12" :md="8" :lg="6">
      <view class="cell">xs=24 sm=12 md=8 lg=6</view>
    </lh-col>
  </lh-row>
</template>
```

## خصائص Row

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| gutter | التباعد بين الأعمدة（px، أو `[أفقي، عمودي]`） | `number \| [number, number]` | `0` |
| justify | الترتيب على المحور الرئيسي | `'start' \| 'center' \| 'end' \| 'space-between' \| 'space-around'` | `'start'` |
| align | المحاذاة على المحور المتعامد | `'top' \| 'middle' \| 'bottom'` | `'top'` |
| wrap | السماح بالتفاف الأسطر | `boolean` | `true` |
| customClass | صنف مخصص（يُمرَّر إلى العقدة الجذرية） | `string` | — |
| sx | خصائص التخطيط المختصرة sx | `LhSxProps` | — |

## خصائص Col

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| span | عدد الأعمدة المشغولة（شبكة 24 عمودًا） | `number` | — |
| offset | أعمدة الإزاحة الابتدائية | `number` | — |
| push | أعمدة الإزاحة يمينًا | `number` | — |
| pull | أعمدة الإزاحة يسارًا | `number` | — |
| xs / sm / md / lg / xl | الحجم عند كل نقطة قطع（`number` أو `{ span, offset }`） | `LhColSize` | — |
| sizes | تصريح دفعة واحدة حسب نقطة القطع（يكافئ xs–xl، استخدم أيهما） | `LhBreakpointSizes` | — |
| customClass | صنف مخصص（يُمرَّر إلى العقدة الجذرية） | `string` | — |
| sx | خصائص التخطيط المختصرة sx | `LhSxProps` | — |

## Slots

| Slot | الوصف |
| --- | --- |
| default | محتوى الشبكة（يوفر كلٌّ من Row و Col الفتحة الافتراضية） |

## الفروقات بين المنصات

- **مكوّن تخطيط نقي**：بلا طبقات عائمة ولا قياسات ولا اعتماد على document؛ ويتطابق سلوكه بين H5 وبرنامج WeChat المصغّر.
- **مصدر نقاط القطع**：يستمع H5 إلى `matchMedia`، غير أن **برنامج WeChat المصغّر لا يدعم matchMedia**، فينخفض دائمًا إلى مستوى `xs`（تبقى قواعد التراجع كما هي من نواة share عبر `resolveResponsiveSize`، إلا أن نقطة القطع الحالية تثبت على `xs`）. إذا احتاج البرنامج المصغّر إلى تقسيم حسب عرض الشاشة، فأوصل `uni.getSystemInfoSync().windowWidth` إلى واجهة الحقن التي يوفّرها `useLhBreakpoint`، أو ثبّت تخطيطًا واحدًا للبرنامج المصغّر.
- **استبدال الوسوم**：تصبح `<div>` الخاصة بـ plus `<view>`（يحظر WXSS محددات الوسوم، وتُطبَّق الأنماط عبر أصناف `lh-row*` / `lh-col*`）.
- **تموضع `grid-column`**：يستخدم `span` البسيط وضع التموضع التلقائي（`span N`），وعند وجود `offset` / `push` / `pull` تُحدَّد نقطة البداية صراحةً وتُقصَّ داخل نظام 24 عمودًا كي لا تكسر التراكيب خارج النطاق الحاوي.

::: tip الفروقات عن إصدار Vue 3
- يتطابق هيكل المكوّنات وواجهة props وأسماء الأصناف وخوارزمية التموضع تمامًا مع plus（نواة share نفسها）.
- تتبع وسوم المكوّنات الفرعية اصطلاح easycom：`lh-row` / `lh-col`（وعند الاستيراد عند الطلب `LhRow` / `LhCol`）.
- أُضيفت خاصية `customClass`：لا تستطيع الأصناف المخصصة في uni-app اختراق `styleIsolation`، فيتم تمريرها عبر الخاصية（بينما يمّر plus الأصناف مباشرة）.
:::
