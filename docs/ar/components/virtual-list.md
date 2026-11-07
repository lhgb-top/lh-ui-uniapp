# VirtualList القائمة الافتراضية

يُعرض فقط النافذة المرئية حتى مع عشرات الآلاف من الصفوف. حساب نطاق الارتفاع
الثابت (`computeVirtualRange`) ومنطق الارتفاع الديناميكي
(`buildVirtualItems` / `findVirtualRange`) يأتي بالكامل من الدوال النقية في
نواة `@lh-ui/share`، بينما تتولى طبقة المكوّن قيادة التمرير وقياس إطار
العرض فقط.

## اختلافات المنصة

- **H5**: تُعرض الحاوية كـ `view` (`overflow: auto`)، ويُقاس ارتفاع إطار
  العرض عبر `clientHeight` + `ResizeObserver`.
- **برنامج WeChat المصغّر**: تُعرض الحاوية كـ `scroll-view` (`scroll-y`)،
  ويأخذ حدث التمرير `detail.scrollTop`، ويُقاس ارتفاع إطار العرض عبر
  `createSelectorQuery` (لا يوجد `ResizeObserver` في MP).
- **الارتفاع الديناميكي**: `itemSize` عقد دالة تصريحية (يُعيد مُستدعيها ارتفاع
  كل عنصر). وهو يعمل بالتساوي على كلا الطرفين ولا يعتمد على APIs قياس
  غير متوفرة في MP.

## الاستخدام الأساسي (الارتفاع الثابت)

```vue
<template>
  <lh-virtual-list :data="items" :height="360" :item-height="48">
    <template #default="{ item, index }">
      <view class="my-item">الصف {{ index + 1 }}: {{ item.label }}</view>
    </template>
  </lh-virtual-list>
</template>

<script setup lang="ts">
const items = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  label: `عنصر ${i + 1}`,
}))
</script>
```

يُعيّن `height` ارتفاع الحاوية، بينما `item-height` هو ارتفاع العنصر في وضع
الارتفاع الثابت (يجب أن يطابق ارتفاع العنصر الفعلي). خارج النافذة المرئية
يُحتفظ فقط بعناصر احتياطية خارج النافذة بمقدار `overscan` (افتراضي 2) شاشة.

## الارتفاع الديناميكي

```vue
<template>
  <lh-virtual-list :data="items" :height="360" :item-size="sizeOf">
    <template #default="{ item, index }">
      <view class="my-item" :style="{ height: `${sizeOf(index)}px` }">
        الصف {{ index + 1 }}: {{ item.label }}
      </view>
    </template>
  </lh-virtual-list>
</template>

<script setup lang="ts">
// itemSize دالة تصريحية: تُعيد ارتفاع كل عنصر، بالتساوي على كلا الطرفين
function sizeOf(index: number): number {
  return 48 + (index % 5) * 24
}
</script>
```

يُستخدم `item-height` أو `item-size` لا كلاهما: تمرير `itemSize` يفعّل وضع
الارتفاع الديناميكي (يُحسب إزاحة كل عنصر مسبقًا ويُوجد النطاق المرئي عبر
البحث الثنائي).

## API

### Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| data | مصدر البيانات (يتولّى slot الـ default عرض العناصر) | `any[]` | `[]` |
| height | ارتفاع الحاوية (الرقم يعني px) | `number \| string` | `300` |
| itemHeight | ارتفاع العنصر في وضع الارتفاع الثابت | `number` | `-` |
| itemSize | وضع الارتفاع الديناميكي: يُعيد ارتفاع كل عنصر | `(index: number) => number` | `-` |
| overscan | عدد عناصر المسح الزائد (العناصر الاحتياطية خارج النافذة المرئية) | `number` | `2` |
| sx | خصائص التخطيط السريع sx | `LhSxProps` | `-` |

### Slots

| الفتحة | الوصف | معاملات النطاق |
| --- | --- | --- |
| default | عرض العناصر | `{ item, index }` |
