# Dropdown (قائمة منسدلة)

قائمة أوامر تنبثق نحو الأسفل. يمكن أن يكون المُشغّل أي عنصر، وتُعرَّف عناصر القائمة بـ `command` وتُبلَّغ عبر حدث `command` عند النقر.

## الاستخدام الأساسي

```vue
<template>
  <lh-dropdown @command="onCommand">
    <lh-button>{{ selectedLabel || 'إجراءات إضافية' }} ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="new">جديد</lh-dropdown-item>
      <lh-dropdown-item command="edit">تحرير</lh-dropdown-item>
      <lh-dropdown-item command="delete">حذف</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const lastCommand = ref('')
// نص المُشغّل يديره المستهلك: حدث command يُرسل قيمة الأمر فقط،
// وتحديد التسمية التي تُعرض يعود للخارج
const labelMap: Record<string, string> = { new: 'جديد', edit: 'تحرير', delete: 'حذف' }
const selectedLabel = ref('')
function onCommand(command: string | number | undefined) {
  lastCommand.value = String(command)
  selectedLabel.value = labelMap[String(command)] ?? String(command)
}
</script>
```

## طرق التشغيل

الافتراضي هو `click`، ويمكن أيضًا استخدام التحويم والضغط المطوّل.

```vue
<template>
  <!-- تشغيل بالتحويم (H5 فقط؛ يتراجع إلى التبديل بالنقر في التطبيق المصغر) -->
  <lh-dropdown trigger="hover" @command="onHoverCommand">
    <lh-button>تشغيل بالتحويم ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="ink">حبر</lh-dropdown-item>
      <lh-dropdown-item command="danqing">تصوير</lh-dropdown-item>
    </template>
  </lh-dropdown>

  <!-- تشغيل بالنقر الأيمن / الضغط المطوّل -->
  <lh-dropdown trigger="contextmenu" @command="onContextCommand">
    <lh-button>تشغيل بالضغط المطوّل ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="refresh">تحديث</lh-dropdown-item>
      <lh-dropdown-item command="copy">نسخ</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>
```

## العناصر المعطّلة والفواصل

```vue
<template>
  <!-- قائمة إجراءات مع عناصر معطّلة وفواصل -->
  <lh-dropdown @command="onActionCommand">
    <lh-button>إجراءات ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="export">تصدير</lh-dropdown-item>
      <lh-dropdown-item command="import">استيراد</lh-dropdown-item>
      <lh-dropdown-item divided command="audit">سجل التدقيق</lh-dropdown-item>
      <lh-dropdown-item disabled command="purge">مسح البيانات</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>
```

> العناصر المعطّلة تحمل `aria-disabled="true"` بحيث تستطيع قارئات الشاشة الإعلان عنها؛ لكن مفاتيح الأسهم تتخطاها، والنقر أو Enter/Space لا يُطلقان `command`.

## الموضع والارتفاع الأقصى

```vue
<template>
  <!-- محاذاة لأسفل اليمين مع حد أقصى للارتفاع (تمرير عند التجاوز) -->
  <lh-dropdown placement="bottom-end" :max-height="160" @command="onItemCommand">
    <lh-button>أسفل اليمين ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item v-for="i in 12" :key="i" :command="i">العنصر {{ i }}</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>
```

## التحكم بالظهور وسلوك النقر

يتحكم `v-model:visible` بالظهور يدويًا؛ ويحدد `hide-on-click` ما إذا كانت القائمة تُغلق بعد الاختيار؛ ويضيف `popper-class` صنفًا مخصصًا للطبقة.

```vue
<template>
  <!-- ظهور متحكم به: لا يُغلق بعد الاختيار -->
  <lh-dropdown v-model:visible="menuVisible" :hide-on-click="false" popper-class="demo-menu">
    <lh-button>{{ menuVisible ? 'طي' : 'توسيع' }} ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="copy">نسخ (لا يُغلق)</lh-dropdown-item>
      <lh-dropdown-item command="paste">لصق</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const menuVisible = ref(false)
</script>
```

## Dropdown API

### Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| trigger | طريقة التشغيل: `click` (كل الأهداف) / `hover` (H5 فقط، يتراجع إلى النقر في MP) / `contextmenu` (بالضغط المطوّل) | `'hover' \| 'click' \| 'contextmenu'` | `'click'` |
| placement | موضع الطبقة (12 موضعًا) | `LhDropdownPlacement` | `'bottom-start'` |
| visible | حالة الظهور (v-model:visible) | `boolean` | — |
| disabled | تعطيل المُشغّل | `boolean` | `false` |
| hideOnClick | الإغلاق بعد النقر على عنصر في القائمة | `boolean` | `true` |
| popperClass | صنف مخصص للطبقة | `string` | — |
| maxHeight | أقصى ارتفاع للقائمة (الأرقام بالبكسل) | `string \| number` | — |
| themeVars | متغيرات السمة على مستوى المكوّن | `Record<string, string>` | — |
| bgPattern | نمط الخلفية على مستوى المكوّن، يتجاوز ConfigProvider | `string` | — |
| sx | خصائص التخطيط السريع (تُطبق على جذر المُشغّل) | `LhSxProps` | — |

### Events

| الحدث | الوصف | المعاملات |
| --- | --- | --- |
| command | يُطلق عند النقر على عنصر في القائمة | `(command: string \| number \| undefined)` |
| visible-change | تغيّر الظهور | `(value: boolean)` |
| update:visible | تغيّر الظهور (v-model) | `(value: boolean)` |

### Slots

| الفتحة | الوصف |
| --- | --- |
| default | محتوى المُشغّل |
| dropdown | محتوى القائمة (قائمة `LhDropdownItem`) |

### Methods

| الطريقة | الوصف |
| --- | --- |
| show | فتح برمجيًا |
| hide | إغلاق برمجيًا |
| toggle | تبديل برمجيًا |

## DropdownItem API

### Props

| الخاصية | الوصف | النوع | الافتراضي |
| --- | --- | --- | --- |
| command | مُعرّف الأمر، يُرسل مع حدث `command` عند النقر | `string \| number` | — |
| disabled | معطّل | `boolean` | `false` |
| divided | إظهار فاصل أعلى العنصر | `boolean` | `false` |

### Events

| الحدث | الوصف | المعاملات |
| --- | --- | --- |
| click | يُطلق عند النقر على العنصر (لا يُطلق للمعطّل) | `(command: string \| number \| undefined)` |

### إمكانية الوصول

- يحمل المُشغّل `aria-haspopup="menu"` بالإضافة إلى `aria-expanded` / `aria-controls`؛ القائمة هي `role="menu"` والعناصر `role="menuitem"`
- لوحة المفاتيح تتبع نمط قائمة APG (H5 فقط): ↑/↓ للتنقل الدوري (مع تخطي المعطّل)، Home/End للطرفين، Enter/Space لإطلاق `command` والإغلاق، Esc للإغلاق وإعادة التركيز
- عند الفتح، تجاوز المحور الرئيسي ينعكس تلقائيًا وتجاوز المحور المتقاطع يُرجَع إلى حدود viewport

::: tip فروق المنصة (الفروق عن نسخة Vue3)
- **طرق التشغيل**: لا يحتوي التطبيق المصغر على دلالة hover، لذا يتراجع `trigger="hover"` إلى التبديل بالنقر / اللمس في MP؛ ولا يوجد نقر أيمن، لذا يُنفَّذ `trigger="contextmenu"` بالضغط المطوّل (`longpress`) في كلا الهدفين (بما في ذلك H5، دون منع قائمة السياق الأصلية — plus يستدعي `preventDefault`).
- **حامل الطبقة وتحديد الموضع**: لا توجد خاصية `teleportTarget` — لا يوجد DOM teleport في التطبيق المصغر، فتحمل `root-portal` الطبقة (مع بديل fixed داخل الصفحة في الإصدارات الأقدم)؛ ويتم تحديد الموضع بقياس غير متزامن من إطارين (الرسم مخفيًا للقياس → `computePosition` → العرض، لمنع الوميض)، والحساب غير متزامن فلا تفترض نتيجة متزامنة.
- **التنقل بلوحة المفاتيح في H5 فقط**: الأسهم / Home / End / Enter / Space / Esc تعمل في H5 فقط (Esc عبر مستمع على مستوى المستند ويغلق الطبقة العليا فقط عند تراكب عدة طبقات)؛ لا أحداث لوحة مفاتيح في التطبيق المصغر ويُحذف الجزء كله بالتجميع الشرطي.
- **الإغلاق عند النقر خارجه** يحمله قناع شفاف داخل الصفحة (مكافئ لمستمع click-outside على مستوى document في plus).
- **لا انتقال للفتح والإغلاق**: يحرّك plus الأنيميشن بـ `Transition`؛ و`Transition` غير موثوق في MP، وكما في tooltip / select لا يُربط أي انتقال.
- **لا إغلاق تلقائي إذا خرج المُشغّل من viewport**: لدى `useLhPopper` في plus رد نداء scroll-out؛ ولا يوجد في uni-app قناة موحّدة لمراقبة التمرير / تغيّر الحجم، فلم يُنقل.
:::
